"use client";

/**
 * Named schematic figures for the cours, drawn as inline SVG (dark-friendly,
 * arctic accents). Reference one in a lesson with `[[fig:NAME]]`.
 */
export function CourseFigure({ name, caption }: { name: string; caption?: string }) {
  const fig = FIGURES[name];
  if (!fig) return null;
  return (
    <figure className="my-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] p-4">
      <div className="w-full overflow-x-auto">{fig}</div>
      {caption && <figcaption className="mt-2 text-center text-xs text-neutral-400">{caption}</figcaption>}
    </figure>
  );
}

const AX = "stroke-neutral-400";
const CURVE = "stroke-[#0db8d3]";
const DASH = "stroke-neutral-500";

const FIGURES: Record<string, React.ReactNode> = {
  // Théorème des valeurs intermédiaires
  tvi: (
    <svg viewBox="0 0 320 200" className="w-full max-w-[420px] mx-auto h-auto">
      <line x1="30" y1="170" x2="300" y2="170" className={AX} strokeWidth="1.5" />
      <line x1="40" y1="20" x2="40" y2="180" className={AX} strokeWidth="1.5" />
      <path d="M50,150 C110,150 120,40 190,55 C240,66 250,110 290,95" fill="none" className={CURVE} strokeWidth="2.5" />
      <line x1="40" y1="120" x2="230" y2="120" className={DASH} strokeWidth="1" strokeDasharray="4 4" />
      <line x1="60" y1="120" x2="60" y2="170" className={DASH} strokeWidth="1" strokeDasharray="4 4" />
      <line x1="230" y1="120" x2="230" y2="170" className={DASH} strokeWidth="1" strokeDasharray="4 4" />
      <circle cx="60" cy="120" r="3.5" fill="#10b981" />
      <circle cx="230" cy="120" r="3.5" fill="#10b981" />
      <text x="34" y="118" className="fill-neutral-400" fontSize="11" textAnchor="end">k</text>
      <text x="58" y="185" className="fill-neutral-400" fontSize="11" textAnchor="middle">a</text>
      <text x="230" y="185" className="fill-neutral-400" fontSize="11" textAnchor="middle">b</text>
      <text x="300" y="165" className="fill-neutral-400" fontSize="11">x</text>
    </svg>
  ),
  // Théorème d'encadrement (les gendarmes)
  gendarmes: (
    <svg viewBox="0 0 320 200" className="w-full max-w-[420px] mx-auto h-auto">
      <line x1="30" y1="170" x2="300" y2="170" className={AX} strokeWidth="1.5" />
      <line x1="40" y1="20" x2="40" y2="180" className={AX} strokeWidth="1.5" />
      <path d="M50,60 C130,110 210,110 290,95" fill="none" className={DASH} strokeWidth="2" />
      <path d="M50,150 C130,130 210,130 290,105" fill="none" className={DASH} strokeWidth="2" />
      <path d="M50,105 C130,120 210,120 290,100" fill="none" className={CURVE} strokeWidth="2.5" />
      <text x="295" y="88" className="fill-neutral-400" fontSize="11">h</text>
      <text x="295" y="118" className="fill-neutral-400" fontSize="11">g</text>
      <text x="150" y="112" className="fill-[#0db8d3]" fontSize="11">f</text>
    </svg>
  ),
  // Limite infinie en un point (asymptote verticale)
  asymptote: (
    <svg viewBox="0 0 320 200" className="w-full max-w-[420px] mx-auto h-auto">
      <line x1="30" y1="110" x2="300" y2="110" className={AX} strokeWidth="1.5" />
      <line x1="160" y1="20" x2="160" y2="190" className="stroke-[#f59e0b]" strokeWidth="1.2" strokeDasharray="5 4" />
      <path d="M60,105 C120,100 148,80 156,30" fill="none" className={CURVE} strokeWidth="2.5" />
      <path d="M164,190 C172,150 200,118 270,112" fill="none" className={CURVE} strokeWidth="2.5" />
      <text x="150" y="205" className="fill-neutral-400" fontSize="11" textAnchor="end">a</text>
      <text x="300" y="105" className="fill-neutral-400" fontSize="11">x</text>
    </svg>
  ),

  // Suite croissante majorée — convergence monotone
  "suite-monotone-bornee": (
    <svg viewBox="0 0 340 200" className="w-full max-w-[440px] mx-auto h-auto">
      <line x1="40" y1="170" x2="325" y2="170" className={AX} strokeWidth="1.5" />
      <line x1="40" y1="185" x2="40" y2="30" className={AX} strokeWidth="1.5" />
      <text x="318" y="186" className="fill-neutral-400" fontSize="11">n</text>

      {/* le majorant M */}
      <line x1="40" y1="60" x2="325" y2="60" className="stroke-[#f59e0b]" strokeWidth="1.3" strokeDasharray="5 4" />
      <text x="30" y="64" className="fill-[#f59e0b]" fontSize="11" textAnchor="end">M</text>

      {/* la limite, sous le majorant */}
      <line x1="40" y1="66" x2="325" y2="66" className="stroke-[#10b981]" strokeWidth="1.1" strokeDasharray="3 3" />
      <text x="332" y="70" className="fill-[#10b981]" fontSize="11">ℓ</text>

      {/* les termes, croissants et s'accumulant sous M */}
      {[[55,150],[83,127],[111,111],[139,98],[167,88],[195,81],[223,76],[251,72],[279,69],[307,67]].map(([x,y],i)=>(
        <g key={i}>
          <line x1={x} y1={y} x2={x} y2="170" className={DASH} strokeWidth="0.7" strokeDasharray="2 3" />
          <circle cx={x} cy={y} r="3.4" className="fill-[#0db8d3]" />
        </g>
      ))}
      <text x="52" y="164" className="fill-neutral-400" fontSize="9">u₀</text>
      <text x="196" y="95" className="fill-neutral-400" fontSize="10">la suite croît mais ne dépasse jamais M</text>
    </svg>
  ),

  // Suite récurrente u(n+1)=f(u(n)) — construction en escalier
  "suite-escalier": (
    <svg viewBox="0 0 340 240" className="w-full max-w-[440px] mx-auto h-auto">
      <line x1="40" y1="200" x2="325" y2="200" className={AX} strokeWidth="1.5" />
      <line x1="40" y1="215" x2="40" y2="28" className={AX} strokeWidth="1.5" />
      <text x="318" y="216" className="fill-neutral-400" fontSize="11">x</text>

      {/* droite y = x */}
      <line x1="40" y1="200" x2="310" y2="35" className={DASH} strokeWidth="1.4" strokeDasharray="5 4" />
      <text x="292" y="48" className="fill-neutral-500" fontSize="10">y = x</text>

      {/* courbe de f */}
      <polyline points="40,200 85,133 130,105 175,83 220,65 265,49 310,35" fill="none" className={CURVE} strokeWidth="2.4" />
      <text x="150" y="76" className="fill-[#0db8d3]" fontSize="11">y = f(x)</text>

      {/* escalier : vertical vers la courbe, horizontal vers y = x */}
      <g className="stroke-[#f59e0b]" strokeWidth="1.5" fill="none">
        <path d="M130,200 L130,105" />
        <path d="M130,105 L196,105" />
        <path d="M196,105 L196,75" />
        <path d="M196,75 L245,75" />
        <path d="M245,75 L245,56" />
        <path d="M245,56 L275,56" />
      </g>

      {/* points sur l'axe */}
      <circle cx="130" cy="200" r="3.2" className="fill-[#f59e0b]" />
      <circle cx="196" cy="200" r="3.2" className="fill-[#f59e0b]" />
      <circle cx="245" cy="200" r="3.2" className="fill-[#f59e0b]" />
      <line x1="196" y1="105" x2="196" y2="200" className={DASH} strokeWidth="0.7" strokeDasharray="2 3" />
      <line x1="245" y1="75" x2="245" y2="200" className={DASH} strokeWidth="0.7" strokeDasharray="2 3" />
      <text x="124" y="214" className="fill-[#f59e0b]" fontSize="10">u₀</text>
      <text x="190" y="214" className="fill-[#f59e0b]" fontSize="10">u₁</text>
      <text x="239" y="214" className="fill-[#f59e0b]" fontSize="10">u₂</text>

      {/* point fixe */}
      <circle cx="310" cy="35" r="4" className="fill-[#10b981]" />
      <text x="286" y="28" className="fill-[#10b981]" fontSize="10">ℓ = f(ℓ)</text>
    </svg>
  ),

// Convexité, concavité et point d'inflexion
  "convexite-inflexion": (
    <svg viewBox="0 0 340 210" className="w-full max-w-[440px] mx-auto h-auto">
      <line x1="25" y1="180" x2="325" y2="180" className={AX} strokeWidth="1.5" />
      <line x1="40" y1="195" x2="40" y2="25" className={AX} strokeWidth="1.5" />

      {/* courbe : concave puis convexe, inflexion au centre */}
      <path d="M55,150 C95,85 135,58 175,105 C215,152 255,140 305,48" fill="none" className={CURVE} strokeWidth="2.5" />

      {/* tangente côté concave — courbe au-dessous */}
      <line x1="75" y1="88" x2="165" y2="55" className={DASH} strokeWidth="1.2" strokeDasharray="4 3" />
      <text x="70" y="50" className="fill-neutral-500" fontSize="10">concave</text>
      <text x="62" y="64" className="fill-neutral-500" fontSize="9">f″ ≤ 0 — sous la tangente</text>

      {/* tangente côté convexe — courbe au-dessus */}
      <line x1="200" y1="118" x2="295" y2="152" className={DASH} strokeWidth="1.2" strokeDasharray="4 3" />
      <text x="240" y="172" className="fill-neutral-500" fontSize="10">convexe</text>
      <text x="212" y="186" className="fill-neutral-500" fontSize="9">f″ ≥ 0 — au-dessus de la tangente</text>

      {/* point d'inflexion */}
      <line x1="145" y1="88" x2="205" y2="122" className="stroke-[#f59e0b]" strokeWidth="1.4" />
      <circle cx="175" cy="105" r="4.5" className="fill-[#f59e0b]" />
      <line x1="175" y1="105" x2="175" y2="180" className={DASH} strokeWidth="0.8" strokeDasharray="2 3" />
      <text x="152" y="34" className="fill-[#f59e0b]" fontSize="10">point d&apos;inflexion</text>
      <text x="150" y="47" className="fill-[#f59e0b]" fontSize="9">la courbe traverse sa tangente</text>
    </svg>
  ),

  // ln et exp : deux courbes symétriques par rapport à y = x
  "ln-exp-symetrie": (
    <svg viewBox="0 0 320 250" className="w-full max-w-[400px] mx-auto h-auto">
      <line x1="20" y1="170" x2="300" y2="170" className={AX} strokeWidth="1.4" />
      <line x1="90" y1="240" x2="90" y2="20" className={AX} strokeWidth="1.4" />
      <text x="293" y="186" className="fill-neutral-400" fontSize="10">x</text>

      {/* axe de symétrie y = x */}
      <line x1="30" y1="230" x2="250" y2="10" className={DASH} strokeWidth="1.3" strokeDasharray="5 4" />
      <text x="228" y="26" className="fill-neutral-500" fontSize="10">y = x</text>

      {/* exponentielle : passe par (0,1), asymptote horizontale */}
      <path d="M20,166 C60,162 85,150 110,120 C130,95 145,52 158,20" fill="none" className={CURVE} strokeWidth="2.4" />
      <text x="160" y="38" className="fill-[#0db8d3]" fontSize="11">y = eˣ</text>

      {/* logarithme : symétrique, passe par (1,0), asymptote verticale */}
      <path d="M94,240 C98,200 110,175 140,155 C165,138 208,123 240,110" fill="none" className="stroke-[#10b981]" strokeWidth="2.4" />
      <text x="238" y="104" className="fill-[#10b981]" fontSize="11">y = ln x</text>

      {/* points remarquables (0,1) et (1,0) */}
      <circle cx="90" cy="145" r="3.4" className="fill-[#0db8d3]" />
      <text x="62" y="142" className="fill-[#0db8d3]" fontSize="9">(0 ; 1)</text>
      <circle cx="115" cy="170" r="3.4" className="fill-[#10b981]" />
      <text x="110" y="188" className="fill-[#10b981]" fontSize="9">(1 ; 0)</text>

      <text x="20" y="226" className="fill-neutral-400" fontSize="9">réciproques l&apos;une de l&apos;autre</text>
    </svg>
  ),

// Plan complexe : affixe, module, argument
  "plan-complexe": (
    <svg viewBox="0 0 340 230" className="w-full max-w-[420px] mx-auto h-auto">
      <defs>
        <marker id="pc-a" markerWidth="9" markerHeight="9" refX="7" refY="3.2" orient="auto">
          <path d="M0,0 L7,3.2 L0,6.4 Z" className="fill-[#0db8d3]" />
        </marker>
      </defs>

      {/* axes */}
      <line x1="30" y1="170" x2="320" y2="170" className={AX} strokeWidth="1.5" />
      <line x1="70" y1="215" x2="70" y2="25" className={AX} strokeWidth="1.5" />
      <text x="310" y="188" className="fill-neutral-400" fontSize="11">Re</text>
      <text x="44" y="34" className="fill-neutral-400" fontSize="11">Im</text>
      <text x="58" y="186" className="fill-neutral-400" fontSize="10">O</text>

      {/* le point M d'affixe z */}
      <line x1="70" y1="170" x2="228" y2="72" className="stroke-[#0db8d3]" strokeWidth="2.4" markerEnd="url(#pc-a)" />
      <circle cx="228" cy="72" r="4.5" className="fill-[#0db8d3]" />
      <text x="236" y="66" className="fill-[#0db8d3]" fontSize="12">M(z)</text>

      {/* projections a et b */}
      <line x1="228" y1="72" x2="228" y2="170" className={DASH} strokeWidth="1.1" strokeDasharray="3 3" />
      <line x1="228" y1="72" x2="70" y2="72" className={DASH} strokeWidth="1.1" strokeDasharray="3 3" />
      <circle cx="228" cy="170" r="3" className="fill-neutral-400" />
      <circle cx="70" cy="72" r="3" className="fill-neutral-400" />
      <text x="224" y="188" className="fill-neutral-400" fontSize="11">a</text>
      <text x="52" y="76" className="fill-neutral-400" fontSize="11">b</text>

      {/* module */}
      <text x="132" y="108" className="fill-[#0db8d3]" fontSize="12">r = |z|</text>

      {/* argument */}
      <path d="M108,170 A38,38 0 0 0 94,146" fill="none" className="stroke-[#f59e0b]" strokeWidth="1.6" />
      <text x="112" y="158" className="fill-[#f59e0b]" fontSize="12">θ</text>
      <text x="96" y="212" className="fill-[#f59e0b]" fontSize="10">θ = arg(z)</text>

      <text x="190" y="212" className="fill-neutral-400" fontSize="10">z = a + ib = r e^(iθ)</text>
    </svg>
  ),

  // Rotation de centre Ω et d'angle θ
  "complexe-rotation": (
    <svg viewBox="0 0 320 210" className="w-full max-w-[400px] mx-auto h-auto">
      <defs>
        <marker id="cr-a" markerWidth="9" markerHeight="9" refX="7" refY="3.2" orient="auto">
          <path d="M0,0 L7,3.2 L0,6.4 Z" className="fill-[#0db8d3]" />
        </marker>
        <marker id="cr-b" markerWidth="9" markerHeight="9" refX="7" refY="3.2" orient="auto">
          <path d="M0,0 L7,3.2 L0,6.4 Z" className="fill-[#10b981]" />
        </marker>
      </defs>

      {/* cercle des points à distance ΩM */}
      <circle cx="150" cy="115" r="76" fill="none" className={DASH} strokeWidth="1.1" strokeDasharray="4 4" />

      {/* centre */}
      <circle cx="150" cy="115" r="4.5" className="fill-[#f59e0b]" />
      <text x="138" y="134" className="fill-[#f59e0b]" fontSize="12">Ω(ω)</text>

      {/* M et son image M' */}
      <line x1="150" y1="115" x2="226" y2="115" className="stroke-[#0db8d3]" strokeWidth="2.2" markerEnd="url(#cr-a)" />
      <circle cx="226" cy="115" r="4.5" className="fill-[#0db8d3]" />
      <text x="232" y="120" className="fill-[#0db8d3]" fontSize="12">M(z)</text>

      <line x1="150" y1="115" x2="204" y2="61" className="stroke-[#10b981]" strokeWidth="2.2" markerEnd="url(#cr-b)" />
      <circle cx="204" cy="61" r="4.5" className="fill-[#10b981]" />
      <text x="210" y="54" className="fill-[#10b981]" fontSize="12">M&apos;(z&apos;)</text>

      {/* arc de l'angle */}
      <path d="M198,115 A48,48 0 0 0 184,81" fill="none" className="stroke-[#f59e0b]" strokeWidth="1.8" />
      <text x="196" y="97" className="fill-[#f59e0b]" fontSize="12">θ</text>

      <text x="22" y="192" className="fill-neutral-400" fontSize="11">z&apos; − ω = e^(iθ) (z − ω)</text>
      <text x="22" y="206" className="fill-neutral-400" fontSize="9">même module, argument augmenté de θ</text>
    </svg>
  ),

  /* ===================== PHYSIQUE — schémas & courbes ===================== */

  // Onde transversale périodique — instantané, longueur d'onde λ
  "onde-transversale": (
    <svg viewBox="0 0 360 180" className="w-full max-w-[460px] mx-auto h-auto">
      <line x1="20" y1="90" x2="345" y2="90" className={AX} strokeWidth="1.5" />
      <path d="M20,90 Q50,30 80,90 T140,90 T200,90 T260,90 T320,90" fill="none" className={CURVE} strokeWidth="2.5" />
      {/* λ measured crest-to-crest (one full period): crests at x=50 and x=170 */}
      <line x1="50" y1="45" x2="170" y2="45" className="stroke-[#f59e0b]" strokeWidth="1.4" />
      <line x1="50" y1="45" x2="50" y2="60" className="stroke-[#f59e0b]" strokeWidth="1.4" />
      <line x1="170" y1="45" x2="170" y2="60" className="stroke-[#f59e0b]" strokeWidth="1.4" />
      <text x="110" y="40" className="fill-[#f59e0b]" fontSize="12" textAnchor="middle">λ</text>
      <text x="338" y="105" className="fill-neutral-400" fontSize="11">x</text>
      <text x="30" y="30" className="fill-neutral-400" fontSize="11">y</text>
    </svg>
  ),

  // Onde le long d'une corde — déformation qui se propage à la célérité v
  "onde-corde": (
    <svg viewBox="0 0 360 140" className="w-full max-w-[460px] mx-auto h-auto">
      <line x1="20" y1="100" x2="345" y2="100" className={AX} strokeWidth="1.5" />
      <path d="M20,100 L120,100 Q150,40 180,100 L345,100" fill="none" className={CURVE} strokeWidth="2.5" />
      <line x1="200" y1="60" x2="250" y2="60" className="stroke-[#10b981]" strokeWidth="2" markerEnd="url(#arrow)" />
      <text x="238" y="52" className="fill-[#10b981]" fontSize="12" textAnchor="middle">v</text>
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" className="fill-[#10b981]" /></marker>
      </defs>
    </svg>
  ),

  // Diffraction par une fente de largeur a
  diffraction: (
    <svg viewBox="0 0 360 180" className="w-full max-w-[460px] mx-auto h-auto">
      <line x1="30" y1="30" x2="30" y2="150" className="stroke-neutral-500" strokeWidth="3" />
      <line x1="150" y1="20" x2="150" y2="76" className="stroke-neutral-500" strokeWidth="3" />
      <line x1="150" y1="104" x2="150" y2="160" className="stroke-neutral-500" strokeWidth="3" />
      <line x1="45" y1="90" x2="150" y2="90" className={CURVE} strokeWidth="1.6" />
      <line x1="60" y1="70" x2="150" y2="70" className={CURVE} strokeWidth="1.2" />
      <line x1="60" y1="110" x2="150" y2="110" className={CURVE} strokeWidth="1.2" />
      <path d="M150,90 L300,40" className={CURVE} strokeWidth="1.4" />
      <path d="M150,90 L320,90" className={CURVE} strokeWidth="1.4" />
      <path d="M150,90 L300,140" className={CURVE} strokeWidth="1.4" />
      <text x="160" y="96" className="fill-[#f59e0b]" fontSize="11">a</text>
      <text x="250" y="70" className="fill-neutral-400" fontSize="11">θ</text>
    </svg>
  ),

  // Décroissance radioactive N(t), demi-vie t½
  radioactivite: (
    <svg viewBox="0 0 340 200" className="w-full max-w-[440px] mx-auto h-auto">
      <line x1="40" y1="170" x2="320" y2="170" className={AX} strokeWidth="1.5" />
      <line x1="40" y1="20" x2="40" y2="180" className={AX} strokeWidth="1.5" />
      <path d="M40,40 C110,120 180,155 310,165" fill="none" className={CURVE} strokeWidth="2.5" />
      <line x1="40" y1="105" x2="115" y2="105" className={DASH} strokeWidth="1" strokeDasharray="4 4" />
      <line x1="115" y1="105" x2="115" y2="170" className={DASH} strokeWidth="1" strokeDasharray="4 4" />
      <text x="34" y="44" className="fill-neutral-400" fontSize="11" textAnchor="end">N₀</text>
      <text x="30" y="108" className="fill-neutral-400" fontSize="11" textAnchor="end">N₀/2</text>
      <text x="115" y="185" className="fill-neutral-400" fontSize="11" textAnchor="middle">t½</text>
      <text x="312" y="185" className="fill-neutral-400" fontSize="11">t</text>
    </svg>
  ),
  // Diagramme (N, Z) — vallée de stabilité
  "diagramme-nz": (
    <svg viewBox="0 0 340 220" className="w-full max-w-[460px] mx-auto h-auto">
      <line x1="45" y1="190" x2="325" y2="190" className={AX} strokeWidth="1.5" />
      <line x1="45" y1="200" x2="45" y2="20" className={AX} strokeWidth="1.5" />
      <line x1="45" y1="190" x2="215" y2="20" className={DASH} strokeWidth="1.2" strokeDasharray="5 4" />
      <path d="M55,182 C120,120 165,95 210,60 C240,40 250,34 262,30" fill="none" className={CURVE} strokeWidth="6" strokeLinecap="round" opacity="0.3" />
      <path d="M55,182 C120,120 165,95 210,60 C240,40 250,34 262,30" fill="none" className={CURVE} strokeWidth="2" />
      <line x1="262" y1="30" x2="262" y2="190" className="stroke-[#f59e0b]" strokeWidth="1" strokeDasharray="4 4" />
      <text x="196" y="32" className="fill-neutral-400" fontSize="10">N = Z</text>
      <text x="112" y="72" className="fill-[#0db8d3]" fontSize="10">vallée de stabilité</text>
      <text x="150" y="150" className="fill-neutral-400" fontSize="10">β⁻ (N &gt; Z)</text>
      <text x="222" y="182" className="fill-neutral-400" fontSize="10">β⁺</text>
      <text x="268" y="58" className="fill-[#f59e0b]" fontSize="11">α</text>
      <text x="262" y="206" className="fill-neutral-400" fontSize="9" textAnchor="middle">Z = 83</text>
      <text x="318" y="205" className="fill-neutral-400" fontSize="11">Z</text>
      <text x="40" y="28" className="fill-neutral-400" fontSize="11" textAnchor="end">N</text>
    </svg>
  ),

  // Courbe d'Aston — -Eℓ/A en fonction de A (minimum vers A ≈ 56)
  "courbe-aston": (
    <svg viewBox="0 0 340 210" className="w-full max-w-[460px] mx-auto h-auto">
      <line x1="48" y1="60" x2="325" y2="60" className={AX} strokeWidth="1.5" />
      <line x1="48" y1="45" x2="48" y2="195" className={AX} strokeWidth="1.5" />
      <path d="M55,72 C72,150 98,176 132,179 C176,183 212,177 252,169 C286,162 306,159 320,157" fill="none" className={CURVE} strokeWidth="2.5" />
      <line x1="132" y1="60" x2="132" y2="179" className={DASH} strokeWidth="1" strokeDasharray="4 4" />
      <circle cx="132" cy="179" r="3.5" fill="#10b981" />
      <text x="132" y="197" className="fill-neutral-400" fontSize="10" textAnchor="middle">A ≈ 56 (Fe)</text>
      <text x="66" y="120" className="fill-[#10b981]" fontSize="10">fusion →</text>
      <text x="236" y="150" className="fill-[#f59e0b]" fontSize="10">← fission</text>
      <text x="44" y="52" className="fill-neutral-400" fontSize="10" textAnchor="end">−Eℓ/A</text>
      <text x="318" y="55" className="fill-neutral-400" fontSize="11">A</text>
    </svg>
  ),

  // Diagramme d'énergie — réaction exoénergétique
  "diagramme-energie-nucleaire": (
    <svg viewBox="0 0 340 200" className="w-full max-w-[440px] mx-auto h-auto">
      <line x1="55" y1="182" x2="55" y2="22" className={AX} strokeWidth="1.5" />
      <line x1="70" y1="55" x2="185" y2="55" className={CURVE} strokeWidth="2.5" />
      <line x1="200" y1="140" x2="315" y2="140" className="stroke-[#10b981]" strokeWidth="2.5" />
      <line x1="185" y1="55" x2="200" y2="140" className={DASH} strokeWidth="1.2" strokeDasharray="4 4" />
      <line x1="185" y1="55" x2="290" y2="55" className={DASH} strokeWidth="0.8" strokeDasharray="3 3" />
      <line x1="258" y1="58" x2="258" y2="132" className="stroke-[#f59e0b]" strokeWidth="1.5" />
      <path d="M254,132 L258,140 L262,132 Z" fill="#f59e0b" />
      <text x="127" y="48" className="fill-[#0db8d3]" fontSize="10" textAnchor="middle">réactifs (Σm·c²)</text>
      <text x="257" y="154" className="fill-[#10b981]" fontSize="10" textAnchor="middle">produits (Σm·c²)</text>
      <text x="266" y="100" className="fill-[#f59e0b]" fontSize="10">|ΔE| = E libérée</text>
      <text x="40" y="28" className="fill-neutral-400" fontSize="11" textAnchor="end">E</text>
    </svg>
  ),


  // Charge d'un condensateur — u_C(t) croît vers E, constante de temps τ
  "rc-charge": (
    <svg viewBox="0 0 340 200" className="w-full max-w-[440px] mx-auto h-auto">
      <line x1="40" y1="170" x2="320" y2="170" className={AX} strokeWidth="1.5" />
      <line x1="40" y1="20" x2="40" y2="180" className={AX} strokeWidth="1.5" />
      <line x1="40" y1="40" x2="320" y2="40" className={DASH} strokeWidth="1" strokeDasharray="5 4" />
      <path d="M40,170 C110,70 200,48 315,44" fill="none" className={CURVE} strokeWidth="2.5" />
      <text x="34" y="44" className="fill-neutral-400" fontSize="11" textAnchor="end">E</text>
      <text x="305" y="60" className="fill-[#0db8d3]" fontSize="11">u<tspan fontSize="8" dy="2">C</tspan></text>
      <text x="312" y="185" className="fill-neutral-400" fontSize="11">t</text>
    </svg>
  ),

  // Décharge d'un condensateur — u_C(t) décroît
  "rc-decharge": (
    <svg viewBox="0 0 340 200" className="w-full max-w-[440px] mx-auto h-auto">
      <line x1="40" y1="170" x2="320" y2="170" className={AX} strokeWidth="1.5" />
      <line x1="40" y1="20" x2="40" y2="180" className={AX} strokeWidth="1.5" />
      <path d="M40,44 C120,150 200,164 315,168" fill="none" className={CURVE} strokeWidth="2.5" />
      <text x="34" y="48" className="fill-neutral-400" fontSize="11" textAnchor="end">E</text>
      <text x="312" y="185" className="fill-neutral-400" fontSize="11">t</text>
    </svg>
  ),

  // Suivi cinétique — [réactif] décroît, [produit] croît, avec t½
  cinetique: (
    <svg viewBox="0 0 340 200" className="w-full max-w-[440px] mx-auto h-auto">
      <line x1="40" y1="170" x2="320" y2="170" className={AX} strokeWidth="1.5" />
      <line x1="40" y1="20" x2="40" y2="180" className={AX} strokeWidth="1.5" />
      <path d="M40,40 C120,120 200,150 310,158" fill="none" className={CURVE} strokeWidth="2.5" />
      <path d="M40,158 C120,80 200,50 310,42" fill="none" className="stroke-[#10b981]" strokeWidth="2.5" />
      <text x="300" y="150" className="fill-[#0db8d3]" fontSize="11" textAnchor="end">[réactif]</text>
      <text x="300" y="56" className="fill-[#10b981]" fontSize="11" textAnchor="end">[produit]</text>
      <text x="312" y="185" className="fill-neutral-400" fontSize="11">t</text>
    </svg>
  ),

  // Dosage acido-basique — pH = f(V), saut à l'équivalence
  "titrage-ph": (
    <svg viewBox="0 0 340 200" className="w-full max-w-[440px] mx-auto h-auto">
      <line x1="40" y1="170" x2="320" y2="170" className={AX} strokeWidth="1.5" />
      <line x1="40" y1="20" x2="40" y2="180" className={AX} strokeWidth="1.5" />
      <path d="M40,150 C120,140 150,132 175,95 C185,80 190,55 260,44 C290,40 305,38 315,37" fill="none" className={CURVE} strokeWidth="2.5" />
      <line x1="185" y1="20" x2="185" y2="170" className={DASH} strokeWidth="1" strokeDasharray="4 4" />
      <circle cx="183" cy="74" r="3.5" fill="#f59e0b" />
      <text x="196" y="72" className="fill-[#f59e0b]" fontSize="11">E</text>
      <text x="185" y="185" className="fill-neutral-400" fontSize="11" textAnchor="middle">V<tspan fontSize="8" dy="2">E</tspan></text>
      <text x="30" y="28" className="fill-neutral-400" fontSize="11" textAnchor="end">pH</text>
      <text x="308" y="185" className="fill-neutral-400" fontSize="11">V</text>
    </svg>
  ),

  // Pile Daniell — deux demi-piles, pont salin, voltmètre
  pile: (
    <svg viewBox="0 0 360 200" className="w-full max-w-[460px] mx-auto h-auto">
      <rect x="40" y="80" width="80" height="90" rx="4" fill="none" className="stroke-neutral-400" strokeWidth="1.5" />
      <rect x="240" y="80" width="80" height="90" rx="4" fill="none" className="stroke-neutral-400" strokeWidth="1.5" />
      <path d="M120,60 Q180,20 240,60" fill="none" className="stroke-neutral-500" strokeWidth="6" />
      <rect x="70" y="50" width="8" height="90" className="fill-neutral-400" />
      <rect x="282" y="50" width="8" height="90" className="fill-[#f59e0b]" />
      <line x1="74" y1="50" x2="74" y2="28" className="stroke-neutral-400" strokeWidth="1.5" />
      <line x1="286" y1="50" x2="286" y2="28" className="stroke-neutral-400" strokeWidth="1.5" />
      <line x1="74" y1="28" x2="160" y2="28" className="stroke-neutral-400" strokeWidth="1.5" />
      <line x1="200" y1="28" x2="286" y2="28" className="stroke-neutral-400" strokeWidth="1.5" />
      <circle cx="180" cy="28" r="16" fill="none" className="stroke-[#0db8d3]" strokeWidth="1.5" />
      <text x="180" y="33" className="fill-[#0db8d3]" fontSize="12" textAnchor="middle">V</text>
      <text x="74" y="150" className="fill-neutral-400" fontSize="10" textAnchor="middle">Zn</text>
      <text x="286" y="150" className="fill-neutral-400" fontSize="10" textAnchor="middle">Cu</text>
      <text x="180" y="52" className="fill-neutral-400" fontSize="9" textAnchor="middle">pont salin</text>
    </svg>
  ),

  // Mouvement d'un projectile — trajectoire parabolique
  projectile: (
    <svg viewBox="0 0 360 180" className="w-full max-w-[460px] mx-auto h-auto">
      <line x1="30" y1="160" x2="345" y2="160" className={AX} strokeWidth="1.5" />
      <line x1="30" y1="20" x2="30" y2="170" className={AX} strokeWidth="1.5" />
      <path d="M30,160 Q180,10 320,160" fill="none" className={CURVE} strokeWidth="2.5" />
      <line x1="30" y1="160" x2="70" y2="128" className="stroke-[#10b981]" strokeWidth="2" markerEnd="url(#arr2)" />
      <text x="60" y="120" className="fill-[#10b981]" fontSize="12">v₀</text>
      <text x="46" y="152" className="fill-neutral-400" fontSize="11">α</text>
      <text x="335" y="155" className="fill-neutral-400" fontSize="11">x</text>
      <text x="20" y="28" className="fill-neutral-400" fontSize="11">y</text>
      <defs><marker id="arr2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" className="fill-[#10b981]" /></marker></defs>
    </svg>
  ),

  // Position, vitesse et accélération d'un point mobile
  "vecteurs-cinematiques": (
    <svg viewBox="0 0 360 200" className="w-full max-w-[460px] mx-auto h-auto">
      <line x1="30" y1="170" x2="345" y2="170" className={AX} strokeWidth="1.4" />
      <line x1="40" y1="20" x2="40" y2="180" className={AX} strokeWidth="1.4" />
      <text x="336" y="186" className="fill-neutral-400" fontSize="11">x</text>
      <text x="28" y="28" className="fill-neutral-400" fontSize="11">y</text>
      {/* trajectoire */}
      <path d="M60,150 C120,40 230,40 320,120" fill="none" className={CURVE} strokeWidth="2.4" />
      {/* point M */}
      <circle cx="170" cy="63" r="4.5" className="fill-[#0db8d3]" />
      <text x="162" y="52" className="fill-[#0db8d3]" fontSize="11">M</text>
      {/* vecteur position OM */}
      <line x1="40" y1="170" x2="166" y2="66" className="stroke-neutral-400" strokeWidth="1.6" />
      <path d="M170,63 l-9,0.5 l3,-8 z" className="fill-neutral-400" />
      <text x="86" y="126" className="fill-neutral-400" fontSize="10">OM</text>
      {/* vitesse : tangente */}
      <line x1="170" y1="63" x2="248" y2="57" className="stroke-[#10b981]" strokeWidth="2.4" />
      <path d="M254,56 l-9,-4 l1,8.5 z" className="fill-[#10b981]" />
      <text x="224" y="44" className="fill-[#10b981]" fontSize="11">v</text>
      {/* accélération : vers la concavité */}
      <line x1="170" y1="63" x2="182" y2="126" className="stroke-[#f59e0b]" strokeWidth="2.4" />
      <path d="M183,132 l4.5,-8 l-8.6,-1.6 z" className="fill-[#f59e0b]" />
      <text x="188" y="110" className="fill-[#f59e0b]" fontSize="11">a</text>
      <text x="200" y="190" className="fill-neutral-400" fontSize="9.5">v tangente · a vers la concavité</text>
    </svg>
  ),

  // Bilan des forces sur un corps tombant dans un fluide
  "chute-fluide-forces": (
    <svg viewBox="0 0 320 220" className="w-full max-w-[380px] mx-auto h-auto">
      {/* éprouvette */}
      <path d="M90,20 L90,200 L230,200 L230,20" fill="none" className="stroke-neutral-500" strokeWidth="1.8" />
      <rect x="91" y="46" width="138" height="153" className="fill-[#0db8d3]/10" />
      <line x1="91" y1="46" x2="229" y2="46" className="stroke-[#0db8d3]" strokeWidth="1.4" />
      <text x="240" y="50" className="fill-[#0db8d3]" fontSize="9.5">fluide ρ_f</text>
      {/* bille */}
      <circle cx="160" cy="112" r="11" className="fill-neutral-400/50 stroke-neutral-400" strokeWidth="1.6" />
      <text x="128" y="108" className="fill-neutral-400" fontSize="9.5">ρ_s , V</text>
      {/* poids vers le bas */}
      <line x1="160" y1="123" x2="160" y2="180" className="stroke-[#f59e0b]" strokeWidth="2.4" />
      <path d="M160,186 l-4.5,-9 l9,0 z" className="fill-[#f59e0b]" />
      <text x="166" y="170" className="fill-[#f59e0b]" fontSize="11">P = ρ_s V g</text>
      {/* poussée vers le haut */}
      <line x1="146" y1="101" x2="146" y2="62" className="stroke-[#10b981]" strokeWidth="2.4" />
      <path d="M146,56 l-4.5,9 l9,0 z" className="fill-[#10b981]" />
      <text x="16" y="70" className="fill-[#10b981]" fontSize="10.5">F_A = ρ_f V g</text>
      {/* frottement vers le haut */}
      <line x1="174" y1="101" x2="174" y2="76" className={CURVE} strokeWidth="2.4" />
      <path d="M174,70 l-4.5,9 l9,0 z" className="fill-[#0db8d3]" />
      <text x="182" y="80" className="fill-[#0db8d3]" fontSize="10.5">f = k v</text>
      {/* sens du mouvement */}
      <line x1="262" y1="110" x2="262" y2="160" className={DASH} strokeWidth="1.6" />
      <path d="M262,166 l-4,-8 l8,0 z" className="fill-neutral-500" />
      <text x="252" y="182" className="fill-neutral-400" fontSize="9.5">v</text>
    </svg>
  ),

  // Vitesse au cours d'une chute dans un fluide
  "chute-fluide-vitesse": (
    <svg viewBox="0 0 340 200" className="w-full max-w-[440px] mx-auto h-auto">
      <line x1="40" y1="170" x2="320" y2="170" className={AX} strokeWidth="1.5" />
      <line x1="40" y1="20" x2="40" y2="180" className={AX} strokeWidth="1.5" />
      {/* asymptote v_limite */}
      <line x1="40" y1="44" x2="320" y2="44" className={DASH} strokeWidth="1" strokeDasharray="5 4" />
      <text x="34" y="48" className="fill-neutral-400" fontSize="10" textAnchor="end">v_ℓ</text>
      {/* courbe */}
      <path d="M40,170 C105,74 195,50 315,45" fill="none" className={CURVE} strokeWidth="2.5" />
      {/* tangente à l'origine */}
      <line x1="40" y1="170" x2="132" y2="44" className="stroke-[#f59e0b]" strokeWidth="1.5" strokeDasharray="4 3" />
      <line x1="132" y1="44" x2="132" y2="170" className={DASH} strokeWidth="1" strokeDasharray="3 3" />
      <text x="132" y="185" className="fill-[#f59e0b]" fontSize="11" textAnchor="middle">τ</text>
      <text x="62" y="118" className="fill-[#f59e0b]" fontSize="9">pente a₀</text>
      {/* zones */}
      <text x="150" y="120" className="fill-neutral-400" fontSize="9.5">régime transitoire</text>
      <text x="216" y="66" className="fill-neutral-400" fontSize="9.5">régime permanent</text>
      <text x="312" y="185" className="fill-neutral-400" fontSize="11">t</text>
      <text x="26" y="28" className="fill-neutral-400" fontSize="11">v</text>
    </svg>
  ),

  // Flèche, portée et temps de vol d'un projectile
  "projectile-portee": (
    <svg viewBox="0 0 360 200" className="w-full max-w-[470px] mx-auto h-auto">
      <line x1="30" y1="168" x2="348" y2="168" className={AX} strokeWidth="1.5" />
      <line x1="40" y1="20" x2="40" y2="178" className={AX} strokeWidth="1.5" />
      {/* trajectoire */}
      <path d="M40,168 Q175,-4 310,168" fill="none" className={CURVE} strokeWidth="2.5" />
      {/* vitesse initiale */}
      <line x1="40" y1="168" x2="86" y2="130" className="stroke-[#10b981]" strokeWidth="2.2" />
      <path d="M91,126 l-8.6,-2 l2,8.4 z" className="fill-[#10b981]" />
      <text x="76" y="120" className="fill-[#10b981]" fontSize="11">v₀</text>
      <path d="M62,168 A22,22 0 0,0 58,155" fill="none" className={AX} strokeWidth="1.2" />
      <text x="64" y="160" className="fill-neutral-400" fontSize="10">α</text>
      {/* sommet */}
      <circle cx="175" cy="82" r="4" fill="#f59e0b" />
      <line x1="40" y1="82" x2="175" y2="82" className={DASH} strokeWidth="1" strokeDasharray="4 4" />
      <line x1="175" y1="82" x2="175" y2="168" className={DASH} strokeWidth="1" strokeDasharray="4 4" />
      <text x="34" y="86" className="fill-[#f59e0b]" fontSize="11" textAnchor="end">h</text>
      <text x="182" y="76" className="fill-neutral-400" fontSize="9.5">sommet : v_y = 0</text>
      {/* vitesse au sommet : horizontale */}
      <line x1="175" y1="82" x2="215" y2="82" className="stroke-[#10b981]" strokeWidth="2" />
      <path d="M220,82 l-9,-4.5 l0,9 z" className="fill-[#10b981]" />
      {/* portée */}
      <line x1="40" y1="188" x2="310" y2="188" className="stroke-[#f59e0b]" strokeWidth="1.5" />
      <path d="M40,188 l9,-4 l0,8 z" className="fill-[#f59e0b]" />
      <path d="M310,188 l-9,-4 l0,8 z" className="fill-[#f59e0b]" />
      <text x="175" y="200" className="fill-[#f59e0b]" fontSize="10.5" textAnchor="middle">D = v₀² sin 2α / g</text>
      <text x="340" y="162" className="fill-neutral-400" fontSize="11">x</text>
    </svg>
  ),

  // Chronophotographie d'un projectile
  "chronophoto-projectile": (
    <svg viewBox="0 0 360 200" className="w-full max-w-[470px] mx-auto h-auto">
      <line x1="30" y1="172" x2="348" y2="172" className={AX} strokeWidth="1.4" />
      <line x1="40" y1="20" x2="40" y2="182" className={AX} strokeWidth="1.4" />
      <path d="M40,160 Q175,4 310,160" fill="none" className={DASH} strokeWidth="1.2" strokeDasharray="4 4" />
      {/* positions successives, espacement horizontal constant */}
      <g className="fill-[#0db8d3]">
        <circle cx="40" cy="160" r="4" />
        <circle cx="70" cy="127" r="4" />
        <circle cx="100" cy="102" r="4" />
        <circle cx="130" cy="85" r="4" />
        <circle cx="160" cy="76" r="4" />
        <circle cx="190" cy="76" r="4" />
        <circle cx="220" cy="85" r="4" />
        <circle cx="250" cy="102" r="4" />
        <circle cx="280" cy="127" r="4" />
        <circle cx="310" cy="160" r="4" />
      </g>
      {/* écarts horizontaux constants */}
      <g className="stroke-[#10b981]" strokeWidth="1.2">
        <line x1="40" y1="186" x2="70" y2="186" />
        <line x1="70" y1="186" x2="100" y2="186" />
        <line x1="100" y1="186" x2="130" y2="186" />
        <line x1="40" y1="182" x2="40" y2="190" />
        <line x1="70" y1="182" x2="70" y2="190" />
        <line x1="100" y1="182" x2="100" y2="190" />
        <line x1="130" y1="182" x2="130" y2="190" />
      </g>
      <text x="146" y="190" className="fill-[#10b981]" fontSize="9.5">Δx constant ⇒ mouvement horizontal uniforme</text>
      <text x="200" y="36" className="fill-neutral-400" fontSize="9.5">positions séparées de τ</text>
      <text x="340" y="166" className="fill-neutral-400" fontSize="11">x</text>
    </svg>
  ),

  // Déviation d'une particule chargée dans un condensateur plan
  "particule-champ-e": (
    <svg viewBox="0 0 360 200" className="w-full max-w-[470px] mx-auto h-auto">
      {/* plaques */}
      <line x1="80" y1="58" x2="230" y2="58" className="stroke-neutral-400" strokeWidth="3" />
      <line x1="80" y1="138" x2="230" y2="138" className="stroke-neutral-400" strokeWidth="3" />
      <text x="70" y="54" className="fill-neutral-400" fontSize="12" textAnchor="end">+</text>
      <text x="70" y="146" className="fill-neutral-400" fontSize="12" textAnchor="end">−</text>
      {/* champ E */}
      <g className="stroke-[#f59e0b]" strokeWidth="1.3">
        <line x1="110" y1="64" x2="110" y2="126" />
        <line x1="155" y1="64" x2="155" y2="126" />
        <line x1="200" y1="64" x2="200" y2="126" />
      </g>
      <g className="fill-[#f59e0b]">
        <path d="M110,132 l-4,-8 l8,0 z" />
        <path d="M155,132 l-4,-8 l8,0 z" />
        <path d="M200,132 l-4,-8 l8,0 z" />
      </g>
      <text x="206" y="100" className="fill-[#f59e0b]" fontSize="11">E</text>
      {/* distance d */}
      <line x1="66" y1="58" x2="66" y2="138" className={DASH} strokeWidth="1.2" />
      <text x="56" y="102" className="fill-neutral-400" fontSize="10" textAnchor="end">d</text>
      {/* trajectoire parabolique */}
      <line x1="20" y1="98" x2="80" y2="98" className={CURVE} strokeWidth="2.2" />
      <path d="M80,98 Q166,98 230,140" fill="none" className={CURVE} strokeWidth="2.2" />
      <line x1="230" y1="140" x2="330" y2="180" className={CURVE} strokeWidth="2.2" strokeDasharray="6 3" />
      <text x="22" y="90" className="fill-[#0db8d3]" fontSize="10">v₀</text>
      {/* longueur l */}
      <line x1="80" y1="164" x2="230" y2="164" className="stroke-[#10b981]" strokeWidth="1.3" />
      <path d="M80,164 l9,-4 l0,8 z" className="fill-[#10b981]" />
      <path d="M230,164 l-9,-4 l0,8 z" className="fill-[#10b981]" />
      <text x="152" y="178" className="fill-[#10b981]" fontSize="10" textAnchor="middle">ℓ</text>
      {/* écran */}
      <line x1="336" y1="40" x2="336" y2="190" className="stroke-neutral-500" strokeWidth="2.4" />
      <text x="310" y="34" className="fill-neutral-400" fontSize="9.5">écran</text>
      <text x="246" y="126" className="fill-neutral-400" fontSize="9.5">rectiligne uniforme</text>
    </svg>
  ),

  // Mouvement circulaire dans un champ magnétique
  "particule-champ-b": (
    <svg viewBox="0 0 340 210" className="w-full max-w-[420px] mx-auto h-auto">
      {/* zone de champ, B sortant : croix de points */}
      <rect x="50" y="24" width="240" height="160" fill="none" className="stroke-neutral-500" strokeWidth="1.2" strokeDasharray="5 4" />
      <g className="fill-neutral-400">
        <circle cx="80" cy="50" r="2" /><circle cx="130" cy="50" r="2" /><circle cx="180" cy="50" r="2" /><circle cx="230" cy="50" r="2" /><circle cx="266" cy="50" r="2" />
        <circle cx="80" cy="104" r="2" /><circle cx="130" cy="104" r="2" /><circle cx="180" cy="104" r="2" /><circle cx="230" cy="104" r="2" /><circle cx="266" cy="104" r="2" />
        <circle cx="80" cy="158" r="2" /><circle cx="130" cy="158" r="2" /><circle cx="180" cy="158" r="2" /><circle cx="230" cy="158" r="2" /><circle cx="266" cy="158" r="2" />
      </g>
      <text x="292" y="36" className="fill-neutral-400" fontSize="9.5">B sortant</text>
      {/* trajectoire circulaire */}
      <circle cx="170" cy="104" r="62" fill="none" className={CURVE} strokeWidth="2.4" />
      <circle cx="170" cy="104" r="3" className="fill-neutral-400" />
      <line x1="170" y1="104" x2="232" y2="104" className={DASH} strokeWidth="1.2" strokeDasharray="4 3" />
      <text x="196" y="98" className="fill-neutral-400" fontSize="10.5">r</text>
      {/* particule */}
      <circle cx="170" cy="42" r="5" className="fill-[#0db8d3]" />
      {/* vitesse tangente */}
      <line x1="170" y1="42" x2="222" y2="42" className="stroke-[#10b981]" strokeWidth="2.4" />
      <path d="M228,42 l-9,-4.5 l0,9 z" className="fill-[#10b981]" />
      <text x="196" y="34" className="fill-[#10b981]" fontSize="11">v</text>
      {/* force centripète */}
      <line x1="170" y1="47" x2="170" y2="88" className="stroke-[#f59e0b]" strokeWidth="2.4" />
      <path d="M170,94 l-4.5,-9 l9,0 z" className="fill-[#f59e0b]" />
      <text x="140" y="74" className="fill-[#f59e0b]" fontSize="11">F</text>
      <text x="54" y="202" className="fill-neutral-400" fontSize="9.5">F ⟂ v à tout instant ⇒ v constante ⇒ cercle</text>
    </svg>
  ),

  // Satellite en orbite circulaire
  "satellite-orbite": (
    <svg viewBox="0 0 340 210" className="w-full max-w-[420px] mx-auto h-auto">
      {/* orbite */}
      <circle cx="170" cy="105" r="76" fill="none" className={DASH} strokeWidth="1.3" strokeDasharray="5 4" />
      {/* Terre */}
      <circle cx="170" cy="105" r="30" className="fill-[#0db8d3]/25 stroke-[#0db8d3]" strokeWidth="1.8" />
      <text x="170" y="109" className="fill-[#0db8d3]" fontSize="10" textAnchor="middle">Terre</text>
      {/* rayon r */}
      <line x1="170" y1="105" x2="170" y2="29" className={DASH} strokeWidth="1.2" strokeDasharray="3 3" />
      <text x="178" y="66" className="fill-neutral-400" fontSize="10.5">r</text>
      {/* satellite */}
      <circle cx="170" cy="29" r="6" className="fill-neutral-300 dark:fill-neutral-100" />
      <text x="146" y="20" className="fill-neutral-400" fontSize="9.5">satellite</text>
      {/* vitesse tangente */}
      <line x1="170" y1="29" x2="226" y2="29" className="stroke-[#10b981]" strokeWidth="2.4" />
      <path d="M232,29 l-9,-4.5 l0,9 z" className="fill-[#10b981]" />
      <text x="204" y="21" className="fill-[#10b981]" fontSize="11">v</text>
      {/* force gravitationnelle */}
      <line x1="170" y1="36" x2="170" y2="66" className="stroke-[#f59e0b]" strokeWidth="2.4" />
      <path d="M170,72 l-4.5,-9 l9,0 z" className="fill-[#f59e0b]" />
      <text x="128" y="54" className="fill-[#f59e0b]" fontSize="10.5">F = GMm/r²</text>
      <text x="56" y="196" className="fill-neutral-400" fontSize="9.5">F centripète ⇒ a_T = 0 ⇒ mouvement circulaire uniforme</text>
    </svg>
  ),

  // Ellipse de Kepler et loi des aires
  "kepler-ellipse": (
    <svg viewBox="0 0 360 200" className="w-full max-w-[460px] mx-auto h-auto">
      <ellipse cx="180" cy="100" rx="130" ry="80" fill="none" className={CURVE} strokeWidth="2.2" />
      {/* foyer : Soleil */}
      <circle cx="282" cy="100" r="11" className="fill-[#f59e0b]" />
      <text x="282" y="128" className="fill-[#f59e0b]" fontSize="9.5" textAnchor="middle">Soleil (foyer)</text>
      {/* demi-grand axe */}
      <line x1="180" y1="100" x2="310" y2="100" className={DASH} strokeWidth="1.2" strokeDasharray="4 3" />
      <text x="234" y="94" className="fill-neutral-400" fontSize="10.5">a</text>
      {/* aire près du périhélie (grande vitesse) */}
      <path d="M282,100 L306,72 A130,80 0 0,1 308,120 Z" className="fill-[#10b981]/35 stroke-[#10b981]" strokeWidth="1.2" />
      {/* aire près de l'aphélie (petite vitesse) */}
      <path d="M282,100 L54,84 A130,80 0 0,0 56,118 Z" className="fill-[#10b981]/35 stroke-[#10b981]" strokeWidth="1.2" />
      <text x="300" y="150" className="fill-[#10b981]" fontSize="9" textAnchor="middle">périhélie</text>
      <text x="52" y="150" className="fill-[#10b981]" fontSize="9" textAnchor="middle">aphélie</text>
      <text x="180" y="192" className="fill-neutral-400" fontSize="9.5" textAnchor="middle">aires égales en des temps égaux ⇒ plus rapide au périhélie</text>
    </svg>
  ),

  // Pendule de torsion
  "pendule-torsion": (
    <svg viewBox="0 0 320 210" className="w-full max-w-[360px] mx-auto h-auto">
      {/* support */}
      <line x1="90" y1="18" x2="230" y2="18" className="stroke-neutral-500" strokeWidth="3" />
      {/* fil */}
      <line x1="160" y1="18" x2="160" y2="110" className="stroke-neutral-400" strokeWidth="1.8" />
      <text x="168" y="66" className="fill-neutral-400" fontSize="10">fil (C)</text>
      {/* barre horizontale */}
      <line x1="84" y1="130" x2="236" y2="130" className="stroke-[#0db8d3]" strokeWidth="3" />
      <circle cx="160" cy="130" r="4" className="fill-[#0db8d3]" />
      <circle cx="84" cy="130" r="11" className="fill-[#0db8d3]/40 stroke-[#0db8d3]" strokeWidth="1.6" />
      <circle cx="236" cy="130" r="11" className="fill-[#0db8d3]/40 stroke-[#0db8d3]" strokeWidth="1.6" />
      <text x="248" y="120" className="fill-[#0db8d3]" fontSize="10">J_Δ</text>
      {/* position d'équilibre en pointillés */}
      <line x1="94" y1="158" x2="226" y2="158" className={DASH} strokeWidth="1.2" strokeDasharray="4 3" />
      {/* angle theta */}
      <path d="M204,130 A44,44 0 0,0 200,152" fill="none" className="stroke-[#f59e0b]" strokeWidth="1.4" />
      <text x="208" y="150" className="fill-[#f59e0b]" fontSize="11">θ</text>
      {/* sens de rotation */}
      <path d="M118,178 A46,46 0 0,1 202,178" fill="none" className="stroke-[#f59e0b]" strokeWidth="1.6" />
      <path d="M204,180 l-8.4,-2.6 l1.4,8.4 z" className="fill-[#f59e0b]" />
      <text x="160" y="202" className="fill-[#f59e0b]" fontSize="9.5" textAnchor="middle">ℳ = −C θ</text>
    </svg>
  ),

  // Pendule pesant
  "pendule-pesant": (
    <svg viewBox="0 0 300 210" className="w-full max-w-[340px] mx-auto h-auto">
      {/* support et axe */}
      <line x1="70" y1="20" x2="230" y2="20" className="stroke-neutral-500" strokeWidth="3" />
      <circle cx="150" cy="20" r="4.5" className="fill-neutral-400" />
      <text x="158" y="16" className="fill-neutral-400" fontSize="10">axe Δ</text>
      {/* verticale de référence */}
      <line x1="150" y1="20" x2="150" y2="185" className={DASH} strokeWidth="1.2" strokeDasharray="4 4" />
      {/* solide écarté */}
      <line x1="150" y1="20" x2="212" y2="146" className="stroke-[#0db8d3]" strokeWidth="2.4" />
      <circle cx="212" cy="146" r="14" className="fill-[#0db8d3]/35 stroke-[#0db8d3]" strokeWidth="1.8" />
      <text x="228" y="142" className="fill-[#0db8d3]" fontSize="10">G</text>
      {/* distance d */}
      <text x="168" y="92" className="fill-neutral-400" fontSize="10.5">d = OG</text>
      {/* angle theta */}
      <path d="M150,80 A60,60 0 0,0 178,75" fill="none" className="stroke-[#f59e0b]" strokeWidth="1.4" />
      <text x="156" y="72" className="fill-[#f59e0b]" fontSize="11">θ</text>
      {/* poids */}
      <line x1="212" y1="160" x2="212" y2="196" className="stroke-[#f59e0b]" strokeWidth="2.4" />
      <path d="M212,202 l-4.5,-9 l9,0 z" className="fill-[#f59e0b]" />
      <text x="220" y="186" className="fill-[#f59e0b]" fontSize="10.5">P = mg</text>
      <text x="16" y="200" className="fill-neutral-400" fontSize="9.5">ℳ = −mgd sin θ</text>
    </svg>
  ),

  // Les trois régimes d'un oscillateur mécanique amorti
  "oscillations-amorties": (
    <svg viewBox="0 0 360 200" className="w-full max-w-[470px] mx-auto h-auto">
      <line x1="30" y1="104" x2="345" y2="104" className={AX} strokeWidth="1.4" />
      <line x1="40" y1="22" x2="40" y2="182" className={AX} strokeWidth="1.4" />
      {/* pseudo-périodique */}
      <path
        d="M40,40 C62,40 66,140 88,140 C108,140 111,76 132,76 C152,76 154,124 174,124 C192,124 194,90 214,90 C232,90 234,114 254,114 C274,114 276,100 300,102 L340,104"
        fill="none" className={CURVE} strokeWidth="2.2"
      />
      {/* enveloppe exponentielle */}
      <path d="M40,40 C120,42 240,88 340,102" fill="none" className={DASH} strokeWidth="1" strokeDasharray="4 4" />
      <path d="M40,168 C120,166 240,120 340,106" fill="none" className={DASH} strokeWidth="1" strokeDasharray="4 4" />
      {/* critique */}
      <path d="M40,40 C74,40 98,98 142,102 C200,106 280,104 340,104" fill="none" className="stroke-[#10b981]" strokeWidth="2.2" />
      {/* apériodique */}
      <path d="M40,40 C112,48 172,80 232,96 C280,102 312,104 340,104" fill="none" className="stroke-[#f59e0b]" strokeWidth="2.2" strokeDasharray="6 4" />
      <text x="34" y="44" className="fill-neutral-400" fontSize="11" textAnchor="end">X₀</text>
      <text x="336" y="98" className="fill-neutral-400" fontSize="11">t</text>
      <text x="26" y="30" className="fill-neutral-400" fontSize="11">x</text>
      <line x1="200" y1="160" x2="222" y2="160" className={CURVE} strokeWidth="2.2" />
      <text x="228" y="164" className="fill-neutral-400" fontSize="9">pseudo-périodique</text>
      <line x1="200" y1="176" x2="222" y2="176" className="stroke-[#10b981]" strokeWidth="2.2" />
      <text x="228" y="180" className="fill-neutral-400" fontSize="9">critique</text>
      <line x1="200" y1="192" x2="222" y2="192" className="stroke-[#f59e0b]" strokeWidth="2.2" strokeDasharray="6 4" />
      <text x="228" y="196" className="fill-neutral-400" fontSize="9">apériodique</text>
    </svg>
  ),

  // Échanges Ec / Ep dans un oscillateur harmonique
  "energie-oscillateur": (
    <svg viewBox="0 0 360 200" className="w-full max-w-[470px] mx-auto h-auto">
      <line x1="40" y1="164" x2="345" y2="164" className={AX} strokeWidth="1.5" />
      <line x1="40" y1="24" x2="40" y2="174" className={AX} strokeWidth="1.5" />
      <line x1="40" y1="46" x2="340" y2="46" className="stroke-[#10b981]" strokeWidth="2.2" />
      <text x="240" y="40" className="fill-[#10b981]" fontSize="10">E_m = constante</text>
      {/* Ep : cos² */}
      <path
        d="M40,46 C52,46 58,164 70,164 C82,164 88,46 100,46 C112,46 118,164 130,164 C142,164 148,46 160,46 C172,46 178,164 190,164 C202,164 208,46 220,46 C232,46 238,164 250,164 C262,164 268,46 280,46 C292,46 298,164 310,164 C322,164 328,46 340,46"
        fill="none" className={CURVE} strokeWidth="2.2"
      />
      {/* Ec : sin² */}
      <path
        d="M40,164 C52,164 58,46 70,46 C82,46 88,164 100,164 C112,164 118,46 130,46 C142,46 148,164 160,164 C172,164 178,46 190,46 C202,46 208,164 220,164 C232,164 238,46 250,46 C262,46 268,164 280,164 C292,164 298,46 310,46 C322,46 328,164 340,164"
        fill="none" className="stroke-[#f59e0b]" strokeWidth="2.2" strokeDasharray="6 3"
      />
      <text x="30" y="50" className="fill-neutral-400" fontSize="10" textAnchor="end">E</text>
      <text x="336" y="180" className="fill-neutral-400" fontSize="11">t</text>
      <line x1="66" y1="188" x2="86" y2="188" className={CURVE} strokeWidth="2.2" />
      <text x="92" y="192" className="fill-neutral-400" fontSize="9.5">E_p = ½ K x²</text>
      <line x1="196" y1="188" x2="216" y2="188" className="stroke-[#f59e0b]" strokeWidth="2.2" strokeDasharray="6 3" />
      <text x="222" y="192" className="fill-neutral-400" fontSize="9.5">E_c = ½ m v²</text>
    </svg>
  ),

  // Diagramme des niveaux d'énergie de l'atome d'hydrogène
  "niveaux-energie": (
    <svg viewBox="0 0 360 220" className="w-full max-w-[460px] mx-auto h-auto">
      {/* axe des énergies */}
      <line x1="60" y1="204" x2="60" y2="24" className={AX} strokeWidth="1.5" />
      <path d="M60,20 l-4.5,9 l9,0 z" className="fill-neutral-400" />
      <text x="46" y="22" className="fill-neutral-400" fontSize="10" textAnchor="end">E (eV)</text>
      {/* niveaux : espacement en -13,6/n² (échelle comprimée) */}
      <line x1="70" y1="40" x2="290" y2="40" className="stroke-neutral-400" strokeWidth="2" />
      <text x="298" y="44" className="fill-neutral-400" fontSize="9.5">n = ∞   0</text>
      <line x1="70" y1="54" x2="290" y2="54" className="stroke-neutral-400" strokeWidth="1.6" />
      <text x="298" y="58" className="fill-neutral-400" fontSize="9.5">n = 4   −0,85</text>
      <line x1="70" y1="74" x2="290" y2="74" className="stroke-neutral-400" strokeWidth="1.6" />
      <text x="298" y="78" className="fill-neutral-400" fontSize="9.5">n = 3   −1,51</text>
      <line x1="70" y1="118" x2="290" y2="118" className="stroke-neutral-400" strokeWidth="1.6" />
      <text x="298" y="122" className="fill-neutral-400" fontSize="9.5">n = 2   −3,40</text>
      <line x1="70" y1="196" x2="290" y2="196" className="stroke-[#0db8d3]" strokeWidth="2.6" />
      <text x="298" y="200" className="fill-[#0db8d3]" fontSize="9.5">n = 1   −13,6</text>
      {/* transition 3 -> 2 : émission */}
      <line x1="120" y1="76" x2="120" y2="112" className="stroke-[#f59e0b]" strokeWidth="2" />
      <path d="M120,118 l-4.5,-9 l9,0 z" className="fill-[#f59e0b]" />
      <text x="126" y="100" className="fill-[#f59e0b]" fontSize="9">656 nm</text>
      {/* transition 4 -> 2 */}
      <line x1="184" y1="56" x2="184" y2="112" className="stroke-[#f59e0b]" strokeWidth="2" />
      <path d="M184,118 l-4.5,-9 l9,0 z" className="fill-[#f59e0b]" />
      <text x="190" y="88" className="fill-[#f59e0b]" fontSize="9">486 nm</text>
      {/* transition 1 -> 2 : absorption */}
      <line x1="90" y1="194" x2="90" y2="126" className="stroke-[#10b981]" strokeWidth="2" />
      <path d="M90,120 l-4.5,9 l9,0 z" className="fill-[#10b981]" />
      <text x="16" y="160" className="fill-[#10b981]" fontSize="9">absorption</text>
      <text x="236" y="176" className="fill-neutral-400" fontSize="9">|ΔE| = hc / λ</text>
      <text x="70" y="216" className="fill-neutral-400" fontSize="9">fondamental</text>
    </svg>
  ),

  // Montage : mesure de la célérité d'une onde le long d'une corde
  "montage-celerite": (
    <svg viewBox="0 0 360 180" className="w-full max-w-[470px] mx-auto h-auto">
      <rect x="20" y="72" width="34" height="38" rx="3" className="fill-[#0db8d3]/15 stroke-[#0db8d3]" strokeWidth="1.6" />
      <text x="37" y="126" className="fill-[#0db8d3]" fontSize="8.5" textAnchor="middle">vibreur</text>
      <polyline points="58.0,90.0 61.0,83.4 64.0,78.4 67.0,76.1 70.0,77.0 73.0,80.9 76.0,87.0 79.0,93.7 82.0,99.6 85.0,103.3 88.0,103.8 91.0,101.1 94.0,95.9 97.0,89.2 100.0,82.8 103.0,78.0 106.0,76.0 109.0,77.3 112.0,81.5 115.0,87.7 118.0,94.5 121.0,100.2 124.0,103.5 127.0,103.7 130.0,100.7 133.0,95.2 136.0,88.5 139.0,82.1 142.0,77.6 145.0,76.0 148.0,77.6 151.0,82.1 154.0,88.5 157.0,95.2 160.0,100.7 163.0,103.7 166.0,103.5 169.0,100.2 172.0,94.5 175.0,87.7 178.0,81.5 181.0,77.3 184.0,76.0 187.0,78.0 190.0,82.8 193.0,89.2 196.0,95.9 199.0,101.1 202.0,103.8 205.0,103.3 208.0,99.6 211.0,93.7 214.0,87.0 217.0,80.9 220.0,77.0 223.0,76.1 226.0,78.4 229.0,83.4 232.0,90.0 235.0,96.6 238.0,101.6 241.0,103.9 244.0,103.0 247.0,99.1 250.0,93.0 253.0,86.3 256.0,80.4 259.0,76.7 262.0,76.2 265.0,78.9 268.0,84.1 271.0,90.8 274.0,97.2 277.0,102.0 280.0,104.0 283.0,102.7 286.0,98.5 289.0,92.3" fill="none" className={CURVE} strokeWidth="2.2" />
      <circle cx="300" cy="90" r="8" fill="none" className="stroke-neutral-500" strokeWidth="1.6" />
      <line x1="300" y1="98" x2="300" y2="138" className="stroke-neutral-400" strokeWidth="1.4" />
      <rect x="292" y="138" width="16" height="16" className="fill-neutral-400/40 stroke-neutral-400" strokeWidth="1.4" />
      <line x1="70" y1="150" x2="268" y2="150" className="stroke-[#f59e0b]" strokeWidth="1.4" />
      <path d="M70,150 l9,-4 l0,8 z" className="fill-[#f59e0b]" />
      <path d="M268,150 l-9,-4 l0,8 z" className="fill-[#f59e0b]" />
      <text x="169" y="166" className="fill-[#f59e0b]" fontSize="9.5" textAnchor="middle">d (n longueurs d'onde)</text>
      <text x="150" y="34" className="fill-neutral-400" fontSize="9.5" textAnchor="middle">c = d / τ  (τ lu au stroboscope)</text>
    </svg>
  ),

  // Onde transversale vs onde longitudinale
  "onde-types": (
    <svg viewBox="0 0 360 190" className="w-full max-w-[470px] mx-auto h-auto">
      <text x="20" y="26" className="fill-neutral-400" fontSize="10">transversale</text>
      <polyline points="20.0,55.0 23.0,50.4 26.0,46.2 29.0,42.8 32.0,40.3 35.0,39.1 38.0,39.2 41.0,40.7 44.0,43.3 47.0,46.9 50.0,51.2 53.0,55.8 56.0,60.3 59.0,64.4 62.0,67.7 65.0,70.0 68.0,71.0 71.0,70.6 74.0,69.0 77.0,66.2 80.0,62.4 83.0,58.1 86.0,53.5 89.0,49.0 92.0,45.0 95.0,41.8 98.0,39.8 101.0,39.0 104.0,39.6 107.0,41.4 110.0,44.4 113.0,48.3 116.0,52.7 119.0,57.3 122.0,61.7 125.0,65.6 128.0,68.6 131.0,70.4 134.0,71.0 137.0,70.2 140.0,68.2 143.0,65.0 146.0,61.0 149.0,56.5 152.0,51.9 155.0,47.6 158.0,43.8 161.0,41.0 164.0,39.4 167.0,39.0 170.0,40.0 173.0,42.3 176.0,45.6 179.0,49.7 182.0,54.2 185.0,58.8 188.0,63.1 191.0,66.7 194.0,69.3 197.0,70.8 200.0,70.9 203.0,69.7 206.0,67.2 209.0,63.8 212.0,59.6 215.0,55.0 218.0,50.4 221.0,46.2 224.0,42.8 227.0,40.3 230.0,39.1 233.0,39.2 236.0,40.7 239.0,43.3 242.0,46.9 245.0,51.2 248.0,55.8 251.0,60.3 254.0,64.4 257.0,67.7 260.0,70.0 263.0,71.0 266.0,70.6 269.0,69.0 272.0,66.2 275.0,62.4 278.0,58.1" fill="none" className={CURVE} strokeWidth="2.2" />
      <line x1="150" y1="55" x2="150" y2="33" className="stroke-[#f59e0b]" strokeWidth="1.6" />
      <path d="M150,29 l-3.5,8 l7,0 z" className="fill-[#f59e0b]" />
      <text x="156" y="34" className="fill-[#f59e0b]" fontSize="8">déplacement ⟂</text>
      <line x1="300" y1="70" x2="336" y2="70" className="stroke-neutral-500" strokeWidth="1.4" />
      <path d="M340,70 l-8,-3.5 l0,7 z" className="fill-neutral-500" />
      <text x="296" y="64" className="fill-neutral-400" fontSize="8" textAnchor="end">sens de propagation</text>
      <text x="20" y="112" className="fill-neutral-400" fontSize="10">longitudinale</text>
      <g className="stroke-[#0db8d3]" strokeWidth="1.7"><line x1="24" y1="128" x2="24" y2="158" /><line x1="31" y1="128" x2="31" y2="158" /><line x1="38" y1="128" x2="38" y2="158" /><line x1="45" y1="128" x2="45" y2="158" /><line x1="59" y1="128" x2="59" y2="158" /><line x1="66" y1="128" x2="66" y2="158" /><line x1="73" y1="128" x2="73" y2="158" /><line x1="95" y1="128" x2="95" y2="158" /><line x1="102" y1="128" x2="102" y2="158" /><line x1="109" y1="128" x2="109" y2="158" /><line x1="116" y1="128" x2="116" y2="158" /><line x1="130" y1="128" x2="130" y2="158" /><line x1="137" y1="128" x2="137" y2="158" /><line x1="144" y1="128" x2="144" y2="158" /><line x1="166" y1="128" x2="166" y2="158" /><line x1="173" y1="128" x2="173" y2="158" /><line x1="180" y1="128" x2="180" y2="158" /><line x1="187" y1="128" x2="187" y2="158" /><line x1="201" y1="128" x2="201" y2="158" /><line x1="208" y1="128" x2="208" y2="158" /><line x1="215" y1="128" x2="215" y2="158" /><line x1="237" y1="128" x2="237" y2="158" /><line x1="244" y1="128" x2="244" y2="158" /><line x1="251" y1="128" x2="251" y2="158" /><line x1="258" y1="128" x2="258" y2="158" /></g>
      <text x="70" y="176" className="fill-neutral-400" fontSize="8" textAnchor="middle">compression</text>
      <text x="180" y="176" className="fill-neutral-400" fontSize="8" textAnchor="middle">dilatation</text>
      <text x="300" y="176" className="fill-neutral-400" fontSize="8" textAnchor="middle">compression</text>
    </svg>
  ),

  // Retard temporel : M reproduit le mouvement de S avec τ = d/c
  "retard-temporel": (
    <svg viewBox="0 0 360 200" className="w-full max-w-[470px] mx-auto h-auto">
      <line x1="60" y1="55" x2="345" y2="55" className={AX} strokeWidth="1.1" />
      <polyline points="60.0,55.0 63.0,51.6 66.0,48.4 69.0,45.3 72.0,42.5 75.0,40.1 78.0,38.1 81.0,36.5 84.0,35.5 87.0,35.0 90.0,35.1 93.0,35.8 96.0,37.0 99.0,38.7 102.0,40.9 105.0,43.4 108.0,46.3 111.0,49.5 114.0,52.8 117.0,56.1 120.0,59.5 123.0,62.7 126.0,65.6 129.0,68.3 132.0,70.6 135.0,72.5 138.0,73.9 141.0,74.7 144.0,75.0 147.0,74.7 150.0,73.9 153.0,72.5 156.0,70.6 159.0,68.3 162.0,65.6 165.0,62.7 168.0,59.5 171.0,56.1 174.0,52.8 177.0,49.5 180.0,46.3 183.0,43.4 186.0,40.9 189.0,38.7 192.0,37.0 195.0,35.8 198.0,35.1 201.0,35.0 204.0,35.5 207.0,36.5 210.0,38.1 213.0,40.1 216.0,42.5 219.0,45.3 222.0,48.4 225.0,51.6 228.0,55.0 231.0,58.4 234.0,61.6 237.0,64.7 240.0,67.5 243.0,69.9 246.0,71.9 249.0,73.5 252.0,74.5 255.0,75.0 258.0,74.9 261.0,74.2 264.0,73.0 267.0,71.3 270.0,69.1 273.0,66.6 276.0,63.7 279.0,60.5 282.0,57.2 285.0,53.9 288.0,50.5 291.0,47.3 294.0,44.4 297.0,41.7 300.0,39.4 303.0,37.5 306.0,36.1 309.0,35.3 312.0,35.0 315.0,35.3 318.0,36.1 321.0,37.5 324.0,39.4 327.0,41.7 330.0,44.4 333.0,47.3 336.0,50.5 339.0,53.9" fill="none" className={CURVE} strokeWidth="2" />
      <text x="26" y="59" className="fill-[#0db8d3]" fontSize="10">y_S</text>
      <line x1="60" y1="135" x2="345" y2="135" className={AX} strokeWidth="1.1" />
      <polyline points="106.0,135.0 109.0,131.6 112.0,128.4 115.0,125.3 118.0,122.5 121.0,120.1 124.0,118.1 127.0,116.5 130.0,115.5 133.0,115.0 136.0,115.1 139.0,115.8 142.0,117.0 145.0,118.7 148.0,120.9 151.0,123.4 154.0,126.3 157.0,129.5 160.0,132.8 163.0,136.1 166.0,139.5 169.0,142.7 172.0,145.6 175.0,148.3 178.0,150.6 181.0,152.5 184.0,153.9 187.0,154.7 190.0,155.0 193.0,154.7 196.0,153.9 199.0,152.5 202.0,150.6 205.0,148.3 208.0,145.6 211.0,142.7 214.0,139.5 217.0,136.1 220.0,132.8 223.0,129.5 226.0,126.3 229.0,123.4 232.0,120.9 235.0,118.7 238.0,117.0 241.0,115.8 244.0,115.1 247.0,115.0 250.0,115.5 253.0,116.5 256.0,118.1 259.0,120.1 262.0,122.5 265.0,125.3 268.0,128.4 271.0,131.6 274.0,135.0 277.0,138.4 280.0,141.6 283.0,144.7 286.0,147.5 289.0,149.9 292.0,151.9 295.0,153.5 298.0,154.5 301.0,155.0 304.0,154.9 307.0,154.2 310.0,153.0 313.0,151.3 316.0,149.1 319.0,146.6 322.0,143.7 325.0,140.5 328.0,137.2 331.0,133.9 334.0,130.5 337.0,127.3 340.0,124.4" fill="none" className="stroke-[#f59e0b]" strokeWidth="2" />
      <text x="26" y="139" className="fill-[#f59e0b]" fontSize="10">y_M</text>
      <line x1="60" y1="35" x2="60" y2="185" className={DASH} strokeWidth="1" strokeDasharray="4 4" />
      <line x1="106" y1="115" x2="106" y2="185" className={DASH} strokeWidth="1" strokeDasharray="4 4" />
      <line x1="60" y1="178" x2="106" y2="178" className="stroke-neutral-400" strokeWidth="1.2" />
      <path d="M60,178 l9,-4 l0,8 z" className="fill-neutral-400" />
      <path d="M106,178 l-9,-4 l0,8 z" className="fill-neutral-400" />
      <text x="83" y="196" className="fill-neutral-400" fontSize="10" textAnchor="middle">τ = d/c</text>
      <text x="333" y="48" className="fill-neutral-400" fontSize="10">t</text>
    </svg>
  ),

  // Points en phase (λ) et en opposition de phase (λ/2)
  "onde-phase": (
    <svg viewBox="0 0 360 190" className="w-full max-w-[470px] mx-auto h-auto">
      <line x1="30" y1="95" x2="345" y2="95" className={AX} strokeWidth="1.1" />
      <polyline points="40.0,95.0 43.0,88.4 46.0,82.0 49.0,75.9 52.0,70.3 55.0,65.3 58.0,61.0 61.0,57.6 64.0,55.1 67.0,53.5 70.0,53.0 73.0,53.5 76.0,55.1 79.0,57.6 82.0,61.0 85.0,65.3 88.0,70.3 91.0,75.9 94.0,82.0 97.0,88.4 100.0,95.0 103.0,101.6 106.0,108.0 109.0,114.1 112.0,119.7 115.0,124.7 118.0,129.0 121.0,132.4 124.0,134.9 127.0,136.5 130.0,137.0 133.0,136.5 136.0,134.9 139.0,132.4 142.0,129.0 145.0,124.7 148.0,119.7 151.0,114.1 154.0,108.0 157.0,101.6 160.0,95.0 163.0,88.4 166.0,82.0 169.0,75.9 172.0,70.3 175.0,65.3 178.0,61.0 181.0,57.6 184.0,55.1 187.0,53.5 190.0,53.0 193.0,53.5 196.0,55.1 199.0,57.6 202.0,61.0 205.0,65.3 208.0,70.3 211.0,75.9 214.0,82.0 217.0,88.4 220.0,95.0 223.0,101.6 226.0,108.0 229.0,114.1 232.0,119.7 235.0,124.7 238.0,129.0 241.0,132.4 244.0,134.9 247.0,136.5 250.0,137.0 253.0,136.5 256.0,134.9 259.0,132.4 262.0,129.0 265.0,124.7 268.0,119.7 271.0,114.1 274.0,108.0 277.0,101.6 280.0,95.0 283.0,88.4 286.0,82.0 289.0,75.9 292.0,70.3 295.0,65.3 298.0,61.0 301.0,57.6 304.0,55.1 307.0,53.5 310.0,53.0 313.0,53.5 316.0,55.1 319.0,57.6 322.0,61.0 325.0,65.3 328.0,70.3 331.0,75.9 334.0,82.0 337.0,88.4 340.0,95.0" fill="none" className={CURVE} strokeWidth="2.2" />
      <circle cx="70" cy="53" r="3.5" className="fill-[#10b981]" />
      <circle cx="190" cy="53" r="3.5" className="fill-[#10b981]" />
      <line x1="70" y1="40" x2="190" y2="40" className="stroke-[#10b981]" strokeWidth="1.2" />
      <path d="M70,40 l9,-4 l0,8 z" className="fill-[#10b981]" />
      <path d="M190,40 l-9,-4 l0,8 z" className="fill-[#10b981]" />
      <text x="130" y="32" className="fill-[#10b981]" fontSize="10" textAnchor="middle">λ · en phase</text>
      <circle cx="250" cy="53" r="3.5" className="fill-[#f59e0b]" />
      <circle cx="310" cy="137" r="3.5" className="fill-[#f59e0b]" />
      <line x1="250" y1="150" x2="310" y2="150" className="stroke-[#f59e0b]" strokeWidth="1.2" />
      <path d="M250,150 l9,-4 l0,8 z" className="fill-[#f59e0b]" />
      <path d="M310,150 l-9,-4 l0,8 z" className="fill-[#f59e0b]" />
      <text x="280" y="168" className="fill-[#f59e0b]" fontSize="10" textAnchor="middle">λ/2 · opposition</text>
      <text x="335" y="88" className="fill-neutral-400" fontSize="10">x</text>
    </svg>
  ),

  // Figure de diffraction par une fente de largeur a
  "diffraction-ecran": (
    <svg viewBox="0 0 380 200" className="w-full max-w-[490px] mx-auto h-auto">
      <rect x="14" y="90" width="30" height="20" rx="2" className="fill-[#f59e0b]/20 stroke-[#f59e0b]" strokeWidth="1.4" />
      <text x="29" y="126" className="fill-neutral-400" fontSize="8" textAnchor="middle">laser</text>
      <line x1="44" y1="100" x2="120" y2="100" className={CURVE} strokeWidth="1.8" />
      <line x1="120" y1="38" x2="120" y2="92" className="stroke-neutral-500" strokeWidth="2.4" />
      <line x1="120" y1="108" x2="120" y2="162" className="stroke-neutral-500" strokeWidth="2.4" />
      <text x="120" y="30" className="fill-neutral-400" fontSize="9" textAnchor="middle">fente a</text>
      <line x1="120" y1="100" x2="332" y2="46" className={DASH} strokeWidth="1" />
      <line x1="120" y1="100" x2="332" y2="154" className={DASH} strokeWidth="1" />
      <line x1="120" y1="100" x2="332" y2="100" className={CURVE} strokeWidth="1.3" strokeDasharray="4 3" />
      <line x1="332" y1="30" x2="332" y2="172" className="stroke-neutral-500" strokeWidth="2.4" />
      <rect x="336" y="93" width="28" height="14" className="fill-[#0db8d3]/70" />
      <rect x="340" y="72" width="18" height="7" className="fill-[#0db8d3]/35" />
      <rect x="340" y="121" width="18" height="7" className="fill-[#0db8d3]/35" />
      <rect x="342" y="58" width="14" height="5" className="fill-[#0db8d3]/20" />
      <rect x="342" y="137" width="14" height="5" className="fill-[#0db8d3]/20" />
      <text x="150" y="114" className="fill-neutral-400" fontSize="9">θ = λ/a</text>
      <text x="228" y="190" className="fill-neutral-400" fontSize="9" textAnchor="middle">D (fente → écran) · L = 2λD/a</text>
    </svg>
  ),

  // Dispersion de la lumière blanche par un prisme
  "dispersion-prisme": (
    <svg viewBox="0 0 360 200" className="w-full max-w-[460px] mx-auto h-auto">
      <path d="M150,38 L108,150 L212,150 Z" fill="none" className="stroke-neutral-400" strokeWidth="1.8" />
      <line x1="28" y1="94" x2="140" y2="94" className="stroke-neutral-300 dark:stroke-neutral-100" strokeWidth="2.2" />
      <text x="38" y="86" className="fill-neutral-400" fontSize="9">lumière blanche</text>
      <line x1="176" y1="118" x2="332" y2="92"  stroke="#ef4444" strokeWidth="2" />
      <line x1="176" y1="118" x2="332" y2="108" stroke="#f59e0b" strokeWidth="2" />
      <line x1="176" y1="118" x2="332" y2="124" stroke="#22c55e" strokeWidth="2" />
      <line x1="176" y1="118" x2="332" y2="142" stroke="#3b82f6" strokeWidth="2" />
      <line x1="176" y1="118" x2="332" y2="160" stroke="#8b5cf6" strokeWidth="2" />
      <text x="336" y="94" fontSize="8" fill="#ef4444">rouge</text>
      <text x="336" y="162" fontSize="8" fill="#8b5cf6">violet</text>
      <text x="150" y="186" className="fill-neutral-400" fontSize="9" textAnchor="middle">le violet est le plus dévié (n plus grand)</text>
    </svg>
  ),

  // Montage du dipôle RL
  "montage-rl": (
    <svg viewBox="0 0 300 200" className="w-full max-w-[360px] mx-auto h-auto">
      <path d="M55,60 L55,150 L250,150 L250,60" fill="none" className="stroke-neutral-400" strokeWidth="1.6" />
      <line x1="55" y1="60" x2="104" y2="60" className="stroke-neutral-400" strokeWidth="1.6" />
      <line x1="104" y1="47" x2="104" y2="73" className="stroke-neutral-400" strokeWidth="2.6" />
      <line x1="116" y1="53" x2="116" y2="67" className="stroke-neutral-400" strokeWidth="1.4" />
      <line x1="116" y1="60" x2="250" y2="60" className="stroke-neutral-400" strokeWidth="1.6" />
      <text x="98" y="40" className="fill-neutral-400" fontSize="10">E</text>
      <circle cx="55" cy="102" r="2.5" className="fill-neutral-400" />
      <line x1="55" y1="102" x2="68" y2="88" className="stroke-[#f59e0b]" strokeWidth="1.8" />
      <text x="34" y="106" className="fill-neutral-400" fontSize="9">K</text>
      <rect x="120" y="143" width="46" height="14" fill="none" className="stroke-[#0db8d3]" strokeWidth="1.6" />
      <text x="143" y="174" className="fill-[#0db8d3]" fontSize="10" textAnchor="middle">R</text>
      <path d="M250,84 a7,7 0 0,1 0,14 a7,7 0 0,1 0,14 a7,7 0 0,1 0,14" fill="none" className="stroke-[#f59e0b]" strokeWidth="1.9" />
      <text x="262" y="108" className="fill-[#f59e0b]" fontSize="10">(L, r)</text>
    </svg>
  ),

  // Rupture du courant dans un dipôle RL : i décroît, τ = L/R
  "rl-rupture": (
    <svg viewBox="0 0 340 200" className="w-full max-w-[440px] mx-auto h-auto">
      <line x1="40" y1="170" x2="320" y2="170" className={AX} strokeWidth="1.5" />
      <line x1="40" y1="20" x2="40" y2="180" className={AX} strokeWidth="1.5" />
      <polyline points="40.0,44.0 43.1,48.3 46.1,52.5 49.2,56.5 52.2,60.4 55.3,64.2 58.3,67.8 61.4,71.3 64.4,74.7 67.5,78.0 70.6,81.1 73.6,84.1 76.7,87.1 79.7,89.9 82.8,92.6 85.8,95.3 88.9,97.8 91.9,100.2 95.0,102.6 98.1,104.9 101.1,107.1 104.2,109.2 107.2,111.3 110.3,113.3 113.3,115.2 116.4,117.0 119.4,118.8 122.5,120.5 125.6,122.2 128.6,123.8 131.7,125.3 134.7,126.8 137.8,128.3 140.8,129.6 143.9,131.0 146.9,132.3 150.0,133.5 153.1,134.7 156.1,135.9 159.2,137.0 162.2,138.1 165.3,139.1 168.3,140.1 171.4,141.1 174.4,142.1 177.5,143.0 180.6,143.8 183.6,144.7 186.7,145.5 189.7,146.3 192.8,147.0 195.8,147.8 198.9,148.5 201.9,149.2 205.0,149.8 208.1,150.5 211.1,151.1 214.2,151.7 217.2,152.2 220.3,152.8 223.3,153.3 226.4,153.8 229.4,154.3 232.5,154.8 235.6,155.3 238.6,155.7 241.7,156.1 244.7,156.5 247.8,156.9 250.8,157.3 253.9,157.7 256.9,158.1 260.0,158.4 263.1,158.7 266.1,159.1 269.2,159.4 272.2,159.7 275.3,160.0 278.3,160.3 281.4,160.5 284.4,160.8 287.5,161.0 290.6,161.3 293.6,161.5 296.7,161.7 299.7,162.0 302.8,162.2 305.8,162.4 308.9,162.6 311.9,162.8 315.0,162.9" fill="none" className={CURVE} strokeWidth="2.5" />
      <line x1="40" y1="44" x2="132" y2="170" className="stroke-[#f59e0b]" strokeWidth="1.4" strokeDasharray="4 3" />
      <line x1="132" y1="44" x2="132" y2="170" className={DASH} strokeWidth="1" strokeDasharray="3 3" />
      <text x="132" y="185" className="fill-[#f59e0b]" fontSize="11" textAnchor="middle">τ = L/R</text>
      <line x1="40" y1="90" x2="132" y2="90" className={DASH} strokeWidth="1" strokeDasharray="4 4" />
      <text x="34" y="48" className="fill-neutral-400" fontSize="10" textAnchor="end">I₀</text>
      <text x="34" y="94" className="fill-neutral-400" fontSize="8.5" textAnchor="end">0,37 I₀</text>
      <text x="312" y="185" className="fill-neutral-400" fontSize="11">t</text>
      <text x="26" y="28" className="fill-neutral-400" fontSize="11">i</text>
    </svg>
  ),

  // Montage RLC — oscillations libres (C chargé puis basculé sur L)
  "montage-rlc-libre": (
    <svg viewBox="0 0 320 200" className="w-full max-w-[380px] mx-auto h-auto">
      <path d="M60,55 L60,150 L260,150 L260,55" fill="none" className="stroke-neutral-400" strokeWidth="1.6" />
      <line x1="60" y1="55" x2="144" y2="55" className="stroke-neutral-400" strokeWidth="1.6" />
      <line x1="156" y1="55" x2="260" y2="55" className="stroke-neutral-400" strokeWidth="1.6" />
      <line x1="60" y1="93" x2="60" y2="103" className="stroke-neutral-400" strokeWidth="1.6" />
      <line x1="48" y1="93" x2="72" y2="93" className="stroke-[#0db8d3]" strokeWidth="2.6" />
      <line x1="48" y1="107" x2="72" y2="107" className="stroke-[#0db8d3]" strokeWidth="2.6" />
      <line x1="60" y1="107" x2="60" y2="150" className="stroke-neutral-400" strokeWidth="1.6" />
      <text x="42" y="104" className="fill-[#0db8d3]" fontSize="10" textAnchor="end">C</text>
      <circle cx="144" cy="55" r="2.5" className="fill-neutral-400" />
      <line x1="144" y1="55" x2="158" y2="45" className="stroke-[#f59e0b]" strokeWidth="1.8" />
      <text x="150" y="40" className="fill-neutral-400" fontSize="9">K</text>
      <path d="M260,84 a7,7 0 0,1 0,14 a7,7 0 0,1 0,14 a7,7 0 0,1 0,14" fill="none" className="stroke-[#f59e0b]" strokeWidth="1.9" />
      <text x="272" y="108" className="fill-[#f59e0b]" fontSize="10">L</text>
      <rect x="135" y="143" width="46" height="14" fill="none" className="stroke-neutral-400" strokeWidth="1.6" />
      <text x="158" y="174" className="fill-neutral-400" fontSize="10" textAnchor="middle">R</text>
    </svg>
  ),

  // Échanges d'énergie E_C ⇄ E_L dans un RLC (total ↓ par effet Joule)
  "rlc-energie": (
    <svg viewBox="0 0 360 200" className="w-full max-w-[470px] mx-auto h-auto">
      <line x1="40" y1="168" x2="350" y2="168" className={AX} strokeWidth="1.4" />
      <line x1="40" y1="24" x2="40" y2="178" className={AX} strokeWidth="1.4" />
      <polyline points="40.0,44.0 41.9,45.2 43.8,46.5 45.7,47.7 47.6,48.9 49.5,50.0 51.4,51.2 53.3,52.4 55.2,53.5 57.2,54.7 59.1,55.8 61.0,56.9 62.9,58.0 64.8,59.1 66.7,60.2 68.6,61.3 70.5,62.3 72.4,63.4 74.3,64.4 76.2,65.5 78.1,66.5 80.0,67.5 81.9,68.5 83.8,69.5 85.8,70.5 87.7,71.4 89.6,72.4 91.5,73.3 93.4,74.3 95.3,75.2 97.2,76.1 99.1,77.1 101.0,78.0 102.9,78.9 104.8,79.7 106.7,80.6 108.6,81.5 110.5,82.3 112.4,83.2 114.3,84.0 116.2,84.9 118.2,85.7 120.1,86.5 122.0,87.3 123.9,88.1 125.8,88.9 127.7,89.7 129.6,90.5 131.5,91.3 133.4,92.0 135.3,92.8 137.2,93.5 139.1,94.3 141.0,95.0 142.9,95.7 144.8,96.5 146.8,97.2 148.7,97.9 150.6,98.6 152.5,99.3 154.4,99.9 156.3,100.6 158.2,101.3 160.1,102.0 162.0,102.6 163.9,103.3 165.8,103.9 167.7,104.5 169.6,105.2 171.5,105.8 173.4,106.4 175.3,107.0 177.2,107.6 179.2,108.2 181.1,108.8 183.0,109.4 184.9,110.0 186.8,110.6 188.7,111.2 190.6,111.7 192.5,112.3 194.4,112.8 196.3,113.4 198.2,113.9 200.1,114.5 202.0,115.0 203.9,115.5 205.8,116.1 207.8,116.6 209.7,117.1 211.6,117.6 213.5,118.1 215.4,118.6 217.3,119.1 219.2,119.6 221.1,120.0 223.0,120.5 224.9,121.0 226.8,121.5 228.7,121.9 230.6,122.4 232.5,122.8 234.4,123.3 236.3,123.7 238.2,124.2 240.2,124.6 242.1,125.0 244.0,125.5 245.9,125.9 247.8,126.3 249.7,126.7 251.6,127.1 253.5,127.5 255.4,127.9 257.3,128.3 259.2,128.7 261.1,129.1 263.0,129.5 264.9,129.9 266.8,130.3 268.8,130.7 270.7,131.0 272.6,131.4 274.5,131.8 276.4,132.1 278.3,132.5 280.2,132.8 282.1,133.2 284.0,133.5 285.9,133.9 287.8,134.2 289.7,134.5 291.6,134.9 293.5,135.2 295.4,135.5 297.3,135.9 299.2,136.2 301.2,136.5 303.1,136.8 305.0,137.1 306.9,137.4 308.8,137.7 310.7,138.0 312.6,138.3 314.5,138.6 316.4,138.9 318.3,139.2 320.2,139.5 322.1,139.8 324.0,140.1 325.9,140.3 327.8,140.6 329.8,140.9 331.7,141.1 333.6,141.4 335.5,141.7 337.4,141.9 339.3,142.2 341.2,142.5 343.1,142.7 345.0,143.0" fill="none" className="stroke-[#10b981]" strokeWidth="1.8" strokeDasharray="6 3" />
      <polyline points="40.0,44.0 41.9,45.7 43.8,48.4 45.7,51.9 47.6,56.2 49.5,61.3 51.4,67.0 53.3,73.3 55.2,80.1 57.2,87.2 59.1,94.6 61.0,102.1 62.9,109.6 64.8,117.0 66.7,124.2 68.6,131.1 70.5,137.7 72.4,143.7 74.3,149.2 76.2,154.1 78.1,158.3 80.0,161.8 81.9,164.5 83.8,166.5 85.8,167.6 87.7,168.0 89.6,167.6 91.5,166.5 93.4,164.7 95.3,162.3 97.2,159.2 99.1,155.7 101.0,151.7 102.9,147.3 104.8,142.7 106.7,137.8 108.6,132.8 110.5,127.9 112.4,122.9 114.3,118.2 116.2,113.6 118.2,109.3 120.1,105.4 122.0,102.0 123.9,99.0 125.8,96.5 127.7,94.6 129.6,93.2 131.5,92.5 133.4,92.3 135.3,92.8 137.2,93.8 139.1,95.4 141.0,97.6 142.9,100.2 144.8,103.3 146.8,106.8 148.7,110.6 150.6,114.7 152.5,119.0 154.4,123.5 156.3,128.0 158.2,132.6 160.1,137.1 162.0,141.4 163.9,145.6 165.8,149.6 167.7,153.3 169.6,156.6 171.5,159.6 173.4,162.1 175.3,164.2 177.2,165.9 179.2,167.1 181.1,167.8 183.0,168.0 184.9,167.8 186.8,167.1 188.7,166.0 190.6,164.5 192.5,162.7 194.4,160.5 196.3,158.1 198.2,155.5 200.1,152.6 202.0,149.7 203.9,146.7 205.8,143.7 207.8,140.7 209.7,137.8 211.6,135.0 213.5,132.4 215.4,130.1 217.3,127.9 219.2,126.1 221.1,124.6 223.0,123.5 224.9,122.6 226.8,122.2 228.7,122.1 230.6,122.4 232.5,123.0 234.4,124.0 236.3,125.3 238.2,126.9 240.2,128.8 242.1,130.9 244.0,133.2 245.9,135.7 247.8,138.3 249.7,141.0 251.6,143.7 253.5,146.5 255.4,149.2 257.3,151.9 259.2,154.4 261.1,156.8 263.0,159.1 264.9,161.1 266.8,162.9 268.8,164.4 270.7,165.7 272.6,166.7 274.5,167.4 276.4,167.9 278.3,168.0 280.2,167.9 282.1,167.5 284.0,166.8 285.9,165.9 287.8,164.8 289.7,163.5 291.6,162.0 293.5,160.4 295.4,158.7 297.3,156.9 299.2,155.1 301.2,153.2 303.1,151.4 305.0,149.7 306.9,148.0 308.8,146.4 310.7,145.0 312.6,143.7 314.5,142.6 316.4,141.7 318.3,141.0 320.2,140.5 322.1,140.2 324.0,140.2 325.9,140.3 327.8,140.7 329.8,141.3 331.7,142.1 333.6,143.1 335.5,144.2 337.4,145.5 339.3,146.9 341.2,148.4 343.1,150.0 345.0,151.6" fill="none" className={CURVE} strokeWidth="1.9" />
      <polyline points="40.0,168.0 41.9,167.5 43.8,166.1 45.7,163.8 47.6,160.6 49.5,156.7 51.4,152.2 53.3,147.0 55.2,141.4 57.2,135.5 59.1,129.2 61.0,122.9 62.9,116.5 64.8,110.1 66.7,104.0 68.6,98.1 70.5,92.7 72.4,87.7 74.3,83.2 76.2,79.4 78.1,76.2 80.0,73.7 81.9,72.0 83.8,71.0 85.8,70.8 87.7,71.4 89.6,72.8 91.5,74.8 93.4,77.6 95.3,81.0 97.2,84.9 99.1,89.4 101.0,94.3 102.9,99.5 104.8,105.1 106.7,110.8 108.6,116.6 110.5,122.5 112.4,128.3 114.3,133.9 116.2,139.3 118.2,144.4 120.1,149.1 122.0,153.4 123.9,157.2 125.8,160.4 127.7,163.2 129.6,165.3 131.5,166.8 133.4,167.7 135.3,168.0 137.2,167.7 139.1,166.8 141.0,165.4 142.9,163.5 144.8,161.2 146.8,158.4 148.7,155.3 150.6,151.9 152.5,148.3 154.4,144.5 156.3,140.6 158.2,136.7 160.1,132.9 162.0,129.2 163.9,125.6 165.8,122.3 167.7,119.3 169.6,116.6 171.5,114.2 173.4,112.3 175.3,110.8 177.2,109.8 179.2,109.2 181.1,109.1 183.0,109.4 184.9,110.2 186.8,111.5 188.7,113.2 190.6,115.2 192.5,117.6 194.4,120.3 196.3,123.3 198.2,126.5 200.1,129.8 202.0,133.3 203.9,136.8 205.8,140.4 207.8,143.9 209.7,147.3 211.6,150.6 213.5,153.7 215.4,156.5 217.3,159.1 219.2,161.4 221.1,163.4 223.0,165.1 224.9,166.3 226.8,167.3 228.7,167.8 230.6,168.0 232.5,167.8 234.4,167.3 236.3,166.4 238.2,165.3 240.2,163.9 242.1,162.2 244.0,160.3 245.9,158.2 247.8,156.0 249.7,153.7 251.6,151.4 253.5,149.0 255.4,146.7 257.3,144.5 259.2,142.3 261.1,140.3 263.0,138.4 264.9,136.8 266.8,135.4 268.8,134.2 270.7,133.3 272.6,132.7 274.5,132.3 276.4,132.3 278.3,132.5 280.2,133.0 282.1,133.7 284.0,134.7 285.9,136.0 287.8,137.4 289.7,139.1 291.6,140.9 293.5,142.8 295.4,144.9 297.3,147.0 299.2,149.1 301.2,151.3 303.1,153.4 305.0,155.5 306.9,157.4 308.8,159.3 310.7,161.0 312.6,162.6 314.5,164.0 316.4,165.2 318.3,166.2 320.2,167.0 322.1,167.6 324.0,167.9 325.9,168.0 327.8,167.9 329.8,167.6 331.7,167.1 333.6,166.4 335.5,165.5 337.4,164.5 339.3,163.3 341.2,162.1 343.1,160.7 345.0,159.4" fill="none" className="stroke-[#f59e0b]" strokeWidth="1.9" />
      <text x="26" y="48" className="fill-neutral-400" fontSize="10">E</text>
      <text x="336" y="182" className="fill-neutral-400" fontSize="11">t</text>
      <line x1="150" y1="190" x2="168" y2="190" className={CURVE} strokeWidth="1.9" />
      <text x="172" y="194" className="fill-neutral-400" fontSize="8.5">E_C</text>
      <line x1="208" y1="190" x2="226" y2="190" className="stroke-[#f59e0b]" strokeWidth="1.9" />
      <text x="230" y="194" className="fill-neutral-400" fontSize="8.5">E_L</text>
      <line x1="262" y1="190" x2="280" y2="190" className="stroke-[#10b981]" strokeWidth="1.8" strokeDasharray="6 3" />
      <text x="284" y="194" className="fill-neutral-400" fontSize="8.5">E totale</text>
    </svg>
  ),

  // Les trois régimes d'un circuit RLC (u_C au cours du temps)
  "rlc-regimes": (
    <svg viewBox="0 0 360 200" className="w-full max-w-[470px] mx-auto h-auto">
      <line x1="40" y1="92" x2="348" y2="92" className={AX} strokeWidth="1.3" />
      <line x1="40" y1="24" x2="40" y2="180" className={AX} strokeWidth="1.3" />
      <polyline points="40.0,40.0 41.9,40.6 43.8,41.6 45.6,43.0 47.5,44.7 49.4,46.9 51.2,49.3 53.1,52.1 55.0,55.2 56.9,58.5 58.8,62.0 60.6,65.8 62.5,69.7 64.4,73.7 66.2,77.8 68.1,82.0 70.0,86.2 71.9,90.4 73.8,94.5 75.6,98.6 77.5,102.5 79.4,106.3 81.2,110.0 83.1,113.4 85.0,116.6 86.9,119.6 88.8,122.3 90.6,124.7 92.5,126.8 94.4,128.6 96.2,130.1 98.1,131.2 100.0,132.0 101.9,132.5 103.8,132.6 105.6,132.4 107.5,131.9 109.4,131.1 111.2,129.9 113.1,128.5 115.0,126.8 116.9,124.8 118.8,122.6 120.6,120.1 122.5,117.5 124.4,114.7 126.2,111.8 128.1,108.7 130.0,105.6 131.9,102.3 133.8,99.1 135.6,95.8 137.5,92.6 139.4,89.4 141.2,86.2 143.1,83.2 145.0,80.2 146.9,77.4 148.8,74.8 150.6,72.3 152.5,70.1 154.4,68.0 156.2,66.2 158.1,64.6 160.0,63.2 161.9,62.1 163.8,61.3 165.6,60.7 167.5,60.4 169.4,60.4 171.2,60.6 173.1,61.0 175.0,61.8 176.9,62.7 178.8,63.9 180.6,65.3 182.5,66.8 184.4,68.6 186.2,70.5 188.1,72.6 190.0,74.8 191.9,77.1 193.8,79.5 195.6,82.0 197.5,84.5 199.4,87.0 201.2,89.6 203.1,92.1 205.0,94.6 206.9,97.0 208.8,99.4 210.6,101.7 212.5,103.8 214.4,105.8 216.2,107.7 218.1,109.4 220.0,111.0 221.9,112.4 223.8,113.6 225.6,114.6 227.5,115.4 229.4,116.0 231.2,116.4 233.1,116.6 235.0,116.6 236.9,116.4 238.8,116.0 240.6,115.4 242.5,114.6 244.4,113.7 246.2,112.6 248.1,111.3 250.0,109.9 251.9,108.4 253.8,106.7 255.6,105.0 257.5,103.2 259.4,101.3 261.2,99.4 263.1,97.4 265.0,95.4 266.9,93.5 268.8,91.5 270.6,89.6 272.5,87.7 274.4,85.9 276.2,84.1 278.1,82.5 280.0,80.9 281.9,79.5 283.8,78.1 285.6,76.9 287.5,75.9 289.4,75.0 291.2,74.2 293.1,73.6 295.0,73.2 296.9,72.9 298.8,72.8 300.6,72.9 302.5,73.0 304.4,73.4 306.2,73.9 308.1,74.5 310.0,75.3 311.9,76.2 313.8,77.2 315.6,78.3 317.5,79.5 319.4,80.8 321.2,82.2 323.1,83.6 325.0,85.1 326.9,86.6 328.8,88.1 330.6,89.7 332.5,91.2 334.4,92.7 336.2,94.2 338.1,95.7 340.0,97.1" fill="none" className={CURVE} strokeWidth="2.1" />
      <polyline points="40.0,40.0 41.9,40.0 43.8,40.0 45.6,40.1 47.5,40.2 49.4,40.3 51.2,40.4 53.1,40.5 55.0,40.7 56.9,40.8 58.8,41.0 60.6,41.2 62.5,41.4 64.4,41.7 66.2,41.9 68.1,42.1 70.0,42.4 71.9,42.7 73.8,43.0 75.6,43.3 77.5,43.6 79.4,43.9 81.2,44.2 83.1,44.5 85.0,44.8 86.9,45.2 88.8,45.5 90.6,45.9 92.5,46.3 94.4,46.6 96.2,47.0 98.1,47.4 100.0,47.7 101.9,48.1 103.8,48.5 105.6,48.9 107.5,49.3 109.4,49.7 111.2,50.1 113.1,50.5 115.0,50.9 116.9,51.3 118.8,51.7 120.6,52.1 122.5,52.5 124.4,52.9 126.2,53.3 128.1,53.7 130.0,54.1 131.9,54.5 133.8,54.9 135.6,55.3 137.5,55.7 139.4,56.1 141.2,56.6 143.1,57.0 145.0,57.4 146.9,57.8 148.8,58.2 150.6,58.5 152.5,58.9 154.4,59.3 156.2,59.7 158.1,60.1 160.0,60.5 161.9,60.9 163.8,61.3 165.6,61.6 167.5,62.0 169.4,62.4 171.2,62.8 173.1,63.1 175.0,63.5 176.9,63.9 178.8,64.2 180.6,64.6 182.5,65.0 184.4,65.3 186.2,65.7 188.1,66.0 190.0,66.4 191.9,66.7 193.8,67.0 195.6,67.4 197.5,67.7 199.4,68.0 201.2,68.4 203.1,68.7 205.0,69.0 206.9,69.3 208.8,69.6 210.6,69.9 212.5,70.2 214.4,70.6 216.2,70.9 218.1,71.2 220.0,71.4 221.9,71.7 223.8,72.0 225.6,72.3 227.5,72.6 229.4,72.9 231.2,73.1 233.1,73.4 235.0,73.7 236.9,74.0 238.8,74.2 240.6,74.5 242.5,74.7 244.4,75.0 246.2,75.2 248.1,75.5 250.0,75.7 251.9,76.0 253.8,76.2 255.6,76.5 257.5,76.7 259.4,76.9 261.2,77.1 263.1,77.4 265.0,77.6 266.9,77.8 268.8,78.0 270.6,78.2 272.5,78.4 274.4,78.7 276.2,78.9 278.1,79.1 280.0,79.3 281.9,79.5 283.8,79.6 285.6,79.8 287.5,80.0 289.4,80.2 291.2,80.4 293.1,80.6 295.0,80.8 296.9,80.9 298.8,81.1 300.6,81.3 302.5,81.4 304.4,81.6 306.2,81.8 308.1,81.9 310.0,82.1 311.9,82.3 313.8,82.4 315.6,82.6 317.5,82.7 319.4,82.9 321.2,83.0 323.1,83.2 325.0,83.3 326.9,83.4 328.8,83.6 330.6,83.7 332.5,83.8 334.4,84.0 336.2,84.1 338.1,84.2 340.0,84.4" fill="none" className="stroke-[#10b981]" strokeWidth="2.1" />
      <polyline points="40.0,40.0 41.9,40.5 43.8,41.1 45.6,41.6 47.5,42.2 49.4,42.7 51.2,43.2 53.1,43.7 55.0,44.2 56.9,44.7 58.8,45.2 60.6,45.7 62.5,46.2 64.4,46.7 66.2,47.2 68.1,47.7 70.0,48.1 71.9,48.6 73.8,49.1 75.6,49.5 77.5,50.0 79.4,50.4 81.2,50.8 83.1,51.3 85.0,51.7 86.9,52.1 88.8,52.6 90.6,53.0 92.5,53.4 94.4,53.8 96.2,54.2 98.1,54.6 100.0,55.0 101.9,55.4 103.8,55.8 105.6,56.1 107.5,56.5 109.4,56.9 111.2,57.3 113.1,57.6 115.0,58.0 116.9,58.4 118.8,58.7 120.6,59.1 122.5,59.4 124.4,59.8 126.2,60.1 128.1,60.4 130.0,60.8 131.9,61.1 133.8,61.4 135.6,61.8 137.5,62.1 139.4,62.4 141.2,62.7 143.1,63.0 145.0,63.3 146.9,63.6 148.8,63.9 150.6,64.2 152.5,64.5 154.4,64.8 156.2,65.1 158.1,65.4 160.0,65.7 161.9,65.9 163.8,66.2 165.6,66.5 167.5,66.8 169.4,67.0 171.2,67.3 173.1,67.5 175.0,67.8 176.9,68.1 178.8,68.3 180.6,68.6 182.5,68.8 184.4,69.1 186.2,69.3 188.1,69.5 190.0,69.8 191.9,70.0 193.8,70.2 195.6,70.5 197.5,70.7 199.4,70.9 201.2,71.1 203.1,71.4 205.0,71.6 206.9,71.8 208.8,72.0 210.6,72.2 212.5,72.4 214.4,72.6 216.2,72.8 218.1,73.0 220.0,73.2 221.9,73.4 223.8,73.6 225.6,73.8 227.5,74.0 229.4,74.2 231.2,74.4 233.1,74.6 235.0,74.8 236.9,75.0 238.8,75.1 240.6,75.3 242.5,75.5 244.4,75.7 246.2,75.8 248.1,76.0 250.0,76.2 251.9,76.3 253.8,76.5 255.6,76.7 257.5,76.8 259.4,77.0 261.2,77.2 263.1,77.3 265.0,77.5 266.9,77.6 268.8,77.8 270.6,77.9 272.5,78.1 274.4,78.2 276.2,78.4 278.1,78.5 280.0,78.7 281.9,78.8 283.8,78.9 285.6,79.1 287.5,79.2 289.4,79.3 291.2,79.5 293.1,79.6 295.0,79.7 296.9,79.9 298.8,80.0 300.6,80.1 302.5,80.3 304.4,80.4 306.2,80.5 308.1,80.6 310.0,80.7 311.9,80.9 313.8,81.0 315.6,81.1 317.5,81.2 319.4,81.3 321.2,81.4 323.1,81.5 325.0,81.7 326.9,81.8 328.8,81.9 330.6,82.0 332.5,82.1 334.4,82.2 336.2,82.3 338.1,82.4 340.0,82.5" fill="none" className="stroke-[#f59e0b]" strokeWidth="2.1" strokeDasharray="6 4" />
      <text x="30" y="44" className="fill-neutral-400" fontSize="10" textAnchor="end">u_C</text>
      <text x="336" y="86" className="fill-neutral-400" fontSize="11">t</text>
      <line x1="120" y1="188" x2="138" y2="188" className={CURVE} strokeWidth="2.1" />
      <text x="142" y="192" className="fill-neutral-400" fontSize="8.5">pseudo-périodique</text>
      <line x1="230" y1="188" x2="248" y2="188" className="stroke-[#10b981]" strokeWidth="2.1" />
      <text x="252" y="192" className="fill-neutral-400" fontSize="8.5">critique</text>
      <line x1="292" y1="188" x2="310" y2="188" className="stroke-[#f59e0b]" strokeWidth="2.1" strokeDasharray="6 4" />
      <text x="314" y="192" className="fill-neutral-400" fontSize="8.5">apériodique</text>
    </svg>
  ),

  // Construction de Fresnel — RLC série
  "fresnel-rlc": (
    <svg viewBox="0 0 340 210" className="w-full max-w-[420px] mx-auto h-auto">
      <line x1="40" y1="150" x2="320" y2="150" className={AX} strokeWidth="1.2" />
      <line x1="60" y1="200" x2="60" y2="20" className={AX} strokeWidth="1.2" />
      <text x="312" y="166" className="fill-neutral-400" fontSize="9">axe du courant i</text>
      {/* U_R along current axis */}
      <line x1="60" y1="150" x2="210" y2="150" className={CURVE} strokeWidth="2.4" />
      <path d="M216,150 l-9,-4.5 l0,9 z" className="fill-[#0db8d3]" />
      <text x="135" y="164" className="fill-[#0db8d3]" fontSize="10">U_R = R·I</text>
      {/* U_L up */}
      <line x1="210" y1="150" x2="210" y2="70" className="stroke-[#f59e0b]" strokeWidth="2.4" />
      <path d="M210,64 l-4.5,9 l9,0 z" className="fill-[#f59e0b]" />
      <text x="216" y="96" className="fill-[#f59e0b]" fontSize="9.5">U_L = Lω·I</text>
      {/* U_C down (shorter) */}
      <line x1="210" y1="150" x2="210" y2="188" className="stroke-[#10b981]" strokeWidth="2.4" />
      <path d="M210,193 l-4.5,-9 l9,0 z" className="fill-[#10b981]" />
      <text x="216" y="182" className="fill-[#10b981]" fontSize="9.5">U_C = I/(Cω)</text>
      {/* resultant U from origin to tip of (U_R, U_L+U_C) */}
      <line x1="60" y1="150" x2="210" y2="108" className="stroke-neutral-300 dark:stroke-neutral-100" strokeWidth="2.4" />
      <path d="M216,106 l-9,-1 l3,-8 z" className="fill-neutral-300 dark:fill-neutral-100" />
      <text x="150" y="104" className="fill-neutral-400" fontSize="10">U (aux bornes)</text>
      {/* phase angle */}
      <path d="M96,150 A36,36 0 0,0 92,138" fill="none" className="stroke-neutral-400" strokeWidth="1.2" />
      <text x="100" y="140" className="fill-neutral-400" fontSize="10">φ</text>
    </svg>
  ),

  // Montage RLC en régime sinusoïdal forcé (GBF)
  "montage-rsf": (
    <svg viewBox="0 0 320 200" className="w-full max-w-[380px] mx-auto h-auto">
      <path d="M55,55 L55,150 L265,150 L265,55 Z" fill="none" className="stroke-neutral-400" strokeWidth="1.6" />
      {/* GBF left */}
      <circle cx="55" cy="102" r="15" fill="none" className="stroke-[#f59e0b]" strokeWidth="1.6" />
      <path d="M47,102 q4,-7 8,0 t8,0" fill="none" className="stroke-[#f59e0b]" strokeWidth="1.4" />
      <text x="30" y="106" className="fill-[#f59e0b]" fontSize="9" textAnchor="end">GBF</text>
      {/* ammeter top */}
      <circle cx="120" cy="55" r="12" fill="none" className="stroke-neutral-400" strokeWidth="1.5" />
      <text x="120" y="59" className="fill-neutral-400" fontSize="10" textAnchor="middle">A</text>
      {/* R */}
      <rect x="150" y="48" width="40" height="14" fill="none" className="stroke-[#0db8d3]" strokeWidth="1.6" />
      <text x="170" y="42" className="fill-[#0db8d3]" fontSize="10" textAnchor="middle">R</text>
      {/* L coil right side */}
      <path d="M265,80 a7,7 0 0,1 0,14 a7,7 0 0,1 0,14 a7,7 0 0,1 0,14" fill="none" className="stroke-[#f59e0b]" strokeWidth="1.8" />
      <text x="277" y="104" className="fill-[#f59e0b]" fontSize="10">L</text>
      {/* C bottom */}
      <line x1="150" y1="150" x2="150" y2="150" />
      <line x1="150" y1="143" x2="150" y2="157" className="stroke-neutral-400" strokeWidth="0" />
      <line x1="150" y1="150" x2="162" y2="150" className="stroke-neutral-400" strokeWidth="0" />
      <line x1="152" y1="140" x2="152" y2="160" className="stroke-[#10b981]" strokeWidth="2.4" />
      <line x1="166" y1="140" x2="166" y2="160" className="stroke-[#10b981]" strokeWidth="2.4" />
      <text x="159" y="176" className="fill-[#10b981]" fontSize="10" textAnchor="middle">C</text>
    </svg>
  ),

  // Courbe de résonance d'intensité I(f), maximum à f₀
  "resonance-intensite": (
    <svg viewBox="0 0 360 200" className="w-full max-w-[470px] mx-auto h-auto">
      <line x1="40" y1="168" x2="348" y2="168" className={AX} strokeWidth="1.5" />
      <line x1="40" y1="20" x2="40" y2="178" className={AX} strokeWidth="1.5" />
      <polyline points="40.0,157.8 41.5,157.5 42.9,157.1 44.4,156.7 45.8,156.3 47.2,155.9 48.7,155.5 50.1,155.1 51.6,154.7 53.0,154.2 54.5,153.8 56.0,153.3 57.4,152.8 58.9,152.3 60.3,151.8 61.8,151.3 63.2,150.7 64.7,150.2 66.1,149.6 67.5,149.0 69.0,148.4 70.5,147.7 71.9,147.1 73.3,146.4 74.8,145.7 76.2,144.9 77.7,144.1 79.2,143.3 80.6,142.5 82.0,141.6 83.5,140.6 85.0,139.7 86.4,138.6 87.8,137.6 89.3,136.4 90.8,135.2 92.2,134.0 93.7,132.7 95.1,131.3 96.6,129.8 98.0,128.2 99.4,126.5 100.9,124.8 102.3,122.9 103.8,120.8 105.2,118.7 106.7,116.4 108.1,113.9 109.6,111.3 111.0,108.4 112.5,105.4 114.0,102.1 115.4,98.6 116.9,94.8 118.3,90.8 119.8,86.5 121.2,81.9 122.6,77.1 124.1,72.1 125.5,67.0 127.0,61.8 128.4,56.7 129.9,52.0 131.3,47.7 132.8,44.2 134.2,41.7 135.7,40.3 137.2,40.1 138.6,41.1 140.1,43.1 141.5,46.1 142.9,49.7 144.4,53.8 145.8,58.2 147.3,62.7 148.8,67.2 150.2,71.5 151.7,75.7 153.1,79.7 154.6,83.5 156.0,87.1 157.4,90.4 158.9,93.5 160.3,96.4 161.8,99.2 163.2,101.7 164.7,104.1 166.2,106.3 167.6,108.4 169.1,110.4 170.5,112.2 172.0,113.9 173.4,115.5 174.8,117.1 176.3,118.5 177.8,119.9 179.2,121.1 180.7,122.4 182.1,123.5 183.6,124.6 185.0,125.6 186.4,126.6 187.9,127.6 189.3,128.5 190.8,129.3 192.2,130.1 193.7,130.9 195.2,131.7 196.6,132.4 198.1,133.1 199.5,133.7 201.0,134.4 202.4,135.0 203.8,135.5 205.3,136.1 206.8,136.6 208.2,137.2 209.6,137.7 211.1,138.2 212.5,138.6 214.0,139.1 215.4,139.5 216.9,139.9 218.3,140.3 219.8,140.7 221.2,141.1 222.7,141.5 224.2,141.9 225.6,142.2 227.1,142.5 228.5,142.9 230.0,143.2 231.4,143.5 232.9,143.8 234.3,144.1 235.8,144.4 237.2,144.7 238.7,145.0 240.1,145.2 241.5,145.5 243.0,145.7 244.4,146.0 245.9,146.2 247.3,146.4 248.8,146.7 250.2,146.9 251.7,147.1 253.2,147.3 254.6,147.5 256.1,147.7 257.5,147.9 258.9,148.1 260.4,148.3 261.9,148.5 263.3,148.7 264.8,148.9 266.2,149.1 267.6,149.2 269.1,149.4 270.6,149.6 272.0,149.7 273.5,149.9 274.9,150.0 276.4,150.2 277.8,150.3 279.2,150.5 280.7,150.6 282.1,150.8 283.6,150.9 285.0,151.1 286.5,151.2 287.9,151.3 289.4,151.4 290.9,151.6 292.3,151.7 293.8,151.8 295.2,151.9 296.6,152.1 298.1,152.2 299.6,152.3 301.0,152.4 302.4,152.5 303.9,152.6 305.4,152.7 306.8,152.8 308.2,153.0 309.7,153.1 311.2,153.2 312.6,153.3 314.1,153.4 315.5,153.5 316.9,153.5 318.4,153.6 319.8,153.7 321.3,153.8 322.8,153.9 324.2,154.0 325.6,154.1 327.1,154.2 328.6,154.3 330.0,154.4" fill="none" className={CURVE} strokeWidth="2.5" />
      <line x1="136.7" y1="40" x2="136.7" y2="168" className={DASH} strokeWidth="1" strokeDasharray="4 4" />
      <text x="136.7" y="184" className="fill-[#f59e0b]" fontSize="11" textAnchor="middle">f₀</text>
      <text x="34" y="46" className="fill-neutral-400" fontSize="10" textAnchor="end">I_max</text>
      <text x="336" y="184" className="fill-neutral-400" fontSize="11">f</text>
      <text x="26" y="28" className="fill-neutral-400" fontSize="11">I</text>
      <text x="196" y="70" className="fill-neutral-400" fontSize="9">résonance : f = f₀</text>
    </svg>
  ),

  // Signal modulé en amplitude et son enveloppe
  "modulation-amplitude": (
    <svg viewBox="0 0 360 200" className="w-full max-w-[470px] mx-auto h-auto">
      <line x1="40" y1="100" x2="348" y2="100" className={AX} strokeWidth="1.1" />
      <polyline points="40.0,52.0 41.0,52.0 41.9,52.0 42.9,52.1 43.8,52.1 44.8,52.2 45.7,52.3 46.7,52.4 47.6,52.5 48.6,52.6 49.5,52.8 50.5,52.9 51.4,53.1 52.4,53.3 53.3,53.5 54.3,53.7 55.2,54.0 56.2,54.2 57.2,54.5 58.1,54.7 59.1,55.0 60.0,55.3 61.0,55.6 61.9,56.0 62.9,56.3 63.8,56.7 64.8,57.0 65.7,57.4 66.7,57.8 67.6,58.2 68.6,58.6 69.5,59.0 70.5,59.4 71.5,59.9 72.4,60.3 73.4,60.7 74.3,61.2 75.3,61.7 76.2,62.1 77.2,62.6 78.1,63.1 79.1,63.6 80.0,64.1 81.0,64.6 81.9,65.1 82.9,65.6 83.8,66.1 84.8,66.7 85.8,67.2 86.7,67.7 87.7,68.2 88.6,68.8 89.6,69.3 90.5,69.8 91.5,70.4 92.4,70.9 93.4,71.4 94.3,71.9 95.3,72.5 96.2,73.0 97.2,73.5 98.1,74.0 99.1,74.5 100.0,75.1 101.0,75.6 102.0,76.1 102.9,76.6 103.9,77.1 104.8,77.5 105.8,78.0 106.7,78.5 107.7,78.9 108.6,79.4 109.6,79.9 110.5,80.3 111.5,80.7 112.4,81.1 113.4,81.6 114.3,82.0 115.3,82.3 116.2,82.7 117.2,83.1 118.2,83.5 119.1,83.8 120.1,84.1 121.0,84.5 122.0,84.8 122.9,85.1 123.9,85.3 124.8,85.6 125.8,85.9 126.7,86.1 127.7,86.3 128.6,86.6 129.6,86.8 130.5,86.9 131.5,87.1 132.5,87.3 133.4,87.4 134.4,87.5 135.3,87.7 136.3,87.7 137.2,87.8 138.2,87.9 139.1,87.9 140.1,88.0 141.0,88.0 142.0,88.0 142.9,88.0 143.9,88.0 144.8,87.9 145.8,87.9 146.8,87.8 147.7,87.7 148.7,87.6 149.6,87.5 150.6,87.3 151.5,87.2 152.5,87.0 153.4,86.8 154.4,86.6 155.3,86.4 156.3,86.2 157.2,86.0 158.2,85.7 159.1,85.4 160.1,85.2 161.0,84.9 162.0,84.6 163.0,84.2 163.9,83.9 164.9,83.6 165.8,83.2 166.8,82.9 167.7,82.5 168.7,82.1 169.6,81.7 170.6,81.3 171.5,80.9 172.5,80.4 173.4,80.0 174.4,79.6 175.3,79.1 176.3,78.6 177.2,78.2 178.2,77.7 179.2,77.2 180.1,76.7 181.1,76.2 182.0,75.7 183.0,75.2 183.9,74.7 184.9,74.2 185.8,73.7 186.8,73.2 187.7,72.6 188.7,72.1 189.6,71.6 190.6,71.1 191.5,70.5 192.5,70.0 193.5,69.5 194.4,68.9 195.4,68.4 196.3,67.9 197.3,67.4 198.2,66.8 199.2,66.3 200.1,65.8 201.1,65.3 202.0,64.8 203.0,64.3 203.9,63.8 204.9,63.3 205.8,62.8 206.8,62.3 207.8,61.8 208.7,61.4 209.7,60.9 210.6,60.4 211.6,60.0 212.5,59.6 213.5,59.1 214.4,58.7 215.4,58.3 216.3,57.9 217.3,57.5 218.2,57.1 219.2,56.8 220.1,56.4 221.1,56.1 222.0,55.8 223.0,55.4 224.0,55.1 224.9,54.8 225.9,54.6 226.8,54.3 227.8,54.0 228.7,53.8 229.7,53.6 230.6,53.4 231.6,53.2 232.5,53.0 233.5,52.8 234.4,52.7 235.4,52.5 236.3,52.4 237.3,52.3 238.2,52.2 239.2,52.1 240.2,52.1 241.1,52.0 242.1,52.0 243.0,52.0 244.0,52.0 244.9,52.0 245.9,52.1 246.8,52.1 247.8,52.2 248.7,52.3 249.7,52.3 250.6,52.5 251.6,52.6 252.5,52.7 253.5,52.9 254.5,53.1 255.4,53.2 256.4,53.4 257.3,53.7 258.3,53.9 259.2,54.1 260.2,54.4 261.1,54.7 262.1,54.9 263.0,55.2 264.0,55.5 264.9,55.9 265.9,56.2 266.8,56.5 267.8,56.9 268.8,57.3 269.7,57.7 270.7,58.0 271.6,58.4 272.6,58.9 273.5,59.3 274.5,59.7 275.4,60.1 276.4,60.6 277.3,61.1 278.3,61.5 279.2,62.0 280.2,62.5 281.1,62.9 282.1,63.4 283.0,63.9 284.0,64.4 285.0,64.9 285.9,65.5 286.9,66.0 287.8,66.5 288.8,67.0 289.7,67.5 290.7,68.1 291.6,68.6 292.6,69.1 293.5,69.6 294.5,70.2 295.4,70.7 296.4,71.2 297.3,71.8 298.3,72.3 299.2,72.8 300.2,73.3 301.2,73.9 302.1,74.4 303.1,74.9 304.0,75.4 305.0,75.9 305.9,76.4 306.9,76.9 307.8,77.4 308.8,77.9 309.7,78.3 310.7,78.8 311.6,79.3 312.6,79.7 313.5,80.1 314.5,80.6 315.5,81.0 316.4,81.4 317.4,81.8 318.3,82.2 319.3,82.6 320.2,83.0 321.2,83.3 322.1,83.7 323.1,84.0 324.0,84.4 325.0,84.7 325.9,85.0 326.9,85.3 327.8,85.5 328.8,85.8 329.8,86.0 330.7,86.3 331.7,86.5 332.6,86.7 333.6,86.9 334.5,87.1 335.5,87.2 336.4,87.4 337.4,87.5 338.3,87.6 339.3,87.7 340.2,87.8 341.2,87.9 342.1,87.9 343.1,88.0 344.0,88.0 345.0,88.0" fill="none" className="stroke-[#f59e0b]" strokeWidth="1.6" strokeDasharray="5 3" />
      <polyline points="40.0,148.0 41.0,148.0 41.9,148.0 42.9,147.9 43.8,147.9 44.8,147.8 45.7,147.7 46.7,147.6 47.6,147.5 48.6,147.4 49.5,147.2 50.5,147.1 51.4,146.9 52.4,146.7 53.3,146.5 54.3,146.3 55.2,146.0 56.2,145.8 57.2,145.5 58.1,145.3 59.1,145.0 60.0,144.7 61.0,144.4 61.9,144.0 62.9,143.7 63.8,143.3 64.8,143.0 65.7,142.6 66.7,142.2 67.6,141.8 68.6,141.4 69.5,141.0 70.5,140.6 71.5,140.1 72.4,139.7 73.4,139.3 74.3,138.8 75.3,138.3 76.2,137.9 77.2,137.4 78.1,136.9 79.1,136.4 80.0,135.9 81.0,135.4 81.9,134.9 82.9,134.4 83.8,133.9 84.8,133.3 85.8,132.8 86.7,132.3 87.7,131.8 88.6,131.2 89.6,130.7 90.5,130.2 91.5,129.6 92.4,129.1 93.4,128.6 94.3,128.1 95.3,127.5 96.2,127.0 97.2,126.5 98.1,126.0 99.1,125.5 100.0,124.9 101.0,124.4 102.0,123.9 102.9,123.4 103.9,122.9 104.8,122.5 105.8,122.0 106.7,121.5 107.7,121.1 108.6,120.6 109.6,120.1 110.5,119.7 111.5,119.3 112.4,118.9 113.4,118.4 114.3,118.0 115.3,117.7 116.2,117.3 117.2,116.9 118.2,116.5 119.1,116.2 120.1,115.9 121.0,115.5 122.0,115.2 122.9,114.9 123.9,114.7 124.8,114.4 125.8,114.1 126.7,113.9 127.7,113.7 128.6,113.4 129.6,113.2 130.5,113.1 131.5,112.9 132.5,112.7 133.4,112.6 134.4,112.5 135.3,112.3 136.3,112.3 137.2,112.2 138.2,112.1 139.1,112.1 140.1,112.0 141.0,112.0 142.0,112.0 142.9,112.0 143.9,112.0 144.8,112.1 145.8,112.1 146.8,112.2 147.7,112.3 148.7,112.4 149.6,112.5 150.6,112.7 151.5,112.8 152.5,113.0 153.4,113.2 154.4,113.4 155.3,113.6 156.3,113.8 157.2,114.0 158.2,114.3 159.1,114.6 160.1,114.8 161.0,115.1 162.0,115.4 163.0,115.8 163.9,116.1 164.9,116.4 165.8,116.8 166.8,117.1 167.7,117.5 168.7,117.9 169.6,118.3 170.6,118.7 171.5,119.1 172.5,119.6 173.4,120.0 174.4,120.4 175.3,120.9 176.3,121.4 177.2,121.8 178.2,122.3 179.2,122.8 180.1,123.3 181.1,123.8 182.0,124.3 183.0,124.8 183.9,125.3 184.9,125.8 185.8,126.3 186.8,126.8 187.7,127.4 188.7,127.9 189.6,128.4 190.6,128.9 191.5,129.5 192.5,130.0 193.5,130.5 194.4,131.1 195.4,131.6 196.3,132.1 197.3,132.6 198.2,133.2 199.2,133.7 200.1,134.2 201.1,134.7 202.0,135.2 203.0,135.7 203.9,136.2 204.9,136.7 205.8,137.2 206.8,137.7 207.8,138.2 208.7,138.6 209.7,139.1 210.6,139.6 211.6,140.0 212.5,140.4 213.5,140.9 214.4,141.3 215.4,141.7 216.3,142.1 217.3,142.5 218.2,142.9 219.2,143.2 220.1,143.6 221.1,143.9 222.0,144.2 223.0,144.6 224.0,144.9 224.9,145.2 225.9,145.4 226.8,145.7 227.8,146.0 228.7,146.2 229.7,146.4 230.6,146.6 231.6,146.8 232.5,147.0 233.5,147.2 234.4,147.3 235.4,147.5 236.3,147.6 237.3,147.7 238.2,147.8 239.2,147.9 240.2,147.9 241.1,148.0 242.1,148.0 243.0,148.0 244.0,148.0 244.9,148.0 245.9,147.9 246.8,147.9 247.8,147.8 248.7,147.7 249.7,147.7 250.6,147.5 251.6,147.4 252.5,147.3 253.5,147.1 254.5,146.9 255.4,146.8 256.4,146.6 257.3,146.3 258.3,146.1 259.2,145.9 260.2,145.6 261.1,145.3 262.1,145.1 263.0,144.8 264.0,144.5 264.9,144.1 265.9,143.8 266.8,143.5 267.8,143.1 268.8,142.7 269.7,142.3 270.7,142.0 271.6,141.6 272.6,141.1 273.5,140.7 274.5,140.3 275.4,139.9 276.4,139.4 277.3,138.9 278.3,138.5 279.2,138.0 280.2,137.5 281.1,137.1 282.1,136.6 283.0,136.1 284.0,135.6 285.0,135.1 285.9,134.5 286.9,134.0 287.8,133.5 288.8,133.0 289.7,132.5 290.7,131.9 291.6,131.4 292.6,130.9 293.5,130.4 294.5,129.8 295.4,129.3 296.4,128.8 297.3,128.2 298.3,127.7 299.2,127.2 300.2,126.7 301.2,126.1 302.1,125.6 303.1,125.1 304.0,124.6 305.0,124.1 305.9,123.6 306.9,123.1 307.8,122.6 308.8,122.1 309.7,121.7 310.7,121.2 311.6,120.7 312.6,120.3 313.5,119.9 314.5,119.4 315.5,119.0 316.4,118.6 317.4,118.2 318.3,117.8 319.3,117.4 320.2,117.0 321.2,116.7 322.1,116.3 323.1,116.0 324.0,115.6 325.0,115.3 325.9,115.0 326.9,114.7 327.8,114.5 328.8,114.2 329.8,114.0 330.7,113.7 331.7,113.5 332.6,113.3 333.6,113.1 334.5,112.9 335.5,112.8 336.4,112.6 337.4,112.5 338.3,112.4 339.3,112.3 340.2,112.2 341.2,112.1 342.1,112.1 343.1,112.0 344.0,112.0 345.0,112.0" fill="none" className="stroke-[#f59e0b]" strokeWidth="1.6" strokeDasharray="5 3" />
      <polyline points="40.0,52.0 41.0,53.8 41.9,59.1 42.9,67.5 43.8,78.3 44.8,90.7 45.7,103.7 46.7,116.5 47.6,127.9 48.6,137.2 49.5,143.6 50.5,146.7 51.4,146.3 52.4,142.4 53.3,135.4 54.3,125.7 55.2,114.2 56.2,101.8 57.2,89.4 58.1,77.9 59.1,68.2 60.0,61.0 61.0,56.9 61.9,56.0 62.9,58.5 63.8,64.0 64.8,72.1 65.7,82.2 66.7,93.4 67.6,104.9 68.6,115.9 69.5,125.4 70.5,132.8 71.5,137.7 72.4,139.6 73.4,138.5 74.3,134.6 75.3,128.1 76.2,119.8 77.2,110.1 78.1,100.0 79.1,90.1 80.0,81.2 81.0,74.0 81.9,68.9 82.9,66.3 83.8,66.2 84.8,68.7 85.8,73.5 86.7,80.0 87.7,87.8 88.6,96.3 89.6,104.8 90.5,112.6 91.5,119.3 92.4,124.2 93.4,127.2 94.3,128.0 95.3,126.8 96.2,123.6 97.2,118.7 98.1,112.7 99.1,105.9 100.0,99.0 101.0,92.4 102.0,86.7 102.9,82.2 103.9,79.2 104.8,77.8 105.8,78.2 106.7,80.1 107.7,83.5 108.6,87.9 109.6,93.0 110.5,98.5 111.5,103.8 112.4,108.6 113.4,112.5 114.3,115.4 115.3,117.0 116.2,117.3 117.2,116.3 118.2,114.1 119.1,111.0 120.1,107.2 121.0,103.0 122.0,98.8 122.9,94.8 123.9,91.4 124.8,88.7 125.8,86.9 126.7,86.2 127.7,86.5 128.6,87.8 129.6,89.9 130.5,92.7 131.5,96.0 132.5,99.5 133.4,102.9 134.4,106.1 135.3,108.7 136.3,110.7 137.2,111.8 138.2,112.1 139.1,111.5 140.1,110.0 141.0,107.8 142.0,105.0 142.9,101.9 143.9,98.6 144.8,95.4 145.8,92.5 146.8,90.1 147.7,88.4 148.7,87.6 149.6,87.7 150.6,88.7 151.5,90.6 152.5,93.2 153.4,96.4 154.4,100.0 155.3,103.7 156.3,107.2 157.2,110.3 158.2,112.7 159.1,114.3 160.1,114.8 161.0,114.2 162.0,112.5 163.0,109.8 163.9,106.2 164.9,101.9 165.8,97.4 166.8,92.8 167.7,88.6 168.7,85.1 169.6,82.6 170.6,81.3 171.5,81.4 172.5,82.9 173.4,85.9 174.4,90.0 175.3,95.1 176.3,100.8 177.2,106.7 178.2,112.4 179.2,117.3 180.1,121.1 181.1,123.5 182.0,124.1 183.0,122.9 183.9,119.9 184.9,115.2 185.8,109.1 186.8,102.1 187.7,94.7 188.7,87.3 189.6,80.7 190.6,75.3 191.5,71.6 192.5,70.0 193.5,70.6 194.4,73.5 195.4,78.6 196.3,85.4 197.3,93.6 198.2,102.6 199.2,111.7 200.1,120.1 201.1,127.3 202.0,132.5 203.0,135.5 203.9,135.8 204.9,133.4 205.8,128.3 206.8,120.9 207.8,111.8 208.7,101.5 209.7,90.9 210.6,80.7 211.6,71.7 212.5,64.7 213.5,60.3 214.4,58.7 215.4,60.4 216.3,65.0 217.3,72.4 218.2,82.1 219.2,93.2 220.1,105.1 221.1,116.8 222.0,127.4 223.0,136.1 224.0,142.1 224.9,145.0 225.9,144.6 226.8,140.7 227.8,133.7 228.7,124.1 229.7,112.6 230.6,100.0 231.6,87.3 232.5,75.4 233.5,65.4 234.4,57.8 235.4,53.5 236.3,52.6 237.3,55.3 238.2,61.3 239.2,70.4 240.2,81.7 241.1,94.4 242.1,107.5 243.0,120.1 244.0,131.2 244.9,139.9 245.9,145.6 246.8,147.9 247.8,146.5 248.7,141.7 249.7,133.7 250.6,123.2 251.6,111.1 252.5,98.1 253.5,85.4 254.5,73.9 255.4,64.4 256.4,57.7 257.3,54.2 258.3,54.2 259.2,57.6 260.2,64.2 261.1,73.3 262.1,84.4 263.0,96.5 264.0,108.7 264.9,120.0 265.9,129.7 266.8,137.1 267.8,141.5 268.8,142.7 269.7,140.8 270.7,135.8 271.6,128.2 272.6,118.7 273.5,107.9 274.5,96.8 275.4,86.2 276.4,76.8 277.3,69.4 278.3,64.4 279.2,62.2 280.2,62.9 281.1,66.4 282.1,72.2 283.0,80.0 284.0,89.0 285.0,98.6 285.9,108.1 286.9,116.6 287.8,123.7 288.8,128.8 289.7,131.6 290.7,131.9 291.6,129.9 292.6,125.7 293.5,119.7 294.5,112.5 295.4,104.6 296.4,96.6 297.3,89.2 298.3,82.8 299.2,78.0 300.2,75.0 301.2,73.9 302.1,74.9 303.1,77.6 304.0,81.9 305.0,87.4 305.9,93.6 306.9,100.0 307.8,106.1 308.8,111.6 309.7,115.9 310.7,118.9 311.6,120.3 312.6,120.2 313.5,118.6 314.5,115.7 315.5,111.8 316.4,107.1 317.4,102.1 318.3,97.2 319.3,92.7 320.2,88.9 321.2,86.1 322.1,84.5 323.1,84.0 324.0,84.8 325.0,86.6 325.9,89.4 326.9,92.8 327.8,96.6 328.8,100.6 329.8,104.3 330.7,107.6 331.7,110.3 332.6,112.1 333.6,113.0 334.5,112.8 335.5,111.8 336.4,109.9 337.4,107.3 338.3,104.3 339.3,101.0 340.2,97.6 341.2,94.5 342.1,91.8 343.1,89.7 344.0,88.4 345.0,88.0" fill="none" className={CURVE} strokeWidth="1.5" />
      <text x="150" y="24" className="fill-[#f59e0b]" fontSize="9">enveloppe = signal informatif s(t)</text>
      <text x="250" y="192" className="fill-[#0db8d3]" fontSize="9">porteuse (haute fréquence)</text>
      <text x="336" y="94" className="fill-neutral-400" fontSize="11">t</text>
    </svg>
  ),

  // Détection d'enveloppe : redressement (diode) puis lissage (RC)
  "demodulation-enveloppe": (
    <svg viewBox="0 0 360 200" className="w-full max-w-[470px] mx-auto h-auto">
      <line x1="40" y1="165" x2="348" y2="165" className={AX} strokeWidth="1.2" />
      <polyline points="40.0,110.4 41.0,112.5 41.9,118.5 42.9,128.0 43.8,140.3 44.8,154.4 45.7,165.0 46.7,165.0 47.6,165.0 48.6,165.0 49.5,165.0 50.5,165.0 51.4,165.0 52.4,165.0 53.3,165.0 54.3,165.0 55.2,165.0 56.2,165.0 57.2,152.9 58.1,139.9 59.1,128.8 60.0,120.7 61.0,116.0 61.9,115.0 62.9,117.7 63.8,124.0 64.8,133.3 65.7,144.7 66.7,157.5 67.6,165.0 68.6,165.0 69.5,165.0 70.5,165.0 71.5,165.0 72.4,165.0 73.4,165.0 74.3,165.0 75.3,165.0 76.2,165.0 77.2,165.0 78.1,165.0 79.1,153.8 80.0,143.7 81.0,135.4 81.9,129.7 82.9,126.7 83.8,126.6 84.8,129.4 85.8,134.8 86.7,142.3 87.7,151.2 88.6,160.8 89.6,165.0 90.5,165.0 91.5,165.0 92.4,165.0 93.4,165.0 94.3,165.0 95.3,165.0 96.2,165.0 97.2,165.0 98.1,165.0 99.1,165.0 100.0,163.9 101.0,156.4 102.0,149.9 102.9,144.7 103.9,141.3 104.8,139.8 105.8,140.2 106.7,142.4 107.7,146.2 108.6,151.2 109.6,157.1 110.5,163.2 111.5,165.0 112.4,165.0 113.4,165.0 114.3,165.0 115.3,165.0 116.2,165.0 117.2,165.0 118.2,165.0 119.1,165.0 120.1,165.0 121.0,165.0 122.0,163.6 122.9,159.1 123.9,155.2 124.8,152.2 125.8,150.2 126.7,149.3 127.7,149.7 128.6,151.1 129.6,153.6 130.5,156.8 131.5,160.5 132.5,164.4 133.4,165.0 134.4,165.0 135.3,165.0 136.3,165.0 137.2,165.0 138.2,165.0 139.1,165.0 140.1,165.0 141.0,165.0 142.0,165.0 142.9,165.0 143.9,163.4 144.8,159.7 145.8,156.4 146.8,153.8 147.7,151.9 148.7,150.9 149.6,151.0 150.6,152.2 151.5,154.3 152.5,157.3 153.4,160.9 154.4,165.0 155.3,165.0 156.3,165.0 157.2,165.0 158.2,165.0 159.1,165.0 160.1,165.0 161.0,165.0 162.0,165.0 163.0,165.0 163.9,165.0 164.9,165.0 165.8,162.0 166.8,156.8 167.7,152.1 168.7,148.1 169.6,145.2 170.6,143.7 171.5,143.8 172.5,145.6 173.4,148.9 174.4,153.6 175.3,159.5 176.3,165.0 177.2,165.0 178.2,165.0 179.2,165.0 180.1,165.0 181.1,165.0 182.0,165.0 183.0,165.0 183.9,165.0 184.9,165.0 185.8,165.0 186.8,165.0 187.7,158.9 188.7,150.6 189.6,143.1 190.6,136.9 191.5,132.7 192.5,130.9 193.5,131.6 194.4,134.9 195.4,140.6 196.3,148.4 197.3,157.8 198.2,165.0 199.2,165.0 200.1,165.0 201.1,165.0 202.0,165.0 203.0,165.0 203.9,165.0 204.9,165.0 205.8,165.0 206.8,165.0 207.8,165.0 208.7,165.0 209.7,154.6 210.6,143.0 211.6,132.8 212.5,124.9 213.5,119.8 214.4,118.1 215.4,119.9 216.3,125.2 217.3,133.6 218.2,144.6 219.2,157.3 220.1,165.0 221.1,165.0 222.0,165.0 223.0,165.0 224.0,165.0 224.9,165.0 225.9,165.0 226.8,165.0 227.8,165.0 228.7,165.0 229.7,165.0 230.6,165.0 231.6,150.5 232.5,137.1 233.5,125.6 234.4,117.0 235.4,112.1 236.3,111.1 237.3,114.1 238.2,121.0 239.2,131.3 240.2,144.1 241.1,158.6 242.1,165.0 243.0,165.0 244.0,165.0 244.9,165.0 245.9,165.0 246.8,165.0 247.8,165.0 248.7,165.0 249.7,165.0 250.6,165.0 251.6,165.0 252.5,162.9 253.5,148.4 254.5,135.3 255.4,124.6 256.4,116.9 257.3,112.9 258.3,112.9 259.2,116.8 260.2,124.3 261.1,134.7 262.1,147.3 263.0,161.0 264.0,165.0 264.9,165.0 265.9,165.0 266.8,165.0 267.8,165.0 268.8,165.0 269.7,165.0 270.7,165.0 271.6,165.0 272.6,165.0 273.5,165.0 274.5,161.4 275.4,149.3 276.4,138.7 277.3,130.2 278.3,124.6 279.2,122.1 280.2,122.8 281.1,126.7 282.1,133.4 283.0,142.2 284.0,152.5 285.0,163.4 285.9,165.0 286.9,165.0 287.8,165.0 288.8,165.0 289.7,165.0 290.7,165.0 291.6,165.0 292.6,165.0 293.5,165.0 294.5,165.0 295.4,165.0 296.4,161.2 297.3,152.7 298.3,145.5 299.2,140.0 300.2,136.6 301.2,135.4 302.1,136.4 303.1,139.6 304.0,144.5 305.0,150.7 305.9,157.7 306.9,165.0 307.8,165.0 308.8,165.0 309.7,165.0 310.7,165.0 311.6,165.0 312.6,165.0 313.5,165.0 314.5,165.0 315.5,165.0 316.4,165.0 317.4,165.0 318.3,161.8 319.3,156.7 320.2,152.4 321.2,149.2 322.1,147.4 323.1,146.8 324.0,147.7 325.0,149.8 325.9,152.9 326.9,156.8 327.8,161.2 328.8,165.0 329.8,165.0 330.7,165.0 331.7,165.0 332.6,165.0 333.6,165.0 334.5,165.0 335.5,165.0 336.4,165.0 337.4,165.0 338.3,165.0 339.3,165.0 340.2,162.3 341.2,158.7 342.1,155.7 343.1,153.3 344.0,151.9 345.0,151.4" fill="none" className="stroke-[#0db8d3]/60" strokeWidth="1.2" />
      <polyline points="40.0,110.4 41.0,110.4 41.9,110.4 42.9,110.5 43.8,110.6 44.8,110.6 45.7,110.7 46.7,110.8 47.6,111.0 48.6,111.1 49.5,111.3 50.5,111.5 51.4,111.7 52.4,111.9 53.3,112.1 54.3,112.4 55.2,112.6 56.2,112.9 57.2,113.2 58.1,113.5 59.1,113.9 60.0,114.2 61.0,114.6 61.9,114.9 62.9,115.3 63.8,115.7 64.8,116.1 65.7,116.6 66.7,117.0 67.6,117.4 68.6,117.9 69.5,118.4 70.5,118.9 71.5,119.3 72.4,119.8 73.4,120.4 74.3,120.9 75.3,121.4 76.2,121.9 77.2,122.5 78.1,123.0 79.1,123.6 80.0,124.2 81.0,124.7 81.9,125.3 82.9,125.9 83.8,126.5 84.8,127.1 85.8,127.7 86.7,128.3 87.7,128.9 88.6,129.5 89.6,130.1 90.5,130.7 91.5,131.3 92.4,131.9 93.4,132.5 94.3,133.1 95.3,133.7 96.2,134.3 97.2,134.9 98.1,135.5 99.1,136.1 100.0,136.6 101.0,137.2 102.0,137.8 102.9,138.3 103.9,138.9 104.8,139.5 105.8,140.0 106.7,140.5 107.7,141.1 108.6,141.6 109.6,142.1 110.5,142.6 111.5,143.1 112.4,143.6 113.4,144.0 114.3,144.5 115.3,144.9 116.2,145.4 117.2,145.8 118.2,146.2 119.1,146.6 120.1,147.0 121.0,147.3 122.0,147.7 122.9,148.0 123.9,148.3 124.8,148.6 125.8,148.9 126.7,149.2 127.7,149.5 128.6,149.7 129.6,149.9 130.5,150.2 131.5,150.4 132.5,150.5 133.4,150.7 134.4,150.8 135.3,151.0 136.3,151.1 137.2,151.2 138.2,151.2 139.1,151.3 140.1,151.3 141.0,151.3 142.0,151.4 142.9,151.3 143.9,151.3 144.8,151.3 145.8,151.2 146.8,151.1 147.7,151.0 148.7,150.9 149.6,150.7 150.6,150.6 151.5,150.4 152.5,150.2 153.4,150.0 154.4,149.8 155.3,149.6 156.3,149.3 157.2,149.0 158.2,148.7 159.1,148.4 160.1,148.1 161.0,147.8 162.0,147.4 163.0,147.1 163.9,146.7 164.9,146.3 165.8,145.9 166.8,145.5 167.7,145.1 168.7,144.6 169.6,144.2 170.6,143.7 171.5,143.2 172.5,142.8 173.4,142.3 174.4,141.7 175.3,141.2 176.3,140.7 177.2,140.2 178.2,139.6 179.2,139.1 180.1,138.5 181.1,138.0 182.0,137.4 183.0,136.8 183.9,136.2 184.9,135.7 185.8,135.1 186.8,134.5 187.7,133.9 188.7,133.3 189.6,132.7 190.6,132.1 191.5,131.5 192.5,130.9 193.5,130.3 194.4,129.7 195.4,129.1 196.3,128.5 197.3,127.9 198.2,127.3 199.2,126.7 200.1,126.1 201.1,125.5 202.0,124.9 203.0,124.4 203.9,123.8 204.9,123.2 205.8,122.7 206.8,122.1 207.8,121.6 208.7,121.1 209.7,120.5 210.6,120.0 211.6,119.5 212.5,119.0 213.5,118.5 214.4,118.1 215.4,117.6 216.3,117.1 217.3,116.7 218.2,116.3 219.2,115.9 220.1,115.4 221.1,115.1 222.0,114.7 223.0,114.3 224.0,114.0 224.9,113.6 225.9,113.3 226.8,113.0 227.8,112.7 228.7,112.5 229.7,112.2 230.6,112.0 231.6,111.7 232.5,111.5 233.5,111.4 234.4,111.2 235.4,111.0 236.3,110.9 237.3,110.8 238.2,110.7 239.2,110.6 240.2,110.5 241.1,110.5 242.1,110.4 243.0,110.4 244.0,110.4 244.9,110.4 245.9,110.5 246.8,110.5 247.8,110.6 248.7,110.7 249.7,110.8 250.6,110.9 251.6,111.1 252.5,111.2 253.5,111.4 254.5,111.6 255.4,111.8 256.4,112.0 257.3,112.3 258.3,112.6 259.2,112.8 260.2,113.1 261.1,113.4 262.1,113.8 263.0,114.1 264.0,114.4 264.9,114.8 265.9,115.2 266.8,115.6 267.8,116.0 268.8,116.4 269.7,116.8 270.7,117.3 271.6,117.7 272.6,118.2 273.5,118.7 274.5,119.2 275.4,119.7 276.4,120.2 277.3,120.7 278.3,121.2 279.2,121.8 280.2,122.3 281.1,122.9 282.1,123.4 283.0,124.0 284.0,124.6 285.0,125.1 285.9,125.7 286.9,126.3 287.8,126.9 288.8,127.5 289.7,128.1 290.7,128.7 291.6,129.3 292.6,129.9 293.5,130.5 294.5,131.1 295.4,131.7 296.4,132.3 297.3,132.9 298.3,133.5 299.2,134.1 300.2,134.7 301.2,135.3 302.1,135.9 303.1,136.4 304.0,137.0 305.0,137.6 305.9,138.2 306.9,138.7 307.8,139.3 308.8,139.8 309.7,140.4 310.7,140.9 311.6,141.4 312.6,141.9 313.5,142.4 314.5,142.9 315.5,143.4 316.4,143.9 317.4,144.3 318.3,144.8 319.3,145.2 320.2,145.6 321.2,146.1 322.1,146.4 323.1,146.8 324.0,147.2 325.0,147.6 325.9,147.9 326.9,148.2 327.8,148.5 328.8,148.8 329.8,149.1 330.7,149.4 331.7,149.6 332.6,149.9 333.6,150.1 334.5,150.3 335.5,150.5 336.4,150.6 337.4,150.8 338.3,150.9 339.3,151.0 340.2,151.1 341.2,151.2 342.1,151.3 343.1,151.3 344.0,151.3 345.0,151.4" fill="none" className="stroke-[#f59e0b]" strokeWidth="2.2" />
      <text x="150" y="26" className="fill-[#f59e0b]" fontSize="9.5">enveloppe récupérée s(t)</text>
      <text x="60" y="150" className="fill-[#0db8d3]" fontSize="8.5">signal redressé</text>
      <text x="200" y="185" className="fill-neutral-400" fontSize="8.5">diode + filtre RC (T_porteuse ≪ RC ≪ T_signal)</text>
      <text x="336" y="159" className="fill-neutral-400" fontSize="11">t</text>
    </svg>
  ),

  // Chaîne de modulation : multiplieur (porteuse × signal décalé)
  "montage-modulation": (
    <svg viewBox="0 0 360 190" className="w-full max-w-[470px] mx-auto h-auto">
      {/* multiplier X */}
      <circle cx="200" cy="90" r="26" fill="none" className="stroke-neutral-400" strokeWidth="1.8" />
      <path d="M188,78 L212,102 M212,78 L188,102" className="stroke-neutral-400" strokeWidth="1.8" />
      <text x="200" y="132" className="fill-neutral-400" fontSize="9" textAnchor="middle">multiplieur</text>
      {/* signal + offset input top-left */}
      <line x1="40" y1="55" x2="174" y2="80" className="stroke-[#f59e0b]" strokeWidth="1.8" />
      <path d="M180,82 l-9,-1.5 l2,-8 z" className="fill-[#f59e0b]" />
      <text x="36" y="48" className="fill-[#f59e0b]" fontSize="9">s(t) + U₀</text>
      {/* carrier input bottom-left */}
      <line x1="40" y1="128" x2="174" y2="100" className={CURVE} strokeWidth="1.8" />
      <path d="M180,98 l-9,1.5 l2,8 z" className="fill-[#0db8d3]" />
      <text x="36" y="142" className="fill-[#0db8d3]" fontSize="9">porteuse p(t)</text>
      {/* output */}
      <line x1="226" y1="90" x2="330" y2="90" className="stroke-neutral-300 dark:stroke-neutral-100" strokeWidth="1.8" />
      <path d="M336,90 l-9,-4.5 l0,9 z" className="fill-neutral-300 dark:fill-neutral-100" />
      <text x="300" y="82" className="fill-neutral-400" fontSize="9" textAnchor="middle">signal modulé</text>
    </svg>
  ),

  // Spectre d'un signal modulé en amplitude
  "spectre-modulation": (
    <svg viewBox="0 0 360 200" className="w-full max-w-[470px] mx-auto h-auto">
      <line x1="40" y1="165" x2="345" y2="165" className={AX} strokeWidth="1.5" />
      <line x1="40" y1="20" x2="40" y2="175" className={AX} strokeWidth="1.5" />
      {/* carrier F (tall) */}
      <line x1="200" y1="165" x2="200" y2="50" className={CURVE} strokeWidth="2.6" />
      <circle cx="200" cy="50" r="3" className="fill-[#0db8d3]" />
      <text x="200" y="182" className="fill-neutral-400" fontSize="9" textAnchor="middle">F</text>
      <text x="206" y="46" className="fill-[#0db8d3]" fontSize="8.5">porteuse</text>
      {/* lower sideband F-f */}
      <line x1="150" y1="165" x2="150" y2="98" className="stroke-[#f59e0b]" strokeWidth="2.4" />
      <circle cx="150" cy="98" r="2.6" className="fill-[#f59e0b]" />
      <text x="150" y="182" className="fill-neutral-400" fontSize="8.5" textAnchor="middle">F−f</text>
      {/* upper sideband F+f */}
      <line x1="250" y1="165" x2="250" y2="98" className="stroke-[#f59e0b]" strokeWidth="2.4" />
      <circle cx="250" cy="98" r="2.6" className="fill-[#f59e0b]" />
      <text x="250" y="182" className="fill-neutral-400" fontSize="8.5" textAnchor="middle">F+f</text>
      <text x="200" y="112" className="fill-[#f59e0b]" fontSize="8.5" textAnchor="middle">bandes latérales</text>
      <text x="336" y="180" className="fill-neutral-400" fontSize="11">ν</text>
      <text x="26" y="28" className="fill-neutral-400" fontSize="10">amplitude</text>
    </svg>
  ),

  // Influence de la température et de la concentration sur l'avancement
  "facteurs-cinetiques": (
    <svg viewBox="0 0 360 200" className="w-full max-w-[470px] mx-auto h-auto">
      <line x1="44" y1="164" x2="345" y2="164" className={AX} strokeWidth="1.5" />
      <line x1="44" y1="24" x2="44" y2="174" className={AX} strokeWidth="1.5" />
      {/* même palier : facteur purement cinétique */}
      <line x1="44" y1="46" x2="340" y2="46" className={DASH} strokeWidth="1" strokeDasharray="5 4" />
      <text x="38" y="50" className="fill-neutral-400" fontSize="10" textAnchor="end">x_f</text>
      {/* rapide : T élevée ou catalyseur */}
      <path d="M44,164 C70,70 110,50 340,47" fill="none" className="stroke-[#f59e0b]" strokeWidth="2.4" />
      <text x="120" y="66" className="fill-[#f59e0b]" fontSize="9.5">T élevée / catalyseur</text>
      {/* référence */}
      <path d="M44,164 C104,104 180,58 340,48" fill="none" className={CURVE} strokeWidth="2.4" />
      <text x="192" y="86" className="fill-[#0db8d3]" fontSize="9.5">référence</text>
      {/* lente : dilué ou T basse */}
      <path d="M44,164 C140,146 240,96 340,54" fill="none" className="stroke-[#10b981]" strokeWidth="2.4" strokeDasharray="6 4" />
      <text x="216" y="130" className="fill-[#10b981]" fontSize="9.5">dilué / T basse</text>
      <text x="336" y="180" className="fill-neutral-400" fontSize="11">t</text>
      <text x="30" y="32" className="fill-neutral-400" fontSize="11">x</text>
      <text x="120" y="192" className="fill-neutral-400" fontSize="9">même palier ⇒ même état final</text>
    </svg>
  ),

  // Détermination de la vitesse par la pente de la tangente
  "vitesse-tangente": (
    <svg viewBox="0 0 360 200" className="w-full max-w-[470px] mx-auto h-auto">
      <line x1="44" y1="164" x2="345" y2="164" className={AX} strokeWidth="1.5" />
      <line x1="44" y1="24" x2="44" y2="174" className={AX} strokeWidth="1.5" />
      <line x1="44" y1="44" x2="340" y2="44" className={DASH} strokeWidth="1" strokeDasharray="5 4" />
      <text x="38" y="48" className="fill-neutral-400" fontSize="10" textAnchor="end">x_f</text>
      {/* courbe x(t) */}
      <path d="M44,164 C96,96 164,58 340,46" fill="none" className={CURVE} strokeWidth="2.5" />
      {/* tangente à l'origine */}
      <line x1="44" y1="164" x2="150" y2="34" className="stroke-[#f59e0b]" strokeWidth="1.6" strokeDasharray="5 3" />
      <text x="56" y="70" className="fill-[#f59e0b]" fontSize="9">tangente en t = 0</text>
      {/* tangente en t1 */}
      <circle cx="150" cy="76" r="4" fill="#10b981" />
      <line x1="94" y1="100" x2="240" y2="62" className="stroke-[#10b981]" strokeWidth="1.6" />
      <line x1="94" y1="100" x2="240" y2="100" className={DASH} strokeWidth="1" strokeDasharray="3 3" />
      <line x1="240" y1="62" x2="240" y2="100" className={DASH} strokeWidth="1" strokeDasharray="3 3" />
      <text x="164" y="114" className="fill-[#10b981]" fontSize="9.5">Δt</text>
      <text x="246" y="84" className="fill-[#10b981]" fontSize="9.5">Δx</text>
      <line x1="150" y1="80" x2="150" y2="164" className={DASH} strokeWidth="1" strokeDasharray="3 3" />
      <text x="150" y="180" className="fill-neutral-400" fontSize="10" textAnchor="middle">t₁</text>
      <text x="336" y="180" className="fill-neutral-400" fontSize="11">t</text>
      <text x="30" y="32" className="fill-neutral-400" fontSize="11">x</text>
      <text x="200" y="146" className="fill-neutral-400" fontSize="9.5">v = (1/V) · Δx/Δt</text>
    </svg>
  ),

  // Lecture graphique du temps de demi-réaction
  "demi-reaction": (
    <svg viewBox="0 0 340 200" className="w-full max-w-[440px] mx-auto h-auto">
      <line x1="44" y1="164" x2="320" y2="164" className={AX} strokeWidth="1.5" />
      <line x1="44" y1="24" x2="44" y2="174" className={AX} strokeWidth="1.5" />
      {/* palier */}
      <line x1="44" y1="44" x2="316" y2="44" className={DASH} strokeWidth="1" strokeDasharray="5 4" />
      <text x="38" y="48" className="fill-neutral-400" fontSize="10" textAnchor="end">x_f</text>
      {/* courbe */}
      <path d="M44,164 C92,94 154,56 312,46" fill="none" className={CURVE} strokeWidth="2.5" />
      {/* demi-palier */}
      <line x1="44" y1="104" x2="102" y2="104" className="stroke-[#f59e0b]" strokeWidth="1.4" strokeDasharray="4 3" />
      <line x1="102" y1="104" x2="102" y2="164" className="stroke-[#f59e0b]" strokeWidth="1.4" strokeDasharray="4 3" />
      <circle cx="102" cy="104" r="4" fill="#f59e0b" />
      <text x="36" y="108" className="fill-[#f59e0b]" fontSize="10" textAnchor="end">x_f /2</text>
      <text x="102" y="180" className="fill-[#f59e0b]" fontSize="11" textAnchor="middle">t½</text>
      <text x="312" y="180" className="fill-neutral-400" fontSize="11">t</text>
      <text x="30" y="32" className="fill-neutral-400" fontSize="11">x</text>
      <text x="150" y="132" className="fill-neutral-400" fontSize="9">palier atteint vers 5 à 10 t½</text>
    </svg>
  ),

  // Montage de suivi conductimétrique
  "montage-conductimetrie": (
    <svg viewBox="0 0 320 210" className="w-full max-w-[360px] mx-auto h-auto">
      {/* bécher */}
      <path d="M70,80 L70,180 Q70,190 80,190 L180,190 Q190,190 190,180 L190,80" fill="none" className="stroke-neutral-500" strokeWidth="1.8" />
      <path d="M73,120 L73,180 Q73,187 80,187 L180,187 Q187,187 187,180 L187,120 Z" className="fill-[#0db8d3]/15" />
      <line x1="73" y1="120" x2="187" y2="120" className="stroke-[#0db8d3]" strokeWidth="1.3" />
      {/* cellule conductimétrique : deux plaques */}
      <line x1="118" y1="60" x2="118" y2="160" className="stroke-neutral-400" strokeWidth="1.6" />
      <line x1="142" y1="60" x2="142" y2="160" className="stroke-neutral-400" strokeWidth="1.6" />
      <rect x="112" y="136" width="12" height="24" className="fill-neutral-400/60 stroke-neutral-400" strokeWidth="1.2" />
      <rect x="136" y="136" width="12" height="24" className="fill-neutral-400/60 stroke-neutral-400" strokeWidth="1.2" />
      <text x="156" y="152" className="fill-neutral-400" fontSize="9">cellule</text>
      {/* conductimètre */}
      <rect x="196" y="28" width="96" height="58" rx="6" fill="none" className="stroke-neutral-500" strokeWidth="1.8" />
      <rect x="208" y="40" width="72" height="24" rx="3" className="fill-[#10b981]/20" />
      <text x="244" y="57" className="fill-[#10b981]" fontSize="11" textAnchor="middle">σ</text>
      <text x="244" y="80" className="fill-neutral-400" fontSize="8.5" textAnchor="middle">conductimètre</text>
      <path d="M118,60 L118,44 L196,44" fill="none" className="stroke-neutral-400" strokeWidth="1.4" />
      <path d="M142,60 L142,54 L196,54" fill="none" className="stroke-neutral-400" strokeWidth="1.4" />
      {/* agitateur magnétique */}
      <ellipse cx="130" cy="180" rx="16" ry="4" className="fill-[#f59e0b]/60" />
      <rect x="86" y="194" width="88" height="12" rx="3" fill="none" className="stroke-neutral-500" strokeWidth="1.4" />
      <text x="18" y="204" className="fill-neutral-400" fontSize="9">agitateur</text>
      <text x="16" y="130" className="fill-[#0db8d3]" fontSize="9.5">solution</text>
    </svg>
  ),

  // Les deux vitesses opposées convergent : équilibre dynamique
  "equilibre-dynamique": (
    <svg viewBox="0 0 360 200" className="w-full max-w-[470px] mx-auto h-auto">
      <line x1="44" y1="164" x2="345" y2="164" className={AX} strokeWidth="1.5" />
      <line x1="44" y1="24" x2="44" y2="174" className={AX} strokeWidth="1.5" />
      {/* v direct : décroît */}
      <path d="M44,44 C96,112 150,126 340,130" fill="none" className={CURVE} strokeWidth="2.4" />
      <text x="88" y="66" className="fill-[#0db8d3]" fontSize="10">v direct</text>
      {/* v inverse : croît */}
      <path d="M44,164 C96,146 150,134 340,130" fill="none" className="stroke-[#f59e0b]" strokeWidth="2.4" strokeDasharray="6 3" />
      <text x="88" y="158" className="fill-[#f59e0b]" fontSize="10">v inverse</text>
      {/* point de rencontre */}
      <circle cx="196" cy="131" r="4.5" fill="#10b981" />
      <line x1="196" y1="131" x2="196" y2="164" className={DASH} strokeWidth="1" strokeDasharray="3 3" />
      <text x="196" y="180" className="fill-[#10b981]" fontSize="10" textAnchor="middle">équilibre</text>
      <line x1="200" y1="130" x2="340" y2="130" className="stroke-[#10b981]" strokeWidth="1.6" />
      <text x="244" y="120" className="fill-[#10b981]" fontSize="9.5">v direct = v inverse</text>
      <text x="336" y="180" className="fill-neutral-400" fontSize="11">t</text>
      <text x="30" y="32" className="fill-neutral-400" fontSize="11">v</text>
      <text x="56" y="194" className="fill-neutral-400" fontSize="9">les deux réactions continuent, à la même vitesse</text>
    </svg>
  ),

  // La pile Daniell : montage expérimental complet
  "pile-daniell": (
    <svg viewBox="0 0 380 230" className="w-full max-w-[480px] mx-auto h-auto">
      {/* bécher de gauche : sulfate de zinc */}
      <path d="M40,96 L40,196 Q40,206 50,206 L134,206 Q144,206 144,196 L144,96"
            fill="none" className="stroke-neutral-500" strokeWidth="1.8" />
      <path d="M43,126 L43,196 Q43,203 50,203 L134,203 Q141,203 141,196 L141,126 Z"
            className="fill-neutral-400/12" />
      <line x1="43" y1="126" x2="141" y2="126" className="stroke-neutral-400" strokeWidth="1.2" />
      <text x="92" y="222" className="fill-neutral-400" fontSize="9" textAnchor="middle">ZnSO₄</text>
      {/* bécher de droite : sulfate de cuivre */}
      <path d="M236,96 L236,196 Q236,206 246,206 L330,206 Q340,206 340,196 L340,96"
            fill="none" className="stroke-neutral-500" strokeWidth="1.8" />
      <path d="M239,126 L239,196 Q239,203 246,203 L330,203 Q337,203 337,196 L337,126 Z"
            className="fill-[#0db8d3]/18" />
      <line x1="239" y1="126" x2="337" y2="126" className="stroke-[#0db8d3]" strokeWidth="1.2" />
      <text x="288" y="222" className="fill-[#0db8d3]" fontSize="9" textAnchor="middle">CuSO₄</text>
      {/* lame de zinc */}
      <rect x="84" y="70" width="10" height="112" className="fill-neutral-400/50 stroke-neutral-400" strokeWidth="1.4" />
      <text x="62" y="66" className="fill-neutral-400" fontSize="10">Zn</text>
      <text x="56" y="164" className="fill-neutral-400" fontSize="12">⊖</text>
      {/* lame de cuivre */}
      <rect x="286" y="70" width="10" height="112" className="fill-[#f59e0b]/55 stroke-[#f59e0b]" strokeWidth="1.4" />
      <text x="304" y="66" className="fill-[#f59e0b]" fontSize="10">Cu</text>
      <text x="312" y="164" className="fill-[#f59e0b]" fontSize="12">⊕</text>
      {/* pont salin */}
      <path d="M110,116 C110,80 270,80 270,116" fill="none" className="stroke-[#10b981]" strokeWidth="7" strokeLinecap="round" />
      <text x="190" y="80" className="fill-[#10b981]" fontSize="9.5" textAnchor="middle">pont salin (KCl)</text>
      {/* circuit extérieur avec voltmètre */}
      <path d="M89,70 L89,36 L150,36" fill="none" className="stroke-neutral-400" strokeWidth="1.5" />
      <path d="M291,70 L291,36 L230,36" fill="none" className="stroke-neutral-400" strokeWidth="1.5" />
      <circle cx="190" cy="36" r="20" fill="none" className="stroke-neutral-500" strokeWidth="1.8" />
      <text x="190" y="41" className="fill-neutral-300 dark:fill-neutral-100" fontSize="12" textAnchor="middle">V</text>
      {/* sens des électrons */}
      <path d="M116,26 L150,26" className="stroke-[#0db8d3]" strokeWidth="1.6" />
      <path d="M156,26 l-9,-4.5 l0,9 z" className="fill-[#0db8d3]" />
      <text x="112" y="18" className="fill-[#0db8d3]" fontSize="9">e⁻</text>
      {/* équations aux électrodes */}
      <text x="12" y="192" className="fill-neutral-400" fontSize="8.5">Zn → Zn²⁺ + 2e⁻</text>
      <text x="300" y="192" className="fill-[#f59e0b]" fontSize="8.5">Cu²⁺ + 2e⁻ → Cu</text>
      <text x="190" y="108" className="fill-neutral-400" fontSize="9" textAnchor="middle">E ≈ 1,10 V</text>
    </svg>
  ),

  // Montage d'une électrolyse
  "montage-electrolyse": (
    <svg viewBox="0 0 360 230" className="w-full max-w-[460px] mx-auto h-auto">
      {/* cuve */}
      <path d="M70,86 L70,196 Q70,206 80,206 L280,206 Q290,206 290,196 L290,86"
            fill="none" className="stroke-neutral-500" strokeWidth="1.8" />
      <path d="M73,116 L73,196 Q73,203 80,203 L280,203 Q287,203 287,196 L287,116 Z"
            className="fill-[#0db8d3]/15" />
      <line x1="73" y1="116" x2="287" y2="116" className="stroke-[#0db8d3]" strokeWidth="1.2" />
      <text x="180" y="222" className="fill-[#0db8d3]" fontSize="9" textAnchor="middle">électrolyte</text>
      {/* électrodes */}
      <rect x="126" y="62" width="9" height="116" className="fill-neutral-400/50 stroke-neutral-400" strokeWidth="1.4" />
      <rect x="226" y="62" width="9" height="116" className="fill-neutral-400/50 stroke-neutral-400" strokeWidth="1.4" />
      {/* générateur */}
      <rect x="134" y="16" width="92" height="30" rx="4" fill="none" className="stroke-neutral-500" strokeWidth="1.8" />
      <text x="180" y="36" className="fill-neutral-300 dark:fill-neutral-100" fontSize="10" textAnchor="middle">générateur</text>
      <path d="M130,62 L130,31 L134,31" fill="none" className="stroke-neutral-400" strokeWidth="1.5" />
      <path d="M231,62 L231,31 L226,31" fill="none" className="stroke-neutral-400" strokeWidth="1.5" />
      {/* signes : anode + à droite (relie a la borne + du generateur) */}
      <text x="118" y="56" className="fill-[#0db8d3]" fontSize="12" textAnchor="middle">⊖</text>
      <text x="244" y="56" className="fill-[#f59e0b]" fontSize="12" textAnchor="middle">⊕</text>
      <text x="96" y="76" className="fill-[#0db8d3]" fontSize="9.5">cathode</text>
      <text x="246" y="76" className="fill-[#f59e0b]" fontSize="9.5">anode</text>
      {/* réactions */}
      <text x="80" y="196" className="fill-[#0db8d3]" fontSize="8.5">réduction</text>
      <text x="232" y="196" className="fill-[#f59e0b]" fontSize="8.5">oxydation</text>
      {/* migration des ions */}
      <path d="M186,140 L152,140" className="stroke-[#10b981]" strokeWidth="1.5" />
      <path d="M146,140 l9,-4.5 l0,9 z" className="fill-[#10b981]" />
      <text x="192" y="144" className="fill-[#10b981]" fontSize="9">cations</text>
      <path d="M170,164 L212,164" className="stroke-[#f59e0b]" strokeWidth="1.5" />
      <path d="M218,164 l-9,-4.5 l0,9 z" className="fill-[#f59e0b]" />
      <text x="120" y="168" className="fill-[#f59e0b]" fontSize="9">anions</text>
      {/* sens du courant */}
      <path d="M150,8 L210,8" className="stroke-neutral-400" strokeWidth="1.5" />
      <path d="M144,8 l9,-4.5 l0,9 z" className="fill-neutral-400" />
      <text x="216" y="12" className="fill-neutral-400" fontSize="9">courant imposé</text>
    </svg>
  ),

  // Vitesse vs rendement : effet du catalyseur et effet de l'excès de réactif
  "esterification-rendement": (
    <svg viewBox="0 0 400 250" className="w-full max-w-[520px] mx-auto h-auto">
      {/* axes */}
      <line x1="52" y1="206" x2="372" y2="206" className={AX} strokeWidth="1.5" />
      <line x1="52" y1="206" x2="52" y2="24" className={AX} strokeWidth="1.5" />
      <path d="M372,206 l-8,-4 l0,8 z" className="fill-neutral-400" />
      <path d="M52,24 l-4,8 l8,0 z" className="fill-neutral-400" />
      <text x="356" y="224" className="fill-neutral-400" fontSize="11">t</text>
      <text x="20" y="32" className="fill-neutral-400" fontSize="11">x</text>

      {/* plateau 1 : x_f = 0,67 n0 (proportions stoechiometriques) */}
      <line x1="52" y1="116" x2="372" y2="116" className={DASH} strokeWidth="1" strokeDasharray="4 4" />
      <text x="8" y="120" className="fill-neutral-400" fontSize="9">0,67 n₀</text>
      {/* plateau 2 : x_f = 0,85 n0 (alcool en exces) */}
      <line x1="52" y1="62" x2="372" y2="62" className={DASH} strokeWidth="1" strokeDasharray="4 4" />
      <text x="8" y="66" className="fill-[#10b981]" fontSize="9">0,85 n₀</text>

      {/* courbe : sans catalyseur — meme plateau, beaucoup plus lente */}
      <path d="M52,206 C130,196 210,168 280,142 C320,128 350,120 372,118"
            fill="none" className={CURVE} strokeWidth="2" strokeDasharray="6 4" />
      <text x="286" y="176" className="fill-[#0db8d3]" fontSize="9">sans catalyseur</text>

      {/* courbe : avec catalyseur — meme plateau, atteint vite */}
      <path d="M52,206 C74,150 104,124 148,119 C210,116 300,116 372,116"
            fill="none" className={CURVE} strokeWidth="2.2" />
      <text x="150" y="134" className="fill-[#0db8d3]" fontSize="9">avec catalyseur</text>

      {/* courbe : alcool en exces — plateau plus haut */}
      <path d="M52,206 C76,120 108,74 152,66 C214,62 300,62 372,62"
            fill="none" className="stroke-[#10b981]" strokeWidth="2.2" />
      <text x="186" y="52" className="fill-[#10b981]" fontSize="9">alcool en excès</text>

      {/* legende de lecture */}
      <text x="60" y="240" className="fill-neutral-400" fontSize="8.5">
        catalyseur → même plateau, atteint plus tôt (vitesse)
      </text>
      <text x="60" y="250" className="fill-[#10b981]" fontSize="8.5">
        excès de réactif → plateau plus haut (rendement)
      </text>
    </svg>
  ),

  // Ion carboxylate amphiphile et micelle
  "savon-micelle": (
    <svg viewBox="0 0 400 210" className="w-full max-w-[520px] mx-auto h-auto">
      {/* --- partie gauche : l'ion carboxylate --- */}
      <text x="96" y="20" className="fill-neutral-300 dark:fill-neutral-100" fontSize="10" textAnchor="middle">
        ion carboxylate R—COO⁻
      </text>
      {/* queue hydrophobe : zigzag */}
      <path d="M22,62 l14,14 l14,-14 l14,14 l14,-14 l14,14 l14,-14 l14,14"
            fill="none" className="stroke-[#f59e0b]" strokeWidth="2.2" strokeLinecap="round" />
      {/* tete hydrophile */}
      <circle cx="152" cy="76" r="13" className="fill-[#0db8d3]/35 stroke-[#0db8d3]" strokeWidth="1.8" />
      <text x="152" y="80" className="fill-[#0db8d3]" fontSize="9" textAnchor="middle">COO⁻</text>
      {/* accolades / labels */}
      <path d="M22,96 L134,96" className="stroke-[#f59e0b]" strokeWidth="1" />
      <text x="78" y="110" className="fill-[#f59e0b]" fontSize="9" textAnchor="middle">chaîne carbonée</text>
      <text x="78" y="122" className="fill-[#f59e0b]" fontSize="9" textAnchor="middle">hydrophobe (lipophile)</text>
      <text x="152" y="110" className="fill-[#0db8d3]" fontSize="9" textAnchor="middle">tête</text>
      <text x="152" y="122" className="fill-[#0db8d3]" fontSize="9" textAnchor="middle">hydrophile</text>

      {/* separateur */}
      <line x1="208" y1="18" x2="208" y2="192" className={DASH} strokeWidth="1" strokeDasharray="4 4" />

      {/* --- partie droite : micelle autour d'une gouttelette de graisse --- */}
      <text x="304" y="20" className="fill-neutral-300 dark:fill-neutral-100" fontSize="10" textAnchor="middle">
        micelle
      </text>
      {/* gouttelette de graisse */}
      <circle cx="304" cy="106" r="28" className="fill-[#f59e0b]/25 stroke-[#f59e0b]" strokeWidth="1.4" />
      <text x="304" y="110" className="fill-[#f59e0b]" fontSize="9" textAnchor="middle">graisse</text>
      {/* 12 molecules de savon rayonnantes : queue vers l'interieur, tete vers l'eau */}
      <g>
        <line x1="304" y1="78" x2="304" y2="60" className="stroke-[#f59e0b]" strokeWidth="1.8" />
        <circle cx="304" cy="54" r="6" className="fill-[#0db8d3]/40 stroke-[#0db8d3]" strokeWidth="1.3" />
        <line x1="318" y1="82" x2="327" y2="67" className="stroke-[#f59e0b]" strokeWidth="1.8" />
        <circle cx="330" cy="62" r="6" className="fill-[#0db8d3]/40 stroke-[#0db8d3]" strokeWidth="1.3" />
        <line x1="328" y1="92" x2="345" y2="83" className="stroke-[#f59e0b]" strokeWidth="1.8" />
        <circle cx="350" cy="80" r="6" className="fill-[#0db8d3]/40 stroke-[#0db8d3]" strokeWidth="1.3" />
        <line x1="332" y1="106" x2="350" y2="106" className="stroke-[#f59e0b]" strokeWidth="1.8" />
        <circle cx="356" cy="106" r="6" className="fill-[#0db8d3]/40 stroke-[#0db8d3]" strokeWidth="1.3" />
        <line x1="328" y1="120" x2="345" y2="129" className="stroke-[#f59e0b]" strokeWidth="1.8" />
        <circle cx="350" cy="132" r="6" className="fill-[#0db8d3]/40 stroke-[#0db8d3]" strokeWidth="1.3" />
        <line x1="318" y1="130" x2="327" y2="145" className="stroke-[#f59e0b]" strokeWidth="1.8" />
        <circle cx="330" cy="150" r="6" className="fill-[#0db8d3]/40 stroke-[#0db8d3]" strokeWidth="1.3" />
        <line x1="304" y1="134" x2="304" y2="152" className="stroke-[#f59e0b]" strokeWidth="1.8" />
        <circle cx="304" cy="158" r="6" className="fill-[#0db8d3]/40 stroke-[#0db8d3]" strokeWidth="1.3" />
        <line x1="290" y1="130" x2="281" y2="145" className="stroke-[#f59e0b]" strokeWidth="1.8" />
        <circle cx="278" cy="150" r="6" className="fill-[#0db8d3]/40 stroke-[#0db8d3]" strokeWidth="1.3" />
        <line x1="280" y1="120" x2="263" y2="129" className="stroke-[#f59e0b]" strokeWidth="1.8" />
        <circle cx="258" cy="132" r="6" className="fill-[#0db8d3]/40 stroke-[#0db8d3]" strokeWidth="1.3" />
        <line x1="276" y1="106" x2="258" y2="106" className="stroke-[#f59e0b]" strokeWidth="1.8" />
        <circle cx="252" cy="106" r="6" className="fill-[#0db8d3]/40 stroke-[#0db8d3]" strokeWidth="1.3" />
        <line x1="280" y1="92" x2="263" y2="83" className="stroke-[#f59e0b]" strokeWidth="1.8" />
        <circle cx="258" cy="80" r="6" className="fill-[#0db8d3]/40 stroke-[#0db8d3]" strokeWidth="1.3" />
        <line x1="290" y1="82" x2="281" y2="67" className="stroke-[#f59e0b]" strokeWidth="1.8" />
        <circle cx="278" cy="62" r="6" className="fill-[#0db8d3]/40 stroke-[#0db8d3]" strokeWidth="1.3" />
      </g>
      <text x="304" y="186" className="fill-[#0db8d3]" fontSize="9" textAnchor="middle">
        têtes tournées vers l'eau
      </text>
      <text x="304" y="198" className="fill-[#f59e0b]" fontSize="9" textAnchor="middle">
        queues piégeant la graisse
      </text>
    </svg>
  ),

  // Profil energetique : effet du catalyseur sur l'energie d'activation
  "catalyse-profil": (
    <svg viewBox="0 0 400 230" className="w-full max-w-[520px] mx-auto h-auto">
      {/* axes */}
      <line x1="52" y1="196" x2="372" y2="196" className={AX} strokeWidth="1.5" />
      <line x1="52" y1="196" x2="52" y2="22" className={AX} strokeWidth="1.5" />
      <path d="M372,196 l-8,-4 l0,8 z" className="fill-neutral-400" />
      <path d="M52,22 l-4,8 l8,0 z" className="fill-neutral-400" />
      <text x="248" y="214" className="fill-neutral-400" fontSize="9.5">avancement de la réaction</text>
      <text x="14" y="30" className="fill-neutral-400" fontSize="10">E</text>

      {/* niveaux initial et final (identiques dans les deux cas) */}
      <line x1="52" y1="138" x2="372" y2="138" className={DASH} strokeWidth="1" strokeDasharray="4 4" />
      <line x1="52" y1="170" x2="372" y2="170" className={DASH} strokeWidth="1" strokeDasharray="4 4" />
      <text x="16" y="142" className="fill-neutral-400" fontSize="9">réactifs</text>
      <text x="14" y="174" className="fill-neutral-400" fontSize="9">produits</text>

      {/* chemin sans catalyseur : grande barriere */}
      <path d="M62,138 C120,138 130,44 196,44 C262,44 272,170 342,170"
            fill="none" className={CURVE} strokeWidth="2.2" />
      <text x="196" y="36" className="fill-[#0db8d3]" fontSize="9" textAnchor="middle">sans catalyseur</text>

      {/* chemin avec catalyseur : barriere abaissee */}
      <path d="M62,138 C112,138 124,84 196,84 C268,84 280,170 342,170"
            fill="none" className="stroke-[#10b981]" strokeWidth="2.2" strokeDasharray="6 4" />
      <text x="196" y="100" className="fill-[#10b981]" fontSize="9" textAnchor="middle">avec catalyseur</text>

      {/* energies d'activation */}
      <line x1="150" y1="138" x2="150" y2="48" className="stroke-neutral-400" strokeWidth="1" />
      <path d="M150,44 l-4,8 l8,0 z" className="fill-neutral-400" />
      <path d="M150,138 l-4,-8 l8,0 z" className="fill-neutral-400" />
      <text x="106" y="96" className="fill-[#0db8d3]" fontSize="9">Eₐ</text>
      <line x1="252" y1="138" x2="252" y2="88" className="stroke-[#10b981]" strokeWidth="1" />
      <path d="M252,84 l-4,8 l8,0 z" className="fill-[#10b981]" />
      <path d="M252,138 l-4,-8 l8,0 z" className="fill-[#10b981]" />
      <text x="258" y="116" className="fill-[#10b981]" fontSize="9">Eₐ′ &lt; Eₐ</text>

      <text x="60" y="228" className="fill-neutral-400" fontSize="8.5">
        mêmes niveaux de départ et d'arrivée → même état final, seule la vitesse change
      </text>
    </svg>
  ),

  // Zones de virage des indicateurs colorés sur l'échelle de pH
  "indicateurs-colores": (
    <svg viewBox="0 0 400 180" className="w-full max-w-[520px] mx-auto h-auto">
      <line x1="112" y1="150" x2="384" y2="150" className={AX} strokeWidth="1.4" />
      <line x1="112.0" y1="150" x2="112.0" y2="155" className="stroke-neutral-400" strokeWidth="1"/><text x="112.0" y="168" className="fill-neutral-400" fontSize="8" textAnchor="middle">0</text><line x1="150.9" y1="150" x2="150.9" y2="155" className="stroke-neutral-400" strokeWidth="1"/><text x="150.9" y="168" className="fill-neutral-400" fontSize="8" textAnchor="middle">2</text><line x1="189.7" y1="150" x2="189.7" y2="155" className="stroke-neutral-400" strokeWidth="1"/><text x="189.7" y="168" className="fill-neutral-400" fontSize="8" textAnchor="middle">4</text><line x1="228.6" y1="150" x2="228.6" y2="155" className="stroke-neutral-400" strokeWidth="1"/><text x="228.6" y="168" className="fill-neutral-400" fontSize="8" textAnchor="middle">6</text><line x1="267.4" y1="150" x2="267.4" y2="155" className="stroke-neutral-400" strokeWidth="1"/><text x="267.4" y="168" className="fill-neutral-400" fontSize="8" textAnchor="middle">8</text><line x1="306.3" y1="150" x2="306.3" y2="155" className="stroke-neutral-400" strokeWidth="1"/><text x="306.3" y="168" className="fill-neutral-400" fontSize="8" textAnchor="middle">10</text><line x1="345.1" y1="150" x2="345.1" y2="155" className="stroke-neutral-400" strokeWidth="1"/><text x="345.1" y="168" className="fill-neutral-400" fontSize="8" textAnchor="middle">12</text><line x1="384.0" y1="150" x2="384.0" y2="155" className="stroke-neutral-400" strokeWidth="1"/><text x="384.0" y="168" className="fill-neutral-400" fontSize="8" textAnchor="middle">14</text>
      <text x="380" y="168" className="fill-neutral-400" fontSize="9">pH</text>
      <rect x="112.0" y="42" width="60.2" height="18" fill="#ef4444"/><rect x="172.2" y="42" width="25.3" height="18" fill="#f97316"/><rect x="197.5" y="42" width="186.5" height="18" fill="#eab308"/>
      <text x="8" y="55" className="fill-neutral-400" fontSize="8.5">hélianthine</text>
      <rect x="112.0" y="74" width="116.6" height="18" fill="#eab308"/><rect x="228.6" y="74" width="31.1" height="18" fill="#22c55e"/><rect x="259.7" y="74" width="124.3" height="18" fill="#3b82f6"/>
      <text x="8" y="87" className="fill-neutral-400" fontSize="8.5">B.B.T.</text>
      <rect x="112.0" y="106" width="159.3" height="18" fill="#e5e7eb"/><rect x="271.3" y="106" width="35.0" height="18" fill="#f9a8d4"/><rect x="306.3" y="106" width="77.7" height="18" fill="#ec4899"/>
      <text x="8" y="119" className="fill-neutral-400" fontSize="8.5">phénolphtaléine</text>
      <text x="151" y="38" className="fill-neutral-400" fontSize="8">teinte acide</text>
      <text x="335" y="38" className="fill-neutral-400" fontSize="8">teinte basique</text>
    </svg>
  ),

  // Diagramme de prédominance d'un couple acide/base
  "predominance-acide-base": (
    <svg viewBox="0 0 380 160" className="w-full max-w-[480px] mx-auto h-auto">
      <rect x="50" y="46" width="150" height="44" className="fill-[#f59e0b]/12" />
      <rect x="200" y="46" width="150" height="44" className="fill-[#0db8d3]/12" />
      <line x1="40" y1="110" x2="360" y2="110" className={AX} strokeWidth="1.5" />
      <path d="M360,110 l-8,-4 l0,8 z" className="fill-neutral-400" />
      <text x="352" y="128" className="fill-neutral-400" fontSize="10">pH</text>
      <line x1="200" y1="34" x2="200" y2="118" className={DASH} strokeWidth="1.2" strokeDasharray="5 4" />
      <circle cx="200" cy="110" r="3" className="fill-[#10b981]" />
      <text x="200" y="30" className="fill-[#10b981]" fontSize="10" textAnchor="middle">pH = pKₐ</text>
      <text x="200" y="130" className="fill-[#10b981]" fontSize="9" textAnchor="middle">[AH] = [A⁻]</text>
      <text x="125" y="72" className="fill-[#f59e0b]" fontSize="11" textAnchor="middle">AH prédomine</text>
      <text x="125" y="86" className="fill-[#f59e0b]" fontSize="8.5" textAnchor="middle">(acide)</text>
      <text x="275" y="72" className="fill-[#0db8d3]" fontSize="11" textAnchor="middle">A⁻ prédomine</text>
      <text x="275" y="86" className="fill-[#0db8d3]" fontSize="8.5" textAnchor="middle">(base conjuguée)</text>
    </svg>
  ),

  // Dosage conductimétrique : rupture de pente à l'équivalence
  "dosage-conductimetrique": (
    <svg viewBox="0 0 360 200" className="w-full max-w-[470px] mx-auto h-auto">
      <line x1="46" y1="164" x2="340" y2="164" className={AX} strokeWidth="1.5" />
      <line x1="46" y1="24" x2="46" y2="174" className={AX} strokeWidth="1.5" />
      <line x1="46" y1="66" x2="180" y2="150" className={CURVE} strokeWidth="2.5" />
      <line x1="180" y1="150" x2="322" y2="70" className={CURVE} strokeWidth="2.5" />
      <circle cx="180" cy="150" r="4" fill="#f59e0b" />
      <line x1="180" y1="150" x2="180" y2="164" className={DASH} strokeWidth="1" strokeDasharray="3 3" />
      <text x="180" y="180" className="fill-[#f59e0b]" fontSize="10" textAnchor="middle">V_E</text>
      <text x="30" y="32" className="fill-neutral-400" fontSize="11">σ</text>
      <text x="330" y="180" className="fill-neutral-400" fontSize="11">V</text>
      <text x="180" y="52" className="fill-neutral-400" fontSize="9" textAnchor="middle">l'équivalence = intersection des deux droites</text>
    </svg>
  ),

  // Dosage pH-métrique : méthode de la dérivée (pic de dpH/dV à V_E)
  "dosage-derivee": (
    <svg viewBox="0 0 360 200" className="w-full max-w-[470px] mx-auto h-auto">
      <line x1="52" y1="176" x2="345" y2="176" className={AX} strokeWidth="1.4" />
      <line x1="52" y1="20" x2="52" y2="182" className={AX} strokeWidth="1.4" />
      <polyline points="52.0,158.0 53.6,158.0 55.3,158.0 56.9,158.0 58.5,158.0 60.2,158.0 61.8,158.0 63.4,158.0 65.1,158.0 66.7,158.0 68.4,158.0 70.0,158.0 71.6,158.0 73.3,158.0 74.9,158.0 76.5,157.9 78.2,157.9 79.8,157.9 81.4,157.9 83.1,157.9 84.7,157.9 86.3,157.9 88.0,157.9 89.6,157.9 91.2,157.8 92.9,157.8 94.5,157.8 96.2,157.8 97.8,157.7 99.4,157.7 101.1,157.7 102.7,157.6 104.3,157.6 106.0,157.5 107.6,157.5 109.2,157.4 110.9,157.4 112.5,157.3 114.1,157.2 115.8,157.2 117.4,157.1 119.0,157.0 120.7,156.9 122.3,156.7 124.0,156.6 125.6,156.5 127.2,156.3 128.9,156.1 130.5,155.9 132.1,155.7 133.8,155.4 135.4,155.2 137.0,154.9 138.7,154.6 140.3,154.2 141.9,153.8 143.6,153.4 145.2,152.9 146.8,152.4 148.5,151.9 150.1,151.3 151.8,150.6 153.4,149.9 155.0,149.1 156.7,148.2 158.3,147.3 159.9,146.2 161.6,145.1 163.2,143.9 164.8,142.6 166.5,141.2 168.1,139.7 169.7,138.1 171.4,136.4 173.0,134.5 174.6,132.6 176.3,130.5 177.9,128.3 179.6,126.0 181.2,123.6 182.8,121.1 184.5,118.4 186.1,115.7 187.7,112.9 189.4,110.0 191.0,107.0 192.6,104.0 194.3,101.0 195.9,97.9 197.5,94.9 199.2,91.8 200.8,88.8 202.4,85.8 204.1,82.9 205.7,80.0 207.4,77.2 209.0,74.5 210.6,71.9 212.3,69.4 213.9,67.0 215.5,64.7 217.2,62.5 218.8,60.4 220.4,58.5 222.1,56.7 223.7,55.0 225.3,53.4 227.0,51.9 228.6,50.5 230.2,49.3 231.9,48.1 233.5,47.0 235.2,46.0 236.8,45.1 238.4,44.2 240.1,43.4 241.7,42.7 243.3,42.0 245.0,41.4 246.6,40.9 248.2,40.4 249.9,39.9 251.5,39.5 253.1,39.1 254.8,38.8 256.4,38.5 258.0,38.2 259.7,37.9 261.3,37.7 263.0,37.5 264.6,37.3 266.2,37.1 267.9,36.9 269.5,36.8 271.1,36.7 272.8,36.5 274.4,36.4 276.0,36.3 277.7,36.3 279.3,36.2 280.9,36.1 282.6,36.0 284.2,36.0 285.8,35.9 287.5,35.9 289.1,35.8 290.8,35.8 292.4,35.7 294.0,35.7 295.7,35.7 297.3,35.7 298.9,35.6 300.6,35.6 302.2,35.6 303.8,35.6 305.5,35.6 307.1,35.5 308.7,35.5 310.4,35.5 312.0,35.5 313.6,35.5 315.3,35.5 316.9,35.5 318.6,35.5 320.2,35.5 321.8,35.5 323.5,35.5 325.1,35.4 326.7,35.4 328.4,35.4 330.0,35.4" fill="none" className={CURVE} strokeWidth="2.4" />
      <polyline points="52.0,175.9 53.6,175.9 55.3,175.9 56.9,175.9 58.5,175.9 60.2,175.9 61.8,175.9 63.4,175.8 65.1,175.8 66.7,175.8 68.4,175.8 70.0,175.8 71.6,175.7 73.3,175.7 74.9,175.7 76.5,175.6 78.2,175.6 79.8,175.6 81.4,175.5 83.1,175.5 84.7,175.4 86.3,175.3 88.0,175.3 89.6,175.2 91.2,175.1 92.9,175.0 94.5,174.9 96.2,174.8 97.8,174.7 99.4,174.6 101.1,174.4 102.7,174.2 104.3,174.1 106.0,173.8 107.6,173.6 109.2,173.4 110.9,173.1 112.5,172.8 114.1,172.5 115.8,172.1 117.4,171.7 119.0,171.3 120.7,170.8 122.3,170.2 124.0,169.6 125.6,169.0 127.2,168.3 128.9,167.5 130.5,166.6 132.1,165.7 133.8,164.6 135.4,163.5 137.0,162.2 138.7,160.9 140.3,159.4 141.9,157.7 143.6,156.0 145.2,154.0 146.8,151.9 148.5,149.7 150.1,147.2 151.8,144.5 153.4,141.7 155.0,138.6 156.7,135.3 158.3,131.7 159.9,128.0 161.6,124.0 163.2,119.8 164.8,115.3 166.5,110.7 168.1,105.9 169.7,100.9 171.4,95.7 173.0,90.5 174.6,85.2 176.3,79.9 177.9,74.6 179.6,69.4 181.2,64.5 182.8,59.7 184.5,55.2 186.1,51.2 187.7,47.5 189.4,44.4 191.0,41.9 192.6,39.9 194.3,38.6 195.9,38.0 197.5,38.1 199.2,38.8 200.8,40.3 202.4,42.3 204.1,45.0 205.7,48.2 207.4,51.9 209.0,56.1 210.6,60.6 212.3,65.4 213.9,70.5 215.5,75.7 217.2,80.9 218.8,86.2 220.4,91.5 222.1,96.8 223.7,101.9 225.3,106.8 227.0,111.6 228.6,116.2 230.2,120.6 231.9,124.8 233.5,128.7 235.2,132.5 236.8,136.0 238.4,139.2 240.1,142.3 241.7,145.1 243.3,147.7 245.0,150.1 246.6,152.4 248.2,154.4 249.9,156.3 251.5,158.1 253.1,159.7 254.8,161.1 256.4,162.5 258.0,163.7 259.7,164.8 261.3,165.9 263.0,166.8 264.6,167.6 266.2,168.4 267.9,169.1 269.5,169.8 271.1,170.3 272.8,170.9 274.4,171.3 276.0,171.8 277.7,172.2 279.3,172.5 280.9,172.9 282.6,173.2 284.2,173.4 285.8,173.7 287.5,173.9 289.1,174.1 290.8,174.3 292.4,174.4 294.0,174.6 295.7,174.7 297.3,174.8 298.9,174.9 300.6,175.0 302.2,175.1 303.8,175.2 305.5,175.3 307.1,175.4 308.7,175.4 310.4,175.5 312.0,175.5 313.6,175.6 315.3,175.6 316.9,175.6 318.6,175.7 320.2,175.7 321.8,175.7 323.5,175.8 325.1,175.8 326.7,175.8 328.4,175.8 330.0,175.8" fill="none" className="stroke-[#f59e0b]" strokeWidth="2" strokeDasharray="5 3" />
      <line x1="196.6" y1="26" x2="196.6" y2="176" className={DASH} strokeWidth="1" strokeDasharray="4 4" />
      <text x="196.6" y="192" className="fill-[#10b981]" fontSize="10" textAnchor="middle">V_E</text>
      <text x="36" y="30" className="fill-[#0db8d3]" fontSize="10">pH</text>
      <text x="336" y="190" className="fill-neutral-400" fontSize="11">V</text>
      <line x1="120" y1="46" x2="138" y2="46" className={CURVE} strokeWidth="2.4" />
      <text x="142" y="50" className="fill-neutral-400" fontSize="8.5">pH(V)</text>
      <line x1="210" y1="46" x2="228" y2="46" className="stroke-[#f59e0b]" strokeWidth="2" strokeDasharray="5 3" />
      <text x="232" y="50" className="fill-neutral-400" fontSize="8.5">dpH/dV (max en V_E)</text>
    </svg>
  ),

  // Établissement du courant dans une bobine — i(t) croît vers E/R
  "rl-etablissement": (
    <svg viewBox="0 0 340 200" className="w-full max-w-[440px] mx-auto h-auto">
      <line x1="40" y1="170" x2="320" y2="170" className={AX} strokeWidth="1.5" />
      <line x1="40" y1="20" x2="40" y2="180" className={AX} strokeWidth="1.5" />
      <line x1="40" y1="44" x2="320" y2="44" className={DASH} strokeWidth="1" strokeDasharray="5 4" />
      <path d="M40,170 C110,74 200,50 315,46" fill="none" className={CURVE} strokeWidth="2.5" />
      <text x="34" y="48" className="fill-neutral-400" fontSize="11" textAnchor="end">E/R</text>
      <text x="300" y="64" className="fill-[#0db8d3]" fontSize="11">i</text>
      <text x="312" y="185" className="fill-neutral-400" fontSize="11">t</text>
    </svg>
  ),

  // Oscillations libres amorties d'un circuit RLC (régime pseudo-périodique)
  "rlc-oscillation": (
    <svg viewBox="0 0 360 200" className="w-full max-w-[460px] mx-auto h-auto">
      <line x1="20" y1="100" x2="345" y2="100" className={AX} strokeWidth="1.5" />
      <line x1="30" y1="20" x2="30" y2="180" className={AX} strokeWidth="1.5" />
      <path d="M30,40 C55,40 60,150 85,150 C105,150 108,72 130,72 C150,72 152,128 172,128 C190,128 192,86 212,86 C230,86 232,114 252,114 C272,114 274,94 300,96 L340,100" fill="none" className={CURVE} strokeWidth="2.2" />
      <path d="M30,40 C120,40 240,90 340,98" fill="none" className={DASH} strokeWidth="1" strokeDasharray="4 4" />
      <text x="335" y="94" className="fill-neutral-400" fontSize="11">t</text>
      <text x="18" y="30" className="fill-neutral-400" fontSize="11">u<tspan fontSize="8" dy="2">C</tspan></text>
    </svg>
  ),

  /* ===================== SCIENCES DE L'INGÉNIEUR ===================== */

  // Chaîne d'énergie + chaîne d'information
  "si-chaine": (
    <svg viewBox="0 0 480 220" className="w-full max-w-[560px] mx-auto h-auto">
      <text x="240" y="16" className="fill-neutral-400" fontSize="11" textAnchor="middle" fontWeight="bold">Chaîne d&apos;énergie</text>
      {["Alimenter", "Distribuer", "Convertir", "Transmettre"].map((t, i) => (
        <g key={t}>
          <rect x={8 + i * 118} y="28" width="100" height="42" rx="8" className="fill-[#0db8d3]/12 stroke-[#0db8d3]" strokeWidth="1.5" />
          <text x={58 + i * 118} y="53" className="fill-neutral-600 dark:fill-neutral-200" fontSize="11" textAnchor="middle">{t}</text>
          {i < 3 && <line x1={108 + i * 118} y1="49" x2={126 + i * 118} y2="49" className="stroke-neutral-400" strokeWidth="1.5" markerEnd="url(#a3)" />}
        </g>
      ))}
      <text x="240" y="118" className="fill-neutral-400" fontSize="11" textAnchor="middle" fontWeight="bold">Chaîne d&apos;information</text>
      {["Acquérir", "Traiter", "Communiquer"].map((t, i) => (
        <g key={t}>
          <rect x={40 + i * 140} y="130" width="118" height="42" rx="8" className="fill-[#10b981]/12 stroke-[#10b981]" strokeWidth="1.5" />
          <text x={99 + i * 140} y="155" className="fill-neutral-600 dark:fill-neutral-200" fontSize="11" textAnchor="middle">{t}</text>
          {i < 2 && <line x1={158 + i * 140} y1="151" x2={180 + i * 140} y2="151" className="stroke-neutral-400" strokeWidth="1.5" markerEnd="url(#a3)" />}
        </g>
      ))}
      <text x="240" y="200" className="fill-neutral-400" fontSize="10" textAnchor="middle">PC (commande) ↔ PO (opérative)</text>
      <defs><marker id="a3" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" className="fill-neutral-400" /></marker></defs>
    </svg>
  ),

  // GRAFCET — étapes, transitions, réceptivités
  "si-grafcet": (
    <svg viewBox="0 0 260 240" className="w-full max-w-[300px] mx-auto h-auto">
      <rect x="80" y="14" width="44" height="30" className="fill-[#0db8d3]/12 stroke-[#0db8d3]" strokeWidth="2" />
      <rect x="85" y="19" width="34" height="20" fill="none" className="stroke-[#0db8d3]" strokeWidth="1" />
      <text x="102" y="34" className="fill-neutral-500" fontSize="12" textAnchor="middle">1</text>
      <line x1="102" y1="44" x2="102" y2="74" className="stroke-neutral-400" strokeWidth="1.5" />
      <line x1="86" y1="74" x2="118" y2="74" className="stroke-neutral-400" strokeWidth="2" />
      <text x="128" y="78" className="fill-neutral-400" fontSize="11">m · départ</text>
      <line x1="102" y1="74" x2="102" y2="94" className="stroke-neutral-400" strokeWidth="1.5" />
      <rect x="80" y="94" width="44" height="30" fill="none" className="stroke-neutral-400" strokeWidth="1.5" />
      <text x="102" y="114" className="fill-neutral-500" fontSize="12" textAnchor="middle">2</text>
      <line x1="124" y1="109" x2="150" y2="109" className="stroke-neutral-400" strokeWidth="1" />
      <rect x="150" y="98" width="90" height="22" rx="3" className="fill-[#10b981]/12 stroke-[#10b981]" strokeWidth="1.2" />
      <text x="195" y="113" className="fill-neutral-500" fontSize="10" textAnchor="middle">Action A</text>
      <line x1="102" y1="124" x2="102" y2="150" className="stroke-neutral-400" strokeWidth="1.5" />
      <line x1="86" y1="150" x2="118" y2="150" className="stroke-neutral-400" strokeWidth="2" />
      <text x="128" y="154" className="fill-neutral-400" fontSize="11">fin de course</text>
      <line x1="102" y1="150" x2="102" y2="170" className="stroke-neutral-400" strokeWidth="1.5" />
      <rect x="80" y="170" width="44" height="30" fill="none" className="stroke-neutral-400" strokeWidth="1.5" />
      <text x="102" y="190" className="fill-neutral-500" fontSize="12" textAnchor="middle">3</text>
    </svg>
  ),

  // Système asservi — boucle fermée
  "si-asservissement": (
    <svg viewBox="0 0 480 180" className="w-full max-w-[560px] mx-auto h-auto">
      <text x="12" y="66" className="fill-neutral-400" fontSize="11">consigne</text>
      <line x1="60" y1="70" x2="88" y2="70" className="stroke-neutral-400" strokeWidth="1.5" markerEnd="url(#a4)" />
      <circle cx="100" cy="70" r="14" fill="none" className="stroke-[#0db8d3]" strokeWidth="1.6" />
      <text x="100" y="66" className="fill-[#0db8d3]" fontSize="12" textAnchor="middle">−</text>
      <text x="90" y="60" className="fill-neutral-400" fontSize="10">+</text>
      <line x1="114" y1="70" x2="142" y2="70" className="stroke-neutral-400" strokeWidth="1.5" markerEnd="url(#a4)" />
      <rect x="142" y="52" width="88" height="36" rx="6" className="fill-[#0db8d3]/12 stroke-[#0db8d3]" strokeWidth="1.5" />
      <text x="186" y="74" className="fill-neutral-600 dark:fill-neutral-200" fontSize="11" textAnchor="middle">Correcteur</text>
      <line x1="230" y1="70" x2="258" y2="70" className="stroke-neutral-400" strokeWidth="1.5" markerEnd="url(#a4)" />
      <rect x="258" y="52" width="88" height="36" rx="6" className="fill-[#0db8d3]/12 stroke-[#0db8d3]" strokeWidth="1.5" />
      <text x="302" y="74" className="fill-neutral-600 dark:fill-neutral-200" fontSize="11" textAnchor="middle">Système</text>
      <line x1="346" y1="70" x2="430" y2="70" className="stroke-neutral-400" strokeWidth="1.5" markerEnd="url(#a4)" />
      <text x="436" y="66" className="fill-neutral-400" fontSize="11">sortie</text>
      <line x1="388" y1="70" x2="388" y2="130" className="stroke-neutral-400" strokeWidth="1.5" />
      <rect x="300" y="112" width="88" height="34" rx="6" className="fill-[#10b981]/12 stroke-[#10b981]" strokeWidth="1.5" />
      <text x="344" y="133" className="fill-neutral-600 dark:fill-neutral-200" fontSize="11" textAnchor="middle">Capteur</text>
      <line x1="300" y1="129" x2="100" y2="129" className="stroke-neutral-400" strokeWidth="1.5" />
      <line x1="100" y1="129" x2="100" y2="84" className="stroke-neutral-400" strokeWidth="1.5" markerEnd="url(#a4)" />
      <defs><marker id="a4" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" className="fill-neutral-400" /></marker></defs>
    </svg>
  ),

  // Pendule élastique horizontal (masse-ressort)
  "pendule-elastique": (
    <svg viewBox="0 0 360 130" className="w-full max-w-[460px] mx-auto h-auto">
      <line x1="20" y1="30" x2="20" y2="110" className="stroke-neutral-500" strokeWidth="3" />
      <path d="M20,70 q10,-12 20,0 t20,0 t20,0 t20,0 t20,0" fill="none" className="stroke-neutral-400" strokeWidth="1.6" />
      <rect x="160" y="52" width="46" height="36" rx="4" className="fill-[#0db8d3]/30 stroke-[#0db8d3]" strokeWidth="1.6" />
      <line x1="30" y1="110" x2="345" y2="110" className={AX} strokeWidth="1.5" />
      <line x1="183" y1="95" x2="183" y2="120" className={DASH} strokeWidth="1" strokeDasharray="3 3" />
      <text x="183" y="132" className="fill-neutral-400" fontSize="10" textAnchor="middle">x=0</text>
      <text x="183" y="46" className="fill-neutral-400" fontSize="10" textAnchor="middle">m</text>
    </svg>
  ),

  /* ===================== SVT — géologie & biologie (schémas originaux) ===================== */

  // Dorsale océanique — expansion et symétrie des anomalies magnétiques
  "svt-dorsale": (
    <svg viewBox="0 0 400 190" className="w-full max-w-[520px] mx-auto h-auto">
      <rect x="0" y="90" width="400" height="70" className="fill-[#0db8d3]/10" />
      <path d="M180,90 L200,60 L220,90 Z" className="fill-[#f59e0b]/40 stroke-[#f59e0b]" strokeWidth="1.2" />
      <line x1="200" y1="60" x2="200" y2="30" className="stroke-[#f59e0b]" strokeWidth="1.5" strokeDasharray="3 3" />
      <text x="200" y="24" className="fill-[#f59e0b]" fontSize="10" textAnchor="middle">dorsale</text>
      <line x1="60" y1="150" x2="150" y2="150" className="stroke-[#10b981]" strokeWidth="2" markerEnd="url(#svtL)" />
      <line x1="340" y1="150" x2="250" y2="150" className="stroke-[#10b981]" strokeWidth="2" markerEnd="url(#svtR)" />
      {[110, 140, 260, 290].map((x, i) => <rect key={i} x={x} y="95" width="18" height="55" className={i % 2 ? "fill-neutral-500/50" : "fill-neutral-400/30"} />)}
      <text x="110" y="180" className="fill-neutral-400" fontSize="9">plus vieux</text>
      <text x="300" y="180" className="fill-neutral-400" fontSize="9" textAnchor="end">plus vieux</text>
      <text x="200" y="180" className="fill-neutral-400" fontSize="9" textAnchor="middle">récent</text>
      <defs>
        <marker id="svtL" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" className="fill-[#10b981]" /></marker>
        <marker id="svtR" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" className="fill-[#10b981]" /></marker>
      </defs>
    </svg>
  ),

  // Zone de subduction — fosse, plan de Bénioff, volcanisme
  "svt-subduction": (
    <svg viewBox="0 0 400 200" className="w-full max-w-[520px] mx-auto h-auto">
      <rect x="0" y="70" width="200" height="90" className="fill-[#0db8d3]/15" />
      <rect x="200" y="60" width="200" height="100" className="fill-[#f59e0b]/15" />
      <path d="M200,70 L210,80 L230,110 L255,150 L280,190" fill="none" className="stroke-neutral-500" strokeWidth="8" strokeLinecap="round" />
      <path d="M185,70 L200,70 L195,86 Z" className="fill-neutral-600" />
      <text x="180" y="64" className="fill-neutral-400" fontSize="9" textAnchor="end">fosse</text>
      <path d="M250,60 L258,45 L266,60 Z" className="fill-[#f59e0b]/60 stroke-[#f59e0b]" strokeWidth="1" />
      <text x="258" y="40" className="fill-[#f59e0b]" fontSize="9" textAnchor="middle">volcan</text>
      {[[218,92],[236,116],[252,140],[268,166]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" className="fill-red-500/70" />)}
      <text x="300" y="150" className="fill-neutral-400" fontSize="9">plan de Bénioff</text>
      <text x="90" y="150" className="fill-neutral-400" fontSize="9" textAnchor="middle">océanique</text>
      <text x="320" y="80" className="fill-neutral-400" fontSize="9" textAnchor="middle">continent</text>
    </svg>
  ),

  // Les trois types de chaines de montagnes recentes
  "svt-chaines-types": (
    <svg viewBox="0 0 400 382" className="w-full max-w-[520px] mx-auto h-auto">
      <text x="200" y="14" className="fill-neutral-300 dark:fill-neutral-100" fontSize="10" textAnchor="middle">les trois types de chaînes de montagnes récentes</text>

      {/* ================= 1 · SUBDUCTION ================= */}
      <text x="12" y="32" className="fill-[#f59e0b]" fontSize="9.5">1 · SUBDUCTION</text>
      <text x="112" y="32" className="fill-neutral-400" fontSize="8.5">océanique sous continentale — Andes</text>
      <rect x="12" y="62" width="176" height="52" className="fill-[#0db8d3]/14" />
      <rect x="188" y="54" width="200" height="60" className="fill-[#f59e0b]/14" />
      {/* plaque plongeante */}
      <path d="M188,62 L200,74 L226,98 L250,120" fill="none" className="stroke-neutral-500" strokeWidth="7" strokeLinecap="round" />
      {/* fosse */}
      <path d="M176,62 L188,62 L183,74 Z" className="fill-neutral-600" />
      <text x="172" y="58" className="fill-neutral-400" fontSize="7.5" textAnchor="end">fosse</text>
      {/* volcan */}
      <path d="M312,54 L320,42 L328,54 Z" className="fill-[#f59e0b]/60 stroke-[#f59e0b]" strokeWidth="1" />
      <text x="320" y="38" className="fill-[#f59e0b]" fontSize="7.5" textAnchor="middle">volcanisme andésitique</text>
      {/* prisme d'accretion */}
      <path d="M188,62 L208,57 L200,68 Z" className="fill-[#10b981]/55 stroke-[#10b981]" strokeWidth="0.9" />
      <text x="146" y="80" className="fill-[#10b981]" fontSize="7.5" textAnchor="end">prisme d&apos;accrétion</text>
      <line x1="150" y1="77" x2="192" y2="64" className="stroke-[#10b981]" strokeWidth="0.7" />
      {/* foyers sismiques */}
      <circle cx="206" cy="80" r="2.2" className="fill-red-500/85" />
      <circle cx="224" cy="100" r="2.2" className="fill-red-500/85" />
      <circle cx="240" cy="116" r="2.2" className="fill-red-500/85" />
      <text x="262" y="120" className="fill-neutral-400" fontSize="7.5">plan de Bénioff</text>
      <line x1="246" y1="116" x2="260" y2="117" className="stroke-neutral-400" strokeWidth="0.7" />
      <text x="95" y="106" className="fill-[#0db8d3]" fontSize="7.5" textAnchor="middle">lithosphère océanique</text>
      <text x="320" y="104" className="fill-[#f59e0b]" fontSize="7.5" textAnchor="middle">lithosphère continentale</text>

      {/* ================= 2 · OBDUCTION ================= */}
      <text x="12" y="152" className="fill-[#f59e0b]" fontSize="9.5">2 · OBDUCTION</text>
      <text x="112" y="152" className="fill-neutral-400" fontSize="8.5">océanique SUR continentale — Oman</text>
      <text x="215" y="170" className="fill-neutral-400" fontSize="7.5" textAnchor="middle">nappes de charriage</text>
      <rect x="12" y="176" width="376" height="52" className="fill-[#f59e0b]/14" />
      <path d="M120,176 L300,176 L330,196 L120,196 Z" className="fill-[#10b981]/35 stroke-[#10b981]" strokeWidth="1.3" />
      <text x="215" y="190" className="fill-[#10b981]" fontSize="8" textAnchor="middle">complexe ophiolitique</text>
      <line x1="72" y1="206" x2="110" y2="206" className="stroke-[#10b981]" strokeWidth="1.4" />
      <path d="M116,206 l-8,-4 l0,8 z" className="fill-[#10b981]" />
      <text x="68" y="209" className="fill-[#10b981]" fontSize="7.5" textAnchor="end">chevauchement</text>
      <text x="240" y="220" className="fill-[#f59e0b]" fontSize="7.5" textAnchor="middle">socle continental autochtone</text>

      {/* ================= 3 · COLLISION ================= */}
      <text x="12" y="254" className="fill-[#f59e0b]" fontSize="9.5">3 · COLLISION</text>
      <text x="112" y="254" className="fill-neutral-400" fontSize="8.5">continentale contre continentale — Alpes</text>
      <text x="368" y="272" className="fill-[#f59e0b]" fontSize="8" textAnchor="end">relief · surrection</text>
      <rect x="12" y="290" width="188" height="54" className="fill-[#f59e0b]/14" />
      <rect x="200" y="290" width="188" height="54" className="fill-[#0db8d3]/14" />
      <path d="M140,290 L170,268 L200,258 L232,270 L262,290 Z" className="fill-[#f59e0b]/30 stroke-[#f59e0b]" strokeWidth="1.2" />
      <line x1="266" y1="276" x2="300" y2="270" className="stroke-[#f59e0b]" strokeWidth="0.7" />
      {/* suture ophiolitique */}
      <path d="M196,290 L208,290 L214,320 L202,320 Z" className="fill-[#10b981]/60 stroke-[#10b981]" strokeWidth="1" />
      <text x="300" y="312" className="fill-[#10b981]" fontSize="7.5">suture ophiolitique</text>
      <line x1="218" y1="310" x2="296" y2="310" className="stroke-[#10b981]" strokeWidth="0.8" />
      {/* racine crustale */}
      <path d="M150,344 C170,362 230,362 250,344" fill="none" className="stroke-[#f59e0b]" strokeWidth="1.6" strokeDasharray="5 3" />
      <text x="200" y="376" className="fill-[#f59e0b]" fontSize="7.5" textAnchor="middle">racine crustale — Moho enfoncé</text>
      {/* contraintes */}
      <line x1="40" y1="322" x2="76" y2="322" className="stroke-neutral-400" strokeWidth="1.4" />
      <path d="M82,322 l-8,-4 l0,8 z" className="fill-neutral-400" />
      <line x1="360" y1="322" x2="324" y2="322" className="stroke-neutral-400" strokeWidth="1.4" />
      <path d="M318,322 l8,-4 l0,8 z" className="fill-neutral-400" />
      <text x="40" y="338" className="fill-neutral-400" fontSize="7.5">compression</text>
      <text x="360" y="338" className="fill-neutral-400" fontSize="7.5" textAnchor="end">compression</text>
    </svg>
  ),

  // Coupe d'une chaine de collision
  "svt-collision": (
    <svg viewBox="0 0 400 290" className="w-full max-w-[520px] mx-auto h-auto">
      <text x="200" y="14" className="fill-neutral-300 dark:fill-neutral-100" fontSize="10" textAnchor="middle">coupe d&apos;une chaîne de collision</text>
      <text x="200" y="30" className="fill-[#f59e0b]" fontSize="8.5" textAnchor="middle">reliefs élevés</text>

      {/* croute continentale epaissie */}
      <rect x="8" y="78" width="384" height="90" className="fill-[#f59e0b]/12" />
      {/* relief */}
      <path d="M96,78 L128,54 L152,62 L180,38 L214,50 L244,42 L276,66 L308,78 Z"
            className="fill-[#f59e0b]/28 stroke-[#f59e0b]" strokeWidth="1.3" />

      {/* manteau */}
      <rect x="8" y="168" width="384" height="72" className="fill-[#0db8d3]/10" />
      <text x="386" y="190" className="fill-[#0db8d3]" fontSize="8" textAnchor="end">manteau</text>

      {/* Moho et racine crustale */}
      <path d="M8,168 L104,168 C146,168 156,216 200,216 C244,216 254,168 296,168 L392,168"
            fill="none" className="stroke-[#f59e0b]" strokeWidth="1.8" strokeDasharray="6 3" />
      <text x="14" y="164" className="fill-[#f59e0b]" fontSize="8">Moho</text>
      <text x="200" y="234" className="fill-[#f59e0b]" fontSize="8" textAnchor="middle">racine crustale — Moho enfoncé</text>

      {/* plaques */}
      <text x="14" y="92" className="fill-[#f59e0b]" fontSize="8">plaque continentale 1</text>
      <text x="386" y="92" className="fill-[#f59e0b]" fontSize="8" textAnchor="end">plaque continentale 2</text>

      {/* nappes de charriage : ecailles empilees */}
      <path d="M30,106 L124,98 L132,112 L38,120 Z" className="fill-neutral-400/22 stroke-neutral-500" strokeWidth="1" />
      <path d="M40,124 L134,116 L142,130 L48,138 Z" className="fill-neutral-400/22 stroke-neutral-500" strokeWidth="1" />
      <text x="30" y="152" className="fill-neutral-400" fontSize="8">nappes de charriage</text>

      {/* suture ophiolitique */}
      <path d="M192,78 L208,78 L216,124 L200,124 Z" className="fill-[#10b981]/55 stroke-[#10b981]" strokeWidth="1.2" />
      <line x1="216" y1="120" x2="234" y2="152" className="stroke-[#10b981]" strokeWidth="0.8" />
      <text x="238" y="156" className="fill-[#10b981]" fontSize="8">suture ophiolitique</text>
      <text x="238" y="166" className="fill-neutral-400" fontSize="7.5">reste de l&apos;océan disparu</text>

      {/* plis */}
      <path d="M250,112 Q272,92 294,112 T338,112" fill="none" className="stroke-neutral-500" strokeWidth="1.5" />
      <path d="M250,126 Q272,106 294,126 T338,126" fill="none" className="stroke-neutral-500" strokeWidth="1.2" />
      <line x1="344" y1="104" x2="356" y2="100" className="stroke-neutral-400" strokeWidth="0.8" />
      <text x="392" y="102" className="fill-neutral-400" fontSize="8" textAnchor="end">plis</text>

      {/* faille inverse */}
      <line x1="296" y1="146" x2="342" y2="112" className="stroke-neutral-400" strokeWidth="1.5" />
      <path d="M330,120 l5,-9 l6,6 z" className="fill-neutral-400" />
      <text x="392" y="140" className="fill-neutral-400" fontSize="8" textAnchor="end">faille inverse</text>
      <line x1="346" y1="130" x2="340" y2="136" className="stroke-neutral-400" strokeWidth="0.8" />

      <text x="8" y="266" className="fill-neutral-400" fontSize="8">Raccourcissement et empilement ⇒ épaississement de la croûte ⇒ surrection.</text>
      <text x="8" y="280" className="fill-[#10b981]" fontSize="8">La suture ophiolitique prouve qu&apos;un océan a été fermé par subduction avant la collision.</text>
    </svg>
  ),

  // Diagramme P-T : facies metamorphiques et gradients
  // Echelles : x = 60 + 0,34 * T(degC)   |   y = 33 + 2,467 * profondeur(km)
  "svt-facies-metamorphiques": (
    <svg viewBox="0 0 420 336" className="w-full max-w-[560px] mx-auto h-auto">
      <text x="210" y="14" className="fill-neutral-300 dark:fill-neutral-100" fontSize="10" textAnchor="middle">faciès métamorphiques et gradients (diagramme P–T)</text>

      {/* ---- champs de facies (T 500-900 degC, 0-8 km) ---- */}
      <rect x="230" y="28" width="136" height="26" rx="3" className="fill-[#f59e0b]/18 stroke-[#f59e0b]" strokeWidth="0.9" />
      <text x="298" y="41" className="fill-[#f59e0b]" fontSize="7.5" textAnchor="middle">cornéennes (contact)</text>

      <rect x="162" y="58" width="68" height="61" rx="3" className="fill-[#10b981]/18 stroke-[#10b981]" strokeWidth="0.9" />
      <text x="196" y="84" className="fill-[#10b981]" fontSize="8" textAnchor="middle">schistes</text>
      <text x="196" y="95" className="fill-[#10b981]" fontSize="8" textAnchor="middle">verts</text>

      <rect x="230" y="70" width="68" height="74" rx="3" className="fill-[#10b981]/12 stroke-[#10b981]" strokeWidth="0.9" />
      <text x="264" y="104" className="fill-[#10b981]" fontSize="8" textAnchor="middle">amphibolites</text>

      <rect x="298" y="82" width="68" height="74" rx="3" className="fill-[#f59e0b]/12 stroke-[#f59e0b]" strokeWidth="0.9" />
      <text x="340" y="146" className="fill-[#f59e0b]" fontSize="8" textAnchor="middle">granulites</text>

      <rect x="128" y="107" width="68" height="74" rx="3" className="fill-[#0db8d3]/20 stroke-[#0db8d3]" strokeWidth="0.9" />
      <text x="186" y="120" className="fill-[#0db8d3]" fontSize="8" textAnchor="middle">schistes</text>
      <text x="186" y="131" className="fill-[#0db8d3]" fontSize="8" textAnchor="middle">bleus</text>

      <rect x="196" y="169" width="102" height="86" rx="3" className="fill-[#0db8d3]/14 stroke-[#0db8d3]" strokeWidth="0.9" />
      <text x="247" y="216" className="fill-[#0db8d3]" fontSize="8" textAnchor="middle">éclogites</text>

      {/* ---- axes ---- */}
      <line x1="60" y1="262" x2="410" y2="262" className={AX} strokeWidth="1.4" />
      <line x1="60" y1="262" x2="60" y2="28" className={AX} strokeWidth="1.4" />
      <text x="60" y="24" className="fill-neutral-400" fontSize="8" textAnchor="middle">0</text>
      <text x="410" y="292" className="fill-neutral-400" fontSize="9" textAnchor="end">température (°C)</text>
      <text x="8" y="142" className="fill-neutral-400" fontSize="8">profondeur</text>
      <text x="8" y="153" className="fill-neutral-400" fontSize="8">(km) · P ↑</text>

      <line x1="128" y1="262" x2="128" y2="266" className={AX} strokeWidth="1" />
      <text x="128" y="276" className="fill-neutral-400" fontSize="8" textAnchor="middle">200</text>
      <line x1="196" y1="262" x2="196" y2="266" className={AX} strokeWidth="1" />
      <text x="196" y="276" className="fill-neutral-400" fontSize="8" textAnchor="middle">400</text>
      <line x1="264" y1="262" x2="264" y2="266" className={AX} strokeWidth="1" />
      <text x="264" y="276" className="fill-neutral-400" fontSize="8" textAnchor="middle">600</text>
      <line x1="332" y1="262" x2="332" y2="266" className={AX} strokeWidth="1" />
      <text x="332" y="276" className="fill-neutral-400" fontSize="8" textAnchor="middle">800</text>

      <line x1="56" y1="107" x2="60" y2="107" className={AX} strokeWidth="1" />
      <text x="52" y="110" className="fill-neutral-400" fontSize="8" textAnchor="end">30</text>
      <line x1="56" y1="181" x2="60" y2="181" className={AX} strokeWidth="1" />
      <text x="52" y="184" className="fill-neutral-400" fontSize="8" textAnchor="end">60</text>
      <line x1="56" y1="255" x2="60" y2="255" className={AX} strokeWidth="1" />
      <text x="52" y="258" className="fill-neutral-400" fontSize="8" textAnchor="end">90</text>

      {/* ---- gradients, tous issus de l'origine (60,33) ---- */}
      {/* HP-BT : environ 6 degC/km — traverse schistes bleus puis eclogites */}
      <line x1="60" y1="33" x2="244" y2="255" className="stroke-[#0db8d3]" strokeWidth="2.2" />
      <line x1="150" y1="222" x2="186" y2="222" className="stroke-[#0db8d3]" strokeWidth="0.8" />
      <text x="146" y="219" className="fill-[#0db8d3]" fontSize="8.5" textAnchor="end">HP–BT</text>
      <text x="146" y="231" className="fill-[#0db8d3]" fontSize="7.5" textAnchor="end">subduction</text>

      {/* MP-HT : environ 25 degC/km — traverse schistes verts puis amphibolites */}
      <line x1="60" y1="33" x2="400" y2="132" className="stroke-[#10b981]" strokeWidth="2.2" />
      <line x1="330" y1="74" x2="346" y2="104" className="stroke-[#10b981]" strokeWidth="0.8" />
      <text x="326" y="70" className="fill-[#10b981]" fontSize="8.5" textAnchor="middle">MP–HT · collision</text>

      {/* BP-HT : environ 100 degC/km — reste dans les cornéennes */}
      <line x1="60" y1="33" x2="400" y2="58" className="stroke-[#f59e0b]" strokeWidth="2.2" />
      <line x1="128" y1="64" x2="140" y2="44" className="stroke-[#f59e0b]" strokeWidth="0.8" />
      <text x="110" y="74" className="fill-[#f59e0b]" fontSize="8.5" textAnchor="middle">BP–HT</text>
      <text x="110" y="85" className="fill-[#f59e0b]" fontSize="7.5" textAnchor="middle">contact</text>

      {/* ---- solidus : debut de fusion = anatexie ---- */}
      <path d="M312,28 C298,80 302,140 330,200" fill="none" className="stroke-red-500" strokeWidth="1.6" strokeDasharray="5 3" />
      <text x="412" y="222" className="fill-red-500" fontSize="8" textAnchor="end">solidus</text>
      <text x="412" y="234" className="fill-red-500" fontSize="7.5" textAnchor="end">au-delà : ANATEXIE</text>
      <line x1="336" y1="218" x2="360" y2="218" className="stroke-red-500" strokeWidth="0.8" />

      {/* ---- mineraux index ---- */}
      <text x="8" y="306" className="fill-[#0db8d3]" fontSize="8">HP–BT : glaucophane, puis grenat + jadéite — n&apos;aboutit jamais à l&apos;anatexie.</text>
      <text x="8" y="320" className="fill-[#10b981]" fontSize="8">MP–HT : chlorite → biotite → grenat → disthène → sillimanite — peut atteindre l&apos;anatexie.</text>
      <text x="8" y="334" className="fill-[#f59e0b]" fontSize="8">BP–HT : andalousite puis sillimanite — auréole de contact autour d&apos;un pluton.</text>
    </svg>
  ),

  // Fusion partielle de la peridotite hydratee (zone de subduction)
  // Echelle : x = 62 + 0,176 * T(degC)   |   y = 34 + 0,75 * profondeur(km)
  "svt-solidus-peridotite": (
    <svg viewBox="0 0 400 284" className="w-full max-w-[520px] mx-auto h-auto">
      <text x="200" y="14" className="fill-neutral-300 dark:fill-neutral-100" fontSize="10" textAnchor="middle">pourquoi la péridotite fond dans une zone de subduction</text>

      {/* axes */}
      <line x1="62" y1="214" x2="380" y2="214" className={AX} strokeWidth="1.4" />
      <line x1="62" y1="214" x2="62" y2="34" className={AX} strokeWidth="1.4" />
      <text x="378" y="248" className="fill-neutral-400" fontSize="9" textAnchor="end">température (°C)</text>
      <text x="8" y="118" className="fill-neutral-400" fontSize="8.5">profondeur</text>
      <text x="8" y="129" className="fill-neutral-400" fontSize="8.5">(km)</text>
      <text x="62" y="30" className="fill-neutral-400" fontSize="8" textAnchor="middle">0</text>
      <line x1="150" y1="214" x2="150" y2="218" className={AX} strokeWidth="1" />
      <text x="150" y="228" className="fill-neutral-400" fontSize="8" textAnchor="middle">500</text>
      <line x1="238" y1="214" x2="238" y2="218" className={AX} strokeWidth="1" />
      <text x="238" y="228" className="fill-neutral-400" fontSize="8" textAnchor="middle">1000</text>
      <line x1="326" y1="214" x2="326" y2="218" className={AX} strokeWidth="1" />
      <text x="326" y="228" className="fill-neutral-400" fontSize="8" textAnchor="middle">1500</text>
      <line x1="58" y1="94" x2="62" y2="94" className={AX} strokeWidth="1" />
      <text x="54" y="97" className="fill-neutral-400" fontSize="8" textAnchor="end">80</text>
      <line x1="58" y1="154" x2="62" y2="154" className={AX} strokeWidth="1" />
      <text x="54" y="157" className="fill-neutral-400" fontSize="8" textAnchor="end">160</text>
      <line x1="58" y1="214" x2="62" y2="214" className={AX} strokeWidth="1" />
      <text x="54" y="217" className="fill-neutral-400" fontSize="8" textAnchor="end">240</text>

      {/* solidus sec : jamais atteint */}
      <path d="M272,34 C294,90 312,150 330,212" fill="none" className="stroke-[#f59e0b]" strokeWidth="2" />
      <text x="392" y="64" className="fill-[#f59e0b]" fontSize="8" textAnchor="end">solidus SEC</text>
      <text x="392" y="75" className="fill-[#f59e0b]" fontSize="7.5" textAnchor="end">péridotite anhydre</text>

      {/* solidus humide : decale vers les basses temperatures */}
      <path d="M214,34 C206,90 210,150 230,212" fill="none" className="stroke-[#10b981]" strokeWidth="2" strokeDasharray="6 4" />
      <text x="248" y="52" className="fill-[#10b981]" fontSize="8">solidus HUMIDE</text>
      <text x="248" y="63" className="fill-[#10b981]" fontSize="7.5">péridotite hydratée</text>

      {/* geotherme de la zone de subduction */}
      <path d="M64,34 C120,84 176,150 250,206" fill="none" className={CURVE} strokeWidth="2.2" />
      <text x="170" y="180" className="fill-[#0db8d3]" fontSize="8" textAnchor="end">géotherme de la</text>
      <text x="170" y="191" className="fill-[#0db8d3]" fontSize="8" textAnchor="end">zone de subduction</text>

      {/* point de croisement : debut de fusion */}
      <circle cx="222" cy="184" r="8" fill="none" className="stroke-red-500" strokeWidth="1.8" />
      <line x1="232" y1="182" x2="276" y2="168" className="stroke-red-500" strokeWidth="0.9" />
      <text x="280" y="170" className="fill-red-500" fontSize="8.5">fusion partielle</text>

      <text x="8" y="266" className="fill-neutral-400" fontSize="8">Le géotherme reste toujours à gauche du solidus SEC : une péridotite sèche ne fond pas.</text>
      <text x="8" y="278" className="fill-[#10b981]" fontSize="8">L&apos;eau libérée par la plaque plongeante abaisse le solidus ⇒ il est coupé ⇒ magma andésitique.</text>
    </svg>
  ),

  // Granite d'anatexie : gneiss -> migmatite -> granite
  "svt-granite-anatexie": (
    <svg viewBox="0 0 400 296" className="w-full max-w-[520px] mx-auto h-auto">
      <text x="200" y="14" className="fill-neutral-300 dark:fill-neutral-100" fontSize="10" textAnchor="middle">le granite d&apos;anatexie — la racine d&apos;une chaîne de collision</text>

      {/* ---- coupe : croute epaissie ---- */}
      <text x="145" y="64" className="fill-[#f59e0b]" fontSize="8.5" textAnchor="middle">croûte continentale épaissie</text>
      <rect x="8" y="44" width="274" height="196" className="fill-[#f59e0b]/10" />
      <path d="M40,44 L74,26 L108,34 L145,20 L184,32 L220,26 L252,44 Z"
            className="fill-[#f59e0b]/26 stroke-[#f59e0b]" strokeWidth="1.1" />

      {/* Moho enfonce */}
      <path d="M8,148 C42,148 58,246 145,246 C232,246 248,148 282,148"
            fill="none" className="stroke-[#f59e0b]" strokeWidth="1.6" strokeDasharray="5 3" />
      <text x="14" y="144" className="fill-[#f59e0b]" fontSize="7.5">Moho</text>
      <text x="145" y="260" className="fill-[#f59e0b]" fontSize="7.5" textAnchor="middle">racine crustale</text>

      {/* ---- zonation concentrique ---- */}
      <ellipse cx="145" cy="198" rx="84" ry="30" fill="none" className="stroke-neutral-500" strokeWidth="1.1" strokeDasharray="4 3" />
      <ellipse cx="145" cy="198" rx="60" ry="22" fill="none" className="stroke-[#10b981]" strokeWidth="1.3" strokeDasharray="5 3" />
      <ellipse cx="145" cy="198" rx="40" ry="15" className="fill-[#f59e0b]/38 stroke-[#f59e0b]" strokeWidth="1.4" />
      <text x="145" y="201" className="fill-[#f59e0b]" fontSize="7.5" textAnchor="middle">granite d&apos;anatexie</text>

      <line x1="198" y1="188" x2="232" y2="180" className="stroke-[#10b981]" strokeWidth="0.8" />
      <text x="236" y="182" className="fill-[#10b981]" fontSize="7.5">migmatite</text>
      <line x1="226" y1="212" x2="250" y2="216" className="stroke-neutral-500" strokeWidth="0.8" />
      <text x="254" y="217" className="fill-neutral-400" fontSize="7.5">gneiss</text>
      <line x1="66" y1="180" x2="46" y2="168" className="stroke-neutral-500" strokeWidth="0.8" />
      <text x="12" y="164" className="fill-neutral-400" fontSize="7.5">micaschiste</text>

      {/* ---- detail : la migmatite ---- */}
      <text x="344" y="34" className="fill-[#10b981]" fontSize="8.5" textAnchor="middle">la migmatite</text>
      <rect x="296" y="44" width="96" height="60" rx="4" fill="none" className="stroke-[#10b981]" strokeWidth="1" />
      <path d="M302,56 C318,50 332,64 348,56 C362,50 374,60 386,56" fill="none" className="stroke-neutral-400" strokeWidth="1.4" />
      <path d="M302,70 C318,64 332,78 348,70 C362,64 374,74 386,70" fill="none" className="stroke-[#f59e0b]" strokeWidth="2.2" />
      <path d="M302,84 C318,78 332,92 348,84 C362,78 374,88 386,84" fill="none" className="stroke-neutral-400" strokeWidth="1.4" />
      <path d="M302,96 C318,90 332,100 348,94 C362,88 374,96 386,94" fill="none" className="stroke-[#f59e0b]" strokeWidth="2.2" />
      <text x="344" y="120" className="fill-neutral-400" fontSize="7" textAnchor="middle">lits sombres : le gneiss</text>
      <text x="344" y="131" className="fill-[#f59e0b]" fontSize="7" textAnchor="middle">lits clairs : la fraction fondue</text>
      <text x="344" y="150" className="fill-[#10b981]" fontSize="7" textAnchor="middle">mélange gneiss + granite</text>

      {/* ---- lecture ---- */}
      <text x="296" y="184" className="fill-neutral-400" fontSize="7.5">Passage</text>
      <text x="296" y="195" className="fill-neutral-400" fontSize="7.5">PROGRESSIF,</text>
      <text x="296" y="206" className="fill-neutral-400" fontSize="7.5">sans limite nette,</text>
      <text x="296" y="217" className="fill-neutral-400" fontSize="7.5">vers l&apos;encaissant</text>
      <text x="296" y="228" className="fill-neutral-400" fontSize="7.5">métamorphique.</text>

      <text x="8" y="278" className="fill-neutral-400" fontSize="8">① enfouissement : P et T ↑ → gneiss   ② remontée : P ↓, T reste haute → fusion partielle</text>
      <text x="8" y="291" className="fill-[#f59e0b]" fontSize="8">③ refroidissement sur place → migmatite puis granite. Exemple marocain : l&apos;Ourika.</text>
    </svg>
  ),

  // Granite intrusif et aureole de metamorphisme de contact
  "svt-granite-intrusif": (
    <svg viewBox="0 0 400 262" className="w-full max-w-[520px] mx-auto h-auto">
      <text x="200" y="14" className="fill-neutral-300 dark:fill-neutral-100" fontSize="10" textAnchor="middle">le granite intrusif et son auréole de contact — le Zaër</text>

      {/* encaissant sedimentaire */}
      <rect x="8" y="28" width="384" height="174" className="fill-neutral-400/08" />
      <line x1="8" y1="48" x2="392" y2="48" className="stroke-neutral-500" strokeWidth="0.7" />
      <line x1="8" y1="70" x2="392" y2="70" className="stroke-neutral-500" strokeWidth="0.7" />
      <line x1="8" y1="92" x2="392" y2="92" className="stroke-neutral-500" strokeWidth="0.7" />
      <line x1="8" y1="136" x2="392" y2="136" className="stroke-neutral-500" strokeWidth="0.7" />
      <line x1="8" y1="158" x2="392" y2="158" className="stroke-neutral-500" strokeWidth="0.7" />
      <line x1="8" y1="180" x2="392" y2="180" className="stroke-neutral-500" strokeWidth="0.7" />
      <text x="14" y="42" className="fill-neutral-400" fontSize="7.5">encaissant sédimentaire</text>

      {/* aureoles concentriques, pluton decale a gauche */}
      <ellipse cx="134" cy="118" rx="120" ry="70" fill="none" className="stroke-[#0db8d3]" strokeWidth="1.1" strokeDasharray="4 3" />
      <ellipse cx="134" cy="118" rx="92" ry="54" fill="none" className="stroke-[#10b981]" strokeWidth="1.1" strokeDasharray="4 3" />
      <ellipse cx="134" cy="118" rx="66" ry="40" fill="none" className="stroke-[#f59e0b]" strokeWidth="1.1" strokeDasharray="4 3" />
      <ellipse cx="134" cy="118" rx="40" ry="26" className="fill-[#f59e0b]/38 stroke-[#f59e0b]" strokeWidth="1.5" />
      <text x="134" y="121" className="fill-[#f59e0b]" fontSize="8" textAnchor="middle">granite intrusif</text>

      {/* enclave */}
      <ellipse cx="152" cy="105" rx="8" ry="5" className="fill-neutral-400/50 stroke-neutral-400" strokeWidth="0.9" />

      {/* etiquettes des zones, rangees a droite */}
      <line x1="187" y1="116" x2="264" y2="88" className="stroke-[#f59e0b]" strokeWidth="0.8" />
      <text x="268" y="90" className="fill-[#f59e0b]" fontSize="7">cornéenne (feldspath K)</text>

      <line x1="213" y1="118" x2="264" y2="108" className="stroke-[#10b981]" strokeWidth="0.8" />
      <text x="268" y="110" className="fill-[#10b981]" fontSize="7">schiste à cordiérite + andalousite</text>

      <line x1="240" y1="120" x2="264" y2="128" className="stroke-[#0db8d3]" strokeWidth="0.8" />
      <text x="268" y="130" className="fill-[#0db8d3]" fontSize="7">schiste à biotite + andalousite</text>

      <line x1="262" y1="132" x2="266" y2="146" className="stroke-neutral-400" strokeWidth="0.8" />
      <text x="268" y="149" className="fill-neutral-400" fontSize="7.2">schiste à chlorite + séricite</text>
      <text x="268" y="161" className="fill-neutral-400" fontSize="7.2">encaissant intact</text>

      <line x1="160" y1="103" x2="264" y2="70" className="stroke-neutral-400" strokeWidth="0.8" />
      <text x="268" y="72" className="fill-neutral-400" fontSize="7">enclave de l&apos;encaissant</text>

      {/* gradient de temperature */}
      <line x1="248" y1="184" x2="172" y2="154" className="stroke-red-500" strokeWidth="1.4" />
      <path d="M166,152 l10,-2 l-3,9 z" className="fill-red-500" />
      <text x="252" y="188" className="fill-red-500" fontSize="7.5">T croissante vers le pluton</text>

      <text x="8" y="220" className="fill-neutral-400" fontSize="8">Auréole de CONTACT : haute température, basse pression, minéraux non orientés.</text>
      <text x="8" y="236" className="fill-[#f59e0b]" fontSize="8">Limite NETTE + enclaves ⇒ le magma est venu d&apos;ailleurs : c&apos;est un granite intrusif.</text>
      <text x="8" y="252" className="fill-[#10b981]" fontSize="8">À l&apos;opposé du granite d&apos;anatexie, qui passe progressivement au gneiss.</text>
    </svg>
  ),

  // Schistosite : l'experience de Daubree
  "svt-schistosite": (
    <svg viewBox="0 0 400 240" className="w-full max-w-[520px] mx-auto h-auto">
      <text x="200" y="14" className="fill-neutral-300 dark:fill-neutral-100" fontSize="10" textAnchor="middle">l&apos;expérience de Daubrée — l&apos;origine de la schistosité</text>

      {/* AVANT */}
      <text x="96" y="36" className="fill-neutral-400" fontSize="9" textAnchor="middle">avant : mica orienté au hasard</text>
      <rect x="44" y="48" width="104" height="96" rx="3" fill="none" className="stroke-neutral-500" strokeWidth="1.4" />
      <line x1="56" y1="62" x2="74" y2="70" className="stroke-[#0db8d3]" strokeWidth="2" />
      <line x1="96" y1="58" x2="102" y2="78" className="stroke-[#0db8d3]" strokeWidth="2" />
      <line x1="122" y1="66" x2="106" y2="74" className="stroke-[#0db8d3]" strokeWidth="2" />
      <line x1="60" y1="96" x2="78" y2="88" className="stroke-[#0db8d3]" strokeWidth="2" />
      <line x1="94" y1="100" x2="98" y2="118" className="stroke-[#0db8d3]" strokeWidth="2" />
      <line x1="124" y1="106" x2="110" y2="96" className="stroke-[#0db8d3]" strokeWidth="2" />
      <line x1="62" y1="126" x2="80" y2="120" className="stroke-[#0db8d3]" strokeWidth="2" />
      <line x1="118" y1="128" x2="128" y2="114" className="stroke-[#0db8d3]" strokeWidth="2" />

      {/* piston / contraintes */}
      <line x1="170" y1="96" x2="204" y2="96" className="stroke-red-500" strokeWidth="1.6" />
      <path d="M210,96 l-9,-4.5 l0,9 z" className="fill-red-500" />
      <text x="188" y="86" className="fill-red-500" fontSize="8" textAnchor="middle">pression</text>

      {/* APRES */}
      <text x="304" y="36" className="fill-neutral-400" fontSize="9" textAnchor="middle">après : mica aligné ⊥ à la contrainte</text>
      <rect x="252" y="48" width="104" height="96" rx="3" fill="none" className="stroke-neutral-500" strokeWidth="1.4" />
      <line x1="264" y1="60" x2="344" y2="60" className="stroke-[#10b981]" strokeWidth="2" />
      <line x1="264" y1="74" x2="344" y2="74" className="stroke-[#10b981]" strokeWidth="2" />
      <line x1="264" y1="88" x2="344" y2="88" className="stroke-[#10b981]" strokeWidth="2" />
      <line x1="264" y1="102" x2="344" y2="102" className="stroke-[#10b981]" strokeWidth="2" />
      <line x1="264" y1="116" x2="344" y2="116" className="stroke-[#10b981]" strokeWidth="2" />
      <line x1="264" y1="130" x2="344" y2="130" className="stroke-[#10b981]" strokeWidth="2" />
      {/* contraintes laterales sur le bloc apres */}
      <line x1="230" y1="96" x2="248" y2="96" className="stroke-red-500" strokeWidth="1.4" />
      <path d="M252,96 l-7,-3.5 l0,7 z" className="fill-red-500" />
      <line x1="378" y1="96" x2="360" y2="96" className="stroke-red-500" strokeWidth="1.4" />
      <path d="M356,96 l7,-3.5 l0,7 z" className="fill-red-500" />

      {/* conclusion */}
      <text x="8" y="176" className="fill-neutral-400" fontSize="8">La pression oriente les minéraux perpendiculairement à la contrainte : la SCHISTOSITÉ.</text>
      <text x="8" y="192" className="fill-[#10b981]" fontSize="8">Schistosité — feuilletage en lames ; à ne pas confondre avec la stratification.</text>
      <text x="8" y="208" className="fill-[#f59e0b]" fontSize="8">Foliation — stade plus avancé : lits clairs (quartz, feldspath) / sombres (micas).</text>
      <text x="8" y="228" className="fill-neutral-400" fontSize="8">Les deux facteurs : la PRESSION (structure) et la TEMPÉRATURE (minéralogie).</text>
    </svg>
  ),

  // Cycle cellulaire et evolution de la quantite d'ADN
  "svt-cycle-cellulaire": (
    <svg viewBox="0 0 400 316" className="w-full max-w-[520px] mx-auto h-auto">
      {/* ---- roue du cycle ---- */}
      <text x="96" y="16" className="fill-neutral-300 dark:fill-neutral-100" fontSize="10" textAnchor="middle">cycle cellulaire</text>
      {/* G1 : de 90 a 330 degres autour de (96,104), r=54 — quart superieur droit = M */}
      <path d="M96,50 A54,54 0 0 1 150,104" fill="none" className="stroke-[#f59e0b]" strokeWidth="9" strokeLinecap="butt" />
      <path d="M150,104 A54,54 0 0 1 96,158" fill="none" className="stroke-[#0db8d3]" strokeWidth="9" strokeLinecap="butt" />
      <path d="M96,158 A54,54 0 0 1 42,104" fill="none" className="stroke-[#10b981]" strokeWidth="9" strokeLinecap="butt" />
      <path d="M42,104 A54,54 0 0 1 96,50" fill="none" className="stroke-[#0db8d3]" strokeWidth="9" strokeLinecap="butt" />
      <text x="150" y="56" className="fill-[#f59e0b]" fontSize="11" textAnchor="middle">M</text>
      <text x="152" y="158" className="fill-[#0db8d3]" fontSize="11" textAnchor="middle">G₁</text>
      <text x="40" y="158" className="fill-[#10b981]" fontSize="11" textAnchor="middle">S</text>
      <text x="40" y="56" className="fill-[#0db8d3]" fontSize="11" textAnchor="middle">G₂</text>
      <text x="96" y="100" className="fill-neutral-400" fontSize="9" textAnchor="middle">interphase</text>
      <text x="96" y="114" className="fill-neutral-400" fontSize="9" textAnchor="middle">G₁ · S · G₂</text>
      <text x="96" y="186" className="fill-[#10b981]" fontSize="8.5" textAnchor="middle">S = réplication de l&apos;ADN</text>
      <text x="96" y="199" className="fill-[#f59e0b]" fontSize="8.5" textAnchor="middle">M = mitose</text>

      {/* ---- graphe Q(ADN) = f(temps) ---- */}
      <line x1="212" y1="180" x2="388" y2="180" className={AX} strokeWidth="1.4" />
      <line x1="212" y1="180" x2="212" y2="36" className={AX} strokeWidth="1.4" />
      <text x="212" y="28" className="fill-neutral-400" fontSize="9" textAnchor="middle">Q(ADN)</text>
      <text x="386" y="194" className="fill-neutral-400" fontSize="9" textAnchor="end">temps</text>

      {/* niveaux 2Q et 4Q */}
      <line x1="212" y1="136" x2="388" y2="136" className={DASH} strokeWidth="1" strokeDasharray="4 4" />
      <line x1="212" y1="64" x2="388" y2="64" className={DASH} strokeWidth="1" strokeDasharray="4 4" />
      <text x="208" y="140" className="fill-neutral-400" fontSize="9" textAnchor="end">2Q</text>
      <text x="208" y="68" className="fill-neutral-400" fontSize="9" textAnchor="end">4Q</text>

      {/* courbe : G1 plat a 2Q, S monte a 4Q, G2 plat, M chute a 2Q */}
      <path d="M216,136 L254,136 L300,64 L340,64 L340,136 L384,136"
            fill="none" className={CURVE} strokeWidth="2.4" />

      {/* bandes de phases */}
      <line x1="216" y1="180" x2="254" y2="180" className="stroke-[#0db8d3]" strokeWidth="5" />
      <line x1="254" y1="180" x2="300" y2="180" className="stroke-[#10b981]" strokeWidth="5" />
      <line x1="300" y1="180" x2="340" y2="180" className="stroke-[#0db8d3]" strokeWidth="5" />
      <line x1="340" y1="180" x2="384" y2="180" className="stroke-[#f59e0b]" strokeWidth="5" />
      <text x="235" y="172" className="fill-[#0db8d3]" fontSize="9" textAnchor="middle">G₁</text>
      <text x="277" y="172" className="fill-[#10b981]" fontSize="9" textAnchor="middle">S</text>
      <text x="320" y="172" className="fill-[#0db8d3]" fontSize="9" textAnchor="middle">G₂</text>
      <text x="362" y="172" className="fill-[#f59e0b]" fontSize="9" textAnchor="middle">M</text>

      {/* ---- etat des chromosomes sous le graphe ---- */}
      <text x="212" y="216" className="fill-neutral-400" fontSize="8.5">chromosome à 1 chromatide</text>
      <text x="212" y="228" className="fill-neutral-400" fontSize="8.5">→ à 2 chromatides après S</text>

      {/* chromosome a 1 chromatide */}
      <path d="M244,250 L244,288" className="stroke-[#0db8d3]" strokeWidth="5" strokeLinecap="round" />
      <circle cx="244" cy="266" r="3.4" className="fill-neutral-400" />
      <text x="244" y="306" className="fill-neutral-400" fontSize="8" textAnchor="middle">1 chromatide</text>
      {/* fleche */}
      <line x1="266" y1="268" x2="292" y2="268" className="stroke-[#10b981]" strokeWidth="1.4" />
      <path d="M298,268 l-8,-4 l0,8 z" className="fill-[#10b981]" />
      <text x="282" y="260" className="fill-[#10b981]" fontSize="8" textAnchor="middle">S</text>
      {/* chromosome a 2 chromatides */}
      <path d="M318,250 L318,288" className="stroke-[#0db8d3]" strokeWidth="5" strokeLinecap="round" />
      <path d="M332,250 L332,288" className="stroke-[#0db8d3]" strokeWidth="5" strokeLinecap="round" />
      <circle cx="325" cy="266" r="4" className="fill-neutral-400" />
      <text x="325" y="306" className="fill-neutral-400" fontSize="8" textAnchor="middle">2 chromatides</text>
      <text x="96" y="254" className="fill-neutral-400" fontSize="8.5" textAnchor="middle">Le nombre de chromosomes</text>
      <text x="96" y="267" className="fill-neutral-400" fontSize="8.5" textAnchor="middle">ne change pas en S :</text>
      <text x="96" y="285" className="fill-[#f59e0b]" fontSize="8.5" textAnchor="middle">c&apos;est la quantité d&apos;ADN</text>
      <text x="96" y="298" className="fill-[#f59e0b]" fontSize="8.5" textAnchor="middle">qui double.</text>
    </svg>
  ),

  // Replication semi-conservative de l'ADN
  "svt-replication-adn": (
    <svg viewBox="0 0 400 260" className="w-full max-w-[520px] mx-auto h-auto">
      <text x="200" y="16" className="fill-neutral-300 dark:fill-neutral-100" fontSize="10" textAnchor="middle">réplication semi-conservative</text>

      {/* molecule parentale : deux brins paralleles a gauche */}
      <path d="M30,108 L150,108" className="stroke-[#0db8d3]" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M30,140 L150,140" className="stroke-[#0db8d3]" strokeWidth="3.4" strokeLinecap="round" />
      <line x1="48" y1="108" x2="48" y2="140" className="stroke-neutral-500" strokeWidth="1.1" />
      <line x1="70" y1="108" x2="70" y2="140" className="stroke-neutral-500" strokeWidth="1.1" />
      <line x1="92" y1="108" x2="92" y2="140" className="stroke-neutral-500" strokeWidth="1.1" />
      <line x1="114" y1="108" x2="114" y2="140" className="stroke-neutral-500" strokeWidth="1.1" />
      <line x1="136" y1="108" x2="136" y2="140" className="stroke-neutral-500" strokeWidth="1.1" />
      <text x="24" y="98" className="fill-[#0db8d3]" fontSize="8.5">brins parentaux</text>

      {/* fourche de replication : ouverture en Y */}
      <path d="M150,108 C178,108 190,74 216,66 L330,42" fill="none" className="stroke-[#0db8d3]" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M150,140 C178,140 190,174 216,182 L330,206" fill="none" className="stroke-[#0db8d3]" strokeWidth="3.4" strokeLinecap="round" />
      <text x="172" y="128" className="fill-[#f59e0b]" fontSize="8.5" textAnchor="middle">fourche</text>

      {/* brins neoformes, en vert, apparies aux brins parentaux */}
      <path d="M218,86 L332,62" fill="none" className="stroke-[#10b981]" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M218,162 L332,186" fill="none" className="stroke-[#10b981]" strokeWidth="3.4" strokeLinecap="round" />
      <line x1="240" y1="61" x2="244" y2="81" className="stroke-neutral-500" strokeWidth="1.1" />
      <line x1="266" y1="55" x2="270" y2="76" className="stroke-neutral-500" strokeWidth="1.1" />
      <line x1="292" y1="50" x2="296" y2="70" className="stroke-neutral-500" strokeWidth="1.1" />
      <line x1="318" y1="45" x2="322" y2="65" className="stroke-neutral-500" strokeWidth="1.1" />
      <line x1="240" y1="187" x2="244" y2="167" className="stroke-neutral-500" strokeWidth="1.1" />
      <line x1="266" y1="193" x2="270" y2="172" className="stroke-neutral-500" strokeWidth="1.1" />
      <line x1="292" y1="198" x2="296" y2="178" className="stroke-neutral-500" strokeWidth="1.1" />
      <line x1="318" y1="203" x2="322" y2="183" className="stroke-neutral-500" strokeWidth="1.1" />

      {/* enzyme ADN polymerase */}
      <ellipse cx="220" cy="76" rx="15" ry="11" className="fill-[#f59e0b]/25 stroke-[#f59e0b]" strokeWidth="1.3" />
      <ellipse cx="220" cy="172" rx="15" ry="11" className="fill-[#f59e0b]/25 stroke-[#f59e0b]" strokeWidth="1.3" />
      <text x="238" y="100" className="fill-[#f59e0b]" fontSize="8.5">ADN polymérase</text>

      {/* nucleotides libres */}
      <circle cx="262" cy="118" r="4" className="fill-[#10b981]/60 stroke-[#10b981]" strokeWidth="1" />
      <circle cx="284" cy="132" r="4" className="fill-[#10b981]/60 stroke-[#10b981]" strokeWidth="1" />
      <circle cx="306" cy="116" r="4" className="fill-[#10b981]/60 stroke-[#10b981]" strokeWidth="1" />
      <text x="286" y="152" className="fill-[#10b981]" fontSize="8.5" textAnchor="middle">nucléotides libres</text>

      {/* legende resultat */}
      <text x="394" y="32" className="fill-neutral-400" fontSize="8.5" textAnchor="end">molécule fille 1</text>
      <text x="394" y="224" className="fill-neutral-400" fontSize="8.5" textAnchor="end">molécule fille 2</text>
      <line x1="30" y1="228" x2="52" y2="228" className="stroke-[#0db8d3]" strokeWidth="3.4" />
      <text x="58" y="231" className="fill-neutral-400" fontSize="9">brin parental conservé</text>
      <line x1="200" y1="228" x2="222" y2="228" className="stroke-[#10b981]" strokeWidth="3.4" />
      <text x="228" y="231" className="fill-neutral-400" fontSize="9">brin néoformé</text>
      <text x="30" y="250" className="fill-[#f59e0b]" fontSize="8.5">Chaque molécule fille garde un brin de la mère : la réplication est semi-conservative.</text>
    </svg>
  ),

  // Transcription et traduction : de l'ADN a la proteine
  "svt-transcription-traduction": (
    <svg viewBox="0 0 400 300" className="w-full max-w-[520px] mx-auto h-auto">
      {/* ---- noyau ---- */}
      <ellipse cx="112" cy="76" rx="98" ry="62" className="fill-[#0db8d3]/10 stroke-[#0db8d3]" strokeWidth="1.4" />
      <text x="112" y="24" className="fill-[#0db8d3]" fontSize="9.5" textAnchor="middle">noyau</text>

      {/* ADN : deux brins */}
      <path d="M40,62 L182,62" className="stroke-[#0db8d3]" strokeWidth="3" strokeLinecap="round" />
      <path d="M40,80 L182,80" className="stroke-[#0db8d3]" strokeWidth="3" strokeLinecap="round" />
      <line x1="58" y1="62" x2="58" y2="80" className="stroke-neutral-500" strokeWidth="1" />
      <line x1="78" y1="62" x2="78" y2="80" className="stroke-neutral-500" strokeWidth="1" />
      <line x1="150" y1="62" x2="150" y2="80" className="stroke-neutral-500" strokeWidth="1" />
      <line x1="170" y1="62" x2="170" y2="80" className="stroke-neutral-500" strokeWidth="1" />
      <text x="30" y="58" className="fill-[#0db8d3]" fontSize="8.5" textAnchor="start">ADN</text>
      <text x="112" y="56" className="fill-neutral-400" fontSize="8" textAnchor="middle">brin transcrit</text>

      {/* ARN polymerase + ARNm naissant */}
      <ellipse cx="104" cy="71" rx="17" ry="12" className="fill-[#f59e0b]/25 stroke-[#f59e0b]" strokeWidth="1.3" />
      <text x="104" y="102" className="fill-[#f59e0b]" fontSize="8" textAnchor="middle">ARN polymérase</text>
      <path d="M96,86 L96,112 L150,112" fill="none" className="stroke-[#10b981]" strokeWidth="2.6" strokeLinecap="round" />
      <text x="158" y="116" className="fill-[#10b981]" fontSize="8.5">ARNm</text>

      {/* etiquette etape 1 */}
      <text x="230" y="60" className="fill-[#f59e0b]" fontSize="10">1 · TRANSCRIPTION</text>
      <text x="230" y="74" className="fill-neutral-400" fontSize="8.5">ADN → ARNm, dans le noyau</text>
      <text x="230" y="86" className="fill-neutral-400" fontSize="8.5">A→U, T→A, G→C, C→G</text>

      {/* ---- pore nucleaire et sortie ---- */}
      <path d="M150,112 L150,150" className="stroke-[#10b981]" strokeWidth="2.6" />
      <path d="M150,156 l-4.5,-9 l9,0 z" className="fill-[#10b981]" />
      <text x="158" y="140" className="fill-neutral-400" fontSize="8">pore nucléaire</text>

      {/* ---- cytoplasme : traduction ---- */}
      <text x="368" y="150" className="fill-neutral-300 dark:fill-neutral-100" fontSize="9.5" textAnchor="end">cytoplasme</text>
      <path d="M40,200 L360,200" className="stroke-[#10b981]" strokeWidth="2.8" strokeLinecap="round" />
      <text x="30" y="204" className="fill-[#10b981]" fontSize="8.5" textAnchor="end">ARNm</text>
      {/* codons */}
      <line x1="76" y1="194" x2="76" y2="206" className="stroke-neutral-500" strokeWidth="1" />
      <line x1="112" y1="194" x2="112" y2="206" className="stroke-neutral-500" strokeWidth="1" />
      <line x1="148" y1="194" x2="148" y2="206" className="stroke-neutral-500" strokeWidth="1" />
      <line x1="184" y1="194" x2="184" y2="206" className="stroke-neutral-500" strokeWidth="1" />
      <line x1="220" y1="194" x2="220" y2="206" className="stroke-neutral-500" strokeWidth="1" />
      <text x="58" y="218" className="fill-neutral-400" fontSize="8" textAnchor="middle">AUG</text>
      <text x="94" y="218" className="fill-neutral-400" fontSize="8" textAnchor="middle">GCA</text>
      <text x="130" y="218" className="fill-neutral-400" fontSize="8" textAnchor="middle">UUC</text>
      <text x="166" y="218" className="fill-neutral-400" fontSize="8" textAnchor="middle">GGU</text>
      <text x="202" y="218" className="fill-neutral-400" fontSize="8" textAnchor="middle">UAA</text>
      <text x="202" y="230" className="fill-[#f59e0b]" fontSize="7.5" textAnchor="middle">stop</text>

      {/* ribosome */}
      <ellipse cx="166" cy="192" rx="26" ry="17" className="fill-[#f59e0b]/22 stroke-[#f59e0b]" strokeWidth="1.4" />
      <text x="118" y="180" className="fill-[#f59e0b]" fontSize="8.5" textAnchor="end">ribosome</text>
      <line x1="122" y1="177" x2="142" y2="186" className="stroke-[#f59e0b]" strokeWidth="0.9" />
      {/* ARNt avec anticodon */}
      <path d="M166,177 L166,158 M159,158 L173,158" fill="none" className="stroke-[#10b981]" strokeWidth="1.6" />
      <text x="180" y="156" className="fill-[#10b981]" fontSize="8">ARNt</text>

      {/* chaine polypeptidique */}
      <circle cx="238" cy="182" r="7" className="fill-[#0db8d3]/45 stroke-[#0db8d3]" strokeWidth="1.2" />
      <circle cx="256" cy="172" r="7" className="fill-[#0db8d3]/45 stroke-[#0db8d3]" strokeWidth="1.2" />
      <circle cx="276" cy="176" r="7" className="fill-[#0db8d3]/45 stroke-[#0db8d3]" strokeWidth="1.2" />
      <circle cx="294" cy="166" r="7" className="fill-[#0db8d3]/45 stroke-[#0db8d3]" strokeWidth="1.2" />
      <line x1="238" y1="182" x2="256" y2="172" className="stroke-[#0db8d3]" strokeWidth="1.4" />
      <line x1="256" y1="172" x2="276" y2="176" className="stroke-[#0db8d3]" strokeWidth="1.4" />
      <line x1="276" y1="176" x2="294" y2="166" className="stroke-[#0db8d3]" strokeWidth="1.4" />
      <text x="300" y="188" className="fill-[#0db8d3]" fontSize="8.5">protéine</text>

      <text x="40" y="252" className="fill-[#f59e0b]" fontSize="10">2 · TRADUCTION</text>
      <text x="40" y="266" className="fill-neutral-400" fontSize="8.5">ARNm → protéine, sur le ribosome, dans le cytoplasme</text>
      <text x="40" y="278" className="fill-neutral-400" fontSize="8.5">1 codon (3 nucléotides) = 1 acide aminé, lu par l&apos;anticodon de l&apos;ARNt</text>
      <text x="40" y="292" className="fill-[#10b981]" fontSize="8.5">ADN → ARNm → protéine → caractère</text>
    </svg>
  ),

  // Tableau du code genetique (extrait lisible)
  "svt-code-genetique": (
    <svg viewBox="0 0 400 268" className="w-full max-w-[520px] mx-auto h-auto">
      <text x="200" y="16" className="fill-neutral-300 dark:fill-neutral-100" fontSize="10" textAnchor="middle">le code génétique — quelques codons de l&apos;ARNm</text>

      {/* cadre du tableau */}
      <rect x="24" y="28" width="352" height="164" rx="6" fill="none" className="stroke-neutral-500" strokeWidth="1.2" />
      {/* en-tete */}
      <line x1="24" y1="50" x2="376" y2="50" className="stroke-neutral-500" strokeWidth="1.2" />
      <line x1="200" y1="28" x2="200" y2="192" className="stroke-neutral-500" strokeWidth="1.2" />
      <line x1="112" y1="28" x2="112" y2="192" className="stroke-neutral-500" strokeWidth="1" />
      <line x1="288" y1="28" x2="288" y2="192" className="stroke-neutral-500" strokeWidth="1" />
      <text x="68" y="44" className="fill-[#0db8d3]" fontSize="9" textAnchor="middle">codon</text>
      <text x="156" y="44" className="fill-[#10b981]" fontSize="9" textAnchor="middle">acide aminé</text>
      <text x="244" y="44" className="fill-[#0db8d3]" fontSize="9" textAnchor="middle">codon</text>
      <text x="332" y="44" className="fill-[#10b981]" fontSize="9" textAnchor="middle">acide aminé</text>

      {/* lignes gauche */}
      <text x="68" y="70" className="fill-[#0db8d3]" fontSize="9" textAnchor="middle">AUG</text>
      <text x="156" y="70" className="fill-[#f59e0b]" fontSize="9" textAnchor="middle">Met · DÉBUT</text>
      <text x="68" y="90" className="fill-[#0db8d3]" fontSize="9" textAnchor="middle">UUU · UUC</text>
      <text x="156" y="90" className="fill-neutral-300 dark:fill-neutral-100" fontSize="9" textAnchor="middle">Phe</text>
      <text x="68" y="110" className="fill-[#0db8d3]" fontSize="9" textAnchor="middle">UUA · UUG</text>
      <text x="156" y="110" className="fill-neutral-300 dark:fill-neutral-100" fontSize="9" textAnchor="middle">Leu</text>
      <text x="68" y="130" className="fill-[#0db8d3]" fontSize="9" textAnchor="middle">UCU · UCC</text>
      <text x="156" y="130" className="fill-neutral-300 dark:fill-neutral-100" fontSize="9" textAnchor="middle">Ser</text>
      <text x="68" y="150" className="fill-[#0db8d3]" fontSize="9" textAnchor="middle">UAU · UAC</text>
      <text x="156" y="150" className="fill-neutral-300 dark:fill-neutral-100" fontSize="9" textAnchor="middle">Tyr</text>
      <text x="68" y="170" className="fill-[#0db8d3]" fontSize="9" textAnchor="middle">UGU · UGC</text>
      <text x="156" y="170" className="fill-neutral-300 dark:fill-neutral-100" fontSize="9" textAnchor="middle">Cys</text>
      {/* lignes droite */}
      <text x="244" y="70" className="fill-[#0db8d3]" fontSize="9" textAnchor="middle">GCU · GCA</text>
      <text x="332" y="70" className="fill-neutral-300 dark:fill-neutral-100" fontSize="9" textAnchor="middle">Ala</text>
      <text x="244" y="90" className="fill-[#0db8d3]" fontSize="9" textAnchor="middle">GAU · GAC</text>
      <text x="332" y="90" className="fill-neutral-300 dark:fill-neutral-100" fontSize="9" textAnchor="middle">Asp</text>
      <text x="244" y="110" className="fill-[#0db8d3]" fontSize="9" textAnchor="middle">GAA · GAG</text>
      <text x="332" y="110" className="fill-neutral-300 dark:fill-neutral-100" fontSize="9" textAnchor="middle">Glu</text>
      <text x="244" y="130" className="fill-[#0db8d3]" fontSize="9" textAnchor="middle">GGU · GGC</text>
      <text x="332" y="130" className="fill-neutral-300 dark:fill-neutral-100" fontSize="9" textAnchor="middle">Gly</text>
      <text x="244" y="150" className="fill-[#0db8d3]" fontSize="9" textAnchor="middle">CAU · CAC</text>
      <text x="332" y="150" className="fill-neutral-300 dark:fill-neutral-100" fontSize="9" textAnchor="middle">His</text>
      <text x="244" y="170" className="fill-[#0db8d3]" fontSize="9" textAnchor="middle">UAA·UAG·UGA</text>
      <text x="332" y="170" className="fill-[#f59e0b]" fontSize="9" textAnchor="middle">STOP</text>

      {/* proprietes du code */}
      <text x="24" y="212" className="fill-[#10b981]" fontSize="9">Universel</text>
      <text x="80" y="212" className="fill-neutral-400" fontSize="8.5">— le même chez presque tous les êtres vivants</text>
      <text x="24" y="228" className="fill-[#10b981]" fontSize="9">Redondant</text>
      <text x="88" y="228" className="fill-neutral-400" fontSize="8.5">— plusieurs codons pour un même acide aminé</text>
      <text x="24" y="244" className="fill-[#10b981]" fontSize="9">Non ambigu</text>
      <text x="94" y="244" className="fill-neutral-400" fontSize="8.5">— un codon ne code jamais deux acides aminés</text>
      <text x="24" y="262" className="fill-[#f59e0b]" fontSize="8.5">64 codons (4³) pour 20 acides aminés : 61 codants + 3 codons stop.</text>
    </svg>
  ),

  // Transgenese : du plasmide a la bacterie productrice
  "svt-transgenese": (
    <svg viewBox="0 0 400 250" className="w-full max-w-[520px] mx-auto h-auto">
      <text x="200" y="16" className="fill-neutral-300 dark:fill-neutral-100" fontSize="10" textAnchor="middle">transgenèse — production d&apos;insuline humaine</text>

      {/* 1 : cellule humaine, gene d'interet */}
      <circle cx="56" cy="66" r="26" className="fill-[#0db8d3]/12 stroke-[#0db8d3]" strokeWidth="1.3" />
      <circle cx="56" cy="66" r="11" className="fill-[#0db8d3]/25 stroke-[#0db8d3]" strokeWidth="1" />
      <path d="M40,88 L72,88" className="stroke-[#f59e0b]" strokeWidth="3.2" strokeLinecap="round" />
      <text x="56" y="106" className="fill-[#f59e0b]" fontSize="8.5" textAnchor="middle">gène de l&apos;insuline</text>
      <text x="56" y="32" className="fill-neutral-400" fontSize="8.5" textAnchor="middle">cellule humaine</text>

      {/* fleche 1 : enzyme de restriction */}
      <line x1="90" y1="66" x2="120" y2="66" className="stroke-neutral-400" strokeWidth="1.4" />
      <path d="M126,66 l-8,-4 l0,8 z" className="fill-neutral-400" />
      <text x="108" y="50" className="fill-neutral-400" fontSize="7.5" textAnchor="middle">enzyme de</text>
      <text x="108" y="59" className="fill-neutral-400" fontSize="7.5" textAnchor="middle">restriction</text>

      {/* 2 : plasmide ouvert + gene insere */}
      <circle cx="170" cy="66" r="28" fill="none" className="stroke-[#10b981]" strokeWidth="3" strokeDasharray="70 18" />
      <path d="M154,88 L186,88" className="stroke-[#f59e0b]" strokeWidth="3.2" strokeLinecap="round" />
      <text x="170" y="32" className="fill-[#10b981]" fontSize="8.5" textAnchor="middle">plasmide</text>
      <text x="170" y="106" className="fill-neutral-400" fontSize="8" textAnchor="middle">ADN recombiné</text>

      {/* fleche 2 : ligase */}
      <line x1="204" y1="66" x2="234" y2="66" className="stroke-neutral-400" strokeWidth="1.4" />
      <path d="M240,66 l-8,-4 l0,8 z" className="fill-neutral-400" />
      <text x="222" y="54" className="fill-neutral-400" fontSize="7.5" textAnchor="middle">ligase</text>

      {/* 3 : bacterie transformee */}
      <ellipse cx="296" cy="66" rx="42" ry="24" className="fill-[#10b981]/12 stroke-[#10b981]" strokeWidth="1.4" />
      <circle cx="288" cy="64" r="12" fill="none" className="stroke-[#10b981]" strokeWidth="2" />
      <path d="M280,76 L300,76" className="stroke-[#f59e0b]" strokeWidth="2.6" strokeLinecap="round" />
      <text x="296" y="32" className="fill-[#10b981]" fontSize="8.5" textAnchor="middle">bactérie transformée</text>
      <text x="296" y="106" className="fill-neutral-400" fontSize="8" textAnchor="middle">OGM</text>

      {/* 4 : multiplication et production */}
      <line x1="296" y1="118" x2="296" y2="146" className="stroke-neutral-400" strokeWidth="1.4" />
      <path d="M296,152 l-4,-8 l8,0 z" className="fill-neutral-400" />
      <text x="304" y="138" className="fill-neutral-400" fontSize="8">culture</text>
      <ellipse cx="256" cy="176" rx="22" ry="13" className="fill-[#10b981]/12 stroke-[#10b981]" strokeWidth="1.2" />
      <ellipse cx="300" cy="176" rx="22" ry="13" className="fill-[#10b981]/12 stroke-[#10b981]" strokeWidth="1.2" />
      <ellipse cx="344" cy="176" rx="22" ry="13" className="fill-[#10b981]/12 stroke-[#10b981]" strokeWidth="1.2" />
      <circle cx="256" cy="176" r="4" className="fill-[#f59e0b]" />
      <circle cx="300" cy="176" r="4" className="fill-[#f59e0b]" />
      <circle cx="344" cy="176" r="4" className="fill-[#f59e0b]" />
      <text x="300" y="200" className="fill-[#f59e0b]" fontSize="8.5" textAnchor="middle">insuline humaine produite en masse</text>

      {/* encadre principe */}
      <text x="24" y="150" className="fill-[#f59e0b]" fontSize="9">Le principe</text>
      <text x="24" y="166" className="fill-neutral-400" fontSize="8.5">Le code génétique est</text>
      <text x="24" y="178" className="fill-neutral-400" fontSize="8.5">universel : la bactérie</text>
      <text x="24" y="190" className="fill-neutral-400" fontSize="8.5">sait lire un gène humain</text>
      <text x="24" y="202" className="fill-neutral-400" fontSize="8.5">et fabriquer la protéine.</text>

      <text x="24" y="228" className="fill-neutral-400" fontSize="8.5">Outils : enzyme de restriction (coupe), ADN ligase (recolle), plasmide (vecteur).</text>
      <text x="24" y="242" className="fill-[#10b981]" fontSize="8.5">Le transfert naturel de gènes par Agrobacterium tumefaciens suit le même principe.</text>
    </svg>
  ),

  // Plis et failles
  "svt-pli-faille": (
    <svg viewBox="0 0 400 160" className="w-full max-w-[520px] mx-auto h-auto">
      <text x="100" y="16" className="fill-neutral-400" fontSize="10" textAnchor="middle" fontWeight="bold">Pli</text>
      <path d="M20,110 Q60,40 100,110 T180,110" fill="none" className="stroke-neutral-500" strokeWidth="2" />
      <path d="M20,125 Q60,55 100,125 T180,125" fill="none" className="stroke-neutral-400" strokeWidth="1.4" />
      <text x="60" y="150" className="fill-[#10b981]" fontSize="9">compression →</text>
      <text x="150" y="150" className="fill-[#10b981]" fontSize="9" textAnchor="end">← compression</text>
      <text x="310" y="16" className="fill-neutral-400" fontSize="10" textAnchor="middle" fontWeight="bold">Faille inverse</text>
      <line x1="240" y1="60" x2="300" y2="130" className="stroke-neutral-600" strokeWidth="2" />
      <rect x="220" y="90" width="40" height="40" className="fill-neutral-400/25 stroke-neutral-500" strokeWidth="1" transform="skewX(-8)" />
      <path d="M270,70 l50,0 l0,40 l-50,0 Z" className="fill-neutral-500/25 stroke-neutral-500" strokeWidth="1" />
      <line x1="285" y1="72" x2="285" y2="60" className="stroke-[#10b981]" strokeWidth="1.5" markerEnd="url(#svtU)" />
      <defs><marker id="svtU" markerWidth="8" markerHeight="8" refX="3" refY="0" orient="auto"><path d="M0,6 L3,0 L6,6 Z" className="fill-[#10b981]" /></marker></defs>
    </svg>
  ),

  // Gradient métamorphique — minéraux index
  "svt-metamorphisme": (
    <svg viewBox="0 0 400 150" className="w-full max-w-[520px] mx-auto h-auto">
      <line x1="30" y1="120" x2="380" y2="120" className={AX} strokeWidth="1.5" markerEnd="url(#svtA)" />
      <text x="380" y="140" className="fill-neutral-400" fontSize="10" textAnchor="end">Pression / Température croissantes →</text>
      {[["Chlorite", 70], ["Biotite", 150], ["Grenat", 230], ["Disthène", 300], ["Sillimanite", 365]].map(([n, x], i) => (
        <g key={i}>
          <circle cx={x as number} cy="70" r={6 + i * 2} className="fill-indigo-500/30 stroke-indigo-500" strokeWidth="1.2" />
          <line x1={x as number} y1={82 + i * 2} x2={x as number} y2="120" className={DASH} strokeWidth="1" strokeDasharray="3 3" />
          <text x={x as number} y="45" className="fill-neutral-500 dark:fill-neutral-300" fontSize="9" textAnchor="middle">{n as string}</text>
        </g>
      ))}
      <defs><marker id="svtA" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" className="fill-neutral-400" /></marker></defs>
    </svg>
  ),

  // Montage ExAO — suivi de la respiration/fermentation
  "svt-exao": (
    <svg viewBox="0 0 400 180" className="w-full max-w-[500px] mx-auto h-auto">
      <rect x="40" y="60" width="90" height="90" rx="6" fill="none" className="stroke-neutral-500" strokeWidth="1.5" />
      <rect x="52" y="110" width="66" height="36" className="fill-[#0db8d3]/20" />
      <text x="85" y="165" className="fill-neutral-400" fontSize="9" textAnchor="middle">enceinte (levures)</text>
      <circle cx="85" cy="90" r="6" className="fill-[#f59e0b]/50 stroke-[#f59e0b]" strokeWidth="1" />
      <text x="85" y="80" className="fill-[#f59e0b]" fontSize="8" textAnchor="middle">sonde</text>
      <line x1="130" y1="90" x2="240" y2="90" className="stroke-neutral-400" strokeWidth="1.5" />
      <rect x="240" y="55" width="120" height="80" rx="6" className="fill-neutral-400/15 stroke-neutral-500" strokeWidth="1.5" />
      <line x1="255" y1="120" x2="345" y2="120" className={AX} strokeWidth="1" />
      <line x1="255" y1="65" x2="255" y2="120" className={AX} strokeWidth="1" />
      <path d="M255,110 C290,95 320,80 345,72" fill="none" className={CURVE} strokeWidth="2" />
      <text x="300" y="150" className="fill-neutral-400" fontSize="9" textAnchor="middle">interface + ordinateur</text>
    </svg>
  ),

  // Myogramme
  "svt-myogramme": (
    <svg viewBox="0 0 400 160" className="w-full max-w-[500px] mx-auto h-auto">
      <line x1="30" y1="130" x2="380" y2="130" className={AX} strokeWidth="1.5" />
      <line x1="30" y1="20" x2="30" y2="140" className={AX} strokeWidth="1.5" />
      <path d="M40,130 Q70,40 100,130" fill="none" className={CURVE} strokeWidth="2" />
      <text x="70" y="150" className="fill-neutral-400" fontSize="9" textAnchor="middle">secousse</text>
      <path d="M170,130 Q182,70 194,95 Q206,55 218,80 Q230,45 242,70 L300,55 L300,130 Z" fill="none" className="stroke-[#10b981]" strokeWidth="2" />
      <text x="245" y="150" className="fill-[#10b981]" fontSize="9" textAnchor="middle">tétanos</text>
      <text x="22" y="26" className="fill-neutral-400" fontSize="9" textAnchor="end">tension</text>
      <text x="378" y="150" className="fill-neutral-400" fontSize="9" textAnchor="end">t</text>
    </svg>
  ),

  // ADN — double hélice schématique avec appariement
  "svt-adn": (
    <svg viewBox="0 0 360 180" className="w-full max-w-[440px] mx-auto h-auto">
      <path d="M90,20 C150,50 150,90 90,120 C30,150 30,190 90,220" fill="none" className="stroke-[#0db8d3]" strokeWidth="2.5" transform="scale(1,0.72)" />
      <path d="M180,20 C120,50 120,90 180,120 C240,150 240,190 180,220" fill="none" className="stroke-[#10b981]" strokeWidth="2.5" transform="scale(1,0.72)" />
      {[[30, "A", "T"], [55, "T", "A"], [80, "G", "C"], [105, "C", "G"]].map(([y, a, b], i) => (
        <g key={i}>
          <line x1="118" y1={y as number} x2="152" y2={y as number} className="stroke-neutral-400" strokeWidth="1.2" />
          <text x="108" y={(y as number) + 3} className="fill-[#0db8d3]" fontSize="9" textAnchor="end">{a as string}</text>
          <text x="162" y={(y as number) + 3} className="fill-[#10b981]" fontSize="9">{b as string}</text>
        </g>
      ))}
      <text x="250" y="60" className="fill-neutral-400" fontSize="9">A–T (2 liaisons)</text>
      <text x="250" y="80" className="fill-neutral-400" fontSize="9">G–C (3 liaisons)</text>
    </svg>
  ),

  // Électrophorèse — gel, puits, bandes
  "svt-electrophorese": (
    <svg viewBox="0 0 320 180" className="w-full max-w-[380px] mx-auto h-auto">
      <rect x="40" y="20" width="240" height="140" rx="6" className="fill-[#0db8d3]/8 stroke-neutral-500" strokeWidth="1.4" />
      {[80, 140, 200, 260].map((x, i) => <rect key={i} x={x - 12} y="26" width="24" height="8" className="fill-neutral-500/60" />)}
      <text x="160" y="20" className="fill-neutral-400" fontSize="9" textAnchor="middle">puits (dépôt)</text>
      {[[80, [55, 90, 130]], [140, [55, 110]], [200, [70, 90, 150]], [260, [55, 90, 130]]].map(([x, ys], i) => (
        <g key={i}>{(ys as number[]).map((y, j) => <rect key={j} x={(x as number) - 12} y={y} width="24" height="6" rx="2" className="fill-indigo-500/60" />)}</g>
      ))}
      <line x1="20" y1="30" x2="20" y2="150" className="stroke-neutral-400" strokeWidth="1" markerEnd="url(#svtMig)" />
      <text x="14" y="95" className="fill-neutral-400" fontSize="8" transform="rotate(-90 14 95)" textAnchor="middle">migration (taille ↓)</text>
      <defs><marker id="svtMig" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" className="fill-neutral-400" /></marker></defs>
    </svg>
  ),

  // Réponse immunitaire — primaire vs secondaire
  "svt-anticorps": (
    <svg viewBox="0 0 400 180" className="w-full max-w-[500px] mx-auto h-auto">
      <line x1="40" y1="150" x2="385" y2="150" className={AX} strokeWidth="1.5" />
      <line x1="40" y1="20" x2="40" y2="160" className={AX} strokeWidth="1.5" />
      <path d="M60,150 C90,148 110,120 130,118 C150,116 170,145 200,150" fill="none" className={CURVE} strokeWidth="2" />
      <path d="M210,150 C225,145 235,45 250,42 C270,40 285,120 340,140" fill="none" className="stroke-[#10b981]" strokeWidth="2.2" />
      <line x1="60" y1="150" x2="60" y2="160" className="stroke-red-500" strokeWidth="1.5" />
      <line x1="210" y1="150" x2="210" y2="160" className="stroke-red-500" strokeWidth="1.5" />
      <text x="60" y="172" className="fill-red-500" fontSize="8" textAnchor="middle">1er contact</text>
      <text x="210" y="172" className="fill-red-500" fontSize="8" textAnchor="middle">2ᵉ contact</text>
      <text x="120" y="105" className="fill-[#0db8d3]" fontSize="9">primaire</text>
      <text x="255" y="35" className="fill-[#10b981]" fontSize="9">secondaire</text>
      <text x="34" y="26" className="fill-neutral-400" fontSize="9" textAnchor="end">[Ac]</text>
    </svg>
  ),

  // Méiose — brassage interchromosomique (2 paires → 4 gamètes)
  "svt-meiose": (
    <svg viewBox="0 0 400 170" className="w-full max-w-[500px] mx-auto h-auto">
      <circle cx="70" cy="70" r="40" fill="none" className="stroke-neutral-500" strokeWidth="1.5" />
      <line x1="52" y1="58" x2="88" y2="58" className="stroke-[#0db8d3]" strokeWidth="4" />
      <line x1="52" y1="66" x2="88" y2="66" className="stroke-[#0db8d3]/50" strokeWidth="4" />
      <line x1="52" y1="80" x2="88" y2="80" className="stroke-[#10b981]" strokeWidth="4" />
      <line x1="52" y1="88" x2="88" y2="88" className="stroke-[#10b981]/50" strokeWidth="4" />
      <text x="70" y="130" className="fill-neutral-400" fontSize="9" textAnchor="middle">cellule (2n)</text>
      <line x1="115" y1="70" x2="150" y2="70" className="stroke-neutral-400" strokeWidth="1.4" markerEnd="url(#svtM2)" />
      {[[190, "#0db8d3", "#10b981"], [255, "#0db8d3", "#10b981"], [320, "#0db8d3", "#10b981"], [385, "#0db8d3", "#10b981"]].map(([x], i) => (
        <g key={i}>
          <circle cx={(x as number) - 15} cy="70" r="20" fill="none" className="stroke-neutral-500" strokeWidth="1.2" />
          <line x1={(x as number) - 27} y1="64" x2={(x as number) - 3} y2="64" className={i < 2 ? "stroke-[#0db8d3]" : "stroke-[#0db8d3]"} strokeWidth="3" />
          <line x1={(x as number) - 27} y1="76" x2={(x as number) - 3} y2="76" className={i % 2 === 0 ? "stroke-[#10b981]" : "stroke-[#10b981]/50"} strokeWidth="3" />
        </g>
      ))}
      <text x="255" y="130" className="fill-neutral-400" fontSize="9" textAnchor="middle">4 gamètes (n) — combinaisons variées</text>
      <defs><marker id="svtM2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" className="fill-neutral-400" /></marker></defs>
    </svg>
  ),

  /* ===================== Montages expérimentaux (physique-chimie) ===================== */

  // Montage d'un circuit RC
  "montage-rc": (
    <svg viewBox="0 0 320 200" className="w-full max-w-[400px] mx-auto h-auto">
      <rect x="40" y="40" width="240" height="120" fill="none" className="stroke-neutral-500" strokeWidth="1.6" />
      <line x1="40" y1="90" x2="40" y2="110" className="stroke-neutral-400" strokeWidth="4" />
      <line x1="34" y1="86" x2="46" y2="86" className="stroke-neutral-500" strokeWidth="2" />
      <line x1="37" y1="114" x2="43" y2="114" className="stroke-neutral-500" strokeWidth="3" />
      <text x="22" y="104" className="fill-neutral-400" fontSize="10">E</text>
      <line x1="120" y1="40" x2="140" y2="30" className="stroke-neutral-500" strokeWidth="2" />
      <circle cx="120" cy="40" r="2.5" className="fill-neutral-500" /><circle cx="145" cy="40" r="2.5" className="fill-neutral-500" />
      <text x="130" y="24" className="fill-neutral-400" fontSize="9" textAnchor="middle">K</text>
      <rect x="200" y="32" width="40" height="16" fill="none" className="stroke-neutral-500" strokeWidth="1.6" />
      <text x="220" y="26" className="fill-neutral-400" fontSize="10" textAnchor="middle">R</text>
      <line x1="270" y1="90" x2="270" y2="98" className="stroke-neutral-500" strokeWidth="2" />
      <line x1="258" y1="98" x2="282" y2="98" className="stroke-[#0db8d3]" strokeWidth="2.5" />
      <line x1="258" y1="104" x2="282" y2="104" className="stroke-[#0db8d3]" strokeWidth="2.5" />
      <line x1="270" y1="104" x2="270" y2="112" className="stroke-neutral-500" strokeWidth="2" />
      <text x="290" y="104" className="fill-[#0db8d3]" fontSize="10">C</text>
    </svg>
  ),

  // Montage de dosage acido-basique
  "montage-titrage": (
    <svg viewBox="0 0 300 210" className="w-full max-w-[340px] mx-auto h-auto">
      <rect x="140" y="10" width="14" height="110" rx="3" fill="none" className="stroke-neutral-500" strokeWidth="1.4" />
      <rect x="140" y="30" width="14" height="55" className="fill-[#10b981]/25" />
      {[30, 45, 60, 75, 90, 105].map((y, i) => <line key={i} x1="154" y1={y} x2="160" y2={y} className="stroke-neutral-400" strokeWidth="0.8" />)}
      <text x="168" y="24" className="fill-neutral-400" fontSize="9">burette</text>
      <path d="M147,120 l-3,6 l6,0 Z" className="fill-[#10b981]" />
      <path d="M110,150 L110,185 Q110,195 120,195 L174,195 Q184,195 184,185 L184,150 Z" fill="none" className="stroke-neutral-500" strokeWidth="1.6" />
      <path d="M114,172 L114,185 Q114,191 120,191 L174,191 Q180,191 180,185 L180,172 Z" className="fill-[#0db8d3]/20" />
      <line x1="150" y1="150" x2="150" y2="178" className="stroke-neutral-500" strokeWidth="2" />
      <rect x="146" y="140" width="8" height="12" className="fill-neutral-400" />
      <text x="196" y="150" className="fill-neutral-400" fontSize="9">pH-mètre</text>
      <ellipse cx="147" cy="188" rx="10" ry="3" className="fill-neutral-500" />
      <text x="147" y="208" className="fill-neutral-400" fontSize="9" textAnchor="middle">agitateur magnétique</text>
    </svg>
  ),

  // Cuve à ondes — ondes circulaires
  "cuve-ondes": (
    <svg viewBox="0 0 300 190" className="w-full max-w-[360px] mx-auto h-auto">
      <rect x="30" y="30" width="240" height="130" rx="6" fill="none" className="stroke-neutral-500" strokeWidth="1.6" />
      <rect x="120" y="18" width="60" height="14" rx="3" className="fill-neutral-400/40 stroke-neutral-500" strokeWidth="1" />
      <text x="150" y="14" className="fill-neutral-400" fontSize="9" textAnchor="middle">vibreur</text>
      {[16, 30, 44, 58, 72].map((r, i) => <circle key={i} cx="150" cy="95" r={r} fill="none" className="stroke-[#0db8d3]" strokeWidth={1.4 - i * 0.15} opacity={1 - i * 0.13} />)}
      <circle cx="150" cy="95" r="3" className="fill-[#0db8d3]" />
      <text x="150" y="178" className="fill-neutral-400" fontSize="9" textAnchor="middle">ondes circulaires à la surface de l'eau</text>
    </svg>
  ),

  // Moteur à courant continu — schéma de principe
  "moteur-cc": (
    <svg viewBox="0 0 300 190" className="w-full max-w-[360px] mx-auto h-auto">
      <circle cx="150" cy="90" r="60" fill="none" className="stroke-neutral-500" strokeWidth="1.6" />
      <text x="98" y="90" className="fill-neutral-400" fontSize="12" textAnchor="middle">N</text>
      <text x="202" y="90" className="fill-neutral-400" fontSize="12" textAnchor="middle">S</text>
      <rect x="122" y="62" width="56" height="56" rx="4" fill="none" className="stroke-[#0db8d3]" strokeWidth="2" />
      <text x="150" y="94" className="fill-[#0db8d3]" fontSize="9" textAnchor="middle">rotor</text>
      <line x1="150" y1="150" x2="150" y2="170" className="stroke-neutral-500" strokeWidth="1.5" />
      <rect x="138" y="150" width="24" height="8" className="fill-neutral-400" />
      <text x="150" y="184" className="fill-neutral-400" fontSize="8" textAnchor="middle">balais + collecteur</text>
      <line x1="60" y1="30" x2="60" y2="90" className="stroke-neutral-500" strokeWidth="1.5" />
      <line x1="60" y1="30" x2="120" y2="30" className="stroke-neutral-500" strokeWidth="1.5" />
      <text x="52" y="30" className="fill-neutral-400" fontSize="10" textAnchor="end">U</text>
    </svg>
  ),

  // Capteur — chaîne d'acquisition
  "si-capteur": (
    <svg viewBox="0 0 400 100" className="w-full max-w-[480px] mx-auto h-auto">
      {["Grandeur physique", "Capteur", "Signal électrique"].map((t, i) => (
        <g key={t}>
          <rect x={10 + i * 140} y="30" width="120" height="42" rx="8" className={i === 1 ? "fill-[#0db8d3]/15 stroke-[#0db8d3]" : "fill-neutral-400/10 stroke-neutral-500"} strokeWidth="1.5" />
          <text x={70 + i * 140} y="55" className="fill-neutral-600 dark:fill-neutral-200" fontSize="10" textAnchor="middle">{t}</text>
          {i < 2 && <line x1={130 + i * 140} y1="51" x2={150 + i * 140} y2="51" className="stroke-neutral-400" strokeWidth="1.5" markerEnd="url(#capA)" />}
        </g>
      ))}
      <defs><marker id="capA" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" className="fill-neutral-400" /></marker></defs>
    </svg>
  ),

  // Station d'épuration — étapes
  "svt-station-epuration": (
    <svg viewBox="0 0 420 110" className="w-full max-w-[520px] mx-auto h-auto">
      {["Dégrillage", "Décantation", "Bassin biologique", "Rejet"].map((t, i) => (
        <g key={t}>
          <rect x={8 + i * 104} y="30" width="88" height="44" rx="6" className={i === 3 ? "fill-[#10b981]/15 stroke-[#10b981]" : "fill-[#0db8d3]/12 stroke-[#0db8d3]"} strokeWidth="1.4" />
          <text x={52 + i * 104} y="56" className="fill-neutral-600 dark:fill-neutral-200" fontSize="9" textAnchor="middle">{t}</text>
          {i < 3 && <line x1={96 + i * 104} y1="52" x2={112 + i * 104} y2="52" className="stroke-neutral-400" strokeWidth="1.4" markerEnd="url(#epA)" />}
        </g>
      ))}
      <text x="52" y="20" className="fill-neutral-400" fontSize="9" textAnchor="middle">eaux usées →</text>
      <defs><marker id="epA" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" className="fill-neutral-400" /></marker></defs>
    </svg>
  ),

  // Gestion des déchets — tri et valorisation
  "svt-dechets": (
    <svg viewBox="0 0 360 130" className="w-full max-w-[440px] mx-auto h-auto">
      {[["Organique", "#10b981", "Compost"], ["Plastique/verre", "#0db8d3", "Recyclage"], ["Résiduel", "#f59e0b", "Incinération"]].map(([n, c, dest], i) => (
        <g key={i}>
          <path d={`M${30 + i * 115},40 l40,0 l-4,42 l-32,0 Z`} fill="none" className="stroke-neutral-500" strokeWidth="1.4" style={{ stroke: c as string }} />
          <text x={50 + i * 115} y="30" fontSize="9" textAnchor="middle" style={{ fill: c as string }}>{n as string}</text>
          <line x1={50 + i * 115} y1="86" x2={50 + i * 115} y2="100" className="stroke-neutral-400" strokeWidth="1.2" markerEnd="url(#dA)" />
          <text x={50 + i * 115} y="114" className="fill-neutral-400" fontSize="8" textAnchor="middle">{dest as string}</text>
        </g>
      ))}
      <defs><marker id="dA" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" className="fill-neutral-400" /></marker></defs>
    </svg>
  ),

  // Cellule et mitochondrie
  "svt-cellule": (
    <svg viewBox="0 0 320 180" className="w-full max-w-[400px] mx-auto h-auto">
      <rect x="20" y="20" width="280" height="140" rx="40" className="fill-[#0db8d3]/8 stroke-[#0db8d3]" strokeWidth="1.6" />
      <circle cx="110" cy="90" r="34" className="fill-indigo-500/15 stroke-indigo-500" strokeWidth="1.4" />
      <circle cx="110" cy="90" r="6" className="fill-indigo-500/50" />
      <text x="110" y="140" className="fill-neutral-400" fontSize="9" textAnchor="middle">noyau (ADN)</text>
      <ellipse cx="225" cy="80" rx="42" ry="22" className="fill-[#10b981]/15 stroke-[#10b981]" strokeWidth="1.4" />
      <path d="M195,80 q10,-10 20,0 t20,0 t20,0" fill="none" className="stroke-[#10b981]" strokeWidth="1" />
      <text x="225" y="118" className="fill-neutral-400" fontSize="9" textAnchor="middle">mitochondrie (respiration)</text>
      <text x="40" y="38" className="fill-neutral-400" fontSize="9">membrane · cytoplasme</text>
    </svg>
  ),

  // Mitose — reproduction conforme
  "svt-mitose": (
    <svg viewBox="0 0 380 120" className="w-full max-w-[480px] mx-auto h-auto">
      {[["2n", 45], ["duplication", 130], ["séparation", 230], ["2 cellules 2n", 330]].map(([t, cx], i) => (
        <g key={i}>
          <circle cx={cx as number} cy="55" r="26" fill="none" className="stroke-neutral-500" strokeWidth="1.3" />
          {i === 0 && <><line x1={(cx as number) - 8} y1="50" x2={(cx as number) + 8} y2="50" className="stroke-[#0db8d3]" strokeWidth="3" /><line x1={(cx as number) - 8} y1="62" x2={(cx as number) + 8} y2="62" className="stroke-[#10b981]" strokeWidth="3" /></>}
          {i === 1 && <><line x1={(cx as number) - 8} y1="46" x2={(cx as number) + 8} y2="46" className="stroke-[#0db8d3]" strokeWidth="3" /><line x1={(cx as number) - 8} y1="50" x2={(cx as number) + 8} y2="50" className="stroke-[#0db8d3]/60" strokeWidth="3" /><line x1={(cx as number) - 8} y1="62" x2={(cx as number) + 8} y2="62" className="stroke-[#10b981]" strokeWidth="3" /><line x1={(cx as number) - 8} y1="66" x2={(cx as number) + 8} y2="66" className="stroke-[#10b981]/60" strokeWidth="3" /></>}
          {i === 2 && <><line x1={(cx as number) - 8} y1="40" x2={(cx as number) + 8} y2="40" className="stroke-[#0db8d3]" strokeWidth="3" /><line x1={(cx as number) - 8} y1="70" x2={(cx as number) + 8} y2="70" className="stroke-[#10b981]" strokeWidth="3" /></>}
          {i === 3 && <><circle cx={(cx as number) - 12} cy="55" r="14" fill="none" className="stroke-neutral-500" strokeWidth="1.1" /><circle cx={(cx as number) + 12} cy="55" r="14" fill="none" className="stroke-neutral-500" strokeWidth="1.1" /></>}
          <text x={cx as number} y="100" className="fill-neutral-400" fontSize="8" textAnchor="middle">{t as string}</text>
          {i < 3 && <line x1={(cx as number) + 28} y1="55" x2={(cx as number) + 55} y2="55" className="stroke-neutral-400" strokeWidth="1.2" markerEnd="url(#mitA)" />}
        </g>
      ))}
      <defs><marker id="mitA" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" className="fill-neutral-400" /></marker></defs>
    </svg>
  ),

  // Montage à reflux (estérification / saponification)
  "montage-reflux": (
    <svg viewBox="0 0 240 220" className="w-full max-w-[300px] mx-auto h-auto">
      <path d="M95,120 Q75,120 75,150 Q75,190 120,190 Q165,190 165,150 Q165,120 145,120 Z" fill="none" className="stroke-neutral-500" strokeWidth="1.6" />
      <path d="M100,160 Q120,175 140,160 L140,182 Q120,190 100,182 Z" className="fill-[#f59e0b]/20" />
      <rect x="108" y="30" width="24" height="94" rx="4" fill="none" className="stroke-neutral-500" strokeWidth="1.6" />
      <path d="M114,120 l0,-84 M126,120 l0,-84" className="stroke-[#0db8d3]/50" strokeWidth="1" />
      <text x="150" y="70" className="fill-neutral-400" fontSize="9">réfrigérant</text>
      <path d="M100,196 q20,14 40,0" fill="none" className="stroke-[#f59e0b]" strokeWidth="1.4" />
      <text x="120" y="214" className="fill-[#f59e0b]" fontSize="9" textAnchor="middle">chauffage</text>
    </svg>
  ),

  // Mesure du volume de gaz dégagé (suivi cinétique)
  "montage-gaz": (
    <svg viewBox="0 0 320 190" className="w-full max-w-[400px] mx-auto h-auto">
      <path d="M40,120 Q25,120 25,145 Q25,175 60,175 Q95,175 95,145 Q95,120 80,120 Z" fill="none" className="stroke-neutral-500" strokeWidth="1.6" />
      <path d="M45,150 Q60,160 75,150 L75,170 Q60,175 45,170 Z" className="fill-[#0db8d3]/20" />
      <line x1="60" y1="120" x2="60" y2="95" className="stroke-neutral-500" strokeWidth="1.4" />
      <line x1="60" y1="95" x2="180" y2="95" className="stroke-neutral-500" strokeWidth="1.4" />
      <rect x="200" y="40" width="40" height="120" rx="4" fill="none" className="stroke-neutral-500" strokeWidth="1.6" />
      <rect x="200" y="110" width="40" height="50" className="fill-[#10b981]/20" />
      {[50, 70, 90, 110, 130].map((y, i) => <line key={i} x1="240" y1={y} x2="248" y2={y} className="stroke-neutral-400" strokeWidth="0.8" />)}
      <line x1="180" y1="95" x2="220" y2="105" className="stroke-neutral-500" strokeWidth="1.4" />
      <text x="220" y="34" className="fill-neutral-400" fontSize="9" textAnchor="middle">seringue / éprouvette</text>
      <text x="60" y="192" className="fill-neutral-400" fontSize="9" textAnchor="middle">réaction (gaz)</text>
    </svg>
  ),

  // Effet de serre
  "svt-effet-serre": (
    <svg viewBox="0 0 320 180" className="w-full max-w-[400px] mx-auto h-auto">
      <circle cx="45" cy="35" r="16" className="fill-[#f59e0b]/60" />
      <path d="M55,45 L120,110 M70,40 L140,95" className="stroke-[#f59e0b]" strokeWidth="1.6" markerEnd="url(#serA)" />
      <path d="M20,120 Q160,95 300,120 L300,160 L20,160 Z" className="fill-[#10b981]/25 stroke-[#10b981]" strokeWidth="1.2" />
      <path d="M40,80 Q160,60 280,80" fill="none" className="stroke-neutral-400" strokeWidth="1.2" strokeDasharray="4 3" />
      <text x="270" y="74" className="fill-neutral-400" fontSize="8" textAnchor="end">atmosphère (gaz à effet de serre)</text>
      <path d="M150,118 L150,92 M180,118 L172,95" className="stroke-red-500" strokeWidth="1.4" markerEnd="url(#serB)" />
      <path d="M165,92 Q175,100 190,96" fill="none" className="stroke-red-500" strokeWidth="1.2" />
      <text x="160" y="150" className="fill-neutral-400" fontSize="9" textAnchor="middle">Terre</text>
      <defs>
        <marker id="serA" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L5,3 L0,6 Z" className="fill-[#f59e0b]" /></marker>
        <marker id="serB" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L5,3 L0,6 Z" className="fill-red-500" /></marker>
      </defs>
    </svg>
  ),
};
