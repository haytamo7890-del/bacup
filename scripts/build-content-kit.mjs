#!/usr/bin/env node
/**
 * Build the content kit for the content team (cofounder) — everything needed to
 * write the missing Préparation packs, in one folder + one zip.
 *
 *   npm run content:kit                 → content/kit/ + content/bacup-content-kit.zip
 *   npm run content:kit -- --annales    → also copies annales 2018+ (≈ +150 Mo)
 *
 * Static parts (LISEZMOI, scaffolds, examples, validator, figures) live in content/kit/.
 * This script adds the live cours text (read-only DB export) and zips the folder.
 */
import { spawnSync } from "node:child_process";
import { exportCours, supabaseFromEnv } from "./lib/export-cours.mjs";
import fs from "node:fs";
import path from "node:path";

const withAnnales = process.argv.includes("--annales");
const KIT = path.join("content", "kit");
const GROUPS = [["svt", "svt"], ["svt", "sm_a"], ["si", "sm_b"], ["philo", "commun"], ["anglais", "commun"]];

console.log("1/3  Export du texte des cours…");
let sb;
try { sb = supabaseFromEnv(); } catch (e) { console.error(`✖ ${e.message}`); process.exit(1); }
for (const [subject, track] of GROUPS) {
  try {
    await exportCours({ sb, subject, track, outBase: path.join(KIT, "cours") });
  } catch (e) {
    console.error(`✖ export ${subject} ${track} : ${e.message}${e.cause ? ` (${e.cause.message ?? e.cause})` : ""}`);
    process.exit(1);
  }
}

// Philo + Anglais: their cours are thin (~1k chars/lesson). Export every lesson with its
// current text so the content team can expand it (keep the ## headings), then import with
// node scripts/import-courses.mjs content/kit/cours-a-enrichir/<subject>.json
console.log("\n1b/3 Cours à enrichir (philo, anglais)…");
for (const subject of ["philo", "anglais"]) {
  const { data: subj } = await sb.from("subjects").select("id").eq("code", subject).single();
  const { data: lvl } = await sb.from("levels").select("id").eq("code", "2bac").single();
  const { data: chs, error: e1 } = await sb.from("chapters").select("id, code, name, position").eq("subject_id", subj.id).eq("level_id", lvl.id).order("position");
  if (e1) { console.error(`✖ chapitres ${subject} : ${e1.message}`); process.exit(1); }
  const { data: ls, error: e2 } = await sb.from("lessons").select("id, chapter_id, title, kind, position, body, resume, objectives").in("chapter_id", chs.map((c) => c.id)).order("position");
  if (e2) { console.error(`✖ leçons ${subject} : ${e2.message}`); process.exit(1); }
  const byCh = new Map(chs.map((c) => [c.id, c]));
  const rows = ls
    .sort((a, b) => byCh.get(a.chapter_id).position - byCh.get(b.chapter_id).position || a.position - b.position)
    .map((l) => ({
      id: l.id, chapter_code: byCh.get(l.chapter_id).code, chapter: byCh.get(l.chapter_id).name, kind: l.kind, position: l.position,
      titres_a_garder: [...new Set([...(l.body ?? "").matchAll(/^##\s+([^\n#]+)$/gm)].map((m) => m[1].trim()))],
      body_actuel: l.body ?? "", resume_actuel: l.resume ?? "",
      title: "", body: "", resume: "", objectives: "",
    }));
  const dir = path.join(KIT, "cours-a-enrichir");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${subject}.json`), JSON.stringify(rows, null, 1), "utf8");
  console.log(`✓ ${dir}/${subject}.json (${rows.length} leçons)`);
}

if (withAnnales) {
  console.log("\n2/3  Copie des annales 2018+ …");
  const out = path.join(KIT, "annales");
  fs.mkdirSync(out, { recursive: true });
  const SUJETS = path.join("annales-propres", "ANNALES PROP");
  const keep = (f) => { const m = f.match(/-(\d{4})-(normale|rattrapage)\.pdf$/); return m && Number(m[1]) >= 2018; };
  const pre = ["Sujet-svt-svt-", "Sujet-svt-sm-", "Sujet-si-", "Sujet-philo-", "Sujet-anglais-"];
  let n = 0;
  for (const f of fs.readdirSync(SUJETS)) if (pre.some((p) => f.startsWith(p)) && keep(f)) { fs.copyFileSync(path.join(SUJETS, f), path.join(out, f)); n++; }
  for (const [dir, prefixes] of [["svt", ["Corrige-svt-svt-", "Corrige-svt-sm-"]], ["si", ["Corrige-si-"]], ["philo", ["Corrige-philo-"]], ["anglais", ["Corrige-anglais-"]]]) {
    const d = path.join("corriges-propres", dir);
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d)) if (prefixes.some((p) => f.startsWith(p)) && keep(f)) { fs.copyFileSync(path.join(d, f), path.join(out, f)); n++; }
  }
  console.log(`   ${n} PDF copiés dans ${out}`);
} else {
  console.log("\n2/3  Annales non incluses (ajoute -- --annales pour les copier)");
}

console.log("\n3/3  Zip…");
const zip = path.join("content", "bacup-content-kit.zip");
try { fs.rmSync(zip, { force: true }); } catch { /* ignore */ }
const z = spawnSync("tar", ["-a", "-c", "-f", zip, "-C", "content", "kit"], { stdio: "inherit" });
if (z.status === 0 && fs.existsSync(zip)) console.log(`✔ ${zip}  (${Math.round(fs.statSync(zip).size / 1e6)} Mo) — à envoyer tel quel`);
else console.log(`⚠ Zip impossible ici : fais clic droit sur content/kit → Compresser (zip).`);
