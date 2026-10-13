"use client";

/**
 * Import of "bacup.prep/v1" JSON packs (content team → app).
 * 1. drop / pick / paste one or many .json files
 * 2. client check: shape + NOTION CHECK (each question's notion vs the chapter's cours "## headings")
 * 3. "Vérifier" = server dry-run (full validation, nothing written)
 * 4. "Importer" = same call, committed in one transaction per pack; optional auto-séries rebuild
 */
import { useRef, useState } from "react";
import { quickCheck, packCounts, downloadJson, PACK_FORMAT, type Pack, type PackReport } from "@/lib/prep-pack";
import { lessonNotions, questionsForNotion } from "@/lib/notions";
import { useAdminRefs, btnPrimary, btnGhost, Msg } from "./shared";
import { FileJson, Upload, Loader2, CheckCircle2, AlertTriangle, XCircle, Download, Trash2, ShieldCheck } from "lucide-react";
import TEMPLATE from "../../../../data/_prep-pack-template.json";

type Entry = {
  key: string; name: string; raw: string;
  pack: Pack | null; parseErrors: string[];
  notionWarnings: string[] | null;
  report: PackReport | null; busy: boolean;
};

export function PrepImport() {
  const { supabase } = useAdminRefs();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [paste, setPaste] = useState("");
  const [drag, setDrag] = useState(false);
  const [regen, setRegen] = useState(true);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const seq = useRef(0);

  const patch = (key: string, p: Partial<Entry>) => setEntries((es) => es.map((e) => (e.key === key ? { ...e, ...p } : e)));

  function addText(name: string, raw: string) {
    let parsed: unknown = null; const errs: string[] = [];
    try { parsed = JSON.parse(raw); } catch (e) { errs.push(`JSON invalide : ${(e as Error).message}`); }
    const { pack, errors } = errs.length ? { pack: null, errors: errs } : quickCheck(parsed);
    const key = `${name}-${++seq.current}`;
    setEntries((es) => [...es, { key, name, raw, pack, parseErrors: errors, notionWarnings: null, report: null, busy: false }]);
    if (pack) void checkNotions(key, pack);
  }

  async function onFiles(files: FileList | null) {
    if (!files) return;
    for (const f of Array.from(files)) addText(f.name, await f.text());
  }

  /** Warn when a question's notion won't land on any cours heading (it would show under "Autres notions"). */
  async function checkNotions(key: string, pack: Pack) {
    const warnings: string[] = [];
    const { data: lv } = await supabase.from("levels").select("id").eq("code", pack.level).maybeSingle();
    const { data: su } = await supabase.from("subjects").select("id").eq("code", pack.subject).maybeSingle();
    if (!lv || !su) { patch(key, { notionWarnings: [] }); return; }
    const { data: chs } = await supabase.from("chapters").select("id, code, name").eq("level_id", lv.id).eq("subject_id", su.id);
    const chapters = (chs ?? []) as { id: string; code: string | null; name: string }[];
    const find = (k: string) => chapters.find((c) => (c.code ?? "").toLowerCase() === k.toLowerCase() || c.name.toLowerCase() === k.toLowerCase());
    const headsCache = new Map<string, string[]>();
    for (const [ei, ex] of (pack.exercises ?? []).entries()) {
      const ch = find(ex.chapter ?? "");
      if (!ch) continue; // the server reports unknown chapters
      if (!headsCache.has(ch.id)) {
        const { data: ls } = await supabase.from("lessons").select("body, kind").eq("chapter_id", ch.id);
        headsCache.set(ch.id, ((ls ?? []) as { body: string | null; kind: string }[]).filter((l) => l.kind !== "resume").flatMap((l) => lessonNotions(l.body)));
      }
      const heads = headsCache.get(ch.id)!;
      if (!heads.length) { warnings.push(`exercises[${ei + 1}] (${ch.name}) : ce chapitre n'a pas encore de cours → notions non vérifiables.`); continue; }
      for (const [qi, q] of (ex.questions ?? []).entries()) {
        if (!q.notion) continue;
        const hit = heads.some((h) => questionsForNotion(h, [{ notion: q.notion }]).length > 0);
        if (!hit) warnings.push(`exercises[${ei + 1}].questions[${qi + 1}] : notion « ${q.notion} » ne correspond à aucun titre ## de « ${ch.name} » → rangée dans « Autres notions ».`);
      }
    }
    patch(key, { notionWarnings: warnings });
  }

  async function run(e: Entry, dry: boolean): Promise<PackReport | null> {
    if (!e.pack) return null;
    patch(e.key, { busy: true });
    const { data, error } = await supabase.rpc("import_prep_pack", { p_pack: e.pack, p_dry_run: dry });
    const report: PackReport = error ? { ok: false, dry_run: dry, errors: [error.message], warnings: [] } : (data as PackReport);
    patch(e.key, { busy: false, report });
    return report;
  }

  async function verifyAll() { setMsg(null); for (const e of entries) if (e.pack) await run(e, true); }

  async function importAll() {
    setMsg(null);
    const ready = entries.filter((e) => e.pack && e.report?.dry_run && e.report.ok);
    if (!ready.length) { setMsg({ ok: false, text: "Vérifie d'abord les packs (aucun pack valide)." }); return; }
    let ok = 0;
    for (const e of ready) { const r = await run(e, false); if (r?.committed) ok++; }
    if (ok && regen) await supabase.rpc("regenerate_auto_series");
    setMsg({ ok: ok === ready.length, text: `${ok}/${ready.length} pack(s) importé(s)${ok && regen ? " · séries auto régénérées" : ""}.` });
  }

  const anyVerified = entries.some((e) => e.report?.dry_run && e.report.ok);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xl">
          Importe les packs JSON <code className="text-xs px-1.5 py-0.5 rounded bg-black/[0.05] dark:bg-white/[0.08]">{PACK_FORMAT}</code> :
          exercices par notion + séries. Ré-importer un pack met à jour les questions (clé <code className="text-xs">ref</code>) sans doublon.
        </p>
        <button onClick={() => downloadJson("prep-pack-template.json", TEMPLATE)} className={btnGhost}><Download className="w-4 h-4" /> Modèle JSON</button>
      </div>

      <label
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); void onFiles(e.dataTransfer.files); }}
        className={`mt-4 block rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition ${drag ? "border-arctic-blue bg-arctic-blue/[0.05]" : "border-neutral-300 dark:border-neutral-700 hover:border-arctic-blue/60"}`}>
        <Upload className="w-6 h-6 mx-auto text-arctic-blue dark:text-arctic-cyan" />
        <div className="mt-2 text-sm font-semibold">Glisse tes fichiers .json ici</div>
        <div className="text-xs text-neutral-400">ou clique pour choisir (plusieurs fichiers possibles)</div>
        <input type="file" accept=".json,application/json" multiple className="hidden" onChange={(e) => { void onFiles(e.target.files); e.target.value = ""; }} />
      </label>

      <details className="mt-3">
        <summary className="text-xs font-semibold text-neutral-500 cursor-pointer">…ou coller un JSON</summary>
        <textarea value={paste} onChange={(e) => setPaste(e.target.value)} rows={8} placeholder='{ "format": "bacup.prep/v1", … }'
          className="mt-2 w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2.5 text-xs font-mono outline-none focus:border-arctic-blue" />
        <button onClick={() => { if (paste.trim()) { addText("collé.json", paste); setPaste(""); } }} className={btnGhost + " mt-2"}><FileJson className="w-4 h-4" /> Ajouter</button>
      </details>

      {entries.length > 0 && (
        <>
          <div className="mt-5 space-y-3">
            {entries.map((e) => {
              const c = e.pack ? packCounts(e.pack) : null;
              const r = e.report;
              return (
                <div key={e.key} className="glass rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <FileJson className="w-5 h-5 text-arctic-blue dark:text-arctic-cyan shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{e.name}</div>
                      <div className="text-[11px] text-neutral-400">
                        {e.pack ? `${e.pack.subject} · ${e.pack.level}${e.pack.track ? ` · ${e.pack.track}` : ""} · ${c!.exercises} exercices · ${c!.questions} questions · ${c!.series} séries` : "Pack invalide"}
                      </div>
                    </div>
                    {e.busy ? <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                      : r?.committed ? <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500"><CheckCircle2 className="w-4 h-4" /> Importé</span>
                      : r?.ok ? <span className="inline-flex items-center gap-1 text-xs font-bold text-arctic-blue dark:text-arctic-cyan"><ShieldCheck className="w-4 h-4" /> Prêt</span>
                      : r ? <span className="inline-flex items-center gap-1 text-xs font-bold text-red-500"><XCircle className="w-4 h-4" /> Erreurs</span> : null}
                    <button onClick={() => setEntries((es) => es.filter((x) => x.key !== e.key))} className="w-8 h-8 rounded-lg grid place-items-center text-neutral-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>

                  {e.parseErrors.length > 0 && <List tone="error" items={e.parseErrors} />}
                  {r && r.errors?.length > 0 && <List tone="error" items={r.errors} />}
                  {r?.stats && (
                    <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                      {Object.entries(r.stats).filter(([, v]) => v > 0).map(([k, v]) => (
                        <span key={k} className="px-2 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-300">{k.replace(/_/g, " ")} : <b>{v}</b></span>
                      ))}
                    </div>
                  )}
                  {e.notionWarnings && e.notionWarnings.length > 0 && <List tone="warn" items={e.notionWarnings} />}
                  {r && r.warnings?.length > 0 && <List tone="warn" items={r.warnings} />}
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button onClick={verifyAll} disabled={entries.every((e) => !e.pack)} className={btnGhost}><ShieldCheck className="w-4 h-4" /> Vérifier (sans écrire)</button>
            <button onClick={importAll} disabled={!anyVerified} className={btnPrimary}><Upload className="w-4 h-4" /> Importer les packs prêts</button>
            <label className="inline-flex items-center gap-2 text-xs text-neutral-500"><input type="checkbox" checked={regen} onChange={(e) => setRegen(e.target.checked)} /> Régénérer les séries auto après import</label>
          </div>
          <Msg m={msg} />
        </>
      )}
    </div>
  );
}

function List({ tone, items }: { tone: "error" | "warn"; items: string[] }) {
  const [all, setAll] = useState(false);
  const shown = all ? items : items.slice(0, 6);
  return (
    <div className={`mt-2 rounded-xl px-3 py-2 text-xs ${tone === "error" ? "bg-red-500/10 text-red-600 dark:text-red-400" : "bg-amber-500/10 text-amber-700 dark:text-amber-300"}`}>
      {shown.map((t, i) => <div key={i} className="flex gap-1.5 py-0.5">{tone === "error" ? <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> : <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />}<span>{t}</span></div>)}
      {items.length > 6 && <button onClick={() => setAll(!all)} className="mt-1 font-semibold underline">{all ? "Réduire" : `+ ${items.length - 6} autres`}</button>}
    </div>
  );
}
