"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { useQueryState } from "@/lib/use-query-state";
import { useAccess } from "@/lib/use-access";
import { LockBadge } from "@/components/dashboard/paywall";
import { ResourceList } from "@/components/resource-panel";
import { Tex } from "@/components/math";
import { CourseContent } from "@/components/course/course-content";
import { FlashcardDeck } from "@/components/course/flashcards";
import { PracticeQuiz, type PQItem } from "@/components/course/practice-quiz";
import { questionsForNotion, groupByNotion, lessonNotions } from "@/lib/notions";
import { prepRoutes, loadPrepStats, type PrepStats } from "@/lib/prep";
import { subjectLines, chapterLines, type MascotLine } from "@/components/mascot/mascot";
import { readTodayTargets } from "@/lib/plan/data";
import { filiereChips, SHORT } from "@/lib/filieres";
import { curriculumFor, type SubjectRef, chapterVisibleFor } from "@/config/curriculum";
import { subjectTheme } from "@/config/subjects";
import { SubjectShelf, BookHeader } from "@/components/course/subject-book";
import {
  ChevronLeft, ChevronRight, BookOpen, Loader2, Check, GraduationCap, FileText, ScrollText, Layers, Lock, Search, Play,
} from "lucide-react";

type Subject = { id: string; code: string; name: string };
type Track = { id: string; code: string; name: string };
type Chapter = { id: string; subject_id: string; track_id: string | null; code?: string | null; name: string; position: number; domain?: string | null; unit?: string | null; unit_pos?: number | null };
type Lesson = { id: string; title: string; body: string | null; resume: string | null; kind: string; difficulty: number | null; duration_min: number | null; bac_frequency: number | null };
type SubjectCard = { id: string; code: string; name: string; coeff: number | null; chapters: Chapter[] };

type Kind = "cours" | "resume";


export default function CoursPage() {
  return <Suspense fallback={null}><CoursPageInner /></Suspense>;
}

/**
 * Navigation state lives in the URL so Back, refresh, the sidebar "last spot"
 * and shared links all reopen the exact view:
 *   f = filière (omitted = own) · s = subject code · d = department
 *   c = chapter id · v = "cours" | "resume" · l = lesson id (cours = one notion per page)
 */
function CoursPageInner() {
  const supabase = createBrowserSupabase();
  const router = useRouter();
  const q = useQueryState();
  const access = useAccess();
  // Le Lauréat: what it can talk about (errors / reviews waiting per subject)
  const [prep, setPrep] = useState<PrepStats | null>(null);
  const [prepReady, setPrepReady] = useState(false); // talk only once we know, so the right line opens first
  useEffect(() => {
    let on = true;
    void loadPrepStats(supabase).then((st) => { if (on) setPrep(st); }).catch(() => {}).finally(() => { if (on) setPrepReady(true); });
    return () => { on = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const hrefWith = (patch: Record<string, string | null>) => {
    const p = new URLSearchParams(q.sp.toString());
    for (const [k, v] of Object.entries(patch)) { if (v == null) p.delete(k); else p.set(k, v); }
    return `/dashboard/cours?${p.toString()}`;
  };
  const subjectTalk = (code: string, name: string, coeff: number | null, pct: number): MascotLine[] => !prepReady ? [] : subjectLines({
    subjectName: name, coeff, last: null, pct,
    errors: prep?.errors_by_subject?.[code] ?? 0, due: prep?.due_by_subject?.[code] ?? 0,
    errorsHref: prepRoutes.errors(code), reviewHref: prepRoutes.review(code),
  });
  const [loading, setLoading] = useState(true);

  const [levelCode, setLevelCode] = useState<string | null>(null);
  const [levelName, setLevelName] = useState("");
  const [ownTrack, setOwnTrack] = useState<string | null>(null);
  const [ownTrackName, setOwnTrackName] = useState("");
  const [subjectsById, setSubjectsById] = useState<Map<string, Subject>>(new Map());
  const [subjectsByCode, setSubjectsByCode] = useState<Map<string, Subject>>(new Map());
  const [trackIdByCode, setTrackIdByCode] = useState<Map<string, string>>(new Map());
  const [trackNameByCode, setTrackNameByCode] = useState<Map<string, string>>(new Map());
  const [chapters, setChapters] = useState<Chapter[]>([]);

  const filiere = q.get("f") ?? ownTrack;
  const dept = q.get("d") ?? "";
  const subjectCode = q.get("s");
  const chapterId = q.get("c");
  const view = q.get("v");
  const lessonParam = q.get("l");

  // reading state
  const [busy, setBusy] = useState(false);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]); // every lesson of the open chapter
  const [coursBodies, setCoursBodies] = useState<string>("");  // raw cours text (for AI résumé)
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [xpFlash, setXpFlash] = useState<string | null>(null);
  const [reachedEnd, setReachedEnd] = useState(false);
  const [aiResume, setAiResume] = useState<string | null>(null);
  const [aiBusy, setAiBusy] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  // study layer: per-lesson mastery progress + flashcards deck
  const [prog, setProg] = useState<Record<string, { m: number; t: number }>>({});
  const [subjResume, setSubjResume] = useState<{ chapterId: string; name: string; done: number; total: number } | null>(null);
  const [chapProg, setChapProg] = useState<Map<string, { done: number; total: number }>>(new Map());
  const [subjIndex, setSubjIndex] = useState<{ id: string; title: string; chapter_id: string }[] | null>(null);
  const [subjQuery, setSubjQuery] = useState("");
  const [chapQuery, setChapQuery] = useState("");
  const [lessonsFor, setLessonsFor] = useState<string | null>(null);
  const [deckOpen, setDeckOpen] = useState(false);
  const [chapterItems, setChapterItems] = useState<PQItem[]>([]);
  const [practiceNotion, setPracticeNotion] = useState<string | null>(null);
  // Cours list = the chapter's notions; Résumé list = each notion's own fiche (or legacy résumé lessons).
  const coursList = useMemo(() => allLessons.filter((l) => l.kind !== "resume"), [allLessons]);
  const resumeList = useMemo(() => {
    const fiches = coursList.filter((l) => (l.resume ?? "").trim());
    return fiches.length ? fiches : allLessons.filter((l) => l.kind === "resume");
  }, [allLessons, coursList]);
  const [lastSpot, setLastSpot] = useState<LastSpot | null>(null);
  const [hitSel, setHitSel] = useState(0);
  const onLessonProg = useCallback((id: string, m: number, t: number) => {
    setProg((p) => (p[id]?.m === m && p[id]?.t === t ? p : { ...p, [id]: { m, t } }));
  }, []);

  // Funnel → only this notion's exercises. Resolve the clicked section heading to
  // the questions tagged with it: (1) maths, via the slug keyword ruleset; (2) other
  // subjects, via phrase overlap between the heading and each question's notion tag.
  // Shared by practiceItems (what the quiz shows) and canPractice (whether to show
  // the CTA at all) so a section with no exercises simply hides its funnel — never
  // the old behaviour of falling back to the entire chapter bank.
  // Same grouping as the Espace de préparation ("Par notion"): exact tag match first,
  // then closest heading by shared words — so a funnel and its prep notion hold the same questions.
  const notionGroups = useMemo(() => {
    const heads = coursList.flatMap((l) => lessonNotions(l.body).map((n) => ({ notion: n, lessonId: l.id })));
    const items = chapterItems.map((q, i) => ({ ...q, id: q.id ?? `i${i}` }));
    return groupByNotion(heads, items);
  }, [coursList, chapterItems]);
  const selectForNotion = useCallback(
    (notion: string): PQItem[] => notionGroups.find((g) => g.notion === notion)?.items ?? questionsForNotion(notion, chapterItems),
    [notionGroups, chapterItems],
  );

  const practiceItems = useMemo<PQItem[]>(() => {
    if (practiceNotion === null) return [];
    const sel = selectForNotion(practiceNotion);
    return sel.length ? sel : chapterItems; // safety net; the CTA is only shown when sel > 0
  }, [practiceNotion, chapterItems, selectForNotion]);

  const canPractice = useCallback((notion: string) => selectForNotion(notion).length > 0, [selectForNotion]);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data: sp } = await supabase
        .from("student_profiles")
        .select("level_id, track_id, levels(code,name), tracks(code,name)")
        .eq("id", user.id)
        .single();
      const lc = (sp?.levels as unknown as { code: string } | null)?.code ?? null;
      const tc = (sp?.tracks as unknown as { code: string } | null)?.code ?? null;
      setLevelCode(lc);
      setLevelName((sp?.levels as unknown as { name: string } | null)?.name ?? "");
      setOwnTrack(tc);
      setOwnTrackName((sp?.tracks as unknown as { name: string } | null)?.name ?? "");
      const levelId = sp?.level_id ?? null;

      const [{ data: subs }, { data: trks }, { data: chs }] = await Promise.all([
        supabase.from("subjects").select("id, code, name"),
        supabase.from("tracks").select("id, code, name"),
        levelId
          ? supabase.from("chapters").select("id, subject_id, track_id, code, name, position, domain, unit, unit_pos").eq("level_id", levelId).order("position")
          : Promise.resolve({ data: [] as Chapter[] }),
      ]);
      const sById = new Map<string, Subject>(); const sByCode = new Map<string, Subject>();
      for (const s of (subs ?? []) as Subject[]) { sById.set(s.id, s); sByCode.set(s.code, s); }
      const tId = new Map<string, string>(); const tName = new Map<string, string>();
      for (const t of (trks ?? []) as Track[]) { tId.set(t.code, t.id); tName.set(t.code, t.name); }
      setSubjectsById(sById); setSubjectsByCode(sByCode);
      setTrackIdByCode(tId); setTrackNameByCode(tName);
      setChapters((chs ?? []) as Chapter[]);
      setLoading(false);

      // Deep link from the Espace de préparation: /dashboard/cours?chapter=<id> opens that cours.
      const deep = new URLSearchParams(window.location.search).get("chapter");
      const dc = deep ? ((chs ?? []) as Chapter[]).find((c) => c.id === deep) : undefined;
      const ds = dc ? sById.get(dc.subject_id) : undefined;
      if (dc && ds) {
        // Legacy ?chapter=<id> → canonical URL (same history entry).
        const trackCode = dc.track_id ? [...tId.entries()].find(([, id]) => id === dc.track_id)?.[0] ?? tc : tc;
        q.set({ chapter: null, f: trackCode && trackCode !== tc ? trackCode : null, s: ds.code, c: dc.id, v: "cours" }, { replace: true });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const is2bac = levelCode === "2bac";

  const chips = useMemo(
    () => (is2bac ? filiereChips(ownTrack, trackIdByCode, trackNameByCode) : []),
    [is2bac, ownTrack, trackIdByCode, trackNameByCode],
  );

  // Subjects for the selected filière (curriculum order), each with its chapters.
  const subjectCards = useMemo<SubjectCard[]>(() => {
    const f = filiere ?? ownTrack;
    if (!f || !levelCode) return [];
    const trackId = trackIdByCode.get(f) ?? null;
    const chaptersFor = (subjId: string) =>
      chapters
        .filter((c) => c.subject_id === subjId && (c.track_id === trackId || c.track_id == null) && chapterVisibleFor(f, c.code))
        .sort((a, b) => a.position - b.position);
    const ref: SubjectRef[] | null = curriculumFor(levelCode, f);
    if (ref) {
      return ref.map((r) => {
        const s = subjectsByCode.get(r.code);
        if (!s) return null;
        return { id: s.id, code: s.code, name: s.name, coeff: r.coeff, chapters: chaptersFor(s.id) };
      }).filter(Boolean) as SubjectCard[];
    }
    const seen = new Set<string>();
    const out: SubjectCard[] = [];
    for (const c of chapters) {
      if (trackId && c.track_id && c.track_id !== trackId) continue;
      if (seen.has(c.subject_id)) continue;
      seen.add(c.subject_id);
      const s = subjectsById.get(c.subject_id);
      if (s) out.push({ id: s.id, code: s.code, name: s.name, coeff: null, chapters: chaptersFor(s.id) });
    }
    return out.sort((a, b) => a.name.localeCompare(b.name));
  }, [filiere, ownTrack, levelCode, trackIdByCode, chapters, subjectsByCode, subjectsById]);

  const subject = useMemo(() => subjectCards.find((c) => c.code === subjectCode) ?? null, [subjectCards, subjectCode]);
  // Demo: only the 1st chapter of a subject opens — also when the URL is typed or shared.
  const chapter = useMemo(() => {
    const c = subject?.chapters.find((x) => x.id === chapterId) ?? null;
    if (c && access.isDemo && c.id !== subject?.chapters[0]?.id) return null;
    return c;
  }, [subject, chapterId, access.isDemo]);
  const kind: Kind | null = chapter && (view === "cours" || view === "resume") ? view : null;

  // URL → lessons: load whenever the open chapter / view changes (also on Back/refresh).
  const lessons = kind === "resume" ? resumeList : coursList;
  const curLesson = chapter && lessonParam && lessonsFor === chapter.id ? lessons.find((l) => l.id === lessonParam) ?? null : null;

  // URL → lessons: load once per chapter (Cours ⇄ Résumé switches without reloading).
  useEffect(() => {
    if (!chapter) { setAllLessons([]); setLessonsFor(null); return; }
    void loadLessons(chapter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter?.id]);

  // « Reprendre » = the exact cours / résumé open last time in this subject (per device).
  useEffect(() => { setLastSpot(subject ? readLast(subject.code) : null); }, [subject?.code]);
  // Plan BAC: what today's plan points at (quiet « Aujourd'hui » marks)
  // (read once on the client; the page renders its loading state on the server, so no mismatch)
  const [planToday] = useState(() => (typeof window === "undefined" ? null : readTodayTargets()));
  useEffect(() => {
    if (!subject || !chapter || !kind || !curLesson) return;
    const spot: LastSpot = { c: chapter.id, v: kind, l: curLesson.id, title: curLesson.title };
    writeLast(subject.code, spot);
    setLastSpot(spot);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject?.code, chapter?.id, kind, curLesson?.id]);

  // Scroll-spy: the ## notion on screen while reading a cours (drives « S'entraîner » to that exact notion).
  const [notionInView, setNotionInView] = useState<string | null>(null);
  useEffect(() => {
    setNotionInView(null);
    if (kind !== "cours" || !curLesson) return;
    const scroller = document.getElementById("dash-main");
    if (!scroller) return;
    let raf = 0;
    const measure = () => {
      const els = [...scroller.querySelectorAll<HTMLElement>("[data-notion]")];
      const line = scroller.getBoundingClientRect().top + scroller.clientHeight * 0.4;
      let cur: string | null = null;
      for (const el of els) { if (el.getBoundingClientRect().top <= line) cur = el.dataset.notion ?? null; else break; }
      setNotionInView(cur ?? els[0]?.dataset.notion ?? null);
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure); };
    const t = setTimeout(measure, 60);
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => { clearTimeout(t); cancelAnimationFrame(raf); scroller.removeEventListener("scroll", onScroll); };
  }, [kind, curLesson]);
  /** The notion to train on: the one in view if it has questions, else the next one in this cours that does, else any of this cours. */
  const trainNotion = useMemo(() => {
    if (!curLesson) return null;
    const ns = lessonNotions(curLesson.body);
    if (!ns.length) return null;
    const from = Math.max(0, notionInView ? ns.indexOf(notionInView) : 0);
    const order = [...ns.slice(from), ...ns.slice(0, from)];
    return order.find((n) => canPractice(n)) ?? null;
  }, [curLesson, notionInView, canPractice]);

  // new notion → reset "reached the end"
  useEffect(() => { setReachedEnd(false); }, [lessonParam]);
  // leaving a chapter clears its filter
  useEffect(() => { setChapQuery(""); }, [chapter?.id]);

  // Enable "mark as read" only once the student scrolls to the end of the cours.
  useEffect(() => {
    if (kind !== "cours" || !endRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) setReachedEnd(true); },
      { threshold: 0.4 }
    );
    obs.observe(endRef.current);
    return () => obs.disconnect();
  }, [kind, lessons, lessonParam]);

  // subject-resume effect: most-progressed in-progress chapter for the open subject.
  useEffect(() => {
    setSubjResume(null);
    setChapProg(new Map());
    setSubjIndex(null);
    setSubjQuery("");
    if (!subject) return;
    const chapIds = subject.chapters.map((c) => c.id);
    if (chapIds.length === 0) return;
    let cancelled = false;
    (async () => {
      try {
        const { data: les } = await supabase.from("lessons").select("id, chapter_id").in("chapter_id", chapIds);
        const rows = (les ?? []) as { id: string; chapter_id: string }[];
        if (rows.length === 0) return;
        const { data: comp } = await supabase.from("lesson_completions").select("lesson_id").in("lesson_id", rows.map((l) => l.id));
        const done = new Set((comp ?? []).map((r) => r.lesson_id as string));
        const byChap = new Map<string, { total: number; done: number }>();
        for (const l of rows) {
          const cur = byChap.get(l.chapter_id) ?? { total: 0, done: 0 };
          cur.total += 1; if (done.has(l.id)) cur.done += 1;
          byChap.set(l.chapter_id, cur);
        }
        let best: { chapterId: string; name: string; done: number; total: number } | null = null;
        for (const c of subject.chapters) {
          const v = byChap.get(c.id);
          if (!v || v.done === 0 || v.done >= v.total) continue;
          if (!best || v.done / v.total > best.done / best.total) best = { chapterId: c.id, name: c.name, done: v.done, total: v.total };
        }
        if (!cancelled) { setSubjResume(best); setChapProg(byChap); }
      } catch { /* stay in the "new" state */ }
    })();
    return () => { cancelled = true; };
  }, [subject, supabase]);

  // navigation helpers (push = new history entry, so Back returns here)
  const openSubject = (code: string | null) =>
    code ? q.set({ s: code, c: null, v: null, d: null, l: null }) : q.up({ s: null, c: null, v: null, d: null, l: null });
  const openChapter = (c: Chapter | null) => (c ? q.set({ c: c.id, v: null, l: null }) : q.up({ c: null, v: null, l: null }));
  /** Straight from a chapter row / search hit into its cours or résumé (optionally a given notion). */
  const openIn = (c: Chapter, k: Kind, l?: string) => q.set({ c: c.id, v: k, l: l ?? null });
  /** One notion per page (cours or résumé): a new history entry, so Back returns to the previous one. */
  const openLesson = (id: string) => q.set({ v: kind ?? "cours", l: id });
  /** Cours ⇄ Résumé in place: keeps the same notion when it has a résumé, else the nearest following one. */
  const switchKind = (k: Kind) => {
    if ((kind ?? "cours") === k) return;
    const target = k === "resume" ? resumeList : coursList;
    let l: string | null = null;
    if (lessonParam && target.length) {
      if (target.some((x) => x.id === lessonParam)) l = lessonParam;
      else {
        const order = new Map(coursList.map((x, i) => [x.id, i]));
        const ci = order.get(lessonParam) ?? 0;
        l = (target.find((x) => (order.get(x.id) ?? 0) >= ci) ?? target[target.length - 1]).id;
      }
    }
    q.set({ v: k, l }, { replace: true });
  };

  // Chapter numbers restart at 1 in each part (Physique 1…n, Chimie 1…n).
  const chapterNo = useMemo(() => {
    const m = new Map<string, number>();
    if (!subject) return m;
    const byDept = new Map<string, Chapter[]>();
    for (const c of subject.chapters) {
      const d = c.domain ?? "";
      const arr = byDept.get(d) ?? [];
      arr.push(c); byDept.set(d, arr);
    }
    for (const arr of byDept.values()) {
      arr.sort((a, b) => (a.unit_pos ?? 0) - (b.unit_pos ?? 0) || a.position - b.position).forEach((c, i) => m.set(c.id, i + 1));
    }
    return m;
  }, [subject]);

  // Whole-subject search: every cours title of the subject, loaded on first use.
  async function ensureIndex() {
    if (subjIndex || !subject) return;
    const { data } = await supabase.from("lessons").select("id, title, chapter_id, kind, position").in("chapter_id", subject.chapters.map((c) => c.id)).order("position").limit(3000);
    setSubjIndex(((data ?? []) as { id: string; title: string; chapter_id: string; kind: string }[]).filter((l) => l.kind !== "resume"));
  }

  const loadSeq = useRef(0);
  async function loadLessons(c: Chapter) {
    const seq = ++loadSeq.current;
    const stale = () => seq !== loadSeq.current;
    setProg({});
    setBusy(true);
    setAiResume(null);
    setReachedEnd(false);
    const { data } = await supabase
      .from("lessons")
      .select("id, title, body, resume, kind, difficulty, duration_min, bac_frequency")
      .eq("chapter_id", c.id)
      .order("position");
    if (stale()) return;
    const all = (data ?? []) as Lesson[];
    const cours = all.filter((l) => l.kind !== "resume");
    setAllLessons(all);
    setCoursBodies(cours.map((l) => `## ${l.title}\n${l.body ?? ""}`).join("\n\n"));

    // load the chapter's QCU as an interactive practice bank (for the cours funnels)
    const { data: exRows } = await supabase.from("exercises").select("id").eq("chapter_id", c.id);
    const exIds = (exRows ?? []).map((r) => r.id as string);
    if (exIds.length) {
      const { data: qRows } = await supabase.from("questions").select("id, statement, position, notion").in("exercise_id", exIds).order("position");
      const qs = (qRows ?? []) as { id: string; statement: string; notion: string | null }[];
      const qIds = qs.map((q) => q.id);
      const [{ data: oRows }, { data: sRows }] = await Promise.all([
        supabase.from("answer_options").select("question_id, label, is_correct, position").in("question_id", qIds),
        supabase.from("solutions").select("question_id, body").in("question_id", qIds),
      ]);
      const optsByQ = new Map<string, { label: string; correct: boolean; position: number }[]>();
      for (const o of (oRows ?? []) as { question_id: string; label: string; is_correct: boolean; position: number }[]) {
        const a = optsByQ.get(o.question_id) ?? []; a.push({ label: o.label, correct: o.is_correct, position: o.position }); optsByQ.set(o.question_id, a);
      }
      if (stale()) return;
      const solByQ = new Map<string, string>();
      for (const s of (sRows ?? []) as { question_id: string; body: string }[]) solByQ.set(s.question_id, s.body);
      setChapterItems(qs.map((q) => ({
        id: q.id,
        statement: q.statement,
        options: (optsByQ.get(q.id) ?? []).sort((a, b) => a.position - b.position).map((o) => ({ label: o.label, correct: o.correct })),
        solution: solByQ.get(q.id),
        notion: q.notion ?? undefined,
      })));
    } else setChapterItems([]);

    if (stale()) return;
    // read-state of the cours notions
    if (cours.length) {
      const { data: comp } = await supabase
        .from("lesson_completions").select("lesson_id").in("lesson_id", cours.map((l) => l.id));
      if (stale()) return;
      setCompleted(new Set((comp ?? []).map((r) => r.lesson_id as string)));
    } else {
      setCompleted(new Set());
    }
    setLessonsFor(c.id);
    setBusy(false);
  }

  async function markRead(id: string) {
    await supabase.rpc("mark_lesson_read", { p_lesson: id });
    setCompleted((s) => new Set(s).add(id));
    setXpFlash(id);
    setTimeout(() => setXpFlash((x) => (x === id ? null : x)), 2500);
  }

  async function generateResume() {
    if (!chapter || !coursBodies.trim()) return;
    setAiBusy(true);
    setAiResume(null);
    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: subject?.name, chapter: chapter.name, body: coursBodies }),
      });
      const json = await res.json();
      setAiResume(json.text || `${json.error || "Le résumé n'a pas pu être généré."}`);
    } catch {
      setAiResume("Impossible de générer le résumé.");
    }
    setAiBusy(false);
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold tracking-tight">Cours & Résumés</h1>
        <div className="grid place-items-center h-40 text-neutral-400"><Loader2 className="w-6 h-6 animate-spin" /></div>
      </div>
    );
  }

  // ---------- READING VIEW (one cours or one résumé per page) ----------
  if (chapter && curLesson && kind) {
    const isResume = kind === "resume";
    const no = chapterNo.get(chapter.id);
    const deptLabel = chapter.domain ? chapter.domain.charAt(0).toUpperCase() + chapter.domain.slice(1) : null;
    const cur = curLesson;
    const idx = lessons.findIndex((l) => l.id === cur.id);
    const prev = idx > 0 ? lessons[idx - 1] : null;
    const next = idx < lessons.length - 1 ? lessons[idx + 1] : null;
    const doneCount = coursList.filter((l) => completed.has(l.id)).length;
    const unit = isResume ? "résumé" : "cours";
    return (
      <div className="max-w-3xl mx-auto py-8">
        <button onClick={() => q.up({ l: null })} className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
          <ChevronLeft className="w-4 h-4" /> {chapter.name}
        </button>

        <div className="mt-3">
          <BookHeader
            code={subject?.code ?? ""}
            size="sm"
            eyebrow={<>{subject?.name}{deptLabel ? ` · ${deptLabel}` : ""}{no ? ` · Chapitre ${no}` : ""}</>}
            title={<Tex>{cur.title}</Tex>}
            meta={<>{chapter.name}</>}
            progress={coursList.length ? { pct: (doneCount / coursList.length) * 100, label: `${doneCount}/${coursList.length} lus` } : null}
            corner={
              <div className="bh-pager" role="group" aria-label={`${unit} ${idx + 1} sur ${lessons.length}`}>
                <button type="button" disabled={!prev} onClick={() => prev && openLesson(prev.id)} aria-label="Précédent"><ChevronLeft className="w-4 h-4" /></button>
                <span className="tabular-nums">{idx + 1}<span className="opacity-50"> / {lessons.length}</span></span>
                <button type="button" disabled={!next} onClick={() => next && openLesson(next.id)} aria-label="Suivant"><ChevronRight className="w-4 h-4" /></button>
              </div>
            }
          >
            <div className="bh-seg" role="group" aria-label="Cours ou résumé">
              <button type="button" aria-pressed={!isResume} onClick={() => switchKind("cours")}>Cours</button>
              <button type="button" aria-pressed={isResume} onClick={() => switchKind("resume")} disabled={resumeList.length === 0 && !isResume}>Résumé</button>
            </div>
            <button type="button" onClick={() => setDeckOpen(true)} className="bh-btn"><Layers className="w-4 h-4" /> Flashcards</button>
            <button type="button" title={trainNotion ? `S'entraîner sur « ${trainNotion} »` : "S'entraîner sur ce chapitre"}
              onClick={() => router.push(trainNotion ? prepRoutes.notion(chapter.id, trainNotion) : subject ? prepRoutes.subject(subject.code, { f: filiere, mode: "notion", chapter: chapter.id }) : prepRoutes.hub())}
              className="bh-btn min-w-0 max-w-full"><FileText className="w-4 h-4 shrink-0" /> <span className="truncate">S&apos;entraîner{trainNotion ? <> · <Tex>{trainNotion}</Tex></> : ""}</span></button>
          </BookHeader>
        </div>

        {deckOpen && <FlashcardDeck lessons={coursList} currentLessonId={isResume ? null : cur.id} subjectCode={subject?.code ?? ""} chapterName={chapter.name} onClose={() => setDeckOpen(false)} />}
        {practiceNotion !== null && <PracticeQuiz notion={practiceNotion} items={practiceItems} onClose={() => setPracticeNotion(null)} />}

        <div className="mt-5 glass rounded-3xl p-7" key={`${kind}-${cur.id}`}>
          <NotionMeta lesson={cur} />
          {isResume ? (
            <CourseContent body={(cur.resume ?? cur.body) ?? ""} />
          ) : (
            <>
              <CourseContent body={cur.body ?? ""} lessonId={cur.id} onProgress={(m, t) => onLessonProg(cur.id, m, t)} onPractice={chapterItems.length ? (notion) => setPracticeNotion(notion) : undefined} canPractice={canPractice} onTrain={(notion) => router.push(prepRoutes.notion(chapter.id, notion))} />
              <div className="mt-5 pt-4 border-t border-neutral-200/60 dark:border-neutral-800 flex justify-end">
                {completed.has(cur.id) ? (
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-500">
                    {xpFlash === cur.id && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-arctic-blue/15 text-arctic-blue dark:text-arctic-cyan">+15 XP</span>}
                    <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4" /> Lu</span>
                  </span>
                ) : (
                  <button onClick={() => markRead(cur.id)} disabled={!reachedEnd} className="text-sm font-semibold rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-4 py-2 hover:opacity-90 transition disabled:opacity-40">
                    Marquer comme lu
                  </button>
                )}
              </div>
            </>
          )}
        </div>
        <div ref={endRef} className="h-1" />
        {!isResume && !reachedEnd && !completed.has(cur.id) && <p className="text-center text-xs text-neutral-400">Fais défiler jusqu&apos;en bas pour valider ta lecture.</p>}

        {/* compact Précédent / Suivant */}
        <nav className="mt-5 flex items-center justify-between gap-3" aria-label="Navigation dans le chapitre">
          {prev ? (
            <button type="button" onClick={() => openLesson(prev.id)} className="pager-btn">
              <ChevronLeft className="w-4 h-4 shrink-0" /> <span className="truncate max-w-[34vw] sm:max-w-[220px]"><Tex>{prev.title}</Tex></span>
            </button>
          ) : <span />}
          {next ? (
            <button type="button" onClick={() => openLesson(next.id)} className="pager-btn pager-btn-next">
              <span className="opacity-60 shrink-0">Suivant</span> <span className="truncate max-w-[34vw] sm:max-w-[220px]"><Tex>{next.title}</Tex></span> <ChevronRight className="w-4 h-4 shrink-0" />
            </button>
          ) : !isResume && resumeList.length > 0 ? (
            <button type="button" onClick={() => switchKind("resume")} className="pager-btn pager-btn-next">
              <span className="opacity-60">Fin du chapitre</span> Résumé <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button type="button" onClick={() => q.up({ l: null })} className="pager-btn pager-btn-next">
              Sommaire du chapitre <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </nav>
        <ResourceList scope="chapter" scopeKey={chapter.id} title="Ressources du chapitre" />
      </div>
    );
  }

  // ---------- CHAPTER → SOMMAIRE (its cours, or its résumés: one page each) ----------
  if (chapter) {
    const listKind: Kind = kind ?? "cours";
    const isResume = listKind === "resume";
    const st = subjectTheme(subject?.code);
    const no = chapterNo.get(chapter.id);
    const deptLabel = chapter.domain ? chapter.domain.charAt(0).toUpperCase() + chapter.domain.slice(1) : null;
    const loaded = lessonsFor === chapter.id;
    const doneCount = coursList.filter((l) => completed.has(l.id)).length;
    const firstUnread = coursList.find((l) => !completed.has(l.id));
    const here = lastSpot && lastSpot.c === chapter.id ? lastSpot : null;
    const words = norm(chapQuery).split(/\s+/).filter(Boolean);
    const shown = lessons.map((l, i) => ({ l, i })).filter(({ l }) => words.every((w) => norm(l.title).includes(w)));
    return (
      <div className="max-w-3xl mx-auto py-8">
        <button onClick={() => openChapter(null)} className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
          <ChevronLeft className="w-4 h-4" /> {subject?.name}
        </button>
        <div className="mt-3">
          <BookHeader
            code={subject?.code ?? ""}
            eyebrow={<>{subject?.name}{deptLabel ? ` · ${deptLabel}` : ""}{no ? ` · Chapitre ${no}` : ""}</>}
            title={chapter.name}
            meta={coursList.length ? `${coursList.length} cours · ${doneCount} lu${doneCount > 1 ? "s" : ""}${resumeList.length ? ` · ${resumeList.length} résumé${resumeList.length > 1 ? "s" : ""}` : ""}` : undefined}
            progress={coursList.length ? { pct: (doneCount / coursList.length) * 100, label: `${Math.round((doneCount / coursList.length) * 100)} %` } : null}
            mascot={loaded && prepReady ? [
              ...chapterLines({ chapterName: chapter.name, total: coursList.length, done: doneCount, next: null, hasResume: resumeList.length > 0, resumeHref: hrefWith({ v: "resume", l: resumeList[0]?.id ?? null }) }),
              ...(subject ? subjectTalk(subject.code, subject.name, null, 1) : []),
            ] : []}
          >
            <div className="bh-seg" role="group" aria-label="Cours ou résumé">
              <button type="button" aria-pressed={!isResume} onClick={() => switchKind("cours")}>Cours</button>
              <button type="button" aria-pressed={isResume} onClick={() => switchKind("resume")}>Résumé</button>
            </div>
            {here ? (
              <button type="button" onClick={() => q.set({ v: here.v, l: here.l })} className="bh-btn bh-btn-primary min-w-0">
                <Play className="w-4 h-4 shrink-0" /> <span className="truncate max-w-[220px]">Reprendre · <Tex>{here.title}</Tex></span>
              </button>
            ) : coursList.length > 0 && (
              <button type="button" onClick={() => q.set({ v: "cours", l: (firstUnread ?? coursList[0]).id })} className="bh-btn bh-btn-primary">
                <Play className="w-4 h-4" /> {doneCount === 0 ? "Commencer" : firstUnread ? "Continuer" : "Relire"}
              </button>
            )}
            {coursList.length > 0 && <button type="button" onClick={() => setDeckOpen(true)} className="bh-btn"><Layers className="w-4 h-4" /> Flashcards</button>}
            <button type="button" onClick={() => router.push(subject ? prepRoutes.subject(subject.code, { f: filiere, mode: "notion", chapter: chapter.id }) : prepRoutes.hub())} className="bh-btn"><FileText className="w-4 h-4" /> S&apos;entraîner</button>
          </BookHeader>
        </div>
        {deckOpen && <FlashcardDeck lessons={coursList} subjectCode={subject?.code ?? ""} chapterName={chapter.name} onClose={() => setDeckOpen(false)} />}

        {!loaded ? (
          <div className="grid place-items-center h-40 text-neutral-400"><Loader2 className="w-6 h-6 animate-spin" /></div>
        ) : isResume && lessons.length === 0 ? (
          // no authored résumé: instant AI résumé of the whole chapter
          <div className="mt-6">
            {!aiResume && (
              <div className="glass rounded-3xl p-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-arctic-blue/10 text-arctic-blue dark:text-arctic-cyan grid place-items-center mx-auto"><ScrollText className="w-5 h-5" /></div>
                <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
                  Aucun résumé rédigé pour ce chapitre. L&apos;IA Bac-up peut t&apos;en générer un instantanément à partir du cours.
                </p>
                <button onClick={generateResume} disabled={aiBusy || !coursBodies.trim()}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-5 py-2.5 hover:opacity-90 transition disabled:opacity-50">
                  {aiBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScrollText className="w-4 h-4" />}
                  {coursBodies.trim() ? "Générer le résumé" : "Cours indisponible"}
                </button>
              </div>
            )}
            {aiResume && (
              <div className="glass rounded-3xl p-7">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-arctic-blue dark:text-arctic-cyan mb-3"><ScrollText className="w-3.5 h-3.5" /> Résumé généré par Bac-up</div>
                <div className="text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-200 whitespace-pre-wrap"><Tex>{aiResume}</Tex></div>
              </div>
            )}
          </div>
        ) : lessons.length === 0 ? (
          <Empty text="Le cours de ce chapitre arrive bientôt." />
        ) : (
          <div className="mt-6">
            {lessons.length > 5 && (
              <label className="relative block mb-3">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input value={chapQuery} onChange={(e) => setChapQuery(e.target.value)} placeholder={`Chercher un ${isResume ? "résumé" : "cours"} du chapitre…`} aria-label="Chercher dans le chapitre"
                  className="w-full h-11 rounded-xl glass pl-10 pr-3 text-[16px] md:text-sm outline-none focus:ring-2 focus:ring-arctic-blue/40" />
              </label>
            )}
            <div className="glass rounded-2xl p-1.5">
              {shown.length === 0 && <div className="px-4 py-6 text-sm text-neutral-400">Aucun {isResume ? "résumé" : "cours"} ne correspond à « {chapQuery} ».</div>}
              {shown.map(({ l, i }) => {
                const done = completed.has(l.id);
                const isLast = here?.l === l.id && here.v === listKind;
                return (
                  <button key={l.id} type="button" onClick={() => openLesson(l.id)}
                    className="w-full flex items-center gap-4 rounded-xl px-3.5 py-3 text-left hover:bg-black/[0.035] dark:hover:bg-white/[0.05] transition">
                    <span className={`w-8 h-8 rounded-lg grid place-items-center tabular-nums text-sm font-bold shrink-0 ${st.soft} ${st.text}`}>{i + 1}</span>
                    <span className="flex-1 min-w-0">
                      <span dir="auto" className="block font-medium tracking-tight truncate"><Tex>{l.title}</Tex></span>
                      {(l.duration_min != null || l.difficulty != null) && (
                        <span className="mt-1 flex items-center gap-2 text-[12px] text-neutral-400">
                          {l.difficulty ? <DiffPill d={l.difficulty} /> : null}
                          {l.duration_min != null && <span className="tabular-nums">≈ {l.duration_min} min</span>}
                        </span>
                      )}
                    </span>
                    {isLast ? (
                      <span className="text-[12px] font-semibold text-arctic-blue dark:text-arctic-cyan shrink-0">Tu t&apos;es arrêté ici</span>
                    ) : !isResume && !done && planToday?.lessons.has(l.id) ? (
                      <span className="plan-mark shrink-0">Aujourd&apos;hui</span>
                    ) : !isResume && done ? (
                      <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-emerald-500 shrink-0"><Check className="w-4 h-4" /> Lu</span>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-neutral-300 dark:text-neutral-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---------- SUBJECT → CHAPTERS ----------
  if (subject) {
    const t = subjectTheme(subject.code);
    const totals = [...chapProg.values()].reduce((a, v) => ({ done: a.done + v.done, total: a.total + v.total }), { done: 0, total: 0 });
    const subjPct = totals.total ? (totals.done / totals.total) * 100 : 0;

    // Departments derived from the data (Physique/Chimie, or Géologie/Biologie…), ordered by unit_pos.
    const seen = new Map<string, number>();
    for (const c of subject.chapters) {
      const d = c.domain ?? "";
      if (d && !seen.has(d)) seen.set(d, c.unit_pos ?? 0);
    }
    const DEPTS = [...seen.entries()].sort((a, b) => a[1] - b[1]).map(([key]) => ({ key, label: key.charAt(0).toUpperCase() + key.slice(1) }));
    const hasDomains = DEPTS.length > 0;
    const activeDept = DEPTS.some((d) => d.key === dept) ? dept : (DEPTS[0]?.key ?? "");

    const firstId = subject.chapters[0]?.id;             // demo: only the very 1st chapter is open
    const lockedFor = (c: Chapter) => access.isDemo && c.id !== firstId;

    // Reprendre = the exact cours/résumé the student had open last time in this subject.
    const lastChapter = lastSpot ? subject.chapters.find((c) => c.id === lastSpot.c) ?? null : null;
    const fallbackChapter = !lastChapter && subjResume ? subject.chapters.find((c) => c.id === subjResume.chapterId) ?? null : null;

    // Smart search, in curriculum order: part → chapter number → cours order. Words must start a word
    // (« l » finds « Limites », « logarithme »… not every l), longer words also match inside.
    const groups = searchSubject(subjQuery, subject.chapters, subjIndex ?? [], DEPTS.map((d) => d.key), chapterNo);
    const flat = groups.flatMap((g) => [{ chapter: g.chapter, lessonId: null as string | null }, ...g.lessons.map((l) => ({ chapter: g.chapter, lessonId: l.id as string | null }))]);
    const pick = (i: number) => {
      const it = flat[i]; if (!it) return;
      if (lockedFor(it.chapter)) { router.push("/payment"); return; }
      setSubjQuery("");
      if (it.lessonId) openIn(it.chapter, "cours", it.lessonId); else openChapter(it.chapter);
    };
    let flatIdx = -1;

    const Row = (c: Chapter) => {
      const locked = lockedFor(c);
      const pr = chapProg.get(c.id);
      const pct = pr && pr.total ? pr.done / pr.total : 0;
      const go = (k?: Kind) => (locked ? router.push("/payment") : openIn(c, k ?? "cours"));
      return (
        <div key={c.id} role="button" tabIndex={0} onClick={() => go()} onKeyDown={(e) => { if (e.key === "Enter") go(); }}
          className={`group w-full glass rounded-2xl p-3.5 sm:p-4 flex items-center gap-3.5 sm:gap-4 text-left cursor-pointer transition ${locked ? "opacity-80 hover:opacity-100" : "hover:bg-black/[0.015] dark:hover:bg-white/[0.025]"}`}>
          <span className="relative w-10 h-10 shrink-0 grid place-items-center" aria-hidden>
            <svg viewBox="0 0 40 40" className="absolute inset-0 w-10 h-10 -rotate-90">
              <circle cx="20" cy="20" r="17" fill="none" className="stroke-black/[0.07] dark:stroke-white/[0.09]" strokeWidth="3" />
              {pct > 0 && <circle cx="20" cy="20" r="17" fill="none" className={t.text} stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${pct * 106.8} 106.8`} />}
            </svg>
            <span className={`text-sm font-bold tabular-nums ${t.text}`}>{chapterNo.get(c.id)}</span>
          </span>
          <div className="flex-1 min-w-0">
            <div dir="auto" className="font-semibold tracking-tight flex items-center gap-2"><span className="truncate">{c.name}</span>{locked && <LockBadge />}</div>
            <div className="mt-0.5 text-[12px] text-neutral-400 tabular-nums">
              {pr ? `${pr.total} cours${pr.done ? ` · ${pr.done} lu${pr.done > 1 ? "s" : ""}` : ""}` : "Cours · Résumé"}
              {lastSpot?.c === c.id && <span className="text-arctic-blue dark:text-arctic-cyan"> · en cours</span>}
              {planToday?.chapters.has(c.id) && <span className="plan-mark ml-2">Aujourd&apos;hui</span>}
            </div>
          </div>
          {locked ? <Lock className="w-4 h-4 text-neutral-400 shrink-0" /> : (
            <div className="flex items-center gap-1.5 shrink-0">
              <button type="button" onClick={(e) => { e.stopPropagation(); go("cours"); }}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12.5px] font-semibold chip"><BookOpen className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Cours</span></button>
              <button type="button" onClick={(e) => { e.stopPropagation(); go("resume"); }}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12.5px] font-semibold chip"><ScrollText className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Résumé</span></button>
            </div>
          )}
        </div>
      );
    };

    const list = hasDomains
      ? subject.chapters.filter((c) => (c.domain ?? "") === activeDept).sort((a, b) => (a.unit_pos ?? 0) - (b.unit_pos ?? 0) || a.position - b.position)
      : subject.chapters;
    const units: { unit: string; items: Chapter[] }[] = [];
    for (const c of list) {
      const u = hasDomains ? (c.unit ?? "Autres") : "";
      const last = units[units.length - 1];
      if (last && last.unit === u) last.items.push(c);
      else units.push({ unit: u, items: [c] });
    }

    return (
      <div className="max-w-3xl mx-auto py-8">
        <button onClick={() => openSubject(null)} className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
          <ChevronLeft className="w-4 h-4" /> {is2bac ? `Retour · ${SHORT[filiere ?? ""] ?? "matières"}` : "Toutes les matières"}
        </button>
        <div className="mt-3">
          <BookHeader
            code={subject.code}
            eyebrow={<>{subject.coeff != null ? `Coeff. ${subject.coeff} · ` : ""}{subject.chapters.length} chapitre{subject.chapters.length > 1 ? "s" : ""}</>}
            title={subject.name}
            progress={{ pct: subjPct, label: `${Math.round(subjPct)} % lu` }}
            mascot={subjectTalk(subject.code, subject.name, subject.coeff ?? null, subjPct)}
            corner={DEPTS.length > 1 ? (
              <div className="bh-seg bh-seg-sm" role="group" aria-label="Partie">
                {DEPTS.map((d) => (
                  <button key={d.key} type="button" aria-pressed={d.key === activeDept} onClick={() => q.set({ d: d.key }, { replace: true })}>{d.label}</button>
                ))}
              </div>
            ) : undefined}
          >
            {lastChapter && lastSpot && !lockedFor(lastChapter) ? (
              <button type="button" onClick={() => openIn(lastChapter, lastSpot.v, lastSpot.l)} className="bh-btn bh-btn-primary min-w-0 max-w-full">
                <Play className="w-4 h-4 shrink-0" /> <span className="truncate">Reprendre · <Tex>{lastSpot.title}</Tex></span>
              </button>
            ) : fallbackChapter && !lockedFor(fallbackChapter) ? (
              <button type="button" onClick={() => openIn(fallbackChapter, "cours")} className="bh-btn bh-btn-primary min-w-0 max-w-full">
                <Play className="w-4 h-4 shrink-0" /> <span className="truncate">Reprendre · {fallbackChapter.name}</span>
              </button>
            ) : null}
            <label className="bh-search">
              <Search />
              <input value={subjQuery} onFocus={ensureIndex}
                onChange={(e) => { setSubjQuery(e.target.value); setHitSel(0); void ensureIndex(); }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") { e.preventDefault(); setHitSel((s) => Math.min(flat.length - 1, s + 1)); }
                  else if (e.key === "ArrowUp") { e.preventDefault(); setHitSel((s) => Math.max(0, s - 1)); }
                  else if (e.key === "Enter") { e.preventDefault(); pick(hitSel); }
                  else if (e.key === "Escape") { setSubjQuery(""); }
                }}
                placeholder={`Chercher dans ${subject.name}…`} aria-label={`Chercher dans ${subject.name}`} />
            </label>
          </BookHeader>
        </div>

        {subjQuery.trim() && (
          <div className="mt-3 glass rounded-2xl p-1.5" role="listbox" aria-label="Résultats">
            {groups.length === 0 ? (
              <div className="px-4 py-5 text-sm text-neutral-400">{subjIndex ? `Aucun résultat pour « ${subjQuery} ».` : "Recherche…"}</div>
            ) : groups.map((g) => {
              const locked = lockedFor(g.chapter);
              const hi = ++flatIdx;
              const dl = g.chapter.domain ? g.chapter.domain.charAt(0).toUpperCase() + g.chapter.domain.slice(1) : null;
              return (
                <div key={g.chapter.id} className="py-0.5">
                  <button type="button" role="option" aria-selected={hitSel === hi} onMouseMove={() => setHitSel(hi)} onClick={() => pick(hi)}
                    className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-left transition ${hitSel === hi ? "bg-black/[0.05] dark:bg-white/[0.07]" : ""}`}>
                    <span className={`w-6 text-center text-[12px] font-bold tabular-nums ${t.text}`}>{chapterNo.get(g.chapter.id)}</span>
                    <span dir="auto" className="flex-1 min-w-0 truncate text-[13px] font-semibold text-neutral-500 dark:text-neutral-400">
                      {dl ? `${dl} · ` : ""}<Hl text={g.chapter.name} q={subjQuery} />
                    </span>
                    {locked && <Lock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />}
                  </button>
                  {g.lessons.map((l) => {
                    const li = ++flatIdx;
                    return (
                      <button key={l.id} type="button" role="option" aria-selected={hitSel === li} onMouseMove={() => setHitSel(li)} onClick={() => pick(li)}
                        className={`w-full flex items-center gap-3 rounded-xl pl-12 pr-3 py-2 text-left transition ${hitSel === li ? "bg-black/[0.05] dark:bg-white/[0.07]" : ""}`}>
                        <BookOpen className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span dir="auto" className="flex-1 min-w-0 truncate text-sm">{l.title.includes("$") ? <Tex>{l.title}</Tex> : <Hl text={l.title} q={subjQuery} />}</span>
                        {completed.has(l.id) && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                      </button>
                    );
                  })}
                  {g.more > 0 && <div className="pl-12 pr-3 py-1 text-[12px] text-neutral-400">+ {g.more} autre{g.more > 1 ? "s" : ""} dans ce chapitre</div>}
                </div>
              );
            })}
            <div className="hidden md:flex gap-4 px-3 pt-2 pb-1 mt-1 border-t border-black/[0.06] dark:border-white/[0.06] text-[11.5px] text-neutral-400">
              <span>↑ ↓ naviguer</span><span>Entrée ouvrir</span><span>Échap effacer</span>
            </div>
          </div>
        )}

        {subject.chapters.length === 0 ? (
          <div className="mt-6 glass rounded-3xl p-10 text-center text-neutral-400">Les cours de cette matière arrivent très bientôt.</div>
        ) : (
          <div className="mt-6 space-y-6">
            {units.map((g) => (
              <div key={g.unit || "all"}>
                {g.unit && (
                  <div className="flex items-center gap-2 mb-2.5">
                    <span dir="auto" className={`text-[11px] font-bold uppercase tracking-wide ${t.text}`}>{g.unit}</span>
                    <span className="h-px flex-1 bg-black/[0.06] dark:bg-white/[0.08]" />
                    <span className="text-[11px] text-neutral-400">{g.items.length} chap.</span>
                  </div>
                )}
                <div className="space-y-2.5">{g.items.map((c) => Row(c))}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ---------- BROWSE (filières → matières) ----------
  return (
    <div className="max-w-6xl mx-auto py-8 fade-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cours & Résumés</h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {ownTrackName ? `${ownTrackName} · ${levelName}` : "Cours complets et résumés, par chapitre."}
        </p>
      </div>

      {is2bac && chips.length > 0 && (
        <div className="mt-7">
          <div className="text-[11px] font-bold uppercase tracking-wide text-neutral-400 mb-2">Filière</div>
          <div className="flex flex-wrap gap-2">
            {chips.map((c) => {
              const isOwn = c.code === ownTrack;
              const on = c.code === filiere;
              return (
                <button key={c.code} onClick={() => q.set({ f: c.code === ownTrack ? null : c.code, s: null, c: null, v: null, d: null }, { replace: true })} title={c.name}
                  className={`inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full transition ${on ? "bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white shadow-lg shadow-arctic-blue/20" : "chip text-neutral-600 dark:text-neutral-300 hover:-translate-y-0.5"}`}>
                  {c.label}
                  {isOwn && <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${on ? "bg-white/25" : "bg-arctic-blue/15 text-arctic-blue dark:text-arctic-cyan"}`}>TA FILIÈRE</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-neutral-400">
        <GraduationCap className="w-4 h-4" /> {is2bac ? (trackNameByCode.get(filiere ?? "") ?? "Matières") : (ownTrackName || "Matières")}
      </div>
      {subjectCards.length === 0 ? (
        <div className="mt-4 glass rounded-3xl p-10 text-center text-neutral-400">Le contenu arrive très bientôt.</div>
      ) : (
        <div className="mt-5">
          <SubjectShelf cards={subjectCards} onOpen={openSubject} />
        </div>
      )}
    </div>
  );
}

const DIFF_LABEL = ["", "Facile", "Moyen", "Difficile"];
/** Difficulty, always the same colours: Facile green · Moyen amber · Difficile red. */
const DIFF_STYLE = ["", "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400", "bg-amber-500/14 text-amber-600 dark:text-amber-400", "bg-red-500/12 text-red-600 dark:text-red-400"];
const DIFF_DOT = ["", "bg-emerald-500", "bg-amber-500", "bg-red-500"];
function DiffPill({ d }: { d: number }) {
  const k = Math.max(1, Math.min(3, d));
  return (
    <span className={`inline-flex items-center gap-1.5 h-5 px-2 rounded-full text-[11px] font-semibold ${DIFF_STYLE[k]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${DIFF_DOT[k]}`} />{DIFF_LABEL[k]}
    </span>
  );
}
/** Where the student stopped, per subject (this device). */
type LastSpot = { c: string; v: Kind; l: string; title: string };
const lastKey = (s: string) => `bacup.cours.last.${s}`;
function readLast(subject: string): LastSpot | null {
  try { return JSON.parse(localStorage.getItem(lastKey(subject)) ?? "null") as LastSpot | null; } catch { return null; }
}
function writeLast(subject: string, spot: LastSpot) {
  try { localStorage.setItem(lastKey(subject), JSON.stringify(spot)); } catch { /* private mode */ }
}

type IdxLesson = { id: string; title: string; chapter_id: string };
/** Every query word must start a word of the text (longer words may also match inside). 0 = no match. */
function tokenScore(text: string, tokens: string[]): number {
  const t = norm(text);
  const words = t.split(/[^a-z0-9]+/).filter(Boolean);
  let score = 0;
  for (const k of tokens) {
    if (t.startsWith(k)) score += 3;
    else if (words.some((w) => w.startsWith(k))) score += 2;
    else if (k.length >= 3 && t.includes(k)) score += 1;
    else return 0;
  }
  return score;
}
/** Subject search grouped by chapter, in curriculum order: part → chapter number → cours order. */
function searchSubject(query: string, chapters: Chapter[], index: IdxLesson[], deptOrder: string[], chapterNo: Map<string, number>) {
  const tokens = norm(query).split(/[^a-z0-9]+/).filter(Boolean);
  if (!tokens.length) return [];
  const rank = (c: Chapter) => (deptOrder.indexOf(c.domain ?? "") + 1) * 1000 + (chapterNo.get(c.id) ?? 0);
  const ordered = [...chapters].sort((a, b) => rank(a) - rank(b));
  const byChap = new Map<string, IdxLesson[]>();
  for (const l of index) { const arr = byChap.get(l.chapter_id) ?? []; arr.push(l); byChap.set(l.chapter_id, arr); }
  const out: { chapter: Chapter; lessons: IdxLesson[]; more: number }[] = [];
  for (const c of ordered) {
    const hits = (byChap.get(c.id) ?? []).filter((l) => tokenScore(l.title, tokens) > 0);
    if (!hits.length && tokenScore(c.name, tokens) === 0) continue;
    out.push({ chapter: c, lessons: hits.slice(0, 5), more: Math.max(0, hits.length - 5) });
    if (out.length >= 6) break;
  }
  return out;
}
/** Bold the part of each word that matches the query (word starts). */
function Hl({ text, q }: { text: string; q: string }) {
  const tokens = norm(q).split(/[^a-z0-9]+/).filter(Boolean);
  if (!tokens.length) return <>{text}</>;
  const parts = text.split(/(\s+|-|'|’)/);
  return (
    <>
      {parts.map((p, i) => {
        const n = norm(p);
        const k = p.trim() ? tokens.find((t) => n.startsWith(t)) : undefined;
        if (!k) return <span key={i}>{p}</span>;
        return <span key={i}><b className="font-semibold text-neutral-900 dark:text-white">{p.slice(0, k.length)}</b>{p.slice(k.length)}</span>;
      })}
    </>
  );
}

/** accent- and case-insensitive text for search */
const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[$\\{}]/g, " ").toLowerCase();
const FREQ_LABEL = ["Rare au BAC", "Rare au BAC", "Parfois au BAC", "Souvent au BAC", "Tombe presque toujours"];

function NotionMeta({ lesson }: { lesson: Lesson }) {
  const d = lesson.difficulty, dur = lesson.duration_min, f = lesson.bac_frequency;
  if (d == null && dur == null && f == null) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {d != null && d > 0 && <DiffPill d={d} />}
      {dur != null && (
        <span className="inline-flex items-center gap-1 text-[12px] font-semibold px-2.5 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-300">≈ {dur} min</span>
      )}
      {f != null && (
        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1 rounded-full bg-arctic-blue/10 text-arctic-blue dark:text-arctic-cyan">
          <span className="tracking-tight">{"\u25CF".repeat(Math.max(0, f))}{"\u25CB".repeat(Math.max(0, 3 - f))}</span>
          {FREQ_LABEL[f] ?? ""}
        </span>
      )}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="mt-5 glass rounded-2xl p-8 text-center text-sm text-neutral-400">{text}</div>;
}
