#!/usr/bin/env node
/**
 * Load a FILLED course scaffold into the app (updates lessons by id).
 * Uses the Supabase REST API directly (no SDK) — runs from your own machine.
 * Only non-empty fields are written, so partially-filled files are safe to re-run.
 *
 * Usage:  node scripts/import-courses.mjs content/filled/maths-2bac-scex-ch1-suites.json
 */
import fs from "node:fs";

function loadEnvLocal() {
  const out = { ...process.env };
  for (const f of [".env.local", ".env"]) {
    try {
      for (const line of fs.readFileSync(f, "utf8").split("\n")) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
        if (m) out[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
      }
    } catch { /* ignore */ }
  }
  return out;
}

const env = loadEnvLocal();
const SB_URL = (env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "");
const KEY = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_KEY || env.SUPABASE_KEY;
if (!SB_URL || !KEY) { console.error("Missing SUPABASE_URL / service key in .env.local"); process.exit(1); }

const file = process.argv[2];
if (!file) { console.error("Usage: node scripts/import-courses.mjs <filled.json>"); process.exit(1); }
let items;
try { items = JSON.parse(fs.readFileSync(file, "utf8")); }
catch (e) { console.error("Cannot read/parse JSON:", e.message); process.exit(1); }
if (!Array.isArray(items)) { console.error("File must be a JSON array."); process.exit(1); }

const H = { apikey: KEY, Authorization: "Bearer " + KEY, "Content-Type": "application/json", Prefer: "return=minimal" };

let updated = 0, skipped = 0, errors = 0;
for (const it of items) {
  if (!it || !it.id) { skipped++; continue; }
  const patch = {};
  for (const k of ["title", "body", "resume", "objectives"]) {
    if (typeof it[k] === "string" && it[k].trim() !== "") patch[k] = it[k];
  }
  for (const k of ["difficulty", "duration_min", "bac_frequency"]) {
    if (it[k] !== null && it[k] !== undefined && it[k] !== "") patch[k] = Number(it[k]);
  }
  if (Object.keys(patch).length === 0) { skipped++; continue; }
  try {
    const r = await fetch(`${SB_URL}/rest/v1/lessons?id=eq.${it.id}`, { method: "PATCH", headers: H, body: JSON.stringify(patch) });
    if (!r.ok) { errors++; console.error("✗", it.notion || it.id, r.status, (await r.text()).slice(0, 160)); }
    else { updated++; console.log("✓", it.notion || it.id); }
  } catch (e) { errors++; console.error("✗", it.notion || it.id, e.message); }
}
console.log(`\nDone. updated=${updated}  skipped(empty)=${skipped}  errors=${errors}`);
