"use client";

/**
 * "À réviser aujourd'hui" + "Mes erreurs" — the two entry points of the review engine.
 * Fed by the my_prep_stats() RPC (review_items due + questions whose latest attempt is wrong).
 * Used on the dashboard home, the prep hub (all subjects) and a subject page (subject=<code>).
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { loadPrepStats, prepRoutes, type PrepStats } from "@/lib/prep";
import { Brain, NotebookPen, ChevronRight, Target } from "lucide-react";

const plural = (n: number, w: string) => `${n} ${w}${n > 1 ? "s" : ""}`;

export function PrepAlerts({ subject, showEmpty = false, className = "" }: { subject?: string; showEmpty?: boolean; className?: string }) {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const [stats, setStats] = useState<PrepStats | null>(null);

  useEffect(() => {
    let live = true;
    loadPrepStats(supabase).then((s) => { if (live) setStats(s); });
    return () => { live = false; };
  }, [supabase]);

  if (!stats) return null;
  const due = subject ? stats.due_by_subject[subject] ?? 0 : stats.due;
  const errors = subject ? stats.errors_by_subject[subject] ?? 0 : stats.errors;
  const nSubjects = Object.keys(stats.due_by_subject).length;

  if (due === 0 && errors === 0) {
    if (!showEmpty) return null;
    return (
      <Link href={prepRoutes.hub()} className={`group glass rounded-2xl p-4 flex items-center gap-3 hover:-translate-y-0.5 transition ${className}`}>
        <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white grid place-items-center shrink-0 shadow-lg shadow-emerald-500/25"><Target className="w-5 h-5" /></span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold tracking-tight">Rien à revoir aujourd&apos;hui</div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">Lance une série dans la Préparation pour garder le rythme.</div>
        </div>
        <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:translate-x-0.5 transition" />
      </Link>
    );
  }

  return (
    <div className={`grid gap-3 ${due > 0 && errors > 0 ? "sm:grid-cols-2" : ""} ${className}`}>
      {due > 0 && (
        <Link href={prepRoutes.review(subject)} className="group glass rounded-2xl p-4 flex items-center gap-3 hover:-translate-y-0.5 transition">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600 text-white grid place-items-center shrink-0 shadow-lg shadow-violet-500/25"><Brain className="w-5 h-5" /></span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold tracking-tight">À réviser aujourd&apos;hui · {due}</div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
              {subject ? "Révision espacée : tes erreurs reviennent au bon moment." : `Révision espacée${nSubjects > 1 ? ` · ${nSubjects} matières` : ""} — ${plural(due, "question")} prête${due > 1 ? "s" : ""}.`}
            </div>
          </div>
          <span className="hidden sm:inline text-[11px] font-bold px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-600 dark:text-violet-300">RÉVISER</span>
          <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:translate-x-0.5 transition" />
        </Link>
      )}
      {errors > 0 && (
        <Link href={prepRoutes.errors(subject)} className="group glass rounded-2xl p-4 flex items-center gap-3 hover:-translate-y-0.5 transition">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 text-white grid place-items-center shrink-0 shadow-lg shadow-rose-500/25"><NotebookPen className="w-5 h-5" /></span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold tracking-tight">Mes erreurs · {errors}</div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate">Ton journal d&apos;erreurs, classé par notion. Rejoue-les jusqu&apos;à les maîtriser.</div>
          </div>
          <span className="hidden sm:inline text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-300">VOIR</span>
          <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:translate-x-0.5 transition" />
        </Link>
      )}
    </div>
  );
}
