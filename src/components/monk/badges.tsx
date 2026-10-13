import { Flame, Leaf, Brain, Award, Crown, Gem, type LucideIcon, Sprout } from "lucide-react";

export type Tier = {
  key: string; day: number; name: string; tagline: string;
  c1: string; c2: string; ring: string; Icon: LucideIcon; xp: number;
};

/** Monk ladder — inspired by tiered-shield badge systems, themed to habit-building science. */
export const TIERS: Tier[] = [
  { key: "novice",   day: 0,   name: "Novice",   tagline: "Le premier pas",              c1: "#94a3b8", c2: "#475569", ring: "#64748b", Icon: Sprout, xp: 0 },
  { key: "apprenti", day: 7,   name: "Apprenti", tagline: "La première semaine",         c1: "#f4a15a", c2: "#b45309", ring: "#d97706", Icon: Flame, xp: 50 },
  { key: "disciple", day: 21,  name: "Disciple", tagline: "Habitude formée · 21 jours",  c1: "#e2e8f0", c2: "#94a3b8", ring: "#cbd5e1", Icon: Leaf, xp: 150 },
  { key: "initie",   day: 66,  name: "Initié",   tagline: "Automatisme · 66 jours",      c1: "#fcd34d", c2: "#d97706", ring: "#fbbf24", Icon: Brain, xp: 400 },
  { key: "moine",    day: 90,  name: "Moine",    tagline: "3 mois de discipline",        c1: "#fb7185", c2: "#e11d48", ring: "#f43f5e", Icon: Award, xp: 600 },
  { key: "maitre",   day: 180, name: "Maître",   tagline: "6 mois · maîtrise",           c1: "#c084fc", c2: "#7c3aed", ring: "#a855f7", Icon: Crown, xp: 1200 },
  { key: "legende",  day: 365, name: "Légende",  tagline: "1 an · légende vivante",      c1: "#38bdf8", c2: "#2563eb", ring: "#0ea5e9", Icon: Gem, xp: 3000 },
];

export const MILESTONES = TIERS.filter((t) => t.day > 0).map((t) => t.day); // [7,21,66,90,180,365]

/** Highest tier reached for a given streak. */
export function tierFor(streak: number): Tier {
  let t = TIERS[0];
  for (const x of TIERS) if (streak >= x.day) t = x;
  return t;
}
/** Next tier to aim for (null if maxed). */
export function nextTier(streak: number): Tier | null {
  return TIERS.find((t) => t.day > streak) ?? null;
}

/** A shield-shaped medal for a tier. */
export function MonkBadge({ tier, size = 64, locked = false }: { tier: Tier; size?: number; locked?: boolean }) {
  const id = `mb-${tier.key}`;
  const Icon = tier.Icon;
  return (
    <div style={{ position: "relative", width: size, height: size, filter: locked ? "grayscale(1) opacity(0.45)" : `drop-shadow(0 4px 10px ${tier.ring}55)` }}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-label={tier.name}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={tier.c1} />
            <stop offset="1" stopColor={tier.c2} />
          </linearGradient>
          <linearGradient id={id + "-sh"} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M50 4 L88 16 V46 C88 72 71 88 50 96 C29 88 12 72 12 46 V16 Z" fill={`url(#${id})`} stroke={tier.ring} strokeWidth="3" />
        <path d="M50 4 L88 16 V46 C88 72 71 88 50 96 C29 88 12 72 12 46 V16 Z" fill={`url(#${id}-sh)`} />
        <circle cx="50" cy="44" r="23" fill="#000" fillOpacity="0.14" />
      </svg>
      <div style={{ position: "absolute", inset: 0, top: `-${size * 0.06}px`, display: "grid", placeItems: "center", pointerEvents: "none" }}>
        <Icon color="#fff" size={Math.round(size * 0.34)} strokeWidth={2.4} />
      </div>
    </div>
  );
}
