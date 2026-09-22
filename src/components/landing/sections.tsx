"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, Flame, Brain, Timer, Zap, ChevronDown, Mail, BookOpen } from "lucide-react";
import { Reveal, Words, CountUp, MagneticButton, LogoMark, useScrollProgress } from "./primitives";

export type Level = "1bac" | "2bac";
const SEATS = { pct: 87, left: 40 };

/* ---------------------------------------------------------------- icons */
function WhatsIcon({ s = 20 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="12" fill="#25D366" />
      <path fill="#fff" d="M12 5a7 7 0 0 0-6 10.5L5 20l4.6-1.2A7 7 0 1 0 12 5zm4 9.9c-.2.5-1 1-1.4 1-.4 0-.8.1-2.7-.8-2.3-1-3.7-3.3-3.8-3.4-.1-.2-.9-1.2-.9-2.2s.5-1.5.7-1.7c.2-.2.4-.2.5-.2h.4c.2 0 .3 0 .5.4l.7 1.6c0 .2 0 .3 0 .4l-.4.4c-.1.2-.3.3-.1.5.1.3.7 1.1 1.4 1.7 1 .9 1.7 1.1 1.9 1.2.2 0 .3 0 .4-.1l.6-.7c.1-.2.3-.1.4-.1l1.5.7c.2.1.3.2.4.2 0 .2 0 .7-.1 1z" />
    </svg>
  );
}
function GmailIcon({ s = 20 }: { s?: number }) {
  return (
    <svg width={s} height={(s * 3) / 4} viewBox="0 0 48 36" aria-hidden>
      <path fill="#4285F4" d="M4 32V10l20 15L44 10v22h-6V19L24 29 10 19v13z" />
      <path fill="#EA4335" d="M4 6l20 15L44 6v4L24 25 4 10z" />
    </svg>
  );
}

/* wrappers */
function Sec({ id, alt, className = "", children }: { id?: string; alt?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={`relative ${alt ? "bg-[#0a1018]" : "bg-[#070b12]"} ${className}`}>
      {children}
    </section>
  );
}
const card = "rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur-sm";
const eyebrow = "text-xs font-bold tracking-[.14em] uppercase text-arctic-cyan";

/* =============================== HERO =============================== */
export function Hero({ onDemo, level, setLevel }: { onDemo: () => void; level: Level; setLevel: (l: Level) => void }) {
  return (
    <header className="relative overflow-hidden bg-[#070b12] px-5 pt-36 pb-24">
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[520px] rounded-full bg-arctic-cyan/20 blur-[150px] lz-drift" />
      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[1.05fr_1fr] gap-12 items-center">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#bfeaf2] bg-arctic-cyan/10 border border-arctic-cyan/25 px-3.5 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4bfde8] shadow-[0_0_8px_#4bfde8]" /> Conçu au Maroc · 1bac & 2bac
            </span>
          </Reveal>
          <h1 className="mt-6 font-display font-black text-[42px] sm:text-6xl leading-[1.02] text-white">
            <Words text="Réussis ton BAC." />
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-arctic-cyan to-[#4bfde8]">
              <Words text="Sans t’ennuyer." stagger={70} />
            </span>
          </h1>
          <Reveal delay={200}>
            <p className="mt-5 text-lg text-white/55 max-w-lg">
              Examens blancs notés /20, corrections détaillées et une IA qui t’explique tout. Le même espace, du premier chapitre à ton admission.
            </p>
          </Reveal>
          <Reveal delay={280}>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <MagneticButton href="/signup" className="rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white text-[15px] font-bold px-7 py-4 shadow-[0_12px_36px_rgba(27,127,220,.45)] hover:brightness-110 transition">
                Obtenir l’accès <ArrowRight className="w-4 h-4" />
              </MagneticButton>
              <button onClick={onDemo} className="rounded-full bg-white/[0.06] border border-white/12 text-white text-[15px] font-bold px-6 py-4 hover:bg-white/10 transition">
                Essaie la démo
              </button>
            </div>
          </Reveal>
          <Reveal delay={340}>
            <div className="mt-7 inline-flex gap-1.5 bg-white/[0.04] border border-white/10 p-1.5 rounded-2xl">
              {(["1bac", "2bac"] as Level[]).map((lv) => (
                <button key={lv} onClick={() => setLevel(lv)} className={`px-5 py-2.5 rounded-xl text-left transition ${level === lv ? "bg-gradient-to-br from-arctic-cyan/18 to-arctic-blue/18 ring-1 ring-arctic-cyan/40" : ""}`}>
                  <span className={`block font-display font-bold text-[15px] ${level === lv ? "text-[#7fe9f5]" : "text-white"}`}>{lv}-up</span>
                  <span className="block text-[11px] text-white/45">{lv === "1bac" ? "Régional · 1ère année" : "National · 2ème année"}</span>
                </button>
              ))}
            </div>
          </Reveal>
          <Reveal delay={400}>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] font-semibold text-white/50">
              <span className="text-white/35 font-bold">Ça marche avec :</span>
              <span className="inline-flex items-center gap-1.5"><WhatsIcon s={18} /> Rappels WhatsApp</span>
              <span className="inline-flex items-center gap-1.5"><GmailIcon s={20} /> Résultats par Gmail</span>
            </div>
          </Reveal>
        </div>
        <Reveal delay={220}>
          <AppWindow />
        </Reveal>
      </div>
    </header>
  );
}

function AppWindow() {
  const { ref, p } = useScrollProgress<HTMLDivElement>();
  const c = Math.min(1, p * 1.6);
  const nav = [
    ["Dashboard", false], ["Classement", true], ["Examens", false], ["Monk Mode", false], ["Coach IA", false],
  ] as const;
  const lb = [["HA", "Toi", "244", true], ["YB", "Yassine B.", "231", false], ["SE", "Salma E.", "218", false]] as const;
  return (
    <div ref={ref} style={{ transform: `scale(${0.94 + c * 0.06})`, opacity: 0.6 + c * 0.4, filter: `blur(${(1 - c) * 5}px)` }}>
      <div className="rounded-2xl border border-white/10 bg-[#0c1320] shadow-[0_40px_100px_rgba(0,0,0,.6)] overflow-hidden">
        <div className="flex gap-1.5 px-4 py-3 border-b border-white/8">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="grid grid-cols-[112px_1fr] min-h-[330px]">
          <div className="border-r border-white/8 p-2.5 space-y-1">
            {nav.map(([n, on]) => (
              <div key={n} className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-[11px] ${on ? "bg-arctic-cyan/12 text-[#bfeaf2]" : "text-white/45"}`}>
                <span className={`w-3.5 h-3.5 rounded ${on ? "bg-gradient-to-br from-arctic-cyan to-arctic-blue" : "bg-white/10"}`} />
                {n}
              </div>
            ))}
          </div>
          <div className="p-4">
            <div className="font-display font-bold text-white text-[15px]">Ta progression</div>
            <div className={`${card} mt-2 p-2.5`}>
              <svg viewBox="0 0 300 84" className="w-full">
                <defs><linearGradient id="hw" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#0db8d3" /><stop offset="1" stopColor="#4bfde8" /></linearGradient></defs>
                <path d="M6,76 C70,74 110,66 150,42 S250,10 294,8" fill="none" stroke="url(#hw)" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <div className="mt-2.5 space-y-1.5">
              {lb.map(([ini, nm, xp, me]) => (
                <div key={nm} className={`flex items-center justify-between rounded-lg px-2.5 py-2 border ${me ? "bg-arctic-cyan/12 border-arctic-cyan/30" : "bg-white/[0.02] border-white/5"}`}>
                  <span className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full grid place-items-center text-[9px] font-bold font-display text-white bg-gradient-to-br from-arctic-cyan to-arctic-blue">{ini}</span>
                    <span className="text-[12px] text-white/85 font-medium">{nm}</span>
                  </span>
                  <span className={`text-[12px] font-bold ${me ? "text-[#7fe9f5]" : "text-white/45"}`}>{xp} XP</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============================== SAMPLE TASTE =============================== */
export function SampleTaste({ onDemo }: { onDemo: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const correct = 1;
  const opts = ["+∞", "0", "1", "−∞"];
  return (
    <Sec alt className="py-20 border-t border-white/5">
      <div className="max-w-3xl mx-auto px-5">
        <Reveal className="text-center">
          <span className={eyebrow}>Essaie, là, maintenant</span>
          <h2 className="mt-2 font-display font-black text-3xl sm:text-4xl text-white">Une vraie question. Le vrai déclic.</h2>
        </Reveal>
        <Reveal delay={120}>
          <div className={`${card} mt-8 p-6`}>
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-bold text-[#bfeaf2] bg-arctic-cyan/12 px-2 py-0.5 rounded-md">Maths · 2 pts</span>
              <span className="inline-flex items-center gap-1 text-white/40 font-mono"><Timer className="w-3.5 h-3.5" /> 01:12</span>
            </div>
            <h4 className="mt-3 font-semibold text-white text-lg">La limite de (ln x)/x quand x → +∞ est :</h4>
            <div className="mt-4 grid sm:grid-cols-2 gap-2.5">
              {opts.map((o, i) => {
                const show = picked !== null, ok = i === correct, mine = picked === i;
                return (
                  <button key={o} disabled={show} onClick={() => setPicked(i)}
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm border text-left transition ${
                      show && ok ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-200"
                      : show && mine ? "border-red-400/50 bg-red-400/10 text-red-200"
                      : "border-white/10 bg-white/[0.02] text-white/80 hover:border-arctic-cyan/40"}`}>
                    <span className={`w-5 h-5 rounded-full border-2 grid place-items-center ${show && ok ? "border-emerald-400 bg-emerald-400" : "border-white/25"}`}>
                      {show && ok && <Check className="w-3 h-3 text-[#07130c]" />}
                    </span>
                    {o}
                  </button>
                );
              })}
            </div>
            {picked !== null && (
              <div className="mt-4 rounded-xl bg-arctic-cyan/8 border border-arctic-cyan/20 p-4">
                <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#bfeaf2]"><Brain className="w-3.5 h-3.5" /> L’IA t’explique</div>
                <p className="mt-1.5 text-sm text-white/70 leading-relaxed">
                  Par croissances comparées, x l’emporte sur ln x — le rapport tend vers <b className="text-white">0</b>. Tu veux le raisonnement complet, expliqué de 5 façons ?
                </p>
                <button onClick={onDemo} className="mt-2.5 inline-flex items-center gap-1.5 text-sm font-bold text-[#7fe9f5]">
                  Débloque tout · Essaie la démo <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </Sec>
  );
}

/* =============================== LEADERBOARD =============================== */
export function Leaderboard() {
  const s = [
    { p: "Yassine B.", f: "2 Bac SM · Casablanca", xp: 244 }, { p: "Salma E.", f: "2 Bac PC · Rabat", xp: 231 },
    { p: "Mehdi A.", f: "1 Bac SM · Marrakech", xp: 218 }, { p: "Imane K.", f: "2 Bac SVT · Fès", xp: 205 },
    { p: "Anas R.", f: "2 Bac Éco · Tanger", xp: 197 }, { p: "Nada L.", f: "1 Bac PC · Agadir", xp: 186 },
  ];
  const row = [...s, ...s];
  return (
    <Sec className="py-20 overflow-hidden border-t border-white/5">
      <div className="max-w-6xl mx-auto px-5 text-center">
        <Reveal><span className={eyebrow}>Rejoins les meilleurs</span>
          <h2 className="mt-2 font-display font-black text-3xl sm:text-4xl text-white">Ils grimpent déjà avec Bac Up.</h2>
        </Reveal>
      </div>
      <div className="mt-10 marquee-wrap relative">
        <div className="marquee-track flex gap-4 w-max">
          {row.map((x, i) => (
            <div key={i} className={`flex items-center gap-3 rounded-2xl border px-4 py-3 min-w-[262px] ${i % s.length === 0 ? "border-arctic-cyan/35 bg-arctic-cyan/[0.07]" : "border-white/10 bg-white/[0.03]"}`}>
              <span className="w-9 h-9 rounded-full grid place-items-center text-xs font-bold font-display text-white bg-gradient-to-br from-arctic-cyan to-arctic-blue">{x.p.split(" ").map((w) => w[0]).join("")}</span>
              <div className="flex-1 min-w-0"><div className="text-sm font-bold text-white truncate">{x.p}</div><div className="text-[11px] text-white/45 truncate">{x.f}</div></div>
              <div className="text-right"><div className="font-display font-bold text-sm text-[#7fe9f5]">{x.xp}</div><div className="text-[10px] text-white/30">XP</div></div>
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#070b12] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#070b12] to-transparent" />
      </div>
    </Sec>
  );
}

/* =============================== ENGINE =============================== */
export function EngineMetrics() {
  const m = [
    { icon: Zap, v: <>&lt;2s</>, l: "pour corriger un examen" },
    { icon: Brain, v: <>5</>, l: "modes d’explication IA" },
    { icon: BookOpen, v: <CountUp to={40} prefix="+" />, l: "annales officielles" },
  ];
  return (
    <Sec alt className="py-24 border-t border-white/5">
      <div className="max-w-5xl mx-auto px-5">
        <Reveal className="text-center"><span className={eyebrow}>Le moteur</span>
          <h2 className="mt-2 font-display font-black text-3xl sm:text-4xl text-white">Tout est connecté, tout va vite.</h2>
        </Reveal>
        <div className="mt-14 relative grid sm:grid-cols-3 gap-8">
          <div className="hidden sm:block absolute top-9 left-[16%] right-[16%] h-px bg-gradient-to-r from-arctic-cyan/40 via-arctic-blue/40 to-arctic-cyan/40" />
          {m.map((x, i) => (
            <Reveal key={i} delay={i * 120} className="relative text-center">
              <div className="mx-auto w-16 h-16 rounded-2xl grid place-items-center text-white bg-gradient-to-br from-arctic-cyan to-arctic-blue shadow-[0_10px_30px_rgba(13,184,211,.35)]"><x.icon className="w-7 h-7" /></div>
              <div className="mt-4 font-display font-black text-4xl text-white">{x.v}</div>
              <div className="mt-1 text-sm text-white/50">{x.l}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </Sec>
  );
}

/* =============================== FEATURES =============================== */
export function Features({ onDemo }: { onDemo: () => void }) {
  const rows = [
    { eyebrow: "Moteur d’examens /20", title: "Entraîne-toi comme le jour J.", text: "Vrais sujets et examens blancs, chronométrés, notés sur 20 avec correction immédiate. Exactement les conditions de l’épreuve.", quote: "« Les examens notés /20, c’est exactement le jour J. » — Anas, 2 Bac PC", mock: <ExamMock /> },
    { eyebrow: "IA Explique · 5 modes", title: "Comprends, ne recopie pas.", text: "Explique autrement, Étapes, Cours, Erreurs, Méthode. L’IA reformule jusqu’à ce que ça clique — sans jamais te livrer la réponse d’un bloc.", quote: "« Enfin je comprends mes erreurs. +3 en physique. » — Yasmine, 2 Bac SVT", mock: <AiMock /> },
    { eyebrow: "Monk Mode · discipline", title: "Ta discipline, un jour à la fois.", text: "Des défis quotidiens et une série à ne pas casser. Tes non-négociables, validés chaque jour, jusqu’à ce que réviser devienne une habitude.", quote: "« Ma série de 30 jours m’a tenu jusqu’au bout. » — Mehdi, 1 Bac SM", mock: <MonkMock /> },
    { eyebrow: "Gamification", title: "Réviser devient un jeu que tu veux gagner.", text: "XP, série, maîtrise, note estimée et classement. De vraies raisons de revenir chaque jour — et de progresser sans t’en rendre compte.", quote: "« Je grimpe au classement, du coup je révise plus. » — Salma, 2 Bac Maths", mock: <GameMock /> },
  ];
  return (
    <Sec id="features">
      {rows.map((r, i) => (
        <div key={i} className="px-5 py-16 border-t border-white/5">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <Reveal className={i % 2 ? "lg:order-2" : ""}>
              <span className={eyebrow}>{r.eyebrow}</span>
              <h2 className="mt-3 font-display font-bold text-2xl sm:text-3xl text-white">{r.title}</h2>
              <p className="mt-4 text-white/55 leading-relaxed">{r.text}</p>
              <p className="mt-5 text-sm italic text-white/45 border-l-2 border-arctic-cyan/40 pl-3">{r.quote}</p>
              <button onClick={onDemo} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#7fe9f5] hover:gap-3 transition-all">Voir dans la démo <ArrowRight className="w-4 h-4" /></button>
            </Reveal>
            <Reveal delay={120} className={i % 2 ? "lg:order-1" : ""}>{r.mock}</Reveal>
          </div>
        </div>
      ))}
    </Sec>
  );
}
function Mock({ children }: { children: React.ReactNode }) {
  return <div className={`${card} p-6 shadow-[0_30px_70px_rgba(0,0,0,.4)]`}>{children}</div>;
}
function ExamMock() {
  return (
    <Mock>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-white inline-flex items-center gap-2"><Timer className="w-4 h-4 text-[#7fe9f5]" /> Maths · National</span>
        <span className="font-mono font-bold text-[#7fe9f5]">02:58:12</span>
      </div>
      <div className="mt-4 rounded-xl bg-white/[0.02] border border-white/8 p-4">
        <div className="text-[11px] font-bold uppercase tracking-wide text-white/40">Exercice 1 · Suites</div>
        <div className="mt-2 text-sm text-white/70">La suite u(n+1) = ½uₙ + 1, u₀ = 3, converge vers :</div>
        <div className="mt-3 space-y-2">
          {["ℓ = 2", "ℓ = 1"].map((o, i) => (
            <div key={o} className={`rounded-lg px-3 py-2 text-sm border ${i === 0 ? "bg-arctic-cyan/12 border-arctic-cyan/30 text-white" : "bg-white/[0.02] border-white/8 text-white/50"}`}>{o}</div>
          ))}
        </div>
      </div>
    </Mock>
  );
}
function AiMock() {
  return (
    <Mock>
      <div className="flex items-center gap-2 text-[#7fe9f5] text-sm font-bold"><Brain className="w-4 h-4" /> IA Explique</div>
      <div className="mt-4 space-y-3">
        <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-white/[0.05] px-4 py-2.5 text-sm text-white/70">Pourquoi la dérivée de ln(x) vaut 1/x ?</div>
        <div className="max-w-[92%] rounded-2xl rounded-tl-sm bg-arctic-cyan/10 border border-arctic-cyan/20 px-4 py-2.5 text-sm text-white/75">Pars de exp(ln x) = x, puis dérive les deux côtés. <b className="text-[#7fe9f5]">Essaie</b> — je te guide étape par étape.</div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {["Explique autrement", "Étapes", "Cours", "Méthode"].map((m) => (<span key={m} className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/[0.05] text-white/55">{m}</span>))}
      </div>
    </Mock>
  );
}
function MonkMock() {
  const days = Array.from({ length: 14 }, (_, i) => i + 1);
  return (
    <Mock>
      <div className="flex items-center gap-2 text-sm font-bold text-white"><Flame className="w-4 h-4 text-[#7fe9f5]" /> Monk Mode</div>
      <div className="mt-4 flex items-center gap-4">
        <div className="text-center"><div className="font-display font-black text-5xl text-[#7fe9f5]">12</div><div className="text-[11px] text-white/45">jours de série</div></div>
        <div className="flex-1 grid grid-cols-7 gap-1.5">
          {days.map((d) => (<span key={d} className={`aspect-square rounded-md grid place-items-center text-[10px] ${d <= 3 ? "bg-gradient-to-br from-arctic-cyan to-arctic-blue text-white" : d === 4 ? "ring-2 ring-arctic-cyan text-[#7fe9f5]" : "bg-white/[0.05] text-white/40"}`}>{d <= 3 ? <Check className="w-3 h-3" /> : d}</span>))}
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {["2h de révision", "Pas de réseaux inutiles", "30 min de sport"].map((t) => (
          <div key={t} className="flex items-center justify-between rounded-lg bg-white/[0.02] border border-white/8 px-3 py-2 text-sm text-white/70">{t}<span className="w-5 h-5 rounded-full bg-emerald-500 grid place-items-center"><Check className="w-3 h-3 text-white" /></span></div>
        ))}
      </div>
    </Mock>
  );
}
function GameMock() {
  return (
    <Mock>
      <div className="grid grid-cols-3 gap-3">
        {[{ v: "244", l: "XP" }, { v: "12", l: "série 🔥" }, { v: "16,2", l: "note estimée" }].map((k) => (
          <div key={k.l} className="rounded-xl bg-white/[0.02] border border-white/8 p-3 text-center"><div className="font-display font-black text-xl text-[#7fe9f5]">{k.v}</div><div className="text-[11px] text-white/45">{k.l}</div></div>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        {[{ n: "Toi", s: "244", me: true }, { n: "Yassine B.", s: "231" }, { n: "Salma E.", s: "218" }].map((b, i) => (
          <div key={i} className={`flex items-center justify-between rounded-lg px-3 py-2 border ${b.me ? "bg-arctic-cyan/12 border-arctic-cyan/30" : "bg-white/[0.02] border-white/8"}`}>
            <span className="text-sm font-semibold text-white/85">{i + 1}. {b.n}</span><span className="text-sm font-bold text-[#7fe9f5]">{b.s} XP</span>
          </div>
        ))}
      </div>
    </Mock>
  );
}

/* =============================== LEARNING LOOP =============================== */
export function LearningLoop({ onDemo }: { onDemo: () => void }) {
  void onDemo;
  const steps = ["Révise", "Teste", "Corrige", "Comprends", "Remonte"];
  const R = 120;
  return (
    <Sec alt className="py-24 border-t border-white/5">
      <div className="max-w-5xl mx-auto px-5 text-center">
        <Reveal><span className={eyebrow}>La boucle</span>
          <h2 className="mt-2 font-display font-black text-3xl sm:text-4xl text-white">La boucle qui te fait progresser.</h2>
          <p className="mt-3 text-white/50 max-w-lg mx-auto">Chaque tour te rend meilleur. C’est ça, un vrai système.</p>
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-12 relative mx-auto" style={{ width: 300, height: 300 }}>
            <svg viewBox="0 0 300 300" className="w-full h-full lz-spinslow">
              <circle cx="150" cy="150" r={R} fill="none" stroke="url(#lg)" strokeWidth="2" strokeDasharray="4 8" />
              <defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0db8d3" /><stop offset="1" stopColor="#1b7fdc" /></linearGradient></defs>
            </svg>
            {steps.map((s, i) => {
              const a = (i / steps.length) * Math.PI * 2 - Math.PI / 2;
              return (
                <div key={s} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: 150 + R * Math.cos(a), top: 150 + R * Math.sin(a) }}>
                  <div className="px-3.5 py-2 rounded-full bg-[#0c1320] border border-arctic-cyan/25 shadow-[0_8px_20px_rgba(13,184,211,.15)] text-sm font-bold text-white whitespace-nowrap">{s}</div>
                </div>
              );
            })}
            <div className="absolute inset-0 grid place-items-center"><LogoMark size={64} /></div>
          </div>
        </Reveal>
        <Reveal delay={200}>
          <MagneticButton href="/signup" className="mt-12 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white text-[15px] font-bold px-7 py-4 shadow-[0_12px_36px_rgba(27,127,220,.45)] hover:brightness-110 transition">Obtenir l’accès <ArrowRight className="w-4 h-4" /></MagneticButton>
        </Reveal>
      </div>
    </Sec>
  );
}

/* =============================== AVEC / SANS =============================== */
function Notif({ icon, title, sub, time, good }: { icon: React.ReactNode; title: string; sub: string; time: string; good: boolean }) {
  return (
    <div className={`flex items-start gap-3 rounded-2xl p-3.5 ${good ? "bg-white/[0.06] border border-arctic-cyan/20" : "bg-white/[0.02] border border-white/8"}`}>
      <span className="shrink-0 w-10 h-10 rounded-xl grid place-items-center bg-white/90">{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2"><span className="text-sm font-bold text-white truncate">{title}</span><span className="text-[11px] text-white/35 shrink-0">{time}</span></div>
        <div className="text-[13px] text-white/50 truncate">{sub}</div>
      </div>
    </div>
  );
}
export function AvecSans() {
  return (
    <Sec className="py-24 border-t border-white/5 px-5">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center"><span className={eyebrow}>Avec / Sans</span>
          <h2 className="mt-2 font-display font-black text-3xl sm:text-4xl text-white">La différence se sent vite.</h2>
        </Reveal>
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Reveal>
            <div className="rounded-3xl border border-white/8 bg-white/[0.015] p-6 h-full">
              <div className="text-center"><div className="font-display font-black text-2xl text-white/70">Sans Bac Up</div><p className="mt-1 text-sm text-white/40">Le stress, sans plan.</p></div>
              <div className="mt-6 space-y-3 saturate-[.55]">
                <Notif good={false} icon={<GmailIcon s={20} />} title="Où est passée ma moyenne ? 💀" sub="Toujours bloqué à 08/20." time="now" />
                <Notif good={false} icon={<WhatsIcon s={20} />} title="Je suis complètement perdu 😩" sub="Je sais même pas par où commencer." time="2m" />
                <Notif good={false} icon={<LogoMark size={20} />} title="Stress +42% cette semaine" sub="3ème nuit blanche sans méthode." time="5m" />
              </div>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <div className="rounded-3xl border border-arctic-cyan/25 bg-gradient-to-br from-arctic-blue/12 to-transparent p-6 h-full">
              <div className="text-center"><div className="font-display font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-arctic-cyan to-white">Avec Bac Up</div><p className="mt-1 text-sm text-white/50">La clarté, et ça monte.</p></div>
              <div className="mt-6 space-y-3">
                <Notif good icon={<LogoMark size={20} />} title="Moyenne +6 pts ce mois 📈" sub="Note estimée : 16,2/20." time="now" />
                <Notif good icon={<GmailIcon s={20} />} title="Enfin je comprends tout 🧡" sub="L’IA m’a débloqué en physique." time="4m" />
                <Notif good icon={<WhatsIcon s={20} />} title="Coach : ta séance du jour est prête 💪" sub="2 exos sur tes points faibles." time="12m" />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Sec>
  );
}

/* =============================== FOUNDER =============================== */
export function Founder() {
  return (
    <Sec alt className="py-28 px-5 border-t border-white/5">
      <div className="max-w-3xl mx-auto text-center">
        <Reveal><span className={eyebrow}>Pourquoi Bac Up</span></Reveal>
        <blockquote className="mt-6 font-display font-bold text-2xl sm:text-3xl leading-snug text-white">
          <Words text="« J’ai vu trop d’élèves brillants stresser et échouer au BAC — pas par manque d’intelligence, mais de méthode. Alors j’ai construit Bac Up : pour rendre la réussite fun, claire et à la portée de tous. »" stagger={45} />
        </blockquote>
        <Reveal delay={200}><div className="mt-6 text-sm text-white/55"><span className="font-bold text-white font-display">Haytam</span> · fondateur de HSGenius</div></Reveal>
      </div>
    </Sec>
  );
}

/* =============================== IMPACT =============================== */
export function Impact() {
  const [mode, setMode] = useState<"res" | "disc">("res");
  const [k, setK] = useState(0);
  const data = {
    res: [{ pre: "+", n: 5.2, dec: 1, suf: " pts", l: "de moyenne" }, { pre: "×", n: 2.4, dec: 1, suf: "", l: "note estimée" }, { pre: "top ", n: 10, dec: 0, suf: "%", l: "de la classe" }],
    disc: [{ pre: "", n: 38, dec: 0, suf: " j", l: "de série (moy.)" }, { pre: "+", n: 12, dec: 0, suf: "h", l: "de focus / semaine" }, { pre: "×", n: 3, dec: 0, suf: "", l: "examens blancs faits" }],
  };
  const stats = data[mode];
  const curve = mode === "res" ? "M10,150 C120,145 200,120 270,70 S370,20 392,12" : "M10,150 C90,148 170,135 250,95 S360,35 392,20";
  return (
    <Sec className="py-24 px-5 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center"><span className={eyebrow}>L’impact</span>
          <h2 className="mt-2 font-display font-black text-3xl sm:text-4xl text-white">Vois ce que Bac Up change.</h2>
        </Reveal>
        <Reveal delay={100}>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex gap-1 bg-white/[0.05] border border-white/10 p-1 rounded-full">
              {([["res", "Résultats"], ["disc", "Discipline"]] as const).map(([kk, lbl]) => (
                <button key={kk} onClick={() => { setMode(kk); setK((x) => x + 1); }} className={`px-5 py-2 rounded-full text-sm font-bold transition ${mode === kk ? "bg-white text-[#0c1320]" : "text-white/55"}`}>{lbl}</button>
              ))}
            </div>
          </div>
        </Reveal>
        <div className="mt-10 grid md:grid-cols-2 gap-8 items-center">
          <div className="grid grid-cols-1 gap-5">
            {stats.map((st, i) => (
              <div key={`${mode}-${i}`} className="flex items-center gap-3">
                <span className="w-1 self-stretch rounded-full bg-gradient-to-b from-arctic-cyan to-arctic-blue" />
                <div>
                  <div className="font-display font-black text-4xl text-transparent bg-clip-text bg-gradient-to-r from-arctic-cyan to-white">{st.pre}<CountUp to={st.n} decimals={st.dec} suffix={st.suf} /></div>
                  <div className="text-sm text-white/55">{st.l}</div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <svg viewBox="0 0 400 170" className="w-full h-auto overflow-visible">
              <defs>
                <linearGradient id="ig" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#0db8d3" /><stop offset="1" stopColor="#4bfde8" /></linearGradient>
                <linearGradient id="if" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1b7fdc" stopOpacity="0.22" /><stop offset="1" stopColor="#1b7fdc" stopOpacity="0" /></linearGradient>
              </defs>
              {[40, 80, 120].map((y) => (<line key={y} x1="10" y1={y} x2="390" y2={y} stroke="#fff" strokeOpacity="0.05" />))}
              <path key={`f${k}`} d={`${curve} L392,160 L10,160 Z`} fill="url(#if)" />
              <path key={`l${k}`} d={curve} fill="none" stroke="url(#ig)" strokeWidth="4" strokeLinecap="round"
                ref={(el) => {
                  if (el) {
                    const L = el.getTotalLength();
                    el.style.transition = "none";
                    el.style.strokeDasharray = String(L);
                    el.style.strokeDashoffset = String(L);
                    void el.getBoundingClientRect();
                    requestAnimationFrame(() => requestAnimationFrame(() => { el.style.transition = "stroke-dashoffset 1.6s cubic-bezier(.4,0,.2,1)"; el.style.strokeDashoffset = "0"; }));
                  }
                }} />
              <circle cx="392" cy={mode === "res" ? 12 : 20} r="5" fill="#4bfde8" />
            </svg>
            <div className="mt-2 flex justify-between text-[11px] text-white/40 px-1">
              {["Sept", "Déc", "Mars", "Juin"].map((mm, i) => (<span key={mm} className={i === 3 ? "text-[#7fe9f5] font-bold" : ""}>{mm}</span>))}
            </div>
          </div>
        </div>
        <p className="mt-8 text-center text-[11px] text-white/30">Objectifs illustratifs, basés sur l’usage type de la plateforme.</p>
      </div>
    </Sec>
  );
}

/* =============================== PRICING =============================== */
export function Pricing({ level, setLevel, onDemo }: { level: Level; setLevel: (l: Level) => void; onDemo: () => void }) {
  const [formule, setFormule] = useState<"solo" | "binome">("solo");
  const price = formule === "solo" ? 220 : 200;
  const feats = ["Toutes les matières, examens blancs /20", "IA Explique (5 modes) + Coach IA", "Monk Mode + Classement + XP", "1bac & 2bac inclus", "Mises à jour toute l’année", "Accès démo → complet"];
  const wa = "https://wa.me/?text=" + encodeURIComponent("Rejoins-moi sur Bac Up, on paie 200 DH chacun au lieu de 220 👇 https://bacup.ma");
  return (
    <Sec id="pricing" alt className="py-24 px-5 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center"><span className={eyebrow}>Le tarif</span>
          <h2 className="mt-2 font-display font-black text-3xl sm:text-4xl text-white">Un prix. Toute l’année.</h2>
          <p className="mt-3 text-white/50 max-w-lg mx-auto">Un seul cours particulier coûte ~150 DH. Bac Up, c’est toute l’année, toutes les matières.</p>
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-10 grid md:grid-cols-2 rounded-3xl overflow-hidden border border-white/10">
            <div className="bg-white/[0.02] p-8">
              <div className="font-display font-bold text-lg text-white">Le Pack Bac Up</div>
              <ul className="mt-5 space-y-3">
                {feats.map((f) => (<li key={f} className="flex items-start gap-3 text-sm text-white/70"><span className="mt-0.5 w-5 h-5 rounded-full bg-arctic-cyan/15 grid place-items-center shrink-0"><Check className="w-3 h-3 text-[#7fe9f5]" /></span>{f}</li>))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-arctic-deep/30 to-[#070b12] p-8">
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex gap-1 bg-white/[0.06] p-1 rounded-full">
                  {(["1bac", "2bac"] as Level[]).map((lv) => (<button key={lv} onClick={() => setLevel(lv)} className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${level === lv ? "bg-white text-[#0c1320]" : "text-white/55"}`}>{lv}-up</button>))}
                </div>
                <div className="inline-flex gap-1 bg-white/[0.06] p-1 rounded-full">
                  {([["solo", "Solo"], ["binome", "Binôme"]] as const).map(([kk, lbl]) => (<button key={kk} onClick={() => setFormule(kk)} className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${formule === kk ? "bg-white text-[#0c1320]" : "text-white/55"}`}>{lbl}</button>))}
                </div>
              </div>
              <div className="mt-6 flex items-end gap-3">
                <span className="font-display font-black text-6xl text-white">{price}</span>
                <div className="pb-2"><div className="text-white/70 font-bold">DH</div><div className="text-white/40 text-xs line-through">450 DH</div></div>
              </div>
              <div className="mt-1 flex items-center gap-2"><span className="text-[11px] font-bold text-emerald-300 bg-emerald-400/10 px-2 py-0.5 rounded">−{Math.round((1 - price / 450) * 100)}% prix fondateur</span><span className="text-[11px] text-white/40">≈ 0,8 DH/jour</span></div>
              {formule === "binome" && (<a href={wa} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-[13px] font-bold text-[#7fe9f5]"><WhatsIcon s={16} /> Partage sur WhatsApp — 200 DH chacun</a>)}
              <div className="mt-6">
                <div className="flex justify-between text-[11px] text-white/50 mb-1"><span>{SEATS.pct}% des places fondateur prises</span><span>plus que ~{SEATS.left}</span></div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue" style={{ width: `${SEATS.pct}%` }} /></div>
              </div>
              <MagneticButton href={formule === "binome" ? "/signup/binome" : `/signup?niveau=${level}`} className="mt-6 w-full rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white text-sm font-bold py-4 shadow-[0_12px_36px_rgba(27,127,220,.45)] hover:brightness-110 transition">Obtenir l’accès <ArrowRight className="w-4 h-4" /></MagneticButton>
              <button onClick={onDemo} className="mt-2 w-full rounded-full border border-white/15 text-white text-sm font-bold py-3.5 hover:bg-white/5 transition">Essaie la démo d’abord</button>
              <div className="mt-5 flex items-center justify-center gap-3 opacity-70">{["CMI", "Cashplus", "Wafacash"].map((pp) => (<span key={pp} className="text-[10px] font-bold text-white/50 border border-white/15 rounded px-2 py-1">{pp}</span>))}</div>
            </div>
          </div>
        </Reveal>
      </div>
    </Sec>
  );
}

/* =============================== FAQ =============================== */
export function Faq() {
  const qs = [
    { q: "C’est quoi Bac Up ?", a: "Examens blancs notés /20, corrections détaillées, une IA qui t’explique tout, un coach et de la gamification. 1bac et 2bac." },
    { q: "Ça marche pour ma filière ?", a: "Oui — SM-A, SM-B, PC, SVT et Éco. Tout s’adapte à ta filière et ton niveau." },
    { q: "Quelle différence entre 1bac et 2bac ?", a: "1bac-up couvre la 1ère année (régional), 2bac-up la 2ème (national). Tu choisis, le prix est le même." },
    { q: "C’est quoi le prix fondateur ?", a: "220 DH pour toute l’année (200 DH en binôme), au lieu de 450 DH au lancement. Places limitées." },
    { q: "Y a-t-il un essai gratuit ?", a: "Pas d’abonnement gratuit, mais une démo complète et gratuite : essaie toute l’app avant de payer." },
    { q: "Sur quels appareils ?", a: "Téléphone et ordinateur, dans le navigateur. Rien à installer." },
    { q: "Les corrections sont-elles fiables ?", a: "Oui — rédigées et vérifiées par l’équipe HSGenius, étape par étape. Un bouton « signale une erreur » est là si besoin." },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Sec className="py-24 px-5 border-t border-white/5">
      <div className="max-w-2xl mx-auto">
        <Reveal className="text-center"><h2 className="font-display font-black text-3xl sm:text-4xl text-white">Questions fréquentes</h2></Reveal>
        <div className="mt-10 space-y-3">
          {qs.map((item, i) => (
            <Reveal key={i} delay={i * 40}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left">
                  <span className="font-semibold text-white">{item.q}</span>
                  <ChevronDown className={`w-5 h-5 text-white/40 shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
                </button>
                <div className="grid transition-all duration-300" style={{ gridTemplateRows: open === i ? "1fr" : "0fr" }}>
                  <div className="overflow-hidden"><p className="px-5 pb-4 text-sm text-white/55 leading-relaxed">{item.a}</p></div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Sec>
  );
}

/* =============================== FINAL CTA =============================== */
export function FinalCta() {
  const verbs = ["progressent", "cartonnent", "réussissent"];
  const [vi, setVi] = useState(0);
  return (
    <Sec className="pb-10 px-5">
      <div className="relative max-w-5xl mx-auto rounded-[32px] overflow-hidden border border-arctic-cyan/25 bg-gradient-to-br from-arctic-deep via-arctic-blue/70 to-arctic-navy text-center px-8 py-20">
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-arctic-cyan/40 blur-[110px] rounded-full" />
        <Reveal>
          <h2 className="relative font-display font-black text-3xl sm:text-5xl text-white leading-tight">
            Les meilleurs élèves ne laissent<br className="hidden sm:block" /> rien au hasard. Ils{" "}
            <button onClick={() => setVi((v) => (v + 1) % verbs.length)} className="text-[#7ff0ff] underline decoration-arctic-cyan/40 underline-offset-4">{verbs[vi]}</button>.
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <div className="relative mt-8"><MagneticButton href="/signup" className="rounded-full bg-white text-[#0a2a4a] text-sm font-bold px-7 py-4 hover:bg-white/90 transition">Obtenir l’accès · prix fondateur <ArrowRight className="w-4 h-4" /></MagneticButton></div>
          <div className="relative mt-4 text-sm text-white/70">{SEATS.pct}% des places prises · commence l’année en tête</div>
        </Reveal>
      </div>
    </Sec>
  );
}

/* =============================== FOOTER =============================== */
export function FooterLz({ onDemo }: { onDemo: () => void }) {
  return (
    <footer className="bg-[#070b12] text-white/70 px-5 pt-16 pb-10 border-t border-white/8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-10">
        <div className="md:col-span-2">
          <div className="inline-flex items-center gap-2.5"><LogoMark size={34} /><span className="font-display text-xl font-bold text-white">Bac Up</span></div>
          <p className="mt-3 text-sm text-white/50 max-w-xs">Réussis ton BAC. Sans t’ennuyer. La boussole pour atteindre tes objectifs.</p>
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 max-w-sm">
            <div className="text-sm font-bold text-white font-display">Deviens ambassadeur</div>
            <p className="mt-1 text-[13px] text-white/50">Gagne 20 DH par élève que tu ramènes, avec ton code perso.</p>
            <a href="https://wa.me/212619340506" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#7fe9f5]"><WhatsIcon s={16} /> Rejoindre le programme</a>
          </div>
        </div>
        <div><div className="text-sm font-bold text-white font-display">Produit</div><ul className="mt-3 space-y-2 text-sm"><li><a href="#features" className="hover:text-white">Fonctionnalités</a></li><li><a href="#pricing" className="hover:text-white">Tarifs</a></li><li><button onClick={onDemo} className="hover:text-white">Démo</button></li></ul></div>
        <div><div className="text-sm font-bold text-white font-display">Programmes</div><ul className="mt-3 space-y-2 text-sm"><li><Link href="/signup" className="hover:text-white">1bac-up</Link></li><li><Link href="/signup" className="hover:text-white">2bac-up</Link></li></ul></div>
        <div><div className="text-sm font-bold text-white font-display">Contact</div><ul className="mt-3 space-y-2 text-sm"><li><a href="mailto:bacup@gmail.com" className="inline-flex items-center gap-1.5 hover:text-white"><Mail className="w-3.5 h-3.5" /> bacup@gmail.com</a></li><li><a href="https://wa.me/212619340506" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-white"><WhatsIcon s={14} /> 06 19 34 05 06</a></li></ul></div>
      </div>
      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-white/40">
        <span>© 2026 HSGenius · Conçu au Maroc 🇲🇦</span><span>Built by <span className="font-bold text-white/60 font-display">HSGenius</span></span>
      </div>
    </footer>
  );
}
