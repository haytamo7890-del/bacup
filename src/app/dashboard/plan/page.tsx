"use client";

/**
 * /dashboard/plan — Plan BAC.
 *  · No plan yet (or ?edit=1): the questionnaire, one question per screen (5 steps, ~90 s).
 *  · Plan saved: the week at a glance, today's 3 blocks, and why the plan looks like this.
 * The engine is deterministic (src/lib/plan/engine.ts): no AI, every choice explainable.
 */
import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { ArrowRight, CalendarClock, Check, ChevronDown, ChevronLeft, Sunrise, School, Moon, Clock3, Brain, Dumbbell, Wind, Pencil, Play, RotateCcw, X } from "lucide-react";
import { Laureat } from "@/components/mascot/mascot";
import { bookColors } from "@/components/course/subject-book";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { useQueryState } from "@/lib/use-query-state";
import { subjectTheme } from "@/config/subjects";
import { loadPlanContext, roadmapFor, savePlan, weekPlan, type PlanContext } from "@/lib/plan/data";
import {
  DAY_LONG, DAY_SHORT, LEVEL_LABEL, PHASES, SLOT_HOUR, SLOT_LABEL, WEAKNESS_LABEL, chapterWindows, daysUntilExam, examDate, isDone, localDay, phaseFor, shortDate, weekFrame, weekdayOf,
  type Controle, type DayPlan, type DoneToday, type Level, type PlanAnswers, type Roadmap, type Slot, type Weakness, type Weekday,
} from "@/lib/plan/engine";

const MINUTES = [20, 30, 45, 60, 90];

export default function PlanPage() {
  return <Suspense fallback={null}><PlanInner /></Suspense>;
}

type Door = "bacup" | "custom";

function PlanInner() {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const q = useQueryState();
  const edit = q.get("edit"); // "new" → the two doors · "bacup" / "custom" → that flow · "1" → current mode
  const [ctx, setCtx] = useState<PlanContext | null | undefined>(undefined);

  useEffect(() => {
    let on = true;
    void loadPlanContext(supabase).then((c) => { if (on) setCtx(c); });
    return () => { on = false; };
  }, [supabase]);

  if (ctx === undefined) return <div className="max-w-3xl mx-auto py-10"><div className="h-40 rounded-3xl glass animate-pulse" /></div>;
  if (!ctx) return null;
  if (!ctx.eligible) return (
    <div className="max-w-xl mx-auto py-16 text-center">
      <h1 className="text-2xl font-bold tracking-tight">Le Plan BAC arrive bientôt pour la 1BAC</h1>
      <p className="mt-2 text-neutral-500">Pour l&apos;instant il est réservé à la 2BAC (examen national).</p>
      <Link href="/dashboard" className="pq-next mt-6">Retour au tableau de bord</Link>
    </div>
  );

  const reload = async () => { const c = await loadPlanContext(supabase); setCtx(c); };
  const save = (x: PlanAnswers) => savePlan(supabase, ctx.userId, x);
  const curMode: Door = ctx.plan?.answers.mode === "custom" ? "custom" : "bacup";
  const door: Door | null = edit === "bacup" || edit === "custom" ? edit : edit === "1" && ctx.plan ? curMode : null;

  if (!door && (!ctx.plan || edit === "new")) {
    return <Doors hasPlan={!!ctx.plan} onPick={(d) => q.set({ edit: d })} onCancel={ctx.plan ? () => q.up({ edit: null }) : undefined} />;
  }
  if (door) {
    return (
      <Questionnaire
        key={door}
        ctx={ctx}
        mode={door}
        onSaved={async () => { await reload(); q.set({ edit: null }, { replace: true }); }}
        onCancel={() => (ctx.plan ? q.up({ edit: null }) : q.up({ edit: null }))}
        save={save}
      />
    );
  }
  return <Overview ctx={ctx} save={save} reload={reload} onEdit={() => q.set({ edit: "1" })} onRestart={() => q.set({ edit: "new" })} />;
}

/** Entry: two doors. Same destination (the plan page), two ways in. */
function Doors({ hasPlan, onPick, onCancel }: { hasPlan: boolean; onPick: (d: Door) => void; onCancel?: () => void }) {
  return (
    <div className="pq">
      <div className="pq-top">
        <button type="button" className="pq-back" aria-label="Retour" disabled={!onCancel} onClick={onCancel}><ChevronLeft className="w-5 h-5" /></button>
      </div>
      <div className="pq-step">
        <div className="pq-eyebrow">{hasPlan ? "Recommencer mon plan" : "Plan BAC"}</div>
        <h1 className="pq-title">Comment tu veux avancer jusqu&apos;au BAC ?</h1>
        <p className="pq-sub">{hasPlan ? "Ta progression est gardée : seul le plan change." : "Dans les deux cas, l'app te montre chaque jour quoi faire, et suit pour toi."}</p>
        <div className="pq-body grid gap-3">
          <button type="button" className="pd pd-main" onClick={() => onPick("bacup")}>
            <span className="pd-medal" aria-hidden><Laureat /></span>
            <span className="pd-txt">
              <span className="pd-tag">Conseillé</span>
              <span className="pd-t">Plan Bac Up</span>
              <span className="pd-d">Ton Lauréat prépare ta semaine : 5 questions, 2 minutes. Il choisit les matières, les cours et les QCU, et s&apos;adapte à tes résultats.</span>
            </span>
            <ArrowRight className="w-5 h-5 pd-go" />
          </button>
          <button type="button" className="pd" onClick={() => onPick("custom")}>
            <span className="pd-ic" aria-hidden><Pencil className="w-5 h-5" /></span>
            <span className="pd-txt">
              <span className="pd-t">Je construis le mien</span>
              <span className="pd-d">Tu choisis tes matières jour par jour. On s&apos;occupe du reste : quel cours, quels QCU, ta feuille de route.</span>
            </span>
            <ArrowRight className="w-5 h-5 pd-go" />
          </button>
        </div>
      </div>
    </div>
  );
}

/** The moment between the last answer and the plan: short, honest, calm (no fake loading). */
function Building({ mode }: { mode: Door }) {
  const steps = mode === "custom"
    ? ["Tes jours et ton moment", "Tes matières, jour par jour", "Ta feuille de route jusqu'au BAC"]
    : ["Tes jours et ton moment", "Tes priorités, matière par matière", "Ta feuille de route jusqu'au BAC"];
  return (
    <div className="pq">
      <div className="pb">
        <span className="pb-medal" aria-hidden><Laureat /></span>
        <h1 className="pq-title text-center">{mode === "custom" ? "On met ta semaine en place" : "Ton Lauréat prépare ta semaine"}</h1>
        <ul className="pb-steps" aria-live="polite">
          {steps.map((t, i) => <li key={t} style={{ animationDelay: `${i * 420}ms` }}><Check className="w-4 h-4" strokeWidth={3} /> {t}</li>)}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------ */

function Questionnaire({ ctx, mode, save, onSaved, onCancel }: {
  ctx: PlanContext; mode: Door; save: (a: PlanAnswers) => Promise<boolean>; onSaved: () => void; onCancel?: () => void;
}) {
  const prev = ctx.plan?.answers;
  const order = mode === "custom" ? (["days", "time", "slot", "perday"] as const) : (["days", "time", "slot", "levels", "weak"] as const);
  const STEPS = order.length;
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<"fwd" | "back">("fwd");
  const [days, setDays] = useState<Weekday[]>(prev?.days ?? [0, 1, 2, 3, 4, 5]);
  const [minWeek, setMinWeek] = useState(prev?.minWeek ?? 45);
  const [minWeekend, setMinWeekend] = useState(prev?.minWeekend ?? 60);
  const [slot, setSlot] = useState<Slot | null>(prev?.slot ?? null);
  const [levels, setLevels] = useState<Record<string, Level>>(prev?.levels ?? {});
  const [weakness, setWeakness] = useState<Weakness | null>(prev?.weakness ?? null);
  const [saving, setSaving] = useState(false);
  const [building, setBuilding] = useState(false);
  const [err, setErr] = useState("");
  // custom: subjects per day — pre-filled with what Bac Up would propose for the chosen days (fast to adjust)
  const [perDayEdits, setPerDay] = useState<Partial<Record<Weekday, { main: string; second: string | null }>>>(() => prev?.custom ?? {});
  const proposal = useMemo(() => weekFrame(ctx.subjects, { v: 1, days, minWeek, minWeekend, slot: slot ?? "soir", levels: prev?.levels ?? {}, weakness: "pratique" }, ctx.state).days,
    [ctx.subjects, ctx.state, days, minWeek, minWeekend, slot, prev?.levels]);
  const perDay: Partial<Record<Weekday, { main: string; second: string | null }>> = Object.fromEntries(days.map((d) => {
    const p = proposal[d];
    return [d, perDayEdits[d] ?? (p ? { main: p.main, second: (d >= 5 ? minWeekend : minWeek) >= 30 ? p.second : null } : { main: ctx.subjects[0]?.code ?? "", second: null })];
  }));
  const cur = order[step];

  const go = (n: number) => {
    setDir(n > step ? "fwd" : "back"); setStep(n);
    document.getElementById("dash-main")?.scrollTo({ top: 0 }); // each question starts at the top
  };
  const later = (n: number) => setTimeout(() => go(n), 220); // let the tap register visually

  const rest = 7 - days.length;
  const hasWeekday = days.some((d) => d < 5);
  const hasWeekend = days.some((d) => d >= 5);
  const toggleDay = (d: Weekday) => {
    setDays((cur) => cur.includes(d) ? (cur.length > 4 ? cur.filter((x) => x !== d) : cur) : [...cur, d].sort((a, b) => a - b) as Weekday[]);
  };
  const allLevels = ctx.subjects.every((s) => levels[s.code]);

  const finish = async (w: Weakness) => {
    if (!slot) return;
    setSaving(true); setErr("");
    const keep = { controles: prev?.controles ?? [] };
    const answers: PlanAnswers = mode === "custom"
      ? { v: 1, mode: "custom", days, minWeek, minWeekend, slot, levels: prev?.levels ?? {}, weakness: w, custom: Object.fromEntries(days.map((d) => [d, perDay[d] ?? { main: ctx.subjects[0]?.code ?? "", second: null }])), ...keep }
      : { v: 1, mode: "bacup", days, minWeek, minWeekend, slot, levels, weakness: w, ...keep };
    const ok = await save(answers);
    setSaving(false);
    if (!ok) { setErr("Impossible d'enregistrer ton plan. Vérifie ta connexion et réessaie."); return; }
    setBuilding(true);
    setTimeout(onSaved, 1700);
  };
  if (building) return <Building mode={mode} />;

  return (
    <div className="pq">
      <div className="pq-top">
        <button type="button" className="pq-back" aria-label="Question précédente" disabled={step === 0 && !onCancel}
          onClick={() => (step === 0 ? onCancel?.() : go(step - 1))}><ChevronLeft className="w-5 h-5" /></button>
        <div className="pq-bar" aria-hidden><i style={{ transform: `scaleX(${(step + 1) / STEPS})` }} /></div>
        <span className="pq-count">{step + 1} / {STEPS}</span>
      </div>

      <div key={step} className="pq-step" data-dir={dir}>
        {cur === "days" && (
          <>
            <div className="pq-eyebrow">Ton rythme</div>
            <h1 className="pq-title">Quels jours tu peux travailler ?</h1>
            <p className="pq-sub">Les autres jours seront des jours de repos. Jusqu&apos;à trois par semaine.</p>
            <div className="pq-body">
              <div className="pq-days" role="group" aria-label="Jours de travail">
                {DAY_SHORT.map((d, i) => (
                  <button key={d} type="button" className="pq-day" aria-pressed={days.includes(i as Weekday)} onClick={() => toggleDay(i as Weekday)}>
                    {d}<small>{days.includes(i as Weekday) ? "travail" : "repos"}</small>
                  </button>
                ))}
              </div>
              <p className="pq-note"><b>{days.length} jours</b> de travail · <b>{rest}</b> jour{rest > 1 ? "s" : ""} de repos{days.length === 4 ? <span className="pq-warn"> · 3 jours de repos maximum</span> : null}</p>
            </div>
            <div className="pq-foot"><button type="button" className="pq-next" onClick={() => go(step + 1)}>Continuer <ArrowRight className="w-4 h-4" /></button></div>
          </>
        )}

        {cur === "time" && (
          <>
            <div className="pq-eyebrow">Ton temps</div>
            <h1 className="pq-title">Combien de temps par jour de travail ?</h1>
            <p className="pq-sub">Sois honnête : un plan tenu bat un plan ambitieux abandonné.</p>
            <div className="pq-body">
              {hasWeekday && (
                <>
                  <div className="pq-label">Du lundi au vendredi</div>
                  <div className="pq-pills" role="group" aria-label="Minutes en semaine">
                    {MINUTES.map((m) => <button key={m} type="button" className="pq-pill" aria-pressed={minWeek === m} onClick={() => setMinWeek(m)}>{m} min</button>)}
                  </div>
                </>
              )}
              {hasWeekend && (
                <>
                  <div className="pq-label">Le week-end</div>
                  <div className="pq-pills" role="group" aria-label="Minutes le week-end">
                    {MINUTES.map((m) => <button key={m} type="button" className="pq-pill" aria-pressed={minWeekend === m} onClick={() => setMinWeekend(m)}>{m} min</button>)}
                  </div>
                </>
              )}
            </div>
            <div className="pq-foot"><button type="button" className="pq-next" onClick={() => go(step + 1)}>Continuer <ArrowRight className="w-4 h-4" /></button></div>
          </>
        )}

        {cur === "slot" && (
          <>
            <div className="pq-eyebrow">Ton moment</div>
            <h1 className="pq-title">Quand tu travailles le mieux ?</h1>
            <p className="pq-sub">Un moment fixe, c&apos;est ce qui transforme une intention en habitude.</p>
            <div className="pq-body pq-opts">
              {([["matin", Sunrise, "Le matin", "Avant les cours"], ["apres", School, "Après l'école", "En rentrant"], ["soir", Moon, "Le soir", "Après le dîner"]] as const).map(([k, Icon, t, d]) => (
                <button key={k} type="button" className="pq-opt" aria-pressed={slot === k} onClick={() => { setSlot(k); later(step + 1); }}>
                  <span className="pq-ic"><Icon className="w-5 h-5" /></span>
                  <span><span className="pq-opt-t block">{t}</span><span className="pq-opt-d block">{d}</span></span>
                  <span className="pq-opt-r">{SLOT_HOUR[k]}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {cur === "levels" && (
          <>
            <div className="pq-eyebrow">Ton niveau</div>
            <h1 className="pq-title">Comment tu te sens dans chaque matière ?</h1>
            <p className="pq-sub">C&apos;est un point de départ. Tes résultats aux QCU prennent le relais au fil des semaines.</p>
            <div className="pq-body">
              {ctx.subjects.map((s) => (
                <div key={s.code} className="pq-subj">
                  <div className="pq-subj-n"><span className={`w-2.5 h-2.5 rounded-full shrink-0 ${subjectTheme(s.code).bar}`} /> <span className="truncate">{s.name}</span> <small>coeff. {s.coeff}</small></div>
                  <div className="pq-seg" role="group" aria-label={`Niveau en ${s.name}`}>
                    {([1, 2, 3, 4] as Level[]).map((l) => (
                      <button key={l} type="button" aria-pressed={levels[s.code] === l} onClick={() => setLevels((cur) => ({ ...cur, [s.code]: l }))}>{LEVEL_LABEL[l]}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="pq-foot"><button type="button" className="pq-next" disabled={!allLevels} onClick={() => go(step + 1)}>Continuer <ArrowRight className="w-4 h-4" /></button></div>
          </>
        )}

        {cur === "perday" && (
          <>
            <div className="pq-eyebrow">Ta semaine</div>
            <h1 className="pq-title">Quelles matières, quels jours ?</h1>
            <p className="pq-sub">Une matière principale par séance, et si tu veux une deuxième plus courte. On a pré-rempli avec une proposition équilibrée : change ce que tu veux.</p>
            <div className="pq-body grid gap-2.5">
              {days.map((d) => {
                const v = perDay[d] ?? { main: ctx.subjects[0]?.code ?? "", second: null };
                const set = (x: { main: string; second: string | null }) => setPerDay((p) => ({ ...p, [d]: x }));
                return (
                  <div key={d} className="pc-day">
                    <div className="pc-dn">{DAY_LONG[d]}<small>{d >= 5 ? minWeekend : minWeek} min</small></div>
                    <div className="pc-row" role="group" aria-label={`Matière principale ${DAY_LONG[d]}`}>
                      {ctx.subjects.map((s2) => (
                        <button key={s2.code} type="button" className="pc-chip" aria-pressed={v.main === s2.code}
                          onClick={() => set({ main: s2.code, second: v.second === s2.code ? null : v.second })}>
                          <i className={subjectTheme(s2.code).bar} />{s2.name}
                        </button>
                      ))}
                    </div>
                    {(d >= 5 ? minWeekend : minWeek) >= 30 && (
                      <div className="pc-row pc-row2" role="group" aria-label={`Deuxième matière ${DAY_LONG[d]}`}>
                        <span className="pc-plus">+ 10 min</span>
                        <button type="button" className="pc-chip pc-sm" aria-pressed={!v.second} onClick={() => set({ ...v, second: null })}>Aucune</button>
                        {ctx.subjects.filter((s2) => s2.code !== v.main).map((s2) => (
                          <button key={s2.code} type="button" className="pc-chip pc-sm" aria-pressed={v.second === s2.code} onClick={() => set({ ...v, second: s2.code })}>{s2.name}</button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {err && <p className="pq-note pq-warn">{err}</p>}
            <div className="pq-foot"><button type="button" className="pq-next" disabled={saving} onClick={() => void finish(prev?.weakness ?? "pratique")}>Créer ma semaine <ArrowRight className="w-4 h-4" /></button></div>
          </>
        )}

        {cur === "weak" && (
          <>
            <div className="pq-eyebrow">Dernière question</div>
            <h1 className="pq-title">Qu&apos;est-ce qui te freine le plus ?</h1>
            <p className="pq-sub">Le plan s&apos;ajuste : plus de révisions espacées, plus d&apos;entraînement, des séances qui démarrent plus vite.</p>
            <div className="pq-body pq-opts">
              {([
                ["procrastination", Clock3, "Un bloc principal court, facile à lancer"],
                ["oubli", Brain, "Plus de révisions espacées au début de chaque séance"],
                ["pratique", Dumbbell, "Plus de QCU, moins de lecture"],
                ["stress", Wind, "Des annales le week-end dès maintenant : le jour J te sera familier"],
              ] as const).map(([k, Icon, d]) => (
                <button key={k} type="button" className="pq-opt" aria-pressed={weakness === k} disabled={saving}
                  onClick={() => { setWeakness(k); void finish(k); }}>
                  <span className="pq-ic"><Icon className="w-5 h-5" /></span>
                  <span><span className="pq-opt-t block">{WEAKNESS_LABEL[k]}</span><span className="pq-opt-d block">{d}</span></span>
                </button>
              ))}
            </div>
            {err && <p className="pq-note pq-warn">{err}</p>}
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------ */
/* Overview — timeline (where you are) · this week as a calendar · roadmap to the BAC          */

function Overview({ ctx, onEdit, onRestart, save, reload }: {
  ctx: PlanContext; onEdit: () => void; onRestart: () => void; save: (a: PlanAnswers) => Promise<boolean>; reload: () => Promise<void>;
}) {
  const a = ctx.plan!.answers;
  const [ctlOpen, setCtlOpen] = useState(false);
  const todayIso = localDay();
  const controles = (a.controles ?? []).filter((c) => c.date >= todayIso).sort((x, y) => x.date.localeCompare(y.date));
  const setControles = async (next: Controle[]) => { if (await save({ ...a, controles: next })) await reload(); };
  const coach = a.mode === "custom" ? null : mascotName();
  const week = useMemo(() => weekPlan(ctx), [ctx]);
  const road = useMemo(() => roadmapFor(ctx), [ctx]);
  const left = daysUntilExam();
  const phase = phaseFor(left);
  const weekMin = a.days.reduce<number>((x, d) => x + (d >= 5 ? a.minWeekend : a.minWeek), 0);

  return (
    <div className="pl-page max-w-5xl mx-auto py-8 space-y-6">
      <section className="bh" style={{ ["--c1" as string]: "#1B7FDC", ["--hi" as string]: "#7FE3F2" }}>
        <span className="bh-glow" aria-hidden /><span className="bh-spine" aria-hidden />
        <div className="pl-j" aria-label={`J moins ${left} avant le BAC`}><b>J-{left}</b><span>avant le BAC</span></div>
        <div className="relative">
          <div className="bh-eyebrow">Plan BAC · Phase {phase.label}</div>
          <h1 className="bh-title">Ton plan</h1>
          <div className="bh-meta">{a.days.length} séances par semaine, {SLOT_LABEL[a.slot]} ({SLOT_HOUR[a.slot]}) · {(Math.round(weekMin / 6) / 10).toLocaleString("fr-FR")} h par semaine · {phase.hint}</div>
          <div className="bh-actions">
            <button type="button" onClick={() => setCtlOpen(true)} className="bh-btn bh-btn-primary"><CalendarClock className="w-4 h-4" /> J&apos;ai un contrôle</button>
            <button type="button" onClick={onEdit} className="bh-btn"><Pencil className="w-4 h-4" /> {a.mode === "custom" ? "Modifier ma semaine" : "Modifier mes réponses"}</button>
            <button type="button" onClick={onRestart} className="bh-btn"><RotateCcw className="w-4 h-4" /> Recommencer</button>
          </div>
          {controles.length > 0 && (
            <div className="pl-ctls">
              {controles.map((c) => {
                const sj = ctx.subjects.find((x) => x.code === c.subject);
                const ch = sj?.chapters.find((x) => x.id === c.chapterId);
                const [y, m, d] = c.date.split("-").map(Number);
                return (
                  <span key={`${c.subject}${c.date}`} className="pl-ctl">
                    Contrôle de {sj?.name ?? c.subject} · {DAY_LONG[weekdayOf(new Date(y, m - 1, d))]} {d}{ch ? ` · ${ch.name}` : ""}
                    <button type="button" aria-label="Retirer ce contrôle" onClick={() => void setControles((a.controles ?? []).filter((x) => x !== c))}><X className="w-3.5 h-3.5" /></button>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Timeline left={left} />
      <WeekCalendar week={week} done={ctx.done} title={coach ? `${coach} a préparé ta semaine` : "Ta semaine"} />
      {ctlOpen && <ControleSheet ctx={ctx} onClose={() => setCtlOpen(false)} onSave={async (c) => { await setControles([...(a.controles ?? []).filter((x) => x.date >= todayIso && !(x.subject === c.subject && x.date === c.date)), c]); setCtlOpen(false); }} />}
      {road && <RoadmapView road={road} />}

      <details className="glass rounded-3xl p-6 group">
        <summary className="font-semibold tracking-tight cursor-pointer list-none flex items-center justify-between">Pourquoi ce plan <ChevronDown className="w-4 h-4 opacity-50 transition group-open:rotate-180" /></summary>
        <ul className="mt-3 space-y-2.5 text-sm text-neutral-600 dark:text-neutral-300">
          <li><b>Chaque séance finit par des QCU.</b> Se tester retient mieux que relire (Dunlosky et al., 2013).</li>
          <li><b>Elle commence par tes révisions espacées.</b> Revoir juste avant d&apos;oublier fixe la mémoire (Cepeda et al., 2008).</li>
          <li><b>Deux matières par séance.</b> Une principale, une courte : aucune matière n&apos;attend une semaine, et le mélange entraîne à reconnaître la bonne méthode, comme au BAC.</li>
          <li><b>Le temps va où il rapporte le plus de points :</b> coefficient × ce qui te manque. Ton ressenti d&apos;abord, tes résultats ensuite.</li>
          <li><b>Mêmes jours, même heure.</b> « Si c&apos;est {DAY_LONG[a.days[0] ?? 0]} {SLOT_HOUR[a.slot]}, alors je fais ma séance » : un moment fixe double les chances de s&apos;y tenir (Gollwitzer &amp; Sheeran, 2006).</li>
          <li><b>Une feuille de route sans pression.</b> De la marge est prévue ; si tu prends de l&apos;avance, elle se voit, et si une semaine saute, le plan se recale sans te le reprocher.</li>
        </ul>
      </details>
    </div>
  );
}

function Timeline({ left }: { left: number }) {
  const exam = examDate();
  const start = new Date(exam.getFullYear() - 1, 8, 1); // 1 septembre
  const total = (exam.getTime() - start.getTime()) / 86_400_000;
  const segs = PHASES.map((p) => {
    const from = Math.min(total, p.from === Infinity ? total : p.from);
    return { ...p, w: Math.max(0, from - p.to) / total, startDay: from };
  });
  const elapsed = Math.min(1, Math.max(0, (total - left) / total));
  const current = phaseFor(left).key;
  return (
    <section className="glass rounded-3xl p-5 sm:p-6" aria-label="Ton année jusqu'au BAC">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-semibold tracking-tight">Ton année</h2>
        <span className="text-xs text-neutral-400 tabular-nums">1 sept. → {shortDate(exam)}</span>
      </div>
      <div className="tl mt-5">
        <div className="tl-bar">
          {segs.map((sg) => <span key={sg.key} title={`${sg.label} · ${sg.hint}`} className={`tl-seg tl-${sg.key} ${sg.key === current ? "tl-cur" : ""}`} style={{ flexGrow: sg.w }} />)}
          <i className="tl-fill" style={{ ["--x" as string]: elapsed }} aria-hidden />
          <span className="tl-run" style={{ ["--x" as string]: elapsed }} aria-hidden><span className="tl-here"><em>Aujourd&apos;hui · J-{left}</em></span></span>
        </div>
        <div className="tl-labels">
          {segs.map((sg) => (
            <div key={sg.key} style={{ flexGrow: sg.w }} title={sg.hint} className={`tl-lab ${sg.key === current ? "tl-lab-cur" : ""}`}>
              <b>{sg.label}</b>
              <span>{sg.to === 0 ? "dernière ligne" : `jusqu'à J-${sg.to}`}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WeekCalendar({ week, done, title }: { week: (DayPlan & { past: boolean })[]; done: DoneToday; title: string }) {
  const today = weekdayOf();
  const first = week[0] ? new Date(week[0].date + "T00:00") : new Date();
  const last = week[6] ? new Date(week[6].date + "T00:00") : new Date();
  return (
    <section aria-label="Cette semaine">
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <h2 className="font-semibold tracking-tight">{title}</h2>
        <span className="text-xs text-neutral-400">{shortDate(first)} → {shortDate(last)}</span>
      </div>
      <div className="wk">
        {week.map((d) => {
          const isToday = d.weekday === today;
          const date = new Date(d.date + "T00:00");
          const total = d.tasks.reduce((x, t) => x + t.minutes, 0) || d.minutes;
          const next = isToday ? d.tasks.find((t) => !isDone(t, done)) : undefined;
          return (
            <div key={d.date} className={`wk-d ${isToday ? "wk-today" : ""} ${d.past ? "wk-past" : ""} ${d.rest ? "wk-rest" : ""}`}>
              <div className="wk-h">
                <span>{DAY_SHORT[d.weekday]} <b>{date.getDate()}</b></span>
                {isToday ? <em>Aujourd&apos;hui</em> : !d.rest && <small>{total} min</small>}
              </div>
              {d.rest ? (
                <div className="wk-off"><Moon className="w-4 h-4" /> Repos</div>
              ) : (
                <>
                  <div className="wk-s">
                    {d.subject && <span className="wk-main"><i className={subjectTheme(d.subject.code).bar} />{d.subject.name}</span>}
                    {d.second && <span className="wk-sec"><i className={subjectTheme(d.second.code).bar} />{d.second.name}</span>}
                  </div>
                  {d.why && <p className="wk-why">{d.why}</p>}
                  {d.past ? (
                    <div className="wk-note">Passé</div>
                  ) : (
                    <ul className="wk-tasks">
                      {d.tasks.map((t) => {
                        const ok = isToday && isDone(t, done);
                        return (
                          <li key={t.key}>
                            <Link href={t.href} className={`wk-t ${ok ? "wk-ok" : ""}`} title={`${t.block} · ${t.detail}`}>
                              <span className="wk-tb">{ok ? <Check className="w-3 h-3" strokeWidth={3} /> : t.block === "Échauffement" ? "Révisions" : t.block}</span>
                              <span className="wk-tl">{t.label}</span>
                              <span className="wk-tm">{t.minutes} min</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  {isToday && next && <Link href={next.href} className="wk-go"><Play className="w-3.5 h-3.5" /> {d.tasks.some((t) => isDone(t, done)) ? "Continuer" : "Commencer"}</Link>}
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

const DOMAIN_LABEL: Record<string, string> = { physique: "Physique", chimie: "Chimie", geologie: "Géologie", biologie: "Biologie" };

function RoadmapView({ road }: { road: Roadmap }) {
  return (
    <section aria-label="Feuille de route jusqu'au BAC">
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <h2 className="font-semibold tracking-tight">Feuille de route</h2>
        <span className="text-xs text-neutral-400">Suit l&apos;année scolaire · fin du programme vers le {shortDate(road.end)}</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 items-start">
        {road.subjects.map((r) => <RoadCard key={r.s.code} r={r} />)}
      </div>
    </section>
  );
}

/** One subject: where the class is, what comes next. Tap to unfold the chapters. */
function RoadCard({ r }: { r: Roadmap["subjects"][number] }) {
  const [open, setOpen] = useState(false);
  const col = bookColors(r.s.code);
  const all = r.tracks.flatMap((t) => t.chapters.map((c) => ({ ...c, domain: t.domain })));
  const multi = r.tracks.length > 1;
  const now = r.tracks.map((t) => t.chapters.find((c) => c.status === "en cours")).filter(Boolean).map((c) => c!).slice(0, 2);
  const next = all.filter((c) => c.status === "à venir").sort((x, y) => x.from.getTime() - y.from.getTime())[0];
  const label = (c: { ch: { name: string; domain: string | null } }) => (multi && c.ch.domain ? `${DOMAIN_LABEL[c.ch.domain] ?? c.ch.domain} · ` : "") + c.ch.name;
  const finished = r.total > 0 && r.done === r.total;
  const fits = r.advised <= Math.max(1, r.perWeek);
  return (
    <div className={`rc ${open ? "rc-open" : ""}`} style={{ ["--c1" as string]: col.c1, ["--hi" as string]: col.hi }}>
      <button type="button" className="rc-head" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span className="rc-top">
          <span className="rc-name">{r.s.name}</span>
          <span className="rc-coef">coeff. {r.s.coeff}</span>
          <span className="rc-count">{r.done}<small>/{r.total}</small></span>
        </span>
        <span className="rc-seg" aria-label={`${r.done} notions lues sur ${r.total}`}>
          {all.map((c) => (
            <i key={c.ch.id} className={`rc-s rc-${c.status === "fini" ? "done" : c.status === "en cours" ? "now" : c.status === "à reprendre" ? "back" : "next"}`}
              style={{ flexGrow: Math.max(1, c.total), ["--p" as string]: c.total ? c.done / c.total : 0 }} />
          ))}
        </span>
        {finished ? (
          <span className="rc-k">Programme vu · place à la consolidation</span>
        ) : (
          <>
            <span className="rc-k">En ce moment</span>
            {now.length ? now.map((c) => <span key={c.ch.id} className="rc-v" dir="auto">{label(c)}</span>) : <span className="rc-v rc-mute">Révisions</span>}
            {next && (
              <>
                <span className="rc-k rc-k2">Ensuite · {MONTH_OF(next.from)}</span>
                <span className="rc-v rc-v2" dir="auto">{label(next)}</span>
              </>
            )}
          </>
        )}
        <ChevronDown className="rc-chev w-4 h-4" aria-hidden />
      </button>
      <div className="rc-more" aria-hidden={!open}>
        <div className="rc-more-in">
          {!finished && r.perWeek > 0 && (
            <p className="rc-pace">{fits
              ? `Le lycée avance d'environ ${r.advised} notion${r.advised > 1 ? "s" : ""} par semaine : tes séances suffisent.`
              : `Le lycée avance d'environ ${r.advised} notions par semaine. Tes séances fixent ${r.perWeek > 1 ? `les ${r.perWeek} plus utiles` : "la plus utile"}, le reste revient en consolidation.`}</p>
          )}
          {r.tracks.map((t) => (
            <div key={t.domain}>
              {multi && <div className="rc-dom">{DOMAIN_LABEL[t.domain] ?? t.domain}</div>}
              <ol className="rc-list">
                {t.chapters.map((c) => (
                  <li key={c.ch.id} className={`rc-li rc-li-${c.status === "fini" ? "done" : c.status === "en cours" ? "now" : c.status === "à reprendre" ? "back" : "next"}`}>
                    <span className="rc-dot" aria-hidden>{c.status === "fini" && <Check className="w-2.5 h-2.5" strokeWidth={3.5} />}</span>
                    <span className="rc-ln" dir="auto">{c.ch.name}</span>
                    <span className="rc-lw">{c.status === "fini" ? "" : c.status === "en cours" ? "en ce moment" : c.status === "à reprendre" ? "à reprendre" : MONTH_OF(c.from)}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
const MONTH_OF = (d: Date) => ["janv.", "févr.", "mars", "avril", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."][d.getMonth()];

/** Mascot name chosen by the student (same store as the médaillon), for the coach voice. */
function mascotName(): string {
  try { const v = localStorage.getItem("bacup.mascot.name"); return v ? (JSON.parse(v) as string) : "Ton Lauréat"; } catch { return "Ton Lauréat"; }
}

/** « J'ai un contrôle » — subject, chapter (pre-selected: the one the class is on), date. */
function ControleSheet({ ctx, onClose, onSave }: { ctx: PlanContext; onClose: () => void; onSave: (c: Controle) => Promise<void> }) {
  const [subject, setSubject] = useState(ctx.subjects[0]?.code ?? "");
  const sj = ctx.subjects.find((x) => x.code === subject);
  const [now] = useState(() => new Date().getTime());
  const classCh = useMemo(() => {
    if (!sj) return "";
    const w = chapterWindows(sj); const t = now;
    return [...sj.chapters].sort((x, y) => x.position - y.position).find((c) => { const x = w.get(c.id)!; return x.from.getTime() <= t && t < x.to.getTime(); })?.id ?? sj.chapters[0]?.id ?? "";
  }, [sj, now]);
  const [chapter, setChapter] = useState<string>("");
  const ch = chapter && sj?.chapters.some((c) => c.id === chapter) ? chapter : classCh;
  const days = useMemo(() => Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i + 1); return d; }), []);
  const [date, setDate] = useState(localDay(days[2]));
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, [onClose]);

  return createPortal(
    <div className="cs-veil" onClick={onClose}>
      <div className="cs" role="dialog" aria-modal="true" aria-label="Ajouter un contrôle" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight">J&apos;ai un contrôle</h2>
          <button type="button" className="pq-back" aria-label="Fermer" onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <p className="text-sm text-neutral-500 mt-1">Les séances des 4 jours d&apos;avant se concentrent sur ce chapitre, puis le plan reprend son cours.</p>
        <div className="pq-label">Matière</div>
        <div className="pc-row">
          {ctx.subjects.map((s2) => (
            <button key={s2.code} type="button" className="pc-chip" aria-pressed={subject === s2.code} onClick={() => { setSubject(s2.code); setChapter(""); }}>
              <i className={subjectTheme(s2.code).bar} />{s2.name}
            </button>
          ))}
        </div>
        <div className="pq-label">Chapitre</div>
        <select value={ch} onChange={(e) => setChapter(e.target.value)} className="cs-select" aria-label="Chapitre du contrôle">
          {[...(sj?.chapters ?? [])].sort((x, y) => x.position - y.position).map((c) => <option key={c.id} value={c.id}>{c.name}{c.id === classCh ? " (en ce moment en classe)" : ""}</option>)}
        </select>
        <div className="pq-label">Quel jour ?</div>
        <div className="cs-days">
          {days.map((d) => {
            const iso = localDay(d);
            return (
              <button key={iso} type="button" className="cs-day" aria-pressed={date === iso} onClick={() => setDate(iso)}>
                <small>{DAY_SHORT[weekdayOf(d)]}</small>{d.getDate()}
              </button>
            );
          })}
        </div>
        <div className="pq-foot">
          <button type="button" className="pq-next" disabled={!ch || busy} onClick={async () => { setBusy(true); await onSave({ subject, chapterId: ch, date }); setBusy(false); }}>
            Préparer ce contrôle <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
