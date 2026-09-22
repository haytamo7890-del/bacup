"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { useAccess } from "@/lib/use-access";
import {
  Dumbbell, BookOpen, Brain, Droplet, Moon, Ban, Timer, Target, Heart, Zap, PenLine,
  GraduationCap, Flame, Check, Plus, Trash2, Lock, Loader2, Sparkles, AlertCircle, type LucideIcon,
} from "lucide-react";

type Habit = { id: string; title: string; icon: string | null; is_core: boolean; position: number };
type Chk = { habit_id: string; day: string };

const ICONS: Record<string, LucideIcon> = {
  target: Target, grad: GraduationCap, dumbbell: Dumbbell, book: BookOpen, brain: Brain,
  water: Droplet, moon: Moon, ban: Ban, timer: Timer, heart: Heart, zap: Zap, pen: PenLine,
};
const ICON_KEYS = Object.keys(ICONS);
const iconFor = (k?: string | null): LucideIcon => (k && ICONS[k]) || Target;

const SUGGESTIONS: { title: string; icon: string }[] = [
  { title: "2h de révision", icon: "grad" },
  { title: "30 min de sport", icon: "dumbbell" },
  { title: "Pas de scroll inutile", icon: "ban" },
  { title: "Lecture 20 min", icon: "book" },
  { title: "Dormir avant minuit", icon: "moon" },
  { title: "Méditation 10 min", icon: "brain" },
  { title: "Boire 2L d'eau", icon: "water" },
  { title: "Révision active", icon: "pen" },
];

const pad = (n: number) => String(n).padStart(2, "0");
const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const TODAY = ymd(new Date());
const dateLabel = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

function targetFor(streak: number) {
  if (streak < 21) return 21;
  if (streak < 60) return 60;
  if (streak < 90) return 90;
  return (Math.floor(streak / 90) + 1) * 90;
}

export default function MonkModePage() {
  const supabase = createBrowserSupabase();
  const router = useRouter();
  const access = useAccess();
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [checks, setChecks] = useState<Chk[]>([]);
  const [bestStreak, setBestStreak] = useState(0);
  const [badge, setBadge] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);
    const since = new Date(); since.setDate(since.getDate() - 200);
    const [{ data: h, error: he }, { data: c, error: ce }, { data: s }] = await Promise.all([
      supabase.from("monk_habits").select("id, title, icon, is_core, position").eq("active", true).order("position"),
      supabase.from("monk_checks").select("habit_id, day").gte("day", ymd(since)),
      supabase.from("monk_settings").select("best_streak, monk_badge").eq("user_id", user.id).maybeSingle(),
    ]);
    if (he || ce) { setErr((he ?? ce)!.message); setReady(true); return; }
    setErr("");
    setHabits((h ?? []) as Habit[]);
    setChecks((c ?? []) as Chk[]);
    setBestStreak(s?.best_streak ?? 0);
    setBadge(s?.monk_badge ?? false);
    setReady(true);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const core = useMemo(() => habits.filter((h) => h.is_core), [habits]);
  const extras = useMemo(() => habits.filter((h) => !h.is_core), [habits]);

  const checksByDay = useMemo(() => {
    const m = new Map<string, Set<string>>();
    for (const c of checks) { if (!m.has(c.day)) m.set(c.day, new Set()); m.get(c.day)!.add(c.habit_id); }
    return m;
  }, [checks]);

  const complete = useCallback((day: string) => {
    if (core.length < 4) return false;
    const set = checksByDay.get(day);
    return !!set && core.every((h) => set.has(h.id));
  }, [core, checksByDay]);

  const streak = useMemo(() => {
    if (core.length < 4) return 0;
    const d = new Date();
    if (!complete(ymd(d))) d.setDate(d.getDate() - 1);
    let s = 0;
    for (let i = 0; i < 400; i++) {
      if (complete(ymd(d))) { s++; d.setDate(d.getDate() - 1); } else break;
    }
    return s;
  }, [core, complete]);

  const target = targetFor(streak);
  const daysLeft = Math.max(0, target - streak);
  const todaySet = checksByDay.get(TODAY) ?? new Set<string>();
  const todayDone = complete(TODAY);

  useEffect(() => {
    if (!userId || !ready) return;
    if (streak > bestStreak || (streak >= 90 && !badge)) {
      const nextBadge = badge || streak >= 90;
      supabase.from("monk_settings").upsert({ user_id: userId, best_streak: Math.max(streak, bestStreak), monk_badge: nextBadge, updated_at: new Date().toISOString() });
      setBestStreak((b) => Math.max(b, streak));
      setBadge(nextBadge);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streak, ready]);

  async function toggle(habitId: string) {
    if (!userId || busy) return;
    if (access.monkExpired) { router.push("/payment"); return; } // demo: 24h then gated
    const has = todaySet.has(habitId);
    setBusy(habitId); setErr("");
    if (has) {
      const { error } = await supabase.from("monk_checks").delete().eq("habit_id", habitId).eq("day", TODAY);
      if (error) { setErr(error.message); setBusy(null); return; }
      setChecks((cs) => cs.filter((c) => !(c.habit_id === habitId && c.day === TODAY)));
    } else {
      const { error } = await supabase.from("monk_checks").insert({ user_id: userId, habit_id: habitId, day: TODAY });
      if (error) { setErr(error.message); setBusy(null); return; }
      setChecks((cs) => [...cs, { habit_id: habitId, day: TODAY }]);
    }
    setBusy(null);
  }

  async function delHabit(id: string) {
    const { error } = await supabase.from("monk_habits").delete().eq("id", id);
    if (error) { setErr(error.message); return; }
    setHabits((hs) => hs.filter((h) => h.id !== id));
    setChecks((cs) => cs.filter((c) => c.habit_id !== id));
  }

  if (!ready) return <div className="grid place-items-center h-64 text-neutral-400"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  if (err) {
    return (
      <div className="max-w-lg mx-auto py-16">
        <div className="glass rounded-3xl p-8 text-center">
          <AlertCircle className="w-10 h-10 mx-auto text-red-500" />
          <h1 className="mt-3 text-xl font-bold tracking-tight">Monk Mode indisponible</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300 break-words">{err}</p>
          <p className="mt-2 text-xs text-neutral-400">Applique la migration <code>0009_monk_mode.sql</code> dans Supabase, puis recharge.</p>
          <button onClick={() => { setReady(false); load(); }} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-5 py-2.5">Réessayer</button>
        </div>
      </div>
    );
  }

  if (core.length < 4) return <Setup supabase={supabase} userId={userId} onDone={load} />;

  const total = habits.length;

  return (
    <div className="max-w-5xl mx-auto py-8 fade-up">
      <div className="flex items-center gap-3">
        <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-arctic-cyan to-arctic-blue text-white grid place-items-center shadow-lg shadow-arctic-blue/30"><Flame className="w-6 h-6" /></span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Monk Mode</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Ta discipline, un jour à la fois.</p>
        </div>
        {badge && (
          <span className="ml-auto inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400/20 to-arctic-blue/20 text-amber-500 ring-1 ring-amber-400/30">
            <Sparkles className="w-3.5 h-3.5" /> Moine · 90 j
          </span>
        )}
      </div>

      {access.monkExpired && (
        <div className="mt-6 rounded-2xl border border-arctic-blue/30 bg-arctic-blue/[0.06] p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-neutral-700 dark:text-neutral-200"><b>Ta démo Monk Mode (24h) est terminée.</b> Continue ta série avec l’accès complet.</div>
          <Link href="/payment" className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white px-4 py-2">Obtenir l’accès</Link>
        </div>
      )}

      <div className="mt-7 grid lg:grid-cols-2 gap-5">
        {/* STREAK + GRID */}
        <div className="space-y-5">
          <div className="rounded-3xl p-9 text-center relative overflow-hidden ring-2 ring-arctic-blue/70 bg-white/50 dark:bg-white/[0.03] shadow-lg shadow-arctic-blue/10">
            <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-arctic-blue/15 blur-3xl" />
            <div className="relative text-8xl font-extrabold leading-none tracking-tight bg-gradient-to-br from-arctic-cyan to-arctic-blue bg-clip-text text-transparent">{streak}</div>
            <div className="relative mt-3 text-xl font-bold tracking-tight">jour{streak > 1 ? "s" : ""} de série</div>
            <div className="relative mt-1.5 text-sm text-neutral-400">{daysLeft} jour{daysLeft > 1 ? "s" : ""} restant{daysLeft > 1 ? "s" : ""} · cap {target}</div>
            {!todayDone && (
              <div className="relative mt-4 text-xs text-orange-500 font-medium">
                Coche tes 4 non-négociables aujourd&apos;hui pour {streak === 0 ? "lancer" : "faire monter"} ta série.
              </div>
            )}
            {todayDone && <div className="relative mt-4 text-xs text-emerald-500 font-semibold">Journée validée ✓ Reviens demain !</div>}
          </div>

          <div className="glass rounded-3xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold uppercase tracking-wide text-neutral-400">Cap actuel · {target} jours</div>
              <div className="text-xs text-neutral-400">21 → 60 → 90</div>
            </div>
            <div className="grid grid-cols-7 gap-2.5 justify-items-center">
              {Array.from({ length: target }, (_, k) => {
                const n = k + 1;
                const done = n <= streak;
                const current = n === streak + 1;
                return (
                  <div key={n} title={`Jour ${n}`}
                    className={`w-9 h-9 rounded-full grid place-items-center text-xs font-bold transition ${
                      done ? "bg-gradient-to-br from-arctic-cyan to-arctic-blue text-white shadow shadow-arctic-blue/30"
                      : current ? "ring-2 ring-arctic-blue text-arctic-blue dark:text-arctic-cyan"
                      : "bg-black/[0.04] dark:bg-white/[0.06] text-neutral-400"}`}>
                    {done ? <Check className="w-4 h-4" /> : n}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* TODAY'S HABITS */}
        <div className="glass rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight capitalize">{dateLabel}</h2>
            {todayDone ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-500"><Check className="w-4 h-4" /> Jour validé</span>
            ) : (
              <span className="text-xs text-neutral-400">{core.filter((h) => todaySet.has(h.id)).length}/{core.length} non-négociables</span>
            )}
          </div>

          <div className="mt-4 space-y-2.5">
            <div className="text-[11px] font-bold uppercase tracking-wide text-neutral-400">Non-négociables</div>
            {core.map((h) => (
              <HabitRow key={h.id} habit={h} checked={todaySet.has(h.id)} busy={busy === h.id}
                onToggle={() => toggle(h.id)} onDelete={streak === 0 ? () => delHabit(h.id) : undefined} locked={streak > 0} />
            ))}

            {extras.length > 0 && <div className="pt-2 text-[11px] font-bold uppercase tracking-wide text-neutral-400">Bonus</div>}
            {extras.map((h) => (
              <HabitRow key={h.id} habit={h} checked={todaySet.has(h.id)} busy={busy === h.id}
                onToggle={() => toggle(h.id)} onDelete={() => delHabit(h.id)} />
            ))}

            {total < 8 && <AddHabit supabase={supabase} userId={userId} nextPos={total} onAdded={load} />}
            {total >= 8 && <div className="text-center text-xs text-neutral-400 pt-1">Limite de 8 habitudes atteinte.</div>}
          </div>

          {streak > 0 && (
            <p className="mt-4 text-[11px] text-neutral-400 flex items-center gap-1.5"><Lock className="w-3 h-3" /> Tes non-négociables sont verrouillés tant que ta série est active.</p>
          )}
          {streak === 0 && core.length === 4 && (
            <p className="mt-4 text-[11px] text-neutral-400">Série à 0 : tu peux modifier tes non-négociables (icône corbeille).</p>
          )}
        </div>
      </div>
    </div>
  );
}

function HabitRow({ habit, checked, busy, onToggle, onDelete, locked }: {
  habit: Habit; checked: boolean; busy: boolean; onToggle: () => void; onDelete?: () => void; locked?: boolean;
}) {
  const Icon = iconFor(habit.icon);
  return (
    <div className={`group flex items-center gap-3 rounded-2xl border px-4 py-3.5 transition ${checked ? "border-arctic-blue/40 bg-arctic-blue/[0.06]" : "border-neutral-200 dark:border-neutral-800 hover:border-arctic-blue/40 hover:-translate-y-0.5"}`}>
      <span className={`w-9 h-9 rounded-xl grid place-items-center shrink-0 transition-transform group-hover:scale-110 ${checked ? "bg-arctic-blue/15 text-arctic-blue dark:text-arctic-cyan" : "bg-black/[0.04] dark:bg-white/[0.06] text-neutral-400"}`}>
        <Icon className="w-5 h-5" />
      </span>
      <span className="flex-1 text-sm font-medium">{habit.title}</span>
      {onDelete && (
        <button onClick={onDelete} title="Supprimer" className="w-8 h-8 rounded-lg text-neutral-300 dark:text-neutral-600 hover:text-red-500 hover:bg-red-500/10 grid place-items-center transition opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
      )}
      {locked && !onDelete && <Lock className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-600" />}
      <button onClick={onToggle} disabled={busy} title={checked ? "Décocher" : "Cocher"}
        className={`w-9 h-9 rounded-full grid place-items-center shrink-0 transition ${checked ? "bg-gradient-to-br from-arctic-cyan to-arctic-blue text-white shadow shadow-arctic-blue/30" : "ring-2 ring-neutral-300 dark:ring-neutral-700 text-transparent hover:ring-arctic-blue"}`}>
        {busy ? <Loader2 className="w-4 h-4 animate-spin text-neutral-400" /> : <Check className="w-5 h-5" />}
      </button>
    </div>
  );
}

function AddHabit({ supabase, userId, nextPos, onAdded }: {
  supabase: ReturnType<typeof createBrowserSupabase>; userId: string | null; nextPos: number; onAdded: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState(ICON_KEYS[0]);
  const [saving, setSaving] = useState(false);

  async function add() {
    if (!title.trim() || !userId) return;
    setSaving(true);
    await supabase.from("monk_habits").insert({ user_id: userId, title: title.trim(), icon, is_core: false, position: nextPos });
    setSaving(false); setTitle(""); setOpen(false); onAdded();
  }

  if (!open) return (
    <button onClick={() => setOpen(true)} className="w-full flex items-center justify-center gap-1.5 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 py-3 text-sm font-semibold text-neutral-500 hover:border-arctic-blue/60 hover:text-arctic-blue dark:hover:text-arctic-cyan transition">
      <Plus className="w-4 h-4" /> Ajouter une habitude bonus
    </button>
  );
  return (
    <div className="rounded-2xl border border-arctic-blue/30 p-3 space-y-2">
      <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex. 10 min de méditation"
        className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-arctic-blue" />
      <div className="flex flex-wrap gap-1.5">
        {ICON_KEYS.map((k) => { const I = ICONS[k]; return (
          <button key={k} onClick={() => setIcon(k)} className={`w-8 h-8 rounded-lg grid place-items-center transition ${icon === k ? "bg-arctic-blue/15 text-arctic-blue dark:text-arctic-cyan ring-1 ring-arctic-blue/40" : "bg-black/[0.04] dark:bg-white/[0.06] text-neutral-400 hover:text-neutral-600"}`}><I className="w-4 h-4" /></button>
        ); })}
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={() => setOpen(false)} className="text-sm font-semibold px-3 py-2 rounded-full text-neutral-500 hover:text-neutral-800 dark:hover:text-white">Annuler</button>
        <button onClick={add} disabled={saving || !title.trim()} className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white hover:brightness-105 transition disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Ajouter
        </button>
      </div>
    </div>
  );
}

function Setup({ supabase, userId, onDone }: {
  supabase: ReturnType<typeof createBrowserSupabase>; userId: string | null; onDone: () => void;
}) {
  const [items, setItems] = useState(Array.from({ length: 4 }, () => ({ title: "", icon: "target" })));
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const valid = items.every((i) => i.title.trim().length > 0);

  function setItem(i: number, patch: Partial<{ title: string; icon: string }>) {
    setItems((xs) => xs.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  }
  function applySuggestion(s: { title: string; icon: string }) {
    setItems((xs) => {
      if (xs.some((x) => x.title.trim() === s.title)) return xs;      // already added
      const i = xs.findIndex((x) => !x.title.trim());                  // first empty slot
      if (i < 0) return xs;
      return xs.map((x, j) => (j === i ? { title: s.title, icon: s.icon } : x));
    });
  }

  async function save() {
    if (!valid || !userId) return;
    setSaving(true); setErr("");
    const rows = items.map((it, i) => ({ user_id: userId, title: it.title.trim(), icon: it.icon, is_core: true, position: i }));
    const { error } = await supabase.from("monk_habits").insert(rows);
    if (error) { setErr(error.message); setSaving(false); return; }
    await supabase.from("monk_settings").upsert({ user_id: userId, best_streak: 0, monk_badge: false, updated_at: new Date().toISOString() });
    setSaving(false); onDone();
  }

  return (
    <div className="max-w-xl mx-auto py-10 fade-up">
      <div className="text-center">
        <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-arctic-cyan to-arctic-blue text-white grid place-items-center shadow-lg shadow-arctic-blue/30 mx-auto"><Flame className="w-7 h-7" /></span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Bienvenue en Monk Mode</h1>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
          Écris tes <span className="font-semibold text-neutral-800 dark:text-neutral-200">4 non-négociables</span> — tes habitudes de chaque jour. On commence par un cap de <span className="font-semibold">21 jours</span>, le temps d&apos;ancrer une habitude.
        </p>
      </div>

      {/* your own habits */}
      <div className="mt-7 space-y-3">
        {items.map((it, i) => {
          const Icon = iconFor(it.icon);
          return (
            <div key={i} className="glass rounded-2xl p-3 flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-arctic-blue/10 text-arctic-blue dark:text-arctic-cyan grid place-items-center shrink-0"><Icon className="w-5 h-5" /></span>
              <input value={it.title} onChange={(e) => setItem(i, { title: e.target.value })}
                placeholder={`Non-négociable ${i + 1}`} className="flex-1 bg-transparent text-sm font-medium outline-none" />
              <div className="hidden sm:flex gap-1">
                {ICON_KEYS.slice(0, 6).map((k) => { const I = ICONS[k]; return (
                  <button key={k} onClick={() => setItem(i, { icon: k })}
                    className={`w-7 h-7 rounded-lg grid place-items-center transition ${it.icon === k ? "bg-arctic-blue/15 text-arctic-blue dark:text-arctic-cyan" : "text-neutral-300 dark:text-neutral-600 hover:text-neutral-500"}`}><I className="w-3.5 h-3.5" /></button>
                ); })}
              </div>
            </div>
          );
        })}
      </div>

      {/* suggestions to help figure it out */}
      <div className="mt-5">
        <div className="text-[11px] font-bold uppercase tracking-wide text-neutral-400 mb-2">Besoin d&apos;inspiration ? Touche pour ajouter</div>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => {
            const I = iconFor(s.icon);
            const used = items.some((x) => x.title.trim() === s.title);
            return (
              <button key={s.title} onClick={() => applySuggestion(s)} disabled={used}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full transition ${used ? "opacity-40 cursor-default chip" : "chip hover:-translate-y-0.5 text-neutral-600 dark:text-neutral-300"}`}>
                <I className="w-3.5 h-3.5" /> {s.title}
              </button>
            );
          })}
        </div>
      </div>

      {err && <p className="mt-4 text-sm text-red-500">{err} — applique la migration 0009_monk_mode.sql dans Supabase.</p>}

      <button onClick={save} disabled={!valid || saving}
        className="mt-6 w-full rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white text-sm font-semibold py-3.5 hover:brightness-105 transition disabled:opacity-50 inline-flex items-center justify-center gap-2">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Flame className="w-4 h-4" />} Lancer mon Monk Mode
      </button>
      {!valid && <p className="mt-2 text-center text-xs text-neutral-400">Remplis tes 4 non-négociables pour commencer.</p>}
    </div>
  );
}
