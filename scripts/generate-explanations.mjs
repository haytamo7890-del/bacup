/**
 * Pre-generate reviewed explanations for every QCM question that doesn't
 * have one yet, and store them in `solutions` (author = hsgenius).
 *
 * Run once (or after adding new questions):
 *   npm run generate:explanations
 *
 * Uses the Supabase SECRET key (bypasses RLS) — SERVER/CLI ONLY.
 * These stored explanations are shown instantly and for free to students.
 * (The live "Explique autrement" button stays for interactive follow-ups.)
 */
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SECRET = process.env.SUPABASE_SECRET_KEY;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

// Switch to "claude-sonnet-5" for higher-quality explanations (a bit pricier).
const MODEL = "claude-haiku-4-5-20251001";

if (!SUPABASE_URL || !SUPABASE_SECRET || !ANTHROPIC_KEY) {
  console.error("❌ Variables manquantes. Lance avec: npm run generate:explanations");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET);
const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });

const { data: questions, error } = await supabase
  .from("questions")
  .select("id, statement, answer_options(label,is_correct,position), solutions(id)");

if (error) {
  console.error("❌ Lecture des questions:", error.message);
  process.exit(1);
}

const todo = (questions ?? []).filter(
  (q) => !q.solutions || q.solutions.length === 0
);

console.log(`${todo.length} question(s) à expliquer (sur ${questions?.length ?? 0}).`);

let ok = 0;
for (const q of todo) {
  const opts = (q.answer_options ?? []).slice().sort((a, b) => a.position - b.position);
  const optText = opts
    .map((o, i) => `${String.fromCharCode(65 + i)}. ${o.label}${o.is_correct ? "  ← correcte" : ""}`)
    .join("\n");

  const prompt = `Question à choix multiple du BAC marocain :

${q.statement}

Options :
${optText}

Rédige une explication de référence de la bonne réponse, étape par étape,
en français clair et pédagogique (4 à 6 lignes). Explique le RAISONNEMENT
qui mène à la bonne réponse — ne dis pas seulement "c'est l'option A".`;

  try {
    const res = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
    });
    const body = res.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    const { error: insErr } = await supabase
      .from("solutions")
      .insert({ question_id: q.id, author: "hsgenius", body });

    if (insErr) console.error(`  ✗ insert ${q.id}:`, insErr.message);
    else {
      ok++;
      console.log(`  ✓ ${q.statement.slice(0, 55)}…`);
    }
  } catch (e) {
    console.error(`  ✗ IA ${q.id}:`, e.message);
  }

  await new Promise((r) => setTimeout(r, 300)); // gentle rate limiting
}

console.log(`\nTerminé — ${ok}/${todo.length} explications générées et stockées.`);
console.log("Astuce : relis/édite-les dans Supabase → Table Editor → solutions avant la mise en ligne.");
