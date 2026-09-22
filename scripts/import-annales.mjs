/**
 * import-annales.mjs — upload cleaned sujets into Supabase and index them as
 * subject-scoped resources (students see them in the app; demo-gated to 1 free).
 *
 * Prereqs:
 *   - migration 0020_resources.sql applied (creates `resources` table + bucket)
 *   - .env.local has NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 *     (service key stays on YOUR machine — never paste it anywhere)
 *
 * Run:
 *   node scripts/import-annales.mjs "<folder-of-cleaned-pdfs>"
 *   node scripts/import-annales.mjs "<folder>" --dry     # preview, no upload
 *
 * Filenames must look like:  Sujet-<matiere>-<filiere>-<annee>-<session>.pdf
 */
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";

// --- load env from .env.local ---
function loadEnv() {
  try {
    const t = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
    for (const line of t.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {}
}
loadEnv();

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
if (!URL || !KEY) { console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY) in .env.local"); process.exit(1); }

const dir = process.argv[2];
const DRY = process.argv.includes("--dry");
if (!dir) { console.error('usage: node scripts/import-annales.mjs "<folder>" [--dry]'); process.exit(1); }

// map filename matière token -> your subjects.code (files are pre-renamed to codes)
const SUBJECT = {
  maths: "maths", math: "maths", pc: "pc", "physique-chimie": "pc", physique: "pc",
  svt: "svt", anglais: "anglais", philo: "philo", philosophie: "philo",
  si: "si", "sciences-ingenieur": "si", ingenieur: "si",
};
// filière token in filename -> human label shown in the resource name
const FILIERE = { sm: "Sc. Maths", smb: "Sc. Maths B", pc: "Sc. Phys (PC)", svt: "SVT" };
const SESSION = { normale: "Normale", rattrapage: "Rattrapage" };

const sb = createClient(URL, KEY, { auth: { persistSession: false } });

function walk(d, out = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.toLowerCase().endsWith(".pdf")) out.push(p);
  }
  return out;
}

const files = walk(dir);
console.log(`${files.length} PDF(s) found${DRY ? " (dry run)" : ""}`);
let ok = 0, skip = 0, fail = 0;

for (const f of files) {
  const base = path.basename(f);
  const m = base.match(/(sujet|corrige)-([a-z-]+?)-(sm|smb|pc|svt)-(\d{4})-(normale|rattrapage)/i);
  if (!m) { console.log("  ? skip (name)", base); skip++; continue; }
  const [, kindTok, subjTok, filTok, year, sessTok] = m;
  const kind = kindTok.toLowerCase() === "corrige" ? "corrige" : "sujet";
  const code = SUBJECT[subjTok.toLowerCase()];
  if (!code) { console.log("  ? skip (subject map)", base); skip++; continue; }
  const fil = FILIERE[filTok.toLowerCase()] ?? filTok.toUpperCase();
  const sess = SESSION[sessTok.toLowerCase()] ?? sessTok;
  const nice = `${year} · ${sess} · ${fil}${kind === "corrige" ? " · Corrigé" : ""}`;
  const storagePath = `subject/${code}/${base}`;

  if (DRY) { console.log(`  → ${nice}  [${storagePath}]`); ok++; continue; }

  try {
    const bytes = fs.readFileSync(f);
    const up = await sb.storage.from("resources").upload(storagePath, bytes, { contentType: "application/pdf", upsert: true });
    if (up.error) throw up.error;
    // avoid duplicate rows
    const { data: existing } = await sb.from("resources").select("id").eq("storage_path", storagePath).maybeSingle();
    if (!existing) {
      const { error } = await sb.from("resources").insert({
        scope: "subject", scope_key: code, name: nice, storage_path: storagePath, size_bytes: bytes.length,
        filiere: filTok.toLowerCase(), year: Number(year), session: sessTok.toLowerCase(), kind,
      });
      if (error) throw error;
    } else {
      // keep metadata fresh on re-runs
      await sb.from("resources").update({
        name: nice, filiere: filTok.toLowerCase(), year: Number(year), session: sessTok.toLowerCase(), kind,
      }).eq("storage_path", storagePath);
    }
    ok++; if (ok % 20 === 0) console.log(`  …${ok}`);
  } catch (e) { fail++; console.log("  ✗", base, e.message); }
}
console.log(`done — imported ${ok}, skipped ${skip}, failed ${fail}`);
