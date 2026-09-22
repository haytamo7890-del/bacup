"use client";

import { useCallback, useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { ResourcePanel } from "@/components/resource-panel";
import { Loader2, Plus, Trash2, ChevronLeft, ChevronRight, Check, Upload, ChevronDown } from "lucide-react";

type Row = { id: string; code: string; name: string };
type Exam = { id: string; title: string | null; year: number; session: string | null; exam_type: string; duration_minutes: number | null };
type Exercise = { id: string; title: string | null; statement: string | null; position: number };
type Opt = { id: string; label: string; is_correct: boolean; position: number };
type Question = { id: string; statement: string; points: number; position: number; answer_options: Opt[]; solutions: { body: string }[] | null };

// --- Bulk JSON importer types ---
type ImpQ = { statement: string; points: number; options: string[]; correct?: number; answer?: string; correction?: string };
type ImpEx = { title: string; statement?: string; questions: ImpQ[] };
type ImpExam = { year: number; session: string; exam_type?: string; title?: string; duration_minutes?: number; source_url?: string; exercises: ImpEx[] };
type Preview = { exam: ImpExam; totalPts: number; nEx: number; nQ: number; warnings: string[]; errors: string[] };

const EXAMPLE_JSON = `{
  "year": 2025,
  "session": "rattrapage",
  "exam_type": "national",
  "title": "Mathématiques — Sciences Mathématiques (A & B)",
  "duration_minutes": 240,
  "source_url": "https://…/Sujet-maths-sm-2025-rattrapage.pdf",
  "exercises": [
    {
      "title": "Exercice 1 — Analyse (Partie I)",
      "statement": "Énoncé commun de l'exercice. Maths entre $…$.",
      "questions": [
        {
          "statement": "Étudier la continuité de f à droite en 0.",
          "points": 0.25,
          "options": ["f est continue à droite en 0", "f n'est pas continue en 0", "f est continue à gauche en 0", "f admet une limite infinie en 0"],
          "correct": 0,
          "correction": "On calcule la limite à droite … donc f est continue à droite en 0."
        }
      ]
    }
  ]
}`;

const sel = "rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-arctic-blue";
const input = "w-full " + sel;

export default function AdminExamens() {
  const supabase = createBrowserSupabase();
  const [esId, setEsId] = useState<string | null>(null);
  const [levels, setLevels] = useState<Row[]>([]);
  const [tracks, setTracks] = useState<Row[]>([]);
  const [subjects, setSubjects] = useState<Row[]>([]);
  const [levelId, setLevelId] = useState("");
  const [trackId, setTrackId] = useState("");
  const [subjectId, setSubjectId] = useState("");

  const [exams, setExams] = useState<Exam[]>([]);
  const [exam, setExam] = useState<Exam | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  // bulk JSON importer
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [importing, setImporting] = useState(false);

  const [newExam, setNewExam] = useState({ year: new Date().getFullYear(), session: "normale", exam_type: "national", title: "", duration_minutes: 180 });
  const [newEx, setNewEx] = useState({ title: "", statement: "" });
  const [newQ, setNewQ] = useState({ statement: "", points: 1, options: ["", "", "", ""], correct: 0, solution: "" });

  useEffect(() => {
    (async () => {
      const [{ data: es }, { data: lv }, { data: tr }, { data: su }] = await Promise.all([
        supabase.from("education_systems").select("id").eq("code", "ma_secondaire_qualifiant").maybeSingle(),
        supabase.from("levels").select("id, code, name").order("position"),
        supabase.from("tracks").select("id, code, name").order("name"),
        supabase.from("subjects").select("id, code, name").order("name"),
      ]);
      setEsId((es as { id: string } | null)?.id ?? null);
      setLevels((lv ?? []) as Row[]); setTracks((tr ?? []) as Row[]); setSubjects((su ?? []) as Row[]);
      if (lv?.[0]) setLevelId(lv[0].id);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadExams = useCallback(async () => {
    if (!subjectId || !levelId) { setExams([]); return; }
    setLoading(true);
    let q = supabase.from("exams").select("id, title, year, session, exam_type, duration_minutes").eq("subject_id", subjectId).eq("level_id", levelId);
    q = trackId ? q.eq("track_id", trackId) : q.is("track_id", null);
    const { data } = await q.order("year", { ascending: false });
    setExams((data ?? []) as Exam[]);
    setLoading(false);
  }, [subjectId, levelId, trackId, supabase]);

  useEffect(() => { setExam(null); setExercise(null); loadExams(); }, [loadExams]);

  async function addExam() {
    if (!esId || !subjectId || !levelId) return;
    await supabase.from("exams").insert({
      education_system_id: esId, level_id: levelId, subject_id: subjectId, track_id: trackId || null,
      exam_type: newExam.exam_type, session: newExam.session, year: Number(newExam.year),
      title: newExam.title.trim() || null, duration_minutes: Number(newExam.duration_minutes) || null,
    });
    setNewExam((n) => ({ ...n, title: "" }));
    loadExams();
  }
  async function delExam(id: string) {
    if (!confirm("Supprimer cet examen, ses exercices et questions ?")) return;
    await supabase.from("exercises").delete().eq("exam_id", id);
    await supabase.from("exams").delete().eq("id", id);
    loadExams();
  }

  // ---- Bulk import: parse + validate one exam JSON block, preview, then insert ----
  function analyze() {
    setPreview(null);
    let parsed: any;
    try { parsed = JSON.parse(importText); }
    catch (err: any) { setPreview({ exam: null as any, totalPts: 0, nEx: 0, nQ: 0, warnings: [], errors: ["JSON invalide : " + err.message] }); return; }
    const errors: string[] = []; const warnings: string[] = [];
    const exs: any[] = Array.isArray(parsed?.exercises) ? parsed.exercises : [];
    if (!parsed || typeof parsed !== "object") errors.push("Le bloc doit être un objet JSON.");
    if (!parsed?.year) warnings.push("Année manquante.");
    if (!parsed?.session) warnings.push("Session manquante (normale / rattrapage).");
    if (exs.length === 0) errors.push("Aucun exercice dans le bloc.");
    let totalPts = 0, nQ = 0;
    exs.forEach((ex: any, ei: number) => {
      const qs: any[] = Array.isArray(ex?.questions) ? ex.questions : [];
      if (!ex?.title) warnings.push(`Exercice ${ei + 1} : titre manquant.`);
      if (qs.length === 0) errors.push(`Exercice ${ei + 1} : aucune question.`);
      qs.forEach((q: any, qi: number) => {
        nQ++;
        const opts: any[] = Array.isArray(q?.options) ? q.options : [];
        const pts = Number(q?.points);
        if (opts.length < 2) errors.push(`Ex ${ei + 1} Q${qi + 1} : moins de 2 options.`);
        const ci = typeof q?.correct === "number" ? q.correct : (typeof q?.answer === "string" ? q.answer.trim().toUpperCase().charCodeAt(0) - 65 : -1);
        if (!(ci >= 0 && ci < opts.length)) errors.push(`Ex ${ei + 1} Q${qi + 1} : bonne réponse invalide ("correct" = index 0-based).`);
        if (isNaN(pts) || pts <= 0) errors.push(`Ex ${ei + 1} Q${qi + 1} : barème invalide.`); else totalPts += pts;
        if (!q?.correction) warnings.push(`Ex ${ei + 1} Q${qi + 1} : correction manquante.`);
        if (opts.length !== 4) warnings.push(`Ex ${ei + 1} Q${qi + 1} : ${opts.length} options (4 recommandé).`);
      });
    });
    if (Math.abs(totalPts - 20) > 0.01) warnings.push(`Barème total = ${totalPts} (attendu 20).`);
    setPreview({ exam: parsed, totalPts: Math.round(totalPts * 100) / 100, nEx: exs.length, nQ, warnings, errors });
  }

  async function runImport() {
    if (!preview || preview.errors.length || !esId || !subjectId || !levelId) return;
    setImporting(true);
    const d = preview.exam;
    const { data: exRow, error: exErr } = await supabase.from("exams").insert({
      education_system_id: esId, level_id: levelId, subject_id: subjectId, track_id: trackId || null,
      exam_type: d.exam_type || "national", session: d.session || "normale", year: Number(d.year) || new Date().getFullYear(),
      title: d.title?.trim() || null, duration_minutes: Number(d.duration_minutes) || 180, source_url: d.source_url?.trim() || null,
    }).select("id").single();
    if (exErr || !exRow) { setImporting(false); alert("Erreur (examen) : " + (exErr?.message ?? "")); return; }
    let pos = 1;
    for (const ex of d.exercises) {
      const { data: exr, error: e1 } = await supabase.from("exercises").insert({
        subject_id: subjectId, exam_id: exRow.id, source: "official_exam", difficulty: 4,
        title: ex.title || `Exercice ${pos}`, statement: ex.statement?.trim() || null, position: pos++,
      }).select("id").single();
      if (e1 || !exr) { setImporting(false); alert("Erreur (exercice) : " + (e1?.message ?? "")); return; }
      let qpos = 1;
      for (const q of ex.questions) {
        const opts = (q.options || []) as string[];
        const ci = typeof q.correct === "number" ? q.correct : (q.answer ? q.answer.trim().toUpperCase().charCodeAt(0) - 65 : 0);
        const { data: qr, error: e2 } = await supabase.from("questions").insert({
          exercise_id: exr.id, kind: "mcq", statement: q.statement, points: Number(q.points) || 0, position: qpos++,
        }).select("id").single();
        if (e2 || !qr) { setImporting(false); alert("Erreur (question) : " + (e2?.message ?? "")); return; }
        await supabase.from("answer_options").insert(opts.map((label, i) => ({ question_id: qr.id, label, is_correct: i === ci, position: i + 1 })));
        if (q.correction?.trim()) await supabase.from("solutions").insert({ question_id: qr.id, exercise_id: exr.id, author: "hsgenius", body: q.correction.trim() });
      }
    }
    setImporting(false); setImportText(""); setPreview(null); setShowImport(false); loadExams();
    alert("Examen importé ✓");
  }

  async function openExam(e: Exam) {
    setExam(e); setExercise(null);
    const { data } = await supabase.from("exercises").select("id, title, statement, position").eq("exam_id", e.id).order("position");
    setExercises((data ?? []) as Exercise[]);
  }
  async function addExercise() {
    if (!exam || !subjectId) return;
    const { data } = await supabase.from("exercises").insert({
      subject_id: subjectId, exam_id: exam.id, source: "official_exam",
      title: newEx.title.trim() || "Exercice", statement: newEx.statement.trim() || null, position: exercises.length + 1,
    }).select("id, title, statement, position").single();
    if (data) setExercises((x) => [...x, data as Exercise]);
    setNewEx({ title: "", statement: "" });
  }
  async function delExercise(id: string) {
    if (!confirm("Supprimer cet exercice et ses questions ?")) return;
    await supabase.from("exercises").delete().eq("id", id);
    setExercises((x) => x.filter((e) => e.id !== id));
  }

  async function openExercise(ex: Exercise) {
    setExercise(ex);
    const { data } = await supabase.from("questions")
      .select("id, statement, points, position, answer_options(id,label,is_correct,position), solutions(body)")
      .eq("exercise_id", ex.id).order("position");
    setQuestions((data ?? []) as unknown as Question[]);
  }
  async function addQuestion() {
    if (!exercise || !newQ.statement.trim()) return;
    const opts = newQ.options.map((o) => o.trim()).filter(Boolean);
    if (opts.length < 2) { alert("Ajoute au moins 2 options."); return; }
    const { data: qRow } = await supabase.from("questions").insert({
      exercise_id: exercise.id, kind: "mcq", statement: newQ.statement.trim(), points: Number(newQ.points) || 1, position: questions.length + 1,
    }).select("id").single();
    if (!qRow) return;
    await supabase.from("answer_options").insert(opts.map((label, i) => ({ question_id: qRow.id, label, is_correct: i === newQ.correct, position: i + 1 })));
    if (newQ.solution.trim()) await supabase.from("solutions").insert({ question_id: qRow.id, author: "hsgenius", body: newQ.solution.trim() });
    setNewQ({ statement: "", points: 1, options: ["", "", "", ""], correct: 0, solution: "" });
    openExercise(exercise);
  }
  async function delQuestion(id: string) {
    if (!confirm("Supprimer cette question ?")) return;
    await supabase.from("questions").delete().eq("id", id);
    setQuestions((qs) => qs.filter((q) => q.id !== id));
  }

  // ---- QUESTIONS of an exercise ----
  if (exercise) {
    return (
      <div className="max-w-3xl fade-up">
        <button onClick={() => setExercise(null)} className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white"><ChevronLeft className="w-4 h-4" /> Exercices</button>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">{exercise.title}</h1>

        <div className="mt-5 space-y-3">
          {questions.map((q, i) => {
            const correct = q.answer_options?.find((o) => o.is_correct);
            return (
              <div key={q.id} className="glass rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-sm"><span className="text-neutral-400">Q{i + 1} · {q.points} pt</span><div className="font-medium mt-0.5">{q.statement}</div></div>
                  <button onClick={() => delQuestion(q.id)} className="shrink-0 w-8 h-8 rounded-lg bg-red-500/10 text-red-500 grid place-items-center hover:bg-red-500/20 transition"><Trash2 className="w-4 h-4" /></button>
                </div>
                {correct && <div className="mt-1.5 text-xs text-emerald-500 inline-flex items-center gap-1"><Check className="w-3 h-3" /> {correct.label}</div>}
              </div>
            );
          })}
        </div>

        {/* new question */}
        <div className="mt-5 glass rounded-2xl p-5 space-y-3">
          <div className="font-semibold text-sm">Nouvelle question</div>
          <textarea className={input} rows={2} placeholder="Énoncé. Maths entre $...$" value={newQ.statement} onChange={(e) => setNewQ((n) => ({ ...n, statement: e.target.value }))} />
          {newQ.options.map((o, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="radio" name="correct" checked={newQ.correct === i} onChange={() => setNewQ((n) => ({ ...n, correct: i }))} className="accent-emerald-600" />
              <input className={input} placeholder={`Option ${String.fromCharCode(65 + i)}`} value={o} onChange={(e) => setNewQ((n) => { const options = [...n.options]; options[i] = e.target.value; return { ...n, options }; })} />
            </div>
          ))}
          <div className="flex items-center gap-2">
            <label className="text-xs text-neutral-500">Points</label>
            <input type="number" step="0.5" className={sel + " w-24"} value={newQ.points} onChange={(e) => setNewQ((n) => ({ ...n, points: Number(e.target.value) }))} />
            <span className="text-xs text-neutral-400">· Coche la bonne réponse à gauche</span>
          </div>
          <textarea className={input} rows={2} placeholder="Correction (optionnelle)" value={newQ.solution} onChange={(e) => setNewQ((n) => ({ ...n, solution: e.target.value }))} />
          <div className="flex justify-end">
            <button onClick={addQuestion} className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white hover:brightness-105 transition"><Plus className="w-4 h-4" /> Ajouter la question</button>
          </div>
        </div>
      </div>
    );
  }

  // ---- EXERCISES of an exam ----
  if (exam) {
    return (
      <div className="max-w-3xl fade-up">
        <button onClick={() => setExam(null)} className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white"><ChevronLeft className="w-4 h-4" /> Examens</button>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">{exam.title ?? `${exam.exam_type} ${exam.year}`}</h1>

        <div className="mt-5 space-y-2.5">
          {exercises.map((ex) => (
            <div key={ex.id} className="glass rounded-2xl p-4 flex items-center justify-between gap-3">
              <button onClick={() => openExercise(ex)} className="flex-1 text-left font-semibold tracking-tight">{ex.title}</button>
              <button onClick={() => delExercise(ex.id)} className="w-9 h-9 rounded-lg bg-red-500/10 text-red-500 grid place-items-center hover:bg-red-500/20 transition"><Trash2 className="w-4 h-4" /></button>
              <button onClick={() => openExercise(ex)} className="w-9 h-9 rounded-lg glass grid place-items-center"><ChevronRight className="w-4 h-4 text-neutral-400" /></button>
            </div>
          ))}
          {exercises.length === 0 && <div className="glass rounded-2xl p-6 text-center text-sm text-neutral-400">Aucun exercice.</div>}
        </div>

        <div className="mt-5 glass rounded-2xl p-4 space-y-2">
          <input className={input} placeholder="Titre de l'exercice" value={newEx.title} onChange={(e) => setNewEx((n) => ({ ...n, title: e.target.value }))} />
          <textarea className={input} rows={2} placeholder="Contexte / énoncé commun (optionnel)" value={newEx.statement} onChange={(e) => setNewEx((n) => ({ ...n, statement: e.target.value }))} />
          <div className="flex justify-end"><button onClick={addExercise} className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white hover:brightness-105 transition"><Plus className="w-4 h-4" /> Ajouter</button></div>
        </div>

        <div className="mt-6"><ResourcePanel scope="exam" scopeKey={exam.id} /></div>
      </div>
    );
  }

  // ---- EXAMS list ----
  return (
    <div className="max-w-3xl fade-up">
      <h1 className="text-3xl font-bold tracking-tight">Examens</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Crée des examens, exercices et questions QCU.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <select className={sel} value={levelId} onChange={(e) => setLevelId(e.target.value)}>{levels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}</select>
        <select className={sel} value={trackId} onChange={(e) => setTrackId(e.target.value)}><option value="">Commun (toutes filières)</option>{tracks.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
        <select className={sel} value={subjectId} onChange={(e) => setSubjectId(e.target.value)}><option value="">Choisis une matière…</option>{subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
      </div>

      {!subjectId ? (
        <div className="mt-6 glass rounded-2xl p-8 text-center text-sm text-neutral-400">Choisis un niveau, une filière et une matière.</div>
      ) : (
        <>
          <div className="mt-5 glass rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
            <input type="number" className={sel} placeholder="Année" value={newExam.year} onChange={(e) => setNewExam((n) => ({ ...n, year: Number(e.target.value) }))} />
            <select className={sel} value={newExam.exam_type} onChange={(e) => setNewExam((n) => ({ ...n, exam_type: e.target.value }))}><option value="national">National</option><option value="regional">Régional</option><option value="blanc">Blanc</option></select>
            <select className={sel} value={newExam.session} onChange={(e) => setNewExam((n) => ({ ...n, session: e.target.value }))}><option value="normale">Normale</option><option value="rattrapage">Rattrapage</option></select>
            <input type="number" className={sel} placeholder="Durée (min)" value={newExam.duration_minutes} onChange={(e) => setNewExam((n) => ({ ...n, duration_minutes: Number(e.target.value) }))} />
            <input className={sel + " col-span-2 sm:col-span-3"} placeholder="Titre (optionnel)" value={newExam.title} onChange={(e) => setNewExam((n) => ({ ...n, title: e.target.value }))} />
            <button onClick={addExam} className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white hover:brightness-105 transition"><Plus className="w-4 h-4" /> Créer</button>
          </div>

          <div className="mt-4 glass rounded-2xl p-4">
            <button onClick={() => setShowImport((v) => !v)} className="w-full flex items-center justify-between text-sm font-semibold">
              <span className="inline-flex items-center gap-2"><Upload className="w-4 h-4 text-arctic-blue dark:text-arctic-cyan" /> Importer un examen complet (coller JSON)</span>
              <ChevronDown className={`w-4 h-4 transition ${showImport ? "rotate-180" : ""}`} />
            </button>
            {showImport && (
              <div className="mt-3 space-y-3">
                <textarea className={input + " font-mono text-xs"} rows={10} placeholder="Colle ici le bloc JSON de l'examen…" value={importText} onChange={(e) => setImportText(e.target.value)} />
                <div className="flex items-center gap-2">
                  <button onClick={analyze} className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full glass hover:-translate-y-0.5 transition">Analyser</button>
                  <button onClick={() => { setImportText(""); setPreview(null); }} className="text-xs text-neutral-400 hover:text-neutral-600">Effacer</button>
                  <details className="ml-auto text-xs text-neutral-400"><summary className="cursor-pointer">Voir le format</summary><pre className="mt-2 max-h-56 overflow-auto glass rounded-xl p-3 text-[11px] leading-relaxed whitespace-pre-wrap">{EXAMPLE_JSON}</pre></details>
                </div>
                {preview && (
                  <div className="glass rounded-2xl p-4 text-sm">
                    {preview.errors.length > 0 ? (
                      <div className="text-red-500 space-y-1">
                        <div className="font-semibold">Erreurs à corriger :</div>
                        <ul className="list-disc pl-5 space-y-0.5 text-xs">{preview.errors.map((er, i) => <li key={i}>{er}</li>)}</ul>
                      </div>
                    ) : (
                      <>
                        <div className="font-semibold">{preview.exam.title || "Examen"} · {preview.exam.year} · {preview.exam.session}</div>
                        <div className="mt-1 text-neutral-500">{preview.nEx} exercice(s) · {preview.nQ} question(s) · <span className={Math.abs(preview.totalPts - 20) < 0.01 ? "text-emerald-500 font-semibold" : "text-amber-500 font-semibold"}>{preview.totalPts}/20</span></div>
                        {preview.warnings.length > 0 && (
                          <ul className="mt-2 list-disc pl-5 space-y-0.5 text-[11px] text-amber-500">{preview.warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>
                        )}
                        <button onClick={runImport} disabled={importing} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold px-5 py-2 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white hover:brightness-105 transition disabled:opacity-60">
                          {importing ? <><Loader2 className="w-4 h-4 animate-spin" /> Import…</> : <><Check className="w-4 h-4" /> Importer cet examen</>}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {loading ? (
            <div className="grid place-items-center h-32 text-neutral-400"><Loader2 className="w-6 h-6 animate-spin" /></div>
          ) : (
            <div className="mt-4 space-y-2.5">
              {exams.map((e) => (
                <div key={e.id} className="glass rounded-2xl p-4 flex items-center justify-between gap-3">
                  <button onClick={() => openExam(e)} className="flex-1 text-left">
                    <div className="font-semibold tracking-tight">{e.title ?? `${e.exam_type} ${e.year}`}</div>
                    <div className="text-[11px] text-neutral-400 capitalize">{e.exam_type} · {e.year} · {e.session} · {e.duration_minutes ?? "—"} min</div>
                  </button>
                  <button onClick={() => delExam(e.id)} className="w-9 h-9 rounded-lg bg-red-500/10 text-red-500 grid place-items-center hover:bg-red-500/20 transition"><Trash2 className="w-4 h-4" /></button>
                  <button onClick={() => openExam(e)} className="w-9 h-9 rounded-lg glass grid place-items-center"><ChevronRight className="w-4 h-4 text-neutral-400" /></button>
                </div>
              ))}
              {exams.length === 0 && <div className="glass rounded-2xl p-8 text-center text-sm text-neutral-400">Aucun examen. Crée le premier ci-dessus.</div>}
            </div>
          )}
        </>
      )}
    </div>
  );
}
