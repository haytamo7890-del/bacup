#!/usr/bin/env node
/**
 * Export the FULL cours text of a subject/filière as Markdown, one file per chapter
 * (+ one combined file), so the content team can write questions that match the cours.
 *
 *   npm run export:cours svt pc            → content/prep/svt-pc/_cours/
 *   npm run export:cours maths sm_a 2bac
 *   npm run export:cours pc commun         → PC chapters shared by all filières
 *
 * Files starting with "_" are ignored by the pack importer, so this folder is safe
 * inside content/prep/. Read-only: nothing is written to the database.
 */
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) { console.error("Variables Supabase manquantes (.env.local). Lance via: npm run export:cours <matière> <filière>"); process.exit(1); }

const [, , subject, track = "commun", level = "2bac"] = process.argv;
if (!subject) { console.error("Usage: npm run export:cours <matière> [filière|commun] [niveau]"); process.exit(1); }

const sb = createClient(URL, KEY, { auth: { persistSession: false } });
const one = async (q) => { const { data, error } = await q; if (error) throw new Error(error.message); return data; };

const [subj] = await one(sb.from("subjects").select("id, name").eq("code", subject));
const [lvl] = await one(sb.from("levels").select("id").eq("code", level));
if (!subj || !lvl) { console.error(`Matière "${subject}" ou niveau "${level}" introuvable.`); process.exit(1); }

let chq = sb.from("chapters").select("id, code, name, unit, domain, position, unit_pos").eq("subject_id", subj.id).eq("level_id", lvl.id);
if (track === "commun") chq = chq.is("track_id", null);
else {
  const [tr] = await one(sb.from("tracks").select("id").eq("code", track));
  if (!tr) { console.error(`Filière "${track}" introuvable.`); process.exit(1); }
  chq = chq.eq("track_id", tr.id);
}
const chapters = (await one(chq)).sort((a, b) => (a.unit_pos ?? 0) - (b.unit_pos ?? 0) || a.position - b.position);
if (!chapters.length) { console.error("Aucun chapitre trouvé."); process.exit(1); }

const outDir = path.join("content", "prep", `${subject}-${track}`, "_cours");
fs.mkdirSync(outDir, { recursive: true });
const all = [];
let total = 0;

for (const [i, ch] of chapters.entries()) {
  const lessons = await one(sb.from("lessons").select("title, kind, body, resume, objectives, position").eq("chapter_id", ch.id).order("position"));
  const notions = [];
  for (const l of lessons) for (const m of (l.body ?? "").matchAll(/^##\s+([^\n#]+)$/gm)) notions.push(m[1].trim());
  const parts = [
    `# ${ch.name}`,
    "",
    `> Code \`${ch.code}\` · ${subj.name} · ${track} · ${level}${ch.unit ? ` · unité « ${ch.unit} »` : ""}`,
    `> Notions (= titres \`##\`, à recopier tels quels dans le champ \`notion\`) :`,
    ...notions.map((n) => `> - ${n}`),
    "",
  ];
  for (const l of lessons) {
    parts.push(`---`, "", `<!-- leçon ${l.position} · ${l.kind ?? "cours"} -->`, "", `# Leçon — ${l.title}`, "");
    if (l.objectives) parts.push(`**Objectifs :** ${l.objectives}`, "");
    parts.push((l.body ?? "").trim(), "");
    if (l.resume) parts.push(`### Résumé de la leçon`, "", l.resume.trim(), "");
  }
  const md = parts.join("\n");
  const file = path.join(outDir, `${String(i + 1).padStart(2, "0")}-${ch.code}.md`);
  fs.writeFileSync(file, md, "utf8");
  all.push(md);
  total += md.length;
  console.log(`✓ ${file}  (${lessons.length} leçon(s), ${notions.length} notions, ${Math.round(md.length / 1000)}k car.)`);
}

const combined = path.join(outDir, `_TOUT-${subject}-${track}.md`);
fs.writeFileSync(combined, all.join("\n\n\n"), "utf8");
console.log(`\n${chapters.length} chapitre(s) · ${Math.round(total / 1000)}k caractères\n→ ${combined}`);
