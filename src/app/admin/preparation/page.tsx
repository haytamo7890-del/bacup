"use client";

/**
 * Admin · Espace de préparation — everything the content team ships for prep:
 *   Import JSON  : "bacup.prep/v1" packs (exercices par notion + séries), dry-run then commit
 *   Séries       : create / edit / publish / reorder, pick questions from the banks by notion
 *   Couverture   : notions × exercices per chapter (gaps in red) + JSON export for round-trip edits
 * Cours content → /admin/import-cours · Annales / examens → /admin/examens, /admin/annales.
 */
import { useState } from "react";
import Link from "next/link";
import { PrepImport } from "@/components/admin/prep/prep-import";
import { PrepSeries } from "@/components/admin/prep/prep-series";
import { PrepCoverage } from "@/components/admin/prep/prep-coverage";
import { FileJson, Layers, Grid3x3, BookOpen, FileText } from "lucide-react";

type Tab = "import" | "series" | "coverage";
const TABS: { key: Tab; label: string; icon: typeof FileJson }[] = [
  { key: "import", label: "Import JSON", icon: FileJson },
  { key: "series", label: "Séries", icon: Layers },
  { key: "coverage", label: "Couverture", icon: Grid3x3 },
];

export default function AdminPreparation() {
  const [tab, setTab] = useState<Tab>("import");
  return (
    <div className="max-w-5xl fade-up">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Espace de préparation</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Exercices par notion, séries et couverture du programme.</p>
        </div>
        <div className="flex gap-2 text-xs">
          <Link href="/admin/import-cours" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass font-semibold"><BookOpen className="w-3.5 h-3.5" /> Cours (JSON)</Link>
          <Link href="/admin/examens" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass font-semibold"><FileText className="w-3.5 h-3.5" /> Examens</Link>
        </div>
      </div>

      <div className="mt-5 inline-flex rounded-full bg-black/[0.04] dark:bg-white/[0.06] p-1 text-sm font-semibold">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full transition ${tab === t.key ? "bg-white dark:bg-neutral-800 shadow-sm" : "text-neutral-500"}`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {tab === "import" && <PrepImport />}
        {tab === "series" && <PrepSeries />}
        {tab === "coverage" && <PrepCoverage />}
      </div>
    </div>
  );
}
