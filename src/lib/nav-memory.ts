/**
 * Navigation memory — "reprendre où j'en étais".
 *
 * Every dashboard feature remembers the last URL the student was on (chapter,
 * view, open file, filters…) plus the scroll position. The sidebar reopens that
 * spot, and the back button / refresh restore it because the state lives in the URL.
 *
 * Storage: an in-memory store mirrored to localStorage (instant) and to the
 * `nav_state` table (cross-device, debounced). Merge rule: per feature, newest `t` wins.
 */

export type Spot = { url: string; y: number; t: number };
export type Spots = Record<string, Spot>;

/** Sidebar features. `root` is the feature's home; order matters (first match wins). */
export const NAV_FEATURES: { key: string; root: string; match: (p: string) => boolean }[] = [
  { key: "dashboard", root: "/dashboard", match: (p) => p === "/dashboard" },
  { key: "cours", root: "/dashboard/cours", match: (p) => p.startsWith("/dashboard/cours") },
  { key: "prep", root: "/dashboard/examens/preparation", match: (p) => p.startsWith("/dashboard/examens") },
  { key: "annales", root: "/dashboard/annales", match: (p) => p.startsWith("/dashboard/annales") },
  { key: "biblio", root: "/dashboard/bibliotheque", match: (p) => p.startsWith("/dashboard/bibliotheque") },
  { key: "monk", root: "/dashboard/monk", match: (p) => p.startsWith("/dashboard/monk") },
  { key: "classement", root: "/dashboard/classement", match: (p) => p.startsWith("/dashboard/classement") },
  { key: "reglages", root: "/dashboard/reglages", match: (p) => p.startsWith("/dashboard/reglages") },
];

/** Running sessions are never "last spots": reopening them would restart a quiz. */
const NOT_A_SPOT = [/^\/dashboard\/examens\/session/, /^\/dashboard\/examens\/pratique/];

export function featureFor(pathname: string): string | null {
  if (NOT_A_SPOT.some((r) => r.test(pathname))) return null;
  return NAV_FEATURES.find((f) => f.match(pathname))?.key ?? null;
}

const LS_KEY = "bacup.nav.v1";

// ---------- tiny external store (useSyncExternalStore) ----------
let spots: Spots = {};
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const navStore = {
  subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l); }; },
  get: () => spots,
  getServer: (): Spots => EMPTY,
};
const EMPTY: Spots = {};

function isSpot(v: unknown): v is Spot {
  return !!v && typeof v === "object" && typeof (v as Spot).url === "string" && (v as Spot).url.startsWith("/dashboard")
    && typeof (v as Spot).t === "number";
}

export function mergeSpots(a: Spots, b: unknown): Spots {
  const out: Spots = { ...a };
  if (b && typeof b === "object") {
    for (const [k, v] of Object.entries(b as Record<string, unknown>)) {
      if (!isSpot(v)) continue;
      if (!out[k] || v.t > out[k].t) out[k] = { url: v.url, y: Math.max(0, Number(v.y) || 0), t: v.t };
    }
  }
  return out;
}

export function loadLocalSpots() {
  try { spots = mergeSpots(spots, JSON.parse(localStorage.getItem(LS_KEY) || "{}")); } catch { /* private mode */ }
  emit();
}

/** Merge remote spots in; returns true if the remote copy was older than ours (needs a push). */
export function mergeRemote(remote: unknown): boolean {
  const remoteOnly = mergeSpots({}, remote);
  spots = mergeSpots(spots, remote);
  persistLocal();
  emit();
  return JSON.stringify(remoteOnly) !== JSON.stringify(spots);
}

function persistLocal() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(spots)); } catch { /* ignore */ }
}

/** Record where the student is now. `y` is the scroll position of the dashboard <main>. */
export function recordSpot(feature: string, url: string, y: number) {
  visited.set(url, Math.round(y));
  const cur = spots[feature];
  if (cur && cur.url === url && Math.abs(cur.y - y) < 8) return;
  spots = { ...spots, [feature]: { url, y: Math.round(y), t: Date.now() } };
  persistLocal();
  emit();
}

// Every URL visited in this tab keeps its scroll (so Back lands where you were);
// across reloads/devices only each feature's last spot survives.
const visited = new Map<string, number>();

/** Saved scroll for an exact URL. */
export function savedScrollFor(url: string): number | null {
  if (visited.has(url)) return visited.get(url)!;
  for (const s of Object.values(spots)) if (s.url === url) return s.y;
  return null;
}

// Pages call this right before a router.replace that must not move the scroll.
let keepScrollOnce = false;
export const keepScrollOnNextNav = () => { keepScrollOnce = true; };
export const consumeKeepScroll = () => { const v = keepScrollOnce; keepScrollOnce = false; return v; };
