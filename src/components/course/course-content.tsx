"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import katex from "katex";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { CourseFigure } from "./figures";
import {
  BookMarked, Sigma, CheckCircle2, Lightbulb, Wrench, Info, AlertTriangle,
  Sparkles, ListTree, ChevronDown, ScrollText, Check, PencilLine, Target, ChevronRight,
} from "lucide-react";

/** Interactive context: mastery toggles + the practice-overlay launcher (funnels). */
const InteractiveCtx = createContext<{ mastered: Set<string>; toggle: (k: string) => void; practice?: (notion: string) => void; canPractice?: (notion: string) => boolean } | null>(null);

/** Funnel CTA — opens the inline practice overlay for a notion, then resumes the cours. */
function FunnelCTA({ notion, onClick }: { notion: string; onClick: () => void }) {
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

/** Explicit `:::funnel Notion` block — reads the practice launcher from context. */
function FunnelBlock({ notion }: { notion: string }) {
  const ctx = useContext(InteractiveCtx);
  if (!ctx?.practice) return null;
  if (ctx.canPractice && !ctx.canPractice(notion)) return null; // hide when the notion has no exercises yet
  return <FunnelCTA notion={notion} onClick={() => ctx.practice!(notion)} />;
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
  aretenir:      { label: "À retenir",    icon: Sparkles,     bar: "border-arctic-cyan/60",  bg: "bg-gradient-to-br from-arctic-cyan/[0.10] to-arctic-blue/[0.04]", tile: "bg-arctic-cyan/20 text-arctic-blue dark:text-arctic-cyan", text: "text-arctic-blue dark:text-arctic-cyan" },
  demonstration: { label: "Démonstration",icon: ScrollText,   bar: "border-neutral-400/40",  bg: "bg-black/[0.02] dark:bg-white/[0.03]", tile: "bg-neutral-400/15 text-neutral-500 dark:text-neutral-300", text: "text-neutral-500 dark:text-neutral-300", collapsible: true },
  solution:      { label: "Correction",   icon: CheckCircle2, bar: "border-emerald-500/50",  bg: "bg-emerald-500/[0.05]",  tile: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300", text: "text-emerald-600 dark:text-emerald-300", collapsible: true },
  // English-workbook callouts
  rule:          { label: "Rule",         icon: BookMarked,   bar: "border-arctic-blue/60",  bg: "bg-arctic-blue/[0.05]",  tile: "bg-arctic-blue/15 text-arctic-blue dark:text-arctic-cyan", text: "text-arctic-blue dark:text-arctic-cyan" },
  example:       { label: "Example",      icon: Lightbulb,    bar: "border-emerald-500/60",  bg: "bg-emerald-500/[0.05]",  tile: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300", text: "text-emerald-600 dark:text-emerald-300" },
  tip:           { label: "Tip",          icon: Info,         bar: "border-sky-500/60",      bg: "bg-sky-500/[0.05]",      tile: "bg-sky-500/15 text-sky-600 dark:text-sky-300", text: "text-sky-600 dark:text-sky-300" },
  remember:      { label: "Remember",     icon: Sparkles,     bar: "border-arctic-cyan/60",  bg: "bg-gradient-to-br from-arctic-cyan/[0.10] to-arctic-blue/[0.04]", tile: "bg-arctic-cyan/20 text-arctic-blue dark:text-arctic-cyan", text: "text-arctic-blue dark:text-arctic-cyan" },
  mistake:       { label: "Common mistake", icon: AlertTriangle, bar: "border-amber-500/60", bg: "bg-amber-500/[0.06]",   tile: "bg-amber-500/15 text-amber-600 dark:text-amber-300", text: "text-amber-600 dark:text-amber-300" },
  // Philosophie (arabe)
  tarif:         { label: "تعريف",         icon: BookMarked,   bar: "border-arctic-blue/60",  bg: "bg-arctic-blue/[0.05]",  tile: "bg-arctic-blue/15 text-arctic-blue dark:text-arctic-cyan", text: "text-arctic-blue dark:text-arctic-cyan" },
  ishkal:        { label: "إشكال",         icon: AlertTriangle,bar: "border-amber-500/60",    bg: "bg-amber-500/[0.06]",    tile: "bg-amber-500/15 text-amber-600 dark:text-amber-300", text: "text-amber-600 dark:text-amber-300" },
  mawqif:        { label: "موقف فلسفي",    icon: Sigma,        bar: "border-indigo-500/60",   bg: "bg-indigo-500/[0.05]",   tile: "bg-indigo-500/15 text-indigo-500 dark:text-indigo-300", text: "text-indigo-500 dark:text-indigo-300" },
  khoulasa:      { label: "خلاصة",         icon: Sparkles,     bar: "border-arctic-cyan/60",  bg: "bg-gradient-to-br from-arctic-cyan/[0.10] to-arctic-blue/[0.04]", tile: "bg-arctic-cyan/20 text-arctic-blue dark:text-arctic-cyan", text: "text-arctic-blue dark:text-arctic-cyan" },
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

export function CourseContent({ body, lessonId, onProgress, onPractice, canPractice }: { body: string; lessonId?: string; onProgress?: (mastered: number, total: number) => void; onPractice?: (notion: string) => void; canPractice?: (notion: string) => boolean }) {
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
    <InteractiveCtx.Provider value={{ mastered, toggle, practice: onPractice, canPractice }}>
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
          <details key={s.id} id={s.id} open className="group mb-3 rounded-2xl border border-black/[0.05] dark:border-white/[0.06] overflow-hidden">
            <summary className="cursor-pointer list-none flex items-center justify-between gap-2 px-4 py-3 hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition">
              <span className="flex items-center gap-3 min-w-0">
                <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-arctic-cyan/25 to-arctic-blue/10 text-arctic-blue dark:text-arctic-cyan grid place-items-center text-xs font-extrabold shrink-0">{num.get(s.id)}</span>
                <span className="font-bold tracking-tight text-neutral-900 dark:text-white truncate">{inline(s.title ?? "")}</span>
              </span>
              <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0 transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-4 pb-4 pt-1">
              <Blocks blocks={s.blocks} />
              {onPractice && (!canPractice || canPractice(s.title!)) && <FunnelCTA notion={s.title!} onClick={() => onPractice(s.title!)} />}
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
