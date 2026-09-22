/**
 * Subject color identity — ONE source of truth for the accent of each matière.
 * Used across the dashboard, cours, examens and resume so a subject always
 * carries the same color. Keyed by subject `code`; falls back to name match.
 *
 * Palette inspired by vibrant program cards, mapped to each subject's identity:
 *   maths = orange · pc = violet · svt = green · philo = indigo · anglais = rose
 */
export type SubjectTheme = {
  bar: string;   // solid bg for progress fills / dots
  text: string;  // accent text
  ring: string;  // ring/border accent
  soft: string;  // soft tinted bg (chips)
  grad: string;  // gradient for icon tiles / hero cards (from-… to-…)
};

const T = (bar: string, text: string, ring: string, soft: string, grad: string): SubjectTheme => ({ bar, text, ring, soft, grad });

const THEMES: Record<string, SubjectTheme> = {
  maths:    T("bg-orange-500",  "text-orange-500",  "ring-orange-500/60",  "bg-orange-500/15",  "from-orange-500 to-orange-600"),
  pc:       T("bg-violet-500",  "text-violet-500",  "ring-violet-500/60",  "bg-violet-500/15",  "from-violet-500 to-violet-700"),
  svt:      T("bg-emerald-500", "text-emerald-500", "ring-emerald-500/60", "bg-emerald-500/15", "from-emerald-500 to-emerald-700"),
  philo:    T("bg-indigo-500",  "text-indigo-500",  "ring-indigo-500/60",  "bg-indigo-500/15",  "from-indigo-500 to-indigo-700"),
  anglais:  T("bg-rose-500",    "text-rose-500",    "ring-rose-500/60",    "bg-rose-500/15",    "from-rose-500 to-rose-700"),
  // sensible accents for the other filières' subjects
  si:       T("bg-sky-500",     "text-sky-500",     "ring-sky-500/60",     "bg-sky-500/15",     "from-sky-500 to-sky-700"),
  francais: T("bg-cyan-500",    "text-cyan-500",    "ring-cyan-500/60",    "bg-cyan-500/15",    "from-cyan-500 to-cyan-700"),
  arabe:    T("bg-teal-500",    "text-teal-500",    "ring-teal-500/60",    "bg-teal-500/15",    "from-teal-500 to-teal-700"),
  histgeo:  T("bg-amber-500",   "text-amber-500",   "ring-amber-500/60",   "bg-amber-500/15",   "from-amber-500 to-amber-700"),
  islamique:T("bg-green-600",   "text-green-600",   "ring-green-600/60",   "bg-green-600/15",   "from-green-600 to-green-800"),
  eco_gen:  T("bg-blue-500",    "text-blue-500",    "ring-blue-500/60",    "bg-blue-500/15",    "from-blue-500 to-blue-700"),
  compta:   T("bg-slate-500",   "text-slate-500",   "ring-slate-500/60",   "bg-slate-500/15",   "from-slate-500 to-slate-700"),
};

const DEFAULT = T("bg-slate-400", "text-slate-500", "ring-slate-400/60", "bg-slate-400/15", "from-slate-500 to-slate-700");

/** Theme for a subject by its code (preferred) or its display name. */
export function subjectTheme(codeOrName: string | null | undefined): SubjectTheme {
  const k = (codeOrName ?? "").toLowerCase().trim();
  if (!k) return DEFAULT;
  if (THEMES[k]) return THEMES[k];
  if (k.includes("math")) return THEMES.maths;
  if (k.includes("phys") || k.includes("chim") || k === "pc") return THEMES.pc;
  if (k.includes("svt") || k.includes("vie")) return THEMES.svt;
  if (k.includes("philo")) return THEMES.philo;
  if (k.includes("angl")) return THEMES.anglais;
  if (k.includes("ing") || k.includes("si")) return THEMES.si;
  if (k.includes("fran")) return THEMES.francais;
  if (k.includes("arab")) return THEMES.arabe;
  if (k.includes("hist") || k.includes("géo") || k.includes("geo")) return THEMES.histgeo;
  if (k.includes("islam")) return THEMES.islamique;
  return DEFAULT;
}
