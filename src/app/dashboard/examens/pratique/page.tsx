"use client";

/**
 * Espace de préparation — practice runner (Par notion & Séries).
 * Untimed, instant correction + the same 5-mode AI menu as the exam runner.
 * On finish → record_practice() : attempts + chapter_mastery + XP + streak
 * (+ série best score and one-time bonus). Same progress model as the cours/exams.
 *
 * Routes:
 *   /dashboard/examens/pratique?chapter=<id>&notion=<heading|__all|__autres>
 *   /dashboard/examens/pratique?serie=<id>
 *   /dashboard/examens/pratique?review=<subjectCode|all>            (révision espacée)
 *   /dashboard/examens/pratique?errors=<subjectCode|all>[&chapter=&notion=]  (rejouer mes erreurs)
 */
import { createElement, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { useAccess } from "@/lib/use-access";
import { Tex } from "@/components/math";
import { subjectTheme } from "@/config/subjects";
import { SubjectAmbient, subjectIcon } from "@/components/subject-pad";
import { CourseFigure } from "@/components/course/figures";
import { questionsForNotion, groupByNotion, notionLabel, OTHER_NOTIONS } from "@/lib/notions";
import {
  loadStudentCtx, loadBank, loadPlayable, loadChapters, loadChapterNotions, loadDueReview, loadErrors, prepRoutes, KIND_LABEL,
  type PlayQ, type Serie,
} from "@/lib/prep";
import {
  ChevronLeft, ChevronRight, Check, X, Loader2, Target, Layers, Trophy, PartyPopper, RotateCw, BookOpen, Zap, Flame, Lightbulb, Brain, Swords, Compass, ListOrdered, TriangleAlert, type LucideIcon,
} from "lucide-react";

type Setup = {
  kind: "notion" | "serie" | "review";
  title: string;
  eyebrow: string;
  subjectCode: string;
  chapterId: string | null;
  serie: Pick<Serie, "id" | "xp_bonus" | "kind"> | null;
  questions: PlayQ[];
  backHref?: string;
};
type Result = { earned: number; bonus: number; pct: number; first_completion: boolean; total_xp: number; streak: number | null; review_due?: number };

const AI_MODES: { key: string; label: string; icon: LucideIcon }[] = [
  { key: "autrement", label: "Explique autrement", icon: Lightbulb },
  { key: "etapes", label: "Étape par étape", icon: ListOrdered },
  { key: "cours", label: "Rappel du cours", icon: BookOpen },
  { key: "erreurs", label: "Erreurs fréquentes", icon: TriangleAlert },
  { key: "methode", label: "Méthode générale", icon: Compass },
];

function shuffle<T>(arr: T[]): T[] {
  const r = [...arr];
  for (let k = r.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [r[k], r[j]] = [r[j], r[k]]; }
  return r;
}

export default function PratiquePage() {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const router = useRouter();
  const access = useAccess();
  const [setup, setSetup] = useState<Setup | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deck, setDeck] = useState<PlayQ[]>([]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<"run" | "saving" | "done">("run");
  const [result, setResult] = useState<Result | null>(null);
  const [aiOpen, setAiOpen] = useState<Record<string, string>>({});
  const [aiLive, setAiLive] = useState<Record<string, string>>({});
  const [aiBusy, setAiBusy] = useState<string | null>(null);
  const [hintShown, setHintShown] = useState<Record<string, boolean>>({});
  const [ctxOpen, setCtxOpen] = useState(true);
  const saved = useRef(false);

  // ---------- load ----------
  useEffect(() => {
    if (access.loading) return;
    (async () => {
      const sp = new URLSearchParams(window.location.search);
      const serieId = sp.get("serie");
      const chapterId = sp.get("chapter");
      const notion = sp.get("notion") ?? "__all";
      const onlyProb = sp.get("kind") === "probleme";
      const review = sp.get("review");
      const errorsOf = sp.get("errors");
      const ctx = await loadStudentCtx(supabase);
      if (!ctx?.levelId) { setError("Connecte-toi pour t'entraîner."); return; }
      const ownTrackId = ctx.ownTrack ? ctx.trackIdByCode.get(ctx.ownTrack) ?? null : null;

      const firstChapterOf = async (subjectId: string) => (await loadChapters(supabase, ctx.levelId!, subjectId, ownTrackId, ctx.ownTrack))[0]?.id ?? null;

      if (review) {
        const subj = review !== "all" ? ctx.subjectsByCode.get(review) : null;
        const due = await loadDueReview(supabase, subj ? { subjectId: subj.id } : undefined);
        const qs = await loadPlayable(supabase, due.slice(0, 15).map((d) => d.question_id));
        setSetup({
          kind: "review", title: "À revoir aujourd'hui",
          eyebrow: subj ? `Révision espacée · ${subj.name}` : "Révision espacée · toutes matières",
          subjectCode: subj?.code ?? "", chapterId: null, serie: null, questions: qs,
        });
        setDeck(qs.map((q) => ({ ...q, options: shuffle(q.options) })));
        return;
      }

      if (errorsOf) {
        // "Rejouer mes erreurs" — journal d'erreurs, optionally narrowed to a chapter / notion
        const subj = errorsOf !== "all" ? ctx.subjectsByCode.get(errorsOf) : null;
        let rows = await loadErrors(supabase, subj?.code ?? null);
        if (chapterId) rows = rows.filter((r) => (r.chapter_id ?? "__exam") === chapterId);
        if (chapterId && sp.get("notion")) rows = rows.filter((r) => (r.notion ?? OTHER_NOTIONS) === sp.get("notion"));
        const qs = await loadPlayable(supabase, rows.slice(0, 20).map((r) => r.question_id));
        const chName = chapterId ? rows[0]?.chapter_name ?? (chapterId === "__exam" ? "Examens" : null) : null;
        setSetup({
          kind: "review", title: "Rejouer mes erreurs",
          eyebrow: ["Journal d'erreurs", subj?.name ?? (errorsOf === "all" ? "toutes matières" : null), chName].filter(Boolean).join(" · "),
          subjectCode: subj?.code ?? "", chapterId: chapterId && chapterId !== "__exam" ? chapterId : null, serie: null, questions: qs,
          backHref: prepRoutes.errors(subj?.code),
        });
        setDeck(qs.map((q) => ({ ...q, options: shuffle(q.options) })));
        return;
      }

      if (serieId) {
        const { data: s } = await supabase.from("series").select("id, title, kind, subject_id, chapter_id, xp_bonus, chapters(name)").eq("id", serieId).maybeSingle();
        if (!s) { setError("Série introuvable."); return; }
        if (access.isDemo && s.chapter_id !== (await firstChapterOf(s.subject_id as string))) { router.replace("/payment"); return; }
        const { data: items } = await supabase.from("series_items").select("question_id, position").eq("series_id", serieId).order("position");
        const qs = await loadPlayable(supabase, ((items ?? []) as { question_id: string }[]).map((r) => r.question_id));
        const kind = s.kind as Serie["kind"];
        setSetup({
          kind: "serie", title: s.title as string,
          eyebrow: `${KIND_LABEL[kind]}${(s.chapters as unknown as { name: string } | null)?.name && kind !== "chapitre" ? ` · ${(s.chapters as unknown as { name: string }).name}` : ""}`,
          subjectCode: ctx.subjectsById.get(s.subject_id as string)?.code ?? "",
          chapterId: (s.chapter_id as string | null) ?? null,
          serie: { id: s.id as string, xp_bonus: s.xp_bonus as number, kind },
          questions: qs,
        });
        setDeck(qs.map((q) => ({ ...q, options: shuffle(q.options) })));
        return;
      }

      if (chapterId) {
        const { data: ch } = await supabase.from("chapters").select("id, name, subject_id").eq("id", chapterId).maybeSingle();
        if (!ch) { setError("Chapitre introuvable."); return; }
        if (access.isDemo && ch.id !== (await firstChapterOf(ch.subject_id as string))) { router.replace("/payment"); return; }
        const { questions: bank } = await loadBank(supabase, [chapterId]);
        let sel = bank;
        if (onlyProb) {
          sel = bank.filter((q) => q.kind === "probleme");
        } else if (notion !== "__all") {
          // same grouping as the "Par notion" list, so the counts shown there match exactly
          const heads = await loadChapterNotions(supabase, chapterId);
          const g = groupByNotion(heads, bank).find((x) => x.notion === notion);
          sel = g ? g.items : notion === OTHER_NOTIONS ? [] : questionsForNotion(notion, bank);
        }
        const qs = await loadPlayable(supabase, sel.map((q) => q.id));
        setSetup({
          kind: "notion",
          title: onlyProb ? "Problèmes type BAC" : notion === "__all" ? (ch.name as string) : notionLabel(notion),
          eyebrow: onlyProb ? `Entraînement BAC · ${ch.name as string}` : notion === "__all" ? "Tout le chapitre" : `Par notion · ${ch.name as string}`,
          subjectCode: ctx.subjectsById.get(ch.subject_id as string)?.code ?? "",
          chapterId, serie: null, questions: qs,
        });
        setDeck(qs.map((q) => ({ ...q, options: shuffle(q.options) })));
        return;
      }
      setError("Rien à pratiquer ici.");
    })();
  }, [supabase, access.loading, access.isDemo, router]);

  const q = deck[i];
  const answered = q ? !!picked[q.id] : false;
  const nCorrect = deck.filter((d) => d.options.find((o) => o.id === picked[d.id])?.correct).length;
  const code = setup?.subjectCode ?? "";
  const t = subjectTheme(code);
  const back = setup?.backHref ? setup.backHref : setup && code ? prepRoutes.subject(code, { mode: setup.kind === "serie" ? "series" : "notion", chapter: setup.kind === "notion" ? setup.chapterId ?? undefined : undefined }) : prepRoutes.hub();

  const finish = useCallback(async () => {
    if (!setup || saved.current) return;
    saved.current = true;
    setPhase("saving");
    const payload = deck.filter((d) => picked[d.id]).map((d) => ({ question_id: d.id, option_id: picked[d.id] }));
    const { data, error: err } = await supabase.rpc("record_practice", {
      p_answers: payload, p_kind: setup.kind, p_series: setup.serie?.id ?? null,
    });
    if (!err && data) setResult(data as Result);
    setPhase("done");
  }, [setup, deck, picked, supabase]);

  const next = () => {
    if (i + 1 >= deck.length) { void finish(); return; }
    if (deck[i + 1]?.exercise_id !== deck[i]?.exercise_id) setCtxOpen(true);
    setI(i + 1);
  };
  const restart = () => {
    if (!setup) return;
    saved.current = false;
    setDeck(setup.questions.map((qq) => ({ ...qq, options: shuffle(qq.options) })));
    setI(0); setPicked({}); setResult(null); setPhase("run"); setAiOpen({}); setHintShown({}); setCtxOpen(true);
  };

  async function askAI(qq: PlayQ, key: string) {
    setAiOpen((m) => ({ ...m, [qq.id]: m[qq.id] === key ? "" : key }));
    if (qq.modes[key] || aiLive[`${qq.id}:${key}`]) return;
    setAiBusy(`${qq.id}:${key}`);
    try {
      const res = await fetch("/api/explain", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: qq.statement, options: qq.options.map((o) => o.label), choice: qq.options.find((o) => o.id === picked[qq.id])?.label ?? "", existing: qq.solution, mode: key }),
      });
      const j = await res.json();
      setAiLive((m) => ({ ...m, [`${qq.id}:${key}`]: j.text || `${j.error || "Explication indisponible."}` }));
    } catch { setAiLive((m) => ({ ...m, [`${qq.id}:${key}`]: "Explication indisponible." })); }
    setAiBusy(null);
  }

  // ---------- states ----------
  if (error) return <Shell back={prepRoutes.hub()}><div className="mt-6 glass rounded-3xl p-10 text-center text-neutral-400">{error}</div></Shell>;
  if (!setup) return <Shell back={prepRoutes.hub()}><div className="grid place-items-center h-60 text-neutral-400"><Loader2 className="w-6 h-6 animate-spin" /></div></Shell>;

  const Hero = (
    <div className={`mt-3 rounded-3xl p-6 sm:p-7 relative overflow-hidden text-white bg-gradient-to-br ${t.grad} shadow-lg shadow-black/10`}>
      <div className="pointer-events-none absolute -top-20 -right-16 w-64 h-64 rounded-full bg-white/15 blur-3xl" />
      {createElement(subjectIcon(code), { className: "pointer-events-none absolute -right-4 -bottom-5 w-28 h-28 rotate-[18deg] text-white/15", strokeWidth: 1.25 })}
      <div className="relative flex items-center gap-2 text-xs font-semibold text-white/85">
        {setup.kind === "serie" ? <Layers className="w-4 h-4" /> : setup.kind === "review" ? <Brain className="w-4 h-4" /> : <Target className="w-4 h-4" />} <span dir="auto" className="truncate">{setup.eyebrow}</span>
      </div>
      <h1 dir="auto" className="relative mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight"><Tex>{setup.title}</Tex></h1>
      <p className="relative mt-1.5 text-sm text-white/85">
        {deck.length} question{deck.length > 1 ? "s" : ""} · correction immédiate
        {setup.serie ? ` · +${setup.serie.xp_bonus} XP bonus à 70 %` : ""}
      </p>
    </div>
  );

  if (deck.length === 0) {
    return <Shell back={back}>{Hero}<div className="mt-5 glass rounded-3xl p-10 text-center text-sm text-neutral-400">{setup.kind === "review" ? "Rien à revoir pour l'instant — reviens demain ou continue par notion." : "Aucun exercice pour l'instant — ils arrivent bientôt."}</div></Shell>;
  }

  // ---------- results ----------
  if (phase !== "run") {
    const pct = Math.round((nCorrect / deck.length) * 100);
    const wrong = deck.filter((d) => !d.options.find((o) => o.id === picked[d.id])?.correct);
    return (
      <Shell back={back}>
        <SubjectAmbient code={code} />
        {Hero}
        <div className="mt-5 glass rounded-3xl p-7 text-center">
          <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${t.grad} text-white grid place-items-center shadow-lg`}>
            {pct === 100 ? <PartyPopper className="w-7 h-7" /> : <Trophy className="w-7 h-7" />}
          </div>
          <div className="mt-4 text-4xl font-extrabold tracking-tight tabular-nums">{nCorrect} / {deck.length}</div>
          <div className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {pct === 100 ? "Parfait ! Notion maîtrisée." : pct >= 70 ? "Bien joué — encore un petit effort pour le sans-faute." : "Relis le cours de la notion, puis retente."}
          </div>
          {phase === "saving" ? (
            <div className="mt-5 inline-flex items-center gap-2 text-sm text-neutral-400"><Loader2 className="w-4 h-4 animate-spin" /> Enregistrement…</div>
          ) : result ? (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1 text-sm font-bold px-3 py-1 rounded-full bg-arctic-blue/15 text-arctic-blue dark:text-arctic-cyan"><Zap className="w-4 h-4" /> +{result.earned} XP</span>
              {result.bonus > 0 && <span className="inline-flex items-center gap-1 text-sm font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"><Zap className="w-4 h-4" /> Série validée · +{result.bonus} XP</span>}
              {result.streak != null && <span className="inline-flex items-center gap-1 text-sm font-bold px-3 py-1 rounded-full bg-orange-500/15 text-orange-500"><Flame className="w-4 h-4" /> {result.streak} j</span>}
              {!!result.review_due && setup.kind !== "review" && <Link href={prepRoutes.review(code || undefined)} className="inline-flex items-center gap-1 text-sm font-bold px-3 py-1 rounded-full bg-violet-500/15 text-violet-600 dark:text-violet-400"><Brain className="w-4 h-4" /> {result.review_due} à revoir</Link>}
            </div>
          ) : (
            <div className="mt-5 text-xs text-neutral-400">Résultat non enregistré (connexion ?).</div>
          )}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button onClick={restart} className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full glass hover:-translate-y-0.5 transition"><RotateCw className="w-4 h-4" /> Recommencer</button>
            {setup.chapterId && <Link href={prepRoutes.cours(setup.chapterId)} className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full glass hover:-translate-y-0.5 transition"><BookOpen className="w-4 h-4" /> Revoir le cours</Link>}
            <Link href={back} className={`inline-flex items-center gap-1.5 text-sm font-semibold px-5 py-2 rounded-full bg-gradient-to-r ${t.grad} text-white hover:brightness-105 transition`}>Continuer <ChevronRight className="w-4 h-4" /></Link>
          </div>
        </div>

        {wrong.length > 0 && (
          <div className="mt-5">
            <div className="text-[11px] font-bold uppercase tracking-wide text-neutral-400 mb-2">À revoir · {wrong.length}</div>
            <div className="space-y-2.5">
              {wrong.map((d) => (
                <div key={d.id} className="glass rounded-2xl p-5">
                  <div className="text-sm font-semibold leading-relaxed"><Tex>{d.statement}</Tex></div>
                  <div className="mt-2 text-sm"><span className="text-emerald-600 dark:text-emerald-400 font-semibold">Bonne réponse : </span><Tex>{d.options.find((o) => o.correct)?.label ?? ""}</Tex></div>
                  {d.solution && <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed"><Tex>{d.solution}</Tex></div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </Shell>
    );
  }

  // ---------- run ----------
  const chosen = q.options.find((o) => o.id === picked[q.id]);
  const aiKey = aiOpen[q.id];
  return (
    <Shell back={back}>
      <SubjectAmbient code={code} />
      {Hero}
      <div className="mt-5 glass rounded-3xl p-6 sm:p-7">
        <div className="flex items-center justify-between mb-2 text-xs">
          <span className={`font-semibold ${t.text}`}>Question {i + 1} / {deck.length}</span>
          <span className="text-neutral-400 tabular-nums">{nCorrect} bonne{nCorrect > 1 ? "s" : ""}</span>
        </div>
        <div className="h-1.5 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden mb-5">
          <div className={`h-full ${t.bar} transition-all duration-300`} style={{ width: `${((i + (answered ? 1 : 0)) / deck.length) * 100}%` }} />
        </div>

        {q.kind === "probleme" ? (() => {
          const sub = deck.filter((d) => d.exercise_id === q.exercise_id);
          const k = sub.findIndex((d) => d.id === q.id) + 1;
          return (
            <div className="mb-4 rounded-2xl border border-orange-500/30 bg-gradient-to-br from-amber-400/[0.07] to-orange-500/[0.04]">
              <button onClick={() => setCtxOpen(!ctxOpen)} className="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-left">
                <span className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-orange-600 dark:text-orange-400">
                  <Swords className="w-4 h-4" /> Problème type BAC{q.exercise_title ? ` · ${q.exercise_title}` : ""}
                </span>
                <span className="text-[11px] font-semibold text-neutral-500">Question {k}/{sub.length} · {ctxOpen ? "masquer l'énoncé" : "voir l'énoncé"}</span>
              </button>
              {ctxOpen && (
                <div className="px-4 pb-4 text-sm text-neutral-700 dark:text-neutral-200 leading-relaxed">
                  {q.context && <div dir="auto"><Tex>{q.context}</Tex></div>}
                  {q.figure && <CourseFigure name={q.figure} />}
                </div>
              )}
            </div>
          );
        })() : (q.context || q.figure) && <div className="mb-3 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] px-4 py-3 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">{q.context && <Tex>{q.context}</Tex>}{q.figure && <CourseFigure name={q.figure} />}</div>}
        {q.part && <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-neutral-400">{q.part}</div>}
        <div dir="auto" className="text-[16px] font-semibold leading-relaxed"><Tex>{q.statement}</Tex></div>
        {!answered && q.hint && (
          hintShown[q.id] ? (
            <div className="mt-3 rounded-xl bg-amber-500/[0.08] border border-amber-500/25 px-3.5 py-2.5 text-sm text-amber-800 dark:text-amber-200 flex gap-2"><Lightbulb className="w-4 h-4 shrink-0 mt-0.5" /><span><Tex>{q.hint}</Tex></span></div>
          ) : (
            <button onClick={() => setHintShown((h) => ({ ...h, [q.id]: true }))} className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 transition"><Lightbulb className="w-3.5 h-3.5" /> Un indice ?</button>
          )
        )}

        <div className="mt-4 space-y-2.5">
          {q.options.map((o, idx) => {
            const isPicked = picked[q.id] === o.id;
            const showRight = answered && o.correct;
            const showWrong = answered && isPicked && !o.correct;
            return (
              <button key={o.id} disabled={answered} onClick={() => setPicked((p) => ({ ...p, [q.id]: o.id }))}
                className={`w-full text-left px-4 py-3 rounded-2xl border flex items-center gap-3 transition ${
                  showRight ? "border-emerald-500 bg-emerald-500/10" : showWrong ? "border-red-500 bg-red-500/10" :
                  "border-black/[0.08] dark:border-white/[0.10] hover:border-arctic-blue/60 hover:bg-arctic-blue/[0.04]"} ${answered ? "cursor-default" : ""}`}>
                <span className={`w-6 h-6 rounded-lg grid place-items-center text-xs font-bold shrink-0 ${showRight ? "bg-emerald-500 text-white" : showWrong ? "bg-red-500 text-white" : "bg-black/[0.05] dark:bg-white/[0.08] text-neutral-500"}`}>
                  {showRight ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : showWrong ? <X className="w-3.5 h-3.5" strokeWidth={3} /> : String.fromCharCode(65 + idx)}
                </span>
                <span dir="auto" className="flex-1"><Tex>{o.label}</Tex></span>
              </button>
            );
          })}
        </div>

        {answered && (
          <>
            <div className={`mt-4 rounded-2xl border-l-[3px] p-4 ${chosen?.correct ? "border-emerald-500/60 bg-emerald-500/[0.05]" : "border-red-500/60 bg-red-500/[0.05]"}`}>
              <div className={`text-[11px] font-bold uppercase tracking-wide mb-1 ${chosen?.correct ? "text-emerald-600 dark:text-emerald-300" : "text-red-500"}`}>{chosen?.correct ? "Bonne réponse" : "Correction"}</div>
              {chosen && !chosen.correct && chosen.why && (
                <div className="mb-2 text-sm text-red-600 dark:text-red-300 leading-relaxed"><span className="font-semibold">Pourquoi ta réponse est fausse : </span><Tex>{chosen.why}</Tex></div>
              )}
              <div className="text-sm text-neutral-700 dark:text-neutral-200 leading-relaxed">{q.solution ? <Tex>{q.solution}</Tex> : "—"}</div>
              {(() => { const ok = q.options.find((o) => o.correct); return ok?.why && !chosen?.correct ? <div className="mt-2 text-sm text-emerald-700 dark:text-emerald-300 leading-relaxed"><span className="font-semibold">La bonne réponse : </span><Tex>{ok.why}</Tex></div> : null; })()}
              {!chosen?.correct && q.chapter_id && (
                <Link href={prepRoutes.cours(q.chapter_id)} className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-full bg-white/70 dark:bg-white/[0.07] text-arctic-blue dark:text-arctic-cyan hover:-translate-y-0.5 transition">
                  <BookOpen className="w-3.5 h-3.5" /> Revoir le cours{q.notion ? ` · ${notionLabel(q.notion)}` : ""}
                </Link>
              )}
            </div>
            {q.methode && (
              <div className="mt-3 rounded-2xl bg-arctic-blue/[0.06] border border-arctic-blue/20 p-4">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-arctic-blue dark:text-arctic-cyan mb-1"><Compass className="w-3.5 h-3.5" /> Méthode à retenir</div>
                <div className="text-sm text-neutral-700 dark:text-neutral-200 leading-relaxed"><Tex>{q.methode}</Tex></div>
              </div>
            )}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {AI_MODES.map((m) => (
                <button key={m.key} onClick={() => askAI(q, m.key)}
                  className={`inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-full transition ${aiKey === m.key ? "bg-arctic-blue text-white" : "bg-black/[0.04] dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-300 hover:bg-arctic-blue/10"}`}>
                  <m.icon className="w-3.5 h-3.5" /> {m.label}
                </button>
              ))}
            </div>
            {aiKey && (
              <div className="mt-3 rounded-2xl bg-arctic-blue/[0.06] p-4 text-sm leading-relaxed text-neutral-700 dark:text-neutral-200">
                {aiBusy === `${q.id}:${aiKey}` ? <Loader2 className="w-4 h-4 animate-spin text-arctic-blue" /> : <Tex>{q.modes[aiKey] ?? aiLive[`${q.id}:${aiKey}`] ?? ""}</Tex>}
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <button onClick={next} className={`inline-flex items-center gap-1.5 text-sm font-semibold px-5 py-2.5 rounded-full bg-gradient-to-r ${t.grad} text-white hover:brightness-105 transition`}>
                {i + 1 >= deck.length ? "Voir mon score" : "Suivant"} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </Shell>
  );
}

function Shell({ back, children }: { back: string; children: React.ReactNode }) {
  return (
    <div className="max-w-3xl mx-auto py-8 fade-up">
      <Link href={back} className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
        <ChevronLeft className="w-4 h-4" /> Préparation
      </Link>
      {children}
    </div>
  );
}
