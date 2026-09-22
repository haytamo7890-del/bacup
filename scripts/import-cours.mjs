/**
 * Import cours & résumés (one JSON file) into the database.
 *   npm run import:cours data/your-cours.json
 *
 * See data/_cours-template.json for the format. Idempotent: re-running skips
 * lessons that already exist (matched on chapter + title + kind).
 * Uses the Supabase SECRET key (bypasses RLS) — CLI only.
 *
 * Filière: set `filiere` to a track code ("pc", "sm_a", "svt", …) to scope the
 * chapters to that filière, or omit / set null to keep them common to all.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SECRET = process.env.SUPABASE_SECRET_KEY;
const ES_CODE = "ma_secondaire_qualifiant";

if (!URL || !SECRET) {
  console.error("❌ Variables Supabase manquantes. Lance via: npm run import:cours <fichier.json>");
  process.exit(1);
}
const file = process.argv[2];
if (!file) {
  console.error("Usage: npm run import:cours data/fichier.json");
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

  let trackId = null;
  if (data.filiere) {
    trackId = await getId("tracks", { code: data.filiere, education_system_id: es });
    if (!trackId) throw new Error(`Filière '${data.filiere}' introuvable (tracks.code).`);
  }

  let pos = 0;
  let addedChapters = 0;
  let addedLessons = 0;
  let skipped = 0;

  for (const ch of data.chapters) {
    pos++;
    const chapMatch = { subject_id: subjectId, level_id: levelId, code: ch.code };
    if (trackId) chapMatch.track_id = trackId;
    const beforeExists = await getId("chapters", chapMatch);
    const chapterId = await findOrInsert(
      "chapters",
      chapMatch,
      { subject_id: subjectId, level_id: levelId, track_id: trackId, code: ch.code, name: ch.name, position: ch.position ?? pos }
    );
    if (!beforeExists) addedChapters++;

    let lPos = 0;
    for (const l of ch.lessons ?? []) {
      lPos++;
      const kind = l.kind === "resume" ? "resume" : "cours";
      const exists = await getId("lessons", { chapter_id: chapterId, title: l.title, kind });
      if (exists) {
        skipped++;
        continue;
      }
      const { error } = await supabase.from("lessons").insert({
        chapter_id: chapterId,
        title: l.title,
        body: l.body ?? null,
        kind,
        position: l.position ?? lPos,
      });
      if (error) throw error;
      addedLessons++;
    }
  }

  console.log(
    `✓ ${data.subject} · ${data.level}${data.filiere ? ` · ${data.filiere}` : " · commun"} — ${addedChapters} chapitre(s), ${addedLessons} leçon(s) ajoutée(s), ${skipped} déjà présente(s).`
  );
}

run().catch((e) => {
  console.error("❌", e.message ?? e);
  process.exit(1);
});
