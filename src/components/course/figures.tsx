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
