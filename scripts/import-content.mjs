/**
 * Import exam content (one JSON file) into the database.
 *   npm run import:content data/your-exam.json
 *
 * See data/_template.json for the format. Idempotent: re-running skips
 * questions that already exist (matched on exercise + statement).
 * Uses the Supabase SECRET key (bypasses RLS) — CLI only.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SECRET = process.env.SUPABASE_SECRET_KEY;
const ES_CODE = "ma_secondaire_qualifiant";

if (!URL || !SECRET) {
  console.error("❌ Variables Supabase manquantes. Lance via: npm run import:content <fichier.json>");
  process.exit(1);
}
const file = process.argv[2];
if (!file) {
  console.error("Usage: npm run import:content data/fichier.json");
  process.exit(1);
}

const supabase = createClient(URL, SECRET);
const data = JSON.parse(readFileSync(file, "utf8"));

async function getId(table, match) {
  const { data, error } = await supabase.from(table).select("id").match(match).limit(1).maybeSingle();
  if (error) throw error;
  return data?.id ?? null;
}
async function findOrInsert(table, match, insert) {
  const existing = await getId(table, match);
  if (existing) return existing;
  const { data, error } = await supabase.from(table).insert(insert).select("id").single();
  if (error) throw error;
  return data.id;
}

async function run() {
  const es = await getId("education_systems", { code: ES_CODE });
  if (!es) throw new Error("Système éducatif introuvable.");

  const subjectId = await getId("subjects", { code: data.subject, education_system_id: es });
  if (!subjectId) throw new Error(`Matière '${data.subject}' introuvable (subjects.code).`);
  const levelId = await getId("levels", { code: data.level, education_system_id: es });
  if (!levelId) throw new Error(`Niveau '${data.level}' introuvable (levels.code).`);

  // Optional filière: maps a track code (e.g. "pc", "sm_a") → tracks.id.
  // Omit or set null to keep the content common to every filière.
  let trackId = null;
  if (data.filiere) {
    trackId = await getId("tracks", { code: data.filiere, education_system_id: es });
    if (!trackId) throw new Error(`Filière '${data.filiere}' introuvable (tracks.code).`);
  }

  const examType = data.exam.type ?? (data.level === "1bac" ? "regional" : "national");
  const examMatch = { level_id: levelId, subject_id: subjectId, year: data.exam.year, session: data.exam.session };
  if (trackId) examMatch.track_id = trackId;
  const examId = await findOrInsert(
    "exams",
    examMatch,
    {
      education_system_id: es,
      level_id: levelId,
      subject_id: subjectId,
      track_id: trackId,
      exam_type: examType,
      session: data.exam.session,
      year: data.exam.year,
      title: data.exam.title ?? null,
      duration_minutes: data.exam.duration_minutes ?? null,
    }
  );

  let exPos = 0;
  let added = 0;
  let skipped = 0;

  for (const ex of data.exercises) {
    exPos++;
    let chapterId = null;
    if (ex.chapter) {
      const chapMatch = { subject_id: subjectId, level_id: levelId, code: ex.chapter.code };
      if (trackId) chapMatch.track_id = trackId;
      chapterId = await findOrInsert(
        "chapters",
        chapMatch,
        { subject_id: subjectId, level_id: levelId, track_id: trackId, code: ex.chapter.code, name: ex.chapter.name, position: exPos }
      );
    }
    const exerciseId = await findOrInsert(
      "exercises",
      { exam_id: examId, title: ex.title },
      {
        subject_id: subjectId,
        chapter_id: chapterId,
        exam_id: examId,
        source: "official_exam",
        title: ex.title,
        statement: ex.context ?? null,
        position: exPos,
      }
    );

    let qPos = 0;
    for (const q of ex.questions) {
      qPos++;
      const exists = await getId("questions", { exercise_id: exerciseId, statement: q.statement });
      if (exists) {
        skipped++;
        continue;
      }
      const { data: qRow, error: qErr } = await supabase
        .from("questions")
        .insert({
          exercise_id: exerciseId,
          kind: "mcq",
          statement: q.statement,
          points: q.points ?? 1,
          position: qPos,
        })
        .select("id")
        .single();
      if (qErr) throw qErr;

      const opts = (q.options ?? []).map((label, i) => ({
        question_id: qRow.id,
        label,
        is_correct: i === q.correct,
        position: i + 1,
      }));
      if (opts.length) {
        const { error } = await supabase.from("answer_options").insert(opts);
        if (error) throw error;
      }
      if (q.solution) {
        const { error } = await supabase
          .from("solutions")
          .insert({ question_id: qRow.id, author: "hsgenius", body: q.solution });
        if (error) throw error;
      }
      added++;
    }
  }

  console.log(
    `✓ ${data.subject} · ${data.level} · ${data.exam.year}/${data.exam.session} — ${added} question(s) ajoutée(s), ${skipped} déjà présente(s).`
  );
}

run().catch((e) => {
  console.error("❌", e.message ?? e);
  process.exit(1);
});
