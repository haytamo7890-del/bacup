"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import {
  Target, GraduationCap, CalendarCheck, AlertCircle, Award, Medal, Trophy, Crown,
  Stethoscope, Cpu, Briefcase, Compass, Flame, CalendarDays, Zap, RefreshCw,
  Clock, Brain, Dumbbell, HeartPulse, Timer, Sparkles, Layers, Library, TrendingUp,
  ArrowRight, Loader2, Check, ChevronDown, type LucideIcon,
} from "lucide-react";

type Opt = { label: string; value: string; note?: number; icon: LucideIcon };
type Q = { key: "target" | "ambition" | "consistency" | "blocker"; icon: LucideIcon; title: string; subtitle?: string; options: Opt[] };

const QUESTIONS: Q[] = [
  {
    key: "target", icon: Target, title: "Quelle mention tu veux décrocher ?", subtitle: "Vise haut — on t'y emmène.",
    options: [
      { label: "12 – 13 · Assez bien", value: "13", note: 13, icon: Award },
      { label: "14 – 15 · Bien", value: "15", note: 15, icon: Medal },
      { label: "16 – 17 · Très bien", value: "17", note: 17, icon: Trophy },
      { label: "18 – 20 · Excellence", value: "19", note: 19, icon: Crown },
    ],
  },
  {
    key: "ambition", icon: GraduationCap, title: "C'est quoi ton rêve derrière le BAC ?", subtitle: "Ta vraie raison de t'accrocher.",
    options: [
      { label: "Médecine / Santé", value: "Médecine", icon: Stethoscope },
      { label: "Ingénierie / Grandes écoles", value: "Ingénierie", icon: Cpu },
      { label: "Business / Économie", value: "Business", icon: Briefcase },
      { label: "Encore en réflexion", value: "Autre", icon: Compass },
    ],
  },
  {
    key: "consistency", icon: CalendarCheck, title: "Sois honnête : ta régularité en ce moment ?",
    options: [
      { label: "En feu, tous les jours", value: "daily", icon: Flame },
      { label: "Correct, quelques fois par semaine", value: "weekly", icon: CalendarDays },
      { label: "Sprint juste avant les contrôles", value: "cramming", icon: Zap },
      { label: "C'est mon point faible", value: "struggling", icon: RefreshCw },
    ],
  },
  {
    key: "blocker", icon: AlertCircle, title: "Ton plus gros obstacle aujourd'hui ?",
    options: [
      { label: "Je remets toujours à demain", value: "procrastination", icon: Clock },
      { label: "Je comprends mais j'oublie vite", value: "retention", icon: Brain },
      { label: "Je manque d'entraînement", value: "practice", icon: Dumbbell },
      { label: "Le stress me bloque le jour J", value: "stress", icon: HeartPulse },
    ],
  },
];

export default function QuizPage() {
  const router = useRouter();
  const supabase = createBrowserSupabase();
  const [ready, setReady] = useState(false);
  const [uid, setUid] = useState("");
  const [firstName, setFirstName] = useState("");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<"quiz" | "computing" | "reveal">("quiz");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }
      setUid(user.id);
      const { data: p } = await supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle();
      setFirstName((p?.display_name ?? "").split(" ")[0]);
      const { data: sp } = await supabase.from("student_profiles").select("level_id, track_id, status, quiz_done").eq("id", user.id).maybeSingle();
      if (!sp?.level_id || !sp?.track_id) { router.replace("/onboarding"); return; }
      if (sp.status === "active") { router.replace("/dashboard"); return; }
      if (sp.quiz_done) { router.replace(sp.status === "demo" ? "/dashboard" : "/payment"); return; }
      setReady(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function choose(q: Q, opt: Opt) {
    setAnswers((a) => ({ ...a, [q.key]: opt.value }));
    setTimeout(() => {
      if (step < QUESTIONS.length - 1) setStep((s) => s + 1);
      else { setPhase("computing"); setTimeout(() => setPhase("reveal"), 1900); }
    }, 220);
  }

  const target = useMemo(() => QUESTIONS[0].options.find((o) => o.value === answers.target)?.note ?? 16, [answers.target]);

  async function finish() {
    setSaving(true);
    await supabase.from("student_profiles").update({
      target_note: target, ambition: answers.ambition ?? null,
      consistency: answers.consistency ?? null, blocker: answers.blocker ?? null, quiz_done: true,
    }).eq("id", uid);
    await supabase.rpc("start_demo", { p_user: uid });
    router.push("/dashboard");
  }

  if (!ready) return <main className="min-h-screen grid place-items-center text-sm text-neutral-400"><Loader2 className="w-5 h-5 animate-spin" /></main>;

  const Qi = QUESTIONS[step].icon;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-[#0a0f16] dark:to-[#05080c] text-neutral-900 dark:text-neutral-100 px-6 py-10">
      {/* ambient */}
      <div className="pointer-events-none fixed -top-24 right-0 w-[420px] h-[420px] rounded-full bg-arctic-cyan/10 blur-3xl" />
      <div className="pointer-events-none fixed bottom-0 -left-16 w-[360px] h-[360px] rounded-full bg-arctic-blue/10 blur-3xl" />

      <div className="relative max-w-lg mx-auto">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-arctic-cyan to-arctic-blue text-white grid place-items-center font-extrabold text-sm">B</span>
          <span className="font-bold tracking-tight">Bac<span className="text-arctic-blue dark:text-arctic-cyan">-up</span></span>
        </div>

        {phase === "quiz" && (
          <>
            {/* segmented progress */}
            <div className="mt-6 flex gap-1.5">
              {QUESTIONS.map((_, i) => (
                <div key={i} className="h-1.5 flex-1 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                  <div className={`h-full bg-gradient-to-r from-arctic-cyan to-arctic-blue transition-all duration-500 ${i < step ? "w-full" : i === step ? "w-full" : "w-0"}`} />
                </div>
              ))}
            </div>

            <div className="mt-8 fade-up" key={step}>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-arctic-blue dark:text-arctic-cyan">
                <span className="w-7 h-7 rounded-lg bg-arctic-blue/10 grid place-items-center"><Qi className="w-4 h-4" /></span>
                Étape {step + 1} sur {QUESTIONS.length}
              </div>
              <h1 className="mt-3 text-2xl font-bold tracking-tight leading-snug">{QUESTIONS[step].title}</h1>
              {QUESTIONS[step].subtitle && <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{QUESTIONS[step].subtitle}</p>}

              <div className="mt-6 space-y-3">
                {QUESTIONS[step].options.map((o) => {
                  const active = answers[QUESTIONS[step].key] === o.value;
                  const OptIcon = o.icon;
                  return (
                    <button key={o.value} onClick={() => choose(QUESTIONS[step], o)}
                      className={`group w-full flex items-center gap-3.5 rounded-2xl border px-4 py-3.5 text-left font-medium transition ${active ? "border-arctic-blue bg-arctic-blue/10 -translate-y-0.5" : "glass border-transparent hover:-translate-y-0.5"}`}>
                      <span className={`w-10 h-10 rounded-xl grid place-items-center shrink-0 transition group-hover:scale-105 ${active ? "bg-gradient-to-br from-arctic-cyan to-arctic-blue text-white" : "bg-arctic-blue/10 text-arctic-blue dark:text-arctic-cyan"}`}><OptIcon className="w-5 h-5" /></span>
                      <span className="flex-1">{o.label}</span>
                      <span className={`w-5 h-5 rounded-full grid place-items-center transition ${active ? "bg-arctic-blue text-white scale-100" : "ring-1 ring-neutral-300 dark:ring-neutral-700 scale-90"}`}>{active && <Check className="w-3.5 h-3.5" />}</span>
                    </button>
                  );
                })}
              </div>

              {step > 0 && <button onClick={() => setStep((s) => s - 1)} className="mt-5 text-sm text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200">← Précédent</button>}
            </div>
          </>
        )}

        {phase === "computing" && <Computing />}

        {phase === "reveal" && (
          <Reveal firstName={firstName} target={target} ambition={answers.ambition} blocker={answers.blocker} consistency={answers.consistency} onContinue={finish} saving={saving} />
        )}
      </div>
    </main>
  );
}

function Computing() {
  const lines = ["Analyse de tes réponses", "Calcul de ta trajectoire", "Assemblage de ton plan"];
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((v) => Math.min(lines.length - 1, v + 1)), 620); return () => clearInterval(t); }, []);
  return (
    <div className="mt-24 text-center fade-up">
      <div className="relative w-16 h-16 mx-auto">
        <div className="absolute inset-0 rounded-full border-2 border-arctic-blue/20" />
        <Loader2 className="w-16 h-16 animate-spin text-arctic-blue dark:text-arctic-cyan" strokeWidth={1.25} />
      </div>
      <p className="mt-5 font-semibold tracking-tight">On construit ton plan personnalisé</p>
      <p className="mt-1 text-sm text-neutral-400 transition-all">{lines[i]}…</p>
    </div>
  );
}

function Reveal({ firstName, target, ambition, blocker, consistency, onContinue, saving }: {
  firstName: string; target: number; ambition?: string; blocker?: string; consistency?: string; onContinue: () => void; saving: boolean;
}) {
  const start = Math.max(8, target - 4);
  const reco = recommendedTools(blocker, consistency);
  const ambitionLine = ambition && ambition !== "Autre" ? ` pour viser ${ambition}` : "";
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <div className="mt-6 fade-up pb-8">
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-arctic-blue dark:text-arctic-cyan"><Sparkles className="w-4 h-4" /> Ton plan Bac-up</div>
        <button onClick={onContinue} disabled={saving} className="inline-flex items-center gap-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white px-3.5 py-1.5 transition-all duration-200 ease-out hover:brightness-110 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60">
          Activer <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <h1 className="mt-3 text-xl font-bold tracking-tight leading-snug">
        {firstName ? `${firstName}, ton objectif ` : "Ton objectif "}<span className="text-arctic-blue dark:text-arctic-cyan">{target}/20</span> est atteignable d&apos;ici juin{ambitionLine}.
      </h1>

      <div className="mt-4"><GrowthPanel start={start} target={target} /></div>

      <div className="mt-7">
        <div className="text-xs font-bold uppercase tracking-wide text-neutral-400">Tes outils pour atteindre {target}/20</div>
        <div className="mt-3 space-y-2.5">
          {TOOLS.map((t, i) => {
            const on = reco.has(t.key);
            const isOpen = openKey === t.key;
            return (
              <div key={t.key} className={`glass rounded-2xl overflow-hidden fade-up transition ${on ? "ring-1 ring-arctic-blue/40" : ""}`} style={{ animationDelay: `${0.08 + i * 0.07}s` }}>
                <button onClick={() => setOpenKey((k) => (k === t.key ? null : t.key))} className="w-full p-4 flex items-center gap-4 text-left">
                  <span className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${t.grad} text-white grid place-items-center shrink-0 shadow-sm`}><t.icon className="w-5 h-5" /></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold tracking-tight">{t.title}</span>
                      {on && <span className="text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-arctic-blue/15 text-arctic-blue dark:text-arctic-cyan">Pour toi</span>}
                    </div>
                    <div className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">{t.desc}</div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && <div className="px-4 pb-4"><ToolPreview k={t.key} /></div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* final CTA (static — no movement while scrolling) */}
      <div className="mt-8">
        <button onClick={onContinue} disabled={saving} className="w-full rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white text-sm font-bold py-4 shadow-xl shadow-arctic-blue/30 transition-all duration-200 ease-out hover:brightness-110 hover:shadow-2xl hover:shadow-arctic-blue/40 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 inline-flex items-center justify-center gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Activer mon plan · viser {target}/20 <ArrowRight className="w-4 h-4" />
        </button>
        <p className="mt-2 text-center text-[11px] text-neutral-400">Activation en 10–15 min · sans engagement</p>
      </div>
    </div>
  );
}

const TOOLS: { key: string; icon: LucideIcon; title: string; desc: string; grad: string }[] = [
  { key: "exam", icon: Timer, title: "Simulation d'examen", desc: "Annales chronométrées, notées /20, comme le jour J.", grad: "from-violet-500 to-violet-700" },
  { key: "content", icon: Layers, title: "Cours & annales réunis", desc: "Tout le programme et tous les sujets, au même endroit.", grad: "from-arctic-cyan to-arctic-blue" },
  { key: "monk", icon: Flame, title: "Monk Mode", desc: "Bâtis une série quotidienne et tiens la distance.", grad: "from-orange-500 to-orange-600" },
  { key: "ranking", icon: Trophy, title: "Classement national", desc: "Mesure-toi aux autres et reste compétitif.", grad: "from-amber-500 to-amber-600" },
  { key: "biblio", icon: Library, title: "Bibliothèque", desc: "Stocke tes fiches PDF et révise-les dans l'app.", grad: "from-emerald-500 to-emerald-700" },
  { key: "coach", icon: Sparkles, title: "Coach IA", desc: "Un plan qui s'adapte à toi, semaine après semaine.", grad: "from-cyan-500 to-cyan-700" },
];

function recommendedTools(blocker?: string, consistency?: string): Set<string> {
  const s = new Set<string>();
  if (blocker === "procrastination" || consistency === "struggling" || consistency === "cramming") s.add("monk");
  if (blocker === "retention") s.add("content");
  if (blocker === "stress" || blocker === "practice") s.add("exam");
  s.add("coach");
  return s;
}

function ToolPreview({ k }: { k: string }) {
  // Mini-replicas of the real in-app screens.
  const wrap = "mt-1 rounded-2xl border border-black/5 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.05] p-3 overflow-hidden";

  if (k === "monk") {
    return (
      <div className={wrap}>
        <div className="rounded-xl ring-1 ring-arctic-blue/50 bg-white/50 dark:bg-white/[0.03] p-3 flex items-center gap-4">
          <div className="text-center shrink-0">
            <div className="text-3xl font-extrabold leading-none bg-gradient-to-br from-arctic-cyan to-arctic-blue bg-clip-text text-transparent">5</div>
            <div className="text-[9px] text-neutral-400 mt-0.5">jours de série</div>
          </div>
          <div className="grid grid-cols-7 gap-1 flex-1">
            {Array.from({ length: 14 }).map((_, i) => (
              <span key={i} className={`aspect-square rounded-[3px] ${i < 5 ? "bg-gradient-to-br from-arctic-cyan to-arctic-blue" : i === 5 ? "ring-1 ring-arctic-blue" : "bg-black/10 dark:bg-white/10"}`} style={i < 5 ? { animation: "qz-fill 3s ease-in-out infinite", animationDelay: `${i * 0.16}s` } : undefined} />
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (k === "exam") {
    return (
      <div className={wrap + " space-y-2"}>
        <div className="glass rounded-lg px-3 py-1.5 flex items-center justify-between text-[10px]">
          <span className="font-semibold">Question 3 <span className="text-neutral-400">/ 12</span></span>
          <span className="font-bold text-violet-500 tabular-nums">02:41:07</span>
          <span className="rounded-full bg-emerald-600 text-white px-2 py-0.5 font-semibold">Terminer</span>
        </div>
        <div className="rounded-lg border border-violet-500 bg-violet-500/10 px-3 py-2 text-[10px] flex items-center gap-2"><span className="w-4 h-4 rounded bg-violet-500/20 text-violet-600 grid place-items-center font-bold">A</span> Réponse choisie</div>
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 px-3 py-2 text-[10px] flex items-center gap-2 opacity-70"><span className="w-4 h-4 rounded bg-black/10 dark:bg-white/10 grid place-items-center font-bold">B</span> Autre option</div>
      </div>
    );
  }
  if (k === "content") {
    const pads = [{ n: "Mathématiques", c: "6 chapitres", g: "from-orange-500 to-orange-600" }, { n: "Physique-Chimie", c: "5 chapitres", g: "from-violet-500 to-violet-700" }];
    return (
      <div className={wrap + " grid grid-cols-2 gap-2"}>
        {pads.map((p, i) => (
          <div key={i} className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-neutral-900 to-neutral-950 p-3 h-20">
            <span className={`absolute -bottom-5 left-1/2 -translate-x-1/2 w-2/3 h-12 rounded-full blur-2xl bg-gradient-to-br ${p.g} opacity-60`} />
            <div className="relative text-white text-xs font-extrabold leading-tight">{p.n}</div>
            <div className="relative text-[9px] text-white/50 mt-1">{p.c}</div>
          </div>
        ))}
      </div>
    );
  }
  if (k === "ranking") {
    const rows = [{ r: 1, n: "Yassir E.", xp: "1 240", me: false }, { r: 2, n: "Salma B.", xp: "1 110", me: false }, { r: 3, n: "Toi", xp: "980", me: true }];
    return (
      <div className={wrap + " space-y-1.5"}>
        {rows.map((row, i) => (
          <div key={i} className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[11px] ${row.me ? "bg-arctic-blue/10 ring-1 ring-arctic-blue/25" : ""}`} style={{ animation: "qz-slide .5s ease-out both", animationDelay: `${i * 0.12}s` }}>
            <span className={`w-4 text-center font-bold ${row.r <= 3 ? "text-arctic-blue dark:text-arctic-cyan" : "text-neutral-400"}`}>{row.r}</span>
            <span className="w-6 h-6 rounded-full bg-arctic-blue/15 grid place-items-center text-[9px] font-bold text-arctic-blue dark:text-arctic-cyan uppercase">{row.n.slice(0, 2)}</span>
            <span className="flex-1 font-medium truncate">{row.n}{row.me && <span className="ml-1 text-arctic-blue dark:text-arctic-cyan">(toi)</span>}</span>
            <span className="font-semibold">{row.xp} XP</span>
          </div>
        ))}
      </div>
    );
  }
  if (k === "biblio") {
    const files = [{ n: "Physique — résumé.pdf", s: "1.2 Mo", d: "bg-violet-500" }, { n: "Maths — annales.pdf", s: "2.4 Mo", d: "bg-orange-500" }, { n: "SVT — fiche.pdf", s: "640 Ko", d: "bg-emerald-500" }];
    return (
      <div className={wrap + " space-y-1.5"}>
        {files.map((f, i) => (
          <div key={i} className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5" style={{ animation: "qz-slide .5s ease-out both", animationDelay: `${i * 0.1}s` }}>
            <span className="w-7 h-7 rounded-md bg-red-500/10 text-red-500 grid place-items-center text-[8px] font-bold shrink-0">PDF</span>
            <span className="flex items-center gap-1.5 flex-1 min-w-0"><span className={`w-1.5 h-1.5 rounded-full ${f.d}`} /><span className="text-[11px] font-medium truncate">{f.n}</span></span>
            <span className="text-[10px] text-neutral-400">{f.s}</span>
          </div>
        ))}
      </div>
    );
  }
  // coach — mini analysis card
  return (
    <div className={wrap + " glass !bg-transparent space-y-2 text-[11px]"}>
      <div className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-md bg-gradient-to-br from-arctic-cyan to-arctic-blue" /><span className="font-semibold">Analyse de la semaine</span></div>
      <div><span className="font-bold text-emerald-500">Forces</span> <span className="text-neutral-500 dark:text-neutral-400">— Probabilités, dérivées</span></div>
      <div><span className="font-bold text-orange-500">À travailler</span> <span className="text-neutral-500 dark:text-neutral-400">— Limites &amp; continuité</span></div>
      <div className="w-28 h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden"><span className="block h-full bg-cyan-500" style={{ animation: "qz-type 2.4s ease-in-out infinite" }} /></div>
    </div>
  );
}

function AnimatedNum({ to, dur = 1800 }: { to: number; dur?: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0; const t0 = performance.now();
    const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2); // easeInOutCubic ≈ the curve
    const tick = (t: number) => { const p = Math.min(1, (t - t0) / dur); setV(to * ease(p)); if (p < 1) raf = requestAnimationFrame(tick); else setV(to); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [to, dur]);
  return <>{Math.round(v)}</>;
}

function GrowthPanel({ start, target }: { start: number; target: number }) {
  const [view, setView] = useState<"progress" | "perf">("progress");
  const gain = Math.max(1, target - start);
  const stats = view === "progress"
    ? [{ pre: "+", n: gain, suf: " pts", l: "sur ta moyenne" }, { pre: "×", n: 2, suf: "", l: "de régularité" }, { pre: "−", n: 40, suf: "%", l: "de stress aux examens" }]
    : [{ pre: "×", n: 5, suf: "", l: "d'entraînement ciblé" }, { pre: "×", n: 3, suf: "", l: "de maîtrise" }, { pre: "+", n: 30, suf: "%", l: "de confiance" }];
  const tabs = [
    { k: "progress" as const, label: "Progression", Icon: TrendingUp },
    { k: "perf" as const, label: "Performance", Icon: Sparkles },
  ];
  return (
    <div className="glass rounded-3xl p-4 sm:p-5">
      {/* toggle */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-1 p-1 rounded-2xl chip">
          {tabs.map((tb) => {
            const on = view === tb.k;
            return (
              <button key={tb.k} onClick={() => setView(tb.k)} className={`inline-flex items-center gap-2 text-sm font-semibold pl-1.5 pr-3.5 py-1 rounded-xl transition-all duration-200 ${on ? "bg-white dark:bg-white/10 shadow-sm text-neutral-900 dark:text-white" : "text-neutral-500 dark:text-neutral-400"}`}>
                <span className={`w-6 h-6 rounded-lg grid place-items-center transition-colors ${on ? "bg-gradient-to-br from-arctic-cyan to-arctic-blue text-white" : "bg-black/[0.05] dark:bg-white/10 text-neutral-400"}`}><tb.Icon className="w-3.5 h-3.5" /></span>
                {tb.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* stats over the exponential curve */}
      <div key={view} className="relative mt-4">
        <GrowthCurve />
        <div className="absolute inset-x-0 top-0 z-10 grid grid-cols-2 gap-x-3 gap-y-4 pr-14">
          {stats.map((st, i) => (
            <div key={i} className="flex gap-2.5 fade-up" style={{ animationDelay: `${0.1 + i * 0.08}s` }}>
              <span className="w-[3px] rounded-full bg-arctic-blue/40 self-stretch shrink-0" />
              <div className="min-w-0">
                <div className="text-[1.7rem] sm:text-3xl font-extrabold tracking-tight bg-gradient-to-br from-arctic-cyan to-arctic-blue bg-clip-text text-transparent leading-none tabular-nums">{st.pre}<AnimatedNum to={st.n} />{st.suf && <span className="text-base">{st.suf}</span>}</div>
                <div className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight">{st.l}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* month axis */}
      <div className="mt-2 flex justify-between text-[11px] text-neutral-400 px-1">
        {["Mars", "Avr", "Mai", "Juin"].map((m, i) => <span key={m} className={i === 3 ? "font-semibold text-arctic-blue dark:text-arctic-cyan" : ""}>{m}</span>)}
      </div>
    </div>
  );
}

function GrowthCurve() {
  const W = 340, H = 172, padX = 10, padTop = 22, padBot = 18, n = 48, k = 4.2;
  const pts = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const y0 = (Math.exp(k * t) - 1) / (Math.exp(k) - 1);
    return [padX + t * (W - padX * 2), (H - padBot) - y0 * (H - padTop - padBot)] as const;
  });
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${pts[n - 1][0].toFixed(1)},${H - padBot} L${pts[0][0].toFixed(1)},${H - padBot} Z`;
  const last = pts[n - 1];
  const grid = [0, 1, 2, 3].map((i) => padX + (i / 3) * (W - padX * 2));
  const pathRef = useRef<SVGPathElement>(null);
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    const L = el.getTotalLength();
    el.style.transition = "none";
    el.style.strokeDasharray = `${L}`;
    el.style.strokeDashoffset = `${L}`;
    el.getBoundingClientRect(); // force reflow so the hidden state paints first
    requestAnimationFrame(() => {
      el.style.transition = "stroke-dashoffset 1.9s cubic-bezier(.33,0,.2,1)";
      el.style.strokeDashoffset = "0";
      setDrawn(true);
    });
  }, []);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block overflow-visible">
      <defs>
        <linearGradient id="gcl" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#22d3ee" /><stop offset="1" stopColor="#1b7fdc" /></linearGradient>
        <linearGradient id="gcf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1b7fdc" stopOpacity="0.20" /><stop offset="1" stopColor="#1b7fdc" stopOpacity="0" /></linearGradient>
      </defs>
      {grid.map((x, i) => <line key={i} x1={x} y1={padTop - 8} x2={x} y2={H - padBot} className="stroke-black/[0.05] dark:stroke-white/[0.06]" strokeWidth="1" />)}
      <path d={area} fill="url(#gcf)" style={{ opacity: drawn ? 1 : 0, transition: "opacity 1s ease-out .4s" }} />
      <path ref={pathRef} d={line} fill="none" stroke="url(#gcl)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* glowing endpoint (in-SVG so it sits exactly on the line end) */}
      <circle cx={last[0]} cy={last[1]} r="11" fill="#1b7fdc" style={{ opacity: drawn ? 0.22 : 0, transition: "opacity .5s 1.5s" }} />
      <circle cx={last[0]} cy={last[1]} r="5" fill="#1b7fdc" stroke="#fff" strokeWidth="2.5"
        style={{ opacity: drawn ? 1 : 0, transform: drawn ? "scale(1)" : "scale(0)", transformOrigin: `${last[0]}px ${last[1]}px`, transition: "opacity .3s 1.6s, transform .5s cubic-bezier(.34,1.56,.64,1) 1.6s" }} />
    </svg>
  );
}

function ProjectionChart({ start, target }: { start: number; target: number }) {
  const W = 320, H = 130, padX = 10, padTop = 14, padBot = 26;
  const lo = 8, hi = 20, n = 5;
  const labels = ["Maintenant", "", "", "", "Juin"];
  const pts = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const ease = t * t * (3 - 2 * t);
    const note = start + (target - start) * ease;
    const x = padX + t * (W - padX * 2);
    const y = (H - padBot) - ((note - lo) / (hi - lo)) * (H - padTop - padBot);
    return [x, y] as const;
  });
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${pts[n - 1][0].toFixed(1)},${H - padBot} L${pts[0][0].toFixed(1)},${H - padBot} Z`;
  const last = pts[n - 1];

  const pathRef = useRef<SVGPathElement>(null);
  const [len, setLen] = useState(0);
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    if (pathRef.current) {
      setLen(pathRef.current.getTotalLength());
      requestAnimationFrame(() => requestAnimationFrame(() => setDrawn(true)));
    }
  }, []);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      <defs>
        <linearGradient id="qzl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#22d3ee" /><stop offset="1" stopColor="#1b7fdc" /></linearGradient>
        <linearGradient id="qzf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1b7fdc" stopOpacity="0.28" /><stop offset="1" stopColor="#1b7fdc" stopOpacity="0" /></linearGradient>
      </defs>
      {/* subtle gridlines */}
      {[0, 1, 2].map((g) => { const y = padTop + (g / 2) * (H - padTop - padBot); return <line key={g} x1={padX} y1={y} x2={W - padX} y2={y} className="stroke-black/[0.06] dark:stroke-white/[0.06]" strokeWidth="1" />; })}
      {/* area (fades in) */}
      <path d={area} fill="url(#qzf)" style={{ opacity: drawn ? 1 : 0, transition: "opacity 1.2s ease-out 0.3s" }} />
      {/* line (draws progressively) */}
      <path ref={pathRef} d={line} fill="none" stroke="url(#qzl)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
        style={{ strokeDasharray: len || undefined, strokeDashoffset: drawn ? 0 : len, transition: "stroke-dashoffset 1.6s ease-out" }} />
      {/* endpoints */}
      <circle cx={pts[0][0]} cy={pts[0][1]} r="3.5" className="fill-neutral-400" style={{ opacity: drawn ? 1 : 0, transition: "opacity 0.4s 0.2s" }} />
      <circle cx={last[0]} cy={last[1]} r="6" fill="#1b7fdc" stroke="#fff" strokeWidth="2.5" style={{ opacity: drawn ? 1 : 0, transform: drawn ? "scale(1)" : "scale(0)", transformOrigin: `${last[0]}px ${last[1]}px`, transition: "opacity 0.3s 1.5s, transform 0.4s cubic-bezier(.34,1.56,.64,1) 1.5s" }} />
      {/* x labels */}
      {labels.map((l, i) => l ? <text key={i} x={pts[i][0]} y={H - 8} textAnchor={i === 0 ? "start" : "end"} className="fill-neutral-400" fontSize="10" fontWeight="600">{l}</text> : null)}
    </svg>
  );
}
