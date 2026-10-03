"use client";

/**
 * Espace de préparation — schémas et figures des problèmes (inline SVG, thème clair/sombre).
 * `figure: "<nom>"` dans un problème `bacup.prep/v2` → <PrepFigure name="<nom>" />.
 * Ces figures sont neutres : elles ne donnent ni valeur, ni sens, ni polarité que l'énoncé demande de trouver.
 * Un nom absent de ce module retombe sur la bibliothèque du cours (`CourseFigure`).
 */
import type { ReactNode } from "react";
import { CourseFigure } from "@/components/course/figures";

const OUT = "stroke-neutral-500 dark:stroke-neutral-400";
const AX = "stroke-neutral-400";
const TX = "fill-neutral-500 dark:fill-neutral-300";
const TXS = "fill-neutral-400";
const CY = "#0db8d3";
const GR = "#10b981";
const AM = "#f59e0b";
const RD = "#ef4444";
const GY = "#9ca3af";

/** Flèches colorées, ids préfixés par figure pour éviter toute collision dans la page. */
function Defs({ p }: { p: string }) {
  const mk = (id: string, c: string) => (
    <marker key={id} id={`${p}-${id}`} markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto" markerUnits="userSpaceOnUse">
      <path d="M0,0 L7,3.5 L0,7 Z" fill={c} />
    </marker>
  );
  return <defs>{mk("cy", CY)}{mk("gr", GR)}{mk("am", AM)}{mk("rd", RD)}{mk("gy", GY)}</defs>;
}

/** Tracé d'une fonction y = f(x) échantillonnée, en coordonnées SVG. */
function plot(f: (x: number) => number, x0: number, x1: number, n: number, sx: (x: number) => number, sy: (y: number) => number) {
  let d = "";
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n;
    d += `${i ? "L" : "M"}${sx(x).toFixed(1)},${sy(f(x)).toFixed(1)} `;
  }
  return d;
}

/** Courbe lisse passant par des points (Catmull-Rom → Bézier). */
function smooth(pts: [number, number][]) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0]},${p2[1]}`;
  }
  return d;
}

const svgCls = "w-full max-w-[520px] mx-auto h-auto";

/* ------------------------------------------------------------------ */
/* Mécanique                                                           */
/* ------------------------------------------------------------------ */

function projectilePortee() {
  const O = { x: 55, y: 190 }, S = { x: 225, y: 58 }, xe = 395;
  const y = (x: number) => S.y + (O.y - S.y) * Math.pow((x - S.x) / (S.x - O.x), 2);
  const slope = (2 * (O.y - S.y)) / (S.x - O.x); // pente (pixels) de la trajectoire en O
  const a = Math.atan(slope), L = 62;
  const vx = O.x + L * Math.cos(a), vy = O.y - L * Math.sin(a);
  const ar = 34;
  return (
    <svg viewBox="0 0 450 250" className={svgCls} role="img" aria-label="Trajectoire parabolique d'un projectile lancé depuis le sol, avec le sommet S et la portée">
      <Defs p="pp" />
      <line x1="30" y1={O.y} x2="430" y2={O.y} className={AX} strokeWidth="1.5" markerEnd="url(#pp-gy)" />
      <line x1={O.x} y1="212" x2={O.x} y2="18" className={AX} strokeWidth="1.5" markerEnd="url(#pp-gy)" />
      <text x="436" y={O.y + 14} className={TXS} fontSize="12">x</text>
      <text x={O.x - 12} y="20" className={TXS} fontSize="12">y</text>
      <text x={O.x - 8} y={O.y + 14} className={TX} fontSize="12" textAnchor="end">O</text>
      <path d={plot(y, O.x, xe, 80, (x) => x, (v) => v)} fill="none" stroke={CY} strokeWidth="2.6" />
      {/* sommet */}
      <line x1={S.x} y1={S.y} x2={S.x} y2={O.y} stroke={GY} strokeWidth="1" strokeDasharray="4 4" />
      <line x1={O.x} y1={S.y} x2={S.x} y2={S.y} stroke={GY} strokeWidth="1" strokeDasharray="4 4" />
      <circle cx={S.x} cy={S.y} r="4.5" fill={AM} />
      <text x={S.x + 9} y={S.y - 7} className={TX} fontSize="12">S</text>
      <text x={S.x} y={O.y + 14} className={TX} fontSize="11" textAnchor="middle">x<tspan fontSize="8" dy="2">S</tspan></text>
      <text x={O.x - 8} y={S.y + 4} className={TX} fontSize="11" textAnchor="end">y<tspan fontSize="8" dy="2">S</tspan></text>
      {/* point de chute et portée */}
      <circle cx={xe} cy={O.y} r="3.5" fill={GR} />
      <line x1={O.x} y1={O.y + 30} x2={xe} y2={O.y + 30} stroke={GR} strokeWidth="1.4" markerStart="url(#pp-gr)" markerEnd="url(#pp-gr)" />
      <line x1={xe} y1={O.y} x2={xe} y2={O.y + 36} stroke={GY} strokeWidth="1" strokeDasharray="3 3" />
      <text x={(O.x + xe) / 2} y={O.y + 46} className={TX} fontSize="11" textAnchor="middle">portée</text>
      {/* vitesse initiale et angle */}
      <line x1={O.x} y1={O.y} x2={vx} y2={vy} stroke={GR} strokeWidth="2.2" markerEnd="url(#pp-gr)" />
      <text x={vx + 6} y={vy + 2} fill={GR} fontSize="13">v⃗<tspan fontSize="9" dy="3">0</tspan></text>
      <path d={`M${O.x + ar},${O.y} A${ar},${ar} 0 0 0 ${O.x + ar * Math.cos(a)},${O.y - ar * Math.sin(a)}`} fill="none" className={OUT} strokeWidth="1.2" />
      <text x={O.x + ar + 6} y={O.y - 8} className={TX} fontSize="12">α</text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Montages de chimie                                                  */
/* ------------------------------------------------------------------ */

function montageGaz() {
  return (
    <svg viewBox="0 0 420 250" className={svgCls} role="img" aria-label="Montage de recueil d'un gaz : erlenmeyer, tube de dégagement, éprouvette graduée renversée sur cuve à eau">
      <Defs p="mg" />
      {/* erlenmeyer */}
      <path d="M62,168 L138,168 L151,198 Q153,206 144,206 L56,206 Q47,206 49,198 Z" fill={CY} fillOpacity="0.2" />
      <path d="M85,102 V130 L48,198 Q45,208 56,208 H144 Q155,208 152,198 L115,130 V102" fill="none" className={OUT} strokeWidth="1.8" />
      {[[70, 198], [82, 202], [94, 199], [106, 203], [118, 199], [130, 202]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2" className="fill-neutral-500" />)}
      <rect x="82" y="92" width="36" height="12" rx="2" fill={AM} fillOpacity="0.5" className={OUT} strokeWidth="1.2" />
      {/* tube de dégagement */}
      <path d="M100,92 V70 H236 V198 H268 V170" fill="none" className={OUT} strokeWidth="2" />
      {/* cuve à eau */}
      <rect x="196" y="150" width="200" height="76" rx="6" fill="none" className={OUT} strokeWidth="1.8" />
      <rect x="198" y="166" width="196" height="58" rx="5" fill={CY} fillOpacity="0.14" />
      {/* éprouvette renversée */}
      <rect x="250" y="52" width="40" height="136" rx="4" fill="none" className={OUT} strokeWidth="1.8" />
      <rect x="252" y="118" width="36" height="70" fill={CY} fillOpacity="0.2" />
      <line x1="252" y1="118" x2="288" y2="118" stroke={CY} strokeWidth="1.4" />
      {[64, 80, 96, 112, 128, 144, 160, 176].map((yy, i) => <line key={i} x1="290" y1={yy} x2={i % 2 ? 296 : 302} y2={yy} className={AX} strokeWidth="0.9" />)}
      {[[262, 156], [272, 142], [266, 128]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.6" fill="none" stroke={CY} strokeWidth="1" />)}
      {/* légendes */}
      <text x="100" y="232" className={TX} fontSize="11" textAnchor="middle">erlenmeyer</text>
      <text x="100" y="245" className={TXS} fontSize="9.5" textAnchor="middle">solution acide + métal</text>
      <text x="322" y="36" className={TX} fontSize="11" textAnchor="middle">éprouvette graduée</text>
      <text x="322" y="49" className={TXS} fontSize="9.5" textAnchor="middle">renversée</text>
      <line x1="289" y1="86" x2="322" y2="56" className={AX} strokeWidth="0.8" />
      <text x="380" y="98" className={TX} fontSize="11" textAnchor="middle">gaz recueilli</text>
      <line x1="289" y1="92" x2="338" y2="92" className={AX} strokeWidth="0.8" />
      <text x="330" y="244" className={TX} fontSize="11" textAnchor="middle">cuve à eau</text>
      <text x="164" y="64" className={TXS} fontSize="9.5" textAnchor="middle">tube de dégagement</text>
    </svg>
  );
}

function montageConductimetrie() {
  return (
    <svg viewBox="0 0 400 250" className={svgCls} role="img" aria-label="Montage de suivi conductimétrique : bécher agité, cellule conductimétrique et conductimètre">
      <Defs p="mc" />
      <path d="M120,92 V190 Q120,200 130,200 H230 Q240,200 240,190 V92" fill="none" className={OUT} strokeWidth="1.8" />
      <path d="M122,124 H238 V190 Q238,198 230,198 H130 Q122,198 122,190 Z" fill={CY} fillOpacity="0.2" />
      <line x1="122" y1="124" x2="238" y2="124" stroke={CY} strokeWidth="1.2" />
      <rect x="165" y="190" width="32" height="7" rx="3.5" fill={AM} />
      <rect x="100" y="206" width="160" height="26" rx="6" fill="none" className={OUT} strokeWidth="1.6" />
      <circle cx="228" cy="219" r="5" fill="none" className={OUT} strokeWidth="1.2" />
      <path d="M205,212 a8,8 0 1 1 0,14" fill="none" stroke={AM} strokeWidth="1.2" markerEnd="url(#mc-am)" />
      {/* cellule */}
      <rect x="170" y="40" width="20" height="106" rx="3" fill="none" className={OUT} strokeWidth="1.6" />
      <rect x="160" y="146" width="40" height="28" rx="3" fill="none" className={OUT} strokeWidth="1.6" />
      <line x1="170" y1="152" x2="170" y2="170" className="stroke-neutral-400" strokeWidth="3" />
      <line x1="190" y1="152" x2="190" y2="170" className="stroke-neutral-400" strokeWidth="3" />
      <text x="146" y="162" className={TX} fontSize="9.5" textAnchor="end">électrodes</text>
      {/* conductimètre */}
      <path d="M180,40 V24 H316 V58" fill="none" className={OUT} strokeWidth="1.6" />
      <rect x="266" y="58" width="100" height="64" rx="7" fill="none" className={OUT} strokeWidth="1.8" />
      <rect x="278" y="68" width="76" height="26" rx="3" fill={GR} fillOpacity="0.18" className="stroke-neutral-400" strokeWidth="1" />
      <text x="316" y="86" fill={GR} fontSize="13" textAnchor="middle">σ</text>
      <circle cx="288" cy="108" r="4" className="fill-neutral-400" />
      <circle cx="304" cy="108" r="4" className="fill-neutral-400" />
      <text x="316" y="140" className={TX} fontSize="11" textAnchor="middle">conductimètre</text>
      <text x="138" y="62" className={TX} fontSize="10.5" textAnchor="end">cellule conductimétrique</text>
      <line x1="140" y1="60" x2="168" y2="64" className={AX} strokeWidth="0.8" />
      <text x="250" y="178" className={TX} fontSize="10.5">mélange réactionnel</text>
      <line x1="248" y1="175" x2="214" y2="168" className={AX} strokeWidth="0.8" />
      <text x="180" y="246" className={TX} fontSize="10.5" textAnchor="middle">agitateur magnétique</text>
    </svg>
  );
}

function montageReflux() {
  return (
    <svg viewBox="0 0 380 310" className="w-full max-w-[400px] mx-auto h-auto" role="img" aria-label="Montage de chauffage à reflux : ballon, réfrigérant à eau vertical, chauffe-ballon">
      <Defs p="mr" />
      <clipPath id="mr-ballon"><circle cx="150" cy="208" r="50" /></clipPath>
      <rect x="95" y="206" width="110" height="60" clipPath="url(#mr-ballon)" fill={AM} fillOpacity="0.22" />
      <circle cx="150" cy="208" r="50" fill="none" className={OUT} strokeWidth="1.8" />
      <path d="M138,162 V128 M162,162 V128" className={OUT} strokeWidth="1.8" fill="none" />
      {[[128, 236], [150, 242], [172, 236], [140, 224], [162, 226]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.2" className="fill-neutral-500" />)}
      {/* réfrigérant */}
      <rect x="128" y="34" width="44" height="94" rx="4" fill="none" className={OUT} strokeWidth="1.8" />
      <rect x="141" y="34" width="18" height="94" fill={CY} fillOpacity="0.1" className={OUT} strokeWidth="1.2" />
      <path d="M128,60 H196 M128,106 H196" className={OUT} strokeWidth="0" />
      <line x1="172" y1="52" x2="212" y2="52" className={OUT} strokeWidth="1.8" />
      <line x1="172" y1="112" x2="212" y2="112" className={OUT} strokeWidth="1.8" />
      <line x1="244" y1="112" x2="214" y2="112" stroke={CY} strokeWidth="2.2" markerEnd="url(#mr-cy)" />
      <line x1="214" y1="52" x2="244" y2="52" stroke={CY} strokeWidth="2.2" markerEnd="url(#mr-cy)" />
      <text x="250" y="116" className={TX} fontSize="10.5">eau froide</text>
      <text x="250" y="129" className={TXS} fontSize="9.5">(entrée en bas)</text>
      <text x="250" y="56" className={TX} fontSize="10.5">eau (sortie)</text>
      {/* vapeurs / condensation */}
      <path d="M150,158 V134" stroke={AM} strokeWidth="1.6" markerEnd="url(#mr-am)" fill="none" />
      <path d="M146,70 q-3,8 0,14 M154,84 q-3,8 0,14" fill="none" stroke={GR} strokeWidth="1.2" strokeDasharray="2 3" />
      <text x="106" y="82" className={TXS} fontSize="9" textAnchor="end">vapeurs</text>
      <text x="106" y="93" className={TXS} fontSize="9" textAnchor="end">condensées</text>
      {/* chauffe-ballon */}
      <path d="M88,222 Q150,292 212,222 L212,270 H88 Z" fill="none" className={OUT} strokeWidth="1.6" />
      <rect x="82" y="270" width="136" height="14" rx="3" fill="none" className={OUT} strokeWidth="1.6" />
      <text x="150" y="300" className={TX} fontSize="10.5" textAnchor="middle">chauffe-ballon</text>
      <text x="68" y="212" className={TX} fontSize="10.5" textAnchor="end">ballon</text>
      <text x="68" y="224" className={TXS} fontSize="9.5" textAnchor="end">mélange</text>
      <text x="68" y="236" className={TXS} fontSize="9.5" textAnchor="end">+ pierre ponce</text>
      {/* support */}
      <line x1="320" y1="22" x2="320" y2="284" className={OUT} strokeWidth="3" />
      <rect x="296" y="284" width="64" height="8" rx="2" className="fill-neutral-400" />
      <line x1="320" y1="82" x2="172" y2="82" className={OUT} strokeWidth="2.4" />
      <line x1="320" y1="82" x2="320" y2="82" />
    </svg>
  );
}

function pileDaniell() {
  const beaker = (x: number) => `M${x},112 V224 Q${x},232 ${x + 8},232 H${x + 132} Q${x + 140},232 ${x + 140},224 V112`;
  return (
    <svg viewBox="0 0 470 280" className={svgCls} role="img" aria-label="Montage d'une pile zinc-cuivre : deux demi-piles reliées par un pont salin, fermées sur un conducteur ohmique et un ampèremètre">
      <Defs p="pd" />
      {/* circuit extérieur */}
      <path d="M100,76 V50 H172" fill="none" className={OUT} strokeWidth="2" />
      <rect x="172" y="40" width="46" height="20" rx="2" fill="none" className={OUT} strokeWidth="1.8" />
      <text x="195" y="55" className={TX} fontSize="12" textAnchor="middle">R</text>
      <path d="M218,50 H262" fill="none" className={OUT} strokeWidth="2" />
      <circle cx="276" cy="50" r="14" fill="none" className={OUT} strokeWidth="1.8" />
      <text x="276" y="55" className={TX} fontSize="13" textAnchor="middle">A</text>
      <path d="M290,50 H362 V76" fill="none" className={OUT} strokeWidth="2" />
      <text x="195" y="30" className={TXS} fontSize="9.5" textAnchor="middle">conducteur ohmique</text>
      <text x="276" y="26" className={TXS} fontSize="9.5" textAnchor="middle">ampèremètre</text>
      {/* béchers */}
      <path d="M42,140 H178 V224 Q178,230 170,230 H50 Q42,230 42,224 Z" fill={GY} fillOpacity="0.2" />
      <path d="M292,140 H428 V224 Q428,230 420,230 H300 Q292,230 292,224 Z" fill={CY} fillOpacity="0.22" />
      <path d={beaker(40)} fill="none" className={OUT} strokeWidth="1.8" />
      <path d={beaker(290)} fill="none" className={OUT} strokeWidth="1.8" />
      {/* électrodes */}
      <rect x="95" y="76" width="10" height="132" rx="1.5" fill={GY} className={OUT} strokeWidth="1" />
      <rect x="357" y="76" width="10" height="132" rx="1.5" fill="#d97706" fillOpacity="0.85" className={OUT} strokeWidth="1" />
      <text x="100" y="246" className={TX} fontSize="11" textAnchor="middle">lame de zinc</text>
      <text x="362" y="246" className={TX} fontSize="11" textAnchor="middle">lame de cuivre</text>
      <text x="108" y="222" className={TXS} fontSize="9.5" textAnchor="middle" dx="34">Zn²⁺, SO₄²⁻</text>
      <text x="362" y="222" className={TXS} fontSize="9.5" textAnchor="middle" dx="-44">Cu²⁺, SO₄²⁻</text>
      {/* pont salin */}
      <path d="M142,180 V112 Q142,98 156,98 H326 Q340,98 340,112 V180" fill="none" stroke={AM} strokeOpacity="0.45" strokeWidth="14" strokeLinecap="butt" />
      <path d="M142,180 V112 Q142,98 156,98 H326 Q340,98 340,112 V180" fill="none" className={OUT} strokeWidth="1" strokeDasharray="1 5" />
      <text x="241" y="116" className={TX} fontSize="11" textAnchor="middle">pont salin</text>
      <text x="241" y="129" className={TXS} fontSize="9.5" textAnchor="middle">K⁺, NO₃⁻</text>
    </svg>
  );
}

function montageElectrolyse() {
  return (
    <svg viewBox="0 0 460 306" className={svgCls} role="img" aria-label="Voltamètre : cuve d'électrolyse à électrodes de graphite, deux éprouvettes renversées et générateur">
      <Defs p="me" />
      <rect x="110" y="156" width="240" height="84" rx="8" fill="none" className={OUT} strokeWidth="1.8" />
      <rect x="112" y="174" width="236" height="64" rx="6" fill={CY} fillOpacity="0.14" />
      {/* éprouvettes */}
      <rect x="148" y="56" width="48" height="140" rx="4" fill={CY} fillOpacity="0.18" className={OUT} strokeWidth="1.8" />
      <rect x="264" y="56" width="48" height="140" rx="4" fill={CY} fillOpacity="0.18" className={OUT} strokeWidth="1.8" />
      {[72, 92, 112, 132, 152, 172].map((y, i) => (
        <g key={i}><line x1="196" y1={y} x2={i % 2 ? 201 : 206} y2={y} className={AX} strokeWidth="0.8" /><line x1="312" y1={y} x2={i % 2 ? 317 : 322} y2={y} className={AX} strokeWidth="0.8" /></g>
      ))}
      {/* électrodes de graphite */}
      <rect x="168" y="120" width="8" height="120" fill="#4b5563" />
      <rect x="284" y="120" width="8" height="120" fill="#4b5563" />
      <text x="160" y="226" className={TX} fontSize="10" textAnchor="end">graphite</text>
      <text x="300" y="226" className={TX} fontSize="10">graphite</text>
      <text x="230" y="214" className={TXS} fontSize="9" textAnchor="middle">Na⁺, SO₄²⁻, H₂O</text>
      {/* fils et générateur (les fils traversent le fond de la cuve) */}
      <path d="M172,240 V268 H190" fill="none" className={OUT} strokeWidth="1.8" />
      <path d="M288,240 V268 H270" fill="none" className={OUT} strokeWidth="1.8" />
      <rect x="190" y="252" width="80" height="32" rx="5" fill="none" className={OUT} strokeWidth="1.8" />
      <text x="230" y="273" className={TX} fontSize="13" textAnchor="middle">G</text>
      <text x="184" y="262" className={TX} fontSize="13" textAnchor="end">−</text>
      <text x="278" y="262" className={TX} fontSize="13">+</text>
      <text x="172" y="42" className={TX} fontSize="10.5" textAnchor="middle">éprouvette 1</text>
      <text x="288" y="42" className={TX} fontSize="10.5" textAnchor="middle">éprouvette 2</text>
      <text x="230" y="298" className={TXS} fontSize="9.5" textAnchor="middle">état initial : éprouvettes pleines de solution</text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Acide-base et dosages                                               */
/* ------------------------------------------------------------------ */

function predominance() {
  return (
    <svg viewBox="0 0 460 170" className={svgCls} role="img" aria-label="Diagramme de prédominance d'un couple acide/base selon le pH">
      <Defs p="pr" />
      <rect x="30" y="38" width="190" height="52" rx="4" fill={AM} fillOpacity="0.16" />
      <rect x="220" y="38" width="190" height="52" rx="4" fill={GR} fillOpacity="0.16" />
      <line x1="30" y1="90" x2="430" y2="90" className={AX} strokeWidth="1.6" markerEnd="url(#pr-gy)" />
      <text x="436" y="94" className={TXS} fontSize="12">pH</text>
      <line x1="220" y1="30" x2="220" y2="98" className={OUT} strokeWidth="1.4" strokeDasharray="4 4" />
      {[[130, "pK", "A", " − 1"], [220, "pK", "A", ""], [310, "pK", "A", " + 1"]].map(([x, a, b, c], i) => (
        <g key={i}>
          <line x1={x as number} y1="86" x2={x as number} y2="94" className={AX} strokeWidth="1.4" />
          <text x={x as number} y="112" className={TX} fontSize="12" textAnchor="middle">{a as string}<tspan fontSize="8" dy="2">{b as string}</tspan><tspan dy="-2">{c as string}</tspan></text>
        </g>
      ))}
      <text x="125" y="58" className={TX} fontSize="13" textAnchor="middle">AH prédomine</text>
      <text x="125" y="76" className={TXS} fontSize="10.5" textAnchor="middle">[AH] &gt; [A⁻]</text>
      <text x="315" y="58" className={TX} fontSize="13" textAnchor="middle">A⁻ prédomine</text>
      <text x="315" y="76" className={TXS} fontSize="10.5" textAnchor="middle">[A⁻] &gt; [AH]</text>
      <text x="220" y="24" className={TX} fontSize="10.5" textAnchor="middle">[AH] = [A⁻]</text>
      <text x="125" y="146" className={TXS} fontSize="10.5" textAnchor="middle">pH &lt; pK<tspan fontSize="8" dy="2">A</tspan></text>
      <text x="315" y="146" className={TXS} fontSize="10.5" textAnchor="middle">pH &gt; pK<tspan fontSize="8" dy="2">A</tspan></text>
    </svg>
  );
}

function indicateursColores() {
  const X0 = 40, X1 = 430, px = (ph: number) => X0 + ((X1 - X0) * ph) / 14;
  const stop = (ph: number, c: string, i: number) => <stop key={i} offset={`${(ph / 14) * 100}%`} stopColor={c} />;
  const rows: { name: string; id: string; y: number; stops: [number, string][]; ends: [number, string][]; clear?: boolean }[] = [
    { name: "Hélianthine", id: "ic-h", y: 36, stops: [[0, "#ef4444"], [3.1, "#ef4444"], [4.4, "#facc15"], [14, "#facc15"]], ends: [[3.1, "3,1"], [4.4, "4,4"]] },
    { name: "Bleu de bromothymol", id: "ic-b", y: 100, stops: [[0, "#facc15"], [6.0, "#facc15"], [7.6, "#3b82f6"], [14, "#3b82f6"]], ends: [[6.0, "6,0"], [7.6, "7,6"]] },
    { name: "Phénolphtaléine", id: "ic-p", y: 164, stops: [[0, "#f3f4f6"], [8.2, "#f3f4f6"], [10.0, "#ec4899"], [14, "#ec4899"]], ends: [[8.2, "8,2"], [10.0, "10,0"]], clear: true },
  ];
  return (
    <svg viewBox="0 0 470 244" className={svgCls} role="img" aria-label="Zones de virage et couleurs de trois indicateurs colorés selon le pH">
      <defs>
        {rows.map((r) => (
          <linearGradient key={r.id} id={r.id} x1="0" x2="1" y1="0" y2="0" gradientUnits="objectBoundingBox">{r.stops.map(([p, c], i) => stop(p, c, i))}</linearGradient>
        ))}
      </defs>
      {rows.map((r) => (
        <g key={r.id}>
          <text x={X0} y={r.y - 6} className={TX} fontSize="11.5">{r.name}</text>
          <rect x={X0} y={r.y} width={X1 - X0} height="20" rx="4" fill={`url(#${r.id})`} className={r.clear ? OUT : ""} stroke={r.clear ? undefined : "none"} strokeWidth="1" />
          {r.ends.map(([p, t]) => (
            <g key={t}>
              <line x1={px(p)} y1={r.y - 2} x2={px(p)} y2={r.y + 24} className={OUT} strokeWidth="1" strokeDasharray="2 2" />
              <text x={px(p)} y={r.y + 35} className={TXS} fontSize="9.5" textAnchor="middle">{t}</text>
            </g>
          ))}
        </g>
      ))}
      <line x1={X0} y1="214" x2={X1} y2="214" className={AX} strokeWidth="1.4" />
      {[0, 2, 4, 6, 8, 10, 12, 14].map((p) => (
        <g key={p}><line x1={px(p)} y1="210" x2={px(p)} y2="218" className={AX} strokeWidth="1.2" /><text x={px(p)} y="231" className={TX} fontSize="10.5" textAnchor="middle">{p}</text></g>
      ))}
      <text x={X1 + 10} y="233" className={TXS} fontSize="11">pH</text>
    </svg>
  );
}

/** pH d'un titrage acide faible (pKA 4,75) – base forte, par la neutralité électrique (résolution exacte). */
function phTitrage(v: number) {
  const CA = 0.1, VA = 20, CB = 0.1, Ka = Math.pow(10, -4.75), Kw = 1e-14;
  const na = (CB * v) / (VA + v), ca = (CA * VA) / (VA + v);
  let lo = -13.9, hi = -0.5;
  for (let i = 0; i < 60; i++) {
    const m = (lo + hi) / 2, h = Math.pow(10, m);
    const g = h + na - Kw / h - (ca * Ka) / (Ka + h);
    if (g > 0) hi = m; else lo = m;
  }
  return -(lo + hi) / 2;
}

function dosageDerivee() {
  const VE = 20, VM = 32, sx = (v: number) => 62 + (v / VM) * 330;
  const pH = (v: number) => phTitrage(v);
  const syP = (p: number) => 142 - ((p - 2.5) / (12.5 - 2.5)) * 118;
  const d = (v: number) => phTitrage(v + 0.5) - phTitrage(v - 0.5); // différences finies sur 1 mL, comme au tableur
  let dmax = 0;
  for (let v = 0.6; v < VM - 0.6; v += 0.1) dmax = Math.max(dmax, d(v));
  const syD = (y: number) => 262 - (Math.min(y, dmax) / dmax) * 84;
  return (
    <svg viewBox="0 0 440 320" className={svgCls} role="img" aria-label="Dosage pH-métrique : courbe pH en fonction du volume versé et courbe dérivée dont le maximum repère le volume équivalent">
      <Defs p="dd" />
      <line x1="62" y1="146" x2="410" y2="146" className={AX} strokeWidth="1.5" markerEnd="url(#dd-gy)" />
      <line x1="62" y1="146" x2="62" y2="14" className={AX} strokeWidth="1.5" markerEnd="url(#dd-gy)" />
      <text x="56" y="22" className={TX} fontSize="12" textAnchor="end">pH</text>
      <path d={plot(pH, 0.05, VM - 0.1, 300, sx, syP)} fill="none" stroke={CY} strokeWidth="2.6" />
      <line x1="62" y1="266" x2="410" y2="266" className={AX} strokeWidth="1.5" markerEnd="url(#dd-gy)" />
      <line x1="62" y1="266" x2="62" y2="160" className={AX} strokeWidth="1.5" markerEnd="url(#dd-gy)" />
      <text x="56" y="170" className={TX} fontSize="12" textAnchor="end" >dpH</text>
      <text x="56" y="182" className={TX} fontSize="12" textAnchor="end">dV</text>
      <path d={plot(d, 0.6, VM - 0.6, 400, sx, syD)} fill="none" stroke={GR} strokeWidth="2.4" />
      <line x1={sx(VE)} y1="14" x2={sx(VE)} y2="270" stroke={AM} strokeWidth="1.2" strokeDasharray="5 4" />
      <circle cx={sx(VE)} cy={syD(dmax)} r="4" fill={AM} />
      <text x={sx(VE) + 8} y={syD(dmax) + 14} fill={AM} fontSize="12">maximum</text>
      <text x={sx(VE)} y="286" fill={AM} fontSize="12" textAnchor="middle">V<tspan fontSize="8" dy="2">E</tspan></text>
      <text x="402" y="282" className={TXS} fontSize="11">V</text>
    </svg>
  );
}

function dosageConductimetrique() {
  // modèle de l'énoncé : σ = 500 − 28,0 V (avant) puis σ = −150 + 24,0 V (après), V_E = 12,5 mL (échelle respectée, sans graduation)
  const sx = (v: number) => 70 + (v / 25) * 310, sy = (s: number) => 196 - (s / 540) * 170;
  const VE = 650 / 52, sE = 500 - 28 * VE;
  return (
    <svg viewBox="0 0 420 250" className={svgCls} role="img" aria-label="Dosage conductimétrique : deux droites de pentes opposées qui se coupent au volume équivalent">
      <Defs p="dc" />
      <line x1="70" y1="196" x2="396" y2="196" className={AX} strokeWidth="1.5" markerEnd="url(#dc-gy)" />
      <line x1="70" y1="196" x2="70" y2="14" className={AX} strokeWidth="1.5" markerEnd="url(#dc-gy)" />
      <text x="62" y="22" className={TX} fontSize="12" textAnchor="end">σ</text>
      <text x="394" y="214" className={TXS} fontSize="11">V</text>
      <line x1={sx(0)} y1={sy(500)} x2={sx(VE)} y2={sy(sE)} stroke={CY} strokeWidth="2.6" />
      <line x1={sx(VE)} y1={sy(sE)} x2={sx(22.5)} y2={sy(-150 + 24 * 22.5)} stroke={GR} strokeWidth="2.6" />
      <line x1={sx(VE)} y1={sy(sE)} x2={sx(VE)} y2="196" stroke={AM} strokeWidth="1.2" strokeDasharray="5 4" />
      <circle cx={sx(VE)} cy={sy(sE)} r="4.5" fill={AM} />
      <text x={sx(VE)} y="214" fill={AM} fontSize="12" textAnchor="middle">V<tspan fontSize="8" dy="2">E</tspan></text>
      <text x={sx(3.2)} y={sy(500 - 28 * 3.2) - 10} fill={CY} fontSize="11">avant l'équivalence</text>
      <text x={sx(15)} y={sy(sE) + 4} fill={GR} fontSize="11">après l'équivalence</text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Équilibre                                                           */
/* ------------------------------------------------------------------ */

function equilibreDynamique() {
  const T = [0, 0.5, 1, 2, 4, 8], E1 = [0, 0.38, 0.52, 0.62, 0.67, 0.67], E2 = [1.0, 0.8, 0.72, 0.68, 0.67, 0.67];
  const sx = (t: number) => 62 + (t / 8) * 330, sy = (n: number) => 212 - n * 180;
  const pts = (E: number[]): [number, number][] => T.map((t, i) => [Math.round(sx(t) * 10) / 10, Math.round(sy(E[i]) * 10) / 10]);
  return (
    <svg viewBox="0 0 440 270" className={svgCls} role="img" aria-label="Quantité d'ester en fonction du temps pour l'estérification et pour l'hydrolyse : les deux courbes rejoignent le même palier">
      <Defs p="eq" />
      <line x1="62" y1="212" x2="412" y2="212" className={AX} strokeWidth="1.5" markerEnd="url(#eq-gy)" />
      <line x1="62" y1="212" x2="62" y2="14" className={AX} strokeWidth="1.5" markerEnd="url(#eq-gy)" />
      <text x="418" y="216" className={TXS} fontSize="11">t (h)</text>
      <text x="62" y="10" className={TX} fontSize="11" textAnchor="middle">n(ester) (mol)</text>
      {[0, 2, 4, 6, 8].map((t) => (
        <g key={t}><line x1={sx(t)} y1="208" x2={sx(t)} y2="216" className={AX} strokeWidth="1.2" /><text x={sx(t)} y="230" className={TX} fontSize="10.5" textAnchor="middle">{t}</text></g>
      ))}
      {[0, 0.5, 1].map((n) => (
        <g key={n}><line x1="58" y1={sy(n)} x2="66" y2={sy(n)} className={AX} strokeWidth="1.2" /><text x="52" y={sy(n) + 4} className={TX} fontSize="10.5" textAnchor="end">{String(n).replace(".", ",")}</text></g>
      ))}
      <line x1="62" y1={sy(0.67)} x2="400" y2={sy(0.67)} className={OUT} strokeWidth="1" strokeDasharray="4 4" />
      <text x="396" y={sy(0.67) - 6} className={TXS} fontSize="10.5" textAnchor="end">palier d'équilibre</text>
      <path d={smooth(pts(E1))} fill="none" stroke={CY} strokeWidth="2.6" />
      <path d={smooth(pts(E2))} fill="none" stroke={AM} strokeWidth="2.6" />
      {pts(E1).map(([x, y], i) => <circle key={"a" + i} cx={x} cy={y} r="3.4" fill={CY} />)}
      {pts(E2).map(([x, y], i) => <circle key={"b" + i} cx={x} cy={y} r="3.4" fill={AM} />)}
      <circle cx="66" cy="252" r="4" fill={CY} /><text x="75" y="256" className={TX} fontSize="10.5">expérience 1 (acide + alcool)</text>
      <circle cx="244" cy="252" r="4" fill={AM} /><text x="253" y="256" className={TX} fontSize="10.5">expérience 2 (ester + eau)</text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Signaux : modulation / démodulation                                 */
/* ------------------------------------------------------------------ */

function modulationAmplitude() {
  const m = 0.625, ratio = 20, X0 = 56, W = 380, cy = 125, k = 62; // 2 périodes du modulant, 20 périodes de porteuse par période du modulant (échelle de lisibilité)
  const sx = (t: number) => X0 + (t / 2) * W, sy = (a: number) => cy - a * k;
  const env = (t: number) => 1 + m * Math.cos(2 * Math.PI * t);
  const u = (t: number) => env(t) * Math.cos(2 * Math.PI * ratio * t);
  return (
    <svg viewBox="0 0 470 284" className={svgCls} role="img" aria-label="Signal modulé en amplitude avec son enveloppe, ses amplitudes maximale et minimale">
      <Defs p="ma" />
      <line x1={X0 - 8} y1={cy} x2="452" y2={cy} className={AX} strokeWidth="1.5" markerEnd="url(#ma-gy)" />
      <line x1={X0} y1="214" x2={X0} y2="10" className={AX} strokeWidth="1.5" markerEnd="url(#ma-gy)" />
      <text x="458" y={cy + 4} className={TXS} fontSize="11">t</text>
      <text x={X0 - 6} y="16" className={TX} fontSize="11" textAnchor="end">u</text>
      <path d={plot(env, 0, 2, 200, sx, sy)} fill="none" stroke={AM} strokeWidth="1.6" strokeDasharray="5 4" />
      <path d={plot((t) => -env(t), 0, 2, 200, sx, sy)} fill="none" stroke={AM} strokeWidth="1.6" strokeDasharray="5 4" />
      <path d={plot(u, 0, 2, 1600, sx, sy)} fill="none" stroke={CY} strokeWidth="1.1" />
      {/* U_max / U_min */}
      <line x1={sx(0)} y1={sy(1 + m)} x2="452" y2={sy(1 + m)} className={OUT} strokeWidth="0.8" strokeDasharray="2 3" />
      <line x1={sx(0.5)} y1={sy(1 - m)} x2="452" y2={sy(1 - m)} className={OUT} strokeWidth="0.8" strokeDasharray="2 3" />
      <text x="452" y={sy(1 + m) - 4} fill={AM} fontSize="11.5" textAnchor="end">U<tspan fontSize="8" dy="2">max</tspan></text>
      <text x="452" y={sy(1 - m) - 4} fill={AM} fontSize="11.5" textAnchor="end">U<tspan fontSize="8" dy="2">min</tspan></text>
      <line x1={sx(0)} y1="240" x2={sx(1)} y2="240" stroke={GR} strokeWidth="1.2" markerStart="url(#ma-gr)" markerEnd="url(#ma-gr)" />
      <text x={sx(0.5)} y="254" className={TX} fontSize="10.5" textAnchor="middle">T<tspan fontSize="8" dy="2">s</tspan><tspan dy="-2"> : période du signal modulant</tspan></text>
      <line x1="60" y1="272" x2="84" y2="272" stroke={CY} strokeWidth="1.6" /><text x="90" y="276" className={TX} fontSize="10.5">signal modulé u(t)</text>
      <line x1="226" y1="272" x2="250" y2="272" stroke={AM} strokeWidth="1.6" strokeDasharray="5 4" /><text x="256" y="276" className={TX} fontSize="10.5">enveloppe</text>
      <text x="456" y="276" className={TXS} fontSize="9" textAnchor="end">schématique : F ≫ f</text>
    </svg>
  );
}

function demodulationEnveloppe() {
  const m = 0.5, ratio = 24, X0 = 40, W = 400, k = 30;
  const sx = (t: number) => X0 + (t / 2) * W;
  const cyU = 178, cyS = 282;
  const env = (t: number) => 1 + m * Math.cos(2 * Math.PI * t);
  const u = (t: number) => env(t) * Math.cos(2 * Math.PI * ratio * t);
  // détecteur : diode idéale + R∥C, τ = RC ≈ 6 périodes de porteuse
  const N = 1600, dt = 2 / N, tau = 6 / ratio;
  const out: number[] = []; let v = 0;
  for (let i = 0; i <= N; i++) { const t = i * dt; v = Math.max(Math.max(u(t), 0), v * Math.exp(-dt / tau)); out.push(v); }
  const outPath = out.map((y, i) => `${i ? "L" : "M"}${sx(i * dt).toFixed(1)},${(cyU - y * k).toFixed(1)}`).join(" ");
  return (
    <svg viewBox="0 0 480 320" className={svgCls} role="img" aria-label="Détection d'enveloppe : schéma du détecteur (diode, R en parallèle avec C, condensateur de liaison) et allure des signaux">
      <Defs p="de" />
      {/* schéma du détecteur */}
      <path d="M30,34 H88 M116,34 H170 H252" fill="none" className={OUT} strokeWidth="1.8" />
      <path d="M88,24 V44 L106,34 Z" className="fill-neutral-400" />
      <line x1="106" y1="24" x2="106" y2="44" className={OUT} strokeWidth="2" />
      <line x1="106" y1="34" x2="116" y2="34" className={OUT} strokeWidth="1.8" />
      <line x1="170" y1="34" x2="170" y2="46" className={OUT} strokeWidth="1.8" />
      <rect x="163" y="46" width="14" height="30" fill="none" className={OUT} strokeWidth="1.6" />
      <line x1="170" y1="76" x2="170" y2="96" className={OUT} strokeWidth="1.8" />
      <line x1="212" y1="34" x2="212" y2="56" className={OUT} strokeWidth="1.8" />
      <line x1="202" y1="56" x2="222" y2="56" className={OUT} strokeWidth="2.4" />
      <line x1="202" y1="63" x2="222" y2="63" className={OUT} strokeWidth="2.4" />
      <line x1="212" y1="63" x2="212" y2="96" className={OUT} strokeWidth="1.8" />
      <line x1="30" y1="96" x2="342" y2="96" className={OUT} strokeWidth="1.8" />
      <circle cx="170" cy="34" r="2.6" className="fill-neutral-400" />
      <circle cx="212" cy="34" r="2.6" className="fill-neutral-400" />
      <circle cx="170" cy="96" r="2.6" className="fill-neutral-400" />
      <circle cx="212" cy="96" r="2.6" className="fill-neutral-400" />
      {/* condensateur de liaison */}
      <line x1="252" y1="34" x2="270" y2="34" className={OUT} strokeWidth="1.8" />
      <line x1="270" y1="24" x2="270" y2="44" className={OUT} strokeWidth="2.4" />
      <line x1="278" y1="24" x2="278" y2="44" className={OUT} strokeWidth="2.4" />
      <line x1="278" y1="34" x2="342" y2="34" className={OUT} strokeWidth="1.8" />
      <text x="30" y="22" className={TXS} fontSize="10">entrée</text>
      <text x="97" y="62" className={TXS} fontSize="10" textAnchor="middle">diode</text>
      <text x="152" y="64" className={TX} fontSize="11" textAnchor="end">R</text>
      <text x="236" y="62" className={TX} fontSize="11">C</text>
      <text x="274" y="64" className={TXS} fontSize="9.5" textAnchor="middle">liaison</text>
      <text x="342" y="22" className={TXS} fontSize="10" textAnchor="end">sortie</text>
      {/* signaux */}
      <text x={X0} y="124" className={TX} fontSize="11">Après la diode et le dipôle R∥C (RC grand devant 1/F, petit devant 1/f)</text>
      <line x1={X0} y1={cyU} x2={X0 + W + 14} y2={cyU} className={AX} strokeWidth="1" />
      <path d={plot(u, 0, 2, 1600, sx, (a) => cyU - a * k)} fill="none" stroke={CY} strokeOpacity="0.35" strokeWidth="1" />
      <path d={outPath} fill="none" stroke={AM} strokeWidth="1.8" />
      <path d={plot(env, 0, 2, 200, sx, (a) => cyU - a * k)} fill="none" className={OUT} strokeWidth="1" strokeDasharray="4 4" />
      <text x={X0 + W + 14} y={cyU + 14} className={TXS} fontSize="10.5" textAnchor="end">t</text>
      <text x={X0} y="244" className={TX} fontSize="11">Après le condensateur de liaison : la composante continue disparaît</text>
      <line x1={X0} y1={cyS} x2={X0 + W + 14} y2={cyS} className={AX} strokeWidth="1" />
      <path d={plot((t) => m * Math.cos(2 * Math.PI * t), 0, 2, 200, sx, (a) => cyS - a * 28)} fill="none" stroke={GR} strokeWidth="2" />
      <text x={X0 + W + 14} y={cyS + 14} className={TXS} fontSize="10.5" textAnchor="end">t</text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Atome                                                               */
/* ------------------------------------------------------------------ */

function niveauxEnergie() {
  // échelle linéaire en énergie : E = −13,6/n² eV ; E = 0 en y = 34, E(n=1) en y = 318 (aucune valeur n'est affichée)
  const y = (n: number) => 34 + (13.6 / (n * n)) * ((318 - 34) / 13.6);
  const X0 = 90, X1 = 300;
  const lab: [number, number, string][] = [[5, 58, "n = 5"], [4, 74, "n = 4"], [3, 90, "n = 3"], [2, y(2), "n = 2"], [1, y(1), "n = 1"]];
  return (
    <svg viewBox="0 0 470 350" className={svgCls} role="img" aria-label="Diagramme des niveaux d'énergie de l'atome d'hydrogène et transition d'émission du niveau 5 au niveau 2">
      <Defs p="ne" />
      <line x1="62" y1="338" x2="62" y2="14" className={AX} strokeWidth="1.5" markerEnd="url(#ne-gy)" />
      <text x="56" y="14" className={TX} fontSize="12" textAnchor="end">E</text>
      <line x1={X0} y1="34" x2={X1} y2="34" className={OUT} strokeWidth="1.4" strokeDasharray="5 4" />
      <text x={X1 + 8} y="38" className={TX} fontSize="11.5">n = ∞ <tspan className={TXS} fontSize="9.5">(ionisation)</tspan></text>
      {lab.map(([n, ly, t]) => (
        <g key={n}>
          <line x1={X0} y1={y(n)} x2={X1} y2={y(n)} stroke={n === 1 ? GR : GY} strokeWidth={n === 1 ? 2.4 : 2} />
          {ly !== y(n) && <line x1={X1} y1={y(n)} x2={X1 + 12} y2={ly} className={OUT} strokeWidth="0.8" />}
          <text x={X1 + (ly !== y(n) ? 14 : 8)} y={ly + 4} className={TX} fontSize="11.5">{t}</text>
        </g>
      ))}
      <text x={X1 + 8} y={y(1) + 17} className={TXS} fontSize="9.5">état fondamental</text>
      {/* transition 5 → 2 */}
      <line x1="180" y1={y(5)} x2="180" y2={y(2) - 2} stroke={RD} strokeWidth="2.2" markerEnd="url(#ne-rd)" />
      <path d={`M190,${y(2) - 6} q8,-8 16,0 t16,0 t16,0 t16,0`} fill="none" stroke={RD} strokeWidth="1.8" strokeLinecap="round" />
      <text x="200" y={(y(5) + y(2)) / 2 - 8} fill={RD} fontSize="11.5">émission</text>
      <text x="200" y={(y(5) + y(2)) / 2 + 6} fill={RD} fontSize="11.5">d'un photon</text>
      <text x="160" y={(y(5) + y(2)) / 2 + 4} fill={RD} fontSize="12" textAnchor="end">5 → 2</text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */

const PREP_FIGURES: Record<string, { svg: ReactNode; caption: string }> = {
  "projectile-portee": { svg: projectilePortee(), caption: "Trajectoire d'un projectile lancé depuis le sol : sommet S et portée" },
  "montage-gaz": { svg: montageGaz(), caption: "Recueil d'un gaz sur cuve à eau, pour suivre l'avancement par le volume dégagé" },
  "montage-conductimetrie": { svg: montageConductimetrie(), caption: "Suivi conductimétrique d'une transformation chimique" },
  "montage-reflux": { svg: montageReflux(), caption: "Chauffage à reflux : le réfrigérant renvoie les vapeurs condensées dans le ballon" },
  "pile-daniell": { svg: pileDaniell(), caption: "Pile zinc-cuivre fermée sur un conducteur ohmique" },
  "montage-electrolyse": { svg: montageElectrolyse(), caption: "Voltamètre : électrolyse de l'eau avec recueil des gaz" },
  "predominance-acide-base": { svg: predominance(), caption: "Domaines de prédominance du couple AH/A⁻ selon le pH" },
  "indicateurs-colores": { svg: indicateursColores(), caption: "Zones de virage de trois indicateurs colorés" },
  "dosage-derivee": { svg: dosageDerivee(), caption: "Dosage pH-métrique : le maximum de dpH/dV repère le volume équivalent" },
  "dosage-conductimetrique": { svg: dosageConductimetrique(), caption: "Dosage conductimétrique : rupture de pente au volume équivalent" },
  "equilibre-dynamique": { svg: equilibreDynamique(), caption: "Estérification et hydrolyse : un même état d'équilibre" },
  "modulation-amplitude": { svg: modulationAmplitude(), caption: "Signal modulé en amplitude et son enveloppe" },
  "demodulation-enveloppe": { svg: demodulationEnveloppe(), caption: "Détection d'enveloppe puis suppression de la composante continue" },
  "niveaux-energie": { svg: niveauxEnergie(), caption: "Niveaux d'énergie de l'atome d'hydrogène et transition d'émission 5 → 2" },
};

/** Figure d'un problème de l'Espace de préparation (schéma neutre, thème clair/sombre). */
export function PrepFigure({ name, caption }: { name: string; caption?: string }) {
  const f = PREP_FIGURES[name];
  if (!f) return <CourseFigure name={name} caption={caption} />;
  const cap = caption ?? f.caption;
  return (
    <figure className="my-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] p-4">
      <div className="w-full overflow-x-auto">{f.svg}</div>
      {cap && <figcaption className="mt-2 text-center text-xs text-neutral-400">{cap}</figcaption>}
    </figure>
  );
}

export const PREP_FIGURE_NAMES = Object.keys(PREP_FIGURES);
