"use client";

/** Dependency-free glassy area chart. Feed it a series of values (e.g. cumulative XP). */
export function ProgressCurve({ points }: { points: number[] }) {
  const w = 600;
  const h = 160;
  const pad = 10;
  const n = Math.max(points.length, 2);
  const data = points.length ? points : [0, 0];
  const max = Math.max(1, ...data);

  const x = (i: number) => pad + (i / (n - 1)) * (w - 2 * pad);
  const y = (v: number) => h - pad - (v / max) * (h - 2 * pad);

  const line = data.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${x(data.length - 1).toFixed(1)},${h} L${x(0).toFixed(1)},${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-40" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="pcFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b7fdc" stopOpacity="0.35" />
          <stop offset="1" stopColor="#1b7fdc" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="pcLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0db8d3" />
          <stop offset="1" stopColor="#1b7fdc" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#pcFill)" />
      <path
        d={line}
        fill="none"
        stroke="url(#pcLine)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
