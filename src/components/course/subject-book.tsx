"use client";

/**
 * Cours shelf — each matière is a tinted arctic-glass book, 3 per row on every screen.
 *   · living light: the subject glow breathes slowly (8 s), staggered per book
 *   · depth layers: title / icon / progress float at different depths → real parallax on tilt
 *   · tilt: follows the mouse on desktop, leans toward the finger on press (phone)
 *   · open: instant (no transition, nothing between the tap and the chapters)
 * Only transform / opacity animate → 60 fps. Reduced motion: no breathing, no tilt.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { Mascot, type MascotLine } from "@/components/mascot/mascot";
import { subjectIcon } from "@/components/subject-pad";
import { BrandLogo } from "@/components/brand";

/** Bac-up subject glyphs (drawn for the app, 24px grid). Other subjects fall back to the lucide icon. */
const GLYPHS: Record<string, React.ReactNode> = {
  maths: <><path d="M10.5 20c-1.2 0-1.8-.8-1.6-2.1L10.6 6c.3-1.6 1.1-2.5 2.6-2.5" /><path d="M14 9.5l4 5M18 9.5l-4 5M5 12h3" /></>,
  pc: <><path d="M9.5 3.5h5M10.5 3.5v5.2L5 18.3c-.7 1.2.2 2.2 1.4 2.2h11.2c1.2 0 2.1-1 1.4-2.2l-5.5-9.6V3.5" /><path d="M7.4 14.5c1.1-1 2.2-1 3.3 0s2.2 1 3.3 0 2.2-1 3.3 0" /></>,
  svt: <><path d="M5 19c0-8 5-13.5 14-14.5-.5 9-6 14.5-14 14.5z" /><path d="M5 19l9-9M9.5 14.5l-2-2M12 12l-1.3-2.8M12 12l2.8 1.3" /></>,
  philo: <><circle cx="12" cy="10" r="6.5" /><path d="M9.5 20.5h5M10 17.5h4M12 6.5v3.5l2 1.5" /></>,
  anglais: <><path d="M4 6.5h9M8.5 4v2.5M6 6.5c.5 3 2.5 5.5 5.5 6.5M11 6.5c-.7 3.3-3 6-6.5 7" /><path d="M12.5 20l3.5-8.5L19.5 20M13.8 17h4.4" /></>,
  francais: <path d="M18.5 4.5c-6 1-10.5 5.5-12 13l-1 3 2.5-2c4-.5 7.5-2.5 9-6l-3 .5 3.5-2c.5-2 .8-4.2 1-6.5z" />,
};
function glyphKey(code: string): string | null {
  const k = code.toLowerCase();
  if (GLYPHS[k]) return k;
  if (k.includes("math")) return "maths";
  if (k.includes("phys") || k.includes("chim")) return "pc";
  if (k.includes("svt") || k.includes("vie")) return "svt";
  if (k.includes("philo")) return "philo";
  if (k.includes("angl")) return "anglais";
  if (k.includes("fran")) return "francais";
  return null;
}
export function SubjectGlyph({ code, className = "sb-layer sb-glyph" }: { code: string; className?: string }) {
  const k = glyphKey(code);
  if (!k) { const L = subjectIcon(code); return <L className={className} strokeWidth={1.4} aria-hidden />; }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden>{GLYPHS[k]}</svg>
  );
}

type Card = { code: string; name: string; coeff: number | null; chapters: { id: string }[] };

/** Cover colours per subject: c1 = the light rising from the bottom, hi = corner light + glyph. Same hues as config/subjects.ts. */
const BOOK: Record<string, { c1: string; hi: string }> = {
  pc:       { c1: "#5B3FD1", hi: "#B9A8FF" },
  maths:    { c1: "#E2671A", hi: "#FFC79E" },
  svt:      { c1: "#0F9C6E", hi: "#9FF0CF" },
  philo:    { c1: "#4F55D8", hi: "#B8BCFF" },
  anglais:  { c1: "#D93C67", hi: "#FFB3C6" },
  francais: { c1: "#1797B4", hi: "#A6EBFA" },
  si:       { c1: "#1F8FD6", hi: "#B3E3FF" },
  arabe:    { c1: "#139C8C", hi: "#A6F1E7" },
  histgeo:  { c1: "#D4901A", hi: "#FFDDA0" },
  islamique:{ c1: "#24974C", hi: "#AEEFC4" },
  eco_gen:  { c1: "#2F74DC", hi: "#B7D2FF" },
  compta:   { c1: "#6F7F96", hi: "#D5DEEA" },
};
const DEFAULT_BOOK = { c1: "#6F7F96", hi: "#D5DEEA" };
export function bookColors(code: string) {
  const k = code.toLowerCase();
  return BOOK[k] ?? (k.includes("math") ? BOOK.maths : k.includes("phys") || k.includes("chim") ? BOOK.pc : k.includes("svt") ? BOOK.svt
    : k.includes("philo") ? BOOK.philo : k.includes("angl") ? BOOK.anglais : k.includes("fran") ? BOOK.francais : DEFAULT_BOOK);
}

/** Lessons done / total per subject, from lesson_completions (RLS: own rows only). */
function useProgress(cards: Card[]) {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const [pct, setPct] = useState<Record<string, number>>({});
  const key = cards.map((c) => `${c.code}:${c.chapters.length}`).join("|");
  useEffect(() => {
    let live = true;
    (async () => {
      const chapToSubj = new Map<string, string>();
      for (const c of cards) for (const ch of c.chapters) chapToSubj.set(ch.id, c.code);
      if (chapToSubj.size === 0) return;
      const [{ data: les }, { data: comp }] = await Promise.all([
        supabase.from("lessons").select("id, chapter_id").in("chapter_id", [...chapToSubj.keys()]).limit(3000),
        supabase.from("lesson_completions").select("lesson_id"),
      ]);
      if (!live || !les) return;
      const done = new Set((comp ?? []).map((r) => r.lesson_id as string));
      const tot: Record<string, [number, number]> = {};
      for (const l of les as { id: string; chapter_id: string }[]) {
        const s = chapToSubj.get(l.chapter_id); if (!s) continue;
        const t = (tot[s] ??= [0, 0]); t[1]++; if (done.has(l.id)) t[0]++;
      }
      const out: Record<string, number> = {};
      for (const [s, [d, t]] of Object.entries(tot)) out[s] = t ? Math.round((d / t) * 100) : 0;
      setPct(out);
    })();
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, supabase]);
  return pct;
}

export function SubjectShelf({ cards, onOpen }: { cards: Card[]; onOpen: (code: string) => void }) {
  const pct = useProgress(cards);
  return (
    // One line: every matière in a single row on desktop; a swipeable snap row on phone / tablet.
    <div className="no-scrollbar -mx-4 px-4 py-3 flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-4 sm:gap-6 lg:mx-0 lg:px-0 lg:grid lg:grid-flow-col lg:auto-cols-fr lg:gap-7 lg:overflow-visible">
      {cards.map((c, i) => (
        <SubjectBook key={c.code} card={c} index={i} pct={pct[c.code]} onOpen={onOpen} />
      ))}
    </div>
  );
}

function SubjectBook({ card, index, pct, onOpen }: { card: Card; index: number; pct?: number; onOpen: (code: string) => void }) {
  const b3d = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const [tracking, setTracking] = useState(false);
  const [pressed, setPressed] = useState(false);
  const has = card.chapters.length > 0;
  const col = bookColors(card.code);
  const isAr = /[\u0600-\u06FF]/.test(card.name);
  const p = pct ?? 0;
  const mastered = has && p >= 100;

  const tilt = (e: React.PointerEvent) => {
    const el = b3d.current; if (!el || !has) return;
    const r = el.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.setProperty("--ry", `${((x - 0.5) * 16).toFixed(2)}deg`);
      el.style.setProperty("--rx", `${((0.5 - y) * 12).toFixed(2)}deg`);
      el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
    });
  };
  const reset = () => {
    cancelAnimationFrame(raf.current);
    setTracking(false); setPressed(false);
    const el = b3d.current; if (!el) return;
    el.style.setProperty("--ry", "0deg"); el.style.setProperty("--rx", "0deg");
  };

  return (
    <button
      type="button"
      data-book={card.code}
      disabled={!has}
      aria-label={has ? `${card.name}, ${card.chapters.length} chapitres, ${p} %` : `${card.name}, bientôt`}
      onClick={() => has && onOpen(card.code)}
      onPointerMove={(e) => { if (e.pointerType === "mouse") { setTracking(true); tilt(e); } else if (pressed) tilt(e); }}
      onPointerDown={(e) => { if (e.pointerType !== "mouse" && has) { setPressed(true); setTracking(true); tilt(e); } }}
      onPointerUp={() => { if (pressed) reset(); }}
      onPointerCancel={reset}
      onPointerLeave={reset}
      className="sb-book group shrink-0 w-[40%] sm:w-[27%] lg:w-auto snap-start min-w-0 text-left flex flex-col gap-2 [container-type:inline-size] [-webkit-tap-highlight-color:transparent] disabled:cursor-default"
      style={{ ["--c1" as string]: col.c1, ["--hi" as string]: col.hi, ["--i" as string]: index }}
    >
      <div className="sb-stage">
        <div ref={b3d} className={`sb-b3d ${tracking ? "sb-tracking" : ""} ${pressed ? "sb-pressed" : ""}`}>
          <div className="sb-front">
            <span className="sb-glow" />
            <span className="sb-spine" />
            <span className="sb-sheen" />
            {!has && <span className="sb-soon">Bientôt</span>}
          </div>
          <div dir="auto" className="sb-layer sb-title">
            <span className={`sb-name ${isAr ? "sb-ar" : ""}`}>{card.name}</span>
            <small>{card.coeff != null ? `Coeff. ${card.coeff}` : ""}{card.coeff != null && has ? " · " : ""}{has ? `${card.chapters.length} chapitres` : ""}</small>
          </div>
          <SubjectGlyph code={card.code} />
          <div className="sb-layer sb-prog">
            {has && (
              <>
                <span className="sb-track"><i className={mastered ? "sb-ice" : ""} style={{ width: `${p}%` }} /></span>
                <span className="tabular-nums">{p}%</span>
              </>
            )}
            <span className="sb-mark" aria-hidden><BrandLogo size={16} /></span>
          </div>
        </div>
        <div className="sb-ground" />
      </div>
      <div className="min-w-0 px-0.5 -mt-0.5">
        <div dir="auto" className="text-[12.5px] sm:text-[13.5px] font-semibold tracking-tight truncate text-neutral-900 dark:text-white">{card.name}</div>
        <div className="text-[11px] sm:text-[12px] text-neutral-500 dark:text-neutral-400 truncate tabular-nums">
          {has ? `${card.chapters.length} chapitres · ${p} %` : "Bientôt"}
        </div>
      </div>
    </button>
  );
}

/**
 * Header with the same "book" material as the shelf: dark glass, the subject light rising
 * from the bottom-left, a corner light, the spine line, the glyph and the Bac Up mark.
 * Used for the subject, chapter-sommaire and reading headers so the whole Cours space
 * feels like opening the same book.
 */
export function BookHeader({ code, eyebrow, title, meta, progress, size = "lg", corner, mascot, children }: {
  code: string; eyebrow?: React.ReactNode; title: React.ReactNode; meta?: React.ReactNode;
  progress?: { pct: number; label?: string } | null; size?: "lg" | "sm";
  /** small control pinned to the bottom-right of the card (pager, part switch) */
  corner?: React.ReactNode; children?: React.ReactNode;
  /** Le Lauréat: médaillon on the card's top-right edge, its words open above the card */
  mascot?: MascotLine[];
}) {
  const col = bookColors(code);
  const vars = { ["--c1" as string]: col.c1, ["--hi" as string]: col.hi };
  const p = Math.max(0, Math.min(100, Math.round(progress?.pct ?? 0)));
  const card = (
    <section className={`bh ${size === "sm" ? "bh-sm" : ""}`} style={vars}>
      <span className="bh-glow" aria-hidden />
      <span className="bh-spine" aria-hidden />
      <SubjectGlyph code={code} className="bh-glyph" />
      <div className="relative min-w-0">
        {eyebrow && <div className="bh-eyebrow">{eyebrow}</div>}
        <h1 dir="auto" className="bh-title">{title}</h1>
        {meta && <div className="bh-meta">{meta}</div>}
        {progress && (
          <div className="bh-prog">
            <span className="sb-track"><i className={p >= 100 ? "sb-ice" : ""} style={{ width: `${p}%` }} /></span>
            <span className="tabular-nums">{progress.label ?? `${p} %`}</span>
            <span className="sb-mark" aria-hidden><BrandLogo size={16} /></span>
          </div>
        )}
        {(children || corner) && (
          <div className="bh-actions">
            {children}
            {corner && <div className="bh-corner">{corner}</div>}
          </div>
        )}
      </div>
    </section>
  );
  return mascot ? <Mascot lines={mascot} size={size === "sm" ? "sm" : "md"} style={vars}>{card}</Mascot> : card;
}
