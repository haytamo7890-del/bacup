"use client";

import { useCallback, useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { ResourcePanel } from "@/components/resource-panel";
import { Loader2, Plus, Trash2, ChevronRight, ChevronLeft, Save, BookOpen, ScrollText, Target, Gauge, Clock, Flame, ArrowDownToLine } from "lucide-react";

type Row = { id: string; code: string; name: string };
type Chapter = { id: string; name: string; code: string | null; position: number };
type Lesson = {
  id: string; title: string; body: string | null; resume: string | null;
  objectives: string | null; difficulty: number | null; duration_min: number | null;
  bac_frequency: number | null; kind: string; position: number;
};

const sel = "rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-arctic-blue";
const input = "w-full " + sel;
const LESSON_COLS = "id, title, body, resume, objectives, difficulty, duration_min, bac_frequency, kind, position";

const DIFF = [{ v: 1, l: "Facile" }, { v: 2, l: "Moyen" }, { v: 3, l: "Difficile" }];
const FREQ = [{ v: 0, l: "Jamais" }, { v: 1, l: "Parfois" }, { v: 2, l: "Souvent" }, { v: 3, l: "Quasi-systématique" }];

export default function AdminCours() {
  const supabase = createBrowserSupabase();
  const [levels, setLevels] = useState<Row[]>([]);
  const [tracks, setTracks] = useState<Row[]>([]);
  const [subjects, setSubjects] = useState<Row[]>([]);
  const [levelId, setLevelId] = useState("");
  const [trackId, setTrackId] = useState(""); // "" = commun (null)
  const [subjectId, setSubjectId] = useState("");

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);

  const [newChap, setNewChap] = useState({ code: "", name: "" });

  useEffect(() => {
    (async () => {
      const [{ data: lv }, { data: tr }, { data: su }] = await Promise.all([
        supabase.from("levels").select("id, code, name").order("position"),
        supabase.from("tracks").select("id, code, name").order("name"),
        supabase.from("subjects").select("id, code, name").order("name"),
      ]);
      setLevels((lv ?? []) as Row[]); setTracks((tr ?? []) as Row[]); setSubjects((su ?? []) as Row[]);
      if (lv?.[0]) setLevelId(lv[0].id);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadChapters = useCallback(async () => {
    if (!subjectId || !levelId) { setChapters([]); return; }
    setLoading(true);
    let q = supabase.from("chapters").select("id, name, code, position").eq("subject_id", subjectId).eq("level_id", levelId);
    q = trackId ? q.eq("track_id", trackId) : q.is("track_id", null);
    const { data } = await q.order("position");
    setChapters((data ?? []) as Chapter[]);
    setLoading(false);
  }, [subjectId, levelId, trackId, supabase]);

  useEffect(() => { setChapter(null); loadChapters(); }, [loadChapters]);

  async function addChapter() {
    if (!newChap.name.trim() || !subjectId || !levelId) return;
    await supabase.from("chapters").insert({
      subject_id: subjectId, level_id: levelId, track_id: trackId || null,
      code: newChap.code.trim() || newChap.name.trim().toLowerCase().replace(/\s+/g, "-").slice(0, 40),
      name: newChap.name.trim(), position: chapters.length + 1,
    });
    setNewChap({ code: "", name: "" });
    loadChapters();
  }

  async function delChapter(id: string) {
    if (!confirm("Supprimer ce chapitre et ses leçons ?")) return;
    await supabase.from("chapters").delete().eq("id", id);
    loadChapters();
  }

  async function openChapter(c: Chapter) {
    setChapter(c);
    const { data } = await supabase.from("lessons").select(LESSON_COLS).eq("chapter_id", c.id).order("position");
    setLessons((data ?? []) as Lesson[]);
  }

  async function addLesson() {
    if (!chapter) return;
    const { data } = await supabase.from("lessons").insert({
      chapter_id: chapter.id, title: "Nouvelle notion", body: "", kind: "cours", position: lessons.length + 1,
    }).select(LESSON_COLS).single();
    if (data) setLessons((l) => [...l, data as Lesson]);
  }

  async function saveLesson(l: Lesson) {
    await supabase.from("lessons").update({
      title: l.title, body: l.body, resume: l.resume, objectives: l.objectives,
      difficulty: l.difficulty, duration_min: l.duration_min, bac_frequency: l.bac_frequency,
    }).eq("id", l.id);
    setSaved(l.id);
    setTimeout(() => setSaved((s) => (s === l.id ? null : s)), 1600);
  }
  async function delLesson(id: string) {
    if (!confirm("Supprimer cette notion ?")) return;
    await supabase.from("lessons").delete().eq("id", id);
    setLessons((l) => l.filter((x) => x.id !== id));
  }
  function editLesson(id: string, patch: Partial<Lesson>) {
    setLessons((ls) => ls.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }
  // Migration helper: promote the current course body into the Fiche field
  // (used when loading a real deep course from the source files over the old summary).
  function promoteToFiche(l: Lesson) {
    if (!l.body?.trim()) return;
    if (l.resume?.trim() && !confirm("La fiche existe déjà. La remplacer par le cours actuel ?")) return;
    editLesson(l.id, { resume: l.body });
  }

  // ---- Lessons editor for the selected chapter ----
  if (chapter) {
    return (
      <div className="max-w-3xl fade-up">
        <button onClick={() => setChapter(null)} className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white"><ChevronLeft className="w-4 h-4" /> Chapitres</button>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">{chapter.name}</h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Chaque <b>notion</b> a un cours complet et une fiche. L&apos;élève bascule entre les deux.</p>
        <div className="mt-3">
          <button onClick={addLesson} className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white hover:brightness-105 transition"><Plus className="w-4 h-4" /> Ajouter une notion</button>
        </div>

        <div className="mt-5 space-y-5">
          {lessons.map((l, i) => (
            <div key={l.id} className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-arctic-blue/10 text-arctic-blue dark:text-arctic-cyan grid place-items-center text-xs font-bold shrink-0">{i + 1}</span>
                <input className={input} value={l.title} onChange={(e) => editLesson(l.id, { title: e.target.value })} placeholder="Titre de la notion" />
                <button onClick={() => delLesson(l.id)} className="shrink-0 w-9 h-9 rounded-lg bg-red-500/10 text-red-500 grid place-items-center hover:bg-red-500/20 transition"><Trash2 className="w-4 h-4" /></button>
              </div>

              {/* En-tête metadata */}
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-neutral-400 inline-flex items-center gap-1"><Gauge className="w-3 h-3" /> Difficulté</span>
                  <select className={sel} value={l.difficulty ?? ""} onChange={(e) => editLesson(l.id, { difficulty: e.target.value ? Number(e.target.value) : null })}>
                    <option value="">—</option>
                    {DIFF.map((d) => <option key={d.v} value={d.v}>{d.l}</option>)}
                  </select>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-neutral-400 inline-flex items-center gap-1"><Clock className="w-3 h-3" /> Durée (min)</span>
                  <input type="number" min={0} className={sel} value={l.duration_min ?? ""} onChange={(e) => editLesson(l.id, { duration_min: e.target.value ? Number(e.target.value) : null })} />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-neutral-400 inline-flex items-center gap-1"><Flame className="w-3 h-3" /> Fréquence BAC</span>
                  <select className={sel} value={l.bac_frequency ?? ""} onChange={(e) => editLesson(l.id, { bac_frequency: e.target.value ? Number(e.target.value) : null })}>
                    <option value="">—</option>
                    {FREQ.map((d) => <option key={d.v} value={d.v}>{d.l}</option>)}
                  </select>
                </label>
              </div>

              <label className="mt-3 flex flex-col gap-1">
                <span className="text-[11px] font-semibold text-neutral-400 inline-flex items-center gap-1"><Target className="w-3 h-3" /> Objectifs (un par ligne)</span>
                <textarea className={input} rows={2} value={l.objectives ?? ""} onChange={(e) => editLesson(l.id, { objectives: e.target.value })} placeholder={"Résoudre une équation du second degré\nInterpréter le discriminant"} />
              </label>

              {/* Cours complet */}
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-arctic-blue dark:text-arctic-cyan inline-flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> Cours complet</span>
                  <button onClick={() => promoteToFiche(l)} title="Copier le cours actuel dans la fiche" className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-500 hover:text-arctic-blue dark:hover:text-arctic-cyan transition"><ArrowDownToLine className="w-3.5 h-3.5" /> Utiliser comme fiche</button>
                </div>
                <textarea className={input + " mt-1.5 font-mono"} rows={10} value={l.body ?? ""} onChange={(e) => editLesson(l.id, { body: e.target.value })} placeholder="Cours natif. Sections avec ## Titre, callouts :::definition / :::theoreme / :::methode / :::attention, maths entre $...$ ou $$...$$." />
              </div>

              {/* Fiche / résumé */}
              <div className="mt-4">
                <span className="text-[11px] font-bold uppercase tracking-wide text-arctic-blue dark:text-arctic-cyan inline-flex items-center gap-1.5"><ScrollText className="w-3.5 h-3.5" /> Fiche · L&apos;essentiel</span>
                <textarea className={input + " mt-1.5 font-mono"} rows={6} value={l.resume ?? ""} onChange={(e) => editLesson(l.id, { resume: e.target.value })} placeholder="Résumé condensé pour la révision rapide. Vide = fiche générée automatiquement." />
              </div>

              <div className="mt-3 flex items-center justify-end gap-3">
                {saved === l.id && <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Enregistré</span>}
                <button onClick={() => saveLesson(l)} className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition"><Save className="w-4 h-4" /> Enregistrer</button>
              </div>
            </div>
          ))}
          {lessons.length === 0 && <div className="glass rounded-2xl p-8 text-center text-sm text-neutral-400">Aucune notion. Ajoute la première ci-dessus.</div>}
        </div>

        <div className="mt-6"><ResourcePanel scope="chapter" scopeKey={chapter.id} /></div>
      </div>
    );
  }

  // ---- Chapters list ----
  return (
    <div className="max-w-3xl fade-up">
      <h1 className="text-3xl font-bold tracking-tight">Cours</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Gère les chapitres et leurs notions (cours + fiche).</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <select className={sel} value={levelId} onChange={(e) => setLevelId(e.target.value)}>
          {levels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
        <select className={sel} value={trackId} onChange={(e) => setTrackId(e.target.value)}>
          <option value="">Commun (toutes filières)</option>
          {tracks.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <select className={sel} value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
          <option value="">Choisis une matière…</option>
          {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {!subjectId ? (
        <div className="mt-6 glass rounded-2xl p-8 text-center text-sm text-neutral-400">Choisis un niveau, une filière et une matière.</div>
      ) : (
        <>
          <div className="mt-5 glass rounded-2xl p-4 flex flex-wrap items-center gap-2">
            <input className={sel + " flex-1 min-w-[120px]"} placeholder="Nom du chapitre" value={newChap.name} onChange={(e) => setNewChap((n) => ({ ...n, name: e.target.value }))} />
            <input className={sel + " w-32"} placeholder="code" value={newChap.code} onChange={(e) => setNewChap((n) => ({ ...n, code: e.target.value }))} />
            <button onClick={addChapter} className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white hover:brightness-105 transition"><Plus className="w-4 h-4" /> Ajouter</button>
          </div>

          {loading ? (
            <div className="grid place-items-center h-32 text-neutral-400"><Loader2 className="w-6 h-6 animate-spin" /></div>
          ) : (
            <div className="mt-4 space-y-2.5">
              {chapters.map((c) => (
                <div key={c.id} className="glass rounded-2xl p-4 flex items-center justify-between gap-3">
                  <button onClick={() => openChapter(c)} className="flex-1 text-left flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-arctic-blue/10 text-arctic-blue dark:text-arctic-cyan grid place-items-center text-xs font-bold">{c.position}</span>
                    <span className="font-semibold tracking-tight">{c.name}</span>
                  </button>
                  <button onClick={() => delChapter(c.id)} className="w-9 h-9 rounded-lg bg-red-500/10 text-red-500 grid place-items-center hover:bg-red-500/20 transition"><Trash2 className="w-4 h-4" /></button>
                  <button onClick={() => openChapter(c)} className="w-9 h-9 rounded-lg glass grid place-items-center"><ChevronRight className="w-4 h-4 text-neutral-400" /></button>
                </div>
              ))}
              {chapters.length === 0 && <div className="glass rounded-2xl p-8 text-center text-sm text-neutral-400">Aucun chapitre. Ajoute le premier ci-dessus.</div>}
            </div>
          )}

          <div className="mt-8 glass rounded-2xl p-5 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-arctic-blue/10 text-arctic-blue dark:text-arctic-cyan grid place-items-center shrink-0"><ScrollText className="w-5 h-5" /></span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold tracking-tight">Annales (sujets PDF)</div>
              <div className="text-[12px] text-neutral-400">Gère-les par filière, année et session dans l&apos;onglet dédié.</div>
            </div>
            <a href="/admin/annales" className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white hover:brightness-105 transition">Ouvrir Annales <ChevronRight className="w-4 h-4" /></a>
          </div>
        </>
      )}
    </div>
  );
}
