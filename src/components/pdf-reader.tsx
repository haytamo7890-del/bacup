"use client";

import { useState } from "react";
import { ChevronLeft, FileText, CheckCircle2, Lock, ExternalLink, Download } from "lucide-react";

/**
 * In-platform PDF reader — files open INSIDE the app (like monbac.ma), never a
 * new tab. When a corrigé exists, a green toggle (SVT-emerald) flips the same
 * viewer to the correction. If the corrigé is locked (demo), the toggle routes
 * to the paywall instead.
 */
export function PdfReader({
  title, subtitle, sujetUrl, corrigeUrl, corrigeLocked = false,
  initialMode = "sujet", onBack, onUpgrade,
}: {
  title: string; subtitle?: string; sujetUrl: string; corrigeUrl?: string | null;
  corrigeLocked?: boolean; initialMode?: "sujet" | "corrige";
  onBack: () => void; onUpgrade?: () => void;
}) {
  const hasCorrige = !!corrigeUrl;
  const [mode, setMode] = useState<"sujet" | "corrige">(hasCorrige && !corrigeLocked ? initialMode : "sujet");
  const url = mode === "corrige" && corrigeUrl ? corrigeUrl : sujetUrl;

  function clickCorrige() {
    if (!hasCorrige) return;
    if (corrigeLocked) { onUpgrade?.(); return; }
    setMode("corrige");
  }

  return (
    <div className="max-w-5xl mx-auto py-6 fade-up">
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
          <ChevronLeft className="w-4 h-4" /> Retour
        </button>
        <div className="flex-1 min-w-0">
          <div className="font-bold tracking-tight truncate">{title}</div>
          {subtitle && <div className="text-[11px] text-neutral-400 truncate">{subtitle}</div>}
        </div>

        <div className="inline-flex rounded-full glass p-1 gap-1">
          <button onClick={() => setMode("sujet")}
            className={`inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-full transition ${mode === "sujet" ? "bg-arctic-blue/15 text-arctic-blue dark:text-arctic-cyan" : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"}`}>
            <FileText className="w-4 h-4" /> Sujet
          </button>
          {hasCorrige && (
            <button onClick={clickCorrige} title={corrigeLocked ? "Débloque le corrigé" : "Voir le corrigé"}
              className={`inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-full transition ${mode === "corrige" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25" : "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"}`}>
              {corrigeLocked ? <Lock className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />} Corrigé
            </button>
          )}
        </div>

        <a href={url} target="_blank" rel="noopener noreferrer" title="Ouvrir dans un onglet" className="w-9 h-9 rounded-full glass grid place-items-center text-neutral-400 hover:text-arctic-blue transition"><ExternalLink className="w-4 h-4" /></a>
        <a href={url} download title="Télécharger" className="w-9 h-9 rounded-full glass grid place-items-center text-neutral-400 hover:text-arctic-blue transition"><Download className="w-4 h-4" /></a>
      </div>

      {mode === "corrige" && (
        <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-full px-3 py-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> Corrigé — correction détaillée
        </div>
      )}

      <div className="mt-3 glass rounded-2xl overflow-hidden">
        <iframe key={url} src={url} title={title} className="w-full h-[78vh] bg-white" />
      </div>
    </div>
  );
}
