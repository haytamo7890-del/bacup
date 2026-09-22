"use client";

import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Tex } from "@/components/math";
import { X, Check, ChevronRight, RotateCw, Trophy, Target, PartyPopper } from "lucide-react";

export type PQOption = { label: string; correct: boolean };
export type PQItem = { statement: string; options: PQOption[]; solution?: string; notion?: string };

/**
 * Inline practice overlay — launched from a cours funnel. The student answers
 * one question at a time with instant correction, then closes to resume the
 * cours exactly where they were (no navigation = no lost place).
 */
export function PracticeQuiz({ notion, items, onClose }: { notion: string; items: PQItem[]; onClose: () => void }) {
  // Shuffle each question's options randomly (Fisher–Yates), so the correct
  // answer lands anywhere — no predictable A,B,C,D pattern. Memoised so the
  // order stays stable while the quiz is open.
  const deck = useMemo(() => {
    const shuffle = <T,>(arr: T[]): T[] => {
      const r = [...arr];
      for (let k = r.length - 1; k > 0; k--) {
        const j = Math.floor(Math.random() * (k + 1));
        [r[k], r[j]] = [r[j], r[k]];
      }
      return r;
    };
    return items.filter((q) => q.options?.length).map((q) => ({ ...q, options: shuffle(q.options) }));
  }, [items]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = deck[i];
  const answered = picked !== null;

  const choose = (idx: number) => {
    if (answered) return;
    setPicked(idx);
    if (q.options[idx].correct) setScore((s) => s + 1);
  };
  const next = () => {
    if (i + 1 >= deck.length) { setDone(true); return; }
    setI(i + 1); setPicked(null);
  };
  const restart = () => { setI(0); setPicked(null); setScore(0); setDone(false); };

  if (typeof document === "undefined") return null;
  return createPortal((
    <div className="fixed inset-0 z-[60] grid place-items-center p-4 bg-black/55 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-3xl glass p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full glass grid place-items-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition"><X className="w-4 h-4" /></button>

        {deck.length === 0 ? (
          <div className="py-16 text-center text-neutral-400">Aucun exercice pour cette notion (bientôt).</div>
        ) : done ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-arctic-cyan to-arctic-blue text-white grid place-items-center shadow-lg shadow-arctic-blue/30">
              {score === deck.length ? <PartyPopper className="w-7 h-7" /> : <Trophy className="w-7 h-7" />}
            </div>
            <div className="mt-4 text-3xl font-extrabold tracking-tight">{score} / {deck.length}</div>
            <div className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {score === deck.length ? "Parfait ! Notion maîtrisée. 🎉" : score >= deck.length * 0.6 ? "Bien joué — quelques révisions et c'est parfait." : "Relis la notion, puis retente."}
            </div>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button onClick={restart} className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full glass hover:-translate-y-0.5 transition"><RotateCw className="w-4 h-4" /> Recommencer</button>
              <button onClick={onClose} className="inline-flex items-center gap-1.5 text-sm font-semibold px-5 py-2 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white hover:brightness-105 transition">Continuer le cours <ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-1">
              <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-arctic-blue dark:text-arctic-cyan"><Target className="w-4 h-4" /> Entraînement · {notion}</div>
              <div className="text-xs text-neutral-400">{i + 1} / {deck.length}</div>
            </div>
            <div className="h-1.5 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden mb-4"><div className="h-full bg-arctic-blue transition-all duration-300" style={{ width: `${(i / deck.length) * 100}%` }} /></div>

            <div className="text-[16px] font-semibold leading-relaxed"><Tex>{q.statement}</Tex></div>

            <div className="mt-4 space-y-2.5">
              {q.options.map((o, idx) => {
                const isPicked = picked === idx;
                const showRight = answered && o.correct;
                const showWrong = answered && isPicked && !o.correct;
                return (
                  <button key={idx} onClick={() => choose(idx)} disabled={answered}
                    className={`w-full text-left px-4 py-3 rounded-2xl border flex items-center gap-3 transition ${
                      showRight ? "border-emerald-500 bg-emerald-500/10" :
                      showWrong ? "border-red-500 bg-red-500/10" :
                      "border-black/[0.08] dark:border-white/[0.10] hover:border-arctic-blue/60 hover:bg-arctic-blue/[0.04]"} ${answered ? "cursor-default" : ""}`}>
                    <span className={`w-6 h-6 rounded-lg grid place-items-center text-xs font-bold shrink-0 ${
                      showRight ? "bg-emerald-500 text-white" : showWrong ? "bg-red-500 text-white" : "bg-black/[0.05] dark:bg-white/[0.08] text-neutral-500"}`}>
                      {showRight ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1"><Tex>{o.label}</Tex></span>
                  </button>
                );
              })}
            </div>

            {answered && (
              <div className="mt-4 rounded-2xl border-l-[3px] border-emerald-500/50 bg-emerald-500/[0.05] p-4">
                <div className="text-[11px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-300 mb-1">Correction</div>
                <div className="text-sm text-neutral-700 dark:text-neutral-200 leading-relaxed">{q.solution ? <Tex>{q.solution}</Tex> : "—"}</div>
                <div className="mt-3 flex justify-end">
                  <button onClick={next} className="inline-flex items-center gap-1.5 text-sm font-semibold px-5 py-2 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white hover:brightness-105 transition">
                    {i + 1 >= deck.length ? "Voir le score" : "Suivant"} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  ), document.body);
}
