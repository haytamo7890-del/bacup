#!/usr/bin/env node
/**
 * Export the FULL cours text of a subject/filière as Markdown, one file per chapter
 * (+ one combined file), so the content team writes questions that match the cours.
 *
 *   npm run export:cours svt pc            → content/prep/svt-pc/_cours/
 *   npm run export:cours maths sm_a 2bac
 *   npm run export:cours pc commun         → PC chapters shared by all filières
 *   npm run export:cours svt svt -- --out content/kit/cours
 *
 * Read-only: nothing is written to the database.
 */
import { exportCours, supabaseFromEnv } from "./lib/export-cours.mjs";

const argv = process.argv.slice(2);
const outIdx = argv.indexOf("--out");
const outBase = outIdx >= 0 ? argv[outIdx + 1] : null;
const pos = argv.filter((a, i) => !a.startsWith("--") && !(outIdx >= 0 && i === outIdx + 1));
const [subject, track = "commun", level = "2bac"] = pos;
if (!subject) { console.error("Usage: npm run export:cours <matière> [filière|commun] [niveau]"); process.exit(1); }

try {
  await exportCours({ sb: supabaseFromEnv(), subject, track, level, outBase });
} catch (e) {
  console.error(`✖ ${e.message}${e.cause ? ` (${e.cause.message ?? e.cause})` : ""}`);
  process.exit(1);
}
