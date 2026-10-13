"use client";

/**
 * Locked « Bientôt » state for the exam engine (FEATURES.examEngine = false).
 *   <SoonPill />            small glowing pill for tabs / cards
 *   <ExamsSoonPanel />      glass modal: construction bar + what the section will do
 *   <ExamsSoonGate />       full-page version for direct links (session runner, old exam page)
 * Copy + progress live in src/config (EXAMS_COMING_SOON).
 */
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { EXAMS_COMING_SOON } from "@/config";
import { Timer, X, Lock, FileText, Swords, Gauge, Target, ChevronLeft, HardHat, Lightbulb } from "lucide-react";

const ICONS = [FileText, Swords, Gauge, Lightbulb];

export function SoonPill({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-arctic-cyan/15 text-arctic-blue dark:text-arctic-cyan ring-1 ring-arctic-cyan/30 shadow-[0_0_12px_rgba(13,184,211,.25)] ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-arctic-cyan soon-dot" /> Bientôt
    </span>
  );
}

/** Animated construction bar — fills to EXAMS_COMING_SOON.progress on mount. */
function BuildBar() {
  const target = EXAMS_COMING_SOON.progress;
  const [w, setW] = useState(0);
  useEffect(() => { const id = requestAnimationFrame(() => setW(target)); return () => cancelAnimationFrame(id); }, [target]);
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-2">
        <span className="inline-flex items-center gap-1.5 font-semibold text-neutral-500 dark:text-neutral-400"><HardHat className="w-3.5 h-3.5" /> Construction en cours</span>
        <span className="font-bold tabular-nums text-arctic-blue dark:text-arctic-cyan">{target}%</span>
      </div>
      <div className="relative h-3 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden">
        <div className="soon-bar absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue shadow-[0_0_16px_rgba(13,184,211,.45)] transition-[width] duration-[1400ms] ease-out" style={{ width: `${w}%` }}>
          <span className="soon-stripes absolute inset-0 rounded-full" />
        </div>
      </div>
      <div className="mt-1.5 text-[11px] text-neutral-400">Presque prêt : on finalise les sujets et les corrigés.</div>
    </div>
  );
}

function SoonBody({ onClose }: { onClose?: () => void }) {
  const c = EXAMS_COMING_SOON;
  return (
    <>
      <div className="flex items-start gap-4">
        <span className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-arctic-cyan to-arctic-blue text-white grid place-items-center shadow-lg shadow-arctic-blue/30 shrink-0">
          <Timer className="w-7 h-7" />
          <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full glass grid place-items-center text-arctic-blue dark:text-arctic-cyan"><Lock className="w-3 h-3" /></span>
        </span>
        <div className="min-w-0 pr-8">
          <SoonPill />
          <h2 className="mt-1.5 text-2xl font-bold tracking-tight">{c.title}</h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{c.lead}</p>
        </div>
      </div>

      <div className="mt-6"><BuildBar /></div>

      <div className="mt-6 text-[11px] font-bold uppercase tracking-wide text-neutral-400">Ce que tu pourras faire</div>
      <div className="mt-2.5 grid sm:grid-cols-2 gap-2.5">
        {c.features.map((f, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <div key={f.t} className="rounded-2xl p-3.5 bg-black/[0.03] dark:bg-white/[0.04] flex items-start gap-3">
              <span className="w-8 h-8 rounded-xl bg-arctic-blue/10 text-arctic-blue dark:text-arctic-cyan grid place-items-center shrink-0"><Icon className="w-4 h-4" /></span>
              <div><div className="text-sm font-semibold">{f.t}</div><div className="text-xs text-neutral-400 leading-snug">{f.d}</div></div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-2xl p-3.5 ring-1 ring-arctic-cyan/25 bg-arctic-cyan/[0.06] text-sm text-neutral-600 dark:text-neutral-300 flex items-start gap-2.5">
        <Target className="w-4 h-4 mt-0.5 text-arctic-blue dark:text-arctic-cyan shrink-0" /> {c.meanwhile}
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-2">
        {onClose ? (
          <button onClick={onClose} className="inline-flex items-center gap-1.5 text-sm font-semibold px-5 py-2.5 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white hover:brightness-105 transition">
            <Target className="w-4 h-4" /> Continuer à m&apos;entraîner
          </button>
        ) : (
          <Link href="/dashboard/examens/preparation" className="inline-flex items-center gap-1.5 text-sm font-semibold px-5 py-2.5 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white hover:brightness-105 transition">
            <Target className="w-4 h-4" /> Aller à la Préparation
          </Link>
        )}
      </div>
    </>
  );
}

export function ExamsSoonPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open || typeof document === "undefined") return null;
  return createPortal((
    <div className="fixed inset-0 z-[60] grid place-items-center p-4 bg-black/55 backdrop-blur-sm fade-up" onClick={onClose} role="dialog" aria-modal="true" aria-label={EXAMS_COMING_SOON.title}>
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl glass p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Fermer" className="absolute top-4 right-4 w-9 h-9 rounded-full glass grid place-items-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition"><X className="w-4 h-4" /></button>
        <SoonBody onClose={onClose} />
      </div>
    </div>
  ), document.body);
}

/** Full-page lock for direct links into the exam engine. */
export function ExamsSoonGate() {
  return (
    <div className="max-w-xl mx-auto py-8 fade-up">
      <Link href="/dashboard/examens/preparation" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white"><ChevronLeft className="w-4 h-4" /> Préparation</Link>
      <div className="mt-4 rounded-3xl glass p-6"><SoonBody /></div>
    </div>
  );
}
