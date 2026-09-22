"use client";

/**
 * QCU exam runner — a national paper played as a QCU (solve on paper, then pick
 * the answer), auto-graded by each question's barème → /20.
 *
 * Mode (Révision | Examen) is chosen on the exam card and passed via
 * ?mode=revise|exam — no intro screen here.
 *
 * The screen carries the exam's SUBJECT accent (Maths = orange, via
 * subjectTheme). The top switcher groups the paper by EXERCISE/section (a clean,
 * full-width row — one target per exercise, not per sub-part); selecting one
 * shows all its parts (énoncés + questions) below, scrollable.
 *
 *   exams → exercises → questions(points) → answer_options(is_correct)
 *   + solutions(body) + question_explanations(mode, body)  (5 stored AI modes)
 * Writes on finish: exam_sessions (+ attempts linked by exam_session_id).
 *
 * Route: /dashboard/examens/session?exam=<uuid>&mode=revise|exam
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { Tex } from "@/components/math";
import { subjectTheme } from "@/config/subjects";
import { subjectIcon } from "@/components/subject-pad";
import {
  ChevronLeft, ChevronRight, Clock, Check, X, Flag,
  Loader2, BookOpen, Eye, ListFilter, Trophy, FileText, ChevronDown,
} from "lucide-react";

type Opt = { id: string; label: string; is_correct: boolean; position: number };
type Subj = { name: string; code: string } | null;
type Exam = { id: string; title: string | null; year: number; session: string | null; duration_minutes: number | null; source_url: string | null; subjects: Subj };
type Q = {
  id: string; exId: string; exTitle: string; exStatement: string | null;
  statement: string; points: number; position: number;
  solution: string; modes: Record<string, string>; options: Opt[];
};
type Part = { exId: string; title: string; statement: string | null; points: number; qs: Q[] };
type Group = { key: string; num: string; label: string; parts: Part[]; qs: Q[]; points: number };
type RunMode = "revise" | "exam";

const MODES: { key: string; label: string; emoji: string }[] = [
  { key: "autrement", label: "Explique autrement", emoji: "💡" },
  { key: "etapes", label: "Étape par étape", emoji: "🪜" },
  { key: "cours", label: "Rappel du cours", emoji: "📘" },
  { key: "erreurs", label: "Erreurs fréquentes", emoji: "⚠️" },
  { key: "methode", label: "Méthode générale", emoji: "🧭" },
];
const LETTER = (i: number) => String.fromCharCode(65 + i);
const nf = (n: number) => n.toFixed(2).replace(/\.?0+$/, "");
const fmtT = (s: number) => `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
// group label: "Exercice 1 — Analyse (Partie I)" → "Analyse"
const groupLabel = (title: string) =>
  title.replace(/Exercice\s+\d+\s*[—–-]\s*/i, "").replace(/\s*\(Partie[^)]*\)/i, "").trim() || title;
// part label: "… (Partie I)" → "Partie I"  (null if none)
const partLabel = (title: string) => title.match(/Partie\s+[IVX0-9]+/i)?.[0] ?? null;

export default function ExamSessionPage() {
  const supabase = createBrowserSupabase();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState<Exam | null>(null);
  const [items, setItems] = useState<Q[]>([]);
  const [phase, setPhase] = useState<"run" | "results">("run");
  const [mode, setMode] = useState<RunMode>("revise");

  const [curGroup, setCurGroup] = useState(0);
  const [chosen, setChosen] = useState<Record<string, string>>({});
  const [flags, setFlags] = useState<Set<string>>(new Set());
  const [openMode, setOpenMode] = useState<Record<string, string>>({});
  const [live, setLive] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const [secLeft, setSecLeft] = useState(0);
  const startedRef = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const topRef = useRef<HTMLDivElement | null>(null);
  const [filter, setFilter] = useState<"all" | "wrong" | "flagged">("all");
  const [saved, setSaved] = useState(false);

  const finish = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    setPhase("results");
  }, []);

  useEffect(() => {
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const examId = params.get("exam");
      const m: RunMode = params.get("mode") === "exam" ? "exam" : "revise";
      if (!examId) { setLoading(false); return; }
      const { data: ex } = await supabase.from("exams")
        .select("id, title, year, session, duration_minutes, source_url, subjects(name, code)").eq("id", examId).maybeSingle();
      const { data: rows } = await supabase.from("exercises")
        .select("id, title, statement, position, questions(id, statement, points, position, solutions(body), question_explanations(mode, body), answer_options(id, label, is_correct, position))")
        .eq("exam_id", examId).order("position");
      const list: Q[] = [];
      for (const x of (rows ?? []) as any[]) {
        const qs = (x.questions ?? []).slice().sort((a: any, b: any) => a.position - b.position);
        for (const q of qs) {
          const modes: Record<string, string> = {};
          for (const mm of q.question_explanations ?? []) modes[mm.mode] = mm.body;
          // Randomize option order so the correct answer isn't always in the same slot.
          const options = (q.answer_options ?? []).slice();
          for (let z = options.length - 1; z > 0; z--) { const w = Math.floor(Math.random() * (z + 1)); [options[z], options[w]] = [options[w], options[z]]; }
          list.push({
            id: q.id, exId: x.id, exTitle: x.title, exStatement: x.statement,
            statement: q.statement, points: Number(q.points) || 0, position: q.position,
            solution: q.solutions?.[0]?.body ?? "", modes, options,
          });
        }
      }
      setExam(ex as unknown as Exam); setItems(list); setMode(m);
      startedRef.current = Date.now();
      if (m === "exam") {
        const secs = ((ex as any)?.duration_minutes ?? 240) * 60;
        setSecLeft(secs);
        timerRef.current = setInterval(() => {
          setSecLeft((s) => { if (s <= 1) { finish(); return 0; } return s - 1; });
        }, 1000);
      }
      setLoading(false);
    })();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Build parts (one per exercise row), then group parts by main "Exercice N".
  const groups = useMemo<Group[]>(() => {
    const parts = new Map<string, Part>(); const pOrder: string[] = [];
    for (const q of items) {
      let p = parts.get(q.exId);
      if (!p) { p = { exId: q.exId, title: q.exTitle, statement: q.exStatement, points: 0, qs: [] }; parts.set(q.exId, p); pOrder.push(q.exId); }
      p.qs.push(q); p.points += q.points;
    }
    const gmap = new Map<string, Group>(); const gOrder: string[] = [];
    for (const id of pOrder) {
      const p = parts.get(id)!;
      const m = p.title.match(/Exercice\s+(\d+)/i);
      const num = m ? m[1] : p.title;
      const key = `g${num}`;
      let g = gmap.get(key);
      if (!g) { g = { key, num: m ? m[1] : "", label: groupLabel(p.title), parts: [], qs: [], points: 0 }; gmap.set(key, g); gOrder.push(key); }
      g.parts.push(p); g.qs.push(...p.qs); g.points += p.points;
    }
    return gOrder.map((k) => gmap.get(k)!);
  }, [items]);

  const isCorrect = useCallback(
    (q: Q) => q.options.some((o) => o.id === chosen[q.id] && o.is_correct),
    [chosen]
  );
  const answeredIn = useCallback((qs: Q[]) => qs.filter((q) => chosen[q.id]).length, [chosen]);
  const doneIn = useCallback((qs: Q[]) => qs.length > 0 && qs.every((q) => chosen[q.id]), [chosen]);
  const correctIn = useCallback((qs: Q[]) => qs.filter((q) => isCorrect(q)).length, [isCorrect]);

  const totalPts = useMemo(() => items.reduce((s, q) => s + q.points, 0), [items]);
  const earnedPts = useMemo(
    () => items.reduce((s, q) => s + (isCorrect(q) ? q.points : 0), 0),
    [items, isCorrect]
  );
  const score20 = totalPts > 0 ? (earnedPts / totalPts) * 20 : 0;
  const answeredCount = items.filter((q) => chosen[q.id]).length;

  const goGroup = (k: number) => { setCurGroup(k); topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const toggleCollapse = (id: string) =>
    setCollapsed((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleFlag = (qid: string) =>
    setFlags((s) => { const n = new Set(s); n.has(qid) ? n.delete(qid) : n.add(qid); return n; });

  function pick(q: Q, optId: string) {
    if (mode === "revise" && chosen[q.id]) return;
    setChosen((c) => ({ ...c, [q.id]: optId }));
  }

  async function showMode(q: Q, key: string) {
    setOpenMode((m) => ({ ...m, [q.id]: m[q.id] === key ? "" : key }));
    if (q.modes[key] || live[`${q.id}:${key}`]) return;
    setBusy(`${q.id}:${key}`);
    try {
      const chosenLabel = q.options.find((o) => o.id === chosen[q.id])?.label ?? "";
      const res = await fetch("/api/explain", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q.statement, options: q.options.map((o) => o.label), choice: chosenLabel, existing: q.solution, mode: key }),
      });
      const j = await res.json();
      setLive((m) => ({ ...m, [`${q.id}:${key}`]: j.text ?? j.error ?? "Indisponible." }));
    } catch { setLive((m) => ({ ...m, [`${q.id}:${key}`]: "Erreur du coach IA." })); }
    setBusy(null);
  }

  async function saveSession() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !exam) return;
    const durS = Math.round((Date.now() - startedRef.current) / 1000);
    const { data: sess, error } = await supabase.from("exam_sessions").insert({
      student_id: user.id, exam_id: exam.id, mode,
      earned_points: Number(earnedPts.toFixed(2)), total_points: Number(totalPts.toFixed(2)),
      score_20: Number(score20.toFixed(2)), duration_s: durS, finished_at: new Date().toISOString(),
    }).select("id").single();
    setSaved(true);
    if (error || !sess) return;
    const rows = items.map((q) => {
      const opt = q.options.find((o) => o.id === chosen[q.id]);
      const status = !opt ? "skipped" : opt.is_correct ? "correct" : "incorrect";
      return {
        student_id: user.id, question_id: q.id, exercise_id: q.exId, exam_session_id: sess.id,
        submitted: opt?.label ?? null, status, score: status === "correct" ? q.points : 0,
      };
    });
    await supabase.from("attempts").insert(rows);
  }

  if (loading) return <div className="grid place-items-center h-64 text-neutral-400"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  if (!exam) return <div className="max-w-xl mx-auto py-16 text-center text-neutral-500">Examen introuvable. Ouvre cette page avec <code>?exam=&lt;id&gt;</code>.</div>;

  const subj = exam.subjects;
  const t = subjectTheme(subj?.code ?? subj?.name);
  const Glyph = subjectIcon(subj?.code ?? subj?.name ?? "");
  const sessionLabel = exam.session === "rattrapage" ? "Rattrapage" : "Normale";
  const title = `${exam.title ?? "Examen"} · ${exam.year} · ${sessionLabel}`;

  const showFeedback = (qq: Q) => (phase === "results") || (mode === "revise" && !!chosen[qq.id]);

  const OptionList = ({ qq }: { qq: Q }) => {
    const fb = showFeedback(qq);
    return (
      <div className="mt-3 space-y-2">
        {qq.options.map((o, i) => {
          const picked = chosen[qq.id] === o.id;
          let cls = "chip text-neutral-700 dark:text-neutral-200 hover:-translate-y-0.5";
          if (fb && o.is_correct) cls = "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/40";
          else if (fb && picked && !o.is_correct) cls = "bg-red-500/12 text-red-700 dark:text-red-300 ring-1 ring-red-500/40";
          else if (picked) cls = `${t.soft} ${t.text} ring-1 ${t.ring}`;
          return (
            <button key={o.id} disabled={phase === "results" || (mode === "revise" && !!chosen[qq.id])}
              onClick={() => pick(qq, o.id)}
              className={`w-full text-left rounded-xl px-3.5 py-2.5 text-sm transition flex items-start gap-2.5 ${cls}`}>
              <span className="font-bold shrink-0">{LETTER(i)}.</span>
              <span className="flex-1"><Tex>{o.label}</Tex></span>
              {fb && o.is_correct && <Check className="w-4 h-4 text-emerald-500 shrink-0" />}
              {fb && picked && !o.is_correct && <X className="w-4 h-4 text-red-500 shrink-0" />}
            </button>
          );
        })}
      </div>
    );
  };

  const AiModes = ({ qq }: { qq: Q }) => (
    <div className="mt-3">
      <div className="flex flex-wrap gap-1.5">
        {MODES.map((m) => {
          const on = openMode[qq.id] === m.key;
          return (
            <button key={m.key} onClick={() => showMode(qq, m.key)}
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full transition ${on ? `bg-gradient-to-r ${t.grad} text-white` : "chip text-neutral-600 dark:text-neutral-300 hover:-translate-y-0.5"}`}>
              <span>{m.emoji}</span> {m.label}
            </button>
          );
        })}
      </div>
      {openMode[qq.id] && (
        <div className="mt-2 glass rounded-xl p-3 text-sm leading-relaxed">
          {busy === `${qq.id}:${openMode[qq.id]}`
            ? <span className="text-neutral-400 inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Génération…</span>
            : <Tex>{qq.modes[openMode[qq.id]] ?? live[`${qq.id}:${openMode[qq.id]}`] ?? ""}</Tex>}
        </div>
      )}
    </div>
  );

  const Correction = ({ qq }: { qq: Q }) => (
    <>
      <div className="mt-3 glass rounded-2xl p-4 text-sm leading-relaxed ring-1 ring-emerald-500/20">
        <div className="text-[11px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mb-1">Correction</div>
        <Tex>{qq.solution}</Tex>
      </div>
      <AiModes qq={qq} />
    </>
  );

  const QuestionCard = ({ qq, n, total }: { qq: Q; n: number; total: number }) => (
    <div className="glass rounded-3xl p-5">
      <div className="flex items-center justify-between text-xs font-semibold text-neutral-400 uppercase tracking-wide">
        <span>Question {n}/{total}</span>
        <span className="inline-flex items-center gap-2">
          <span className={t.text}>{nf(qq.points)} pt</span>
          <button onClick={() => toggleFlag(qq.id)} className={flags.has(qq.id) ? "text-amber-500" : "text-neutral-300 hover:text-amber-500"}><Flag className="w-4 h-4" /></button>
        </span>
      </div>
      <div className="mt-2 text-[15px] font-medium leading-relaxed"><Tex>{qq.statement}</Tex></div>
      <OptionList qq={qq} />
      {mode === "revise" && chosen[qq.id] && (
        <div className={`mt-3 text-sm font-semibold ${isCorrect(qq) ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
          {isCorrect(qq) ? `✓ Juste — +${nf(qq.points)} pt` : "✗ Faux"}
        </div>
      )}
      {mode === "revise" && chosen[qq.id] && <Correction qq={qq} />}
    </div>
  );

  const SujetLink = ({ label = false }: { label?: boolean }) => exam.source_url ? (
    <a href={exam.source_url} target="_blank" rel="noopener noreferrer" title="Ouvrir le sujet (annale)"
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full chip text-neutral-600 dark:text-neutral-300 hover:-translate-y-0.5 transition">
      <FileText className="w-3.5 h-3.5" /> {label ? "Voir le sujet" : <span className="hidden sm:inline">Sujet</span>}
    </a>
  ) : null;

  // ---------- RESULTS ----------
  if (phase === "results") {
    const shown = items.filter((it) =>
      filter === "all" ? true : filter === "flagged" ? flags.has(it.id) : !isCorrect(it)
    );
    return (
      <div className="max-w-3xl mx-auto py-8 fade-up">
        <button onClick={() => router.push("/dashboard/examens")} className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white mb-4"><ChevronLeft className="w-4 h-4" /> Retour aux examens</button>

        <div className="glass rounded-3xl p-6 text-center relative overflow-hidden">
          <div className={`pointer-events-none absolute -top-16 -right-10 w-56 h-56 rounded-full ${t.bar} opacity-10 blur-3xl`} />
          <div className="relative">
            <div className="text-xs font-bold uppercase tracking-wide text-neutral-400">{mode === "exam" ? "Examen terminé" : "Bilan de révision"} · {title}</div>
            <div className="mt-2 text-5xl font-extrabold tracking-tight tabular-nums">
              <span className={t.text}>{nf(score20)}</span>
              <span className="text-neutral-300 text-3xl"> / 20</span>
            </div>
            <div className="mt-1 text-sm text-neutral-500">{nf(earnedPts)} / {nf(totalPts)} pts · {items.filter((it) => isCorrect(it)).length}/{items.length} bonnes réponses · {answeredCount} répondue(s)</div>

            <div className="mt-4 flex flex-wrap justify-center gap-1.5">
              {groups.map((g) => (
                <span key={g.key} className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full chip text-neutral-600 dark:text-neutral-300">
                  Ex {g.num} · {g.label}<span className="text-emerald-600 dark:text-emerald-400 tabular-nums">{nf(g.qs.reduce((a, q) => a + (isCorrect(q) ? q.points : 0), 0))}/{nf(g.points)}</span>
                </span>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              <SujetLink label />
              <button onClick={saveSession} disabled={saved}
                className={`inline-flex items-center gap-1.5 text-sm font-semibold px-5 py-2 rounded-full bg-gradient-to-r ${t.grad} text-white disabled:opacity-60`}>
                {saved ? <><Check className="w-4 h-4" /> Enregistré</> : <><Trophy className="w-4 h-4" /> Enregistrer le résultat</>}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-5 mb-2">
          <ListFilter className="w-4 h-4 text-neutral-400" />
          {(["all", "wrong", "flagged"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition ${filter === f ? `bg-gradient-to-r ${t.grad} text-white` : "chip text-neutral-500 hover:-translate-y-0.5"}`}>
              {f === "all" ? "Toutes" : f === "wrong" ? "À revoir" : "Marquées"}
            </button>
          ))}
        </div>

        <div className="space-y-2.5">
          {shown.map((it) => (
            <details key={it.id} className="glass rounded-2xl overflow-hidden group">
              <summary className="cursor-pointer list-none p-4 flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${!chosen[it.id] ? "bg-neutral-300" : isCorrect(it) ? "bg-emerald-500" : "bg-red-500"}`} />
                <span className="flex-1 min-w-0 text-sm font-medium truncate"><Tex>{it.statement}</Tex></span>
                <span className="text-[11px] text-neutral-400 shrink-0">{groupLabel(it.exTitle)} · {nf(it.points)} pt</span>
                <ChevronRight className="w-4 h-4 text-neutral-400 group-open:rotate-90 transition shrink-0" />
              </summary>
              <div className="px-4 pb-4">
                <OptionList qq={it} />
                <Correction qq={it} />
              </div>
            </details>
          ))}
        </div>
      </div>
    );
  }

  // ---------- RUN ----------
  const g = groups[curGroup];
  return (
    <div className="max-w-3xl mx-auto py-8 fade-up">
      <div ref={topRef} />

      <button onClick={() => router.push("/dashboard/examens")} className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white mb-4"><ChevronLeft className="w-4 h-4" /> Quitter</button>

      {/* hero header */}
      <div className="flex items-start gap-4">
        <div className={`shrink-0 w-12 h-12 rounded-2xl grid place-items-center ${t.soft} ${t.text}`}>
          <Glyph className="w-6 h-6" strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight">{exam.title ?? "Examen"}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
            <span className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full ${t.soft} ${t.text}`}>{exam.year} · {sessionLabel}</span>
            <span>{groups.length} exercices · /20</span>
            <span className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full ${mode === "revise" ? "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400" : `${t.soft} ${t.text}`}`}>
              {mode === "revise" ? <><Eye className="w-3 h-3" /> Révision</> : <><Clock className="w-3 h-3" /> Examen</>}
            </span>
          </div>
        </div>
      </div>

      {/* action row */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <SujetLink label />
        <div className="flex items-center gap-2">
          {mode === "exam" && <span className={`inline-flex items-center gap-1.5 text-sm font-bold tabular-nums px-3 py-1 rounded-full ${secLeft < 300 ? "bg-red-500/15 text-red-500" : `${t.soft} ${t.text}`}`}><Clock className="w-4 h-4" /> {fmtT(secLeft)}</span>}
          {mode === "revise" && <span className="text-sm font-bold tabular-nums text-emerald-600 dark:text-emerald-400">{nf(score20)} / 20</span>}
          <button onClick={finish} className={`text-sm font-semibold px-4 py-1.5 rounded-full bg-gradient-to-r ${t.grad} text-white`}>Terminer</button>
        </div>
      </div>

      {/* exercise/section switcher — clean full-width row, grouped by exercise */}
      <div className="sticky top-0 z-10 mt-4 py-2 bg-slate-50/90 dark:bg-[#0a0f16]/90 backdrop-blur">
        <div className="flex flex-wrap gap-2">
          {groups.map((gr, k) => {
            const active = k === curGroup; const done = doneIn(gr.qs); const ans = answeredIn(gr.qs);
            return (
              <button key={gr.key} onClick={() => goGroup(k)}
                className={`flex-1 min-w-[132px] flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-left transition ${active ? `bg-gradient-to-r ${t.grad} text-white` : "glass hover:-translate-y-0.5"}`}>
                <span className={`grid place-items-center w-7 h-7 rounded-xl text-xs font-bold shrink-0 ${active ? "bg-white/25 text-white" : `${t.soft} ${t.text}`}`}>
                  {done ? <Check className="w-4 h-4" /> : gr.num || k + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-bold leading-tight truncate">{gr.label}</span>
                  <span className={`block text-[10px] font-semibold leading-tight ${active ? "text-white/80" : "text-neutral-400"}`}>
                    /{nf(gr.points)} · {mode === "revise" && done ? `${correctIn(gr.qs)}/${gr.qs.length} ✓` : `${ans}/${gr.qs.length}`}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* active exercise: its parts (énoncé + questions), scrollable */}
      <div className="mt-4 space-y-4">
        {g?.parts.map((p) => {
          const pl = partLabel(p.title);
          const isOpen = !collapsed.has(p.exId);
          let qn = 0;
          return (
            <div key={p.exId} className="space-y-3">
              {(p.statement || pl) && (
                <div className={`glass rounded-2xl p-4 ring-1 ${t.ring}`}>
                  <button onClick={() => toggleCollapse(p.exId)}
                    className={`w-full flex items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-wide ${t.text}`}>
                    <span className="inline-flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> Énoncé{pl ? ` — ${pl}` : ""}</span>
                    {p.statement && <ChevronDown className={`w-4 h-4 transition ${isOpen ? "rotate-180" : ""}`} />}
                  </button>
                  {p.statement && isOpen && (
                    <div className="mt-2 text-[13px] leading-relaxed text-neutral-600 dark:text-neutral-300"><Tex>{p.statement}</Tex></div>
                  )}
                </div>
              )}
              {p.qs.map((qq) => { qn += 1; return <QuestionCard key={qq.id} qq={qq} n={qn} total={p.qs.length} />; })}
            </div>
          );
        })}
      </div>

      {g && doneIn(g.qs) && (
        <div className="mt-4 text-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1.5">
          <Check className="w-4 h-4" /> Exercice complété
          {mode === "revise" && ` — ${correctIn(g.qs)}/${g.qs.length} bonnes réponses`}
        </div>
      )}

      <div className="flex items-center justify-between mt-5">
        <button disabled={curGroup === 0} onClick={() => goGroup(Math.max(0, curGroup - 1))}
          className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full glass disabled:opacity-40"><ChevronLeft className="w-4 h-4" /> Exercice préc.</button>
        {curGroup < groups.length - 1
          ? <button onClick={() => goGroup(Math.min(groups.length - 1, curGroup + 1))} className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full glass">Exercice suiv. <ChevronRight className="w-4 h-4" /></button>
          : <button onClick={finish} className={`inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r ${t.grad} text-white`}>Voir le bilan <Trophy className="w-4 h-4" /></button>}
      </div>
    </div>
  );
}
