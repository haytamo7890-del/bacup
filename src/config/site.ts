/**
 * Site-level SEO config: canonical URL + slug maps for the public exam pages.
 * URL taxonomy (our own, level-first — 1bac/2bac is our edge over competitors):
 *   /examens
 *   /examens/[level]/[subject]
 *   /examens/[level]/[subject]/[year]-session-[session]
 *   /examens/[level]/[subject]/[year]-session-[session]/corrige
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://bac-up.ma").replace(/\/$/, "");
export const SITE_NAME = "Bac-up";

/** DB subject.code → SEO-friendly URL slug (full words, like the market standard). */
export const SUBJECT_SLUG: Record<string, string> = {
  maths: "mathematiques",
  pc: "physique-chimie",
  svt: "svt",
  philo: "philosophie",
  anglais: "anglais",
  si: "sciences-ingenieur",
  eco_gen: "economie-generale",
  compta: "comptabilite",
  francais: "francais",
  arabe: "langue-arabe",
  histgeo: "histoire-geographie",
  islamique: "education-islamique",
};
export const SLUG_TO_SUBJECT: Record<string, string> = Object.fromEntries(
  Object.entries(SUBJECT_SLUG).map(([code, slug]) => [slug, code])
);

export function subjectSlug(code: string): string {
  return SUBJECT_SLUG[code] ?? code;
}
export function subjectCodeFromSlug(slug: string): string | null {
  return SLUG_TO_SUBJECT[slug] ?? null;
}

/** Levels keep their short, clean codes as slugs. */
export const LEVEL_SLUGS = ["1bac", "2bac"] as const;
export function levelLabel(code: string): string {
  return code === "1bac" ? "1bac" : code === "2bac" ? "2bac" : code;
}
export function levelLong(code: string): string {
  return code === "1bac" ? "1ère année Bac" : code === "2bac" ? "2ème année Bac" : code;
}

export type Session = "normale" | "rattrapage";
export function sessionLabel(s: string): string {
  return s === "rattrapage" ? "Session de rattrapage" : "Session normale";
}
export function sessionShort(s: string): string {
  return s === "rattrapage" ? "Rattrapage" : "Normale";
}

/** exam slug: 2021-session-normale */
export function examSlug(year: number, session: string): string {
  return `${year}-session-${session}`;
}
export function parseExamSlug(slug: string): { year: number; session: Session } | null {
  const m = slug.match(/^(\d{4})-session-(normale|rattrapage)$/);
  if (!m) return null;
  return { year: Number(m[1]), session: m[2] as Session };
}

export function examTypeLabel(t: string): string {
  return t === "national" ? "Examen National" : t === "regional" ? "Examen Régional" : t === "blanc" ? "Examen Blanc" : "Examen";
}

/** Absolute canonical URL builder. */
export function url(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
