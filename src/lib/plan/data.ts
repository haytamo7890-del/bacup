/**
 * Plan BAC — loads what the engine needs (2BAC only for now) and keeps today's plan stable:
 * the day's tasks are frozen in a local snapshot, so reading a cours ticks it instead of
 * replacing it with the next one.
 */
import type { createBrowserSupabase } from "@/lib/supabase-browser";
import { curriculumFor, chapterVisibleFor } from "@/config/curriculum";
import { loadPrepStats } from "@/lib/prep";
import { buildDay, buildWeek, isoWeekKey, localDay, roadmap, weekFrame, EXAM_DATE, type DayPlan, type DoneToday, type PlanAnswers, type PlanState, type PlanSubject, type Roadmap, type WeekFrame } from "./engine";

type Sb = ReturnType<typeof createBrowserSupabase>;

export type StoredPlan = { answers: PlanAnswers; exam_date: string; updated_at: string };
export type PlanContext = {
  userId: string; levelCode: string | null; trackCode: string | null; eligible: boolean;
  subjects: PlanSubject[]; plan: StoredPlan | null; state: PlanState; done: DoneToday;
};

export async function loadPlan(supabase: Sb): Promise<StoredPlan | null> {
  const { data } = await supabase.from("study_plans").select("answers, exam_date, updated_at").maybeSingle();
  return (data as StoredPlan | null) ?? null;
}

export async function savePlan(supabase: Sb, userId: string, answers: PlanAnswers): Promise<boolean> {
  const { error } = await supabase.from("study_plans").upsert(
    { user_id: userId, answers, exam_date: EXAM_DATE, updated_at: new Date().toISOString() },
    { onConflict: "user_id" },
  );
  if (!error) { try { localStorage.removeItem(SNAP_KEY); localStorage.removeItem(WEEK_KEY); } catch { /* private mode */ } }
  return !error;
}

/** Subjects (curriculum order + coefficients) with their chapters and cours lessons. */
export async function loadPlanContext(supabase: Sb, o: { withProgress?: boolean } = { withProgress: true }): Promise<PlanContext | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: sp } = await supabase.from("student_profiles").select("level_id, track_id, levels(code), tracks(code)").eq("id", user.id).maybeSingle();
  const levelCode = (sp?.levels as unknown as { code: string } | null)?.code ?? null;
  const trackCode = (sp?.tracks as unknown as { code: string } | null)?.code ?? null;
  const ref = curriculumFor(levelCode, trackCode);
  const eligible = levelCode === "2bac" && !!ref;
  const empty: PlanState = { read: new Set(), mastery: new Map(), due: 0, errors: 0 };
  const emptyDone: DoneToday = { read: new Set(), practicedChapters: new Set(), dueNow: 0, attempts: 0 };
  if (!eligible || !ref || !sp?.level_id) {
    return { userId: user.id, levelCode, trackCode, eligible: false, subjects: [], plan: null, state: empty, done: emptyDone };
  }

  const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
  const [{ data: subs }, { data: chs }, plan] = await Promise.all([
    supabase.from("subjects").select("id, code, name"),
    supabase.from("chapters").select("id, subject_id, track_id, code, name, position, domain").eq("level_id", sp.level_id).order("position"),
    loadPlan(supabase),
  ]);
  const chapters = ((chs ?? []) as { id: string; subject_id: string; track_id: string | null; code: string | null; name: string; position: number; domain: string | null }[])
    .filter((c) => (c.track_id === sp.track_id || c.track_id == null) && chapterVisibleFor(trackCode, c.code));
  const chapterIds = chapters.map((c) => c.id);
  const { data: les } = chapterIds.length
    ? await supabase.from("lessons").select("id, chapter_id, title, kind, position, resume").in("chapter_id", chapterIds).order("position")
    : { data: [] };
  const lessonsBy = new Map<string, { id: string; title: string; position: number }[]>();
  const resumeBy = new Set<string>();
  for (const l of (les ?? []) as { id: string; chapter_id: string; title: string; kind: string; position: number; resume: string | null }[]) {
    if (l.resume || l.kind === "resume") resumeBy.add(l.chapter_id);
    if (l.kind === "resume") continue;
    const a = lessonsBy.get(l.chapter_id) ?? []; a.push({ id: l.id, title: l.title, position: l.position }); lessonsBy.set(l.chapter_id, a);
  }
  const byCode = new Map(((subs ?? []) as { id: string; code: string; name: string }[]).map((s) => [s.code, s]));
  const subjects: PlanSubject[] = ref.map((r) => {
    const s = byCode.get(r.code);
    if (!s) return null;
    return {
      id: s.id, code: s.code, name: s.name, coeff: r.coeff,
      chapters: chapters.filter((c) => c.subject_id === s.id).map((c) => ({ id: c.id, name: c.name, position: c.position, domain: c.domain ?? null, lessons: lessonsBy.get(c.id) ?? [], hasResume: resumeBy.has(c.id) })),
    };
  }).filter(Boolean) as PlanSubject[];

  if (o.withProgress === false) return { userId: user.id, levelCode, trackCode, eligible, subjects, plan, state: empty, done: emptyDone };

  const [{ data: comp }, { data: mas }, stats, { data: att }] = await Promise.all([
    supabase.from("lesson_completions").select("lesson_id"),
    supabase.from("chapter_mastery").select("chapter_id, mastery_pct, attempts_count"),
    loadPrepStats(supabase).catch(() => null),
    supabase.from("attempts").select("question_id, questions(exercises(chapter_id))").gte("created_at", startOfDay.toISOString()).limit(500),
  ]);
  const read = new Set(((comp ?? []) as { lesson_id: string }[]).map((r) => r.lesson_id));
  const mastery = new Map<string, number>();
  for (const m of (mas ?? []) as { chapter_id: string; mastery_pct: number | null; attempts_count: number | null }[]) {
    if ((m.attempts_count ?? 0) > 0 && m.mastery_pct != null) mastery.set(m.chapter_id, Number(m.mastery_pct));
  }
  type A = { questions: { exercises: { chapter_id: string | null } | null } | null };
  const attempts = (att ?? []) as unknown as A[];
  const practicedChapters = new Set(attempts.map((r) => r.questions?.exercises?.chapter_id).filter((x): x is string => !!x));
  const state: PlanState = { read, mastery, due: stats?.due ?? 0, errors: stats?.errors ?? 0 };
  const done: DoneToday = { read, practicedChapters, dueNow: stats?.due ?? 0, attempts: attempts.length };
  return { userId: user.id, levelCode, trackCode, eligible, subjects, plan, state, done };
}

/* ---- the week's frame (subjects per day), frozen for the ISO week + plan version ---- */
const WEEK_KEY = "bacup.plan.week";
type WeekSnap = { user: string; planAt: string; frame: WeekFrame };

export function frameFor(ctx: PlanContext, now = new Date()): WeekFrame | null {
  if (!ctx.plan) return null;
  const key = isoWeekKey(now);
  try {
    const raw = localStorage.getItem(WEEK_KEY);
    if (raw) {
      const w = JSON.parse(raw) as WeekSnap;
      if (w.user === ctx.userId && w.planAt === ctx.plan.updated_at && w.frame.key === key) return w.frame;
    }
  } catch { /* fall through */ }
  const frame = weekFrame(ctx.subjects, ctx.plan.answers, ctx.state, now);
  try { localStorage.setItem(WEEK_KEY, JSON.stringify({ user: ctx.userId, planAt: ctx.plan.updated_at, frame } satisfies WeekSnap)); } catch { /* private mode */ }
  return frame;
}

/* ---- today's session, frozen for the day (reading a cours ticks it instead of replacing it) ---- */
const SNAP_KEY = "bacup.plan.today";
type Ref = null | { code: string; name: string };
type SnapJSON = { user: string; date: string; planAt: string; day: Omit<DayPlan, "subject" | "second"> & { subject: Ref; second: Ref } };
const ref = (x: PlanSubject | null): Ref => (x ? { code: x.code, name: x.name } : null);

export function todayPlan(ctx: PlanContext): DayPlan | null {
  if (!ctx.plan) return null;
  const date = localDay();
  const find = (r: Ref) => (r ? ctx.subjects.find((x) => x.code === r.code) ?? null : null);
  try {
    const raw = localStorage.getItem(SNAP_KEY);
    if (raw) {
      const s = JSON.parse(raw) as SnapJSON;
      if (s.user === ctx.userId && s.date === date && s.planAt === ctx.plan.updated_at && "second" in s.day) {
        return { ...s.day, subject: find(s.day.subject), second: find(s.day.second) };
      }
    }
  } catch { /* fall through */ }
  const frame = frameFor(ctx);
  if (!frame) return null;
  const day = buildDay(ctx.subjects, ctx.plan.answers, ctx.state, frame, new Date());
  try {
    const out: SnapJSON = { user: ctx.userId, date, planAt: ctx.plan.updated_at, day: { ...day, subject: ref(day.subject), second: ref(day.second) } };
    localStorage.setItem(SNAP_KEY, JSON.stringify(out));
  } catch { /* private mode */ }
  return day;
}

/** The current week, Mon → Sun; today is exactly the frozen session shown on the dashboard. */
export function weekPlan(ctx: PlanContext): (DayPlan & { past: boolean })[] {
  const frame = frameFor(ctx);
  if (!ctx.plan || !frame) return [];
  const week = buildWeek(ctx.subjects, ctx.plan.answers, ctx.state, frame);
  const today = todayPlan(ctx);
  return week.map((d) => (today && d.date === today.date ? { ...today, past: false } : d));
}

export function roadmapFor(ctx: PlanContext): Roadmap | null {
  const frame = frameFor(ctx);
  if (!ctx.plan || !frame) return null;
  return roadmap(ctx.subjects, ctx.plan.answers, ctx.state, frame);
}

/** Today's plan targets (chapters / lessons), for quiet « Aujourd'hui » marks in Cours. */
export function readTodayTargets(): { chapters: Set<string>; lessons: Set<string> } | null {
  try {
    const raw = localStorage.getItem(SNAP_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as SnapJSON;
    if (s.date !== localDay() || s.day.rest) return null;
    return {
      chapters: new Set(s.day.tasks.map((t) => t.chapterId).filter((x): x is string => !!x)),
      lessons: new Set(s.day.tasks.map((t) => t.lessonId).filter((x): x is string => !!x)),
    };
  } catch { return null; }
}
