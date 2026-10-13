"use client";

/**
 * Espace de préparation — one matière, three modes.
 *   Par notion : same dept → unit → chapter tree as the Cours; a chapter opens
 *                its cours notions (## headings) with per-notion réussite.
 *   Séries     : curated sets (bilans, unités, mixtes BAC, séries du prof)
 *                with best score + one-time XP bonus.
 *   Examens    : annales / examens blancs → the existing session runner (unchanged).
 *                Locked « Bientôt » while FEATURES.examEngine is false (opens <ExamsSoonPanel>).
 * Route: /dashboard/examens/preparation/<subjectCode>?f=<track>&mode=notion|series|examens&chapter=<id>
 */
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { useQueryState } from "@/lib/use-query-state";
import { useAccess } from "@/lib/use-access";
import { subjectTheme } from "@/config/subjects";
import { SubjectAmbient } from "@/components/subject-pad";
import { SubjectBanner } from "@/components/subject-banner";
import { PrepAlerts } from "@/components/prep/prep-alerts";
import { LockBadge } from "@/components/dashboard/paywall";
import { SoonPill, ExamsSoonPanel } from "@/components/prep/exams-soon";
import { FEATURES } from "@/config";
import { SHORT } from "@/lib/filieres";
import { groupByNotion, notionLabel, OTHER_NOTIONS } from "@/lib/notions";
import {
  loadStudentCtx, loadChapters, loadBank, loadSeries, loadSeriesProgress, loadMastery, loadLatestAttempts,
  loadChapterNotions, notionLevel, LEVELS, prepRoutes, DIFF_LABEL, KIND_LABEL, type Level,
  type StudentCtx, type PrepChapter, type BankQ, type Serie, type SerieProgress, type ChapterMastery,
} from "@/lib/prep";
import {
  ChevronLeft, ChevronDown, ChevronRight, Loader2, Target, Layers, Timer, BookOpen, Lock, Play,
  CheckCircle2, Zap, RotateCw, FileText, Swords,
} from "lucide-react";

type Mode = "notion" | "series" | "examens";
type Exam = { id: string; year: number; session: string; exam_type: string; duration_minutes: number | null; title: string | null; track_id: string | null };
type NotionRow = { notion: string; total: number; done: number; correct: number; probTotal: number; probCorrect: number; level: Level };

export default function PrepSubjectPage() {
  return <Suspense fallback={null}><PrepSubjectPageInner /></Suspense>;
}

function PrepSubjectPageInner() {
  const q = useQueryState();
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const access = useAccess();
  const params = useParams<{ subject: string }>();
  const code = decodeURIComponent(params.subject ?? "");

  const [ctx, setCtx] = useState<StudentCtx | null>(null);
  const [filiere, setFiliere] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("notion");
  const [openCh, setOpenCh] = useState<string | null>(null);
  const [dept, setDept] = useState("");
  const [loading, setLoading] = useState(true);

  const [chapters, setChapters] = useState<PrepChapter[]>([]);
  const [bank, setBank] = useState<BankQ[]>([]);
  const [series, setSeries] = useState<Serie[]>([]);
  const [sProg, setSProg] = useState<Map<string, SerieProgress>>(new Map());
  const [exams, setExams] = useState<Exam[]>([]);
  const [mastery, setMastery] = useState<Map<string, ChapterMastery>>(new Map());
  const [notions, setNotions] = useState<Record<string, NotionRow[] | "loading">>({});
  const examsLocked = !FEATURES.examEngine;
  const [soonOpen, setSoonOpen] = useState(false);

  const subject = ctx?.subjectsByCode.get(code) ?? null;

  // Mirror tab / open chapter / department into the URL (in place) so Back,
  // refresh and the sidebar "last spot" reopen exactly this view.
  useEffect(() => {
    if (!ctx) return;
    q.set({ mode: mode === "notion" ? null : mode, chapter: openCh, d: dept || null }, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx, mode, openCh, dept]);
  const t = subjectTheme(code);

  useEffect(() => {
    (async () => {
      const sp = new URLSearchParams(window.location.search);
      const m = sp.get("mode");
      if (m === "examens" && !FEATURES.examEngine) setSoonOpen(true);
      else if (m === "series" || m === "examens" || m === "notion") setMode(m);
      if (sp.get("chapter")) setOpenCh(sp.get("chapter"));
      if (sp.get("d")) setDept(sp.get("d")!);
      const c = await loadStudentCtx(supabase);
      setCtx(c);
      setFiliere(c?.ownTrack || null); // own filière only
      if (!c?.levelId || !c.subjectsByCode.get(code)) setLoading(false);
    })();
  }, [supabase, code]);

  // lazily resolve a chapter's notions (cours headings) + the student's latest result per question
  const loadNotions = useCallback(async (chId: string, items: BankQ[]) => {
    setNotions((n) => ({ ...n, [chId]: "loading" }));
    const [heads, latest] = await Promise.all([loadChapterNotions(supabase, chId), loadLatestAttempts(supabase, items.map((q) => q.id))]);
    const groups = groupByNotion(heads, items).filter((g) => g.items.length > 0);
    setNotions((n) => ({
      ...n,
      [chId]: groups.map((g) => ({
        notion: g.notion, total: g.items.length,
        done: g.items.filter((q) => latest.has(q.id)).length,
        correct: g.items.filter((q) => latest.get(q.id) === true).length,
        probTotal: g.items.filter((q) => q.kind === "probleme").length,
        probCorrect: g.items.filter((q) => q.kind === "probleme" && latest.get(q.id) === true).length,
      })).map((r) => ({ ...r, level: notionLevel(r) })),
    }));
  }, [supabase]);
  useEffect(() => {
    if (!ctx?.levelId || !subject) return;
    let live = true;
    (async () => {
      setLoading(true);
      const trackId = filiere ? ctx.trackIdByCode.get(filiere) ?? null : null;
      const chs = await loadChapters(supabase, ctx.levelId!, subject.id, trackId, filiere);
      const ids = chs.map((c) => c.id);
      const [b, se, m, { data: ex }] = await Promise.all([
        loadBank(supabase, ids),
        loadSeries(supabase, ctx.levelId!, subject.id, trackId),
        loadMastery(supabase, ids),
        supabase.from("exams").select("id, year, session, exam_type, duration_minutes, title, track_id")
          .eq("level_id", ctx.levelId!).eq("subject_id", subject.id).order("year", { ascending: false }),
      ]);
      const sp = await loadSeriesProgress(supabase, se.map((s) => s.id));
      if (!live) return;
      setChapters(chs); setBank(b.questions); setSeries(se.filter((x) => !x.chapter_id || chs.some((c) => c.id === x.chapter_id))); setSProg(sp); setMastery(m);
      setExams(FEATURES.examEngine ? ((ex ?? []) as Exam[]).filter((e) => (e.track_id === trackId || e.track_id == null) && !b.bankExamIds.has(e.id)) : []);
      setLoading(false);
      const deep = new URLSearchParams(window.location.search).get("chapter");
      const deepItems = deep ? b.questions.filter((q) => q.chapter_id === deep) : [];
      if (deep && deepItems.length) {
        void loadNotions(deep, deepItems);
        setTimeout(() => document.getElementById(`ch-${deep}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
      }
    })();
    return () => { live = false; };
  }, [ctx, subject, filiere, supabase, loadNotions]);

  // keep the URL shareable (mode + open chapter) without a navigation
  useEffect(() => {
    if (!subject) return;
    const url = prepRoutes.subject(code, { f: filiere !== ctx?.ownTrack ? filiere : null, mode, chapter: mode === "notion" && openCh ? openCh : undefined });
    window.history.replaceState(null, "", url);
  }, [mode, openCh, filiere, code, subject, ctx]);

  const qByCh = useMemo(() => {
    const m = new Map<string, BankQ[]>();
    for (const q of bank) { const a = m.get(q.chapter_id) ?? []; a.push(q); m.set(q.chapter_id, a); }
    return m;
  }, [bank]);

  const firstId = chapters.find((c) => (qByCh.get(c.id)?.length ?? 0) > 0)?.id;
  const lockedCh = useCallback((id: string | null) => access.isDemo && id !== firstId, [access.isDemo, firstId]);

  const ensureNotions = (chId: string) => { if (notions[chId] === undefined && (qByCh.get(chId)?.length ?? 0) > 0) void loadNotions(chId, qByCh.get(chId)!); };

  // subject banner: resume the most recently practiced chapter, else start the first one
  const resume = useMemo(() => {
    let best: ChapterMastery | null = null;
    for (const m of mastery.values()) if (m.last_practiced_at && (!best || m.last_practiced_at > (best.last_practiced_at ?? ""))) best = m;
    return best ? { ch: chapters.find((c) => c.id === best!.chapter_id) ?? null, pct: Math.round(best.mastery_pct) } : null;
  }, [mastery, chapters]);

  const goChapter = (id: string) => { setMode("notion"); setOpenCh(id); ensureNotions(id); setTimeout(() => document.getElementById(`ch-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 50); };

  if (!loading && !subject) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <Link href={prepRoutes.hub()} className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white"><ChevronLeft className="w-4 h-4" /> Préparation</Link>
        <div className="mt-6 glass rounded-3xl p-10 text-center text-neutral-400">Matière introuvable.</div>
      </div>
    );
  }

  const counts = { notion: bank.length, series: series.length, examens: exams.length };
  const TABS: { key: Mode; label: string; icon: typeof Target }[] = [
    { key: "notion", label: "Par notion", icon: Target },
    { key: "series", label: "Séries", icon: Layers },
    { key: "examens", label: "Examens", icon: Timer },
  ];

  return (
    <div className="max-w-3xl mx-auto py-8 fade-up">
      <SubjectAmbient code={code} />
      <Link href={prepRoutes.hub(filiere !== ctx?.ownTrack ? filiere : null)} className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
        <ChevronLeft className="w-4 h-4" /> {ctx?.levelCode === "2bac" && filiere ? `Préparation · ${SHORT[filiere] ?? filiere}` : "Préparation"}
      </Link>

      <div className="mt-3">
        {subject && (resume?.ch ? (
          <SubjectBanner mode="resume" code={code} name={subject.name}
            subtitle={`${resume.ch.name} · ${resume.pct}% de réussite`}
            done={mastery.size} total={Math.max(chapters.length, 1)}
            onClick={() => goChapter(resume.ch!.id)} />
        ) : (
          <SubjectBanner mode="new" code={code} name={subject.name}
            subtitle={loading ? "Chargement…" : `${counts.notion} exercices · ${counts.series} séries${examsLocked ? "" : ` · ${counts.examens} examens`}`}
            onClick={() => chapters[0] && goChapter(chapters[0].id)} />
        ))}
      </div>

      <PrepAlerts subject={code} className="mt-4" />

      {/* mode tabs */}
      <div className="mt-5 grid grid-cols-3 gap-1 p-1 rounded-2xl glass">
        {TABS.map((tb) => {
          const on = mode === tb.key;
          if (tb.key === "examens" && examsLocked) {
            return (
              <button key={tb.key} onClick={() => setSoonOpen(true)} aria-haspopup="dialog"
                className="relative flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-sm font-semibold transition text-neutral-400 dark:text-neutral-500 hover:bg-black/[0.04] dark:hover:bg-white/[0.05]">
                <Lock className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{tb.label}</span>
                <SoonPill className="hidden sm:inline-flex" />
              </button>
            );
          }
          return (
            <button key={tb.key} onClick={() => setMode(tb.key)}
              className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-sm font-semibold transition ${on ? `bg-gradient-to-br ${t.grad} text-white shadow-lg shadow-black/10` : "text-neutral-500 dark:text-neutral-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"}`}>
              <tb.icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{tb.label}</span>
              {!loading && <span className={`hidden sm:inline text-[11px] font-bold px-1.5 rounded-full ${on ? "bg-white/20" : "bg-black/[0.05] dark:bg-white/[0.08]"}`}>{counts[tb.key]}</span>}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="grid place-items-center h-40 text-neutral-400"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : mode === "notion" ? (
        <NotionMode chapters={chapters.filter((c) => (qByCh.get(c.id)?.length ?? 0) > 0)} qByCh={qByCh} mastery={mastery} openCh={openCh} setOpenCh={setOpenCh}
          notions={notions} ensureNotions={ensureNotions} lockedCh={lockedCh} dept={dept} setDept={setDept} code={code} />
      ) : mode === "series" ? (
        <SeriesMode series={series} prog={sProg} chapters={chapters} lockedCh={lockedCh} code={code} />
      ) : examsLocked ? null : (
        <ExamMode exams={exams} code={code} />
      )}
      <ExamsSoonPanel open={soonOpen} onClose={() => setSoonOpen(false)} />
    </div>
  );
}

/* ============================== PAR NOTION ============================== */
function NotionMode({ chapters, qByCh, mastery, openCh, setOpenCh, notions, ensureNotions, lockedCh, dept, setDept, code }: {
  chapters: PrepChapter[]; qByCh: Map<string, BankQ[]>; mastery: Map<string, ChapterMastery>;
  openCh: string | null; setOpenCh: (id: string | null) => void;
  notions: Record<string, NotionRow[] | "loading">; ensureNotions: (id: string) => void;
  lockedCh: (id: string | null) => boolean; dept: string; setDept: (d: string) => void; code: string;
}) {
  const router = useRouter();
  const t = subjectTheme(code);
  if (chapters.length === 0) return <Empty text="Les exercices de cette matière arrivent très bientôt." />;
  const num = new Map(chapters.map((c, i) => [c.id, i + 1]));

  const Row = (c: PrepChapter) => {
    const n = qByCh.get(c.id)?.length ?? 0;
    const nProb = new Set((qByCh.get(c.id) ?? []).filter((q) => q.kind === "probleme").map((q) => q.exercise_id)).size;
    const locked = lockedCh(c.id);
    const open = openCh === c.id;
    const m = mastery.get(c.id);
    const rows = notions[c.id];
    const toggle = () => {
      if (locked) { router.push("/payment"); return; }
      if (open) { setOpenCh(null); return; }
      setOpenCh(c.id);
      ensureNotions(c.id);
    };
    return (
      <div key={c.id} id={`ch-${c.id}`} className={`glass rounded-2xl overflow-hidden scroll-mt-24 transition ${open ? `ring-1 ${t.ring}` : ""}`}>
        <button onClick={toggle} disabled={n === 0 && !locked} className={`w-full p-4 sm:p-5 flex items-center gap-4 text-left transition ${n === 0 && !locked ? "opacity-55" : "hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"}`}>
          <span className={`w-9 h-9 rounded-xl ${t.soft} ${t.text} grid place-items-center font-bold text-sm shrink-0`}>{num.get(c.id)}</span>
          <div className="flex-1 min-w-0">
            <div dir="auto" className="font-semibold tracking-tight flex items-center gap-2">{c.name}{locked && <LockBadge />}</div>
            <div className="mt-1 flex items-center gap-3 text-[11px] text-neutral-400">
              <span className="inline-flex items-center gap-1"><Target className="w-3 h-3" /> {n ? `${n} exercice${n > 1 ? "s" : ""}` : "Bientôt"}</span>
              {m && <span className="inline-flex items-center gap-1.5">
                <span className="w-16 h-1.5 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden"><span className={`block h-full ${t.bar}`} style={{ width: `${Math.round(m.mastery_pct)}%` }} /></span>
                {Math.round(m.mastery_pct)}%
              </span>}
            </div>
          </div>
          {locked ? <Lock className="w-4 h-4 text-neutral-400 shrink-0" /> : n > 0 && <ChevronDown className={`w-5 h-5 text-neutral-300 dark:text-neutral-600 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />}
        </button>

        {open && (
          <div className="px-4 sm:px-5 pb-4 border-t border-black/[0.05] dark:border-white/[0.06]">
            {rows === "loading" || rows === undefined ? (
              <div className="grid place-items-center h-20 text-neutral-400"><Loader2 className="w-5 h-5 animate-spin" /></div>
            ) : (
              <div className="pt-3 space-y-2">
                {rows.map((r) => {
                  const pct = r.total ? Math.round((r.correct / r.total) * 100) : 0;
                  const L = LEVELS[r.level];
                  const mastered = r.level >= 3;
                  return (
                    <Link key={r.notion} href={prepRoutes.notion(c.id, r.notion)}
                      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition">
                      <span className={`w-7 h-7 rounded-lg grid place-items-center shrink-0 ${mastered ? "bg-emerald-500 text-white" : `${t.soft} ${t.text}`}`}>
                        {mastered ? <CheckCircle2 className="w-4 h-4" /> : <Target className="w-3.5 h-3.5" />}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <span dir="auto" className={`text-sm font-semibold truncate ${r.notion === OTHER_NOTIONS ? "italic text-neutral-500" : ""}`}>{notionLabel(r.notion)}</span>
                          <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${L.tone}`}>{L.short}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-[11px] text-neutral-400">
                          <span className="w-20 h-1 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden"><span className={`block h-full ${mastered ? "bg-emerald-500" : t.bar}`} style={{ width: `${pct}%` }} /></span>
                          {r.done ? `${r.correct}/${r.total} réussies` : `${r.total} exo${r.total > 1 ? "s" : ""}`}
                          {r.probTotal > 0 && <span className="inline-flex items-center gap-0.5"><Swords className="w-3 h-3" /> {r.probTotal} type BAC</span>}
                        </div>
                      </div>
                      <span className={`text-xs font-semibold ${t.text} inline-flex items-center gap-1 shrink-0`}>{r.done ? "Refaire" : "S'entraîner"} <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" /></span>
                    </Link>
                  );
                })}
                <div className="pt-2 flex flex-wrap gap-2">
                  <Link href={prepRoutes.chapter(c.id)} className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full bg-gradient-to-r ${t.grad} text-white hover:brightness-105 transition`}><Play className="w-3.5 h-3.5 fill-current" /> Tout le chapitre</Link>
                  {nProb > 0 && <Link href={prepRoutes.problemes(c.id)} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:brightness-105 transition"><Swords className="w-3.5 h-3.5" /> Problèmes type BAC · {nProb}</Link>}
                  <Link href={prepRoutes.cours(c.id)} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full glass hover:-translate-y-0.5 transition"><BookOpen className="w-3.5 h-3.5" /> Revoir le cours</Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const hasDomains = chapters.some((c) => c.domain);
  if (!hasDomains) return <div className="mt-5 space-y-2.5">{chapters.map((c) => Row(c))}</div>;

  // Departments + units exactly like the Cours
  const seen = new Map<string, number>();
  for (const c of chapters) { const d = c.domain ?? ""; if (d && !seen.has(d)) seen.set(d, c.unit_pos ?? 0); }
  const DEPTS = [...seen.entries()].sort((a, b) => a[1] - b[1]).map(([key]) => ({ key, label: key.charAt(0).toUpperCase() + key.slice(1) }));
  const openDept = chapters.find((c) => c.id === openCh)?.domain ?? "";
  const activeDept = DEPTS.some((d) => d.key === dept) ? dept : (openDept || DEPTS[0]?.key || "");
  const inDept = chapters.filter((c) => (c.domain ?? "") === activeDept).sort((a, b) => (a.unit_pos ?? 0) - (b.unit_pos ?? 0) || a.position - b.position);
  const units: { unit: string; items: PrepChapter[] }[] = [];
  for (const c of inDept) { const u = c.unit ?? "Autres"; const last = units[units.length - 1]; if (last && last.unit === u) last.items.push(c); else units.push({ unit: u, items: [c] }); }

  return (
    <div className="mt-5">
      {DEPTS.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {DEPTS.map((d) => {
            const on = d.key === activeDept;
            return (
              <button key={d.key} onClick={() => setDept(d.key)}
                className={`flex-1 min-w-[120px] rounded-2xl px-4 py-3 text-sm font-bold tracking-tight transition ${on ? `bg-gradient-to-br ${t.grad} text-white shadow-lg shadow-black/10` : "glass text-neutral-600 dark:text-neutral-300 hover:-translate-y-0.5"}`}>
                {d.label}
              </button>
            );
          })}
        </div>
      )}
      <div className="space-y-6">
        {units.map((g) => (
          <div key={g.unit}>
            <div className="flex items-center gap-2 mb-2.5">
              <span dir="auto" className={`text-[11px] font-bold uppercase tracking-wide ${t.text}`}>{g.unit}</span>
              <span className="h-px flex-1 bg-black/[0.06] dark:bg-white/[0.08]" />
              <span className="text-[11px] text-neutral-400">{g.items.length} chap.</span>
            </div>
            <div className="space-y-2.5">{g.items.map((c) => Row(c))}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================ SÉRIES ================================ */
function SeriesMode({ series, prog, chapters, lockedCh, code }: {
  series: Serie[]; prog: Map<string, SerieProgress>; chapters: PrepChapter[]; lockedCh: (id: string | null) => boolean; code: string;
}) {
  const t = subjectTheme(code);
  if (series.length === 0) return <Empty text="Les séries de cette matière arrivent très bientôt." />;
  const chName = new Map(chapters.map((c) => [c.id, c.name]));
  const chPos = new Map(chapters.map((c, i) => [c.id, i]));
  const done = series.filter((s) => prog.get(s.id)?.completed_at).length;

  const sections: { title: string; items: Serie[] }[] = [
    { title: "Séries du prof", items: series.filter((s) => s.kind === "custom") },
    { title: "Mixtes BAC", items: series.filter((s) => s.kind === "mixte") },
    { title: "Par unité", items: series.filter((s) => s.kind === "unite") },
    { title: "Bilans de chapitre", items: series.filter((s) => s.kind === "chapitre").sort((a, b) => (chPos.get(a.chapter_id ?? "") ?? 0) - (chPos.get(b.chapter_id ?? "") ?? 0)) },
  ].filter((s) => s.items.length);

  return (
    <div className="mt-5">
      <div className="glass rounded-2xl p-4 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-neutral-500 dark:text-neutral-400">Séries validées (≥ 70 %)</span>
            <span className={`font-bold ${t.text}`}>{done}/{series.length}</span>
          </div>
          <div className="h-2 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden"><div className={`h-full ${t.bar} transition-all`} style={{ width: `${(done / series.length) * 100}%` }} /></div>
        </div>
      </div>

      <div className="mt-5 space-y-6">
        {sections.map((sec) => (
          <div key={sec.title}>
            <div className="flex items-center gap-2 mb-2.5">
              <span className={`text-[11px] font-bold uppercase tracking-wide ${t.text}`}>{sec.title}</span>
              <span className="h-px flex-1 bg-black/[0.06] dark:bg-white/[0.08]" />
              <span className="text-[11px] text-neutral-400">{sec.items.length}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {sec.items.map((s) => {
                const p = prog.get(s.id);
                const locked = lockedCh(s.chapter_id);
                const completed = !!p?.completed_at;
                return (
                  <Link key={s.id} href={locked ? "/payment" : prepRoutes.serie(s.id)}
                    className={`group glass rounded-2xl p-4 flex flex-col gap-3 transition ${locked ? "opacity-80 hover:opacity-100" : "hover:-translate-y-0.5"}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">{KIND_LABEL[s.kind]}{s.chapter_id && s.kind !== "chapitre" ? ` · ${chName.get(s.chapter_id) ?? ""}` : ""}</div>
                        <div dir="auto" className="mt-0.5 font-semibold tracking-tight leading-snug">{s.title}</div>
                      </div>
                      {locked ? <Lock className="w-4 h-4 text-neutral-400 shrink-0" /> : completed ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> : null}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-300 font-semibold">
                        <span className={`w-1.5 h-1.5 rounded-full ${s.difficulty >= 3 ? "bg-red-500" : s.difficulty === 2 ? "bg-amber-500" : "bg-emerald-500"}`} />{DIFF_LABEL[s.difficulty]}
                      </span>
                      <span className="text-neutral-400">{s.count} questions</span>
                      {!completed && <span className={`inline-flex items-center gap-0.5 font-semibold ${t.text}`}><Zap className="w-3 h-3" />+{s.xp_bonus} XP bonus</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden">
                        <div className={`h-full ${completed ? "bg-emerald-500" : t.bar}`} style={{ width: `${p ? Math.round(p.best_pct) : 0}%` }} />
                      </div>
                      <span className="text-[11px] font-bold tabular-nums text-neutral-500 w-10 text-right">{p ? `${Math.round(p.best_pct)}%` : "—"}</span>
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold ${t.text}`}>
                        {p ? <><RotateCw className="w-3.5 h-3.5" /> Refaire</> : <><Play className="w-3.5 h-3.5 fill-current" /> Go</>}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================ EXAMENS ================================ */
function ExamMode({ exams }: { exams: Exam[]; code: string }) {
  return (
    <div className="mt-5">
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="glass rounded-2xl p-4 flex items-start gap-3">
          <span className="w-9 h-9 rounded-xl bg-arctic-blue/10 text-arctic-blue dark:text-arctic-cyan grid place-items-center shrink-0"><BookOpen className="w-4.5 h-4.5" /></span>
          <div><div className="text-sm font-semibold">Réviser</div><div className="text-xs text-neutral-400">Sans chrono. Correction détaillée + IA à chaque question.</div></div>
        </div>
        <div className="glass rounded-2xl p-4 flex items-start gap-3">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-arctic-cyan to-arctic-blue text-white grid place-items-center shrink-0"><Timer className="w-4.5 h-4.5" /></span>
          <div><div className="text-sm font-semibold">Examen blanc</div><div className="text-xs text-neutral-400">Chronométré comme le jour J. Noté /20, compte pour le classement.</div></div>
        </div>
      </div>
      {exams.length === 0 ? (
        <Empty text="Les annales de cette matière arrivent très bientôt." />
      ) : (
        <div className="mt-4 space-y-2.5">
          {exams.map((e) => (
            <div key={e.id} className="glass rounded-2xl p-4 flex items-center justify-between gap-3">
              <div className="min-w-0 flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] grid place-items-center shrink-0 text-neutral-500"><FileText className="w-4 h-4" /></span>
                <div className="min-w-0">
                  <div className="font-semibold text-sm tracking-tight">
                    {e.exam_type === "national" ? "National" : e.exam_type === "regional" ? "Régional" : "Blanc"} {e.year}
                  </div>
                  <div className="text-[11px] text-neutral-400 capitalize truncate">Session {e.session}{e.duration_minutes ? ` · ${Math.round(e.duration_minutes / 60)}h` : ""}{e.exam_type === "blanc" && e.title ? ` · ${e.title}` : ""}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link href={`/dashboard/examens/session?exam=${e.id}&mode=revise`} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full bg-arctic-blue/10 text-arctic-blue dark:text-arctic-cyan hover:bg-arctic-blue/20 transition">
                  <BookOpen className="w-3.5 h-3.5" /> Réviser
                </Link>
                <Link href={`/dashboard/examens/session?exam=${e.id}&mode=exam`} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white hover:brightness-105 transition">
                  <Timer className="w-3.5 h-3.5" /> Examen
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="mt-5 glass rounded-3xl p-10 text-center text-sm text-neutral-400">{text}</div>;
}
