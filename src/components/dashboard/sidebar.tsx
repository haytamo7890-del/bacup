"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Layers,
  BookOpen,
  FileText,
  ScrollText,
  Library,
  Trophy,
  Sun,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { CoachAvatar } from "@/components/dashboard/coach-avatar";
import { BrandLogo } from "@/components/brand";

type NavItem = { label: string; icon: LucideIcon; href: string; match: (p: string) => boolean };

const NAV: NavItem[] = [
  { label: "Dashboard", icon: Layers, href: "/dashboard", match: (p) => p === "/dashboard" },
  { label: "Cours", icon: BookOpen, href: "/dashboard/cours", match: (p) => p.startsWith("/dashboard/cours") },
  { label: "Examens", icon: FileText, href: "/dashboard/examens/preparation", match: (p) => p.startsWith("/dashboard/examens") },
  { label: "Annales", icon: ScrollText, href: "/dashboard/annales", match: (p) => p.startsWith("/dashboard/annales") },
  { label: "Bibliothèque", icon: Library, href: "/dashboard/bibliotheque", match: (p) => p.startsWith("/dashboard/bibliotheque") },
  { label: "Monk Mode", icon: Sun, href: "/dashboard/monk", match: (p) => p.startsWith("/dashboard/monk") },
  { label: "Classement", icon: Trophy, href: "/dashboard/classement", match: (p) => p.startsWith("/dashboard/classement") },
];

/** Stable 5-digit "Student ID" derived from the user's uuid. */
function studentId(uuid: string): string {
  let h = 0;
  for (let i = 0; i < uuid.length; i++) h = (h * 31 + uuid.charCodeAt(i)) >>> 0;
  return String((h % 90000) + 10000);
}

export function DashboardSidebar({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();
  const supabase = createBrowserSupabase();
  const [me, setMe] = useState<{ name: string; email: string; id: string } | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: p } = await supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle();
      setMe({ name: p?.display_name ?? user.email?.split("@")[0] ?? "Élève", email: user.email ?? "", id: studentId(user.id) });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const row = (active: boolean) =>
    `group flex items-center ${collapsed ? "justify-center" : "gap-3 px-3"} rounded-xl h-10 text-sm font-medium transition ${
      active
        ? "bg-arctic-blue/12 text-arctic-blue dark:text-arctic-cyan"
        : "text-neutral-500 dark:text-neutral-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.05] hover:text-neutral-800 dark:hover:text-neutral-100"
    }`;

  const initials = me?.name ? me.name.trim().slice(0, 2).toUpperCase() : "··";
  const settingsActive = pathname.startsWith("/dashboard/reglages");
  const divider = "border-t border-black/[0.06] dark:border-white/[0.06]";

  return (
    <aside className={`${collapsed ? "w-[88px]" : "w-72"} shrink-0 p-3 transition-[width] duration-300 ease-out`}>
      <div className="glass rounded-3xl h-full flex flex-col p-4 overflow-hidden">
        {/* logo */}
        <div className={`flex items-center ${collapsed ? "justify-center" : "gap-2.5 px-1"} h-10 shrink-0`}>
          <BrandLogo size={36} className="shrink-0 drop-shadow-[0_0_14px_rgba(13,184,211,.4)]" />
          {!collapsed && (
            <span className="font-display font-bold tracking-tight text-xl text-neutral-900 dark:text-white">Bac Up</span>
          )}
        </div>

        {/* profile */}
        <div className={`${collapsed ? "mt-4" : "mt-5"} flex flex-col items-center shrink-0`}>
          <div className={`${collapsed ? "w-10 h-10" : "w-14 h-14"} rounded-2xl bg-gradient-to-br from-arctic-cyan to-arctic-blue p-[2px] shadow-lg shadow-arctic-blue/25`}>
            <div className="w-full h-full rounded-[12px] bg-white/90 dark:bg-neutral-900 grid place-items-center font-extrabold text-arctic-blue dark:text-arctic-cyan"
              style={{ fontSize: collapsed ? "0.8rem" : "1rem" }}>
              {initials}
            </div>
          </div>
          {!collapsed && me && (
            <div className="mt-2.5 text-center max-w-full px-2">
              <div className="text-sm font-bold tracking-tight leading-tight truncate">{me.name}</div>
              <div className="text-[11px] text-neutral-400 truncate mt-0.5">{me.email}</div>
              <div className="text-[11px] text-neutral-400 mt-0.5">ID Élève&nbsp;: {me.id}</div>
            </div>
          )}
        </div>

        <div className={`${divider} my-4 shrink-0`} />

        {/* nav — grows and scrolls if needed so the bottom stays visible */}
        <nav className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-1.5">
          {NAV.map((item) => {
            const active = item.match(pathname);
            const Icon = item.icon;
            return (
              <Link key={item.label} href={item.href} title={item.label} className={row(active)}>
                <Icon className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110" strokeWidth={active ? 2 : 1.75} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
          <Link href="/dashboard/coach" title="Coach IA" className={row(pathname === "/dashboard/coach")}>
            <span className="transition-transform duration-200 group-hover:scale-110 shrink-0 grid place-items-center w-5 h-5">
              <CoachAvatar size={20} />
            </span>
            {!collapsed && <span>Coach IA</span>}
          </Link>
        </nav>

        {/* bottom — always visible */}
        <div className={`shrink-0 pt-3 mt-3 ${divider}`}>
          <Link href="/dashboard/reglages" title="Réglages" className={row(settingsActive)}>
            <Settings className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:rotate-45" strokeWidth={settingsActive ? 2 : 1.75} />
            {!collapsed && <span>Réglages</span>}
          </Link>
        </div>
      </div>
    </aside>
  );
}
