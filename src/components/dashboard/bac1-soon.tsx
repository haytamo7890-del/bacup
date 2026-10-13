"use client";

/**
 * Full-page lock for 1bac accounts while FEATURES.level1bac is off.
 * Copy lives in src/config (BAC1_COMING_SOON).
 */
import { BAC1_COMING_SOON } from "@/config";
import { SoonPill } from "@/components/prep/exams-soon";
import { BookOpen, FileText, ScrollText, Trophy, CalendarClock, Lock, Bell } from "lucide-react";

const ICONS = [BookOpen, FileText, ScrollText, Trophy];

export function Bac1SoonGate() {
  const c = BAC1_COMING_SOON;
  return (
    <div className="max-w-2xl mx-auto py-10 sm:py-16">
      <div className="glass rounded-3xl p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-arctic-cyan to-arctic-blue text-white grid place-items-center shadow-lg shadow-arctic-blue/30 shrink-0">
            <CalendarClock className="w-7 h-7" />
            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full glass grid place-items-center text-arctic-blue dark:text-arctic-cyan">
              <Lock className="w-3 h-3" />
            </span>
          </span>
          <div className="min-w-0">
            <SoonPill />
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight">{c.title}</h1>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{c.lead}</p>
          </div>
        </div>

        <div className="mt-6 text-[11px] font-bold uppercase tracking-wide text-neutral-400">Ce qui t&apos;attend en {c.launch}</div>
        <div className="mt-2.5 grid sm:grid-cols-2 gap-2.5">
          {c.features.map((f, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div key={f.t} className="rounded-2xl p-3.5 bg-black/[0.03] dark:bg-white/[0.04] flex items-start gap-3">
                <span className="w-8 h-8 rounded-xl bg-arctic-blue/10 text-arctic-blue dark:text-arctic-cyan grid place-items-center shrink-0">
                  <Icon className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-sm font-semibold">{f.t}</div>
                  <div className="text-xs text-neutral-400 leading-snug">{f.d}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 rounded-2xl p-3.5 ring-1 ring-arctic-cyan/25 bg-arctic-cyan/[0.06] text-sm text-neutral-600 dark:text-neutral-300 flex items-start gap-2.5">
          <Bell className="w-4 h-4 mt-0.5 text-arctic-blue dark:text-arctic-cyan shrink-0" /> {c.note}
        </div>
      </div>
    </div>
  );
}
