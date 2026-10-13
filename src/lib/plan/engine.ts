/**
 * Plan BAC — deterministic engine (no AI). Same inputs → same plan, explainable line by line.
 *
 * Science it applies (see the Plan BAC structure doc):
 *  · Practice testing (Dunlosky et al., 2013): every session ends with QCU on what was just studied.
 *  · Spacing (Cepeda et al., 2008): sessions open with the spaced reviews that are due.
 *  · Interleaving: a second, shorter subject in each session; main subjects rotate across the week.
 *  · Implementation intentions (Gollwitzer & Sheeran, 2006): fixed days + slot chosen by the student.
 *  · Priority by expected gain: coefficient × need (felt level, then real QCU mastery).
 *  · Realistic load: the student's own minutes, up to 3 rest days, short blocks, a calm roadmap
 *    with slack built in (finishing the cours early is shown, being "late" never is).
 *  · Point faible: oubli → longer reviews · pratique → more QCU · procrastination → short core
 *    block · stress → annales on weekends from the start.
 *
 * Stability: the subjects of each day are fixed once per week (WeekFrame, frozen by data.ts),
 * so the week view and today's session always agree; only progress ticks change during the week.
 */

/** National exam (2BAC). Official date not published yet: update here when it is. */
export const EXAM_DATE = "2027-06-01";

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = lundi … 6 = dimanche
export type Slot = "matin" | "apres" | "soir";
export type Weakness = "procrastination" | "oubli" | "pratique" | "stress";
export type Level = 1 | 2 | 3 | 4; // Fragile · Moyen · Correct · Solide

/** A school test the plan prepares for: the study days before it focus on that chapter. */
export type Controle = { subject: string; chapterId: string; date: string /* YYYY-MM-DD */ };

export type PlanAnswers = {
  v: 1;
  /** bacup: the week is built for the student · custom: the student picks the subjects per day */
  mode?: "bacup" | "custom";
  custom?: Partial<Record<Weekday, { main: string; second: string | null }>>;
  controles?: Controle[];
  days: Weekday[];
  minWeek: number;
  minWeekend: number;
  slot: Slot;
  levels: Record<string, Level>;
  weakness: Weakness;
};

export const DAY_SHORT = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"] as const;
export const DAY_LONG = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"] as const;
export const SLOT_LABEL: Record<Slot, string> = { matin: "le matin", apres: "après l'école", soir: "le soir" };
export const SLOT_HOUR: Record<Slot, string> = { matin: "7 h", apres: "17 h", soir: "20 h" };
export const LEVEL_LABEL = ["", "Fragile", "Moyen", "Correct", "Solide"] as const;
export const WEAKNESS_LABEL: Record<Weakness, string> = {
  procrastination: "Je remets à demain",
  oubli: "J'oublie vite",
  pratique: "Je manque d'entraînement",
  stress: "Le stress",
};
const MONTHS = ["janv.", "févr.", "mars", "avril", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
export const shortDate = (d: Date) => `${d.getDate()} ${MONTHS[d.getMonth()]}`;

export type PlanLesson = { id: string; title: string; position: number };
export type PlanChapter = { id: string; name: string; position: number; domain: string | null; lessons: PlanLesson[]; hasResume: boolean };
export type PlanSubject = { id: string; code: string; name: string; coeff: number; chapters: PlanChapter[] };

export type PlanState = { read: Set<string>; mastery: Map<string, number>; due: number; errors: number };

export type TaskKind = "revision" | "cours" | "resume" | "qcu" | "serie" | "annale" | "lecture";
export type Block = "Échauffement" | "Cœur" | "Rappel" | "2e matière";
export type PlanTask = {
  key: string; kind: TaskKind; block: Block;
  label: string; detail: string; minutes: number; href: string;
  subject?: string; chapterId?: string; lessonId?: string;
};
export type Phase = { key: "fondations" | "consolidation" | "simulation" | "ligne"; label: string; hint: string };
export type DaySlot = { main: string; second: string | null; why?: string; controle?: Controle };
export type WeekFrame = { key: string; days: Partial<Record<Weekday, DaySlot>> };
export type DayPlan = {
  date: string; weekday: Weekday; rest: boolean; minutes: number; daysLeft: number; phase: Phase;
  subject: PlanSubject | null; second: PlanSubject | null; tasks: PlanTask[]; why?: string;
};

/* ---------------------------------------------------------------------------------------- */

export const localDay = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const weekdayOf = (d = new Date()) => ((d.getDay() + 6) % 7) as Weekday;
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
export const mondayOf = (d = new Date()) => { const x = addDays(d, -weekdayOf(d)); x.setHours(0, 0, 0, 0); return x; };
export const examDate = () => { const [y, m, d] = EXAM_DATE.split("-").map(Number); return new Date(y, m - 1, d); };

export function daysUntilExam(today = new Date()): number {
  const a = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const e = examDate();
  return Math.max(0, Math.round((Date.UTC(e.getFullYear(), e.getMonth(), e.getDate()) - a) / 86_400_000));
}

/** Phase boundaries, in days before the exam. */
export const PHASES: { key: Phase["key"]; label: string; from: number; to: number; hint: string }[] = [
  { key: "fondations", label: "Fondations", from: Infinity, to: 120, hint: "Chaque notion : cours, puis QCU." },
  { key: "consolidation", label: "Consolidation", from: 120, to: 45, hint: "Tes notions fragiles, en séries mixtes." },
  { key: "simulation", label: "Simulation", from: 45, to: 10, hint: "Annales en conditions réelles." },
  { key: "ligne", label: "Ligne droite", from: 10, to: 0, hint: "Résumés, flashcards et sommeil." },
];
export function phaseFor(daysLeft: number): Phase {
  const p = PHASES.find((x) => daysLeft > x.to) ?? PHASES[PHASES.length - 1];
  return { key: p.key, label: p.label, hint: p.hint };
}

function need(s: PlanSubject, a: PlanAnswers, st: PlanState): number {
  const felt = { 1: 1, 2: 0.78, 3: 0.55, 4: 0.35 }[a.levels[s.code] ?? 2];
  const m = s.chapters.map((c) => st.mastery.get(c.id)).filter((x): x is number => x != null);
  if (!m.length) return felt;
  const real = 1 - m.reduce((x, y) => x + y, 0) / m.length / 100;
  const w = Math.min(0.7, m.length / 6);
  return felt * (1 - w) + real * w;
}
export const priorityOf = (s: PlanSubject, a: PlanAnswers, st: PlanState) => s.coeff * need(s, a, st);

export const isoWeekKey = (d: Date) => {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
  const w = Math.ceil(((t.getTime() - Date.UTC(t.getUTCFullYear(), 0, 1)) / 86_400_000 + 1) / 7);
  return `${t.getUTCFullYear()}-W${String(w).padStart(2, "0")}`;
};
const minutesFor = (a: PlanAnswers, d: Weekday) => (d >= 5 ? a.minWeekend : a.minWeek);
const hasSecond = (min: number) => min >= 30;

/**
 * The week's frame: main subject of each study day (shared by priority, every coeff ≥ 5 subject
 * at least once, never twice in a row, order shifted each week) + a second, shorter subject on
 * sessions of 30 min or more, chosen so the least-seen subjects of the week get their turn.
 */
export function weekFrame(subjects: PlanSubject[], a: PlanAnswers, st: PlanState, ref = new Date()): WeekFrame {
  const frame = a.mode === "custom" && a.custom ? customFrame(subjects, a, ref) : proposedFrame(subjects, a, st, ref);
  return applyControles(frame, subjects, a, ref);
}

function customFrame(subjects: PlanSubject[], a: PlanAnswers, ref: Date): WeekFrame {
  const frame: WeekFrame = { key: isoWeekKey(ref), days: {} };
  for (const d of a.days) {
    const c = a.custom?.[d];
    if (c && subjects.some((s) => s.code === c.main)) frame.days[d] = { main: c.main, second: c.second, why: "Ton choix" };
  }
  return frame;
}

/** Test in [date-4, date-1] → that study day prepares it (main subject = the test's subject). */
export function controleFor(a: PlanAnswers, date: Date): Controle | null {
  const t = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const hits = (a.controles ?? []).map((c) => {
    const [y, m, d] = c.date.split("-").map(Number);
    return { c, gap: Math.round((Date.UTC(y, m - 1, d) - t) / 86_400_000) };
  }).filter((x) => x.gap >= 1 && x.gap <= 4).sort((x, y) => x.gap - y.gap);
  return hits[0]?.c ?? null;
}
const dayName = (iso: string) => { const [y, m, d] = iso.split("-").map(Number); return DAY_LONG[weekdayOf(new Date(y, m - 1, d))]; };

function applyControles(frame: WeekFrame, subjects: PlanSubject[], a: PlanAnswers, ref: Date): WeekFrame {
  if (!a.controles?.length) return frame;
  const mon = mondayOf(ref);
  const today = weekdayOf(ref);
  for (const d of a.days) {
    if (d < today) continue; // days already lived keep their subjects
    const c = controleFor(a, addDays(mon, d));
    const s = c && subjects.find((x) => x.code === c.subject);
    if (!c || !s) continue;
    const cur = frame.days[d];
    const second = cur ? (cur.main !== c.subject ? cur.main : cur.second) : null;
    frame.days[d] = { main: c.subject, second: second === c.subject ? null : second, why: `Contrôle de ${s.name} ${dayName(c.date)} : on le prépare`, controle: c };
  }
  return frame;
}

function proposedFrame(subjects: PlanSubject[], a: PlanAnswers, st: PlanState, ref: Date): WeekFrame {
  const key = isoWeekKey(ref);
  const days = [...a.days].sort((x, y) => x - y) as Weekday[];
  const frame: WeekFrame = { key, days: {} };
  const pool = subjects.filter((s) => s.chapters.length > 0);
  if (!days.length || !pool.length) return frame;
  const pr = pool.map((s) => ({ s, p: priorityOf(s, a, st) })).sort((x, y) => y.p - x.p || y.s.coeff - x.s.coeff);
  const n = days.length;
  const count = new Map<string, number>(pr.map(({ s }) => [s.code, 0]));
  let left = n;
  for (const { s } of pr) if (s.coeff >= 5 && left > 0) { count.set(s.code, 1); left--; }
  const total = pr.reduce((x, y) => x + y.p, 0) || 1;
  const share = pr.map(({ s, p }) => ({ s, exact: (p / total) * n }));
  while (left > 0) {
    share.sort((x, y) => (y.exact - (count.get(y.s.code) ?? 0)) - (x.exact - (count.get(x.s.code) ?? 0)));
    const pick = share[0].s;
    count.set(pick.code, (count.get(pick.code) ?? 0) + 1);
    left--;
  }
  const seq: string[] = [];
  const rem = new Map(count);
  for (let i = 0; i < n; i++) {
    const prev = seq[seq.length - 1];
    const cands = pr.filter(({ s }) => (rem.get(s.code) ?? 0) > 0);
    const best = cands.filter(({ s }) => s.code !== prev).sort((x, y) => (rem.get(y.s.code)! - rem.get(x.s.code)!) || y.p - x.p)[0] ?? cands[0];
    if (!best) break;
    seq.push(best.s.code);
    rem.set(best.s.code, rem.get(best.s.code)! - 1);
  }
  const wk = Number(key.slice(-2));
  const shift = seq.length ? wk % seq.length : 0;
  const rot = [...seq.slice(shift), ...seq.slice(0, shift)];
  // second subjects: least-touched first (main counts 2, second counts 1), then priority
  const seen = new Map<string, number>(pr.map(({ s }) => [s.code, 2 * (count.get(s.code) ?? 0)]));
  days.forEach((d, i) => {
    const main = rot[i];
    if (!main) return;
    let second: string | null = null;
    if (hasSecond(minutesFor(a, d))) {
      const prevSecond = i > 0 ? frame.days[days[i - 1]]?.second : null;
      const c = pr.filter(({ s }) => s.code !== main && s.code !== prevSecond)
        .sort((x, y) => (seen.get(x.s.code)! - seen.get(y.s.code)!) || y.p - x.p)[0];
      if (c) { second = c.s.code; seen.set(second, seen.get(second)! + 1); }
    }
    const ms = pool.find((x) => x.code === main)!;
    const lvl = a.levels[main] ?? 2;
    const why = `${ms.name} : coeff ${ms.coeff}${lvl === 1 ? ", ta matière fragile" : lvl === 2 ? ", à renforcer" : ""}`
      + (second ? ` · ${pool.find((x) => x.code === second)!.name} pour garder le fil` : "");
    frame.days[d] = { main, second, why };
  });
  return frame;
}

const round5 = (x: number) => Math.max(5, Math.round(x / 5) * 5);
const sortedLessons = (ch: PlanChapter) => [...ch.lessons].sort((x, y) => x.position - y.position);
const sortedChapters = (s: PlanSubject) => [...s.chapters].sort((x, y) => x.position - y.position);

/**
 * School-year windows: each chapter gets a slice of the year (mid-September → mid-April, when
 * the programme usually ends), proportional to its number of notions, in cours order. Subjects
 * with parts taught in parallel (Physique / Chimie) get one track per part, like in class.
 */
export const schoolStart = () => new Date(examDate().getFullYear() - 1, 8, 15);
export const programmeEnd = () => addDays(examDate(), -50);
export type Window = { from: Date; to: Date };
export function chapterWindows(s: PlanSubject): Map<string, Window> {
  const start = schoolStart().getTime();
  const span = programmeEnd().getTime() - start;
  const out = new Map<string, Window>();
  const tracks = new Map<string, PlanChapter[]>();
  for (const ch of sortedChapters(s)) { const k = ch.domain ?? ""; tracks.set(k, [...(tracks.get(k) ?? []), ch]); }
  for (const chs of tracks.values()) {
    const total = chs.reduce((x, c) => x + Math.max(1, c.lessons.length), 0);
    let cum = 0;
    for (const c of chs) {
      const n = Math.max(1, c.lessons.length);
      out.set(c.id, { from: new Date(start + (cum / total) * span), to: new Date(start + ((cum + n) / total) * span) });
      cum += n;
    }
  }
  return out;
}
/** Where to study next: the chapter(s) the class is on now first (parts alternate by day),
 *  then chapters already passed (reprise), then the next ones (prendre de l'avance). */
function chapterOrder(s: PlanSubject, date: Date): PlanChapter[] {
  const w = chapterWindows(s);
  const t = date.getTime();
  const day = Math.floor(t / 86_400_000);
  const cur = sortedChapters(s).filter((c) => { const x = w.get(c.id)!; return x.from.getTime() <= t && t < x.to.getTime(); });
  const domains = [...new Set(cur.map((c) => c.domain ?? ""))];
  const rot = domains.length > 1 ? day % domains.length : 0;
  cur.sort((a, b) => ((domains.indexOf(a.domain ?? "") - rot + domains.length) % domains.length) - ((domains.indexOf(b.domain ?? "") - rot + domains.length) % domains.length));
  const past = sortedChapters(s).filter((c) => w.get(c.id)!.to.getTime() <= t);
  const next = sortedChapters(s).filter((c) => w.get(c.id)!.from.getTime() > t).sort((a, b) => w.get(a.id)!.from.getTime() - w.get(b.id)!.from.getTime());
  return [...cur, ...past, ...next];
}

function nextLesson(s: PlanSubject, read: Set<string>, date = new Date()): { ch: PlanChapter; l: PlanLesson; idx: number } | null {
  for (const ch of chapterOrder(s, date)) {
    const ls = sortedLessons(ch);
    const i = ls.findIndex((x) => !read.has(x.id));
    if (i >= 0) return { ch, l: ls[i], idx: i + 1 };
  }
  return null;
}
function weakestChapter(s: PlanSubject, st: PlanState): PlanChapter | null {
  return sortedChapters(s).map((c) => ({ c, m: st.mastery.get(c.id) ?? 0 })).sort((x, y) => x.m - y.m)[0]?.c ?? null;
}
/** The chapter being worked on: the latest one with something read. */
function currentChapter(s: PlanSubject, read: Set<string>): PlanChapter | null {
  const chs = sortedChapters(s).filter((c) => c.lessons.some((l) => read.has(l.id)));
  return chs[chs.length - 1] ?? null;
}

export const coursHref = (code: string, chapterId: string, lessonId?: string, v: "cours" | "resume" = "cours") =>
  `/dashboard/cours?${new URLSearchParams({ s: code, c: chapterId, v, ...(lessonId ? { l: lessonId } : {}) }).toString()}`;
const qcuHref = (chapterId: string) => `/dashboard/examens/pratique?chapter=${chapterId}&notion=__all`;
const reviewHref = "/dashboard/examens/pratique?review=all";
const annalesHref = (code: string) => `/dashboard/examens/preparation/${code}?mode=examens`;

/**
 * One session. `read` is the (possibly simulated) set of read lessons, so future days of the
 * week preview the right next notions; it is advanced in place with what this day reads.
 */
export function buildDay(subjects: PlanSubject[], a: PlanAnswers, st: PlanState, frame: WeekFrame, date: Date, read: Set<string> = new Set(st.read), isToday = true): DayPlan {
  const weekday = weekdayOf(date);
  const daysLeft = daysUntilExam(date);
  const phase = phaseFor(daysLeft);
  const base = { date: localDay(date), weekday, daysLeft, phase };
  const slot = frame.days[weekday];
  if (!a.days.includes(weekday) || !slot) return { ...base, rest: true, minutes: 0, subject: null, second: null, tasks: [] };

  const minutes = minutesFor(a, weekday);
  const s = subjects.find((x) => x.code === slot.main) ?? null;
  const s2 = slot.second ? subjects.find((x) => x.code === slot.second) ?? null : null;
  const tasks: PlanTask[] = [];

  // Échauffement — spaced reviews (today: only if some are due)
  const warmWanted = a.weakness === "oubli" ? 10 : 5;
  const warm = isToday ? (st.due > 0 ? Math.min(warmWanted, Math.round(minutes * 0.3)) : 0) : (minutes >= 30 ? warmWanted : 0);
  if (warm > 0) {
    tasks.push({ key: "rev", kind: "revision", block: "Échauffement", label: "Révisions du jour", detail: isToday ? `${st.due} question${st.due > 1 ? "s" : ""} à revoir avant d'oublier` : "Les questions qui arrivent à échéance", minutes: round5(warm), href: reviewHref });
  }
  if (!s) return { ...base, rest: false, minutes, subject: null, second: s2, tasks };

  const secondMin = s2 ? (minutes >= 60 ? 15 : 10) : 0;
  const restMin = Math.max(10, minutes - warm - secondMin);
  const coreShare = a.weakness === "pratique" ? 0.55 : 0.65;
  const core = a.weakness === "procrastination" ? Math.min(25, round5(restMin * coreShare)) : round5(restMin * coreShare);
  const recall = round5(restMin - core);
  const earlyAnnale = a.weakness === "stress" && weekday >= 5 && (phase.key === "fondations" || phase.key === "consolidation");

  let recallChapter: PlanChapter | null = null;
  const ctl = slot.controle && slot.controle.subject === s.code ? slot.controle : null;
  const ctlCh = ctl ? s.chapters.find((c) => c.id === ctl.chapterId) ?? null : null;
  if (ctl && ctlCh) {
    const ls = sortedLessons(ctlCh);
    const i = ls.findIndex((x) => !read.has(x.id));
    const when = `Contrôle ${dayName(ctl.date)}`;
    if (i >= 0) {
      tasks.push({ key: `cours:${ls[i].id}`, kind: "cours", block: "Cœur", label: ls[i].title, detail: `${when} · ${ctlCh.name} · cours ${i + 1} sur ${ls.length}`, minutes: core, href: coursHref(s.code, ctlCh.id, ls[i].id), subject: s.code, chapterId: ctlCh.id, lessonId: ls[i].id });
      read.add(ls[i].id);
    } else {
      tasks.push({ key: `serie:${ctlCh.id}:${base.date}`, kind: "serie", block: "Cœur", label: `Série · ${ctlCh.name}`, detail: `${when} · tout le chapitre, comme le jour J`, minutes: core, href: qcuHref(ctlCh.id), subject: s.code, chapterId: ctlCh.id });
    }
    recallChapter = ctlCh;
  } else if (phase.key === "simulation" || earlyAnnale) {
    tasks.push({ key: `annale:${s.code}:${base.date}`, kind: "annale", block: "Cœur", label: `Annale · ${s.name}`, detail: "Un sujet du national, chronométré", minutes: core, href: annalesHref(s.code), subject: s.code });
    recallChapter = weakestChapter(s, st);
  } else if (phase.key === "ligne") {
    const ch = weakestChapter(s, st);
    if (ch) {
      tasks.push({ key: `res:${ch.id}`, kind: "resume", block: "Cœur", label: `Résumé · ${ch.name}`, detail: s.name, minutes: core, href: coursHref(s.code, ch.id, undefined, "resume"), subject: s.code, chapterId: ch.id });
      recallChapter = ch;
    }
  } else {
    const nx = phase.key === "fondations" ? nextLesson(s, read, date) : null;
    if (nx) {
      tasks.push({ key: `cours:${nx.l.id}`, kind: "cours", block: "Cœur", label: nx.l.title, detail: `${s.name} · ${nx.ch.name} · cours ${nx.idx} sur ${nx.ch.lessons.length}`, minutes: core, href: coursHref(s.code, nx.ch.id, nx.l.id), subject: s.code, chapterId: nx.ch.id, lessonId: nx.l.id });
      read.add(nx.l.id);
      recallChapter = nx.ch;
    } else {
      const ch = weakestChapter(s, st);
      if (ch) tasks.push({ key: `serie:${ch.id}`, kind: "serie", block: "Cœur", label: `Série · ${ch.name}`, detail: `${s.name} · ta notion la plus fragile`, minutes: core, href: qcuHref(ch.id), subject: s.code, chapterId: ch.id });
    }
  }
  if (recallChapter) {
    tasks.push({ key: `qcu:${recallChapter.id}`, kind: "qcu", block: "Rappel", label: `QCU · ${recallChapter.name}`, detail: "Sans regarder le cours : c'est là que ça s'ancre", minutes: recall, href: qcuHref(recallChapter.id), subject: s.code, chapterId: recallChapter.id });
  }

  // 2e matière — a short touch so no subject waits a whole week
  if (s2) {
    const practice = s2.coeff >= 5 ? (currentChapter(s2, read) && chapterOrder(s2, date)[0]) || null : null; // QCU on what the class is on
    const nx = practice ? null : nextLesson(s2, read, date);
    if (practice) {
      tasks.push({ key: `qcu2:${practice.id}`, kind: "qcu", block: "2e matière", label: `QCU · ${practice.name}`, detail: `${s2.name} · le chapitre vu en classe`, minutes: secondMin, href: qcuHref(practice.id), subject: s2.code, chapterId: practice.id });
    } else if (nx) {
      tasks.push({ key: `lect:${nx.l.id}`, kind: "lecture", block: "2e matière", label: nx.l.title, detail: `${s2.name} · lecture courte`, minutes: secondMin, href: coursHref(s2.code, nx.ch.id, nx.l.id), subject: s2.code, chapterId: nx.ch.id, lessonId: nx.l.id });
      read.add(nx.l.id);
    } else {
      const ch = weakestChapter(s2, st);
      if (ch) tasks.push({ key: `qcu2:${ch.id}`, kind: "qcu", block: "2e matière", label: `QCU · ${ch.name}`, detail: `${s2.name} · pour garder le fil`, minutes: secondMin, href: qcuHref(ch.id), subject: s2.code, chapterId: ch.id });
    }
  }
  return { ...base, rest: false, minutes, subject: s, second: s2, tasks, why: slot.why };
}

/** The whole current week (Mon → Sun). Past days keep their subjects; tasks preview from today on. */
export function buildWeek(subjects: PlanSubject[], a: PlanAnswers, st: PlanState, frame: WeekFrame, now = new Date()): (DayPlan & { past: boolean })[] {
  const mon = mondayOf(now);
  const today = weekdayOf(now);
  const read = new Set(st.read);
  return ([0, 1, 2, 3, 4, 5, 6] as Weekday[]).map((d) => {
    const date = addDays(mon, d);
    if (d < today) {
      const slot = frame.days[d];
      const on = a.days.includes(d) && !!slot;
      return { date: localDay(date), weekday: d, rest: !on, minutes: on ? minutesFor(a, d) : 0, daysLeft: daysUntilExam(date), phase: phaseFor(daysUntilExam(date)),
        subject: on ? subjects.find((x) => x.code === slot!.main) ?? null : null, second: on && slot!.second ? subjects.find((x) => x.code === slot!.second) ?? null : null, tasks: [], why: slot?.why, past: true };
    }
    return { ...buildDay(subjects, a, st, frame, date, read, d === today), past: false };
  });
}

/** A task counts as done from what the student actually did today (no manual ticking). */
export type DoneToday = { read: Set<string>; practicedChapters: Set<string>; dueNow: number; attempts: number };
export function isDone(t: PlanTask, d: DoneToday): boolean {
  switch (t.kind) {
    case "revision": return d.dueNow === 0;
    case "cours": case "lecture": return !!t.lessonId && d.read.has(t.lessonId);
    case "qcu": case "serie": return !!t.chapterId && d.practicedChapters.has(t.chapterId);
    case "annale": return d.attempts >= 10;
    case "resume": return false;
  }
}

/* ---------------------------------------------------------------------------------------- */
/**
 * Roadmap to the BAC — a calm projection that follows the school year, not a race.
 * Each chapter has its window (chapterWindows). Statuses: fini · en cours (the class is on it,
 * or started) · à reprendre (window passed, not read here: taken back in Consolidation, never
 * shown as "late") · à venir (with its month).
 * Rythme conseillé = notions left / weeks left before the programme ends; the plan itself fixes
 * what fits in the student's sessions, the rest is seen in class and consolidated later.
 */
export type RoadChapter = { ch: PlanChapter; done: number; total: number; status: "fini" | "en cours" | "à reprendre" | "à venir"; from: Date };
export type RoadSubject = { s: PlanSubject; done: number; total: number; perWeek: number; advised: number; tracks: { domain: string; chapters: RoadChapter[] }[] };
export type Roadmap = { start: Date; end: Date; subjects: RoadSubject[] };

export function roadmap(subjects: PlanSubject[], a: PlanAnswers, st: PlanState, frame: WeekFrame, now = new Date()): Roadmap {
  const end = programmeEnd();
  const mains = new Map<string, number>(); const seconds = new Map<string, number>();
  for (const sl of Object.values(frame.days)) {
    if (!sl) continue;
    mains.set(sl.main, (mains.get(sl.main) ?? 0) + 1);
    if (sl.second) seconds.set(sl.second, (seconds.get(sl.second) ?? 0) + 1);
  }
  const t = now.getTime();
  const weeksLeft = Math.max(1, (end.getTime() - t) / (7 * 86_400_000));
  const out: RoadSubject[] = subjects.filter((s) => s.chapters.length).map((s) => {
    const w = chapterWindows(s);
    const perWeek = (mains.get(s.code) ?? 0) + (s.coeff < 5 ? (seconds.get(s.code) ?? 0) : 0);
    const byTrack = new Map<string, RoadChapter[]>();
    for (const ch of sortedChapters(s)) {
      const total = ch.lessons.length;
      const done = ch.lessons.filter((l) => st.read.has(l.id)).length;
      const win = w.get(ch.id)!;
      const status: RoadChapter["status"] = total > 0 && done === total ? "fini"
        : (win.from.getTime() <= t && t < win.to.getTime()) || done > 0 ? "en cours"
        : win.to.getTime() <= t ? "à reprendre" : "à venir";
      const k = ch.domain ?? "";
      byTrack.set(k, [...(byTrack.get(k) ?? []), { ch, done, total, status, from: win.from }]);
    }
    const all = [...byTrack.values()].flat();
    const total = all.reduce((x, c) => x + c.total, 0);
    const done = all.reduce((x, c) => x + c.done, 0);
    const ahead = all.filter((c) => c.status === "en cours" || c.status === "à venir").reduce((x, c) => x + (c.total - c.done), 0);
    return { s, done, total, perWeek, advised: Math.ceil(ahead / weeksLeft), tracks: [...byTrack.entries()].map(([domain, chapters]) => ({ domain, chapters })) };
  });
  return { start: schoolStart(), end, subjects: out };
}
