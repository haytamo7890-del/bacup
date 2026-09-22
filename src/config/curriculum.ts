/**
 * Curriculum map: which subjects a student sees in Espace Préparation, in the
 * official order, with the national-exam coefficient and the real exam duration.
 *
 * Keyed by `${levelCode}:${trackCode}` (e.g. "2bac:pc"). Coefficients follow the
 * official Moroccan BAC (facts, public) and are editable here — never hardcode
 * them elsewhere. Durations are in minutes.
 */

export type SubjectRef = { code: string; coeff: number; durationMin: number };

/** The 5 science filières Bac-up supports (order = own-first applied at render). */
export const FILIERES = ["sm_a", "sm_b", "pc", "svt", "eco"] as const;
export const FILIERE_SET = new Set<string>(FILIERES);
/** Short labels for the filière chips. */
export const FILIERE_SHORT: Record<string, string> = { sm_a: "SM-A", sm_b: "SM-B", pc: "PC", svt: "SVT", eco: "Éco" };

// 2bac — national exam
const SM_CORE: SubjectRef[] = [
  { code: "maths", coeff: 9, durationMin: 240 },
  { code: "pc", coeff: 7, durationMin: 240 },
  { code: "svt", coeff: 3, durationMin: 120 },
  { code: "philo", coeff: 2, durationMin: 120 },
  { code: "anglais", coeff: 2, durationMin: 120 },
];

export const CURRICULUM: Record<string, SubjectRef[]> = {
  // Sciences Physiques (PC)
  "2bac:pc": [
    { code: "maths", coeff: 7, durationMin: 180 },
    { code: "pc", coeff: 7, durationMin: 240 },
    { code: "svt", coeff: 5, durationMin: 120 },
    { code: "philo", coeff: 2, durationMin: 120 },
    { code: "anglais", coeff: 2, durationMin: 120 },
  ],
  // Sciences Mathématiques A
  "2bac:sm_a": SM_CORE,
  // Sciences Mathématiques B (adds Sciences de l'Ingénieur)
  "2bac:sm_b": [
    { code: "maths", coeff: 9, durationMin: 240 },
    { code: "pc", coeff: 7, durationMin: 240 },
    { code: "si", coeff: 8, durationMin: 240 },
    { code: "philo", coeff: 2, durationMin: 120 },
    { code: "anglais", coeff: 2, durationMin: 120 },
  ],
  // Sciences de la Vie et de la Terre
  "2bac:svt": [
    { code: "svt", coeff: 7, durationMin: 180 },
    { code: "maths", coeff: 7, durationMin: 180 },
    { code: "pc", coeff: 5, durationMin: 180 },
    { code: "philo", coeff: 2, durationMin: 120 },
    { code: "anglais", coeff: 2, durationMin: 120 },
  ],
  // Sciences Économiques
  "2bac:eco": [
    { code: "eco_gen", coeff: 6, durationMin: 180 },
    { code: "compta", coeff: 6, durationMin: 180 },
    { code: "maths", coeff: 4, durationMin: 120 },
    { code: "histgeo", coeff: 2, durationMin: 120 },
    { code: "philo", coeff: 2, durationMin: 120 },
    { code: "anglais", coeff: 2, durationMin: 120 },
  ],

  // 1bac — régional (common core for the science tracks + languages/humanities)
  "1bac:pc": [
    { code: "francais", coeff: 4, durationMin: 120 },
    { code: "arabe", coeff: 2, durationMin: 120 },
    { code: "histgeo", coeff: 2, durationMin: 120 },
    { code: "islamique", coeff: 2, durationMin: 60 },
  ],
};
// SM A/B and SVT share the same 1bac régional set
CURRICULUM["1bac:sm_a"] = CURRICULUM["1bac:pc"];
CURRICULUM["1bac:sm_b"] = CURRICULUM["1bac:pc"];
CURRICULUM["1bac:svt"] = CURRICULUM["1bac:pc"];

/** Ordered subject codes for a level+track, or null to fall back to DB content. */
export function curriculumFor(levelCode: string | null, trackCode: string | null): SubjectRef[] | null {
  if (!levelCode || !trackCode) return null;
  return CURRICULUM[`${levelCode}:${trackCode}`] ?? null;
}

/**
 * Subjects whose national exam paper is COMMON to every filière (one paper for
 * all). They are shown as a single annales list with no per-filière split.
 */
export const COMMON_PAPER_SUBJECTS = new Set<string>([
  "philo", "anglais", "francais", "arabe", "histgeo", "islamique",
]);

/**
 * Maps a student filière (track) to the `resources.filiere` exam-token(s) that
 * belong to it, so a subject shows ONLY its own filière's papers (no
 * neighbour-filière substitution).
 *
 * National reality: SM-A and SM-B sit the SAME Maths / PC / SVT paper (tagged
 * `sm`); only Sciences de l'Ingénieur differs (SM-B → `smb`, and SM-A does not
 * take SI). Returns [] when the track does not sit that subject at all.
 */
const TRACK_TOKEN: Record<string, string> = { sm_a: "sm", sm_b: "sm", pc: "pc", svt: "svt", eco: "eco" };
export function examTokensFor(subjectCode: string, trackCode: string): string[] {
  if (subjectCode === "si") return trackCode === "sm_b" ? ["smb", "sm"] : [];
  return [TRACK_TOKEN[trackCode] ?? trackCode];
}

/** Tracks (in FILIERES order) whose national curriculum includes this subject. */
export function tracksForSubject(levelCode: string, subjectCode: string): string[] {
  return FILIERES.filter((f) => (CURRICULUM[`${levelCode}:${f}`] ?? []).some((s) => s.code === subjectCode));
}

export function fmtDuration(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, "0")}`;
}
