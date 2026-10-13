"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
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
import { BrandLogo } from "@/components/brand";
import { navStore } from "@/lib/nav-memory";
import { loadPrepStats } from "@/lib/prep";
import { SoonPill } from "@/components/prep/exams-soon";

type NavItem = { label: string; icon: LucideIcon; href: string; key: string; match: (p: string) => boolean };

const NAV: NavItem[] = [
  { label: "Dashboard", key: "dashboard", icon: Layers, href: "/dashboard", match: (p) => p === "/dashboard" },
  { label: "Cours", key: "cours", icon: BookOpen, href: "/dashboard/cours", match: (p) => p.startsWith("/dashboard/cours") },
  { label: "Préparation", key: "prep", icon: FileText, href: "/dashboard/examens/preparation", match: (p) => p.startsWith("/dashboard/examens") },
  { label: "Annales", key: "annales", icon: ScrollText, href: "/dashboard/annales", match: (p) => p.startsWith("/dashboard/annales") },
  { label: "Bibliothèque", key: "biblio", icon: Library, href: "/dashboard/bibliotheque", match: (p) => p.startsWith("/dashboard/bibliotheque") },
  { label: "Monk Mode", key: "monk", icon: Sun, href: "/dashboard/monk", match: (p) => p.startsWith("/dashboard/monk") },
  { label: "Classement", key: "classement", icon: Trophy, href: "/dashboard/classement", match: (p) => p.startsWith("/dashboard/classement") },
];

/** Stable 5-digit "Student ID" derived from the user's uuid. */
function studentId(uuid: string): string {
  let h = 0;
  for (let i = 0; i < uuid.length; i++) h = (h * 31 + uuid.charCodeAt(i)) >>> 0;
  return String((h % 90000) + 10000);
}

/** `locked`: 1bac before launch. Every entry shows « Bientôt » and leads nowhere. */
export function DashboardSidebar({ collapsed, locked = false }: { collapsed: boolean; locked?: boolean }) {
  const pathname = usePathname();
  // Each feature reopens where the student left it; clicking the feature you're
  // already in takes you to its home (Linear/Slack behaviour).
  const spots = useSyncExternalStore(navStore.subscribe, navStore.get, navStore.getServer);
  const hrefFor = (key: string, root: string, active: boolean) =>
    active || key === "dashboard" ? root : spots[key]?.url ?? root;
  const supabase = createBrowserSupabase();
  const [me, setMe] = useState<{ name: string; email: string; id: string } | null>(null);
  // Préparation shines (same light sweep as the objectif pill) only while something waits:
  // révisions due today or errors to replay. Re-checked on every page change.
  const [prepWaiting, setPrepWaiting] = useState(false);
  // Monk Mode shines the same way while today's non-négociables are not all ticked.
  const [monkWaiting, setMonkWaiting] = useState(false);
  const [monkTick, setMonkTick] = useState(0);
  useEffect(() => {
    const on = () => setMonkTick((n) => n + 1);
    window.addEventListener("bacup:monk-changed", on);
    return () => window.removeEventListener("bacup:monk-changed", on);
  }, []);
  useEffect(() => {
    let live = true;
    loadPrepStats(supabase).then((st) => { if (live) setPrepWaiting(!!st && (st.due > 0 || st.errors > 0)); });
    (async () => {
      const d = new Date();
      const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const [{ data: h, error }, { data: c }] = await Promise.all([
        supabase.from("monk_habits").select("id, is_core").eq("active", true),
        supabase.from("monk_checks").select("habit_id").eq("day", today),
      ]);
      if (!live || error) return;
      const core = ((h ?? []) as { id: string; is_core: boolean }[]).filter((x) => x.is_core).map((x) => x.id);
      const done = new Set(((c ?? []) as { habit_id: string }[]).map((x) => x.habit_id));
      setMonkWaiting(core.length >= 4 && !core.every((id) => done.has(id)));
    })();
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, monkTick]);

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
            if (locked) {
              return (
                <div key={item.label} title={`${item.label} · Bientôt`} aria-disabled="true" className={`${row(false)} cursor-default opacity-60 hover:bg-transparent dark:hover:bg-transparent hover:text-neutral-500 dark:hover:text-neutral-400`}>
                  <Icon className="w-5 h-5 shrink-0" strokeWidth={1.75} />
                  {!collapsed && <span className="truncate flex-1">{item.label}</span>}
                  {!collapsed && <SoonPill />}
                </div>
              );
            }
            return (
              <Link key={item.label} href={hrefFor(item.key, item.href, active)} title={item.label} className={row(active)}>
                <Icon className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110" strokeWidth={active ? 2 : 1.75} />
                {!collapsed && (
                  <span className={`truncate ${(item.key === "prep" && prepWaiting) || (item.key === "monk" && monkWaiting) ? `goal-shine ${active ? "goal-shine-active" : ""}` : ""}`}>{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* bottom — always visible */}
        <div className={`shrink-0 pt-3 mt-3 ${divider}`}>
          {locked ? (
            <div title="Réglages · Bientôt" aria-disabled="true" className={`${row(false)} cursor-default opacity-60 hover:bg-transparent dark:hover:bg-transparent hover:text-neutral-500 dark:hover:text-neutral-400`}>
              <Settings className="w-5 h-5 shrink-0" strokeWidth={1.75} />
              {!collapsed && <span className="flex-1">Réglages</span>}
              {!collapsed && <SoonPill />}
            </div>
          ) : (
          <Link href={hrefFor("reglages", "/dashboard/reglages", settingsActive)} title="Réglages" className={row(settingsActive)}>
            <Settings className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:rotate-45" strokeWidth={settingsActive ? 2 : 1.75} />
            {!collapsed && <span>Réglages</span>}
          </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
