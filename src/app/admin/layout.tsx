"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { AdminLevelProvider, AdminLevelSwitch } from "@/lib/admin-level";
import {
  Loader2, LayoutDashboard, BadgeCheck, Users, BookOpen, FileText, ScrollText, Settings, LogOut, ArrowLeft,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard, exact: true },
  { href: "/admin/activations", label: "Activations", icon: BadgeCheck },
  { href: "/admin/etudiants", label: "Étudiants", icon: Users },
  { href: "/admin/cours", label: "Cours", icon: BookOpen },
  { href: "/admin/examens", label: "Examens", icon: FileText },
  { href: "/admin/annales", label: "Annales", icon: ScrollText },
  { href: "/admin/parametres", label: "Paiement", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createBrowserSupabase();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
      if (profile?.role !== "admin") { router.replace("/dashboard"); return; }
      setOk(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function logout() { await supabase.auth.signOut(); router.replace("/login"); }

  if (!ok) return <div className="min-h-screen grid place-items-center text-sm text-neutral-400"><Loader2 className="w-5 h-5 animate-spin" /></div>;

  return (
    <AdminLevelProvider>
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-blue-50/40 dark:from-[#0a0f16] dark:to-[#05080c] text-neutral-900 dark:text-neutral-100">
      <aside className="w-60 shrink-0 border-r border-black/5 dark:border-white/5 p-4 hidden md:flex flex-col">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-arctic-cyan to-arctic-blue text-white grid place-items-center font-extrabold">B</span>
          <div>
            <div className="font-bold tracking-tight leading-none">Bac-up</div>
            <div className="text-[11px] text-neutral-400">Admin</div>
          </div>
        </div>
        <nav className="mt-4 space-y-1">
          {NAV.map((n) => {
            const active = n.exact ? pathname === n.href : pathname.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition ${active ? "bg-arctic-blue/12 text-arctic-blue dark:text-arctic-cyan" : "text-neutral-500 dark:text-neutral-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"}`}>
                <n.icon className="w-4 h-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto space-y-1">
          <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-neutral-500 hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"><ArrowLeft className="w-4 h-4" /> Vue étudiant</Link>
          <button onClick={logout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-neutral-500 hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"><LogOut className="w-4 h-4" /> Déconnexion</button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 overflow-y-auto px-6 lg:px-10 py-8">
        <div className="flex items-center justify-between mb-5">
          <div className="md:hidden font-bold tracking-tight">Bac-up · Admin</div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400 hidden sm:block">Niveau</span>
            <AdminLevelSwitch />
          </div>
        </div>
        {children}
      </main>
    </div>
    </AdminLevelProvider>
  );
}
