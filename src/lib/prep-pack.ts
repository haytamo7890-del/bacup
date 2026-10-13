/**
 * "bacup.prep/v1" — the JSON content-pack format for the Espace de préparation.
 * Authored by the content team, imported via /admin/preparation (or
 * `npm run import:prep <files…>`), executed server-side by import_prep_pack().
 * Full spec: docs/content-packs.md · template: data/_prep-pack-template.json
 */
export const PACK_FORMAT = "bacup.prep/v2";
export const PACK_FORMATS = ["bacup.prep/v1", "bacup.prep/v2"] as const;

export type PackOption = string | { label: string; is_correct?: boolean; correct?: boolean; why?: string };
export type PackQuestion = {
  ref?: string; id?: string;
  notion?: string;          // = a "## heading" of the chapter's cours (drives "Par notion")
  statement: string;
  options: PackOption[];
  correct?: number;         // 0-based index (or use is_correct on options)
  solution?: string;
  points?: number;
  hint?: string;             // v2: one nudge shown on demand, before answering
  methode?: string;          // v2: the reusable method, shown after the correction
  difficulty?: 1 | 2 | 3;    // v2
  part?: string;             // v2: "Partie A" inside a problème
  _todo?: boolean;           // scaffold placeholder → skipped by the importer
};
export type PackExercise = {
  ref?: string; id?: string;
  chapter: string;          // chapter code (preferred) or exact name
  title?: string;
  difficulty?: 1 | 2 | 3;
  context?: string;         // shared statement shown above each question
  kind?: "qcu" | "probleme"; // v2: "probleme" = guided BAC problem (context + chained sub-questions)
  figure?: string;          // v2: name of a [[fig:NAME]] figure
  origin?: { type: "annale" | "original"; ref?: string; exercise?: string; reexpressed?: boolean };
  _todo?: boolean;
  questions: PackQuestion[];
};
export type PackSerie = {
  slug: string; title: string; description?: string;
  kind?: "custom" | "chapitre" | "unite" | "mixte";
  chapter?: string | null; unit?: string | null;
  difficulty?: 1 | 2 | 3; xp_bonus?: number; position?: number; published?: boolean;
  questions: string[];      // question refs (or uuids)
};
export type Pack = {
  format: (typeof PACK_FORMATS)[number];
  level: "1bac" | "2bac";
  subject: string;          // subjects.code (maths, pc, svt, …)
  track?: string | null;    // tracks.code (pc, svt, sm_a…) or null = shared chapters
  tracks?: string[];        // v2: import the same pack into several filières (e.g. ["sm_a","sm_b"])
  exercises?: PackExercise[];
  series?: PackSerie[];
};

export type PackReport = {
  ok: boolean; dry_run: boolean; committed?: boolean;
  errors: string[]; warnings: string[];
  stats?: Record<string, number>;
};

/** Cheap client-side shape check before calling the server (which re-validates everything). */
export function quickCheck(raw: unknown): { pack: Pack | null; errors: string[] } {
  const errors: string[] = [];
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return { pack: null, errors: ["Le fichier doit contenir un objet JSON (pas un tableau)."] };
  const p = raw as Partial<Pack>;
  if (!PACK_FORMATS.includes(p.format as (typeof PACK_FORMATS)[number])) errors.push(`"format" doit valoir "${PACK_FORMAT}".`);
  if (p.level !== "1bac" && p.level !== "2bac") errors.push(`"level" doit valoir "1bac" ou "2bac".`);
  if (!p.subject) errors.push(`"subject" manquant (code matière : maths, pc, svt…).`);
  if (p.exercises && !Array.isArray(p.exercises)) errors.push(`"exercises" doit être un tableau.`);
  if (p.series && !Array.isArray(p.series)) errors.push(`"series" doit être un tableau.`);
  if (!p.exercises?.length && !p.series?.length) errors.push(`Le pack ne contient ni "exercises" ni "series".`);
  return { pack: errors.length ? null : (p as Pack), errors };
}

export function packCounts(p: Pack) {
  const ex = p.exercises ?? [];
  return { exercises: ex.length, questions: ex.reduce((a, e) => a + (e.questions?.length ?? 0), 0), series: p.series?.length ?? 0 };
}

export function downloadJson(name: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
