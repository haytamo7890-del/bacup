"use client";

import { useCallback, useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { Loader2, Plus, Trash2, ChevronRight, ChevronLeft, Upload, ListChecks, Code2, Check } from "lucide-react";

type Row = { id: string; code: string; name: string };
type Chapter = { id: string; name: string; code: string | null; position: number };
type Serie = { id: string; title: string; difficulty: number | null; qcount: number };
type Opt = { label: string; is_correct: boolean };
type QDraft = { statement: string; kind: "mcq" | "open" | "numeric"; notion: string; correct_value: string; options: Opt[]; solution: string };

const sel = "rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-arctic-blue";
const input = "w-full " + sel;
const DIFF = [{ v: 1, l: "Facile" }, { v: 2, l: "Moyen" }, { v: 3, l: "Difficile" }];

const emptyQ = (): QDraft => ({ statement: "", kind: "mcq", notion: "", correct_value: "", options: [{ label: "", is_correct: true }, { label: "", is_correct: false }, { label: "", is_correct: false }, { label: "", is_correct: false }], solution: "" });

const JSON_EXAMPLE = `[
  {
    "statement": "Résoudre x² - 5x + 6 = 0",
    "kind": "mcq",
    "notion": "équation du second degré",
    "options": [
      { "label": "x = 2 ou x = 3", "is_correct": true },
      { "label": "x = -2 ou x = -3" },
      { "label": "x = 1 ou x = 6" },
      { "label": "pas de solution" }
    ],
    "solution": "Δ = 25 - 24 = 1, x = (5 ± 1)/2 → 2 ou 3."
  },
  {
    "statement": "Donner la dérivée de f(x) = x³",
    "kind": "open",
    "notion": "dérivation",
    "correct_value": "3x²",
    "solution": "f'(x) = 3x²."
  }
]`;

export default function AdminExercices() {
  const supabase = createBrowserSupabase();
  const [levels, setLevels] = useState<Row[]>([]);
  const [tracks, setTracks] = useState<Row[]>([]);
  const [subjects, setSubjects] = useState<Row[]>([]);
  const [levelId, setLevelId] = useState("");
  const [trackId, setTrackId] = useState("");
  const [subjectId, setSubjectId] = useState("");

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [series, setSeries] = useState<Serie[]>([]);
  const [loading, setLoading] = useState(false);

  const [tab, setTab] = useState<"builder" | "json">("builder");
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  const [questions, setQuestions] = useState<QDraft[]>([emptyQ()]);
  const [jsonText, setJsonText] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

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

  async function openChapter(c: Chapter) {
    setChapter(c);
    setMsg(null);
    await refreshSeries(c.id);
  }

  async function refreshSeries(chapterId: string) {
    const { data: ex } = await supabase.from("exercises").select("id, title, difficulty").eq("chapter_id", chapterId).order("position");
    const rows = (ex ?? []) as { id: string; title: string; difficulty: number | null }[];
    const withCounts = await Promise.all(rows.map(async (r) => {
      const { count } = await supabase.from("questions").select("id", { count: "exact", head: true }).eq("exercise_id", r.id);
      return { id: r.id, title: r.title, difficulty: r.difficulty, qcount: count ?? 0 } as Serie;
    }));
    setSeries(withCounts);
  }

  function editQ(i: number, patch: Partial<QDraft>) {
    setQuestions((qs) => qs.map((q, k) => (k === i ? { ...q, ...patch } : q)));
  }
  function editOpt(qi: number, oi: number, patch: Partial<Opt>) {
    setQuestions((qs) => qs.map((q, k) => {
      if (k !== qi) return q;
      const options = q.options.map((o, j) => (j === oi ? { ...o, ...patch } : (patch.is_correct ? { ...o, is_correct: false } : o)));
      return { ...q, options };
    }));
  }

  function buildPayload(): unknown[] {
    return questions
      .filter((q) => q.statement.trim())
      .map((q) => {
        const base: Record<string, unknown> = { statement: q.statement.trim(), kind: q.kind };
        if (q.notion.trim()) base.notion = q.notion.trim();
        if (q.solution.trim()) base.solution = q.solution.trim();
        if (q.kind === "mcq") base.options = q.options.filter((o) => o.label.trim()).map((o) => ({ label: o.label.trim(), is_correct: o.is_correct }));
        else if (q.correct_value.trim()) base.correct_value = q.correct_value.trim();
        return base;
      });
  }

  async function importSeries(payload: unknown[]) {
    if (!chapter) return;
    if (!payload.length) { setMsg({ ok: false, text: "Aucune question valide à importer." }); return; }
    setBusy(true); setMsg(null);
    const { data, error } = await supabase.rpc("import_series", {
      p_chapter: chapter.id, p_title: title.trim() || "Série d'exercices", p_difficulty: difficulty, p_questions: payload,
    });
    setBusy(false);
    if (error) { setMsg({ ok: false, text: error.message }); return; }
    const n = (data as { questions?: number })?.questions ?? payload.length;
    setMsg({ ok: true, text: `Série importée · ${n} question${n > 1 ? "s" : ""}.` });
    setTitle(""); setQuestions([emptyQ()]); setJsonText("");
    await refreshSeries(chapter.id);
  }

  function importFromJson() {
    let parsed: unknown;
    try { parsed = JSON.parse(jsonText); } catch { setMsg({ ok: false, text: "JSON invalide — vérifie la syntaxe." }); return; }
    if (!Array.isArray(parsed)) { setMsg({ ok: false, text: "Le JSON doit être un tableau de questions." }); return; }
    importSeries(parsed);
  }

  async function delSerie(id: string) {
    if (!confirm("Supprimer cette série et ses questions ?")) return;
    await supabase.from("exercises").delete().eq("id", id);
    if (chapter) await refreshSeries(chapter.id);
  }

  // ---- Series editor for a chapter ----
  if (chapter) {
    return (
      <div className="max-w-3xl fade-up">
        <button onClick={() => setChapter(null)} className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white"><ChevronLeft className="w-4 h-4" /> Chapitres</button>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">{chapter.name}</h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Importe des séries d&apos;exercices depuis tes fichiers source.</p>

        {series.length > 0 && (
          <div className="mt-5 space-y-2">
            {series.map((s) => (
              <div key={s.id} className="glass rounded-xl p-3 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-arctic-blue/10 text-arctic-blue dark:text-arctic-cyan grid place-items-center shrink-0"><ListChecks className="w-4 h-4" /></span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{s.title}</div>
                  <div className="text-[11px] text-neutral-400">{s.qcount} question{s.qcount > 1 ? "s" : ""}{s.difficulty ? ` · ${DIFF.find((d) => d.v === s.difficulty)?.l ?? ""}` : ""}</div>
                </div>
                <button onClick={() => delSerie(s.id)} className="shrink-0 w-8 h-8 rounded-lg bg-red-500/10 text-red-500 grid place-items-center hover:bg-red-500/20 transition"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        )}

        {/* Composer */}
        <div className="mt-6 glass rounded-2xl p-5">
          <div className="flex flex-wrap items-center gap-2">
            <input className={sel + " flex-1 min-w-[160px]"} placeholder="Titre de la série (ex : Série 1 · Suites)" value={title} onChange={(e) => setTitle(e.target.value)} />
            <select className={sel} value={difficulty} onChange={(e) => setDifficulty(Number(e.target.value))}>
              {DIFF.map((d) => <option key={d.v} value={d.v}>{d.l}</option>)}
            </select>
          </div>

          <div className="mt-4 inline-flex rounded-full bg-black/[0.04] dark:bg-white/[0.06] p-1 text-sm font-semibold">
            <button onClick={() => setTab("builder")} className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full transition ${tab === "builder" ? "bg-white dark:bg-neutral-800 shadow-sm" : "text-neutral-500"}`}><ListChecks className="w-4 h-4" /> Manuel</button>
            <button onClick={() => setTab("json")} className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full transition ${tab === "json" ? "bg-white dark:bg-neutral-800 shadow-sm" : "text-neutral-500"}`}><Code2 className="w-4 h-4" /> JSON (rapide)</button>
          </div>

          {tab === "builder" ? (
            <div className="mt-4 space-y-4">
              {questions.map((q, i) => (
                <div key={i} className="rounded-xl border border-neutral-200/70 dark:border-neutral-800 p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-neutral-400">Q{i + 1}</span>
                    <select className={sel + " py-1.5"} value={q.kind} onChange={(e) => editQ(i, { kind: e.target.value as QDraft["kind"] })}>
                      <option value="mcq">QCM</option>
                      <option value="open">Ouverte</option>
                      <option value="numeric">Numérique</option>
                    </select>
                    <input className={sel + " py-1.5 flex-1 min-w-[100px]"} placeholder="notion (ex : dérivation)" value={q.notion} onChange={(e) => editQ(i, { notion: e.target.value })} />
                    {questions.length > 1 && <button onClick={() => setQuestions((qs) => qs.filter((_, k) => k !== i))} className="shrink-0 w-8 h-8 rounded-lg bg-red-500/10 text-red-500 grid place-items-center hover:bg-red-500/20 transition"><Trash2 className="w-4 h-4" /></button>}
                  </div>
                  <textarea className={input + " mt-2"} rows={2} placeholder="Énoncé. Maths entre $...$" value={q.statement} onChange={(e) => editQ(i, { statement: e.target.value })} />
                  {q.kind === "mcq" ? (
                    <div className="mt-2 space-y-1.5">
                      {q.options.map((o, oi) => (
                        <div key={oi} className="flex items-center gap-2">
                          <button onClick={() => editOpt(i, oi, { is_correct: true })} title="Bonne réponse" className={`w-6 h-6 rounded-full border grid place-items-center shrink-0 transition ${o.is_correct ? "bg-emerald-500 border-emerald-500 text-white" : "border-neutral-400/60 text-transparent hover:border-emerald-500"}`}><Check className="w-3.5 h-3.5" strokeWidth={3} /></button>
                          <input className={sel + " py-1.5 flex-1"} placeholder={`Option ${oi + 1}`} value={o.label} onChange={(e) => editOpt(i, oi, { label: e.target.value })} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <input className={input + " mt-2"} placeholder="Réponse correcte" value={q.correct_value} onChange={(e) => editQ(i, { correct_value: e.target.value })} />
                  )}
                  <textarea className={input + " mt-2"} rows={2} placeholder="Correction / solution" value={q.solution} onChange={(e) => editQ(i, { solution: e.target.value })} />
                </div>
              ))}
              <button onClick={() => setQuestions((qs) => [...qs, emptyQ()])} className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full bg-arctic-blue/10 text-arctic-blue dark:text-arctic-cyan hover:bg-arctic-blue/20 transition"><Plus className="w-4 h-4" /> Ajouter une question</button>
              <div className="flex items-center justify-end gap-3">
                {msg && <span className={`text-xs font-semibold ${msg.ok ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>{msg.text}</span>}
                <button onClick={() => importSeries(buildPayload())} disabled={busy} className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white hover:brightness-105 transition disabled:opacity-50">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Importer la série</button>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-xs text-neutral-400 mb-2">Colle un tableau JSON de questions. Champs : <code>statement</code>, <code>kind</code> (mcq/open/numeric), <code>notion</code>, <code>options</code> [{`{label, is_correct}`}], <code>correct_value</code>, <code>solution</code>.</p>
              <textarea className={input + " font-mono"} rows={12} placeholder={JSON_EXAMPLE} value={jsonText} onChange={(e) => setJsonText(e.target.value)} />
              <div className="mt-2 flex items-center justify-between gap-3">
                <button onClick={() => setJsonText(JSON_EXAMPLE)} className="text-xs font-semibold text-neutral-500 hover:text-arctic-blue dark:hover:text-arctic-cyan transition">Insérer un exemple</button>
                <div className="flex items-center gap-3">
                  {msg && <span className={`text-xs font-semibold ${msg.ok ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>{msg.text}</span>}
                  <button onClick={importFromJson} disabled={busy} className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white hover:brightness-105 transition disabled:opacity-50">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Importer le JSON</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---- Chapter picker ----
  return (
    <div className="max-w-3xl fade-up">
      <h1 className="text-3xl font-bold tracking-tight">Séries d&apos;exercices</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Choisis un chapitre, puis importe ses séries.</p>

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
      ) : loading ? (
        <div className="grid place-items-center h-32 text-neutral-400"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : (
        <div className="mt-5 space-y-2.5">
          {chapters.map((c) => (
            <button key={c.id} onClick={() => openChapter(c)} className="w-full glass rounded-2xl p-4 flex items-center justify-between gap-3 text-left hover:-translate-y-0.5 transition">
              <span className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-arctic-blue/10 text-arctic-blue dark:text-arctic-cyan grid place-items-center text-xs font-bold">{c.position}</span>
                <span className="font-semibold tracking-tight">{c.name}</span>
              </span>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </button>
          ))}
          {chapters.length === 0 && <div className="glass rounded-2xl p-8 text-center text-sm text-neutral-400">Aucun chapitre. Crée-les d&apos;abord dans l&apos;onglet Cours.</div>}
        </div>
      )}
    </div>
  );
}
