/**
 * Bac Up commercial rules (landing / onboarding / ambassador handoff, 2026-10).
 * The server recomputes every total from these values; never trust a client total.
 * Values the team edits without a deploy (founder bar, hero count) live in the
 * `app_settings` table instead.
 */
export const BACUP = {
  price: 250,
  oldPrice: 450,
  refDiscount: 20,
  codDeliveryFee: 19,
  /** Full access ends on this date for everyone (founder phase). */
  accessUntil: "2027-07-31",
  accessLabel: "jusqu'au 31 juillet 2027",
  bacDate: "2027-06-01",
  ambassador: {
    perSale: 30,
    validDays: 14,
    codDays: 7,
    minPayout: 200,
    payDay: 5,
    levels: [
      { key: "argent", from: 0, bonus: 0 },
      { key: "or", from: 10, bonus: 50 },
      { key: "platinum", from: 25, bonus: 150 },
      { key: "platinum_50", from: 50, bonus: 400 },
    ],
    racePrizes: [1000, 500, 250],
  },
} as const;

export type BacLevel = "1bac" | "2bac";

/**
 * Stream labels used by the onboarding pages <-> track codes in the DB.
 * 1bac has its own filières (sex, sm; migration 0035). Accounts created
 * before that were filed under pc / svt / sm_a / sm_b: still read back.
 */
const STREAM_TO_TRACK: Record<BacLevel, Record<string, string>> = {
  "1bac": { "Sciences Ex": "sex", "Sciences Maths": "sm" },
  "2bac": { PC: "pc", SVT: "svt", "SM A": "sm_a", "SM B": "sm_b" },
};

const TRACK_TO_STREAM: Record<BacLevel, Record<string, string>> = {
  "1bac": { sex: "Sciences Ex", sm: "Sciences Maths", pc: "Sciences Ex", svt: "Sciences Ex", sm_a: "Sciences Maths", sm_b: "Sciences Maths" },
  "2bac": { pc: "PC", svt: "SVT", sm_a: "SM A", sm_b: "SM B" },
};

/** Allowed answers of the onboarding (validated server-side). */
export const ONBOARDING_CHOICES = {
  avatars: ["laureat", "couronne", "flamme", "fusee", "eclair", "bouclier", "diamant", "etoile"],
  goals: {
    "1bac": ["12 et +", "14 et +", "16 et +", "18 et +"],
    "2bac": ["Passable", "Assez bien", "Bien", "Très bien"],
  } as Record<BacLevel, string[]>,
  dreamSchools: ["Médecine", "ENSA · ENSAM", "CPGE", "ENCG", "ISCAE", "ENA", "Pas encore décidé"],
} as const;

export function isBacLevel(v: unknown): v is BacLevel {
  return v === "1bac" || v === "2bac";
}

export function trackForStream(level: BacLevel, stream: string): string | null {
  return STREAM_TO_TRACK[level][stream] ?? null;
}

export function streamForTrack(level: string | null, track: string | null): string | null {
  if (!isBacLevel(level) || !track) return null;
  return TRACK_TO_STREAM[level][track] ?? null;
}
