// Validate staged QCU drafts against KaTeX, renderer rules and the SM cours headings.
// Usage: node qvalidate.mjs <drafts.json> <heads.json> [code]
import fs from "node:fs";
import katex from "katex";

const rows = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const heads = JSON.parse(fs.readFileSync(process.argv[3], "utf8")); // { code: [heading, ...] }
const only = process.argv[4];
const FORBIDDEN = /[✓✔✗✘⚠✨★☆❌✅\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}]/u;
const errors = [], warns = [];

function tryK(where, m, display) {
  try { katex.renderToString(m, { throwOnError: true, displayMode: display, strict: "ignore" }); }
  catch (e) { errors.push(`${where}: KaTeX « ${m.slice(0, 60)} » → ${e.message.slice(0, 90)}`); }
}
function check(where, s) {
  if (s == null || s === "") { errors.push(`${where}: vide`); return; }
  if (FORBIDDEN.test(s)) errors.push(`${where}: caractère interdit`);
  const rest = s.replace(/\$\$([\s\S]+?)\$\$/g, (_, m) => { tryK(where, m, true); return " "; });
  const parts = rest.split("$");
  if (parts.length % 2 === 0) errors.push(`${where}: nombre impair de $`);
  for (let i = 1; i < parts.length; i += 2) tryK(where, parts[i], false);
  for (const line of s.split("\n")) {
    const t = line.trim();
    if (t.includes("$$") && !(t === "$$" || /^\$\$.+\$\$$/.test(t))) errors.push(`${where}: $$ hors ligne dédiée`);
    for (const b of t.match(/\*\*[^*]+\*\*/g) ?? []) if (b.includes("$")) errors.push(`${where}: gras contenant des maths`);
  }
}
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

const byCode = {};
for (const r of rows) {
  if (only && r.code !== only) continue;
  byCode[r.code] = (byCode[r.code] ?? 0) + 1;
  const w = `#${r.id} [${r.code}/${r.notion}]`;
  check(`${w}.statement`, r.statement);
  for (const k of ["hint", "solution", "methode"]) check(`${w}.${k}`, r[k]);
  const opts = [r.o1, r.o2, r.o3, r.o4], whys = [r.w1, r.w2, r.w3, r.w4];
  opts.forEach((o, i) => check(`${w}.o${i + 1}`, o));
  whys.forEach((o, i) => check(`${w}.w${i + 1}`, o));
  if (new Set(opts.map((o) => o.trim())).size < 4) errors.push(`${w}: options en double`);
  for (const [k, v] of Object.entries({ statement: r.statement, hint: r.hint, solution: r.solution, w1: r.w1, w2: r.w2, w3: r.w3, w4: r.w4 }))
    if (/\.\.\.|…|[Vv]érifie bien|Relis|ne convient donc pas|est donc juste/.test(v.replace(/\\ldots/g, ""))) errors.push(`${w}.${k}: texte suspect (auto-correction / points de suspension)`);
  whys.forEach((t, i) => {
    const juste = /^Juste\b/.test(t.trim());
    if (i + 1 === r.correct && !juste) warns.push(`${w}: le why de la bonne réponse ne commence pas par « Juste »`);
    if (i + 1 !== r.correct && juste) errors.push(`${w}: why « Juste » sur une option fausse (o${i + 1})`);
  });
  const list = heads[r.code] ?? [];
  if (!list.includes(r.notion)) errors.push(`${w}: notion absente des titres ## du chapitre`);
  const len = opts.map((o) => o.replace(/\$[^$]*\$/g, "xxxx").length);
  const c = len[r.correct - 1], others = len.filter((_, i) => i !== r.correct - 1);
  if (c > 1.6 * Math.max(...others) && c > 25) warns.push(`${w}: bonne réponse nettement plus longue (${c} vs ${Math.max(...others)})`);
  if (r.hint && norm(r.hint).includes(norm(opts[r.correct - 1])) && norm(opts[r.correct - 1]).length > 6) warns.push(`${w}: l'indice semble donner la réponse`);
}
for (const [k, v] of Object.entries(byCode)) console.log(`${k}: ${v} questions`);
const pos = {};
for (const r of rows) if (!only || r.code === only) pos[r.correct] = (pos[r.correct] ?? 0) + 1;
console.log("répartition bonne réponse (avant mélange):", JSON.stringify(pos));
for (const x of warns) console.log("  WARN " + x);
for (const x of errors) console.log("  ERR  " + x);
process.exit(errors.length ? 1 : 0);
