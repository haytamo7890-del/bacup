"use client";

/**
 * « Aujourd'hui » — the Plan BAC on the dashboard. Three blocks (Échauffement · Cœur · Rappel),
 * one Commencer that opens the next unfinished one. Tasks tick themselves from what the student
 * actually did (cours read, QCU answered, reviews cleared): no manual checkbox.
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Play, CalendarDays } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { bookColors } from "@/components/course/subject-book";
import { frameFor, loadPlanContext, todayPlan, type PlanContext } from "@/lib/plan/data";
import { DAY_LONG, SLOT_HOUR, isDone, weekdayOf, type DayPlan, type DoneToday, type PlanAnswers, type PlanTask, type Weekday } from "@/lib/plan/engine";

export function TaskRows({ tasks, done, compact = false }: { tasks: PlanTask[]; done: DoneToday; compact?: boolean }) {
  const nextIdx = tasks.findIndex((t) => !isDone(t, done));
  return (
    <div className={`pt-list ${compact ? "pt-compact" : ""}`}>
      {tasks.map((t, i) => {
        const d = isDone(t, done);
        return (
          <Link key={t.key} href={t.href} title={compact ? `${t.block} · ${t.detail}` : undefined} className={`pt-row ${d ? "pt-done" : ""} ${i === nextIdx ? "pt-next" : ""}`}>
            <span className="pt-ck" aria-hidden>{d ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : i + 1}</span>
            <span className="pt-txt">
              <span className="pt-blk">{t.block}</span>
              <span className="pt-lbl block">{t.label}</span>
              <span className="pt-det block">{t.detail}</span>
            </span>
            <span className="pt-min">{t.minutes} min</span>
            <span className="sr-only">{d ? "fait" : "à faire"}</span>
          </Link>
        );
      })}
    </div>
  );
}

/** What the mascot needs to know about today's plan. null = no plan / not eligible. */
export type PlanDayInfo = { rest: boolean; subject: string; minutes: number; href: string | null; started: boolean; allDone: boolean; slot: PlanAnswers["slot"] } | null;

export function PlanTodayCard({ onDay }: { onDay?: (info: PlanDayInfo) => void } = {}) {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const [ctx, setCtx] = useState<PlanContext | null | undefined>(undefined);
  const [day, setDay] = useState<DayPlan | null>(null);

  useEffect(() => {
    let on = true;
    void loadPlanContext(supabase).then((c) => {
      if (!on) return;
      setCtx(c);
      const d = c ? todayPlan(c) : null;
      setDay(d);
      if (!onDay) return;
      if (!c?.plan || !d) { onDay(null); return; }
      const next = d.tasks.find((t) => !isDone(t, c.done)) ?? null;
      onDay({
        rest: d.rest, subject: d.subject ? `${d.subject.name}${d.second ? ` + ${d.second.name}` : ""}` : "Révisions", minutes: d.tasks.reduce((x, t) => x + t.minutes, 0),
        href: next?.href ?? null, started: d.tasks.some((t) => isDone(t, c.done)), allDone: d.tasks.length > 0 && !next, slot: c.plan.answers.slot,
      });
    });
    return () => { on = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const ice = { ["--c1" as string]: "#1B7FDC", ["--hi" as string]: "#7FE3F2" };

  if (ctx === undefined) return <section className="bh bh-sm h-full min-h-[240px] animate-pulse" style={ice} aria-busy />;
  if (!ctx) return null;

  if (!ctx.eligible) return (
    <section className="bh bh-sm h-full min-h-[240px]" style={ice}>
      <span className="bh-glow" aria-hidden /><span className="bh-spine" aria-hidden />
      <div className="relative">
        <div className="bh-eyebrow">Plan BAC</div>
        <h2 className="bh-title">Bientôt pour la 1BAC</h2>
        <p className="bh-meta max-w-md">Le plan jour par jour arrive pour l&apos;examen régional. En attendant, Cours et Préparation sont là.</p>
      </div>
    </section>
  );

  if (!ctx.plan || !day) return (
    <section className="bh bh-sm h-full min-h-[240px] flex flex-col" style={ice}>
      <span className="bh-glow" aria-hidden /><span className="bh-spine" aria-hidden />
      <div className="relative flex-1 flex flex-col">
        <div className="bh-eyebrow">Plan BAC</div>
        <h2 className="bh-title">Ton plan, jour après jour</h2>
        <p className="bh-meta max-w-md">5 questions, 2 minutes. Un plan construit sur la science de l&apos;apprentissage et calé sur ton emploi du temps.</p>
        <div className="pt-foot mt-auto pt-5">
          <Link href="/dashboard/plan" className="bh-btn bh-btn-primary"><CalendarDays className="w-4 h-4" /> Créer mon plan</Link>
        </div>
      </div>
    </section>
  );

  const col = day.subject ? bookColors(day.subject.code) : null;
  const vars = col ? { ["--c1" as string]: col.c1, ["--hi" as string]: col.hi } : ice;
  const slot = SLOT_HOUR[ctx.plan.answers.slot];

  if (day.rest) {
    const order = [1, 2, 3, 4, 5, 6, 7].map((k) => ((weekdayOf() + k) % 7) as Weekday);
    const frame = frameFor(ctx);
    const nextDay = order.find((d) => ctx.plan!.answers.days.includes(d));
    const nextCode = nextDay != null ? frame?.days[nextDay]?.main : undefined;
    const nextSubj = nextCode ? ctx.subjects.find((x) => x.code === nextCode) : undefined;
    return (
      <section className="bh bh-sm h-full min-h-[240px] flex flex-col" style={ice}>
        <span className="bh-glow" aria-hidden /><span className="bh-spine" aria-hidden />
        <div className="relative flex-1 flex flex-col">
          <div className="bh-eyebrow">Aujourd&apos;hui · {DAY_LONG[day.weekday]} · J-{day.daysLeft}</div>
          <h2 className="bh-title">Jour de repos</h2>
          <p className="bh-meta max-w-md">Le cerveau consolide aussi quand tu ne révises pas.{nextSubj && nextDay != null ? ` Prochaine séance : ${DAY_LONG[nextDay]}, ${nextSubj.name}.` : ""}</p>
          <div className="pt-foot mt-auto pt-5">
            <Link href="/dashboard/plan" className="bh-btn">Mon plan <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>
    );
  }

  const total = day.tasks.reduce((x, t) => x + t.minutes, 0);
  const next = day.tasks.find((t) => !isDone(t, ctx.done));
  const started = day.tasks.some((t) => isDone(t, ctx.done));
  return (
    <section className="bh bh-sm h-full min-h-[220px] flex flex-col" style={vars}>
      <span className="bh-glow" aria-hidden /><span className="bh-spine" aria-hidden />
      <div className="relative flex-1 flex flex-col">
        <div className="bh-eyebrow">Aujourd&apos;hui · {DAY_LONG[day.weekday]} · {slot} · J-{day.daysLeft}</div>
        <h2 className="bh-title pt-title">{day.subject?.name ?? "Révisions"}{day.second && <span className="opacity-60 font-semibold"> + {day.second.name}</span>} <span className="opacity-50 font-semibold">· {total} min</span></h2>
        {day.tasks.length > 0 ? <TaskRows tasks={day.tasks} done={ctx.done} compact /> : <p className="bh-meta mt-3">Rien de prévu pour aujourd&apos;hui.</p>}
        <div className="pt-foot mt-auto">
          {next ? (
            <Link href={next.href} className="bh-btn bh-btn-primary"><Play className="w-4 h-4" /> {started ? "Continuer" : "Commencer"}</Link>
          ) : day.tasks.length > 0 ? (
            <span className="bh-meta inline-flex items-center gap-2 !mt-0"><Check className="w-4 h-4" /> Séance terminée. Une journée gagnée.</span>
          ) : null}
          <Link href="/dashboard/plan" className="bh-btn">Mon plan</Link>
        </div>
      </div>
    </section>
  );
}
