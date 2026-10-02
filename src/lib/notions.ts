/**
 * Notion taxonomy — ONE resolver shared by the cours funnels and the Espace de
 * préparation, so "Teste-toi sur cette notion" (cours) and "Par notion" (prépa)
 * always pull exactly the same questions.
 *
 *   subject → chapter → lesson → "## heading"  = a notion
 *   questions.notion = a slug (maths, via config/notion-map) or a phrase that
 *   overlaps the heading (other subjects).
 */
import { notionSlug } from "@/config/notion-map";

/** lowercase, strip accents & punctuation (keeps Arabic letters). */
export function normNotion(s: string): string {
  return (s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9؀-ۿ ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** The notions of a lesson = its `##` headings, in order. */
export function lessonNotions(body: string | null | undefined): string[] {
  const out: string[] = [];
  for (const line of (body ?? "").replace(/\r\n/g, "\n").split("\n")) {
    const m = line.trim().match(/^##\s+(.*)$/);
    if (m && m[1].trim()) out.push(m[1].trim());
  }
  return out;
}

/** Questions of a chapter bank that belong to a notion heading (never falls back to the whole bank). */
export function questionsForNotion<T extends { notion?: string | null }>(heading: string, items: T[]): T[] {
  const available = new Set(items.map((q) => q.notion).filter(Boolean) as string[]);
  const slug = notionSlug(heading, available);
  let sel = slug ? items.filter((q) => q.notion === slug) : [];
  if (!sel.length) {
    const h = normNotion(heading);
    sel = items.filter((q) => {
      if (!q.notion) return false;
      const n = normNotion(q.notion);
      return n.length > 2 && (h.includes(n) || n.includes(h));
    });
  }
  return sel;
}

export type NotionGroup<T> = { notion: string; lessonId: string | null; items: T[]; extra?: boolean };

/** Sentinel for untagged questions that match no heading in the chapter. */
export const OTHER_NOTIONS = "__autres";

const STOP = new Set(["dans", "pour", "avec", "entre", "leur", "leurs", "cette", "comme", "plus", "sont", "deux", "trois",
  "methode", "exercice", "exercices", "type", "types", "notion", "notions", "partie", "etude", "calcul", "calculer",
  "savoir", "faire", "quoi", "pourquoi", "comment", "quel", "quelle", "quels", "quelles", "the", "and", "with", "from"]);
/** Significant word stems of a phrase (accent-free, ≥ 4 letters, 6-char prefix). */
function stems(s: string): Set<string> {
  return new Set(normNotion(s).split(" ").filter((w) => w.length >= 4 && !STOP.has(w)).map((w) => w.slice(0, 6)));
}

/**
 * Split a chapter bank into its notions, in cours order:
 *   1. exact slug / phrase overlap (questionsForNotion) — first heading claims;
 *   2. fuzzy: an unclaimed question goes to the heading sharing the most word stems with its tag;
 *   3. still unmatched tags become their own groups (extra) so no question is ever invisible;
 *      untagged leftovers land in "Autres notions".
 * Shared by the cours funnels, "Par notion" and the practice runner → identical sets everywhere.
 */
export function groupByNotion<T extends { id: string; notion?: string | null }>(
  headings: { notion: string; lessonId: string | null }[],
  items: T[],
): NotionGroup<T>[] {
  const claimed = new Set<string>();
  const groups: NotionGroup<T>[] = [];
  const seen = new Set<string>();
  for (const h of headings) {
    const key = normNotion(h.notion);
    if (seen.has(key)) continue;
    seen.add(key);
    const sel = questionsForNotion(h.notion, items).filter((q) => !claimed.has(q.id));
    sel.forEach((q) => claimed.add(q.id));
    groups.push({ notion: h.notion, lessonId: h.lessonId, items: sel });
  }
  const headStems = groups.map((g) => stems(g.notion));
  const extra = new Map<string, T[]>();
  const other: T[] = [];
  for (const q of items) {
    if (claimed.has(q.id)) continue;
    if (!q.notion) { other.push(q); continue; }
    const qs = stems(q.notion);
    let best = -1, bestScore = 0;
    headStems.forEach((hs, i) => {
      let n = 0; for (const w of qs) if (hs.has(w)) n++;
      if (n > bestScore) { bestScore = n; best = i; }
    });
    if (best >= 0) groups[best].items.push(q);
    else { const a = extra.get(q.notion) ?? []; a.push(q); extra.set(q.notion, a); }
  }
  for (const [notion, its] of extra) groups.push({ notion, lessonId: null, items: its, extra: true });
  if (other.length) groups.push({ notion: OTHER_NOTIONS, lessonId: null, items: other, extra: true });
  return groups;
}

export function notionLabel(n: string): string {
  return n === OTHER_NOTIONS ? "Autres notions" : n;
}
