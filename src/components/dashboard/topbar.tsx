"use client";

import { PanelLeft } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationBell } from "@/components/dashboard/notification-bell";
import { GoalPill } from "@/components/dashboard/goal-pill";
import { BacCountdown } from "@/components/dashboard/bac-countdown";

export function DashboardTopbar({
  name,
  subtitle,
  onToggle,
}: {
  name: string;
  subtitle?: string;
  onToggle: () => void;
}) {
  const initials = name ? name.trim().slice(0, 2).toUpperCase() : "ME";
  return (
    <header className="h-16 flex items-center px-4 shrink-0">
      {/* 3 columns: left · goal pill (centred) · right — nothing can overlap the centre */}
      <div className="glass rounded-2xl h-12 w-full grid grid-cols-[auto_minmax(0,1fr)_auto] xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-2.5">
        <div className="flex items-center min-w-0">
          <button
            onClick={onToggle}
            type="button"
            aria-label="Basculer le menu"
            className="w-9 h-9 grid place-items-center rounded-lg text-neutral-500 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/10 transition"
          >
            <PanelLeft className="w-5 h-5" />
          </button>
          <span className="ml-1"><BacCountdown /></span>
        </div>

        <div className="justify-self-center min-w-0 max-w-full overflow-hidden"><GoalPill /></div>

        <div className="flex items-center justify-end gap-2 min-w-0">
          <ThemeToggle />
          <NotificationBell />
          <div className="flex items-center gap-2 pl-1 pr-1 min-w-0">
            <div className="hidden xl:block text-right leading-tight min-w-0">
              <div className="text-sm font-semibold truncate">{name || "Élève"}</div>
              {subtitle && <div className="text-[11px] text-neutral-400 truncate">{subtitle}</div>}
            </div>
            <span className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-arctic-cyan to-arctic-blue text-white grid place-items-center text-sm font-bold">
              {initials}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
