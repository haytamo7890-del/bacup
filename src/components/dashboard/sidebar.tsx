"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Trophy,
  Crown,
  Settings,
  LogOut,
} from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { CoachAvatar } from "@/components/dashboard/coach-avatar";

const NAV = [
  { label: "Aperçu", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Cours", icon: BookOpen, href: null },
  { label: "Examens", icon: FileText, href: "/dashboard/examens" },
  { label: "Classement", icon: Trophy, href: null },
] as const;

export function DashboardSidebar({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createBrowserSupabase();

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  const rowBase = (extra: string) =>
    `flex items-center ${
      collapsed ? "justify-center" : "gap-3 px-3"
    } rounded-2xl h-11 text-sm font-medium transition ${extra}`;

  return (
    <aside className={`${collapsed ? "w-[84px]" : "w-64"} shrink-0 p-3 transition-[width] duration-300 ease-out`}>
      <div className="glass rounded-2xl h-full flex flex-col p-3">
        {/* logo — Bac, blue glassy */}
        <div className="flex items-center gap-2.5 px-2 h-12 shrink-0">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-arctic-cyan to-arctic-blue text-white grid place-items-center font-extrabold shrink-0 shadow-lg shadow-arctic-blue/30 ring-1 ring-white/25">
            B
          </span>
          {!collapsed && (
            <span className="font-bold tracking-tight text-lg">
              Bac<span className="text-arctic-blue dark:text-arctic-cyan">-up</span>
            </span>
          )}
        </div>

        {/* main nav */}
        <nav className="mt-4 flex flex-col gap-1 min-h-0 overflow-y-auto">
          {NAV.map((item) => {
            const active = item.href ? pathname === item.href : false;
            const Icon = item.icon;
            const cls = rowBase(
              active
                ? "bg-black/[0.05] dark:bg-white/[0.08] text-arctic-blue dark:text-arctic-cyan shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                : "text-neutral-400 dark:text-neutral-500 hover:bg-black/[0.04] dark:hover:bg-white/[0.05] hover:text-neutral-700 dark:hover:text-neutral-200"
            );
            const content = (
              <>
                <Icon className="w-[22px] h-[22px] shrink-0" strokeWidth={active ? 2 : 1.75} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </>
            );
            return item.href ? (
              <Link key={item.label} href={item.href} className={cls} title={item.label}>
                {content}
              </Link>
            ) : (
              <button key={item.label} type="button" className={cls} title={item.label}>
                {content}
              </button>
            );
          })}

          {/* AI Coach — last, after Classement */}
          <Link
            href="/dashboard/coach"
            title="Coach IA"
            className={`flex items-center ${
              collapsed ? "justify-center" : "gap-3 px-3"
            } rounded-2xl h-11 text-sm font-medium transition ${
              pathname === "/dashboard/coach"
                ? "bg-black/[0.05] dark:bg-white/[0.08] text-arctic-blue dark:text-arctic-cyan shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                : "text-neutral-400 dark:text-neutral-500 hover:bg-black/[0.04] dark:hover:bg-white/[0.05] hover:text-neutral-700 dark:hover:text-neutral-200"
            }`}
          >
            <CoachAvatar size={22} className="shrink-0" />
            {!collapsed && <span>Coach IA</span>}
          </Link>
        </nav>

        {/* bottom */}
        <div className="mt-auto flex flex-col gap-1 shrink-0 pt-2">
          {/* Passer Pro — accent */}
          <button
            type="button"
            title="Passer Pro"
            className={rowBase(
              "font-semibold text-arctic-blue dark:text-arctic-cyan bg-arctic-blue/10 hover:bg-arctic-blue/15 ring-1 ring-arctic-blue/25"
            )}
          >
            <Crown className="w-[22px] h-[22px] shrink-0" strokeWidth={2} />
            {!collapsed && <span>Passer Pro</span>}
          </button>

          <button
            type="button"
            title="Réglages"
            className={rowBase(
              "text-neutral-400 dark:text-neutral-500 hover:bg-black/[0.04] dark:hover:bg-white/[0.05] hover:text-neutral-700 dark:hover:text-neutral-200"
            )}
          >
            <Settings className="w-[22px] h-[22px] shrink-0" strokeWidth={1.75} />
            {!collapsed && <span>Réglages</span>}
          </button>

          <button
            onClick={signOut}
            type="button"
            title="Déconnexion"
            className={rowBase(
              "text-neutral-400 dark:text-neutral-500 hover:bg-red-500/10 hover:text-red-600"
            )}
          >
            <LogOut className="w-[22px] h-[22px] shrink-0" strokeWidth={1.75} />
            {!collapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
