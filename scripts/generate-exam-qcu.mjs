/**
 * Turn official BAC exam PDFs into QCU exam sessions in the DB — in bulk.
 *
 * For each paper it reads the official SUJET (questions + barème) and, when
 * available, the CORRIGÉ (correct answers), then asks Claude to emit a
 * single-choice (QCU) structured version: exercises → sub-questions with
 * barème, 4 options (exactly one correct, taken from the corrigé), and a SHORT
 * ORIGINAL correction (not a copy of the source's wording). It inserts:
 *   exams(national) → exercises → questions(kind='mcq', points) → answer_options
 *   + solutions(author='hsgenius', body=correction)
 *
 * The heavy generation runs on YOUR Anthropic key (cheap per paper), not in chat.
 * Review the rows in Supabase → Table Editor before publishing.
 *
 *   node --env-file=.env.local scripts/generate-exam-qcu.mjs <folder> [--dry] [--limit N] [--level 2bac]
 *
 * <folder> is scanned recursively for *.pdf. Sujets and corrigés are matched by
 * (subject, filière, year, session) parsed from the filename. Idempotent: a
 * paper already having exercises is skipped.
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, ANTHROPIC_API_KEY,
 *      EXAM_MODEL (optional; default a Haiku — set a Sonnet for best accuracy).
 */
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, basename } from "node:path";

const { NEXT_PUBLIC_SUPABASE_URL: URL, SUPABASE_SECRET_KEY: SECRET, ANTHROPIC_API_KEY: KEY } = process.env;
const MODEL = process.env.EXAM_MODEL || "claude-haiku-4-5-20251001";
if (!URL || !SECRET || !KEY) { console.error("❌ Env manquantes (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, ANTHROPIC_API_KEY)."); process.exit(1); }

const args = process.argv.slice(2);
const root = args.find((a) => !a.startsWith("--"));
const DRY = args.includes("--dry");
const LEVEL = (args[args.indexOf("--level") + 1] && !args[args.indexOf("--level") + 1].startsWith("--")) ? args[args.indexOf("--level") + 1] : "2bac";
const LIMIT = args.includes("--limit") ? Number(args[args.indexOf("--limit") + 1]) : Infinity;
const ONLY_SUBJ = args.includes("--subject") ? args[args.indexOf("--subject") + 1] : null; // e.g. maths
const ONLY_FIL = args.includes("--filiere") ? args[args.indexOf("--filiere") + 1] : null;   // e.g. sm / pc / svt
if (!root) { console.error("Usage: node scripts/generate-exam-qcu.mjs <folder> [--subject maths] [--filiere sm] [--dry] [--limit N] [--level 2bac]"); process.exit(1); }

const supabase = createClient(URL, SECRET);
const anthropic = new Anthropic({ apiKey: KEY });

// --- filename → metadata ------------------------------------------------------
const SUBJ = { maths: "maths", math: "maths", "physique-chimie": "pc", physique: "pc", pc: "pc",
  svt: "svt", "sciences-ingenieur": "si", "sciences-ingénieur": "si", si: "si",
  anglais: "anglais", philosophie: "philo", philo: "philo" };
const FIL2TRACK = { sm: "sm_a", smb: "sm_b", pc: "pc", svt: "svt", eco: "eco", commun: null };

function parseName(fn) {
  const s = fn.toLowerCase().replace(/\.pdf$/, "").replace(/^copy of /, "");
  const kind = /(corrig|corrige)/.test(s) ? "corrige" : "sujet";
  const year = (s.match(/(20\d{2})/) || [])[1];
  const session = /rattrap/.test(s) ? "rattrapage" : /normale|ordinaire/.test(s) ? "normale" : null;
  const fil = (s.match(/-(smb|sm|pc|svt|eco|commun)-/) || s.match(/\b(smb|sm|pc|svt|eco)\b/) || [])[1] || null;
  let subj = null;
  for (const k of Object.keys(SUBJ).sort((a, b) => b.length - a.length)) if (s.includes(k)) { subj = SUBJ[k]; break; }
  return (year && session && subj && fil) ? { subj, fil, year: Number(year), session, kind } : null;
}

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e.toLowerCase().endsWith(".pdf")) out.push(p);
  }
  return out;
}

// --- structured-output tool ---------------------------------------------------
const TOOL = {
  name: "save_exam",
  description: "Enregistre la version QCU structurée de l'examen.",
  input_schema: {
    type: "object",
    properties: {
      exercises: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: { type: "string", description: "ex: 'Exercice 1 — Analyse'" },
            statement: { type: "string", description: "énoncé/contexte commun de l'exercice (peut être vide)" },
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  statement: { type: "string" },
                  points: { type: "number", description: "barème de la sous-question (depuis le sujet)" },
                  correction: { type: "string", description: "correction CONCISE et ORIGINALE (ne pas recopier le corrigé source), LaTeX entre $...$" },
                  options: {
                    type: "array",
                    items: { type: "object", properties: { label: { type: "string" }, correct: { type: "boolean" } }, required: ["label", "correct"] },
                    minItems: 4, maxItems: 4,
                  },
                },
                required: ["statement", "points", "options", "correction"],
              },
            },
          },
          required: ["title", "questions"],
        },
      },
    },
    required: ["exercises"],
  },
};

const pdfBlock = (path) => ({ type: "document", source: { type: "base64", media_type: "application/pdf", data: readFileSync(path).toString("base64") } });

async function extract(sujetPath, corrigePath) {
  const content = [pdfBlock(sujetPath)];
  if (corrigePath) content.push(pdfBlock(corrigePath));
  content.push({
    type: "text",
    text: `Le 1er PDF est le SUJET officiel (avec le barème dans la marge). ${corrigePath ? "Le 2e PDF est le CORRIGÉ (réponses correctes)." : ""}
Construis une version QCU (choix unique) COMPLÈTE de cet examen :
- couvre TOUS les exercices et TOUTES les parties (I, II, III…) du sujet, du début à la fin — ne t'arrête pas après le premier exercice. Le barème TOTAL doit être proche de 20.
- une entrée par EXERCICE, puis CHAQUE sous-question dans l'ordre, avec son barème exact (points) tel qu'imprimé dans la marge du sujet ;
- pour chaque sous-question : exactement 4 options dont UNE SEULE correcte. L'option correcte est le RÉSULTAT/CONCLUSION exact ${corrigePath ? "lu dans le corrigé" : "que tu établis"} ; les 3 autres sont des erreurs plausibles ;
- une "correction" COURTE (2–4 lignes), pédagogique et RÉDIGÉE DE TES PROPRES MOTS (ne recopie pas le corrigé) ;
- notation mathématique en LaTeX entre $...$. Garde les options et corrections concises pour tout faire tenir.
Appelle l'outil save_exam UNE SEULE FOIS avec l'examen entier (tous les exercices, toutes les sous-questions).`,
  });
  const res = await anthropic.messages.create({
    model: MODEL, max_tokens: 16000, tools: [TOOL], tool_choice: { type: "tool", name: "save_exam" },
    messages: [{ role: "user", content }],
  });
  const tu = res.content.find((b) => b.type === "tool_use");
  return tu ? tu.input : null;
}

// --- DB helpers ---------------------------------------------------------------
async function idMaps() {
  const [{ data: subs }, { data: trks }, { data: lvls }, { data: es }] = await Promise.all([
    supabase.from("subjects").select("id, code"),
    supabase.from("tracks").select("id, code"),
    supabase.from("levels").select("id, code"),
    supabase.from("education_systems").select("id").limit(1),
  ]);
  const m = (rows) => Object.fromEntries((rows ?? []).map((r) => [r.code, r.id]));
  return { subj: m(subs), track: m(trks), level: m(lvls), es: es?.[0]?.id ?? null };
}

function validate(data) {
  if (!data?.exercises?.length) return "aucun exercice";
  let total = 0, nq = 0;
  for (const x of data.exercises)
    for (const q of x.questions ?? []) {
      nq++;
      const c = (q.options ?? []).filter((o) => o.correct).length;
      if (c !== 1) return `question "${(q.statement || "").slice(0, 40)}…" a ${c} bonne(s) réponse(s)`;
      if (typeof q.points !== "number") return "barème manquant";
      total += q.points;
    }
  // guard against truncated / partial extractions polluting the DB
  if (total < 10) return `extraction incomplète (barème ${total} < 10, ${nq} q) — réessaie avec EXAM_MODEL=claude-sonnet-4-5`;
  return null;
}

async function insertExam(meta, ids, data) {
  const subject_id = ids.subj[meta.subj], track_id = ids.track[FIL2TRACK[meta.fil] ?? ""] ?? null, level_id = ids.level[LEVEL];
  if (!subject_id || !level_id) return `ids introuvables (subj=${meta.subj}, level=${LEVEL})`;
  // idempotency
  const { data: ex0 } = await supabase.from("exams").select("id")
    .eq("subject_id", subject_id).eq("year", meta.year).eq("session", meta.session).eq("exam_type", "national").maybeSingle();
  let examId = ex0?.id;
  if (examId) {
    const { count } = await supabase.from("exercises").select("id", { count: "exact", head: true }).eq("exam_id", examId);
    if ((count ?? 0) > 0) return "déjà structuré (ignoré)";
  } else {
    const { data: e, error } = await supabase.from("exams").insert({
      education_system_id: ids.es, level_id, track_id, subject_id, exam_type: "national",
      session: meta.session, year: meta.year, title: `${meta.subj.toUpperCase()} — ${meta.fil.toUpperCase()}`, duration_minutes: 240,
    }).select("id").single();
    if (error) return error.message; examId = e.id;
  }
  let pos = 1;
  for (const x of data.exercises) {
    const { data: exr, error: xe } = await supabase.from("exercises").insert({
      subject_id, exam_id: examId, source: "official_exam", title: x.title || `Exercice ${pos}`, statement: x.statement || null, position: pos++,
    }).select("id").single();
    if (xe) return xe.message;
    let qp = 1;
    for (const q of x.questions) {
      const { data: qr, error: qe } = await supabase.from("questions").insert({
        exercise_id: exr.id, kind: "mcq", statement: q.statement, points: q.points, position: qp++,
      }).select("id").single();
      if (qe) return qe.message;
      await supabase.from("answer_options").insert((q.options).map((o, i) => ({ question_id: qr.id, label: o.label, is_correct: !!o.correct, position: i + 1 })));
      if (q.correction) await supabase.from("solutions").insert({ question_id: qr.id, exercise_id: exr.id, author: "hsgenius", body: q.correction });
    }
  }
  const total = data.exercises.reduce((s, x) => s + x.questions.reduce((a, q) => a + (q.points || 0), 0), 0);
  return `OK — ${data.exercises.length} exos, ${data.exercises.reduce((a, x) => a + x.questions.length, 0)} questions, barème ${total}${Math.abs(total - 20) > 0.6 ? " ⚠️(≠20)" : ""}`;
}

// --- main ---------------------------------------------------------------------
const ids = await idMaps();
const files = walk(root).map((p) => ({ p, meta: parseName(basename(p)) }))
  .filter((f) => f.meta)
  .filter((f) => (!ONLY_SUBJ || f.meta.subj === ONLY_SUBJ) && (!ONLY_FIL || f.meta.fil === ONLY_FIL));
const papers = new Map();
for (const f of files) {
  const k = `${f.meta.subj}|${f.meta.fil}|${f.meta.year}|${f.meta.session}`;
  const e = papers.get(k) || { meta: f.meta };
  e[f.meta.kind] = f.p; papers.set(k, e);
}
console.log(`${files.length} PDF reconnu(s) → ${papers.size} examen(s).${DRY ? "  [DRY RUN]" : ""}`);

let done = 0, ok = 0;
for (const [k, e] of papers) {
  if (done >= LIMIT) break; done++;
  if (!e.sujet) { console.log(`  · ${k}: pas de sujet → ignoré`); continue; }
  process.stdout.write(`  · ${k} … `);
  try {
    if (DRY) { console.log(`sujet${e.corrige ? "+corrigé" : ""} prêt`); continue; }
    const data = await extract(e.sujet, e.corrige);
    const bad = validate(data);
    if (bad) { console.log(`⚠️ ${bad} — ignoré`); continue; }
    const msg = await insertExam(e.meta, ids, data);
    console.log(msg); if (msg.startsWith("OK")) ok++;
  } catch (err) { console.log(`✗ ${err.message}`); }
  await new Promise((r) => setTimeout(r, 400));
}
console.log(`\nTerminé — ${ok} examen(s) structuré(s). Relis-les dans Supabase → Table Editor avant publication.`);
