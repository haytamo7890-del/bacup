// Parse a chapter source file (*.lessons.md), validate it, and emit JSON + SQL.
// Usage: node validate.mjs <chapter-code> [--sql]
import fs from "node:fs";
import katex from "katex";

const code = process.argv[2];
const wantSql = process.argv.includes("--sql");
const fromIdx = process.argv.indexOf("--from");
const src = fromIdx > 0 ? null : fs.readFileSync(`src/${code}.lessons.md`, "utf8").replace(/\r\n/g, "\n");
const NOTIONS = JSON.parse(fs.readFileSync("notions.json", "utf8"))[code] ?? [];

// ---------- parse ----------
const lessons = [];
if (fromIdx > 0) {
  const raw = fs.readFileSync(process.argv[fromIdx + 1], "utf8");
  const txt = raw.slice(raw.indexOf("["), raw.lastIndexOf("]") + 1);
  let rows = JSON.parse(txt.startsWith("[") ? txt : JSON.parse(raw).result);
  if (rows.length === 1 && rows[0].j) rows = rows[0].j;
  for (const r of rows.filter((r) => r.code === code)) lessons.push({ position: r.position, kind: r.kind, difficulty: r.difficulty, duration_min: r.duration_min, bac_frequency: r.bac_frequency, title: r.title, objectives: r.objectives, resume: r.resume, body: r.body });
  lessons.sort((a, b) => a.position - b.position);
}
for (const chunk of (src ?? "").split(/^=== LESSON /m).slice(1)) {
  const [head, ...rest] = chunk.split("\n");
  const meta = Object.fromEntries(head.split("|").map((s) => s.trim().split("=")).map(([k, v]) => [k.trim(), (v ?? "").trim()]));
  const text = rest.join("\n");
  const sec = {};
  let cur = null;
  for (const line of text.split("\n")) {
    const m = line.match(/^--- (title|objectives|resume|body)\s*$/);
    if (m) { cur = m[1]; sec[cur] = []; continue; }
    if (cur) sec[cur].push(line);
  }
  const get = (k) => (sec[k] ? sec[k].join("\n").trim() : null);
  lessons.push({
    position: Number(meta.pos), kind: meta.kind, difficulty: meta.difficulty ? Number(meta.difficulty) : null,
    duration_min: meta.duration ? Number(meta.duration) : null, bac_frequency: meta.bac ? Number(meta.bac) : null,
    title: get("title"), objectives: get("objectives"), resume: get("resume"), body: get("body"),
  });
}

// ---------- checks ----------
const errors = [], warns = [];
const FORBIDDEN = /[✓✔✗✘⚠✨★☆❌✅\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}]/u;
const norm = (s) => (s ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9؀-ۿ ]/g, " ").replace(/\s+/g, " ").trim();

function checkMath(where, s) {
  if (!s) return;
  // display math first
  let rest = s.replace(/\$\$([\s\S]+?)\$\$/g, (_, m) => { tryK(where, m, true); return " "; });
  const parts = rest.split("$");
  if (parts.length % 2 === 0) errors.push(`${where}: nombre impair de $`);
  for (let i = 1; i < parts.length; i += 2) tryK(where, parts[i], false);
}
function tryK(where, m, display) {
  try { katex.renderToString(m, { throwOnError: true, displayMode: display, strict: "ignore" }); }
  catch (e) { errors.push(`${where}: KaTeX « ${m.slice(0, 70)} » → ${e.message.slice(0, 110)}`); }
}
function checkRender(where, s) {
  if (!s) return;
  for (const line of s.split("\n")) {
    const t = line.trim();
    if (t.includes("$$") && !(t === "$$" || /^\$\$.+\$\$$/.test(t))) errors.push(`${where}: $$ hors d'une ligne dédiée « ${t.slice(0, 60)} »`);
    for (const b of t.match(/\*\*[^*]+\*\*/g) ?? []) if (b.includes("$")) errors.push(`${where}: gras contenant des maths ${b.slice(0, 50)}`);
    if (t.startsWith("|")) { const cells = t.replace(/\$[^$]*\$/g, (m) => m.includes("|") ? "\u0000" : m); if (cells.includes("\u0000")) errors.push(`${where}: barre | dans une formule de tableau « ${t.slice(0, 60)} »`); }
    if (/^#{3,}\s/.test(t)) warns.push(`${where}: titre ### (non géré comme notion)`);
  }
}
function checkFences(where, s) {
  if (!s) return;
  let depth = 0;
  for (const line of s.split("\n")) {
    const t = line.trim();
    if (/^:::[a-z]/.test(t)) depth++;
    else if (t === ":::") depth--;
    if (depth < 0) { errors.push(`${where}: ::: fermant en trop`); depth = 0; }
  }
  if (depth !== 0) errors.push(`${where}: ${depth} bloc(s) ::: non fermé(s)`);
}

const heads = [];
for (const l of lessons) {
  const w = `[${l.position}] ${l.title}`;
  if (!l.title || !l.body) errors.push(`${w}: titre ou corps manquant`);
  for (const k of ["title", "objectives", "resume", "body"]) {
    if (l[k] && FORBIDDEN.test(l[k])) errors.push(`${w}.${k}: caractère interdit (emoji/coche)`);
    if (k !== "title") { checkMath(`${w}.${k}`, l[k]); checkFences(`${w}.${k}`, l[k]); checkRender(`${w}.${k}`, l[k]); }
  }
  if (l.kind === "cours") {
    if (!l.resume) errors.push(`${w}: resume manquant`);
    if (!l.objectives) errors.push(`${w}: objectives manquant`);
    if (!/:::funnel /.test(l.body)) errors.push(`${w}: :::funnel manquant`);
    if (l.body.length < 4500) warns.push(`${w}: corps court (${l.body.length} car.)`);
  }
  for (const line of (l.body ?? "").split("\n")) {
    const m = line.trim().match(/^##\s+(.*)$/);
    if (m) heads.push({ h: m[1].trim(), pos: l.position });
  }
}
// duplicate headings across the chapter
const seen = new Map();
for (const { h, pos } of heads) {
  const k = norm(h);
  if (seen.has(k)) warns.push(`titre ## dupliqué « ${h} » (leçons ${seen.get(k)} et ${pos})`);
  seen.set(k, pos);
}
// every existing question notion must land on a heading (same rule as questionsForNotion)
for (const n of NOTIONS) {
  const nn = norm(n);
  const hit = heads.find(({ h }) => { const hh = norm(h); return nn.length > 2 && (hh.includes(nn) || nn.includes(hh)); });
  if (!hit) errors.push(`notion orpheline : « ${n} »`);
}

const total = lessons.reduce((a, l) => a + (l.body?.length ?? 0), 0);
console.log(`${code}: ${lessons.length} leçons, ${total} car. de corps, ${heads.length} notions (##)`);
for (const l of lessons) console.log(`  ${String(l.position).padStart(3)} ${l.kind.padEnd(6)} ${String(l.body?.length ?? 0).padStart(6)}  ${l.title}`);
for (const w of warns) console.log("  WARN " + w);
for (const e of errors) console.log("  ERR  " + e);
fs.writeFileSync(`out/${code}.json`, JSON.stringify(lessons, null, 1));

// ---------- SQL ----------
if (wantSql && !errors.length) {
  const q = (s, tag) => (s == null ? "null" : `$${tag}$${s}$${tag}$`);
  for (const t of ["L", "R", "O", "T"]) for (const l of lessons) for (const k of ["title", "body", "resume", "objectives"]) if ((l[k] ?? "").includes(`$${t}$`)) throw new Error("tag collision");
  const stmts = lessons.map((l) => `update lessons l set title=${q(l.title, "T")}, kind='${l.kind}', body=${q(l.body, "L")}, resume=${q(l.resume, "R")}, objectives=${q(l.objectives, "O")}, difficulty=${l.difficulty ?? "null"}, duration_min=${l.duration_min ?? "null"}, bac_frequency=${l.bac_frequency ?? "null"}
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='${code}' and l.position=${l.position};`);
  fs.writeFileSync(`out/${code}.sql`, stmts.join("\n\n") + "\n");
  console.log(`SQL → out/${code}.sql (${stmts.length} updates)`);
}
process.exit(errors.length ? 1 : 0);
