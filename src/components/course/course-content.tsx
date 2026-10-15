"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import katex from "katex";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { CourseFigure } from "./figures";
import {
  BookMarked, Sigma, CheckCircle2, Lightbulb, Wrench, Info, AlertTriangle, ListTree, ChevronDown, ScrollText, Check, PencilLine, Target, ChevronRight, FlaskConical, Microscope, FileText, Bookmark,
} from "lucide-react";

/** Interactive context: mastery toggles + the practice-overlay launcher (funnels). */
const InteractiveCtx = createContext<{ mastered: Set<string>; toggle: (k: string) => void; practice?: (notion: string) => void; canPractice?: (notion: string) => boolean; train?: (notion: string) => void } | null>(null);

/** Funnel CTA — opens the inline practice overlay for a notion, then resumes the cours. */
function FunnelCTA({ notion, onClick, onTrain }: { notion: string; onClick: () => void; onTrain?: () => void }) {
  // Primary: the Espace de préparation runner for this notion (records XP, mastery level, review queue).
  // Secondary: a quick inline self-test that keeps the student on the cours.
  if (!onTrain) {
    return (
      <button onClick={onClick} className="mt-4 w-full group rounded-2xl border border-arctic-blue/30 bg-gradient-to-r from-arctic-blue/[0.07] to-arctic-cyan/[0.04] px-4 py-3 flex items-center justify-between gap-3 hover:border-arctic-blue/60 hover:shadow-md hover:shadow-arctic-blue/10 transition">
        <span className="flex items-center gap-2.5 text-left min-w-0">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-arctic-cyan to-arctic-blue text-white grid place-items-center shrink-0 shadow-sm shadow-arctic-blue/25"><Target className="w-4 h-4" /></span>
          <span className="min-w-0">
            <span className="block text-sm font-bold tracking-tight">Teste-toi sur cette notion</span>
            <span className="block text-[12px] text-neutral-500 dark:text-neutral-400 truncate">Exercices corrigés · tu reviens ensuite au cours</span>
          </span>
        </span>
        <ChevronRight className="w-5 h-5 text-arctic-blue dark:text-arctic-cyan shrink-0 group-hover:translate-x-0.5 transition" />
      </button>
    );
  }
  return (
    <div className="mt-4 w-full rounded-2xl border border-arctic-blue/30 bg-gradient-to-r from-arctic-blue/[0.07] to-arctic-cyan/[0.04] p-2 flex flex-wrap items-center gap-2">
      <button onClick={onTrain} title={notion} className="flex-1 min-w-[13rem] group rounded-xl px-2.5 py-2 flex items-center gap-2.5 text-left min-w-0 hover:bg-arctic-blue/[0.06] transition">
        <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-arctic-cyan to-arctic-blue text-white grid place-items-center shrink-0 shadow-sm shadow-arctic-blue/25"><Target className="w-4.5 h-4.5" /></span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold tracking-tight">M&apos;entraîner sur cette notion</span>
          <span className="block text-[12px] text-neutral-500 dark:text-neutral-400 truncate">Préparation · XP, niveau de maîtrise, révision espacée</span>
        </span>
        <ChevronRight className="w-5 h-5 text-arctic-blue dark:text-arctic-cyan shrink-0 group-hover:translate-x-0.5 transition" />
      </button>
      <button onClick={onClick} className="shrink-0 ml-auto text-[12px] font-semibold px-3.5 py-2 rounded-xl bg-white/60 dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-300 hover:text-arctic-blue dark:hover:text-arctic-cyan transition">
        Test rapide
      </button>
    </div>
  );
}

/** Explicit `:::funnel Notion` block — reads the practice launcher from context. */
function FunnelBlock({ notion }: { notion: string }) {
  const ctx = useContext(InteractiveCtx);
  if (!ctx?.practice) return null;
  if (ctx.canPractice && !ctx.canPractice(notion)) return null; // hide when the notion has no exercises yet
  return <FunnelCTA notion={notion} onClick={() => ctx.practice!(notion)} onTrain={ctx.train ? () => ctx.train!(notion) : undefined} />;
}

/* ------------------------------ inline text ------------------------------ */
// Handles **bold** and inline $...$ math inside a text run.
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const parts = text.split(/(\$[^$]+\$)/g);
  parts.forEach((p, i) => {
    if (p.length > 1 && p.startsWith("$") && p.endsWith("$")) {
      const html = katex.renderToString(p.slice(1, -1), { throwOnError: false, displayMode: false });
      out.push(<span key={`m${i}`} dangerouslySetInnerHTML={{ __html: html }} />);
    } else {
      p.split(/(\*\*[^*]+\*\*)/g).forEach((b, j) => {
        if (b.length > 3 && b.startsWith("**") && b.endsWith("**")) out.push(<strong key={`b${i}-${j}`} className="font-bold text-neutral-900 dark:text-white">{b.slice(2, -2)}</strong>);
        else if (b) out.push(<span key={`t${i}-${j}`}>{b}</span>);
      });
    }
  });
  return out;
}

function DisplayMath({ tex }: { tex: string }) {
  const html = katex.renderToString(tex, { throwOnError: false, displayMode: true });
  return (
    <div className="my-4 flex justify-center">
      <div className="max-w-full overflow-x-auto rounded-xl bg-black/[0.025] dark:bg-white/[0.04] ring-1 ring-black/[0.03] dark:ring-white/[0.05] px-5 py-3" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

/* ------------------------------ block model ------------------------------ */
export type Block =
  | { t: "p"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[] }
  | { t: "display"; tex: string }
  | { t: "figure"; name: string; caption?: string }
  | { t: "table"; head: string[]; rows: string[][] }
  | { t: "callout"; kind: string; title?: string; body: Block[]; id?: string };

export function parseBlocks(lines: string[]): Block[] {
  const blocks: Block[] = [];
  let i = 0;
  let para: string[] = [];
  const flushPara = () => { if (para.length) { blocks.push({ t: "p", text: para.join(" ") }); para = []; } };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // callout fence  :::kind Title ... :::
    const fence = trimmed.match(/^:::\s*([a-z]+)\s*(.*)$/i);
    if (fence) {
      flushPara();
      const kind = fence[1].toLowerCase();
      const title = fence[2].trim() || undefined;
      const inner: string[] = [];
      i++;
      let depth = 1; // depth-aware so nested fences (e.g. :::solution inside :::app) work
      while (i < lines.length) {
        const t = lines[i].trim();
        if (/^:::\s*[a-z]/i.test(t)) { depth++; inner.push(lines[i]); i++; continue; }
        if (t === ":::") { depth--; if (depth === 0) { i++; break; } inner.push(lines[i]); i++; continue; }
        inner.push(lines[i]); i++;
      }
      blocks.push({ t: "callout", kind, title, body: parseBlocks(inner) });
      continue;
    }

    // figure  [[fig:name]] caption
    const fig = trimmed.match(/^\[\[fig:([\w-]+)\]\]\s*(.*)$/);
    if (fig) { flushPara(); blocks.push({ t: "figure", name: fig[1], caption: fig[2] || undefined }); i++; continue; }

    // markdown table  | a | b |  /  | --- | --- |  / rows…
    if (trimmed.startsWith("|") && trimmed.endsWith("|") && i + 1 < lines.length && /^\|[\s:|-]+\|$/.test(lines[i + 1].trim())) {
      flushPara();
      const parseRow = (l: string) => l.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
      const head = parseRow(lines[i]); i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) { rows.push(parseRow(lines[i])); i++; }
      blocks.push({ t: "table", head, rows });
      continue;
    }

    // display math block:  $$ ... $$  (single or multi-line)
    if (trimmed === "$$") {
      flushPara();
      const buf: string[] = []; i++;
      while (i < lines.length && lines[i].trim() !== "$$") { buf.push(lines[i]); i++; }
      i++;
      blocks.push({ t: "display", tex: buf.join(" ").trim() });
      continue;
    }
    const oneLineDisplay = trimmed.match(/^\$\$(.+)\$\$$/);
    if (oneLineDisplay) { flushPara(); blocks.push({ t: "display", tex: oneLineDisplay[1].trim() }); i++; continue; }

    // ordered list
    if (/^\d+\.\s+/.test(trimmed)) {
      flushPara();
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) { items.push(lines[i].trim().replace(/^\d+\.\s+/, "")); i++; }
      blocks.push({ t: "ol", items });
      continue;
    }
    // unordered list
    if (/^[-•]\s+/.test(trimmed)) {
      flushPara();
      const items: string[] = [];
      while (i < lines.length && /^[-•]\s+/.test(lines[i].trim())) { items.push(lines[i].trim().replace(/^[-•]\s+/, "")); i++; }
      blocks.push({ t: "ul", items });
      continue;
    }

    if (trimmed === "") { flushPara(); i++; continue; }
    para.push(trimmed); i++;
  }
  flushPara();
  return blocks;
}

/* ------------------------------ callout styles ------------------------------ */
const CO: Record<string, { label: string; icon: typeof Info; bar: string; bg: string; tile: string; text: string; collapsible?: boolean }> = {
  definition:    { label: "Définition",   icon: BookMarked,   bar: "border-arctic-blue/60",  bg: "bg-arctic-blue/[0.05]",  tile: "bg-arctic-blue/15 text-arctic-blue dark:text-arctic-cyan", text: "text-arctic-blue dark:text-arctic-cyan" },
  theoreme:      { label: "Théorème",     icon: Sigma,        bar: "border-indigo-500/60",   bg: "bg-indigo-500/[0.05]",   tile: "bg-indigo-500/15 text-indigo-500 dark:text-indigo-300", text: "text-indigo-500 dark:text-indigo-300" },
  propriete:     { label: "Propriété",    icon: CheckCircle2, bar: "border-violet-500/60",   bg: "bg-violet-500/[0.05]",   tile: "bg-violet-500/15 text-violet-500 dark:text-violet-300", text: "text-violet-500 dark:text-violet-300" },
  exemple:       { label: "Exemple",      icon: Lightbulb,    bar: "border-emerald-500/60",  bg: "bg-emerald-500/[0.05]",  tile: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300", text: "text-emerald-600 dark:text-emerald-300" },
  methode:       { label: "Méthode type", icon: Wrench,       bar: "border-sky-500/60",      bg: "bg-sky-500/[0.05]",      tile: "bg-sky-500/15 text-sky-600 dark:text-sky-300", text: "text-sky-600 dark:text-sky-300" },
  remarque:      { label: "Remarque",     icon: Info,         bar: "border-neutral-400/50",  bg: "bg-neutral-400/[0.05]",  tile: "bg-neutral-400/15 text-neutral-500 dark:text-neutral-300", text: "text-neutral-500 dark:text-neutral-300" },
  attention:     { label: "Attention",    icon: AlertTriangle,bar: "border-amber-500/60",    bg: "bg-amber-500/[0.06]",    tile: "bg-amber-500/15 text-amber-600 dark:text-amber-300", text: "text-amber-600 dark:text-amber-300" },
  aretenir:      { label: "À retenir",    icon: Bookmark,     bar: "border-arctic-cyan/60",  bg: "bg-gradient-to-br from-arctic-cyan/[0.10] to-arctic-blue/[0.04]", tile: "bg-arctic-cyan/20 text-arctic-blue dark:text-arctic-cyan", text: "text-arctic-blue dark:text-arctic-cyan" },
  demonstration: { label: "Démonstration",icon: ScrollText,   bar: "border-neutral-400/40",  bg: "bg-black/[0.02] dark:bg-white/[0.03]", tile: "bg-neutral-400/15 text-neutral-500 dark:text-neutral-300", text: "text-neutral-500 dark:text-neutral-300", collapsible: true },
  solution:      { label: "Correction",   icon: CheckCircle2, bar: "border-emerald-500/50",  bg: "bg-emerald-500/[0.05]",  tile: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300", text: "text-emerald-600 dark:text-emerald-300", collapsible: true },
  experience:    { label: "Expérience",    icon: FlaskConical, bar: "border-teal-500/60",     bg: "bg-teal-500/[0.05]",     tile: "bg-teal-500/15 text-teal-600 dark:text-teal-300", text: "text-teal-600 dark:text-teal-300" },
  observation:   { label: "Observation",   icon: Microscope,   bar: "border-teal-500/50",     bg: "bg-teal-500/[0.04]",     tile: "bg-teal-500/15 text-teal-600 dark:text-teal-300", text: "text-teal-600 dark:text-teal-300" },
  document:      { label: "Document",      icon: FileText,     bar: "border-cyan-500/60",     bg: "bg-cyan-500/[0.05]",     tile: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300", text: "text-cyan-600 dark:text-cyan-300" },
  // English-workbook callouts
  rule:          { label: "Rule",         icon: BookMarked,   bar: "border-arctic-blue/60",  bg: "bg-arctic-blue/[0.05]",  tile: "bg-arctic-blue/15 text-arctic-blue dark:text-arctic-cyan", text: "text-arctic-blue dark:text-arctic-cyan" },
  example:       { label: "Example",      icon: Lightbulb,    bar: "border-emerald-500/60",  bg: "bg-emerald-500/[0.05]",  tile: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300", text: "text-emerald-600 dark:text-emerald-300" },
  tip:           { label: "Tip",          icon: Info,         bar: "border-sky-500/60",      bg: "bg-sky-500/[0.05]",      tile: "bg-sky-500/15 text-sky-600 dark:text-sky-300", text: "text-sky-600 dark:text-sky-300" },
  remember:      { label: "Remember",     icon: Bookmark,     bar: "border-arctic-cyan/60",  bg: "bg-gradient-to-br from-arctic-cyan/[0.10] to-arctic-blue/[0.04]", tile: "bg-arctic-cyan/20 text-arctic-blue dark:text-arctic-cyan", text: "text-arctic-blue dark:text-arctic-cyan" },
  mistake:       { label: "Common mistake", icon: AlertTriangle, bar: "border-amber-500/60", bg: "bg-amber-500/[0.06]",   tile: "bg-amber-500/15 text-amber-600 dark:text-amber-300", text: "text-amber-600 dark:text-amber-300" },
  // Philosophie (arabe)
  tarif:         { label: "تعريف",         icon: BookMarked,   bar: "border-arctic-blue/60",  bg: "bg-arctic-blue/[0.05]",  tile: "bg-arctic-blue/15 text-arctic-blue dark:text-arctic-cyan", text: "text-arctic-blue dark:text-arctic-cyan" },
  ishkal:        { label: "إشكال",         icon: AlertTriangle,bar: "border-amber-500/60",    bg: "bg-amber-500/[0.06]",    tile: "bg-amber-500/15 text-amber-600 dark:text-amber-300", text: "text-amber-600 dark:text-amber-300" },
  mawqif:        { label: "موقف فلسفي",    icon: Sigma,        bar: "border-indigo-500/60",   bg: "bg-indigo-500/[0.05]",   tile: "bg-indigo-500/15 text-indigo-500 dark:text-indigo-300", text: "text-indigo-500 dark:text-indigo-300" },
  mafhoum:       { label: "مفهوم",         icon: BookMarked,   bar: "border-arctic-blue/60",  bg: "bg-arctic-blue/[0.05]",  tile: "bg-arctic-blue/15 text-arctic-blue dark:text-arctic-cyan", text: "text-arctic-blue dark:text-arctic-cyan" },
  qaida:         { label: "قاعدة",         icon: ListTree,     bar: "border-violet-500/60",   bg: "bg-violet-500/[0.05]",   tile: "bg-violet-500/15 text-violet-500 dark:text-violet-300", text: "text-violet-500 dark:text-violet-300" },
  mithal:        { label: "مثال",          icon: Lightbulb,    bar: "border-emerald-500/60",  bg: "bg-emerald-500/[0.05]",  tile: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300", text: "text-emerald-600 dark:text-emerald-300" },
  manhajiya:     { label: "منهجية",        icon: Wrench,       bar: "border-sky-500/60",      bg: "bg-sky-500/[0.05]",      tile: "bg-sky-500/15 text-sky-600 dark:text-sky-300", text: "text-sky-600 dark:text-sky-300" },
  tanbih:        { label: "تنبيه",         icon: AlertTriangle,bar: "border-amber-500/60",    bg: "bg-amber-500/[0.06]",    tile: "bg-amber-500/15 text-amber-600 dark:text-amber-300", text: "text-amber-600 dark:text-amber-300" },
  wathiqa:       { label: "وثيقة",         icon: FileText,     bar: "border-cyan-500/60",     bg: "bg-cyan-500/[0.05]",     tile: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300", text: "text-cyan-600 dark:text-cyan-300" },
  parcoeur:      { label: "للحفظ",         icon: Bookmark,     bar: "border-arctic-cyan/60",  bg: "bg-gradient-to-br from-arctic-cyan/[0.10] to-arctic-blue/[0.04]", tile: "bg-arctic-cyan/20 text-arctic-blue dark:text-arctic-cyan", text: "text-arctic-blue dark:text-arctic-cyan" },
  regional:      { label: "سؤال نموذجي · الجهوي", icon: Target, bar: "border-indigo-500/60",   bg: "bg-indigo-500/[0.05]",   tile: "bg-indigo-500/15 text-indigo-500 dark:text-indigo-300", text: "text-indigo-500 dark:text-indigo-300" },
  modele:        { label: "جواب نموذجي",   icon: CheckCircle2, bar: "border-emerald-500/50",  bg: "bg-emerald-500/[0.05]",  tile: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300", text: "text-emerald-600 dark:text-emerald-300", collapsible: true },
  khoulasa:      { label: "خلاصة",         icon: Bookmark,     bar: "border-arctic-cyan/60",  bg: "bg-gradient-to-br from-arctic-cyan/[0.10] to-arctic-blue/[0.04]", tile: "bg-arctic-cyan/20 text-arctic-blue dark:text-arctic-cyan", text: "text-arctic-blue dark:text-arctic-cyan" },
};

/** Inline application the student does while reading; "Fait" feeds the maîtrise %. */
function AppBlock({ block }: { block: Extract<Block, { t: "callout" }> }) {
  const ctx = useContext(InteractiveCtx);
  const done = block.id ? (ctx?.mastered.has(block.id) ?? false) : false;
  return (
    <div className={`my-4 rounded-2xl border p-4 transition ${done ? "border-emerald-500/50 bg-emerald-500/[0.06]" : "border-arctic-blue/40 bg-gradient-to-br from-arctic-blue/[0.08] to-arctic-cyan/[0.03] hover:shadow-md hover:shadow-arctic-blue/5"}`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="flex items-center gap-2 min-w-0">
          <span className={`w-6 h-6 rounded-lg grid place-items-center shrink-0 ${done ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300" : "bg-gradient-to-br from-arctic-cyan to-arctic-blue text-white shadow-sm shadow-arctic-blue/25"}`}><PencilLine className="w-3.5 h-3.5" /></span>
          <span className="text-[11px] font-bold uppercase tracking-wide text-arctic-blue dark:text-arctic-cyan">À toi de jouer</span>
          {block.title ? <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 truncate">· {inline(block.title)}</span> : null}
        </span>
        {ctx && block.id && (
          <button onClick={() => ctx.toggle(block.id!)} className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition ${done ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/25" : "border border-neutral-400/50 text-neutral-500 hover:border-emerald-500 hover:text-emerald-600"}`}>
            <Check className="w-3.5 h-3.5" strokeWidth={3} /> {done ? "Fait" : "Marquer fait"}
          </button>
        )}
      </div>
      <div className="[&>*:first-child]:mt-0"><Blocks blocks={block.body} /></div>
    </div>
  );
}

/** Plain text of a block list (paragraphs only), used by the Quran / hadith cards. */
function plainText(bs: Block[]): string {
  return bs.map((b) => (b.t === "p" ? b.text : "")).join(" ").replace(/\s+/g, " ").trim();
}

/** Quran verse(s): mushaf font, RTL, a numbered end-of-ayah ornament after each verse. In the data the marker is U+06DD followed by the number. */
function AyaBlock({ block }: { block: Extract<Block, { t: "callout" }> }) {
  const parts = plainText(block.body).split(/\s*\u06DD\s*(\d+)\s*/);
  const verses: { text: string; n?: string }[] = [];
  for (let k = 0; k < parts.length; k += 2) { if (parts[k]) verses.push({ text: parts[k], n: parts[k + 1] }); }
  return (
    <figure dir="rtl" className="my-5 rounded-2xl border border-emerald-600/25 bg-emerald-600/[0.05] px-5 py-4">
      <div className="text-center leading-[2.6] text-[26px] text-neutral-900 dark:text-neutral-50" style={{ fontFamily: "var(--font-quran), 'Amiri Quran', 'Scheherazade New', serif" }}>
        <span className="text-emerald-700 dark:text-emerald-300 mx-1">&#xFD3F;</span>
        {verses.map((v, k) => (
          <span key={k}>
            {v.text}
            {v.n ? <span className="inline-grid place-items-center align-middle mx-1.5 w-8 h-8 rounded-full border border-emerald-600/50 text-emerald-700 dark:text-emerald-300 text-[13px] font-bold leading-none" style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>{v.n}</span> : null}
            {k < verses.length - 1 ? " " : ""}
          </span>
        ))}
        <span className="text-emerald-700 dark:text-emerald-300 mx-1">&#xFD3E;</span>
      </div>
      {block.title ? <figcaption className="mt-2 text-center text-xs font-semibold text-emerald-700 dark:text-emerald-300">{block.title}</figcaption> : null}
    </figure>
  );
}

/** Hadith: quoted text with the narrator / source line. */
function HadithBlock({ block }: { block: Extract<Block, { t: "callout" }> }) {
  return (
    <figure dir="rtl" className="my-5 rounded-2xl border-s-[3px] border-amber-500/60 bg-amber-500/[0.05] px-5 py-4">
      <div className="text-xl leading-[2.2] text-neutral-900 dark:text-neutral-50" style={{ fontFamily: "var(--font-quran), 'Amiri Quran', serif" }}>
        &laquo; {plainText(block.body)} &raquo;
      </div>
      {block.title ? <figcaption className="mt-2 text-xs font-semibold text-amber-700 dark:text-amber-300">{block.title}</figcaption> : null}
    </figure>
  );
}

/** Items of the first bullet list of a callout body ("- a | b" lines). */
function listItems(bs: Block[]): string[] {
  return bs.flatMap((b) => (b.t === "ul" ? b.items : []));
}

function VisualShell({ title, label, children }: { title?: string; label: string; children: ReactNode }) {
  return (
    <div className="my-5 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] p-4">
      <div className="mb-3 flex items-center gap-2"><span className="text-[11px] font-bold uppercase tracking-wide text-arctic-blue dark:text-arctic-cyan">{label}</span>{title ? <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{inline(title)}</span> : null}</div>
      {children}
    </div>
  );
}

/** Chronology: "- date | event". */
function TimelineBlock({ block }: { block: Extract<Block, { t: "callout" }> }) {
  const rows = listItems(block.body).map((it) => { const [d, ...r] = it.split("|"); return { d: d.trim(), e: r.join("|").trim() }; });
  return (
    <VisualShell title={block.title} label="Chronologie">
      <ol className="relative ms-3 border-s-2 border-arctic-blue/30 space-y-4">
        {rows.map((r, k) => (
          <li key={k} className="ps-5 relative">
            <span className="absolute -start-[9px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-neutral-950 border-2 border-arctic-blue" />
            <div className="text-sm font-bold text-arctic-blue dark:text-arctic-cyan">{inline(r.d)}</div>
            <div className="text-neutral-700 dark:text-neutral-200 leading-relaxed">{inline(r.e)}</div>
          </li>
        ))}
      </ol>
    </VisualShell>
  );
}

/** Cause/consequence chain or method steps: "- Step :: detail". */
function SchemaBlock({ block }: { block: Extract<Block, { t: "callout" }> }) {
  const steps = listItems(block.body).map((it) => { const [a, ...r] = it.split("::"); return { a: a.trim(), d: r.join("::").trim() }; });
  return (
    <VisualShell title={block.title} label="Schéma">
      <div className="flex flex-col items-stretch">
        {steps.map((st, k) => (
          <div key={k} className="flex flex-col items-center">
            <div className="w-full rounded-xl border border-arctic-blue/30 bg-arctic-blue/[0.06] px-4 py-2.5">
              <div className="font-bold text-neutral-900 dark:text-white">{inline(st.a)}</div>
              {st.d ? <div className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">{inline(st.d)}</div> : null}
            </div>
            {k < steps.length - 1 ? <ChevronDown className="my-1 w-5 h-5 text-arctic-blue/70" /> : null}
          </div>
        ))}
      </div>
    </VisualShell>
  );
}

/** Mind map: title = centre, "- Branch :: a ; b ; c" = cards. */
function CarteBlock({ block }: { block: Extract<Block, { t: "callout" }> }) {
  const branches = listItems(block.body).map((it) => { const [a, ...r] = it.split("::"); return { a: a.trim(), items: r.join("::").split(/[;\u061B]/).map((x) => x.trim()).filter(Boolean) }; });
  return (
    <VisualShell label="Carte mentale">
      {block.title ? <div className="mx-auto mb-3 w-fit max-w-full rounded-full bg-gradient-to-br from-arctic-cyan to-arctic-blue px-5 py-2 text-center font-bold text-white shadow-sm shadow-arctic-blue/25">{inline(block.title)}</div> : null}
      <div className="grid gap-3 sm:grid-cols-2">
        {branches.map((br, k) => (
          <div key={k} className="rounded-xl border border-arctic-blue/25 bg-white/60 dark:bg-white/[0.04] p-3">
            <div className="mb-1.5 font-bold text-arctic-blue dark:text-arctic-cyan">{inline(br.a)}</div>
            {br.items.length ? <ul className="space-y-1">{br.items.map((x, j) => <li key={j} className="flex gap-2 text-sm text-neutral-700 dark:text-neutral-200"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-arctic-blue/70 shrink-0" /><span>{inline(x)}</span></li>)}</ul> : null}
          </div>
        ))}
      </div>
    </VisualShell>
  );
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.t === "p") return <p key={i} className="my-2.5 leading-relaxed text-neutral-700 dark:text-neutral-200">{inline(b.text)}</p>;
        if (b.t === "display") return <DisplayMath key={i} tex={b.tex} />;
        if (b.t === "figure") return <CourseFigure key={i} name={b.name} caption={b.caption} />;
        if (b.t === "table") return (
          <div key={i} className="my-4 w-full overflow-x-auto rounded-2xl border border-black/[0.06] dark:border-white/[0.08]">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-arctic-blue/[0.08] dark:bg-arctic-cyan/[0.08]">
                  {b.head.map((h, j) => <th key={j} className="text-left font-bold text-neutral-800 dark:text-neutral-100 px-3 py-2 border-b border-black/[0.08] dark:border-white/[0.10]">{inline(h)}</th>)}
                </tr>
              </thead>
              <tbody>
                {b.rows.map((r, ri) => (
                  <tr key={ri} className="odd:bg-black/[0.015] dark:odd:bg-white/[0.02]">
                    {r.map((c, ci) => <td key={ci} className={`px-3 py-2 align-top border-b border-black/[0.04] dark:border-white/[0.05] ${ci === 0 ? "font-semibold text-neutral-800 dark:text-neutral-100" : "text-neutral-700 dark:text-neutral-200"}`}>{inline(c)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        if (b.t === "ul") return <ul key={i} className="my-2.5 space-y-1.5 pl-1">{b.items.map((it, j) => <li key={j} className="flex gap-2.5 text-neutral-700 dark:text-neutral-200"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-arctic-blue/70 shrink-0" /><span>{inline(it)}</span></li>)}</ul>;
        if (b.t === "ol") return <ol key={i} className="my-2.5 space-y-1.5">{b.items.map((it, j) => <li key={j} className="flex gap-3 text-neutral-700 dark:text-neutral-200"><span className="shrink-0 w-6 h-6 rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-300 grid place-items-center text-xs font-bold">{j + 1}</span><span className="pt-0.5">{inline(it)}</span></li>)}</ol>;
        if (b.kind === "app") return <AppBlock key={i} block={b} />;
        if (b.kind === "aya") return <AyaBlock key={i} block={b} />;
        if (b.kind === "timeline") return <TimelineBlock key={i} block={b} />;
        if (b.kind === "schema") return <SchemaBlock key={i} block={b} />;
        if (b.kind === "carte") return <CarteBlock key={i} block={b} />;
        if (b.kind === "hadith") return <HadithBlock key={i} block={b} />;
        if (b.kind === "funnel") return <FunnelBlock key={i} notion={b.title || "cette notion"} />;
        // callout
        const c = CO[b.kind] ?? CO.remarque;
        const Icon = c.icon;
        const head = (
          <span className="flex items-center gap-2 min-w-0">
            <span className={`w-6 h-6 rounded-lg grid place-items-center shrink-0 ${c.tile}`}><Icon className="w-3.5 h-3.5" /></span>
            <span className={`text-[11px] font-bold uppercase tracking-wide ${c.text}`}>{c.label}</span>
            {b.title ? <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 truncate">· {inline(b.title)}</span> : null}
          </span>
        );
        if (c.collapsible) {
          return (
            <details key={i} className={`group my-4 rounded-2xl border-s-[3px] ${c.bar} ${c.bg} p-4`}>
              <summary className="cursor-pointer list-none flex items-center justify-between gap-2">{head}<ChevronDown className="w-4 h-4 text-neutral-400 transition-transform group-open:rotate-180" /></summary>
              <div className="mt-2 [&>*:first-child]:mt-0"><Blocks blocks={b.body} /></div>
            </details>
          );
        }
        return (
          <div key={i} className={`my-4 rounded-2xl border-s-[3px] ${c.bar} ${c.bg} p-4 transition`}>
            <div className="mb-2">{head}</div>
            <div className="[&>*:first-child]:mt-0"><Blocks blocks={b.body} /></div>
          </div>
        );
      })}
    </>
  );
}

/* ------------------------------ sections + sommaire ------------------------------ */
type Section = { id: string; title: string | null; blocks: Block[] };

function parseSections(body: string): Section[] {
  const lines = (body ?? "").replace(/\r\n/g, "\n").split("\n");
  const sections: Section[] = [];
  let cur: { title: string | null; lines: string[] } = { title: null, lines: [] };
  const push = () => { if (cur.lines.some((l) => l.trim() !== "") || cur.title) sections.push({ id: "", title: cur.title, blocks: parseBlocks(cur.lines) }); };
  for (const line of lines) {
    const h = line.trim().match(/^##\s+(.*)$/);
    if (h) { push(); cur = { title: h[1].trim(), lines: [] }; }
    else cur.lines.push(line);
  }
  push();
  return sections.map((s, i) => ({ ...s, id: `sec-${i}` }));
}

/** Extract cards (Définition / Théorème / Propriété) for flashcards révision. */
export function extractCards(body: string): { kind: string; title?: string; blocks: Block[] }[] {
  const cards: { kind: string; title?: string; blocks: Block[] }[] = [];
  const walk = (blocks: Block[]) => {
    for (const b of blocks) {
      if (b.t === "callout") {
        if (["definition", "theoreme", "propriete"].includes(b.kind)) cards.push({ kind: b.kind, title: b.title, blocks: b.body });
        walk(b.body);
      }
    }
  };
  walk(parseBlocks((body ?? "").replace(/\r\n/g, "\n").split("\n")));
  return cards;
}

/** Callouts worth memorising, with the question shown on the front of the flashcard. */
export const CARD_KINDS: Record<string, { label: string; prompt: string }> = {
  definition: { label: "Définition", prompt: "Définis" },
  theoreme:   { label: "Théorème", prompt: "Énonce le théorème" },
  propriete:  { label: "Propriété", prompt: "Rappelle la propriété" },
  aretenir:   { label: "À retenir", prompt: "Qu'est-ce qu'il faut retenir ?" },
  methode:    { label: "Méthode", prompt: "Quelle est la méthode ?" },
  attention:  { label: "Piège", prompt: "Quel est le piège à éviter ?" },
  rule:       { label: "Rule", prompt: "State the rule" },
  remember:   { label: "Remember", prompt: "What should you remember?" },
  mistake:    { label: "Common mistake", prompt: "What's the common mistake?" },
  tarif:      { label: "تعريف", prompt: "عرّف" },
  mawqif:     { label: "موقف فلسفي", prompt: "ما هو الموقف؟" },
  khoulasa:   { label: "خلاصة", prompt: "ما هي الخلاصة؟" },
};
export type DeckCard = { id: string; kind: string; title?: string; notion: string | null; lessonId: string; lessonTitle: string; blocks: Block[] };

/** Small stable hash so a card keeps its memory (box, due date) across sessions. */
function hashKey(s: string): string {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(36);
}
function blocksText(bs: Block[]): string {
  return bs.map((b) => b.t === "p" ? b.text : b.t === "display" ? b.tex : b.t === "ul" || b.t === "ol" ? b.items.join(" ") : b.t === "callout" ? blocksText(b.body) : "").join(" ");
}

/** Flashcards of one lesson: every memorisable callout, tagged with the notion (## heading) it sits in. */
export function extractDeck(lesson: { id: string; title: string; body: string | null }): DeckCard[] {
  const out: DeckCard[] = [];
  for (const sec of parseSections(lesson.body ?? "")) {
    const walk = (bs: Block[]) => {
      for (const b of bs) {
        if (b.t !== "callout") continue;
        if (CARD_KINDS[b.kind] && b.body.length) {
          const key = `${lesson.id}|${b.kind}|${b.title ?? ""}|${blocksText(b.body).slice(0, 120)}`;
          out.push({ id: hashKey(key), kind: b.kind, title: b.title, notion: sec.title, lessonId: lesson.id, lessonTitle: lesson.title, blocks: b.body });
        }
        walk(b.body);
      }
    };
    walk(sec.blocks);
  }
  return out;
}

export function CourseContent({ body, lessonId, onProgress, onPractice, canPractice, onTrain }: { body: string; lessonId?: string; onProgress?: (mastered: number, total: number) => void; onPractice?: (notion: string) => void; canPractice?: (notion: string) => boolean; onTrain?: (notion: string) => void }) {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const sections = useMemo(() => parseSections(body), [body]);
  const titled = useMemo(() => sections.filter((s) => s.title), [sections]);
  const hasToc = titled.length >= 2;
  // assign a stable id to each inline application, in reading order
  const appIds = useMemo(() => {
    const ids: string[] = []; let n = 0;
    const walk = (bs: Block[]) => { for (const b of bs) { if (b.t === "callout") { if (b.kind === "app") { b.id = `app-${n++}`; ids.push(b.id); } walk(b.body); } } };
    sections.forEach((s) => walk(s.blocks));
    return ids;
  }, [sections]);
  const [mastered, setMastered] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!lessonId) return;
    let live = true;
    (async () => {
      const { data } = await supabase.from("cours_progress").select("section_key").eq("lesson_id", lessonId).eq("mastered", true);
      if (live) setMastered(new Set((data ?? []).map((r) => r.section_key as string)));
    })();
    return () => { live = false; };
  }, [lessonId, supabase]);

  useEffect(() => {
    const secDone = titled.filter((s) => mastered.has(s.id)).length;
    const appDone = appIds.filter((id) => mastered.has(id)).length;
    onProgress?.(secDone + appDone, titled.length + appIds.length);
  }, [mastered, titled, appIds, onProgress]);

  const toggle = useCallback(async (id: string) => {
    const has = mastered.has(id);
    setMastered((s) => { const n = new Set(s); if (has) n.delete(id); else n.add(id); return n; });
    if (!lessonId) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    if (has) await supabase.from("cours_progress").delete().eq("user_id", user.id).eq("lesson_id", lessonId).eq("section_key", id);
    else await supabase.from("cours_progress").upsert({ user_id: user.id, lesson_id: lessonId, section_key: id, mastered: true });
  }, [mastered, lessonId, supabase]);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (el) { (el as HTMLDetailsElement).open = true; el.scrollIntoView({ behavior: "smooth", block: "start" }); }
  };

  const masteredCount = titled.filter((s) => mastered.has(s.id)).length;
  const num = useMemo(() => new Map(titled.map((s, i) => [s.id, i + 1])), [titled]);
  const pct = titled.length ? Math.round((masteredCount / titled.length) * 100) : 0;
  const rtl = /[؀-ۿ]/.test(body); // Arabic → full right-to-left layout

  return (
    <InteractiveCtx.Provider value={{ mastered, toggle, practice: onPractice, canPractice, train: onTrain }}>
    <div className="text-[15px]" dir={rtl ? "rtl" : "ltr"}>
      {hasToc && (
        <div className="mb-5 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-neutral-400"><ListTree className="w-3.5 h-3.5" /> {rtl ? "المحاور" : "Sommaire"}</div>
            <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">{masteredCount}/{titled.length} {rtl ? "متقن" : `maîtrisé${masteredCount > 1 ? "s" : ""}`}</div>
          </div>
          <div className="h-1.5 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden mb-3"><div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500" style={{ width: `${pct}%` }} /></div>
          <div className="flex flex-col gap-1.5">
            {titled.map((s, i) => {
              const ok = mastered.has(s.id);
              return (
                <div key={s.id} className="flex items-center gap-2.5">
                  <button onClick={() => toggle(s.id)} title="Je maîtrise cette section"
                    className={`w-5 h-5 rounded-full border grid place-items-center shrink-0 transition ${ok ? "bg-emerald-500 border-emerald-500 text-white" : "border-neutral-400/60 text-transparent hover:border-emerald-500 hover:text-emerald-500/40"}`}>
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </button>
                  <button onClick={() => jump(s.id)} className={`text-start text-sm transition ${ok ? "text-neutral-400 line-through decoration-emerald-500/50" : "text-neutral-600 dark:text-neutral-300 hover:text-arctic-blue dark:hover:text-arctic-cyan"}`}><span className="tabular-nums">{i + 1}.</span> {inline(s.title ?? "")}</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {sections.map((s) =>
        s.title ? (
          <details key={s.id} id={s.id} data-notion={s.title ?? undefined} open className="group mb-3 rounded-2xl border border-black/[0.05] dark:border-white/[0.06] overflow-hidden">
            <summary className="cursor-pointer list-none flex items-center justify-between gap-2 px-4 py-3 hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition">
              <span className="flex items-center gap-3 min-w-0">
                <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-arctic-cyan/25 to-arctic-blue/10 text-arctic-blue dark:text-arctic-cyan grid place-items-center text-xs font-extrabold shrink-0">{num.get(s.id)}</span>
                <span className="font-bold tracking-tight text-neutral-900 dark:text-white truncate">{inline(s.title ?? "")}</span>
              </span>
              <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0 transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-4 pb-4 pt-1">
              <Blocks blocks={s.blocks} />
              {onPractice && (!canPractice || canPractice(s.title!)) && <FunnelCTA notion={s.title!} onClick={() => onPractice(s.title!)} onTrain={onTrain ? () => onTrain(s.title!) : undefined} />}
            </div>
          </details>
        ) : (
          <div key={s.id}><Blocks blocks={s.blocks} /></div>
        )
      )}
    </div>
    </InteractiveCtx.Provider>
  );
}
