"use client";

/**
 * Monk Mode card for the dashboard.
 * Tick today's non-negotiables in place (optimistic, no page change), with an
 * Apple-Fitness-style ring for today (x/4) and a Duolingo-style week strip.
 * Data: monk_habits (is_core) + monk_checks; streak/XP synced via rpc("monk_sync").
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import {
  Flame, Sun, ChevronRight, Check, Target, GraduationCap, Dumbbell, BookOpen, Brain, Droplet, Moon, Ban,
  Timer, Heart, Zap, PenLine, Loader2, type LucideIcon,
} from "lucide-react";

type Habit = { id: string; title: string; icon: string | null };
type Chk = { habit_id: string; day: string };

const ICONS: Record<string, LucideIcon> = {
  target: Target, grad: GraduationCap, dumbbell: Dumbbell, book: BookOpen, brain: Brain,
  water: Droplet, moon: Moon, ban: Ban, timer: Timer, heart: Heart, zap: Zap, pen: PenLine,
};
const iconFor = (k?: string | null): LucideIcon => (k && ICONS[k]) || Target;
const pad = (n: number) => String(n).padStart(2, "0");
const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const DAY_LETTERS = ["L", "M", "M", "J", "V", "S", "D"];

export function MonkCard() {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const [state, setState] = useState<"loading" | "setup" | "ready">("loading");
  const [userId, setUserId] = useState<string | null>(null);
  const [core, setCore] = useState<Habit[]>([]);
  const [checks, setChecks] = useState<Chk[]>([]);
  const [syncedStreak, setSyncedStreak] = useState<number | null>(null);
  const [err, setErr] = useState("");
  const TODAY = ymd(new Date());

  useEffect(() => {
    let live = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const since = new Date(); since.setDate(since.getDate() - 120);
      const [{ data: h, error: he }, { data: c }] = await Promise.all([
        supabase.from("monk_habits").select("id, title, icon, is_core, position").eq("active", true).order("position"),
        supabase.from("monk_checks").select("habit_id, day").gte("day", ymd(since)),
      ]);
      if (!live) return;
      setUserId(user.id);
      const coreHabits = ((h ?? []) as (Habit & { is_core: boolean })[]).filter((x) => x.is_core);
      if (he || coreHabits.length < 4) { setState("setup"); return; }
      setCore(coreHabits);
      setChecks((c ?? []) as Chk[]);
      setState("ready");
    })();
    return () => { live = false; };
  }, [supabase]);

  const byDay = useMemo(() => {
    const m = new Map<string, Set<string>>();
    for (const c of checks) { if (!m.has(c.day)) m.set(c.day, new Set()); m.get(c.day)!.add(c.habit_id); }
    return m;
  }, [checks]);
  const complete = useCallback((d: string) => { const s = byDay.get(d); return !!s && core.length > 0 && core.every((h) => s.has(h.id)); }, [byDay, core]);

  const todaySet = byDay.get(TODAY) ?? new Set<string>();
  const doneToday = core.filter((h) => todaySet.has(h.id)).length;
  const dayComplete = core.length > 0 && doneToday === core.length;

  // local streak = instant feedback; monk_sync's value wins once it answers
  const localStreak = useMemo(() => {
    const dt = new Date();
    if (!complete(ymd(dt))) dt.setDate(dt.getDate() - 1);
    let s = 0;
    for (let i = 0; i < 400; i++) { if (complete(ymd(dt))) { s++; dt.setDate(dt.getDate() - 1); } else break; }
    return s;
  }, [complete]);
  const streak = syncedStreak ?? localStreak;

  // current week, Monday first
  const week = useMemo(() => {
    const now = new Date();
    const monday = new Date(now); monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday); d.setDate(monday.getDate() + i);
      const key = ymd(d);
      return { key, letter: DAY_LETTERS[i], done: complete(key), today: key === TODAY, future: key > TODAY };
    });
  }, [complete, TODAY]);

  async function toggle(habitId: string) {
    if (!userId) return;
    const has = todaySet.has(habitId);
    setErr("");
    // optimistic update
    setChecks((cs) => has ? cs.filter((c) => !(c.habit_id === habitId && c.day === TODAY)) : [...cs, { habit_id: habitId, day: TODAY }]);
    const { error } = has
      ? await supabase.from("monk_checks").delete().eq("habit_id", habitId).eq("day", TODAY)
      : await supabase.from("monk_checks").insert({ user_id: userId, habit_id: habitId, day: TODAY });
    if (error) {
      setChecks((cs) => has ? [...cs, { habit_id: habitId, day: TODAY }] : cs.filter((c) => !(c.habit_id === habitId && c.day === TODAY)));
      setErr("Impossible d'enregistrer. Réessaie.");
      return;
    }
    const { data } = await supabase.rpc("monk_sync");
    if (data && typeof (data as { streak?: number }).streak === "number") setSyncedStreak((data as { streak: number }).streak);
  }

  return (
    <div className="glass rounded-3xl ring-2 ring-arctic-blue/70 p-5 h-full min-h-[280px] flex flex-col relative overflow-hidden">
      <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-arctic-blue/10 blur-3xl" />
      <div className="relative flex items-center justify-between mb-4">
        <span className="text-sm font-semibold inline-flex items-center gap-2"><Sun className="w-4 h-4 text-arctic-blue dark:text-arctic-cyan" /> Monk Mode</span>
        <div className="flex items-center gap-2">
          {state === "ready" && (
            <span className="inline-flex items-center gap-1 text-xs font-bold tabular-nums px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <Flame className="w-3 h-3" /> {streak} j
            </span>
          )}
          <Link href="/dashboard/monk" aria-label="Ouvrir Monk Mode" className="text-neutral-400 hover:text-arctic-blue transition"><ChevronRight className="w-4 h-4" /></Link>
        </div>
      </div>

      <div className="relative flex-1">

        {state === "loading" && <div className="relative h-full min-h-[200px] grid place-items-center text-neutral-400"><Loader2 className="w-5 h-5 animate-spin" /></div>}

        {state === "setup" && (
          <div className="relative h-full min-h-[200px] grid place-items-center text-center">
            <div>
              <div className="text-lg font-bold tracking-tight">Lance ta discipline</div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 mb-4">4 non-négociables, une série qui monte.</p>
              <Link href="/dashboard/monk" className="inline-flex items-center gap-2 text-sm font-semibold rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white px-5 py-2.5 hover:brightness-105 transition"><Flame className="w-4 h-4" /> Démarrer</Link>
            </div>
          </div>
        )}

        {state === "ready" && (
          <div className="relative flex flex-col gap-4">
            {/* ring + week */}
            <div className="flex items-center gap-4">
              <Ring done={doneToday} total={core.length} complete={dayComplete} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold tracking-tight">{dayComplete ? "Journée validée" : `${core.length - doneToday} à cocher aujourd'hui`}</div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">{dayComplete ? "Reviens demain pour garder ta série." : "Ne casse pas la chaîne."}</div>
                <div className="mt-3 flex items-center justify-between gap-1" aria-label="Cette semaine">
                  {week.map((d) => (
                    <div key={d.key} className="flex flex-col items-center gap-1">
                      <span className={`w-7 h-7 rounded-full grid place-items-center text-[10px] font-bold transition-all duration-300 ${
                        d.done ? "bg-gradient-to-br from-arctic-cyan to-arctic-blue text-white shadow-sm shadow-arctic-blue/30"
                        : d.today ? "ring-2 ring-arctic-blue/70 text-arctic-blue dark:text-arctic-cyan"
                        : d.future ? "bg-black/[0.03] dark:bg-white/[0.04] text-neutral-300 dark:text-neutral-600"
                        : "bg-black/[0.05] dark:bg-white/[0.07] text-neutral-400"}`}>
                        {d.done ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : d.letter}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* today's habits — tap to tick */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {core.map((h) => {
                const on = todaySet.has(h.id);
                const Icon = iconFor(h.icon);
                return (
                  <button key={h.id} type="button" onClick={() => toggle(h.id)} aria-pressed={on}
                    className={`group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-all duration-200 active:scale-[0.97] ${
                      on ? "bg-arctic-blue/10 ring-1 ring-arctic-blue/30" : "bg-white/60 dark:bg-white/[0.04] ring-1 ring-black/[0.05] dark:ring-white/[0.06] hover:ring-arctic-blue/30"}`}>
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${on ? "text-arctic-blue dark:text-arctic-cyan" : "text-neutral-400"}`} />
                    <span className={`flex-1 min-w-0 truncate text-[13px] font-medium transition-colors ${on ? "text-neutral-500 dark:text-neutral-400" : ""}`}>{h.title}</span>
                    <span className={`w-5 h-5 rounded-full grid place-items-center shrink-0 transition-all duration-200 ${
                      on ? "bg-gradient-to-br from-arctic-cyan to-arctic-blue text-white scale-100" : "ring-1 ring-neutral-300 dark:ring-neutral-600 group-hover:ring-arctic-blue/50"}`}>
                      {on && <Check className="w-3 h-3" strokeWidth={3} />}
                    </span>
                  </button>
                );
              })}
            </div>
            {err && <div className="text-xs text-red-500">{err}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

/** Apple-Fitness-style ring: fills as today's habits are ticked. */
function Ring({ done, total, complete }: { done: number; total: number; complete: boolean }) {
  const size = 84, stroke = 9, r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const pct = total ? done / total : 0;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <defs>
          <linearGradient id="monkRing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0db8d3" />
            <stop offset="100%" stopColor="#1b7fdc" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-black/[0.06] dark:stroke-white/[0.08]" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#monkRing)" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
          style={{ transition: "stroke-dashoffset 600ms cubic-bezier(0.22, 1, 0.36, 1)", filter: complete ? "drop-shadow(0 0 6px rgba(13,184,211,.55))" : undefined }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-xl font-bold tabular-nums leading-none">{done}<span className="text-neutral-400 text-sm">/{total}</span></div>
          <div className="text-[9px] font-semibold text-neutral-400 mt-0.5">aujourd&apos;hui</div>
        </div>
      </div>
    </div>
  );
}
