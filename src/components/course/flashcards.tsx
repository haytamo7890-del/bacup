"use client";

/**
 * Flashcards — active recall + spaced repetition, built from the cours itself.
 *
 *  · Cards = every memorisable callout of the cours (définition, théorème, propriété, à retenir,
 *    méthode, piège… and the EN / AR equivalents), tagged with the notion they belong to.
 *  · Scope: « Ce cours » (the notion page you are reading) or « Tout le chapitre ».
 *  · Always shuffled. Cards that are due or weak come first, the rest after (each group shuffled).
 *  · After flipping, the student grades himself: À revoir (comes back in 3 cards) · Presque (end of
 *    the deck) · Je savais (done). Memory per card is kept on this device (Leitner boxes:
 *    1 → 3 → 7 → 14 → 30 days), so the next session starts with what is about to be forgotten.
 *  · Keyboard: Espace retourner · 1 2 3 noter · S mélanger · Échap fermer.
 * Only transform / opacity animate (3D flip on the compositor).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, Shuffle, RotateCw, RotateCcw } from "lucide-react";
import { Blocks, extractDeck, CARD_KINDS, type DeckCard } from "./course-content";
import { bookColors, SubjectGlyph } from "./subject-book";
import { Tex } from "@/components/math";

type Mem = { b: number; d: number };            // Leitner box 0..5, due date (ms)
const MEM_KEY = "bacup.fc.v1";
const DAYS = [0, 1, 3, 7, 14, 30];
const DAY = 86_400_000;

function loadMem(): Record<string, Mem> {
  try { return JSON.parse(localStorage.getItem(MEM_KEY) ?? "{}") as Record<string, Mem>; } catch { return {}; }
}
function saveMem(m: Record<string, Mem>) {
  try { localStorage.setItem(MEM_KEY, JSON.stringify(m)); } catch { /* private mode */ }
}
function shuffled<T>(a: T[]): T[] {
  const r = [...a];
  for (let k = r.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [r[k], r[j]] = [r[j], r[k]]; }
  return r;
}
/** Due or weak first, then the rest — each group shuffled. */
function buildQueue(cards: DeckCard[], mem: Record<string, Mem>): string[] {
  const now = Date.now();
  const urgent: string[] = []; const fresh: string[] = []; const later: string[] = [];
  for (const c of cards) {
    const m = mem[c.id];
    if (!m) fresh.push(c.id);
    else if (m.d <= now || m.b <= 1) urgent.push(c.id);
    else later.push(c.id);
  }
  return [...shuffled(urgent), ...shuffled(fresh), ...shuffled(later)];
}

export function FlashcardDeck({ lessons, currentLessonId, subjectCode, chapterName, onClose }: {
  lessons: { id: string; title: string; body: string | null }[];
  currentLessonId?: string | null;
  subjectCode: string;
  chapterName: string;
  onClose: () => void;
}) {
  const all = useMemo(() => lessons.flatMap((l) => extractDeck(l)), [lessons]);
  const lessonCards = useMemo(() => (currentLessonId ? all.filter((c) => c.lessonId === currentLessonId) : []), [all, currentLessonId]);
  const [scope, setScope] = useState<"lesson" | "chapter">(lessonCards.length >= 3 ? "lesson" : "chapter");
  const cards = scope === "lesson" && lessonCards.length ? lessonCards : all;
  const byId = useMemo(() => new Map(all.map((c) => [c.id, c])), [all]);

  const mem = useRef<Record<string, Mem>>({});
  const [queue, setQueue] = useState<string[]>([]);
  const [flip, setFlip] = useState(false);
  const [known, setKnown] = useState(0);
  const [first, setFirst] = useState<Record<string, number>>({});   // grade at first sight
  const [hard, setHard] = useState<Set<string>>(new Set());

  const start = useCallback((ids?: string[]) => {
    mem.current = loadMem();
    const pool = ids ? ids.map((id) => byId.get(id)).filter(Boolean) as DeckCard[] : cards;
    setQueue(buildQueue(pool, mem.current));
    setFlip(false); setKnown(0); setFirst({}); setHard(new Set());
  }, [byId, cards]);

  // (re)start when the deck or the scope changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { start(); }, [scope, all.length]);

  const total = known + queue.length;
  const card = queue.length ? byId.get(queue[0]) ?? null : null;
  const dueCount = useMemo(() => {
    const m = typeof window === "undefined" ? {} : loadMem(); const now = Date.now();
    return cards.filter((c) => m[c.id] && m[c.id].d <= now).length;
  }, [cards]);

  const grade = useCallback((g: 0 | 1 | 2) => {
    if (!card) return;
    const m = mem.current[card.id] ?? { b: 0, d: 0 };
    const b = g === 2 ? Math.min(5, m.b + 1) : g === 1 ? Math.max(1, m.b) : 0;
    mem.current[card.id] = { b, d: Date.now() + (g === 0 ? 0 : g === 1 ? DAY : DAYS[b] * DAY) };
    saveMem(mem.current);
    setFirst((f) => (card.id in f ? f : { ...f, [card.id]: g }));
    if (g === 0) setHard((h) => new Set(h).add(card.id));
    setFlip(false);
    setQueue((q) => {
      const [head, ...rest] = q;
      if (g === 2) return rest;
      if (g === 1) return [...rest, head];
      const at = Math.min(3, rest.length);
      return [...rest.slice(0, at), head, ...rest.slice(at)];
    });
    if (g === 2) setKnown((k) => k + 1);
  }, [card]);

  const skip = () => { setFlip(false); setQueue((q) => (q.length > 1 ? [...q.slice(1), q[0]] : q)); };
  const reshuffle = () => { setFlip(false); setQueue((q) => shuffled(q)); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (!card) return;
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); setFlip((f) => !f); }
      else if (flip && (e.key === "1" || e.key === "2" || e.key === "3")) grade((Number(e.key) - 1) as 0 | 1 | 2);
      else if (e.key.toLowerCase() === "s") reshuffle();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [card, flip, grade, onClose]);

  const col = bookColors(subjectCode);
  const meta = card ? CARD_KINDS[card.kind] ?? { label: "Notion", prompt: "Rappelle" } : null;
  const firstTry = Object.values(first).filter((g) => g === 2).length;

  if (typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-[70] grid place-items-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Flashcards"
        style={{ ["--c1" as string]: col.c1, ["--hi" as string]: col.hi }}>

        {/* top bar */}
        <div className="flex items-center gap-3 text-white">
          <div className="min-w-0 flex-1">
            <div className="text-[12px] font-semibold text-white/55">Flashcards · {chapterName}</div>
            <div className="text-[15px] font-semibold tabular-nums">
              {total === 0 ? "Aucune carte" : `${known} / ${total} mémorisées`}
              {dueCount > 0 && <span className="ml-2 text-[12px] font-medium text-white/55">· {dueCount} à revoir aujourd&apos;hui</span>}
            </div>
          </div>
          {lessonCards.length > 0 && lessonCards.length < all.length && (
            <div className="fc-seg" role="group" aria-label="Portée">
              <button type="button" aria-pressed={scope === "lesson"} onClick={() => setScope("lesson")}>Ce cours <span>{lessonCards.length}</span></button>
              <button type="button" aria-pressed={scope === "chapter"} onClick={() => setScope("chapter")}>Chapitre <span>{all.length}</span></button>
            </div>
          )}
          <button type="button" onClick={onClose} aria-label="Fermer" className="w-9 h-9 rounded-full grid place-items-center bg-white/10 hover:bg-white/15 transition shrink-0"><X className="w-4 h-4" /></button>
        </div>
        <div className="mt-3 h-1 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full bg-white transition-[width] duration-500" style={{ width: `${total ? (known / total) * 100 : 0}%` }} />
        </div>

        {all.length === 0 ? (
          <div className="mt-5 fc-face fc-front grid place-items-center text-center p-10 h-[260px]">
            <p className="text-white/70 text-sm max-w-xs">Ce chapitre n&apos;a pas encore de définitions ou de propriétés à mémoriser.</p>
          </div>
        ) : !card ? (
          // session summary
          <div className="mt-5 fc-face fc-front p-8 text-center">
            <span className="fc-glow" aria-hidden />
            <div className="relative">
              <div className="text-[13px] font-semibold text-white/60">Session terminée</div>
              <div className="mt-1 text-3xl font-bold tracking-tight">{total} carte{total > 1 ? "s" : ""} mémorisée{total > 1 ? "s" : ""}</div>
              <div className="mt-6 grid grid-cols-2 gap-3 max-w-sm mx-auto">
                <div className="rounded-2xl bg-white/[0.07] p-4"><div className="text-2xl font-bold tabular-nums">{firstTry}</div><div className="text-[12px] text-white/60">du premier coup</div></div>
                <div className="rounded-2xl bg-white/[0.07] p-4"><div className="text-2xl font-bold tabular-nums">{hard.size}</div><div className="text-[12px] text-white/60">à retravailler</div></div>
              </div>
              <p className="mt-5 text-[13px] text-white/60">Les cartes difficiles reviendront en premier à ta prochaine session.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {hard.size > 0 && <button type="button" onClick={() => start([...hard])} className="fc-btn fc-btn-primary"><RotateCcw className="w-4 h-4" /> Revoir les {hard.size} difficiles</button>}
                <button type="button" onClick={() => start()} className="fc-btn"><Shuffle className="w-4 h-4" /> Nouvelle session</button>
                <button type="button" onClick={onClose} className="fc-btn">Fermer</button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* the card */}
            <div className="mt-5 fc" onClick={() => setFlip((f) => !f)} role="button" tabIndex={0} aria-label={flip ? "Retourner vers la question" : "Retourner la carte"}>
              <div className={`fc-inner ${flip ? "fc-flipped" : ""}`} key={card.id}>
                <div className="fc-face fc-front">
                  <span className="fc-glow" aria-hidden />
                  <SubjectGlyph code={subjectCode} className="fc-glyph" />
                  <div className="relative h-full flex flex-col p-7 sm:p-9">
                    <div className="text-[12px] font-semibold text-white/60" dir="auto">{meta!.label}{card.notion ? <> · <Tex>{card.notion}</Tex></> : null}</div>
                    <div className="flex-1 grid place-items-center text-center">
                      <div>
                        <div dir="auto" className="text-[22px] sm:text-[26px] font-bold tracking-tight leading-tight">{meta!.prompt}{card.title ? " :" : ""}</div>
                        {card.title && <div dir="auto" className="mt-3 text-[17px] sm:text-[19px] text-white/85"><Tex>{card.title}</Tex></div>}
                        {!card.title && card.notion && <div dir="auto" className="mt-3 text-[15px] text-white/60">dans « <Tex>{card.notion}</Tex> »</div>}
                      </div>
                    </div>
                    <div className="text-[12px] text-white/45 inline-flex items-center gap-1.5 justify-center"><RotateCw className="w-3.5 h-3.5" /> Touche la carte ou Espace pour voir la réponse</div>
                  </div>
                </div>
                <div className="fc-face fc-back">
                  <div className="h-full overflow-y-auto p-6 sm:p-7 text-left" onClick={(e) => e.stopPropagation()}>
                    <div className="text-[12px] font-semibold text-neutral-400 mb-2" dir="auto">{meta!.label}{card.title ? <> · <Tex>{card.title}</Tex></> : null}</div>
                    <Blocks blocks={card.blocks} />
                  </div>
                </div>
              </div>
            </div>

            {/* controls */}
            {!flip ? (
              <div className="mt-4 flex items-center justify-between gap-2">
                <button type="button" onClick={skip} className="fc-btn">Passer</button>
                <button type="button" onClick={reshuffle} className="fc-btn" aria-label="Mélanger (S)"><Shuffle className="w-4 h-4" /> <span className="hidden sm:inline">Mélanger</span></button>
                <button type="button" onClick={() => setFlip(true)} className="fc-btn fc-btn-primary"><RotateCw className="w-4 h-4" /> Voir la réponse</button>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-3 gap-2">
                <button type="button" onClick={() => grade(0)} className="fc-grade fc-g0">À revoir<kbd>1</kbd></button>
                <button type="button" onClick={() => grade(1)} className="fc-grade fc-g1">Presque<kbd>2</kbd></button>
                <button type="button" onClick={() => grade(2)} className="fc-grade fc-g2">Je savais<kbd>3</kbd></button>
              </div>
            )}
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
