"use client";

import { useMemo, useState } from "react";
import { GraduationCap } from "lucide-react";

type Row = { subject: string; note: string; coef: number };

// Default coefficients for the science streams (editable — adjust per filière).
const DEFAULT_ROWS: Row[] = [
  { subject: "Mathématiques", note: "", coef: 7 },
  { subject: "Physique-Chimie", note: "", coef: 7 },
  { subject: "SVT", note: "", coef: 7 },
  { subject: "Philosophie", note: "", coef: 2 },
  { subject: "Anglais", note: "", coef: 2 },
  { subject: "Français", note: "", coef: 4 },
  { subject: "Histoire-Géo", note: "", coef: 2 },
  { subject: "Éducation Islamique", note: "", coef: 2 },
];

export default function CalculettePage() {
  const [rows, setRows] = useState<Row[]>(DEFAULT_ROWS);

  const { average, totalCoef } = useMemo(() => {
    let sum = 0;
    let coefSum = 0;
    for (const r of rows) {
      const n = parseFloat(r.note.replace(",", "."));
      if (!isNaN(n) && r.coef > 0) {
        sum += n * r.coef;
        coefSum += r.coef;
      }
    }
    return { average: coefSum > 0 ? sum / coefSum : null, totalCoef: coefSum };
  }, [rows]);

  function update(i: number, field: "note" | "coef", value: string) {
    setRows((rs) =>
      rs.map((r, idx) =>
        idx === i ? { ...r, [field]: field === "coef" ? Number(value) || 0 : value } : r
      )
    );
  }

  const avgRounded = average != null ? Math.round(average * 100) / 100 : null;
  const passed = avgRounded != null && avgRounded >= 10;

  return (
    <div className="max-w-2xl mx-auto py-8 fade-up">
      <h1 className="text-3xl font-bold tracking-tight">Calcule ta note du Bac</h1>
      <p className="mt-2 text-neutral-500 dark:text-neutral-400">
        Entre tes notes /20. Les coefficients sont pré-remplis pour les filières
        scientifiques — ajuste-les selon ta filière.
      </p>

      {/* result */}
      <div className="glass rounded-3xl p-7 mt-6 text-center relative overflow-hidden">
        <div
          className={`pointer-events-none absolute -top-14 left-1/2 -translate-x-1/2 w-64 h-64 blur-3xl rounded-full ${
            avgRounded == null ? "bg-arctic-cyan/15" : passed ? "bg-emerald-500/20" : "bg-orange-500/20"
          }`}
        />
        <div className="relative flex items-center justify-center gap-2 text-arctic-blue dark:text-arctic-cyan text-sm font-semibold">
          <GraduationCap className="w-4 h-4" /> Moyenne projetée
        </div>
        <div
          className={`relative mt-2 text-5xl font-extrabold tracking-tight ${
            avgRounded == null ? "" : passed ? "text-emerald-500" : "text-orange-500"
          }`}
        >
          {avgRounded != null ? avgRounded : "—"}
          <span className="text-2xl text-neutral-400 font-medium">/20</span>
        </div>
        <div className="relative mt-1 text-xs text-neutral-400">
          {totalCoef > 0 ? `sur ${totalCoef} coefficients` : "entre tes notes ci-dessous"}
        </div>
      </div>

      {/* rows */}
      <div className="glass rounded-3xl p-5 mt-5">
        <div className="grid grid-cols-[1fr_88px_72px] gap-3 px-2 pb-2 text-xs font-semibold text-neutral-400">
          <span>Matière</span>
          <span className="text-center">Note /20</span>
          <span className="text-center">Coef.</span>
        </div>
        <div className="space-y-2">
          {rows.map((r, i) => (
            <div key={r.subject} className="grid grid-cols-[1fr_88px_72px] gap-3 items-center">
              <span className="text-sm font-medium px-2">{r.subject}</span>
              <input
                inputMode="decimal"
                value={r.note}
                onChange={(e) => update(i, "note", e.target.value)}
                placeholder="—"
                className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm text-center outline-none focus:border-arctic-blue"
              />
              <input
                inputMode="numeric"
                value={r.coef}
                onChange={(e) => update(i, "coef", e.target.value)}
                className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm text-center outline-none focus:border-arctic-blue"
              />
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs text-neutral-400">
        Estimation basée sur une moyenne pondérée. Vérifie les coefficients officiels
        de ta filière pour un calcul exact.
      </p>
    </div>
  );
}
