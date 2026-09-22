"use client";

import { useMemo, useState } from "react";
import { Blocks, extractCards } from "./course-content";
import { Tex } from "@/components/math";
import { X, ChevronLeft, ChevronRight, Shuffle, RotateCw, Sparkles } from "lucide-react";

const LABEL: Record<string, string> = { definition: "Définition", theoreme: "Théorème", propriete: "Propriété" };
const PROMPT: Record<string, string> = { definition: "Définis", theoreme: "Énonce", propriete: "Rappelle la propriété" };

/** Full-screen révision deck: flip cards built from the chapter's key notions. */
export function FlashcardDeck({ bodies, onClose }: { bodies: string[]; onClose: () => void }) {
  const cards = useMemo(() => bodies.flatMap((b) => extractCards(b)), [bodies]);
  const [order, setOrder] = useState<number[]>(() => cards.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [flip, setFlip] = useState(false);

  if (cards.length === 0) {
    return (
      <Overlay onClose={onClose}>
        <div className="text-center text-neutral-400 py-16">Aucune carte à réviser dans ce chapitre.</div>
      </Overlay>
    );
  }

  const card = cards[order[pos]];
  const go = (d: number) => { setFlip(false); setPos((p) => (p + d + cards.length) % cards.length); };
  const shuffle = () => { setFlip(false); setPos(0); setOrder((o) => [...o].sort(() => Math.random() - 0.5)); };

  return (
    <Overlay onClose={onClose}>
      <div className="flex items-center justify-between mb-4">
        <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-arctic-blue dark:text-arctic-cyan"><Sparkles className="w-4 h-4" /> Flashcards · révision active</div>
        <div className="text-xs text-neutral-400">{pos + 1} / {cards.length}</div>
      </div>

      <button onClick={() => setFlip((f) => !f)}
        className="w-full min-h-[300px] rounded-3xl border border-black/[0.06] dark:border-white/[0.10] bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950 p-8 grid place-items-center text-center transition hover:-translate-y-0.5">
        {!flip ? (
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wide text-arctic-blue dark:text-arctic-cyan">{LABEL[card.kind] ?? "Notion"}</div>
            <div className="mt-3 text-2xl font-bold tracking-tight">{PROMPT[card.kind] ?? "Rappelle"}{card.title ? " :" : ""}</div>
            {card.title && <div className="mt-2 text-lg text-neutral-600 dark:text-neutral-300"><Tex>{card.title}</Tex></div>}
            <div className="mt-6 inline-flex items-center gap-1.5 text-xs text-neutral-400"><RotateCw className="w-3.5 h-3.5" /> Clique pour retourner</div>
          </div>
        ) : (
          <div className="text-left w-full max-w-xl mx-auto"><Blocks blocks={card.blocks} /></div>
        )}
      </button>

      <div className="mt-5 flex items-center justify-between">
        <button onClick={() => go(-1)} className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full glass hover:-translate-y-0.5 transition"><ChevronLeft className="w-4 h-4" /> Précédent</button>
        <button onClick={shuffle} className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full glass hover:-translate-y-0.5 transition"><Shuffle className="w-4 h-4" /> Mélanger</button>
        <button onClick={() => go(1)} className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white hover:brightness-105 transition">Suivant <ChevronRight className="w-4 h-4" /></button>
      </div>
    </Overlay>
  );
}

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-3xl glass p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full glass grid place-items-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition"><X className="w-4 h-4" /></button>
        {children}
      </div>
    </div>
  );
}
