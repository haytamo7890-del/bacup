/**
 * Espace de préparation — data layer shared by the hub, the subject page and the
 * practice runner. Same taxonomy as the cours (subjects → chapters → notions),
 * same progress model (attempts + chapter_mastery + xp_events + streaks).
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { lessonNotions } from "@/lib/notions";

export type Sb = SupabaseClient;

export type StudentCtx = {
  userId: string;
  levelId: string | null;
  levelCode: string | null;
  levelName: string;
  ownTrack: string | null;
  ownTrackName: string;
  status: string;
  subjectsByCode: Map<string, { id: string; code: string; name: string }>;
  subjectsById: Map<string, { id: string; code: string; name: string }>;
  trackIdByCode: Map<string, string>;
  trackNameByCode: Map<string, string>;
};

export async function loadStudentCtx(supabase: Sb): Promise<StudentCtx | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const [{ data: sp }, { data: subs }, { data: trks }] = await Promise.all([
    supabase.from("student_profiles")
      .select("level_id, status, levels(code,name), tracks(code,name)")
      .eq("id", user.id).maybeSingle(),
    supabase.from("subjects").select("id, code, name"),
    supabase.from("tracks").select("id, code, name"),
  ]);
  const lv = (sp?.levels as unknown as { code: string; name: string } | null) ?? null;
  const tr = (sp?.tracks as unknown as { code: string; name: string } | null) ?? null;
  const subjectsByCode = new Map<string, { id: string; code: string; name: string }>();
  const subjectsById = new Map<string, { id: string; code: string; name: string }>();
  for (const s of (subs ?? []) as { id: string; code: string; name: string }[]) { subjectsByCode.set(s.code, s); subjectsById.set(s.id, s); }
  const trackIdByCode = new Map<string, string>(); const trackNameByCode = new Map<string, string>();
  for (const t of (trks ?? []) as { id: string; code: string; name: string }[]) { trackIdByCode.set(t.code, t.id); trackNameByCode.set(t.code, t.name); }
  return {
    userId: user.id,
    levelId: (sp?.level_id as string | null) ?? null,
    levelCode: lv?.code ?? null,
    levelName: lv?.name ?? "",
    ownTrack: tr?.code ?? null,
    ownTrackName: tr?.name ?? "",
    status: (sp?.status as string | null) ?? "",
    subjectsByCode, subjectsById, trackIdByCode, trackNameByCode,
  };
}

export type PrepChapter = { id: string; subject_id: string; track_id: string | null; name: string; position: number; domain: string | null; unit: string | null; unit_pos: number | null };

export async function loadChapters(supabase: Sb, levelId: string, subjectId: string | null, trackId: string | null): Promise<PrepChapter[]> {
  let q = supabase.from("chapters").select("id, subject_id, track_id, name, position, domain, unit, unit_pos").eq("level_id", levelId);
  if (subjectId) q = q.eq("subject_id", subjectId);
  const { data } = await q.order("position");
  return ((data ?? []) as PrepChapter[]).filter((c) => c.track_id === trackId || c.track_id == null);
}

/** Chapter bank = chapter-tagged exercises; returns light question rows (for counts / notion grouping). */
export type BankQ = { id: string; chapter_id: string; notion: string | null; exercise_id: string; kind: "qcu" | "probleme" };
export async function loadBank(supabase: Sb, chapterIds: string[]): Promise<{ questions: BankQ[]; bankExamIds: Set<string> }> {
  if (!chapterIds.length) return { questions: [], bankExamIds: new Set() };
  const { data: ex } = await supabase.from("exercises").select("id, chapter_id, exam_id, kind").in("chapter_id", chapterIds).order("position");
  const exRows = (ex ?? []) as { id: string; chapter_id: string; exam_id: string | null; kind: string | null }[];
  const kindByEx = new Map(exRows.map((e) => [e.id, (e.kind === "probleme" ? "probleme" : "qcu") as BankQ["kind"]]));
  const bankExamIds = new Set(exRows.map((e) => e.exam_id).filter(Boolean) as string[]);
  const chByEx = new Map(exRows.map((e) => [e.id, e.chapter_id]));
  const out: BankQ[] = [];
  for (let i = 0; i < exRows.length; i += 150) {
    const ids = exRows.slice(i, i + 150).map((e) => e.id);
    const { data: qs } = await supabase.from("questions").select("id, exercise_id, notion, position").in("exercise_id", ids).order("position");
    for (const q of (qs ?? []) as { id: string; exercise_id: string; notion: string | null }[]) {
      out.push({ id: q.id, chapter_id: chByEx.get(q.exercise_id) ?? "", notion: q.notion, exercise_id: q.exercise_id, kind: kindByEx.get(q.exercise_id) ?? "qcu" });
    }
  }
  const exOrder = new Map(exRows.map((e, i) => [e.id, i]));
  out.sort((a, b) => (exOrder.get(a.exercise_id) ?? 0) - (exOrder.get(b.exercise_id) ?? 0));
  return { questions: out, bankExamIds };
}

export type Serie = {
  id: string; subject_id: string; track_id: string | null; chapter_id: string | null; unit: string | null;
  kind: "chapitre" | "unite" | "mixte" | "custom"; title: string; description: string | null;
  difficulty: number; position: number; xp_bonus: number; count: number;
};
export type SerieProgress = { series_id: string; attempts_count: number; best_pct: number; last_pct: number; completed_at: string | null };

export async function loadSeries(supabase: Sb, levelId: string, subjectId: string | null, trackId: string | null): Promise<Serie[]> {
  let q = supabase.from("series")
    .select("id, subject_id, track_id, chapter_id, unit, kind, title, description, difficulty, position, xp_bonus, series_items(count)")
    .eq("level_id", levelId).eq("is_published", true);
  if (subjectId) q = q.eq("subject_id", subjectId);
  const { data } = await q.order("position");
  type Row = Omit<Serie, "count"> & { series_items: { count: number }[] | null };
  return ((data ?? []) as unknown as Row[])
    .filter((s) => s.track_id === trackId || s.track_id == null)
    .map(({ series_items, ...s }) => ({ ...s, count: series_items?.[0]?.count ?? 0 }))
    .filter((s) => s.count > 0);
}

export async function loadSeriesProgress(supabase: Sb, seriesIds: string[]): Promise<Map<string, SerieProgress>> {
  const m = new Map<string, SerieProgress>();
  if (!seriesIds.length) return m;
  const { data } = await supabase.from("series_progress").select("series_id, attempts_count, best_pct, last_pct, completed_at").in("series_id", seriesIds);
  for (const r of (data ?? []) as SerieProgress[]) m.set(r.series_id, { ...r, best_pct: Number(r.best_pct), last_pct: Number(r.last_pct) });
  return m;
}

export type ChapterMastery = { chapter_id: string; mastery_pct: number; attempts_count: number; last_practiced_at: string | null };
export async function loadMastery(supabase: Sb, chapterIds: string[]): Promise<Map<string, ChapterMastery>> {
  const m = new Map<string, ChapterMastery>();
  if (!chapterIds.length) return m;
  const { data } = await supabase.from("chapter_mastery").select("chapter_id, mastery_pct, attempts_count, last_practiced_at").in("chapter_id", chapterIds);
  for (const r of (data ?? []) as ChapterMastery[]) m.set(r.chapter_id, { ...r, mastery_pct: Number(r.mastery_pct) });
  return m;
}

/** Latest attempt status per question (own rows via RLS) → per-notion mastery. */
export async function loadLatestAttempts(supabase: Sb, questionIds: string[]): Promise<Map<string, boolean>> {
  const m = new Map<string, boolean>();
  for (let i = 0; i < questionIds.length; i += 150) {
    const ids = questionIds.slice(i, i + 150);
    const { data } = await supabase.from("attempts").select("question_id, status, created_at").in("question_id", ids).order("created_at", { ascending: false });
    for (const r of (data ?? []) as { question_id: string; status: string }[]) {
      if (!m.has(r.question_id)) m.set(r.question_id, r.status === "correct");
    }
  }
  return m;
}

/** Full playable questions (statement, options with ids + per-option "why", hint, méthode, problem context, stored AI modes). */
export type PlayOpt = { id: string; label: string; correct: boolean; why: string | null };
export type PlayQ = {
  id: string; statement: string; notion: string | null; chapter_id: string | null;
  exercise_id: string; exercise_title: string | null; kind: "qcu" | "probleme"; context: string | null; figure: string | null;
  part: string | null; hint: string | null; methode: string | null; difficulty: number | null;
  options: PlayOpt[]; solution: string; modes: Record<string, string>;
};

export async function loadPlayable(supabase: Sb, questionIds: string[]): Promise<PlayQ[]> {
  const byId = new Map<string, PlayQ>();
  for (let i = 0; i < questionIds.length; i += 100) {
    const ids = questionIds.slice(i, i + 100);
    const { data } = await supabase.from("questions")
      .select("id, statement, notion, hint, methode, difficulty, part, exercise_id, exercises(chapter_id, statement, title, kind, figure), answer_options(id, label, is_correct, position, why), solutions(body), question_explanations(mode, body)")
      .in("id", ids);
    type Row = {
      id: string; statement: string; notion: string | null; hint: string | null; methode: string | null; difficulty: number | null; part: string | null; exercise_id: string;
      exercises: { chapter_id: string | null; statement: string | null; title: string | null; kind: string | null; figure: string | null } | null;
      answer_options: { id: string; label: string; is_correct: boolean; position: number; why: string | null }[] | null;
      solutions: { body: string }[] | null;
      question_explanations: { mode: string; body: string }[] | null;
    };
    for (const r of (data ?? []) as unknown as Row[]) {
      const modes: Record<string, string> = {};
      for (const e of r.question_explanations ?? []) modes[e.mode] = e.body;
      byId.set(r.id, {
        id: r.id, statement: r.statement, notion: r.notion,
        chapter_id: r.exercises?.chapter_id ?? null,
        exercise_id: r.exercise_id, exercise_title: r.exercises?.title ?? null,
        kind: r.exercises?.kind === "probleme" ? "probleme" : "qcu",
        context: r.exercises?.statement ?? null, figure: r.exercises?.figure ?? null,
        part: r.part, hint: r.hint, methode: r.methode, difficulty: r.difficulty,
        options: (r.answer_options ?? []).sort((a, b) => a.position - b.position).map((o) => ({ id: o.id, label: o.label, correct: o.is_correct, why: o.why })),
        solution: r.solutions?.[0]?.body ?? "",
        modes,
      });
    }
  }
  return questionIds.map((id) => byId.get(id)).filter((q): q is PlayQ => !!q && q.options.length >= 2 && q.options.some((o) => o.correct));
}

/* ------------------------------ gamification ------------------------------ */

/** Mastery ladder per notion (Khan-style), computed from the student's latest attempt on each question. */
export type Level = 0 | 1 | 2 | 3 | 4;
export const LEVELS: { label: string; short: string; tone: string; dot: string }[] = [
  { label: "À découvrir", short: "Nouveau", tone: "bg-black/[0.05] dark:bg-white/[0.07] text-neutral-500", dot: "bg-neutral-300 dark:bg-neutral-600" },
  { label: "En cours", short: "En cours", tone: "bg-amber-500/15 text-amber-600 dark:text-amber-400", dot: "bg-amber-500" },
  { label: "Acquis", short: "Acquis", tone: "bg-sky-500/15 text-sky-600 dark:text-sky-400", dot: "bg-sky-500" },
  { label: "Maîtrisé", short: "Maîtrisé", tone: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
  { label: "Niveau BAC", short: "BAC", tone: "bg-gradient-to-r from-amber-400 to-orange-500 text-white", dot: "bg-orange-500" },
];
/**
 *  0 À découvrir : nothing answered yet
 *  1 En cours    : answered, < 50 % of the notion's questions currently right
 *  2 Acquis      : ≥ 50 % right
 *  3 Maîtrisé    : ≥ 80 % right (and at least 3 right)
 *  4 Niveau BAC  : Maîtrisé + every "problème type BAC" question of the notion right
 *                  (a notion without problème content tops out at Maîtrisé)
 */
export function notionLevel(o: { total: number; done: number; correct: number; probTotal: number; probCorrect: number }): Level {
  if (!o.done) return 0;
  const r = o.total ? o.correct / o.total : 0;
  if (r >= 0.8 && o.correct >= Math.min(3, o.total)) {
    return o.probTotal > 0 && o.probCorrect === o.probTotal ? 4 : 3;
  }
  return r >= 0.5 ? 2 : 1;
}

/** Due review items (spaced repetition), optionally restricted to some chapters or to a subject
 *  (exam-bank questions have no chapter, so a subject filter also matches on exercises.subject_id). */
export async function loadDueReview(supabase: Sb, filter?: string[] | { subjectId: string }): Promise<{ question_id: string; chapter_id: string | null }[]> {
  const { data } = await supabase.from("review_items").select("question_id, due_at, questions(exercises(chapter_id, subject_id))").lte("due_at", new Date().toISOString()).order("due_at").limit(200);
  type R = { question_id: string; questions: { exercises: { chapter_id: string | null; subject_id: string | null } | null } | null };
  const rows = ((data ?? []) as unknown as R[]).map((r) => ({ question_id: r.question_id, chapter_id: r.questions?.exercises?.chapter_id ?? null, subject_id: r.questions?.exercises?.subject_id ?? null }));
  if (!filter) return rows;
  if (Array.isArray(filter)) {
    const set = new Set(filter);
    return rows.filter((r) => r.chapter_id && set.has(r.chapter_id));
  }
  return rows.filter((r) => r.subject_id === filter.subjectId);
}

/** Home / hub counters: due reviews + current errors (latest attempt wrong), per subject code. */
export type PrepStats = { due: number; errors: number; due_by_subject: Record<string, number>; errors_by_subject: Record<string, number> };
export async function loadPrepStats(supabase: Sb): Promise<PrepStats | null> {
  const { data, error } = await supabase.rpc("my_prep_stats");
  if (error || !data) return null;
  return data as PrepStats;
}

/** Error journal rows (my_errors RPC): questions whose latest attempt is wrong. */
export type ErrorRow = {
  question_id: string; subject_code: string; chapter_id: string | null; chapter_name: string | null; chapter_position: number | null;
  notion: string | null; statement: string; from_exam: boolean; misses: number; last_wrong_at: string; due_at: string | null; box: number | null;
};
export async function loadErrors(supabase: Sb, subjectCode?: string | null): Promise<ErrorRow[]> {
  const { data } = await supabase.rpc("my_errors", { p_subject: subjectCode ?? null });
  return (data ?? []) as ErrorRow[];
}

/** Headings (notions) of a chapter's cours lessons, in cours order. */
export async function loadChapterNotions(supabase: Sb, chapterId: string): Promise<{ notion: string; lessonId: string }[]> {
  const { data } = await supabase.from("lessons").select("id, body, kind, position").eq("chapter_id", chapterId).order("position");
  const out: { notion: string; lessonId: string }[] = [];
  for (const l of (data ?? []) as { id: string; body: string | null; kind: string }[]) {
    if (l.kind === "resume") continue;
    for (const n of lessonNotions(l.body)) out.push({ notion: n, lessonId: l.id });
  }
  return out;
}

export const DIFF_LABEL = ["", "Facile", "Moyen", "Difficile"];
export const KIND_LABEL: Record<Serie["kind"], string> = { chapitre: "Bilan de chapitre", unite: "Unité", mixte: "Mixte BAC", custom: "Série" };

/** Route helpers — keep all prep URLs in one place. */
export const prepRoutes = {
  hub: (f?: string | null) => `/dashboard/examens/preparation${f ? `?f=${f}` : ""}`,
  subject: (code: string, o: { f?: string | null; mode?: "notion" | "series" | "examens"; chapter?: string } = {}) => {
    const sp = new URLSearchParams();
    if (o.f) sp.set("f", o.f);
    if (o.mode) sp.set("mode", o.mode);
    if (o.chapter) sp.set("chapter", o.chapter);
    const s = sp.toString();
    return `/dashboard/examens/preparation/${code}${s ? `?${s}` : ""}`;
  },
  notion: (chapterId: string, notion: string) => `/dashboard/examens/pratique?chapter=${chapterId}&notion=${encodeURIComponent(notion)}`,
  problemes: (chapterId: string) => `/dashboard/examens/pratique?chapter=${chapterId}&kind=probleme`,
  review: (subjectCode?: string) => `/dashboard/examens/pratique?review=${subjectCode ?? "all"}`,
  errors: (subjectCode?: string | null) => `/dashboard/examens/erreurs${subjectCode ? `?s=${subjectCode}` : ""}`,
  replayErrors: (o: { subject?: string | null; chapter?: string | null; notion?: string | null } = {}) => {
    const sp = new URLSearchParams({ errors: o.subject ?? "all" });
    if (o.chapter) sp.set("chapter", o.chapter);
    if (o.notion) sp.set("notion", o.notion);
    return `/dashboard/examens/pratique?${sp.toString()}`;
  },
  chapter: (chapterId: string) => `/dashboard/examens/pratique?chapter=${chapterId}&notion=__all`,
  serie: (id: string) => `/dashboard/examens/pratique?serie=${id}`,
  cours: (chapterId: string) => `/dashboard/cours?chapter=${chapterId}`,
};
