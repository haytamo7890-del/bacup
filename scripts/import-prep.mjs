/**
 * Import Espace-de-préparation content packs ("bacup.prep/v1") from the CLI.
 *
 *   npm run import:prep content/prep/                 → dry-run every *.json in the folder
 *   npm run import:prep content/prep/pc-rc.json -- --commit [--regen]
 *
 * Default is a DRY RUN (validated server-side, nothing written). --commit writes,
 * one transaction per pack. --regen rebuilds the auto séries afterwards.
 * Same server function as /admin/preparation → import_prep_pack(). Format: docs/content-packs.md
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SECRET = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !SECRET) {
  console.error("❌ Variables Supabase manquantes (.env.local). Lance via: npm run import:prep <fichier|dossier>");
  process.exit(1);
}
const args = process.argv.slice(2);
const commit = args.includes("--commit");
const regen = args.includes("--regen");
const targets = args.filter((a) => !a.startsWith("--"));
if (!targets.length) { console.error("Usage: npm run import:prep <fichier.json|dossier> [-- --commit --regen]"); process.exit(1); }

const files = targets.flatMap((t) => statSync(t).isDirectory()
  ? readdirSync(t).filter((f) => f.endsWith(".json") && !f.startsWith("_")).map((f) => join(t, f))
  : [t]);

const supabase = createClient(URL, SECRET, { auth: { persistSession: false } });
let failed = 0, committed = 0;

for (const f of files) {
  let pack;
  try { pack = JSON.parse(readFileSync(f, "utf8")); }
  catch (e) { console.log(`\n✖ ${f}\n   JSON invalide: ${e.message}`); failed++; continue; }
  const { data, error } = await supabase.rpc("import_prep_pack", { p_pack: pack, p_dry_run: !commit });
  if (error) { console.log(`\n✖ ${f}\n   ${error.message}`); failed++; continue; }
  const s = data.stats ?? {};
  const icon = data.ok ? (data.committed ? "✔" : "✓") : "✖";
  console.log(`\n${icon} ${f}  ${data.committed ? "(importé)" : data.ok ? "(valide — dry-run)" : "(erreurs)"}`);
  console.log(`   exercices +${s.exercises_created ?? 0}/~${s.exercises_updated ?? 0} · questions +${s.questions_created ?? 0}/~${s.questions_updated ?? 0} · séries +${s.series_created ?? 0}/~${s.series_updated ?? 0}`);
  for (const e of data.errors ?? []) console.log(`   ✖ ${e}`);
  for (const w of data.warnings ?? []) console.log(`   ⚠ ${w}`);
  if (!data.ok) failed++; if (data.committed) committed++;
}

if (commit && regen && committed) {
  const { data, error } = await supabase.rpc("regenerate_auto_series");
  console.log(error ? `\n✖ régénération: ${error.message}` : `\n↻ séries auto régénérées (${data.series})`);
}
console.log(`\n${files.length} pack(s) · ${failed} en erreur${commit ? ` · ${committed} importé(s)` : " · dry-run (ajoute -- --commit pour écrire)"}`);
process.exit(failed ? 1 : 0);
