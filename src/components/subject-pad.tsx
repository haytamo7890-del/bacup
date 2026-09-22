"use client";

import type { ReactNode } from "react";
import { subjectTheme } from "@/config/subjects";
import { Sigma, Atom, Leaf, Brain, Languages, Cpu, Feather, PenLine, Globe, BookOpen, type LucideIcon } from "lucide-react";

/** Identity glyph per subject — its "rocket": Σ for Maths, Atom for PC… */
export function subjectIcon(codeOrName: string): LucideIcon {
  const k = (codeOrName || "").toLowerCase();
  if (k === "maths" || k.includes("math")) return Sigma;
  if (k === "pc" || k.includes("phys") || k.includes("chim")) return Atom;
  if (k === "svt" || k.includes("svt") || k.includes("vie")) return Leaf;
  if (k === "philo" || k.includes("philo")) return Brain;
  if (k === "anglais" || k.includes("angl")) return Languages;
  if (k === "si" || k.includes("ing")) return Cpu;
  if (k.includes("fran")) return Feather;
  if (k.includes("arab")) return PenLine;
  if (k.includes("hist") || k.includes("geo") || k.includes("géo")) return Globe;
  return BookOpen;
}

/**
 * Renders a subject name in the brush-lettering style (`.subject-title`,
 * Yellowtail) with a sweeping swash underline for the "Starlight" vibe, across
 * cours, annales, exam engine and dashboard. Arabic names (الفلسفة) fall back
 * per-glyph to Aref Ruqaa. `sizeClass` sizes it per surface; `swash={false}`
 * drops the underline for tight inline rows (e.g. dashboard stat lines).
 */
export function SubjectName({ name, sizeClass = "", className = "", swash = true }: { name: string; sizeClass?: string; className?: string; swash?: boolean }) {
  if (!swash) return <span dir="auto" className={`subject-title ${sizeClass} ${className}`}>{name}</span>;
  return (
    <span dir="auto" className={`subject-title inline-flex flex-col ${sizeClass} ${className}`}>
      <span className="leading-[1.05]">{name}</span>
      <svg className="subject-swash" viewBox="0 0 200 18" preserveAspectRatio="none" aria-hidden="true">
        <path d="M2,12 C 60,17 140,17 206,6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
    </span>
  );
}

/**
 * Subject "pad" — dark glass card with the subject's accent color glowing
 * up from the bottom edge (inspired by neon program cards). Name lives
 * inside; `right` holds the details (coeff, chapitres, annales…).
 * Same texture is reused for the dashboard hero + resume cards.
 */
export function SubjectPad({
  code, name, right, subtitle, onClick, disabled, className = "",
}: {
  code: string; name: string; right?: ReactNode; subtitle?: string;
  onClick?: () => void; disabled?: boolean; className?: string;
}) {
  const t = subjectTheme(code);
  const Glyph = subjectIcon(code);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-900 to-neutral-950 p-5 text-left transition ${disabled ? "opacity-55 cursor-default" : "hover:-translate-y-0.5"} ${className}`}
    >
      {/* accent glow rising from the bottom */}
      <span className={`pointer-events-none absolute -bottom-14 left-1/2 -translate-x-1/2 w-[70%] h-28 rounded-full blur-3xl ${t.bar} ${disabled ? "opacity-25" : "opacity-60 group-hover:opacity-80"} transition-opacity`} />
      {/* subject identity glyph, flowing off the corner */}
      <Glyph className={`pointer-events-none absolute -right-3 -bottom-4 w-24 h-24 rotate-[18deg] ${t.text} opacity-[0.18] group-hover:opacity-30 transition-opacity`} strokeWidth={1.25} />

      <div className="relative flex items-center justify-between gap-4">
        <div className="min-w-0">
          <SubjectName name={name} sizeClass="text-3xl sm:text-4xl" className="text-white" />
          {subtitle && <div className="mt-0.5 text-xs text-white/50">{subtitle}</div>}
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
    </button>
  );
}

/**
 * Minimalist subject "environment" tint — a soft accent glow fixed behind
 * the page so a whole subject space subtly feels like that subject's road.
 * pointer-events-none + very low opacity so it never touches buttons/text.
 */
export function SubjectAmbient({ code }: { code: string | null | undefined }) {
  const t = subjectTheme(code ?? "");
  return (
    <div aria-hidden className={`pointer-events-none fixed inset-x-0 top-14 mx-auto w-[680px] max-w-[85vw] h-72 rounded-full blur-3xl ${t.bar} opacity-[0.08]`} style={{ zIndex: -1 }} />
  );
}

/** A pill styled for the dark subject pad. */
export function PadChip({ children, accent = false, code }: { children: ReactNode; accent?: boolean; code?: string }) {
  const t = code ? subjectTheme(code) : null;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${accent && t ? `bg-white/10 ${t.text}` : "bg-white/10 text-white/70"}`}>
      {children}
    </span>
  );
}
