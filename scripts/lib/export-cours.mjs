/**
 * Shared: export the full cours text of one subject/filière as Markdown
 * (one file per chapter + one combined file). Read-only on the database.
 * Used by scripts/export-cours-text.mjs (CLI) and scripts/build-content-kit.mjs.
 */
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

export function supabaseFromEnv() {
  const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!URL || !KEY) throw new Error("Variables Supabase manquantes dans .env.local (NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SECRET_KEY ou SUPABASE_SERVICE_ROLE_KEY).");
  return createClient(URL, KEY, { auth: { persistSession: false } });
}

export async function exportCours({ sb, subject, track = "commun", level = "2bac", outBase = null, log = console.log }) {
  const one = async (q, what) => {
    const { data, error } = await q;
    if (error) throw new Error(`${what} : ${error.message}`);
    return data;
  };
  const [subj] = await one(sb.from("subjects").select("id, name").eq("code", subject), "lecture matière");
  const [lvl] = await one(sb.from("levels").select("id").eq("code", level), "lecture niveau");
  if (!subj) throw new Error(`Matière "${subject}" introuvable.`);
  if (!lvl) throw new Error(`Niveau "${level}" introuvable.`);

  let chq = sb.from("chapters").select("id, code, name, unit, domain, position, unit_pos").eq("subject_id", subj.id).eq("level_id", lvl.id);
  if (track === "commun") chq = chq.is("track_id", null);
  else {
    const [tr] = await one(sb.from("tracks").select("id").eq("code", track), "lecture filière");
    if (!tr) throw new Error(`Filière "${track}" introuvable.`);
    chq = chq.eq("track_id", tr.id);
  }
  const chapters = (await one(chq, "lecture chapitres")).sort((a, b) => (a.unit_pos ?? 0) - (b.unit_pos ?? 0) || a.position - b.position);
  if (!chapters.length) throw new Error(`Aucun chapitre pour ${subject} / ${track} / ${level}.`);

  const outDir = outBase ? path.join(outBase, `${subject}-${track}`) : path.join("content", "prep", `${subject}-${track}`, "_cours");
  fs.mkdirSync(outDir, { recursive: true });
  const all = [];
  let total = 0;
  for (const [i, ch] of chapters.entries()) {
    const lessons = await one(sb.from("lessons").select("title, kind, body, resume, objectives, position").eq("chapter_id", ch.id).order("position"), `leçons de ${ch.code}`);
    const notions = [];
    for (const l of lessons) for (const m of (l.body ?? "").matchAll(/^##\s+([^\n#]+)$/gm)) notions.push(m[1].trim());
    const parts = [
      `# ${ch.name}`, "",
      `> Code \`${ch.code}\` · ${subj.name} · ${track} · ${level}${ch.unit ? ` · unité « ${ch.unit} »` : ""}`,
      `> Notions (= titres \`##\`, à recopier tels quels dans le champ \`notion\`) :`,
      ...[...new Set(notions)].map((n) => `> - ${n}`), "",
    ];
    for (const l of lessons) {
      parts.push("---", "", `<!-- leçon ${l.position} · ${l.kind ?? "cours"} -->`, "", `# Leçon — ${l.title}`, "");
      if (l.objectives) parts.push(`**Objectifs :** ${l.objectives}`, "");
      parts.push((l.body ?? "").trim(), "");
      if (l.resume) parts.push("### Résumé de la leçon", "", l.resume.trim(), "");
    }
    const md = parts.join("\n");
    const file = path.join(outDir, `${String(i + 1).padStart(2, "0")}-${ch.code}.md`);
    fs.writeFileSync(file, md, "utf8");
    all.push(md); total += md.length;
    log(`✓ ${file}  (${lessons.length} leçon(s), ${new Set(notions).size} notions, ${Math.round(md.length / 1000)}k car.)`);
  }
  const combined = path.join(outDir, `_TOUT-${subject}-${track}.md`);
  fs.writeFileSync(combined, all.join("\n\n\n"), "utf8");
  log(`→ ${chapters.length} chapitre(s) · ${Math.round(total / 1000)}k caractères · ${combined}`);
  return { chapters: chapters.length, chars: total, dir: outDir };
}
