/**
 * Pre-generate the 5 AI explanation MODES for every question and store them in
 * `question_explanations` (one row per question × mode). The runner then reads
 * these stored texts, so clicking "Explique autrement / Étapes / Cours /
 * Erreurs / Méthode" returns the SAME answer every time (no live variation).
 *
 *   npm run generate:modes            # fill missing modes for all questions
 *   npm run generate:modes -- <exam_id>   # only that exam's questions
 *
 * Uses the Supabase SECRET key (bypasses RLS) — SERVER/CLI ONLY.
 * The live /api/explain endpoint stays, but only for free-typed follow-ups.
 */
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SECRET = process.env.SUPABASE_SECRET_KEY;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.EXPLAIN_MODEL || "claude-haiku-4-5-20251001";

if (!SUPABASE_URL || !SUPABASE_SECRET || !ANTHROPIC_KEY) {
  console.error("❌ Variables manquantes (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, ANTHROPIC_API_KEY).");
  process.exit(1);
}

const examId = process.argv[2] || null;
const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET);
const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });

// The 5 modes — MUST match src/app/api/explain/route.ts and the runner buttons.
const MODES = {
  autrement: "Explique la bonne réponse AUTREMENT : plus simplement, avec une autre approche ou une image mentale.",
  etapes: "Détaille la solution ÉTAPE PAR ÉTAPE, clairement et sans sauter d'étape.",
  cours: "Rappelle le COURS et les formules/théorèmes indispensables pour cette question.",
  erreurs: "Explique les ERREURS FRÉQUENTES sur ce type de question (et, s'il y a des options, pourquoi les autres sont fausses).",
  methode: "Donne la MÉTHODE GÉNÉRALE, réutilisable, pour résoudre ce type de question.",
};

let q = supabase
  .from("questions")
  .select("id, statement, exercise_id, answer_options(label,is_correct,position), solutions(body), question_explanations(mode)");
if (examId) {
  const { data: exs } = await supabase.from("exercises").select("id").eq("exam_id", examId);
  const ids = (exs ?? []).map((e) => e.id);
  if (ids.length === 0) { console.error("Aucun exercice pour cet examen."); process.exit(1); }
  q = q.in("exercise_id", ids);
}
const { data: questions, error } = await q;
if (error) { console.error("❌ Lecture questions:", error.message); process.exit(1); }

console.log(`${questions?.length ?? 0} question(s) à traiter${examId ? " (examen ciblé)" : ""}.`);

let made = 0, skipped = 0;
for (const question of questions ?? []) {
  const have = new Set((question.question_explanations ?? []).map((r) => r.mode));
  const opts = (question.answer_options ?? []).slice().sort((a, b) => a.position - b.position);
  const optText = opts.length
    ? "\nOptions :\n" + opts.map((o, i) => `${String.fromCharCode(65 + i)}. ${o.label}${o.is_correct ? "  ← correcte" : ""}`).join("\n")
    : "";
  const ref = question.solutions?.[0]?.body ? `\nCorrection de référence :\n"${question.solutions[0].body}"` : "";

  for (const [mode, instruction] of Object.entries(MODES)) {
    if (have.has(mode)) { skipped++; continue; }
    const prompt = `Question d'examen du BAC marocain (Sciences Mathématiques).

Question :
${question.statement}
${optText}${ref}

${instruction}
Réponds en français clair et pédagogique, comme un professeur bienveillant. Concis (4 à 7 lignes). Utilise la notation LaTeX entre $...$ pour les maths.`;

    try {
      const res = await anthropic.messages.create({ model: MODEL, max_tokens: 600, messages: [{ role: "user", content: prompt }] });
      const body = res.content.filter((b) => b.type === "text").map((b) => b.text).join("").trim();
      const { error: insErr } = await supabase
        .from("question_explanations")
        .upsert({ question_id: question.id, mode, body, author: "hsgenius" }, { onConflict: "question_id,mode" });
      if (insErr) console.error(`  ✗ ${question.id} [${mode}]:`, insErr.message);
      else { made++; }
    } catch (e) {
      console.error(`  ✗ IA ${question.id} [${mode}]:`, e.message);
    }
    await new Promise((r) => setTimeout(r, 250)); // gentle rate limiting
  }
  process.stdout.write(`  ✓ ${question.statement.slice(0, 50)}…\n`);
}

console.log(`\nTerminé — ${made} explication(s) générée(s), ${skipped} déjà présente(s).`);
console.log("Astuce : relis/édite dans Supabase → Table Editor → question_explanations avant la mise en ligne.");
