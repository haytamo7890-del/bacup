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
