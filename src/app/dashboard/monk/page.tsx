"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { useAccess } from "@/lib/use-access";
import { TIERS, tierFor, nextTier, MonkBadge } from "@/components/monk/badges";
import {
  Dumbbell, Sun, BookOpen, Brain, Droplet, Moon, Ban, Timer, Target, Heart, Zap, PenLine, GraduationCap, Flame, Check, Plus, Trash2, Lock, Loader2, Award, AlertCircle, RotateCcw, X, type LucideIcon,
} from "lucide-react";

type Habit = { id: string; title: string; icon: string | null; is_core: boolean; position: number };
type Chk = { habit_id: string; day: string };
type Sync = { streak: number; best_streak: number; badge: boolean; gained_xp: number; new_milestones: number[] };

const ICONS: Record<string, LucideIcon> = {
  target: Target, grad: GraduationCap, dumbbell: Dumbbell, book: BookOpen, brain: Brain,
  water: Droplet, moon: Moon, ban: Ban, timer: Timer, heart: Heart, zap: Zap, pen: PenLine,
};
const ICON_KEYS = Object.keys(ICONS);
const iconFor = (k?: string | null): LucideIcon => (k && ICONS[k]) || Target;

const SUGGESTIONS: { title: string; icon: string }[] = [
  { title: "2h de révision", icon: "grad" }, { title: "30 min de sport", icon: "dumbbell" },
  { title: "Pas de scroll inutile", icon: "ban" }, { title: "Lecture 20 min", icon: "book" },
  { title: "Dormir avant minuit", icon: "moon" }, { title: "Méditation 10 min", icon: "brain" },
  { title: "Boire 2L d'eau", icon: "water" }, { title: "Révision active", icon: "pen" },
];

const pad = (n: number) => String(n).padStart(2, "0");
const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const TODAY = ymd(new Date());
const dateLabel = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

export default function MonkModePage() {
  const supabase = createBrowserSupabase();
  const router = useRouter();
  const access = useAccess();
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [checks, setChecks] = useState<Chk[]>([]);
  const [sync, setSync] = useState<Sync>({ streak: 0, best_streak: 0, badge: false, gained_xp: 0, new_milestones: [] });
  const [busy, setBusy] = useState<string | null>(null);
  const [celebrate, setCelebrate] = useState<number | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const runSync = useCallback(async () => {
    const { data } = await supabase.rpc("monk_sync");
    if (data) {
      const s = data as Sync;
      setSync(s);
      if (s.new_milestones && s.new_milestones.length) setCelebrate(Math.max(...s.new_milestones));
    }
    return data as Sync | null;
  }, [supabase]);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);
    const since = new Date(); since.setDate(since.getDate() - 400);
    const [{ data: h, error: he }, { data: c, error: ce }] = await Promise.all([
      supabase.from("monk_habits").select("id, title, icon, is_core, position").eq("active", true).order("position"),
      supabase.from("monk_checks").select("habit_id, day").gte("day", ymd(since)),
    ]);
    if (he || ce) { setErr((he ?? ce)!.message); setReady(true); return; }
    setErr("");
    setHabits((h ?? []) as Habit[]);
    setChecks((c ?? []) as Chk[]);
    await runSync();
    setReady(true);
  }, [supabase, runSync]);

  useEffect(() => { load(); }, [load]);

  const core = useMemo(() => habits.filter((h) => h.is_core), [habits]);
  const extras = useMemo(() => habits.filter((h) => !h.is_core), [habits]);
  const todaySet = useMemo(() => new Set(checks.filter((c) => c.day === TODAY).map((c) => c.habit_id)), [checks]);
  const todayDone = core.length >= 4 && core.every((h) => todaySet.has(h.id));

  const streak = sync.streak;
  const tier = tierFor(streak);
  const next = nextTier(streak);
  const span = next ? next.day - tier.day : 1;
  const prog = next ? Math.min(100, Math.round(((streak - tier.day) / span) * 100)) : 100;

  async function toggle(habitId: string) {
    if (!userId || busy) return;
    if (access.monkExpired) { router.push("/payment"); return; }
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
    window.dispatchEvent(new Event("bacup:monk-changed")); // sidebar shine updates instantly
    await runSync();
    setBusy(null);
  }

  async function delHabit(id: string) {
    const { error } = await supabase.from("monk_habits").delete().eq("id", id);
    if (error) { setErr(error.message); return; }
    setHabits((hs) => hs.filter((h) => h.id !== id));
    setChecks((cs) => cs.filter((c) => c.habit_id !== id));
    await runSync();
  }

  async function doReset() {
    setConfirmReset(false);
    const { error } = await supabase.rpc("monk_reset");
    if (error) { setErr(error.message); return; }
    setChecks([]);
    await runSync();
  }

  if (!ready) return <div className="grid place-items-center h-64 text-neutral-400"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  if (err) {
    return (
      <div className="max-w-lg mx-auto py-16">
        <div className="glass rounded-3xl p-8 text-center">
          <AlertCircle className="w-10 h-10 mx-auto text-red-500" />
          <h1 className="mt-3 text-xl font-bold tracking-tight">Monk Mode indisponible</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300 break-words">{err}</p>
          <button onClick={() => { setReady(false); load(); }} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-5 py-2.5">Réessayer</button>
        </div>
      </div>
    );
  }

  if (core.length < 4) return <Setup supabase={supabase} userId={userId} onDone={load} />;

  const total = habits.length;

  return (
    <div className="max-w-5xl mx-auto py-8 fade-up">
      {celebrate !== null && <Celebration milestone={celebrate} onClose={() => setCelebrate(null)} />}
      {confirmReset && <ResetModal onConfirm={doReset} onCancel={() => setConfirmReset(false)} streak={streak} />}

      <div className="flex items-center gap-3">
        <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-arctic-cyan to-arctic-blue text-white grid place-items-center shadow-lg shadow-arctic-blue/30"><Sun className="w-6 h-6" /></span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Monk Mode</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Ta discipline, un jour à la fois.</p>
        </div>
        <button onClick={() => setConfirmReset(true)} className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full text-neutral-500 hover:text-red-500 hover:bg-red-500/10 transition">
          <RotateCcw className="w-3.5 h-3.5" /> Recommencer
        </button>
      </div>

      {access.monkExpired && (
        <div className="mt-6 rounded-2xl border border-arctic-blue/30 bg-arctic-blue/[0.06] p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-neutral-700 dark:text-neutral-200"><b>Ta démo Monk Mode (24h) est terminée.</b> Continue ta série avec l&apos;accès complet.</div>
          <Link href="/payment" className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white px-4 py-2">Obtenir l&apos;accès</Link>
        </div>
      )}

      <div className="mt-7 grid lg:grid-cols-2 gap-5">
        {/* LEFT: rank hero + ladder */}
        <div className="space-y-5">
          <div className="rounded-3xl p-8 text-center relative overflow-hidden ring-2 ring-arctic-blue/70 bg-white/50 dark:bg-white/[0.03] shadow-lg shadow-arctic-blue/10">
            <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl" style={{ background: `${tier.ring}22` }} />
            <div className="relative flex flex-col items-center">
              <MonkBadge tier={tier} size={92} />
              <div className="mt-3 text-6xl font-extrabold leading-none tracking-tight bg-gradient-to-br from-arctic-cyan to-arctic-blue bg-clip-text text-transparent">{streak}</div>
              <div className="mt-1 text-lg font-bold tracking-tight">jour{streak > 1 ? "s" : ""} · {tier.name}</div>
              <div className="mt-0.5 text-xs text-neutral-400">{tier.tagline}</div>
              {next ? (
                <div className="mt-4 w-full max-w-[240px]">
                  <div className="h-2 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue transition-all" style={{ width: `${prog}%` }} />
                  </div>
                  <div className="mt-1.5 text-[11px] text-neutral-400">{next.day - streak} jour{next.day - streak > 1 ? "s" : ""} pour devenir <b className="text-neutral-500 dark:text-neutral-300">{next.name}</b></div>
                </div>
              ) : (
                <div className="mt-4 text-xs font-semibold text-arctic-blue dark:text-arctic-cyan">Rang maximal atteint.</div>
              )}
              <div className="mt-3 text-[11px] text-neutral-400">Record : {sync.best_streak} j</div>
            </div>
          </div>

          {/* Ladder */}
          <div className="glass rounded-3xl p-5">
            <div className="text-xs font-bold uppercase tracking-wide text-neutral-400 mb-3">Le chemin</div>
            <div className="space-y-1.5">
              {TIERS.filter((t) => t.day > 0).map((t) => {
                const unlocked = streak >= t.day;
                const isCurrent = t.key === tier.key;
                return (
                  <div key={t.key} className={`flex items-center gap-3 rounded-2xl px-3 py-2 ${isCurrent ? "bg-arctic-blue/10 ring-1 ring-arctic-blue/25" : ""}`}>
                    <MonkBadge tier={t} size={38} locked={!unlocked} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{t.name} <span className="text-[11px] font-normal text-neutral-400">· {t.day} j</span></div>
                      <div className="text-[11px] text-neutral-400 truncate">{t.tagline}</div>
                    </div>
                    <div className={`text-[11px] font-bold ${unlocked ? "text-emerald-500" : "text-neutral-400"}`}>{unlocked ? <Check className="w-4 h-4" /> : `+${t.xp} XP`}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: today's habits */}
        <div className="glass rounded-3xl p-6 h-fit">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight capitalize">{dateLabel}</h2>
            {todayDone ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-500"><Check className="w-4 h-4" /> Jour validé</span>
            ) : (
              <span className="text-xs text-neutral-400">{core.filter((h) => todaySet.has(h.id)).length}/{core.length} non-négociables</span>
            )}
          </div>
          {!todayDone && <div className="mt-1 text-xs text-orange-500 font-medium">Coche tes 4 non-négociables pour {streak === 0 ? "lancer" : "faire monter"} ta série.</div>}
          {todayDone && <div className="mt-1 text-xs text-emerald-500 font-semibold">Journée validée. Reviens demain.</div>}

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

          {streak > 0 && <p className="mt-4 text-[11px] text-neutral-400 flex items-center gap-1.5"><Lock className="w-3 h-3" /> Tes non-négociables sont verrouillés tant que ta série est active.</p>}
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
      <span className={`w-9 h-9 rounded-xl grid place-items-center shrink-0 transition-transform group-hover:scale-110 ${checked ? "bg-arctic-blue/15 text-arctic-blue dark:text-arctic-cyan" : "bg-black/[0.04] dark:bg-white/[0.06] text-neutral-400"}`}><Icon className="w-5 h-5" /></span>
      <span className="flex-1 text-sm font-medium">{habit.title}</span>
      {onDelete && <button onClick={onDelete} title="Supprimer" className="w-8 h-8 rounded-lg text-neutral-300 dark:text-neutral-600 hover:text-red-500 hover:bg-red-500/10 grid place-items-center transition opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>}
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
    await supabase.from("monk_habits").insert({ user_id: userId, title: title.trim(), icon, is_core: false, position: nextPos, active: true });
    setSaving(false); setTitle(""); setOpen(false); onAdded();
  }
  if (!open) return <button onClick={() => setOpen(true)} className="w-full mt-1 inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-arctic-blue dark:text-arctic-cyan rounded-2xl border border-dashed border-arctic-blue/40 py-3 hover:bg-arctic-blue/5 transition"><Plus className="w-4 h-4" /> Ajouter une habitude bonus</button>;
  return (
    <div className="rounded-2xl border border-arctic-blue/30 p-3 space-y-2">
      <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nom de l'habitude" className="w-full bg-transparent text-sm px-2 py-1.5 outline-none border-b border-neutral-200 dark:border-neutral-700" />
      <div className="flex flex-wrap gap-1.5">
        {ICON_KEYS.map((k) => { const I = ICONS[k]; return <button key={k} onClick={() => setIcon(k)} className={`w-8 h-8 rounded-lg grid place-items-center ${icon === k ? "bg-arctic-blue text-white" : "bg-black/[0.04] dark:bg-white/[0.06] text-neutral-400"}`}><I className="w-4 h-4" /></button>; })}
      </div>
      <div className="flex gap-2 justify-end">
        <button onClick={() => setOpen(false)} className="text-xs font-semibold text-neutral-400 px-3 py-1.5">Annuler</button>
        <button onClick={add} disabled={saving || !title.trim()} className="text-xs font-semibold rounded-full bg-arctic-blue text-white px-4 py-1.5 disabled:opacity-50">{saving ? "…" : "Ajouter"}</button>
      </div>
    </div>
  );
}

function ResetModal({ onConfirm, onCancel, streak }: { onConfirm: () => void; onCancel: () => void; streak: number }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onCancel}>
      <div className="glass rounded-3xl p-6 max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()}>
        <RotateCcw className="w-9 h-9 mx-auto text-orange-500" />
        <h3 className="mt-3 text-lg font-bold tracking-tight">Recommencer à zéro ?</h3>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Ta série de {streak} jour{streak > 1 ? "s" : ""} repart à 0. Ton record et tes badges restent acquis. Tu pourras aussi modifier tes non-négociables.</p>
        <div className="mt-5 flex gap-2">
          <button onClick={onCancel} className="flex-1 text-sm font-semibold rounded-full border border-neutral-200 dark:border-neutral-700 py-2.5">Annuler</button>
          <button onClick={onConfirm} className="flex-1 text-sm font-semibold rounded-full bg-orange-500 text-white py-2.5">Recommencer</button>
        </div>
      </div>
    </div>
  );
}

function Celebration({ milestone, onClose }: { milestone: number; onClose: () => void }) {
  const tier = TIERS.find((t) => t.day === milestone) ?? TIERS[TIERS.length - 1];
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <div className="glass rounded-3xl p-8 max-w-sm w-full text-center relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-600"><X className="w-5 h-5" /></button>
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl" style={{ background: `${tier.ring}33` }} />
        <div className="relative flex flex-col items-center">
          <div className="text-xs font-bold uppercase tracking-widest text-arctic-blue dark:text-arctic-cyan flex items-center gap-1.5"><Award className="w-4 h-4" /> Nouveau rang</div>
          <div className="mt-4"><MonkBadge tier={tier} size={110} /></div>
          <h3 className="mt-4 text-2xl font-extrabold tracking-tight">{tier.name}</h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{tier.tagline}</p>
          <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-amber-500 bg-amber-400/15 rounded-full px-4 py-1.5"><Zap className="w-4 h-4" /> +{tier.xp} XP</div>
          <button onClick={onClose} className="mt-5 w-full text-sm font-semibold rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white py-3">Continuer</button>
        </div>
      </div>
    </div>
  );
}

function Setup({ supabase, userId, onDone }: { supabase: ReturnType<typeof createBrowserSupabase>; userId: string | null; onDone: () => void }) {
  const [picked, setPicked] = useState<{ title: string; icon: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const toggle = (s: { title: string; icon: string }) =>
    setPicked((p) => p.find((x) => x.title === s.title) ? p.filter((x) => x.title !== s.title) : p.length >= 4 ? p : [...p, s]);
  async function start() {
    if (!userId || picked.length !== 4) return;
    setSaving(true);
    await supabase.from("monk_habits").insert(picked.map((s, i) => ({ user_id: userId, title: s.title, icon: s.icon, is_core: true, position: i, active: true })));
    setSaving(false); onDone();
  }
  return (
    <div className="max-w-xl mx-auto py-10 fade-up">
      <div className="text-center">
        <span className="inline-grid place-items-center w-16 h-16 rounded-3xl bg-gradient-to-br from-arctic-cyan to-arctic-blue text-white shadow-lg shadow-arctic-blue/30"><Sun className="w-8 h-8" /></span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Entre en Monk Mode</h1>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
          La science est claire : il faut <b>21 jours pour créer une habitude</b>, et <b>66 jours pour qu&apos;elle devienne automatique</b>.
          Choisis <b>4 non-négociables</b> — les choses que tu feras <i>chaque jour</i>, sans exception. Coche-les tous les jours pour faire monter ta série et gravir les rangs.
        </p>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {TIERS.filter((t) => t.day > 0).slice(0, 6).map((t) => <MonkBadge key={t.key} tier={t} size={34} locked />)}
      </div>

      <div className="glass rounded-3xl p-6 mt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-bold tracking-tight">Tes 4 non-négociables</div>
          <div className="text-xs text-neutral-400">{picked.length}/4</div>
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          {SUGGESTIONS.map((s) => {
            const on = !!picked.find((x) => x.title === s.title);
            const I = ICONS[s.icon] ?? Target;
            return (
              <button key={s.title} onClick={() => toggle(s)}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${on ? "border-arctic-blue bg-arctic-blue/[0.08]" : "border-neutral-200 dark:border-neutral-800 hover:border-arctic-blue/40"}`}>
                <span className={`w-9 h-9 rounded-xl grid place-items-center shrink-0 ${on ? "bg-arctic-blue text-white" : "bg-black/[0.04] dark:bg-white/[0.06] text-neutral-400"}`}><I className="w-5 h-5" /></span>
                <span className="flex-1 text-sm font-medium">{s.title}</span>
                {on && <Check className="w-4 h-4 text-arctic-blue dark:text-arctic-cyan" />}
              </button>
            );
          })}
        </div>
        <button onClick={start} disabled={picked.length !== 4 || saving}
          className="mt-5 w-full inline-flex items-center justify-center gap-2 text-sm font-semibold rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white py-3.5 disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Flame className="w-4 h-4" />}
          {picked.length === 4 ? "Commencer ma série" : `Choisis encore ${4 - picked.length}`}
        </button>
      </div>
    </div>
  );
}
