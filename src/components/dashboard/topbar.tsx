"use client";

import { PanelLeft, Bell } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

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
      <div className="glass rounded-2xl h-12 w-full flex items-center gap-2 px-2.5">
        <button
          onClick={onToggle}
          type="button"
          aria-label="Basculer le menu"
          className="w-9 h-9 grid place-items-center rounded-lg text-neutral-500 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/10 transition"
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        <div className="flex-1" />

        <ThemeToggle />
        <button
          type="button"
          aria-label="Notifications"
          className="w-9 h-9 grid place-items-center rounded-full text-neutral-500 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/10 transition"
        >
          <Bell className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 pl-1 pr-1">
          <div className="hidden sm:block text-right leading-tight">
            <div className="text-sm font-semibold">{name || "Élève"}</div>
            {subtitle && <div className="text-[11px] text-neutral-400">{subtitle}</div>}
          </div>
          <span className="w-9 h-9 rounded-full bg-gradient-to-br from-arctic-cyan to-arctic-blue text-white grid place-items-center text-sm font-bold">
            {initials}
          </span>
        </div>
      </div>
    </header>
  );
}
