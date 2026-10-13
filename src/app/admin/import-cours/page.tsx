"use client";

import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { Loader2, Upload, FileJson, CheckCircle2, AlertTriangle } from "lucide-react";

type Item = {
  id?: string; chapter_id?: string; title?: string; notion?: string;
  body?: string; resume?: string; objectives?: string;
  difficulty?: number | null; duration_min?: number | null; bac_frequency?: number | null;
};
type Report = { updated: number; created: number; missing: number; missing_detail?: unknown[] };

const box = "w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-arctic-blue";

// A notion "clears the bar" if its body is substantial and structured.
function richOf(body: string) {
  const sections = (body.match(/^## /gm) || []).length;
  const callouts = (body.match(/^:::[ ]*[a-zA-Z]/gm) || []).length;
  return body.length >= 1500 && sections >= 2 && callouts >= 4;
}

export default function AdminImportCours() {
  const supabase = createBrowserSupabase();
  const [raw, setRaw] = useState("");
  const [items, setItems] = useState<Item[] | null>(null);
  const [parseErr, setParseErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);

  function analyse(text: string) {
    setReport(null); setError(null);
    if (!text.trim()) { setItems(null); setParseErr(null); return; }
    try {
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) { setParseErr("Le JSON doit être un tableau."); setItems(null); return; }
      setParseErr(null); setItems(parsed as Item[]);
    } catch (e) { setParseErr((e as Error).message); setItems(null); }
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const text = await f.text();
    setRaw(text); analyse(text);
  }

  async function doImport() {
    if (!items) return;
    setBusy(true); setError(null); setReport(null);
    const { data, error } = await supabase.rpc("import_course_bundle", { p_items: items });
    setBusy(false);
    if (error) { setError(error.message); return; }
    setReport(data as Report);
  }

  const filled = items?.filter((i) => (i.body ?? "").trim()) ?? [];
  const belowBar = filled.filter((i) => !richOf(i.body ?? ""));
  const noId = items?.filter((i) => !i.id && !i.chapter_id) ?? [];

  return (
    <div className="max-w-3xl fade-up">
      <h1 className="text-3xl font-bold tracking-tight">Importer des cours (JSON)</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        Colle ou dépose un scaffold rempli. Chaque notion est mise à jour par son <code>id</code> (ou créée sous un <code>chapter_id</code>). Les champs vides sont ignorés.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <label className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full bg-arctic-blue/10 text-arctic-blue dark:text-arctic-cyan hover:bg-arctic-blue/20 transition cursor-pointer">
          <FileJson className="w-4 h-4" /> Choisir un fichier .json
          <input type="file" accept="application/json,.json" className="hidden" onChange={onFile} />
        </label>
        {items && <span className="text-xs text-neutral-400">{items.length} notion(s) dans le fichier</span>}
      </div>

      <textarea
        className={box + " mt-3 font-mono"} rows={12}
        placeholder='[ { "id": "…", "title": "…", "body": "## …", "resume": "…", "difficulty": 2, "duration_min": 45, "bac_frequency": 3 } ]'
        value={raw}
        onChange={(e) => { setRaw(e.target.value); analyse(e.target.value); }}
      />

      {parseErr && (
        <div className="mt-2 text-sm text-red-500 inline-flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> JSON invalide : {parseErr}</div>
      )}

      {items && !parseErr && (
        <div className="mt-4 glass rounded-2xl p-4 text-sm">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat label="Notions" value={items.length} />
            <Stat label="Avec cours" value={filled.length} />
            <Stat label="Sans id/chapter" value={noId.length} warn={noId.length > 0} />
            <Stat label="Sous le seuil" value={belowBar.length} warn={belowBar.length > 0} />
          </div>
          {belowBar.length > 0 && (
            <div className="mt-3 text-[12px] text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-3.5 h-3.5 inline -mt-0.5" /> {belowBar.length} notion(s) sous le seuil de richesse (&lt; 1500 car., &lt; 2 sections ou &lt; 4 callouts) : {belowBar.slice(0, 4).map((b) => b.notion ?? b.title).filter(Boolean).join(", ")}{belowBar.length > 4 ? "…" : ""}. Elles seront quand même importées — vérifie qu'elles sont bien des résumés voulus.
            </div>
          )}
          {noId.length > 0 && (
            <div className="mt-2 text-[12px] text-red-500">
              {noId.length} notion(s) sans <code>id</code> ni <code>chapter_id</code> — elles seront ignorées.
            </div>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center gap-3">
        <button onClick={doImport} disabled={!items || !!parseErr || busy || filled.length === 0}
          className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white hover:brightness-105 transition disabled:opacity-50">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Importer {filled.length ? `(${filled.length})` : ""}
        </button>
        {report && (
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" /> {report.updated} mis à jour · {report.created} créé(s){report.missing ? ` · ${report.missing} non trouvé(s)` : ""}
          </span>
        )}
        {error && <span className="text-sm text-red-500 inline-flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> {error}</span>}
      </div>

      {report && report.missing > 0 && report.missing_detail && (
        <pre className="mt-3 glass rounded-xl p-3 text-[11px] overflow-x-auto">{JSON.stringify(report.missing_detail, null, 2)}</pre>
      )}

      <div className="mt-8 glass rounded-2xl p-5 text-sm text-neutral-500 dark:text-neutral-400">
        <div className="font-semibold text-neutral-700 dark:text-neutral-200 mb-1">Rappel du format</div>
        Un tableau JSON de notions. Garde <code>id</code>, <code>chapter</code>, <code>notion</code> tels quels ; remplis <code>body</code> (cours complet), <code>resume</code> (fiche), <code>objectives</code>, et <code>difficulty</code>/<code>duration_min</code>/<code>bac_frequency</code>. Voir le guide de contenu pour la syntaxe (sections <code>##</code>, callouts <code>:::</code>, maths <code>$…$</code>).
      </div>
    </div>
  );
}

function Stat({ label, value, warn }: { label: string; value: number; warn?: boolean }) {
  return (
    <div className="rounded-xl bg-black/[0.03] dark:bg-white/[0.05] px-3 py-2">
      <div className={`text-xl font-bold tabular-nums ${warn ? "text-amber-600 dark:text-amber-400" : ""}`}>{value}</div>
      <div className="text-[11px] text-neutral-400">{label}</div>
    </div>
  );
}
