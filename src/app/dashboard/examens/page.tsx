"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { useAccess } from "@/lib/use-access";
import { Tex } from "@/components/math";
import Link from "next/link";
import { subjectTheme } from "@/config/subjects";
import { SubjectAmbient, SubjectName } from "@/components/subject-pad";
import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  Loader2,
  Lock,
  Shuffle,
  Sparkles,
  Zap,
} from "lucide-react";

type Subject = { id: string; name: string };
type Chapter = { id: string; name: string; code: string | null };
type ExRow = {
  id: string;
  title: string;
  statement: string | null;
  chapter_id: string | null;
  questions: Array<{
    id: string;
    statement: string;
    points: number;
    position: number;
    answer_options: Opt[];
    solutions: { body: string }[] | null;
  }>;
};
type Exam = {
  id: string;
  title: string | null;
  year: number;
  session: string | null;
  exam_type: string;
  duration_minutes: number | null;
};
type Opt = { id: string; label: string; is_correct: boolean; position: number };
type Q = {
  id: string;
  statement: string;
  points: number;
  options: Opt[];
  solution: string | null;
  exId: string;
  exTitle: string;
  context: string | null;
  chapterId: string | null;
};

type Mode = "complet" | "aleatoire" | "notion" | "adaptatif";

export default function ExamensPage() {
  const supabase = createBrowserSupabase();
  const router = useRouter();
  const access = useAccess();
  const [step, setStep] = useState<
    "subjects" | "modes" | "exams" | "notions" | "run" | "results"
  >("subjects");
  const [loading, setLoading] = useState(false);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [levelId, setLevelId] = useState<string | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Q[]>([]);
  const [mode, setMode] = useState<Mode | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [runTitle, setRunTitle] = useState<string>("");

  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [timed, setTimed] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [xpResult, setXpResult] = useState<{ earned: number; total_xp: number; streak: number } | null>(null);
  const recordedRef = useRef(false);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      let lvl: string | null = null;
      if (user) {
        const { data: sp } = await supabase
          .from("student_profiles")
          .select("level_id")
          .eq("id", user.id)
          .single();
        lvl = sp?.level_id ?? null;
      }
      setLevelId(lvl);
      let q = supabase.from("exams").select("subject_id, subjects(id, name)").eq("exam_type", "national");
      if (lvl) q = q.eq("level_id", lvl);
      const { data } = await q;
      const map = new Map<string, Subject>();
      for (const e of (data ?? []) as unknown as { subjects: Subject | null }[]) {
        if (e.subjects) map.set(e.subjects.id, e.subjects);
      }
      setSubjects(Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name)));

      // Deep-link from Espace Préparation: ?exam=<id>[&mode=etude] auto-starts a run.
      const params = new URLSearchParams(window.location.search);
      const examId = params.get("exam");
      if (examId) {
        const { data: ex } = await supabase
          .from("exams")
          .select("id, title, year, session, exam_type, duration_minutes")
          .eq("id", examId)
          .single();
        if (ex) await startExam(ex as Exam, params.get("mode") === "etude" ? "revise" : "exam");
      }
    })();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Record the exam (attempts → mastery → XP → streak) once results are shown.
  useEffect(() => {
    if (step !== "results" || recordedRef.current || questions.length === 0) return;
    recordedRef.current = true;
    (async () => {
      const p_answers = questions.map((q) => {
        const correct = q.options.find((o) => o.is_correct);
        return {
          question_id: q.id,
          is_correct: !!(answers[q.id] && correct && answers[q.id] === correct.id),
        };
      });
      const { data, error } = await supabase.rpc("record_exam", { p_answers });
      if (!error && data) setXpResult(data as { earned: number; total_xp: number; streak: number });

      // Défi National: if this run was launched from a challenge, record the entry.
      const defi = new URLSearchParams(window.location.search).get("defi");
      if (defi) {
        let earned = 0;
        let total = 0;
        for (const q of questions) {
          total += Number(q.points || 0);
          const correct = q.options.find((o) => o.is_correct);
          if (answers[q.id] && correct && answers[q.id] === correct.id) earned += Number(q.points || 0);
        }
        const sc = total > 0 ? Math.round((earned / total) * 20 * 10) / 10 : 0;
        const spent = exam?.duration_minutes ? Math.max(0, exam.duration_minutes * 60 - timeLeft) : null;
        await supabase.rpc("submit_challenge", { p_challenge: defi, p_score: sc, p_time: spent });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  async function openSubject(s: Subject) {
    setSubject(s);
    setMode(null);
    setStep("modes");
    setLoading(true);
    let eq = supabase
      .from("exams")
      .select("id, title, year, session, exam_type, duration_minutes")
      .eq("subject_id", s.id)
      .eq("exam_type", "national"); // seulement les examens nationaux pour l'instant
    if (levelId) eq = eq.eq("level_id", levelId);
    let cq = supabase.from("chapters").select("id, name, code").eq("subject_id", s.id);
    if (levelId) cq = cq.eq("level_id", levelId);
    const [{ data: ed }, { data: cd }] = await Promise.all([
      eq.order("year", { ascending: false }),
      cq.order("position"),
    ]);
    setExams((ed ?? []) as Exam[]);
    setChapters((cd ?? []) as Chapter[]);
    setLoading(false);
  }

  // Flatten Supabase exercise rows → a linear list of questions.
  function flatten(rows: ExRow[]): Q[] {
    const flat: Q[] = [];
    for (const ex of rows) {
      const qs = (ex.questions ?? []).slice().sort((a, b) => a.position - b.position);
      for (const q of qs) {
        flat.push({
          id: q.id,
          statement: q.statement,
          points: Number(q.points) || 1,
          options: (q.answer_options ?? []).slice().sort((a, b) => a.position - b.position),
          solution: q.solutions?.[0]?.body ?? null,
          exId: ex.id,
          exTitle: ex.title,
          context: ex.statement,
          chapterId: ex.chapter_id,
        });
      }
    }
    return flat;
  }

  const EX_SELECT =
    "id, title, statement, position, chapter_id, questions(id, statement, points, position, answer_options(id,label,is_correct,position), solutions(body))";

  // Start a run from an already-built question list (used by every mode).
  function startRun(flat: Q[], opts: { timed: boolean; durationMin: number; title: string; ex?: Exam }) {
    setExam(opts.ex ?? null);
    setRunTitle(opts.title);
    setTimed(opts.timed);
    setQuestions(flat);
    setAnswers({});
    setXpResult(null);
    recordedRef.current = false;
    setI(0);
    setLoading(false);
    if (flat.length === 0) {
      setStep(mode === "notion" ? "notions" : "modes");
      return;
    }
    const secs = opts.durationMin * 60;
    setTimeLeft(secs);
    if (timerRef.current) clearInterval(timerRef.current);
    if (opts.timed) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setStep("results");
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    setStep("run");
  }

  // Mode: Exercices Aléatoires — a random sample across the whole subject.
  async function startRandom(count = 20) {
    if (!subject) return;
    setLoading(true);
    let q = supabase.from("exercises").select(EX_SELECT).eq("subject_id", subject.id);
    if (levelId) q = q.eq("level_id", levelId);
    const { data } = await q;
    const all = flatten((data ?? []) as unknown as ExRow[]);
    for (let k = all.length - 1; k > 0; k--) {
      const j = Math.floor(Math.random() * (k + 1));
      [all[k], all[j]] = [all[j], all[k]];
    }
    const pick = all.slice(0, count);
    startRun(pick, {
      timed: true,
      durationMin: Math.max(5, Math.round(pick.length * 1.5)),
      title: `${subject.name} · Exercices aléatoires`,
    });
  }

  // Mode: Par Notion — every question tied to one chapter.
  async function startNotion(chap: Chapter) {
    setLoading(true);
    const { data } = await supabase.from("exercises").select(EX_SELECT).eq("chapter_id", chap.id);
    const flat = flatten((data ?? []) as unknown as ExRow[]);
    startRun(flat, {
      timed: false,
      durationMin: 0,
      title: `${subject?.name ?? ""} · ${chap.name}`,
    });
  }

  // Mode: Adaptatif — questions weighted toward the student's weakest chapters.
  async function startAdaptive(count = 20) {
    if (!subject) return;
    setLoading(true);
    let q = supabase.from("exercises").select(EX_SELECT).eq("subject_id", subject.id);
    if (levelId) q = q.eq("level_id", levelId);
    const { data } = await q;
    const all = flatten((data ?? []) as unknown as ExRow[]);
    // Pull mastery so weak chapters surface first (default weak when unseen).
    const { data: mrows } = await supabase.from("chapter_mastery").select("chapter_id, mastery_pct");
    const mastery = new Map<string, number>();
    for (const m of (mrows ?? []) as { chapter_id: string; mastery_pct: number }[]) {
      mastery.set(m.chapter_id, Number(m.mastery_pct));
    }
    const scored = all
      .map((qq) => ({ qq, m: qq.chapterId ? mastery.get(qq.chapterId) ?? 0 : 50, r: Math.random() }))
      .sort((a, b) => a.m - b.m || a.r - b.r)
      .slice(0, count)
      .map((s) => s.qq);
    startRun(scored, {
      timed: true,
      durationMin: Math.max(5, Math.round(scored.length * 1.5)),
      title: `${subject.name} · Mode adaptatif`,
    });
  }

  async function startExam(e: Exam, runMode: "revise" | "exam" = "exam") {
    // National exams open the dedicated QCU session runner (tabbed by exercise,
    // sticky énoncé, "Voir le sujet"). Mode is chosen here, on the card, and
    // passed in — the runner has no intro. See examens/session/page.tsx.
    router.push(`/dashboard/examens/session?exam=${e.id}&mode=${runMode}`);
  }

  function finish() {
    if (timerRef.current) clearInterval(timerRef.current);
    setStep("results");
  }

  // scoring
  const totalPts = questions.reduce((s, q) => s + q.points, 0);
  const earnedPts = questions.reduce((s, q) => {
    const picked = answers[q.id];
    const correct = q.options.find((o) => o.is_correct);
    return s + (picked && correct && picked === correct.id ? q.points : 0);
  }, 0);
  const score20 = totalPts > 0 ? Math.round((earnedPts / totalPts) * 20 * 10) / 10 : 0;

  function fmt(sec: number) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    const p = (n: number) => String(n).padStart(2, "0");
    return `${p(h)}:${p(m)}:${p(s)}`;
  }

  // ---------- SUBJECTS ----------
  if (step === "subjects") {
    return (
      <Shell
        title="Examen blanc rapide"
        subtitle="Choisis une matière, puis lance un examen blanc chronométré."
        tabs={
          <Link href="/dashboard/examens/preparation" className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full chip hover:-translate-y-0.5 transition">
            <FileText className="w-4 h-4" /> Toutes les annales
          </Link>
        }
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((s) => (
            <button
              key={s.id}
              onClick={() => openSubject(s)}
              className="glass rounded-2xl p-5 text-left hover:-translate-y-1 transition duration-300"
            >
              <div className="w-11 h-11 rounded-2xl bg-arctic-blue/15 text-arctic-blue dark:text-arctic-cyan grid place-items-center font-bold uppercase">
                {s.name.slice(0, 2)}
              </div>
              <SubjectName name={s.name} sizeClass="text-3xl" className="mt-3" />
              <div className="mt-1 text-xs text-neutral-400">Voir les examens</div>
            </button>
          ))}
        </div>
      </Shell>
    );
  }

  // ---------- MODE PICKER ----------
  if (step === "modes") {
    return (
      <Shell
        title="Choisis ton mode"
        subtitle={subject?.name ?? undefined}
        onBack={() => setStep("subjects")}
      >
        {loading ? (
          <Loading />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ModeCard
              icon={<FileText className="w-5 h-5" />}
              title="Examen Complet"
              desc="Sujet complet, chronomètre officiel, conditions réelles du Bac."
              onClick={() => setStep("exams")}
            />
            <ModeCard
              icon={<Shuffle className="w-5 h-5" />}
              title="Exercices Aléatoires"
              desc="Questions aléatoires pour une pratique rapide et variée."
              badge={access.isDemo ? "Premium" : undefined}
              premium={access.isDemo}
              onClick={() => (access.isDemo ? router.push("/payment") : startRandom(20))}
            />
            <ModeCard
              icon={<BookOpen className="w-5 h-5" />}
              title="Par Notion"
              desc="Choisis un chapitre ou une notion précise pour t'entraîner."
              badge={access.isDemo ? "Premium" : "Nouveau"}
              premium={access.isDemo}
              onClick={() => (access.isDemo ? router.push("/payment") : setStep("notions"))}
            />
            <ModeCard
              icon={<Zap className="w-5 h-5" />}
              title="Mode Adaptatif"
              desc="L'IA cible tes points faibles pour progresser plus vite."
              badge="Premium"
              premium
              onClick={() => (access.isDemo ? router.push("/payment") : startAdaptive(20))}
            />
          </div>
        )}
      </Shell>
    );
  }

  // ---------- NOTIONS (chapters) ----------
  if (step === "notions") {
    return (
      <Shell
        title="Par Notion"
        subtitle={`${subject?.name ?? ""} · choisis un chapitre`}
        onBack={() => setStep("modes")}
      >
        {loading ? (
          <Loading />
        ) : chapters.length === 0 ? (
          <Empty text="Aucun chapitre pour cette matière pour l'instant." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {chapters.map((c) => (
              <button
                key={c.id}
                onClick={() => startNotion(c)}
                className="glass rounded-2xl p-5 text-left hover:-translate-y-1 transition duration-300"
              >
                <div className="w-11 h-11 rounded-2xl bg-arctic-blue/15 text-arctic-blue dark:text-arctic-cyan grid place-items-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="mt-4 font-semibold tracking-tight">{c.name}</div>
                <div className="mt-1 text-xs text-neutral-400">Mode étude · corrigé + IA</div>
              </button>
            ))}
          </div>
        )}
      </Shell>
    );
  }

  // ---------- EXAMS LIST ----------
  if (step === "exams") {
    return (
      <Shell
        title={subject?.name ?? "Examens"}
        subtitle="Sujets nationaux et examens blancs. Chronométrés comme le jour J."
        onBack={() => setStep("modes")}
      >
        {loading ? (
          <Loading />
        ) : exams.length === 0 ? (
          <Empty text="Aucun examen pour cette matière pour l'instant." />
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {exams.map((e, idx) => {
              const locked = access.isDemo && idx > 0; // demo: 1st annale free
              return (
              <div
                key={e.id}
                className={`glass rounded-2xl p-5 transition duration-300 ${locked ? "opacity-80" : "hover:-translate-y-1"}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-arctic-blue dark:text-arctic-cyan text-xs font-semibold">
                    <FileText className="w-4 h-4" /> {e.exam_type === "national" ? "National" : "Régional"} · {e.year}
                  </div>
                  {locked && <Lock className="w-4 h-4 text-neutral-400" />}
                </div>
                <div className="mt-2 font-semibold tracking-tight">
                  {e.title ?? `${subject?.name} ${e.year}`}
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-neutral-400">
                  <Clock className="w-3.5 h-3.5" /> {(e.duration_minutes ?? 180) / 60}h · session {e.session}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => (locked ? router.push("/payment") : startExam(e, "revise"))}
                    className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-full chip text-emerald-600 dark:text-emerald-400 hover:-translate-y-0.5 transition"
                  >
                    <Eye className="w-4 h-4" /> Révision
                  </button>
                  <button
                    onClick={() => (locked ? router.push("/payment") : startExam(e, "exam"))}
                    className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white hover:-translate-y-0.5 transition"
                  >
                    <Clock className="w-4 h-4" /> Examen
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </Shell>
    );
  }

  // ---------- RUN (timed) ----------
  if (step === "run") {
    const q = questions[i];
    const t = subjectTheme(subject?.name);
    const prevExId = i > 0 ? questions[i - 1].exId : null;
    const showContext = q.context && q.exId !== prevExId;
    const picked = answers[q.id];
    const answeredCount = Object.keys(answers).length;

    return (
      <div className="max-w-3xl mx-auto py-6 fade-up">
        <SubjectAmbient code={subject?.name} />
        {/* exam top bar */}
        <div className="glass rounded-2xl px-5 py-3 flex items-center justify-between mb-6 sticky top-2 z-10">
          <div className="text-sm font-semibold flex items-center gap-2">
            {subject?.name && <span className={`hidden sm:inline-flex text-[11px] font-bold px-2 py-0.5 rounded-full ${t.soft} ${t.text}`}>{subject.name}</span>}
            Question {i + 1} <span className="text-neutral-400">/ {questions.length}</span>
          </div>
          <div className={`flex items-center gap-2 text-sm font-bold tabular-nums ${t.text}`}>
            <Clock className="w-4 h-4" /> {timed ? fmt(timeLeft) : "Mode étude"}
          </div>
          <button
            onClick={finish}
            className="text-sm font-semibold rounded-full bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-500 transition"
          >
            Terminer
          </button>
        </div>

        {showContext && (
          <div className="glass rounded-2xl p-5 mb-4">
            <div className="text-xs font-semibold text-arctic-blue dark:text-arctic-cyan mb-2">
              {q.exTitle} · Contexte
            </div>
            <div className="text-sm leading-relaxed">
              <Tex>{q.context ?? ""}</Tex>
            </div>
          </div>
        )}

        <div className="glass rounded-3xl p-7">
          <div className="text-xs text-neutral-400 mb-3">{q.points} pt</div>
          <p className="text-lg font-semibold tracking-tight leading-relaxed">
            <Tex>{q.statement}</Tex>
          </p>

          <div className="mt-6 space-y-3">
            {q.options.map((o, idx) => {
              const isPicked = picked === o.id;
              return (
                <button
                  key={o.id}
                  onClick={() => setAnswers((a) => ({ ...a, [q.id]: o.id }))}
                  className={`w-full flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition ${
                    isPicked
                      ? "border-arctic-blue bg-arctic-blue/10"
                      : "border-neutral-200 dark:border-neutral-700 hover:border-arctic-blue/50"
                  }`}
                >
                  <span className="w-7 h-7 rounded-lg bg-black/5 dark:bg-white/10 grid place-items-center text-sm font-bold shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm font-medium flex-1">
                    <Tex>{o.label}</Tex>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <button
            onClick={() => setI((v) => Math.max(0, v - 1))}
            disabled={i === 0}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" /> Précédent
          </button>
          <span className="text-xs text-neutral-400">{answeredCount} / {questions.length} répondues</span>
          {i < questions.length - 1 ? (
            <button
              onClick={() => setI((v) => Math.min(questions.length - 1, v + 1))}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            >
              Suivant <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={finish} className="text-sm font-semibold text-emerald-600">
              Terminer →
            </button>
          )}
        </div>
      </div>
    );
  }

  // ---------- RESULTS ----------
  const passed = score20 >= 10;
  const tr = subjectTheme(subject?.name);
  return (
    <Shell title="Résultats" subtitle={runTitle || exam?.title || undefined} onBack={() => setStep("modes")}>
      <SubjectAmbient code={subject?.name} />
      {/* score */}
      <div className="glass rounded-3xl p-8 text-center relative overflow-hidden">
        {subject?.name && <div className="relative mb-3"><span className={`inline-flex text-[11px] font-bold px-2.5 py-1 rounded-full ${tr.soft} ${tr.text}`}>{subject.name}</span></div>}
        <div
          className={`pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-72 blur-3xl rounded-full ${
            passed ? "bg-emerald-500/20" : "bg-orange-500/20"
          }`}
        />
        <div className={`relative text-6xl font-extrabold tracking-tight ${passed ? "text-emerald-500" : "text-orange-500"}`}>
          {score20}
          <span className="text-2xl text-neutral-400 font-medium">/20</span>
        </div>
        <div className="relative mt-3 text-lg font-bold">
          {passed ? "Bravo, continue comme ça ! 🎉" : "Ne lâche rien — chaque erreur te fait progresser. 💪"}
        </div>
        <div className="relative mt-1 text-sm text-neutral-400">
          {earnedPts} / {totalPts} points · {questions.length} questions
        </div>
        {xpResult && (
          <div className="relative mt-4 inline-flex items-center gap-3 rounded-full bg-arctic-blue/10 px-4 py-2 text-sm font-semibold">
            <span className="text-arctic-blue dark:text-arctic-cyan">+{xpResult.earned} XP</span>
            <span className="text-neutral-400">·</span>
            <span className="text-orange-500">🔥 {xpResult.streak} j</span>
          </div>
        )}
      </div>

      {/* corrections */}
      <h3 className="text-base font-semibold tracking-tight mt-8 mb-4">Corrections détaillées</h3>
      <div className="space-y-4">
        {questions.map((q, idx) => {
          const picked = answers[q.id];
          const correct = q.options.find((o) => o.is_correct);
          const isRight = picked && correct && picked === correct.id;
          return (
            <div key={q.id} className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-neutral-400">Q{idx + 1} · {q.exTitle} · {q.points} pt</span>
                <span className={`text-xs font-bold ${isRight ? "text-emerald-500" : "text-red-500"}`}>
                  {isRight ? "Juste" : picked ? "Faux" : "Non répondue"}
                </span>
              </div>
              <p className="font-semibold leading-relaxed">
                <Tex>{q.statement}</Tex>
              </p>
              <div className="mt-4 space-y-2">
                {q.options.map((o, oi) => {
                  const isPicked = picked === o.id;
                  let cls = "border-neutral-200 dark:border-neutral-800 opacity-70";
                  if (o.is_correct) cls = "border-emerald-500 bg-emerald-500/10";
                  else if (isPicked) cls = "border-red-400 bg-red-500/10";
                  return (
                    <div key={o.id} className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm ${cls}`}>
                      <span className="w-6 h-6 rounded-md bg-black/5 dark:bg-white/10 grid place-items-center text-xs font-bold shrink-0">
                        {String.fromCharCode(65 + oi)}
                      </span>
                      <span className="flex-1">
                        <Tex>{o.label}</Tex>
                      </span>
                      {o.is_correct && <Check className="w-4 h-4 text-emerald-500" />}
                    </div>
                  );
                })}
              </div>

              {q.solution && (
                <div className="mt-4 rounded-2xl bg-emerald-500/8 border border-emerald-500/20 p-4">
                  <div className="text-xs font-semibold text-emerald-600 mb-1.5">Correction</div>
                  <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-200">
                    <Tex>{q.solution}</Tex>
                  </p>
                </div>
              )}

              <ExplainMenu q={q} choiceLabel={q.options.find((o) => o.id === picked)?.label ?? ""} locked={access.isDemo} />
            </div>
          );
        })}
      </div>
    </Shell>
  );
}

const AI_MODES: { key: string; label: string }[] = [
  { key: "autrement", label: "Explique autrement" },
  { key: "etapes", label: "Étapes" },
  { key: "cours", label: "Cours" },
  { key: "erreurs", label: "Erreurs" },
  { key: "methode", label: "Méthode" },
];

function ExplainMenu({ q, choiceLabel, locked }: { q: Q; choiceLabel: string; locked?: boolean }) {
  const router = useRouter();
  const [text, setText] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function ask(mode: string) {
    if (locked) { router.push("/payment"); return; } // demo: IA verrouillée
    setBusy(mode);
    setText(null);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q.statement,
          options: q.options.map((o) => o.label),
          choice: choiceLabel,
          existing: q.solution,
          mode,
        }),
      });
      const json = await res.json();
      setText(json.text || `⚠ ${json.error || "Le coach IA n'a pas pu répondre."}`);
    } catch {
      setText("⚠ Impossible de contacter le coach.");
    }
    setBusy(null);
  }

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-arctic-blue dark:text-arctic-cyan">
          <Sparkles className="w-3.5 h-3.5" /> Expliquer avec l&apos;IA :
        </span>
        {AI_MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => ask(m.key)}
            disabled={busy !== null}
            className="inline-flex items-center gap-1 text-xs font-semibold rounded-full border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 transition disabled:opacity-50"
          >
            {busy === m.key && <Loader2 className="w-3 h-3 animate-spin" />}
            {m.label}
          </button>
        ))}
      </div>
      {text && (
        <div className="mt-3 rounded-2xl bg-arctic-blue/8 border border-arctic-blue/20 p-4">
          <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-200 whitespace-pre-wrap">
            <Tex>{text}</Tex>
          </p>
        </div>
      )}
    </div>
  );
}

function Shell({
  title,
  subtitle,
  onBack,
  tabs,
  children,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  tabs?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-3xl mx-auto py-8 fade-up">
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white mb-4"
        >
          <ChevronLeft className="w-4 h-4" /> Retour
        </button>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-neutral-500 dark:text-neutral-400">{subtitle}</p>}
        </div>
        {tabs}
      </div>
      <div className="mt-7">{children}</div>
    </div>
  );
}

function ModeCard({
  icon,
  title,
  desc,
  badge,
  premium,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  badge?: string;
  premium?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group glass rounded-2xl p-6 text-left hover:-translate-y-1 transition duration-300 relative"
    >
      {badge && (
        <span
          className={`absolute top-4 right-4 inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
            premium
              ? "bg-amber-400/15 text-amber-600 dark:text-amber-400"
              : "bg-arctic-blue/15 text-arctic-blue dark:text-arctic-cyan"
          }`}
        >
          {premium && <Lock className="w-3 h-3" />}
          {badge}
        </span>
      )}
      <div className="w-12 h-12 rounded-2xl bg-arctic-blue/15 text-arctic-blue dark:text-arctic-cyan grid place-items-center group-hover:scale-105 transition">
        {icon}
      </div>
      <div className="mt-4 font-semibold tracking-tight text-lg">{title}</div>
      <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{desc}</p>
    </button>
  );
}

function Loading() {
  return (
    <div className="grid place-items-center h-40 text-neutral-400">
      <Loader2 className="w-6 h-6 animate-spin" />
    </div>
  );
}
function Empty({ text }: { text: string }) {
  return <div className="glass rounded-2xl p-8 text-center text-sm text-neutral-400">{text}</div>;
}
