"use client";

/**
 * SubjectBanner — the per-matière hero used on the dashboard and at the top of
 * each subject in Cours. Two states:
 *   • "new"    → NOUVEAU CONTENU   · Continue ton parcours BAC   · EXPLORER
 *   • "resume" → REPRENDRE L'ÉTUDE · Reprends là où tu t'es arrêté · REPRENDRE
 *                (+ a progress stepper built from done/total)
 * Each subject carries its own color (subjectTheme) and a hand-drawn SVG scene
 * on the right (geometry, atom+fiole, ADN+feuille, colonne+livre, Big Ben…),
 * all in the subject accent via currentColor — no image files.
 */
import Link from "next/link";
import { ArrowRight, BookOpen, Play, Check } from "lucide-react";
import { subjectTheme } from "@/config/subjects";

const SUBJECT_LABELS: Record<string, string> = {
  maths: "Mathématiques", pc: "Physique-Chimie", "physique-chimie": "Physique-Chimie",
  svt: "SVT", philo: "Philosophie", anglais: "Anglais", si: "Sciences de l'Ingénieur",
  francais: "Français", arabe: "Langue Arabe", histgeo: "Histoire-Géo",
  islamique: "Éducation Islamique", eco_gen: "Économie Générale", compta: "Comptabilité",
};
function subjectLabel(codeOrName: string): string {
  const k = (codeOrName || "").toLowerCase().trim();
  return SUBJECT_LABELS[k] ?? codeOrName;
}

type Mode = "new" | "resume";

export function SubjectBanner({
  code,
  name,
  mode,
  href,
  onClick,
  subtitle,
  done = 0,
  total = 0,
  className = "",
}: {
  code: string;
  name: string;
  mode: Mode;
  href?: string;
  onClick?: () => void;
  subtitle?: string;
  done?: number;
  total?: number;
  className?: string;
}) {
  const t = subjectTheme(code || name);
  const resume = mode === "resume";
  const h1 = resume ? "REPRENDRE" : "NOUVEAU";
  const h2 = resume ? "L'ÉTUDE" : "CONTENU";
  const sub = subtitle ?? (resume ? "Reprends là où tu t'es arrêté" : "Continue ton parcours BAC");
  const cta = resume ? "REPRENDRE" : "EXPLORER";
  const label = subjectLabel(name || code);

  const inner = (
    <>
      {/* accent glow */}
      <span className={`pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 w-[55%] h-[150%] rounded-full blur-3xl opacity-25 group-hover:opacity-35 transition-opacity ${t.bar}`} />
      {/* right-side themed scene, bleeding + fading into the card */}
      <div className={`pointer-events-none absolute inset-y-0 right-0 w-[62%] ${t.text}`} aria-hidden>
        <SubjectScene code={code || name} className="absolute inset-0 h-full w-full object-cover opacity-[0.9]" />
        {/* left-to-right fade so the copy stays legible */}
        <span className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/70 to-transparent" />
      </div>

      <div className="relative flex items-center justify-between gap-4">
        <div className="min-w-0">
          <span className={`inline-block text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.14em] ${t.text}`}>{label}</span>
          <h2 className="mt-1.5 font-display text-3xl sm:text-4xl font-extrabold tracking-tight italic leading-none">
            <span className="text-white">{h1} </span>
            <span className={t.text}>{h2}</span>
          </h2>
          <p className="mt-2 text-sm text-white/60">{sub}</p>
          <span className={`mt-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide bg-gradient-to-r ${t.grad} text-white pl-4 pr-3.5 py-2 rounded-full w-fit shadow-lg shadow-black/20 group-hover:-translate-y-0.5 transition`}>
            {resume ? <Play className="w-3.5 h-3.5 fill-current" /> : <BookOpen className="w-3.5 h-3.5" />}
            {cta}
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {resume && total > 0 && (
          <div className="relative shrink-0 hidden sm:flex items-center rounded-2xl bg-white/[0.06] ring-1 ring-white/10 backdrop-blur px-4 py-3">
            <Stepper done={done} total={total} barClass={t.bar} textClass={t.text} ringClass={t.ring} />
          </div>
        )}
      </div>
    </>
  );

  const shell = `group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900 to-neutral-950 text-white p-6 sm:p-7 min-h-[150px] flex flex-col justify-center shadow-lg shadow-black/20 ${className}`;

  if (href) return <Link href={href} className={shell}>{inner}</Link>;
  return <button onClick={onClick} className={`${shell} text-left w-full`}>{inner}</button>;
}

/** Progress chain — filled dots up to `done`, connected by a track. Max 5 shown. */
function Stepper({ done, total, barClass, textClass, ringClass }: { done: number; total: number; barClass: string; textClass: string; ringClass: string }) {
  const n = Math.min(5, Math.max(2, total));
  const filled = total > 0 ? Math.round((done / total) * n) : 0;
  const dots = Array.from({ length: n });
  return (
    <div className="flex items-center gap-1.5">
      {dots.map((_, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span className={`grid place-items-center w-6 h-6 rounded-full text-[10px] font-bold transition ${i < filled ? `${barClass} text-white` : `bg-white/5 ${textClass} ring-1 ${ringClass}`}`}>
            {i < filled ? <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> : i + 1}
          </span>
          {i < n - 1 && <span className={`w-5 h-0.5 rounded-full ${i < filled ? barClass : "bg-white/10"}`} />}
        </div>
      ))}
    </div>
  );
}

/** Hand-drawn, subject-themed SVG scene (currentColor = subject accent). */
export function SubjectScene({ code, className = "" }: { code: string; className?: string }) {
  const k = (code || "").toLowerCase();
  const p = (props: React.SVGProps<SVGSVGElement>) => ({
    viewBox: "0 0 320 200", preserveAspectRatio: "xMidYMid slice", fill: "none",
    stroke: "currentColor", className, ...props,
  });

  if (k.includes("math")) return (
    <svg {...p({})}>
      <g opacity="0.9">
        <path d="M210 30 L270 150 L150 150 Z" strokeWidth="1.5" opacity="0.5" />
        <path d="M210 30 L150 150 M210 30 L245 120 M270 150 L245 120 L150 150" strokeWidth="1" opacity="0.35" />
        <path d="M40 150 C90 150 100 60 300 40" strokeWidth="2" opacity="0.7" />
        <g opacity="0.4">{Array.from({length:6}).map((_,i)=><circle key={i} cx={60+i*44} cy={150} r="1.6" fill="currentColor" stroke="none"/>)}</g>
        <text x="46" y="60" fontSize="20" fill="currentColor" stroke="none" opacity="0.45" fontStyle="italic">∫ƒ</text>
      </g>
    </svg>
  );

  if (k.includes("phys") || k.includes("chim") || k==="pc") return (
    <svg {...p({})}>
      <g opacity="0.9">
        <circle cx="185" cy="100" r="10" fill="currentColor" stroke="none" opacity="0.8" />
        <g opacity="0.55" strokeWidth="1.6">
          <ellipse cx="185" cy="100" rx="70" ry="26" />
          <ellipse cx="185" cy="100" rx="70" ry="26" transform="rotate(60 185 100)" />
          <ellipse cx="185" cy="100" rx="70" ry="26" transform="rotate(120 185 100)" />
        </g>
        <circle cx="255" cy="100" r="4" fill="currentColor" stroke="none" />
        {/* fiole */}
        <path d="M285 60 L285 92 L300 140 A6 6 0 0 1 294 150 L266 150 A6 6 0 0 1 260 140 L275 92 L275 60 Z" strokeWidth="1.6" opacity="0.5" />
        <path d="M270 60 L290 60" strokeWidth="2" opacity="0.6" />
      </g>
    </svg>
  );

  if (k.includes("svt") || k.includes("vie")) return (
    <svg {...p({})}>
      <g opacity="0.9" strokeWidth="1.6">
        <path d="M150 20 C210 55 150 90 210 125 C150 160 210 190 150 200" opacity="0.6" />
        <path d="M200 20 C140 55 200 90 140 125 C200 160 140 190 200 200" opacity="0.6" />
        <g opacity="0.4">{Array.from({length:6}).map((_,i)=><line key={i} x1={152+ (i%2?6:0)} y1={40+i*26} x2={198-(i%2?6:0)} y2={40+i*26}/>)}</g>
        {/* feuille */}
        <path d="M262 70 C300 70 300 130 262 130 C262 100 262 90 262 70 Z" opacity="0.5" />
        <path d="M262 70 C262 100 280 110 296 110" opacity="0.5" />
      </g>
    </svg>
  );

  if (k.includes("philo")) return (
    <svg {...p({})}>
      <g opacity="0.85" strokeWidth="1.6">
        {/* colonne */}
        <rect x="150" y="60" width="46" height="10" opacity="0.5"/>
        <rect x="154" y="150" width="38" height="12" opacity="0.5"/>
        <g opacity="0.4">{Array.from({length:5}).map((_,i)=><line key={i} x1={156+i*8} y1={70} x2={156+i*8} y2={150}/>)}</g>
        {/* livre ouvert */}
        <path d="M232 120 C255 108 280 108 300 118 L300 158 C280 148 255 148 232 160 Z" opacity="0.55"/>
        <path d="M266 114 L266 156" opacity="0.5"/>
      </g>
    </svg>
  );

  if (k.includes("angl")) return (
    <svg {...p({})}>
      <g opacity="0.85" strokeWidth="1.6">
        {/* Big Ben */}
        <rect x="250" y="55" width="26" height="120" opacity="0.5"/>
        <path d="M250 55 L263 34 L276 55 Z" opacity="0.6"/>
        <rect x="255" y="70" width="16" height="16" opacity="0.55"/>
        <line x1="263" y1="78" x2="268" y2="74" opacity="0.7"/><line x1="263" y1="78" x2="263" y2="70" opacity="0.7"/>
        {/* pont */}
        <path d="M120 175 C160 130 210 130 250 175" opacity="0.4"/>
        <g opacity="0.35">{Array.from({length:5}).map((_,i)=><line key={i} x1={140+i*24} y1={175} x2={140+i*24} y2={150+ (i===2?-6:6)}/>)}</g>
      </g>
    </svg>
  );

  // fallback — concentric arcs + dots
  return (
    <svg {...p({})}>
      <g opacity="0.5" strokeWidth="1.6">
        <circle cx="240" cy="100" r="30" /><circle cx="240" cy="100" r="55" opacity="0.6"/><circle cx="240" cy="100" r="80" opacity="0.35"/>
        <circle cx="240" cy="100" r="5" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}
