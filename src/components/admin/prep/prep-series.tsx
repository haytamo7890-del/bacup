"use client";

/**
 * Séries manager — list / create / edit / publish / reorder / delete séries,
 * picking questions from the chapter banks grouped by notion.
 * "auto:*" séries are rebuilt by regenerate_auto_series(): their questions are
 * read-only here — duplicate one into a "série du prof" to customise it.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { Tex } from "@/components/math";
import { groupByNotion, lessonNotions, notionLabel } from "@/lib/notions";
import { KIND_LABEL, DIFF_LABEL } from "@/lib/prep";
import { useAdminRefs, ScopePicker, sel, input, btnPrimary, btnGhost, Msg } from "./shared";
import { Loader2, Plus, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Copy, RefreshCw, X, Save, Layers } from "lucide-react";

type Kind = "custom" | "chapitre" | "unite" | "mixte";
type SRow = { id: string; slug: string | null; title: string; description: string | null; kind: Kind; chapter_id: string | null; unit: string | null; difficulty: number; xp_bonus: number; position: number; is_published: boolean; track_id: string | null; count: number };
type Ch = { id: string; name: string; unit: string | null; track_id: string | null };
type Item = { id: string; statement: string; notion: string | null };
type Draft = Omit<SRow, "id" | "count"> & { id: string | null; items: Item[] };

const blank = (trackId: string | null): Draft => ({ id: null, slug: "", title: "", description: "", kind: "custom", chapter_id: null, unit: null, difficulty: 1, xp_bonus: 30, position: 500, is_published: true, track_id: trackId, items: [] });
const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

export function PrepSeries() {
  const { supabase, level, subjects, tracks } = useAdminRefs();
  const [subjectId, setSubjectId] = useState("");
  const [trackId, setTrackId] = useState("");
  const [listData, setListData] = useState<{ key: string; list: SRow[] } | null>(null);
  const scopeKey = `${level?.id ?? ""}|${subjectId}|${trackId}`;
  const list = listData?.key === scopeKey ? listData.list : null;
  const [chapters, setChapters] = useState<Ch[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    if (!level || !subjectId) return;
    const key = `${level.id}|${subjectId}|${trackId}`;
    const [{ data: se }, { data: chs }] = await Promise.all([
      supabase.from("series").select("id, slug, title, description, kind, chapter_id, unit, difficulty, xp_bonus, position, is_published, track_id, series_items(count)")
        .eq("level_id", level.id).eq("subject_id", subjectId).order("position"),
      supabase.from("chapters").select("id, name, unit, track_id").eq("level_id", level.id).eq("subject_id", subjectId).order("position"),
    ]);
    type R = Omit<SRow, "count"> & { series_items: { count: number }[] };
    setListData({ key, list: ((se ?? []) as unknown as R[])
      .filter((s) => !trackId || s.track_id === trackId || s.track_id == null)
      .map(({ series_items, ...s }) => ({ ...s, count: series_items?.[0]?.count ?? 0 })) });
    setChapters(((chs ?? []) as Ch[]).filter((c) => !trackId || c.track_id === trackId || c.track_id == null));
  }, [level, subjectId, trackId, supabase]);

  useEffect(() => { void load(); }, [load]);
  const pickScope = (fn: (v: string) => void) => (v: string) => { setDraft(null); fn(v); };

  async function openSerie(s: SRow, asCopy = false) {
    setMsg(null);
    const { data } = await supabase.from("series_items").select("position, questions(id, statement, notion)").eq("series_id", s.id).order("position");
    const items = ((data ?? []) as unknown as { questions: Item | null }[]).map((r) => r.questions).filter(Boolean) as Item[];
    const { count: _c, ...rest } = s; void _c;
    setDraft(asCopy
      ? { ...rest, id: null, slug: `${slugify(s.title)}-prof`, title: `${s.title} (prof)`, kind: "custom", items }
      : { ...rest, items });
  }

  async function save() {
    if (!draft || !level || !subjectId) return;
    if (!draft.title.trim()) { setMsg({ ok: false, text: "Titre requis." }); return; }
    const isAuto = (draft.slug ?? "").startsWith("auto:");
    if (!isAuto && !draft.items.length) { setMsg({ ok: false, text: "Ajoute au moins une question." }); return; }
    setBusy(true); setMsg(null);
    const row = {
      slug: draft.slug?.trim() || slugify(draft.title) + "-" + Math.random().toString(36).slice(2, 6),
      subject_id: subjectId, level_id: level.id, track_id: draft.track_id || null,
      chapter_id: draft.chapter_id || null, unit: draft.unit || null, kind: draft.kind,
      title: draft.title.trim(), description: draft.description?.trim() || null,
      difficulty: draft.difficulty, xp_bonus: draft.xp_bonus, position: draft.position, is_published: draft.is_published,
    };
    let id = draft.id;
    if (id) {
      const { error } = await supabase.from("series").update(row).eq("id", id);
      if (error) { setBusy(false); setMsg({ ok: false, text: error.message }); return; }
    } else {
      const { data, error } = await supabase.from("series").insert(row).select("id").single();
      if (error || !data) { setBusy(false); setMsg({ ok: false, text: error?.message ?? "Création impossible." }); return; }
      id = data.id as string;
    }
    if (!isAuto) {
      await supabase.from("series_items").delete().eq("series_id", id);
      const { error } = await supabase.from("series_items").insert(draft.items.map((q, i) => ({ series_id: id, question_id: q.id, position: i + 1 })));
      if (error) { setBusy(false); setMsg({ ok: false, text: error.message }); return; }
    }
    setBusy(false);
    setMsg({ ok: true, text: "Série enregistrée." });
    setDraft({ ...draft, id, slug: row.slug });
    void load();
  }

  async function togglePublish(s: SRow) {
    await supabase.from("series").update({ is_published: !s.is_published }).eq("id", s.id);
    void load();
  }
  async function del(s: SRow) {
    if (!confirm(`Supprimer « ${s.title} » ? La progression des élèves sur cette série sera perdue.`)) return;
    await supabase.from("series").delete().eq("id", s.id);
    if (draft?.id === s.id) setDraft(null);
    void load();
  }
  async function regen() {
    setBusy(true);
    const { data, error } = await supabase.rpc("regenerate_auto_series");
    setBusy(false);
    setMsg(error ? { ok: false, text: error.message } : { ok: true, text: `Séries auto régénérées (${(data as { series: number }).series} séries).` });
    void load();
  }

  const groups: { k: Kind; items: SRow[] }[] = (["custom", "mixte", "unite", "chapitre"] as Kind[]).map((k) => ({ k, items: (list ?? []).filter((s) => s.kind === k) })).filter((g) => g.items.length);
  const chName = new Map(chapters.map((c) => [c.id, c.name]));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ScopePicker subjects={subjects} tracks={tracks} subjectId={subjectId} setSubjectId={pickScope(setSubjectId)} trackId={trackId} setTrackId={pickScope(setTrackId)} />
        <div className="flex gap-2">
          <button onClick={regen} disabled={busy} className={btnGhost} title="Reconstruit les bilans / unités / mixtes à partir des banques"><RefreshCw className="w-4 h-4" /> Régénérer auto</button>
          {subjectId && <button onClick={() => { setMsg(null); setDraft(blank(trackId || null)); }} className={btnPrimary}><Plus className="w-4 h-4" /> Nouvelle série</button>}
        </div>
      </div>
      <Msg m={msg} />

      {draft && <Editor draft={draft} setDraft={setDraft} chapters={chapters} tracks={tracks} onSave={save} busy={busy} onClose={() => setDraft(null)} />}

      {!subjectId ? <p className="mt-6 text-sm text-neutral-400">Choisis une matière.</p>
        : !list ? <div className="grid place-items-center h-32 text-neutral-400"><Loader2 className="w-5 h-5 animate-spin" /></div>
        : list.length === 0 ? <p className="mt-6 text-sm text-neutral-400">Aucune série pour cette matière.</p>
        : (
          <div className="mt-5 space-y-5">
            {groups.map((g) => (
              <div key={g.k}>
                <div className="text-[11px] font-bold uppercase tracking-wide text-neutral-400 mb-2">{g.k === "custom" ? "Séries du prof" : KIND_LABEL[g.k]} · {g.items.length}</div>
                <div className="space-y-1.5">
                  {g.items.map((s) => (
                    <div key={s.id} className={`glass rounded-xl px-3 py-2.5 flex items-center gap-3 ${draft?.id === s.id ? "ring-1 ring-arctic-blue/50" : ""}`}>
                      <Layers className="w-4 h-4 text-arctic-blue dark:text-arctic-cyan shrink-0" />
                      <button onClick={() => openSerie(s)} className="flex-1 min-w-0 text-left">
                        <div className="text-sm font-semibold truncate">{s.title}</div>
                        <div className="text-[11px] text-neutral-400 truncate">{s.count} Q · {DIFF_LABEL[s.difficulty]} · +{s.xp_bonus} XP{s.chapter_id ? ` · ${chName.get(s.chapter_id) ?? ""}` : ""}{s.unit ? ` · ${s.unit}` : ""} · <code>{s.slug}</code></div>
                      </button>
                      <button onClick={() => togglePublish(s)} title={s.is_published ? "Publiée — cliquer pour masquer" : "Masquée — cliquer pour publier"} className={`w-8 h-8 rounded-lg grid place-items-center ${s.is_published ? "text-emerald-500" : "text-neutral-400"}`}>{s.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}</button>
                      <button onClick={() => openSerie(s, true)} title="Dupliquer en série du prof" className="w-8 h-8 rounded-lg grid place-items-center text-neutral-400 hover:text-arctic-blue"><Copy className="w-4 h-4" /></button>
                      <button onClick={() => del(s)} title="Supprimer" className="w-8 h-8 rounded-lg grid place-items-center text-neutral-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

function Editor({ draft, setDraft, chapters, tracks, onSave, busy, onClose }: {
  draft: Draft; setDraft: (d: Draft) => void; chapters: Ch[]; tracks: { id: string; name: string }[];
  onSave: () => void; busy: boolean; onClose: () => void;
}) {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const isAuto = (draft.slug ?? "").startsWith("auto:");
  const [pickCh, setPickCh] = useState<string>(draft.chapter_id ?? "");
  const [bankData, setBankData] = useState<{ ch: string; groups: { notion: string; items: Item[] }[] } | null>(null);
  const bank = bankData && bankData.ch === pickCh ? bankData.groups : null;
  const set = (p: Partial<Draft>) => setDraft({ ...draft, ...p });
  const inDraft = new Set(draft.items.map((q) => q.id));

  useEffect(() => {
    if (!pickCh) return;
    let live = true;
    (async () => {
      const [{ data: ex }, { data: ls }] = await Promise.all([
        supabase.from("exercises").select("id, questions(id, statement, notion, position)").eq("chapter_id", pickCh).order("position"),
        supabase.from("lessons").select("body, kind").eq("chapter_id", pickCh).order("position"),
      ]);
      const items = ((ex ?? []) as unknown as { questions: (Item & { position: number })[] }[]).flatMap((e) => [...e.questions].sort((a, b) => a.position - b.position));
      const heads = ((ls ?? []) as { body: string | null; kind: string }[]).filter((l) => l.kind !== "resume").flatMap((l) => lessonNotions(l.body).map((n) => ({ notion: n, lessonId: null })));
      if (live) setBankData({ ch: pickCh, groups: groupByNotion(heads, items).filter((g) => g.items.length) });
    })();
    return () => { live = false; };
  }, [pickCh, supabase]);

  const move = (i: number, d: -1 | 1) => { const a = [...draft.items]; const j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; set({ items: a }); };
  const toggle = (q: Item) => set({ items: inDraft.has(q.id) ? draft.items.filter((x) => x.id !== q.id) : [...draft.items, q] });

  return (
    <div className="mt-5 glass rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div className="font-bold tracking-tight">{draft.id ? "Modifier la série" : "Nouvelle série"}</div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg grid place-items-center text-neutral-400"><X className="w-4 h-4" /></button>
      </div>
      {isAuto && <div className="mt-2 text-xs rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 px-3 py-2">Série automatique : titre / publication modifiables, mais ses questions sont reconstruites à chaque régénération. Duplique-la pour la personnaliser.</div>}

      <div className="mt-3 grid sm:grid-cols-2 gap-2">
        <input className={input} placeholder="Titre" value={draft.title} onChange={(e) => set({ title: e.target.value })} />
        <input className={input} placeholder="slug (identifiant stable, ex : pc-rc-serie-1)" value={draft.slug ?? ""} disabled={!!draft.id} onChange={(e) => set({ slug: e.target.value })} />
        <input className={input + " sm:col-span-2"} placeholder="Description (optionnelle)" value={draft.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
        <select className={sel} value={draft.chapter_id ?? ""} onChange={(e) => { set({ chapter_id: e.target.value || null }); if (e.target.value) setPickCh(e.target.value); }}>
          <option value="">— Transversale (pas de chapitre) —</option>
          {chapters.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className={sel} value={draft.track_id ?? ""} onChange={(e) => set({ track_id: e.target.value || null })}>
          <option value="">Toutes filières</option>
          {tracks.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <div className="flex gap-2">
          <select className={sel + " flex-1"} value={draft.difficulty} onChange={(e) => set({ difficulty: Number(e.target.value) })}>
            {[1, 2, 3].map((d) => <option key={d} value={d}>{DIFF_LABEL[d]}</option>)}
          </select>
          <input type="number" className={sel + " w-24"} title="XP bonus (1re réussite ≥ 70 %)" value={draft.xp_bonus} onChange={(e) => set({ xp_bonus: Number(e.target.value) })} />
          <input type="number" className={sel + " w-24"} title="Ordre d'affichage" value={draft.position} onChange={(e) => set({ position: Number(e.target.value) })} />
        </div>
        <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.is_published} onChange={(e) => set({ is_published: e.target.checked })} /> Publiée</label>
      </div>

      <div className="mt-5 grid lg:grid-cols-2 gap-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wide text-neutral-400 mb-2">Questions de la série · {draft.items.length}</div>
          <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
            {draft.items.length === 0 && <div className="text-xs text-neutral-400">Ajoute des questions depuis la banque →</div>}
            {draft.items.map((q, i) => (
              <div key={q.id} className="flex items-start gap-2 rounded-lg bg-black/[0.03] dark:bg-white/[0.04] px-2.5 py-2">
                <span className="text-[11px] font-bold text-neutral-400 w-5 shrink-0 pt-0.5">{i + 1}</span>
                <div className="flex-1 min-w-0 text-xs leading-snug line-clamp-2"><Tex>{q.statement}</Tex></div>
                {!isAuto && <>
                  <button onClick={() => move(i, -1)} className="text-neutral-400 hover:text-neutral-700"><ArrowUp className="w-3.5 h-3.5" /></button>
                  <button onClick={() => move(i, 1)} className="text-neutral-400 hover:text-neutral-700"><ArrowDown className="w-3.5 h-3.5" /></button>
                  <button onClick={() => toggle(q)} className="text-neutral-400 hover:text-red-500"><X className="w-3.5 h-3.5" /></button>
                </>}
              </div>
            ))}
          </div>
        </div>
        {!isAuto && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wide text-neutral-400">Banque</span>
              <select className={sel + " flex-1 py-1.5"} value={pickCh} onChange={(e) => setPickCh(e.target.value)}>
                <option value="">— Chapitre —</option>
                {chapters.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {pickCh && !bank && <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />}
              {bank?.map((g) => (
                <div key={g.notion}>
                  <div className="text-[11px] font-semibold text-arctic-blue dark:text-arctic-cyan mb-1">{notionLabel(g.notion)} · {g.items.length}</div>
                  {g.items.map((q) => (
                    <label key={q.id} className="flex items-start gap-2 rounded-lg px-2 py-1.5 hover:bg-black/[0.03] dark:hover:bg-white/[0.04] cursor-pointer">
                      <input type="checkbox" className="mt-0.5" checked={inDraft.has(q.id)} onChange={() => toggle(q)} />
                      <span className="text-xs leading-snug line-clamp-2"><Tex>{q.statement}</Tex></span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <button onClick={onSave} disabled={busy} className={btnPrimary}>{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Enregistrer</button>
      </div>
    </div>
  );
}
