"use client";

/**
 * Préparation — one matière as ONE path (no tabs).
 *   Header   : subject ring (notions maîtrisées / total), the 4-level summary, ONE « Continuer » CTA
 *              (next notion not yet maîtrisée, starting from the last chapter worked) + révision/erreurs.
 *   Parcours : dept → unit trays → chapter cards. A chapter card shows one mark per notion; opened,
 *              it lists its notions, then « Valider le chapitre » (its séries + tout le chapitre +
 *              problèmes type BAC + revoir le cours). Unit séries close their unit tray.
 *   Fin      : « Séries BAC » (mixtes / séries du prof) and Examens (locked « Bientôt » while
 *              FEATURES.examEngine is false → <ExamsSoonPanel>).
 * Route: /dashboard/examens/preparation/<subjectCode>?chapter=<id>&d=<dept>   (legacy ?mode=series|examens still honoured)
 */
import { Suspense, createElement, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { useQueryState } from "@/lib/use-query-state";
import { useAccess } from "@/lib/use-access";
import { subjectTheme, type SubjectTheme } from "@/config/subjects";
import { subjectIcon, SubjectName } from "@/components/subject-pad";
import { LockBadge } from "@/components/dashboard/paywall";
import { SoonPill, ExamsSoonPanel } from "@/components/prep/exams-soon";
import { CARD, Tray, Ring, LevelMark, LevelLegend } from "@/components/prep/ui";
import { FEATURES, PREP_GOALS } from "@/config";
import { groupByNotion, notionLabel, OTHER_NOTIONS } from "@/lib/notions";
import {
  loadStudentCtx, loadChapters, loadBank, loadSeries, loadSeriesProgress, loadMastery, loadLatestAttempts,
  loadSubjectNotions, loadPrepStats, notionLevel, LEVELS, prepRoutes, DIFF_LABEL, KIND_LABEL, type Level,
  type StudentCtx, type PrepChapter, type BankQ, type Serie, type SerieProgress, type ChapterMastery, type PrepStats,
} from "@/lib/prep";
import {
  ChevronLeft, ChevronDown, ChevronRight, Loader2, Lock, Play, BookOpen, Swords, Layers, CheckCircle2,
  Brain, NotebookPen, Timer, FileText,
} from "lucide-react";

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
  const t = subjectTheme(code);

  const [ctx, setCtx] = useState<StudentCtx | null>(null);
  const [loading, setLoading] = useState(true);
  const [openCh, setOpenCh] = useState<string | null>(null);
  const [dept, setDept] = useState("");
  const [soonOpen, setSoonOpen] = useState(false);

  const [chapters, setChapters] = useState<PrepChapter[]>([]);
  const [bank, setBank] = useState<BankQ[]>([]);
  const [series, setSeries] = useState<Serie[]>([]);
  const [sProg, setSProg] = useState<Map<string, SerieProgress>>(new Map());
  const [exams, setExams] = useState<Exam[]>([]);
  const [mastery, setMastery] = useState<Map<string, ChapterMastery>>(new Map());
  const [heads, setHeads] = useState<Map<string, { notion: string; lessonId: string }[]>>(new Map());
  const [latest, setLatest] = useState<Map<string, boolean>>(new Map());
  const [stats, setStats] = useState<PrepStats | null>(null);

  const subject = ctx?.subjectsByCode.get(code) ?? null;

  // URL ⇄ state: open chapter + department (replace in place → Back/refresh reopen this view).
  useEffect(() => {
    if (!ctx) return;
    q.set({ mode: null, chapter: openCh, d: dept || null }, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx, openCh, dept]);

  useEffect(() => {
    (async () => {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get("mode") === "examens") setSoonOpen(!FEATURES.examEngine);
      if (sp.get("chapter")) setOpenCh(sp.get("chapter"));
      if (sp.get("d")) setDept(sp.get("d")!);
      const c = await loadStudentCtx(supabase);
      setCtx(c);
      if (!c?.levelId || !c.subjectsByCode.get(code)) setLoading(false);
    })();
  }, [supabase, code]);

  useEffect(() => {
    if (!ctx?.levelId || !subject) return;
    let live = true;
    (async () => {
      setLoading(true);
      const filiere = ctx.ownTrack; // own filière only
      const trackId = filiere ? ctx.trackIdByCode.get(filiere) ?? null : null;
      const chs = await loadChapters(supabase, ctx.levelId!, subject.id, trackId, filiere);
      const ids = chs.map((c) => c.id);
      const [b, se, m, hd, ps, { data: ex }] = await Promise.all([
        loadBank(supabase, ids),
        loadSeries(supabase, ctx.levelId!, subject.id, trackId),
        loadMastery(supabase, ids),
        loadSubjectNotions(supabase, ids),
        loadPrepStats(supabase).catch(() => null),
        supabase.from("exams").select("id, year, session, exam_type, duration_minutes, title, track_id")
          .eq("level_id", ctx.levelId!).eq("subject_id", subject.id).order("year", { ascending: false }),
      ]);
      const [sp, lt] = await Promise.all([
        loadSeriesProgress(supabase, se.map((s) => s.id)),
        loadLatestAttempts(supabase, b.questions.map((x) => x.id)),
      ]);
      if (!live) return;
      setChapters(chs); setBank(b.questions); setMastery(m); setHeads(hd); setLatest(lt); setStats(ps); setSProg(sp);
      setSeries(se.filter((x) => !x.chapter_id || chs.some((c) => c.id === x.chapter_id)));
      setExams(FEATURES.examEngine ? ((ex ?? []) as Exam[]).filter((e) => (e.track_id === trackId || e.track_id == null) && !b.bankExamIds.has(e.id)) : []);
      setLoading(false);
      const sq = new URLSearchParams(window.location.search);
      const target = sq.get("mode") === "series" ? "series-bac" : sq.get("chapter") ? `ch-${sq.get("chapter")}` : null;
      if (target) setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    })();
    return () => { live = false; };
  }, [ctx, subject, supabase]);

  /* ----------------------------- derived ----------------------------- */
  const qByCh = useMemo(() => {
    const m = new Map<string, BankQ[]>();
    for (const x of bank) { const a = m.get(x.chapter_id) ?? []; a.push(x); m.set(x.chapter_id, a); }
    return m;
  }, [bank]);

  const path = useMemo(() => chapters.filter((c) => (qByCh.get(c.id)?.length ?? 0) > 0), [chapters, qByCh]);

  // Notions of every chapter with the student's level — same resolver as the cours funnels and the runner.
  const notionsByCh = useMemo(() => {
    const out = new Map<string, NotionRow[]>();
    for (const c of path) {
      const items = qByCh.get(c.id) ?? [];
      const groups = groupByNotion(heads.get(c.id) ?? [], items).filter((g) => g.items.length > 0);
      out.set(c.id, groups.map((g) => {
        const r = {
          notion: g.notion, total: g.items.length,
          done: g.items.filter((x) => latest.has(x.id)).length,
          correct: g.items.filter((x) => latest.get(x.id) === true).length,
          probTotal: g.items.filter((x) => x.kind === "probleme").length,
          probCorrect: g.items.filter((x) => x.kind === "probleme" && latest.get(x.id) === true).length,
        };
        return { ...r, level: notionLevel(r) };
      }));
    }
    return out;
  }, [path, qByCh, heads, latest]);

  const summary = useMemo(() => {
    const byLevel = [0, 0, 0, 0, 0];
    for (const rows of notionsByCh.values()) for (const r of rows) byLevel[r.level]++;
    const total = byLevel.reduce((a, b) => a + b, 0);
    const mastered = byLevel[3] + byLevel[4];
    return { byLevel, total, mastered, pct: total ? Math.round((mastered / total) * 100) : 0 };
  }, [notionsByCh]);

  const firstId = path[0]?.id;
  const lockedCh = (id: string | null) => access.isDemo && id !== firstId;

  // ONE next step: from the last chapter worked (else the first), the first notion not yet maîtrisée.
  const next = useMemo(() => {
    if (!path.length) return null;
    let best: ChapterMastery | null = null;
    for (const m of mastery.values()) if (m.last_practiced_at && (!best || m.last_practiced_at > (best.last_practiced_at ?? ""))) best = m;
    const start = Math.max(0, best ? path.findIndex((c) => c.id === best!.chapter_id) : 0);
    for (let k = 0; k < path.length; k++) {
      const ch = path[(start + k) % path.length];
      if (lockedCh(ch.id)) continue;
      const r = (notionsByCh.get(ch.id) ?? []).find((x) => x.level < 3);
      if (r) return { ch, r, resumed: !!best };
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, mastery, notionsByCh, access.isDemo]);

  const due = stats?.due_by_subject[code] ?? 0;
  const errs = stats?.errors_by_subject[code] ?? 0;

  // séries: in their chapter, in their unit tray, or in « Séries BAC »
  const units = new Set(path.map((c) => c.unit).filter(Boolean) as string[]);
  const serieByCh = (id: string) => series.filter((s) => s.chapter_id === id);
  const serieByUnit = (u: string) => series.filter((s) => !s.chapter_id && s.kind === "unite" && s.unit === u);
  const bacSeries = series.filter((s) => !s.chapter_id && !(s.kind === "unite" && s.unit && units.has(s.unit)));
  const seriesDone = series.filter((s) => sProg.get(s.id)?.completed_at).length;

  if (!loading && !subject) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <BackLink />
        <div className={`mt-6 ${CARD} p-10 text-center text-neutral-400`}>Matière introuvable.</div>
      </div>
    );
  }

  const toggle = (id: string) => setOpenCh((cur) => (cur === id ? null : id));

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8 fade-up">
      <div>
        <BackLink />

        {/* ---------------- header ---------------- */}
        <div className={`mt-3 ${CARD} p-5 sm:p-6`}>
          <div className="flex items-center gap-4">
            <Ring pct={summary.pct} size={64} stroke={5} className={t.text}>{createElement(subjectIcon(code), { className: "w-6 h-6" })}</Ring>
            <div className="flex-1 min-w-0">
              <SubjectName name={subject?.name ?? ""} swash={false} sizeClass="text-2xl" />
              <div className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                {loading ? "Chargement…" : summary.total ? `${summary.mastered}/${summary.total} notions maîtrisées · ${summary.pct} %` : "Le contenu arrive très bientôt."}
              </div>
            </div>
          </div>

          {!loading && summary.total > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-1.5">
              {([0, 1, 2, 3] as Level[]).map((l) => (
                <div key={l} className="rounded-xl bg-black/[0.035] dark:bg-white/[0.04] px-2.5 py-2">
                  <div className={`flex items-center gap-1.5 ${t.text}`}><LevelMark level={l} size={12} /><span className="text-base font-bold tabular-nums text-neutral-900 dark:text-white">{l === 3 ? summary.byLevel[3] + summary.byLevel[4] : summary.byLevel[l]}</span></div>
                  <div className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400 truncate">{LEVELS[l].label}</div>
                </div>
              ))}
            </div>
          )}

          {next && (
            <Link href={prepRoutes.notion(next.ch.id, next.r.notion)}
              className="mt-4 group flex items-center gap-3 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] p-3 hover:border-black/[0.14] dark:hover:border-white/[0.16] transition">
              <span className={`w-10 h-10 rounded-xl ${t.bar} text-white grid place-items-center shrink-0`}><Play className="w-4 h-4 fill-current" /></span>
              <div className="flex-1 min-w-0">
                <div className={`text-[11px] font-bold uppercase tracking-wider ${t.text}`}>{next.resumed ? "Continuer" : "Commencer"}</div>
                <div dir="auto" className="text-sm font-semibold truncate">{notionLabel(next.r.notion)}</div>
                <div dir="auto" className="text-xs text-neutral-400 truncate">{next.ch.name} · {LEVELS[next.r.level].label}</div>
              </div>
              <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:translate-x-0.5 transition shrink-0" />
            </Link>
          )}

          {(due > 0 || errs > 0) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {due > 0 && <Link href={prepRoutes.review(code)} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-black/[0.05] dark:bg-white/[0.07] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] transition"><Brain className="w-3.5 h-3.5" /> À réviser · {due}</Link>}
              {errs > 0 && <Link href={prepRoutes.errors(code)} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-black/[0.05] dark:bg-white/[0.07] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] transition"><NotebookPen className="w-3.5 h-3.5" /> Mes erreurs · {errs}</Link>}
            </div>
          )}
        </div>
      </div>

      {/* ---------------- parcours ---------------- */}
      {loading ? (
        <div className="grid place-items-center h-40 text-neutral-400"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : path.length === 0 ? (
        <div className={`${CARD} p-10 text-center text-sm text-neutral-400`}>Les exercices de cette matière arrivent très bientôt.</div>
      ) : (
        <Parcours path={path} dept={dept} setDept={setDept} openCh={openCh} t={t}
          renderUnit={(unit, items) => (
            <Tray key={unit || "_"} title={unit || undefined}
              meta={`${items.reduce((a, c) => a + (notionsByCh.get(c.id) ?? []).filter((r) => r.level >= 3).length, 0)}/${items.reduce((a, c) => a + (notionsByCh.get(c.id)?.length ?? 0), 0)} notions maîtrisées`}>
              {items.map((c) => (
                <ChapterCard key={c.id} c={c} num={path.indexOf(c) + 1} t={t} open={openCh === c.id} locked={lockedCh(c.id)}
                  rows={notionsByCh.get(c.id) ?? []} items={qByCh.get(c.id) ?? []} pct={mastery.get(c.id)?.mastery_pct ?? null}
                  series={serieByCh(c.id)} prog={sProg} onToggle={() => toggle(c.id)} />
              ))}
              {unit && serieByUnit(unit).map((s) => <SerieRow key={s.id} s={s} p={sProg.get(s.id)} t={t} locked={lockedCh(s.chapter_id)} boxed />)}
            </Tray>
          )} />
      )}

      {!loading && bacSeries.length > 0 && (
        <Tray id="series-bac" title="Séries BAC" meta={`${seriesDone}/${series.length} séries validées`}>
          {bacSeries.map((s) => <SerieRow key={s.id} s={s} p={sProg.get(s.id)} t={t} locked={lockedCh(s.chapter_id)} boxed />)}
        </Tray>
      )}

      {!loading && (
        <Tray title="Examens">
          {FEATURES.examEngine ? (
            exams.length ? exams.map((e) => <ExamRow key={e.id} e={e} />) : <div className={`${CARD} p-6 text-center text-sm text-neutral-400`}>Les annales de cette matière arrivent très bientôt.</div>
          ) : (
            <button onClick={() => setSoonOpen(true)} aria-haspopup="dialog" className={`w-full ${CARD} p-4 flex items-center gap-3 text-left hover:border-black/[0.12] dark:hover:border-white/[0.14] transition`}>
              <span className="w-10 h-10 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] text-neutral-400 grid place-items-center shrink-0"><Lock className="w-4 h-4" /></span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold flex items-center gap-2">Examens chronométrés <SoonPill /></div>
                <div className="text-xs text-neutral-400">Vrais sujets et examens blancs, notés /20.</div>
              </div>
              <ChevronRight className="w-5 h-5 text-neutral-300 dark:text-neutral-600 shrink-0" />
            </button>
          )}
        </Tray>
      )}

      {!loading && summary.total > 0 && <LevelLegend accent={t.text} className="justify-center" />}
      <ExamsSoonPanel open={soonOpen} onClose={() => setSoonOpen(false)} />
    </div>
  );
}

function BackLink() {
  return (
    <Link href={prepRoutes.hub()} className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
      <ChevronLeft className="w-4 h-4" /> Préparation
    </Link>
  );
}

/* ============================== PARCOURS ============================== */
function Parcours({ path, dept, setDept, openCh, t, renderUnit }: {
  path: PrepChapter[]; dept: string; setDept: (d: string) => void; openCh: string | null; t: SubjectTheme;
  renderUnit: (unit: string, items: PrepChapter[]) => ReactNode;
}) {
  const hasDomains = path.some((c) => c.domain);
  if (!hasDomains) return <>{renderUnit("", path)}</>;

  // Departments + units exactly like the Cours
  const seen = new Map<string, number>();
  for (const c of path) { const d = c.domain ?? ""; if (d && !seen.has(d)) seen.set(d, c.unit_pos ?? 0); }
  const DEPTS = [...seen.entries()].sort((a, b) => a[1] - b[1]).map(([key]) => ({ key, label: key.charAt(0).toUpperCase() + key.slice(1) }));
  const openDept = path.find((c) => c.id === openCh)?.domain ?? "";
  const activeDept = DEPTS.some((d) => d.key === dept) ? dept : (openDept || DEPTS[0]?.key || "");
  const inDept = path.filter((c) => (c.domain ?? "") === activeDept).sort((a, b) => (a.unit_pos ?? 0) - (b.unit_pos ?? 0) || a.position - b.position);
  const groups: { unit: string; items: PrepChapter[] }[] = [];
  for (const c of inDept) { const u = c.unit ?? ""; const last = groups[groups.length - 1]; if (last && last.unit === u) last.items.push(c); else groups.push({ unit: u, items: [c] }); }

  return (
    <div className="space-y-6">
      {DEPTS.length > 1 && (
        <div className="flex gap-1 p-1 rounded-2xl bg-black/[0.035] dark:bg-white/[0.03] overflow-x-auto no-scrollbar">
          {DEPTS.map((d) => {
            const on = d.key === activeDept;
            return (
              <button key={d.key} onClick={() => setDept(d.key)}
                className={`flex-1 min-w-max rounded-xl px-4 py-2 text-sm font-semibold transition ${on ? `${CARD} ${t.text}` : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"}`}>
                {d.label}
              </button>
            );
          })}
        </div>
      )}
      {groups.map((g) => renderUnit(g.unit, g.items))}
    </div>
  );
}

function ChapterCard({ c, num, t, open, locked, rows, items, pct, series, prog, onToggle }: {
  c: PrepChapter; num: number; t: SubjectTheme; open: boolean; locked: boolean; rows: NotionRow[]; items: BankQ[]; pct: number | null;
  series: Serie[]; prog: Map<string, SerieProgress>; onToggle: () => void;
}) {
  const router = useRouter();
  const mastered = rows.filter((r) => r.level >= 3).length;
  const done = rows.length > 0 && mastered === rows.length;
  const nProb = new Set(items.filter((x) => x.kind === "probleme").map((x) => x.exercise_id)).size;
  const MAX = 14;

  return (
    <div id={`ch-${c.id}`} className={`${CARD} overflow-hidden scroll-mt-24 ${open ? "shadow-sm" : ""}`}>
      <button onClick={() => (locked ? router.push("/payment") : onToggle())} aria-expanded={open}
        className="w-full p-4 flex items-center gap-3.5 text-left hover:bg-black/[0.015] dark:hover:bg-white/[0.02] transition">
        <span className={`w-9 h-9 rounded-xl grid place-items-center font-bold text-sm shrink-0 ${done ? `${t.bar} text-white` : "bg-black/[0.04] dark:bg-white/[0.06] text-neutral-500 dark:text-neutral-400"}`}>
          {done ? <CheckCircle2 className="w-4.5 h-4.5" /> : num}
        </span>
        <div className="flex-1 min-w-0">
          <div dir="auto" className="font-semibold tracking-tight flex items-center gap-2"><span className="truncate">{c.name}</span>{locked && <LockBadge />}</div>
          <div className={`mt-1.5 flex items-center gap-1 ${t.text}`}>
            {rows.slice(0, MAX).map((r) => <LevelMark key={r.notion} level={r.level} size={12} />)}
            {rows.length > MAX && <span className="text-[11px] text-neutral-400 ml-0.5">+{rows.length - MAX}</span>}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-sm font-bold tabular-nums">{mastered}/{rows.length}</div>
          <div className="text-[10px] text-neutral-400">{pct != null ? `${Math.round(pct)} % réussite` : "notions"}</div>
        </div>
        {locked ? <Lock className="w-4 h-4 text-neutral-400 shrink-0" /> : <ChevronDown className={`w-5 h-5 text-neutral-300 dark:text-neutral-600 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />}
      </button>

      {open && !locked && (
        <div className="border-t border-black/[0.05] dark:border-white/[0.06]">
          <ul className="p-1.5">
            {rows.map((r) => (
              <li key={r.notion}>
                <Link href={prepRoutes.notion(c.id, r.notion)} className="group flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition">
                  <LevelMark level={r.level} size={16} className={t.text} />
                  <div className="flex-1 min-w-0">
                    <div dir="auto" className={`text-sm font-medium truncate ${r.notion === OTHER_NOTIONS ? "italic text-neutral-500" : ""}`}>{notionLabel(r.notion)}</div>
                    <div className="text-[11px] text-neutral-400">
                      {LEVELS[r.level].label} · {r.done ? `${r.correct}/${r.total} réussies` : `${r.total} question${r.total > 1 ? "s" : ""}`}
                      {r.probTotal > 0 && ` · ${r.probTotal} type BAC`}
                    </div>
                  </div>
                  <span className={`text-xs font-semibold ${r.level >= 3 ? "text-neutral-400" : t.text} inline-flex items-center gap-0.5 shrink-0`}>
                    {r.level >= 3 ? "Refaire" : r.done ? "Continuer" : "S'entraîner"} <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Valider le chapitre */}
          <div className="px-4 pb-4 pt-3 bg-black/[0.02] dark:bg-white/[0.02] border-t border-black/[0.05] dark:border-white/[0.06]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Valider le chapitre</div>
            {series.length > 0 && <div className="mt-2 space-y-1.5">{series.map((s) => <SerieRow key={s.id} s={s} p={prog.get(s.id)} t={t} locked={false} />)}</div>}
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href={prepRoutes.chapter(c.id)} className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full ${t.bar} text-white hover:opacity-90 transition`}><Play className="w-3.5 h-3.5 fill-current" /> Tout le chapitre</Link>
              {nProb > 0 && <Link href={prepRoutes.problemes(c.id)} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full border border-black/[0.1] dark:border-white/[0.12] hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition"><Swords className="w-3.5 h-3.5" /> Problèmes type BAC · {nProb}</Link>}
              <Link href={prepRoutes.cours(c.id)} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full border border-black/[0.1] dark:border-white/[0.12] hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition"><BookOpen className="w-3.5 h-3.5" /> Revoir le cours</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================ SÉRIES ================================ */
function SerieRow({ s, p, t, locked, boxed = false }: { s: Serie; p?: SerieProgress; t: SubjectTheme; locked: boolean; boxed?: boolean }) {
  const completed = !!p?.completed_at;
  const best = p ? Math.round(p.best_pct) : null;
  return (
    <Link href={locked ? "/payment" : prepRoutes.serie(s.id)}
      className={`group flex items-center gap-3 p-3 transition ${boxed ? `${CARD} hover:border-black/[0.12] dark:hover:border-white/[0.14]` : "rounded-xl bg-white dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] hover:border-black/[0.12] dark:hover:border-white/[0.14]"}`}>
      <span className={`w-9 h-9 rounded-xl grid place-items-center shrink-0 ${completed ? `${t.bar} text-white` : "bg-black/[0.04] dark:bg-white/[0.06] text-neutral-500"}`}>
        {locked ? <Lock className="w-4 h-4" /> : completed ? <CheckCircle2 className="w-4.5 h-4.5" /> : <Layers className="w-4 h-4" />}
      </span>
      <div className="flex-1 min-w-0">
        <div dir="auto" className="text-sm font-semibold truncate">{s.title}</div>
        <div className="text-[11px] text-neutral-400 truncate">
          {KIND_LABEL[s.kind]} · {s.count} questions · {DIFF_LABEL[s.difficulty]}{best != null ? ` · meilleur ${best} %` : ""}
        </div>
      </div>
      <span className={`text-[11px] font-semibold shrink-0 ${completed ? "text-neutral-400" : t.text}`}>
        {completed ? "Validée" : `${PREP_GOALS.seriesPassPct} % = +${s.xp_bonus} XP`}
      </span>
      <ChevronRight className="w-4 h-4 text-neutral-300 dark:text-neutral-600 group-hover:translate-x-0.5 transition shrink-0" />
    </Link>
  );
}

/* ================================ EXAMENS ================================ */
function ExamRow({ e }: { e: Exam }) {
  return (
    <div className={`${CARD} p-4 flex items-center justify-between gap-3`}>
      <div className="min-w-0 flex items-center gap-3">
        <span className="w-9 h-9 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] grid place-items-center shrink-0 text-neutral-500"><FileText className="w-4 h-4" /></span>
        <div className="min-w-0">
          <div className="font-semibold text-sm tracking-tight">{e.exam_type === "national" ? "National" : e.exam_type === "regional" ? "Régional" : "Blanc"} {e.year}</div>
          <div className="text-[11px] text-neutral-400 capitalize truncate">Session {e.session}{e.duration_minutes ? ` · ${Math.round(e.duration_minutes / 60)}h` : ""}{e.exam_type === "blanc" && e.title ? ` · ${e.title}` : ""}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link href={`/dashboard/examens/session?exam=${e.id}&mode=revise`} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full border border-black/[0.1] dark:border-white/[0.12] hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition"><BookOpen className="w-3.5 h-3.5" /> Réviser</Link>
        <Link href={`/dashboard/examens/session?exam=${e.id}&mode=exam`} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full bg-arctic-blue text-white hover:bg-arctic-deep transition"><Timer className="w-3.5 h-3.5" /> Examen</Link>
      </div>
    </div>
  );
}
