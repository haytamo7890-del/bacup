/** Pages a login may send the user back to (same-origin, known prefixes only). */
const ALLOWED = ["/onboarding", "/ambassadeurs", "/dashboard"];

/** Cookie that carries `next` across the Google round-trip. */
export const NEXT_COOKIE = "bacup_next";

export function safeNext(raw: string | null | undefined): string | null {
  if (!raw || raw.length > 500) return null;
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) return null;
  const path = raw.split(/[?#]/)[0];
  return ALLOWED.some((p) => path === p || path.startsWith(p + "/")) ? raw : null;
}
