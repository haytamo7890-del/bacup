/**
 * Central config — pricing, tiers, limits, feature flags.
 * Rule: no hardcoded prices/limits scattered in the app. They live HERE.
 */

export const PRICING = {
  currency: "MAD",
  free: { price: 0 },
  pro: { price: 250, label: "Accès complet" }, // 250 DH, accès jusqu'au 31 juillet 2027 (see ./bacup.ts)
  premium: { price: 390, label: "Premium" }, // à ajuster après validation
} as const;

export const TRIAL_DAYS = 7;

/** Paid programs. One per BAC year, 250 DH each (price source: BACUP.price in ./bacup.ts). */
export const PROGRAMS = {
  bac1: { code: "bac1", levelCode: "1bac", label: "Bac 1 (1ère année)", price: 250 },
  bac2: { code: "bac2", levelCode: "2bac", label: "Bac 2 (2ème année)", price: 250 },
} as const;

export type ProgramCode = keyof typeof PROGRAMS;

/** Map a level code (1bac/2bac) to its paid program. */
export function programForLevel(levelCode: string | null | undefined): ProgramCode {
  return levelCode === "1bac" ? "bac1" : "bac2";
}

/** Fair-use limits per tier (protects AI margins). Tune with real data. */
export const AI_LIMITS = {
  free: { questionsPerDay: 5 },
  pro: { questionsPerDay: 60 },
  premium: { questionsPerDay: 300 },
} as const;

/** Beachhead we build content + testing around first. */
export const BEACHHEAD = {
  level: "1bac",
  educationSystem: "ma_secondaire_qualifiant",
} as const;

/** Feature flags — turn features on as they're built. */
export const FEATURES = {
  tutor: true,
  examLibrary: true,
  gamification: true, // XP, streaks, mastery, classement — live
  community: false,
  /** Exam engine (sujets nationaux + examens blancs, chronométrés /20). Off = locked « Bientôt » everywhere. */
  examEngine: false,
  /** 1bac (régional). Off = 1bac accounts can sign up but the whole app is locked « Bientôt »
   *  (no checkout). Turn on once the 1bac content (filières sex / sm) is imported. */
  level1bac: false,
} as const;

/** Copy shown to 1bac students while FEATURES.level1bac is off. */
export const BAC1_COMING_SOON = {
  launch: "décembre 2026",
  title: "Bac Up 1bac arrive en décembre",
  lead: "Ton compte est prêt. Les cours, la préparation et les annales du régional ouvrent en décembre.",
  features: [
    { t: "Cours du régional", d: "Toutes les matières de ta filière, notion par notion." },
    { t: "Préparation", d: "Des QCU et des séries pour chaque chapitre, avec corrigés." },
    { t: "Annales du régional", d: "Les sujets des années passées et leurs corrigés Bac Up." },
    { t: "Plan et classement", d: "Ton plan jusqu'au régional, et ta place parmi les élèves de ta filière." },
  ],
  note: "On te prévient dès que c'est ouvert.",
} as const;

/** Copy + progress shown on the locked Examens section while the exam engine is rebuilt. */
export const EXAMS_COMING_SOON = {
  progress: 86, // % shown on the construction bar — bump as the rebuild advances
  title: "Le mode Examen arrive",
  lead: "On reconstruit les examens pour qu'ils ressemblent vraiment au jour J.",
  features: [
    { t: "Vrais sujets du BAC", d: "Les sujets nationaux, session normale et rattrapage, matière par matière." },
    { t: "Examens blancs type BAC", d: "Des sujets complets écrits par Bac-up, au niveau et au format de l'épreuve." },
    { t: "Chronométré, noté /20", d: "Le temps officiel, un barème réel et ta note estimée à la fin." },
    { t: "Corrigé détaillé + IA", d: "Chaque question expliquée pas à pas, et l'IA pour creuser ce qui bloque." },
  ],
  meanwhile: "En attendant, entraîne-toi par notion et avec les séries : c'est là que se construit ta note.",
} as const;

