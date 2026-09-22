/**
 * Central config — pricing, tiers, limits, feature flags.
 * Rule: no hardcoded prices/limits scattered in the app. They live HERE.
 */

export const PRICING = {
  currency: "MAD",
  free: { price: 0 },
  pro: { price: 220, label: "Pro" }, // 220 DH / an
  premium: { price: 390, label: "Premium" }, // à ajuster après validation
} as const;

export const TRIAL_DAYS = 7;

/** Paid programs (annual access). One per BAC year, 220 DH each. */
export const PROGRAMS = {
  bac1: { code: "bac1", levelCode: "1bac", label: "Bac 1 (1ère année)", price: 220 },
  bac2: { code: "bac2", levelCode: "2bac", label: "Bac 2 (2ème année)", price: 220 },
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
  gamification: false,
  community: false,
} as const;
