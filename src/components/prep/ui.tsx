/**
 * Préparation UI primitives — "UI Reset" direction: calm trays holding plain
 * cards, ONE accent (the subject colour inside a subject, the app blue on the
 * hub), no glass, no gradients. Progress is always drawn with the same two
 * marks: <Ring> (a whole: subject, chapter, goal) and <LevelMark> (one notion).
 */
import type { ReactNode } from "react";
import { LEVELS, type Level } from "@/lib/prep";

export const CARD = "rounded-2xl bg-white dark:bg-[#0f151d] border border-black/[0.06] dark:border-white/[0.07]";
export const ACCENT = "text-arctic-blue dark:text-arctic-cyan";

/** A labelled section: small caps title + optional meta, then a soft tray around its cards. */
export function Tray({ title, meta, children, id, className = "" }: { title?: ReactNode; meta?: ReactNode; children: ReactNode; id?: string; className?: string }) {
  return (
    <section id={id} className={`scroll-mt-24 ${className}`}>
      {(title || meta) && (
        <div className="flex items-baseline justify-between gap-3 px-1 mb-2">
          {title && <h2 dir="auto" className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">{title}</h2>}
          {meta && <span className="text-[11px] text-neutral-400">{meta}</span>}
        </div>
      )}
      <div className="rounded-3xl bg-black/[0.035] dark:bg-white/[0.03] p-1.5 space-y-1.5">{children}</div>
    </section>
  );
}

/** Progress ring (0–100). Colour comes from `className` (text-*), so it follows the accent. */
export function Ring({ pct, size = 44, stroke = 4, className = "", children }: { pct: number; size?: number; stroke?: number; className?: string; children?: ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(100, pct));
  return (
    <span className={`relative inline-grid place-items-center shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeOpacity={0.14} strokeWidth={stroke} />
        {p > 0 && <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${(p / 100) * c} ${c}`} />}
      </svg>
      {children != null && <span className="absolute inset-0 grid place-items-center">{children}</span>}
    </span>
  );
}

/**
 * One notion's level, as a filling pie in the accent colour:
 * À découvrir = empty · En cours = ⅓ · Acquis = ⅔ · Maîtrisé = full · Niveau BAC = dot + halo.
 */
export function LevelMark({ level, size = 14, className = "" }: { level: Level; size?: number; className?: string }) {
  const frac = [0, 1 / 3, 2 / 3, 1, 1][level];
  const r = 3.5; const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={`shrink-0 ${className}`} role="img" aria-label={LEVELS[level].label}>
      {level === 4 ? (
        <>
          <circle cx="8" cy="8" r="7.3" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="8" cy="8" r="4.6" fill="currentColor" />
        </>
      ) : level === 3 ? (
        <circle cx="8" cy="8" r="7.5" fill="currentColor" />
      ) : (
        <>
          <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeOpacity={level === 0 ? 0.35 : 0.9} strokeWidth="1.4" />
          {frac > 0 && <circle cx="8" cy="8" r={r} fill="none" stroke="currentColor" strokeWidth={r * 2} strokeDasharray={`${frac * c} ${c}`} transform="rotate(-90 8 8)" />}
        </>
      )}
    </svg>
  );
}

/** The four-step legend, so the marks are never a guess. */
export function LevelLegend({ accent = ACCENT, className = "" }: { accent?: string; className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-neutral-500 dark:text-neutral-400 ${className}`}>
      {([0, 1, 2, 3, 4] as Level[]).map((l) => (
        <span key={l} className="inline-flex items-center gap-1.5"><LevelMark level={l} size={12} className={accent} />{LEVELS[l].label}</span>
      ))}
    </div>
  );
}

/** Thin bar, accent fill. */
export function Bar({ pct, className = "", fill = "bg-current" }: { pct: number; className?: string; fill?: string }) {
  return (
    <span className={`block h-1.5 rounded-full bg-black/[0.07] dark:bg-white/[0.08] overflow-hidden ${className}`}>
      <span className={`block h-full rounded-full ${fill}`} style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
    </span>
  );
}
