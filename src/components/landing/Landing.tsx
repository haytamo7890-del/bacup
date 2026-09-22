"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LogoMark, MagneticButton } from "./primitives";
import { LeadModal } from "./LeadModal";
import {
  Hero, SampleTaste, Leaderboard, EngineMetrics, Features, LearningLoop,
  AvecSans, Founder, Impact, Pricing, Faq, FinalCta, FooterLz, type Level,
} from "./sections";

export function Landing() {
  const [intro, setIntro] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [level, setLevel] = useState<Level>("2bac");
  const [demoOpen, setDemoOpen] = useState(false);
  const onDemo = () => setDemoOpen(true);

  useEffect(() => {
    const t = setTimeout(() => setIntro(false), 1650);
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="landing-root bg-[#070b12] text-white">
      {intro && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#070b12]" style={{ animation: "intro-out .5s ease 1.15s forwards" }}>
          <div style={{ animation: "bolt-in .85s cubic-bezier(.2,.7,.3,1) both" }}>
            <div className="drop-shadow-[0_0_40px_rgba(13,184,211,.6)]"><LogoMark size={92} /></div>
          </div>
          <div className="mt-5 font-display text-2xl font-bold text-white" style={{ animation: "wm-in 1s ease both" }}>Bac Up</div>
        </div>
      )}

      <nav className={`fixed top-4 inset-x-0 z-50 px-4 transition-all duration-300 ${scrolled ? "opacity-100" : "opacity-100"}`}>
        <div className={`max-w-5xl mx-auto flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300 ${scrolled ? "bg-[#0c1320]/80 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,.4)]" : "bg-transparent border border-transparent"}`}>
          <Link href="#top" className="inline-flex items-center gap-2.5">
            <div className="drop-shadow-[0_0_16px_rgba(13,184,211,.5)]"><LogoMark size={32} /></div>
            <span className="font-display text-lg font-bold tracking-tight text-white">Bac Up</span>
          </Link>
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-white/55">
            <a href="#pricing" className="hover:text-white transition">Programmes</a>
            <a href="#features" className="hover:text-white transition">Fonctionnalités</a>
            <a href="#pricing" className="hover:text-white transition">Tarifs</a>
            <button onClick={onDemo} className="hover:text-white transition">Démo</button>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-sm font-semibold text-white/70 hover:text-white px-2.5 sm:px-3 py-2 transition">Se connecter</Link>
            <MagneticButton href="/signup" className="rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white text-sm font-bold px-4 py-2.5 shadow-[0_8px_24px_rgba(27,127,220,.4)] hover:brightness-110 transition">
              S’inscrire <ArrowRight className="w-3.5 h-3.5" />
            </MagneticButton>
          </div>
        </div>
      </nav>

      <main id="top">
        <Hero onDemo={onDemo} level={level} setLevel={setLevel} />
        <SampleTaste onDemo={onDemo} />
        <Leaderboard />
        <EngineMetrics />
        <Features onDemo={onDemo} />
        <LearningLoop onDemo={onDemo} />
        <AvecSans />
        <Founder />
        <Impact />
        <Pricing level={level} setLevel={setLevel} onDemo={onDemo} />
        <Faq />
        <FinalCta />
      </main>
      <FooterLz onDemo={onDemo} />

      <LeadModal open={demoOpen} onClose={() => setDemoOpen(false)} level={level} />
    </div>
  );
}
