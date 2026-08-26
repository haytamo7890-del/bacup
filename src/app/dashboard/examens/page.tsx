"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  BookCheck,
  Sparkles,
  Loader2,
} from "lucide-react";

type Subject = { id: string; name: string };
type Chapter = { id: string; name: string };
type Option = { id: string; label: string; is_correct: boolean; position: number };
type Question = {
  id: string;
  statement: string;
  options: Option[];
  solution: string | null;
};

export default function ExamensPage() {
  const supabase = createBrowserSupabase();
  const [step, setStep] = useState<"subjects" | "chapters" | "quiz">("subjects");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  // quiz state
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showSol, setShowSol] = useState(false);
  const [ai, setAi] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("subjects").select("id, name").order("name");
      setSubjects(data ?? []);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function openSubject(s: Subject) {
    setSubject(s);
    setLoading(true);
    const { data } = await supabase
      .from("chapters")
      .select("id, name")
      .eq("subject_id", s.id)
      .order("position");
    setChapters(data ?? []);
    setLoading(false);
    setStep("chapters");
  }

  async function openChapter(c: Chapter) {
    setLoading(true);
    const { data } = await supabase
      .from("questions")
      .select(
        "id, statement, position, answer_options(id,label,is_correct,position), solutions(body), exercises!inner(chapter_id)"
      )
      .eq("exercises.chapter_id", c.id)
      .order("position");

    const qs: Question[] = (data ?? []).map((q) => {
      const opts = ((q.answer_options ?? []) as Option[])
        .slice()
        .sort((a, b) => a.position - b.position);
      const sol = (q.solutions as { body: string }[] | null)?.[0]?.body ?? null;
      return { id: q.id as string, statement: q.statement as string, options: opts, solution: sol };
    });

    setQuestions(qs);
    resetQuestion();
    setI(0);
    setLoading(false);
    setStep("quiz");
  }

  function resetQuestion() {
    setPicked(null);
    setRevealed(false);
    setShowSol(false);
    setAi(null);
    setAiLoading(false);
  }

  function next() {
    if (i < questions.length - 1) {
      setI(i + 1);
      resetQuestion();
    }
  }
  function prev() {
    if (i > 0) {
      setI(i - 1);
      resetQuestion();
    }
  }

  async function explain() {
    const q = questions[i];
    setAiLoading(true);
    setAi(null);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q.statement,
          options: q.options.map((o) => o.label),
          choice: picked ? q.options.find((o) => o.id === picked)?.label : null,
          existing: q.solution,
        }),
      });
      const json = await res.json();
      setAi(json.text || `⚠ ${json.error || "Le coach IA n'a pas pu répondre."}`);
    } catch {
      setAi("⚠ Impossible de contacter le coach IA.");
    }
    setAiLoading(false);
  }

  // ---------- SUBJECTS ----------
  if (step === "subjects") {
    return (
      <Shell title="Examens" subtitle="Choisis une matière pour t'entraîner sur les vraies questions du BAC.">
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
              <div className="mt-4 font-semibold tracking-tight">{s.name}</div>
              <div className="mt-1 text-xs text-neutral-400">Voir les chapitres</div>
            </button>
          ))}
        </div>
      </Shell>
    );
  }

  // ---------- CHAPTERS ----------
  if (step === "chapters") {
    return (
      <Shell
        title={subject?.name ?? "Chapitres"}
        subtitle="Choisis un chapitre. Tu obtiens toutes les questions tombées au BAC national."
        onBack={() => setStep("subjects")}
      >
        {loading ? (
          <Loading />
        ) : chapters.length === 0 ? (
          <Empty text="Aucun chapitre pour cette matière pour l'instant. On en ajoute bientôt ✨" />
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {chapters.map((c) => (
              <button
                key={c.id}
                onClick={() => openChapter(c)}
                className="glass rounded-2xl p-5 text-left flex items-center justify-between hover:-translate-y-1 transition duration-300"
              >
                <span className="font-semibold tracking-tight">{c.name}</span>
                <ChevronRight className="w-5 h-5 text-neutral-400" />
              </button>
            ))}
          </div>
        )}
      </Shell>
    );
  }

  // ---------- QUIZ ----------
  const q = questions[i];
  if (loading || !q) {
    return (
      <Shell title={subject?.name ?? "QCM"} onBack={() => setStep("chapters")}>
        {loading ? <Loading /> : <Empty text="Aucune question dans ce chapitre pour l'instant." />}
      </Shell>
    );
  }

  return (
    <Shell
      title={subject?.name ?? "QCM"}
      subtitle={`Question ${i + 1} / ${questions.length}`}
      onBack={() => setStep("chapters")}
    >
      {/* progress bar */}
      <div className="h-1.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden mb-6">
        <div
          className="h-full bg-gradient-to-r from-arctic-cyan to-arctic-blue transition-all"
          style={{ width: `${((i + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="glass rounded-3xl p-7">
        <div className="text-xs font-semibold text-arctic-blue dark:text-arctic-cyan mb-3">
          BAC National · QCM
        </div>
        <p className="text-lg font-semibold tracking-tight leading-relaxed">{q.statement}</p>

        {/* options */}
        <div className="mt-6 space-y-3">
          {q.options.map((o, idx) => {
            const letter = String.fromCharCode(65 + idx);
            const isPicked = picked === o.id;
            let cls =
              "border-neutral-200 dark:border-neutral-700 hover:border-arctic-blue/50";
            if (revealed) {
              if (o.is_correct) cls = "border-emerald-500 bg-emerald-500/10";
              else if (isPicked) cls = "border-red-400 bg-red-500/10";
              else cls = "border-neutral-200 dark:border-neutral-800 opacity-60";
            } else if (isPicked) {
              cls = "border-arctic-blue bg-arctic-blue/10";
            }
            return (
              <button
                key={o.id}
                disabled={revealed}
                onClick={() => setPicked(o.id)}
                className={`w-full flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition ${cls}`}
              >
                <span className="w-7 h-7 rounded-lg bg-black/5 dark:bg-white/10 grid place-items-center text-sm font-bold shrink-0">
                  {letter}
                </span>
                <span className="text-sm font-medium flex-1">{o.label}</span>
                {revealed && o.is_correct && (
                  <Check className="w-5 h-5 text-emerald-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* actions */}
        <div className="mt-6 flex flex-wrap gap-2.5">
          <button
            onClick={() => setRevealed(true)}
            disabled={!picked || revealed}
            className="inline-flex items-center gap-2 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-sm font-semibold px-5 py-2.5 hover:opacity-90 transition disabled:opacity-40"
          >
            <Check className="w-4 h-4" /> Répondre
          </button>
          <button
            onClick={() => setShowSol((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 dark:border-neutral-700 text-sm font-semibold px-5 py-2.5 hover:bg-black/5 dark:hover:bg-white/5 transition"
          >
            <BookCheck className="w-4 h-4" /> Correction officielle
          </button>
          <button
            onClick={explain}
            disabled={aiLoading}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white text-sm font-semibold px-5 py-2.5 hover:opacity-90 transition disabled:opacity-60"
          >
            {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Explique autrement
          </button>
        </div>

        {/* solution */}
        {showSol && q.solution && (
          <div className="mt-5 rounded-2xl bg-emerald-500/8 border border-emerald-500/20 p-4">
            <div className="text-xs font-semibold text-emerald-600 mb-1.5">Correction officielle</div>
            <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-200">{q.solution}</p>
          </div>
        )}

        {/* ai explanation */}
        {ai && (
          <div className="mt-4 rounded-2xl bg-arctic-blue/8 border border-arctic-blue/20 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-arctic-blue dark:text-arctic-cyan mb-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Ton coach IA
            </div>
            <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-200 whitespace-pre-wrap">{ai}</p>
          </div>
        )}
      </div>

      {/* nav */}
      <div className="mt-5 flex items-center justify-between">
        <button
          onClick={prev}
          disabled={i === 0}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" /> Précédent
        </button>
        <button
          onClick={next}
          disabled={i === questions.length - 1}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30"
        >
          Suivant <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </Shell>
  );
}

function Shell({
  title,
  subtitle,
  onBack,
  children,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
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
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {subtitle && <p className="mt-2 text-neutral-500 dark:text-neutral-400">{subtitle}</p>}
      <div className="mt-7">{children}</div>
    </div>
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
  return (
    <div className="glass rounded-2xl p-8 text-center text-sm text-neutral-400">{text}</div>
  );
}
