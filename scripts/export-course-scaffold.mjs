#!/usr/bin/env node
/**
 * Export a "fill-in scaffold" of THIN course notions for a subject.
 * Your cofounder's Claude fills body/resume/metadata; import-courses.mjs loads it back.
 *
 * Usage:
 *   node scripts/export-course-scaffold.mjs <subjectCode> [tracksCSV] [levelCode]
 * Examples:
 *   node scripts/export-course-scaffold.mjs maths pc,svt 2bac
 *   node scripts/export-course-scaffold.mjs pc          2bac      # PC chapters are track "commun"
 *   node scripts/export-course-scaffold.mjs svt pc,svt 2bac
 *
 * Writes: content/scaffolds/<subject>[-<tracks>].json
 * "Thin" = body shorter than ~1500 chars OR without real structure (< 2 sections and < 3 callouts).
 * Already-rich notions are left OUT so we never overwrite good courses.
 */
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnvLocal() {
  const out = { ...process.env };
  for (const f of [".env.local", ".env"]) {
    try {
      const txt = fs.readFileSync(f, "utf8");
      for (const line of txt.split("\n")) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
        if (m) out[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
      }
    } catch { /* file may not exist */ }
  }
  return out;
}

const env = loadEnvLocal();
const SB_URL = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_KEY || env.SUPABASE_KEY;
if (!SB_URL || !KEY) { console.error("Missing SUPABASE_URL / service-role key in .env.local"); process.exit(1); }

const [, , subjectCode, tracksArg, levelArg] = process.argv;
if (!subjectCode) { console.error("Usage: node scripts/export-course-scaffold.mjs <subjectCode> [tracksCSV] [levelCode]"); process.exit(1); }
const tracks = (tracksArg || "").split(",").map((s) => s.trim()).filter(Boolean);
const levelCode = levelArg || "2bac";

const sb = createClient(SB_URL, KEY, { auth: { persistSession: false } });

const isThin = (b) => {
  const s = b || "";
  const sections = (s.match(/##/g) || []).length / 1; // "##" occurrences
  const fences = (s.match(/:::/g) || []).length;       // ":::" occurrences (2 per callout)
  return !(s.length >= 1500 && (sections >= 2 || fences >= 6));
};

const [{ data: subjects }, { data: levels }, { data: trackRows }] = await Promise.all([
  sb.from("subjects").select("id, code"),
  sb.from("levels").select("id, code"),
  sb.from("tracks").select("id, code"),
]);
const subj = (subjects || []).find((s) => s.code === subjectCode);
const level = (levels || []).find((l) => l.code === levelCode);
if (!subj) { console.error(`Subject '${subjectCode}' not found`); process.exit(1); }
if (!level) { console.error(`Level '${levelCode}' not found`); process.exit(1); }
const trackCodeById = Object.fromEntries((trackRows || []).map((t) => [t.id, t.code]));

const { data: chapters } = await sb.from("chapters")
  .select("id, name, position, track_id").eq("subject_id", subj.id).eq("level_id", level.id);
const chById = Object.fromEntries((chapters || []).map((c) => [c.id, c]));
const chapterIds = (chapters || []).map((c) => c.id);
if (!chapterIds.length) { console.error("No chapters for that subject/level"); process.exit(1); }

const { data: lessons } = await sb.from("lessons")
  .select("id, title, body, kind, chapter_id, position").in("chapter_id", chapterIds).eq("kind", "cours");

const trackOf = (l) => { const c = chById[l.chapter_id]; return c?.track_id ? (trackCodeById[c.track_id] || "commun") : "commun"; };

let rows = (lessons || [])
  .filter((l) => isThin(l.body))
  .filter((l) => (tracks.length ? tracks.includes(trackOf(l)) : true));

rows.sort((a, b) => {
  const ca = chById[a.chapter_id], cb = chById[b.chapter_id];
  return (ca.position - cb.position) || (a.position - b.position);
});

const out = rows.map((l) => ({
  id: l.id,
  track: trackOf(l),
  chapter: chById[l.chapter_id].name,
  notion: l.title,
  body: "",
  resume: "",
  objectives: "",
  difficulty: null,
  duration_min: null,
  bac_frequency: null,
}));

const dir = "content/scaffolds";
fs.mkdirSync(dir, { recursive: true });
const fname = path.join(dir, `${subjectCode}${tracks.length ? "-" + tracks.join("_") : ""}.json`);
fs.writeFileSync(fname, JSON.stringify(out, null, 2));
console.log(`Wrote ${out.length} thin notions -> ${fname}`);
