/** Filière chips shared by Cours, Annales-like browsers and the Espace de préparation. */
export const SCIENCE_ORDER = ["sm_a", "sm_b", "pc", "svt", "eco"];
export const SHORT: Record<string, string> = { sm_a: "SM-A", sm_b: "SM-B", pc: "PC", svt: "SVT", eco: "Éco" };

export type FiliereChip = { code: string; label: string; name: string };

/** Own filière first; SM-A and SM-B sit the SAME papers → one "SM" chip. */
export function filiereChips(ownTrack: string | null, trackIdByCode: Map<string, string>, trackNameByCode: Map<string, string>): FiliereChip[] {
  if (!ownTrack) return [];
  const groupOf = (c: string) => (c === "sm_a" || c === "sm_b") ? "sm" : c;
  const smRep = (ownTrack === "sm_a" || ownTrack === "sm_b") ? ownTrack : "sm_b";
  const ordered = [ownTrack, ...SCIENCE_ORDER.filter((c) => c !== ownTrack)];
  const seen = new Set<string>();
  const out: FiliereChip[] = [];
  for (const c of ordered) {
    const g = groupOf(c);
    if (seen.has(g)) continue;
    if (g === "sm") {
      if (!trackIdByCode.has("sm_a") && !trackIdByCode.has("sm_b")) continue;
      seen.add(g);
      out.push({ code: smRep, label: "SM", name: "Sciences Mathématiques (A & B)" });
    } else {
      if (!trackIdByCode.has(c)) continue;
      seen.add(g);
      out.push({ code: c, label: SHORT[c] ?? c.toUpperCase(), name: trackNameByCode.get(c) ?? c });
    }
  }
  return out;
}
