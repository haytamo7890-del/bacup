"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopbar } from "@/components/dashboard/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createBrowserSupabase();

  const [collapsed, setCollapsed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, role")
        .eq("id", user.id)
        .single();
      const { data: sp } = await supabase
        .from("student_profiles")
        .select("level_id, track_id, status, levels(name), tracks(name)")
        .eq("id", user.id)
        .single();

      const isAdmin = profile?.role === "admin";
      if (!isAdmin && (!sp?.level_id || !sp?.track_id)) {
        router.push("/onboarding");
        return;
      }
      // Freemium: 'active' (paid) and 'demo' (free tier) can enter; others pay.
      if (!isAdmin && sp?.status !== "active" && sp?.status !== "demo") {
        router.push("/payment");
        return;
      }

      setName(profile?.display_name ?? "");
      setStatus(sp?.status ?? "");
      const lv = (sp?.levels as unknown as { name: string } | null)?.name ?? "";
      const tr = (sp?.tracks as unknown as { name: string } | null)?.name ?? "";
      setSubtitle([tr, lv].filter(Boolean).join(" · "));
      setChecking(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen grid place-items-center text-sm text-neutral-400">
        Chargement…
      </div>
    );
  }

  return (
    <div className="relative h-screen flex overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-[#0a0f16] dark:to-[#05080c]">
      {/* ambient arctic glow */}
      <div className="pointer-events-none absolute -top-40 right-10 w-[520px] h-[520px] bg-arctic-cyan/10 blur-3xl rounded-full" />
      <div className="pointer-events-none absolute bottom-0 left-40 w-[420px] h-[420px] bg-arctic-blue/10 blur-3xl rounded-full" />

      <DashboardSidebar collapsed={collapsed} />

      <div className="relative flex-1 min-w-0 flex flex-col">
        <DashboardTopbar
          name={name}
          subtitle={subtitle}
          onToggle={() => setCollapsed((v) => !v)}
        />
        {status === "demo" && (
          <Link
            href="/payment"
            className="mx-6 lg:mx-10 mt-3 rounded-xl bg-gradient-to-r from-arctic-cyan/15 to-arctic-blue/15 border border-arctic-blue/25 px-4 py-2.5 flex items-center justify-between gap-3 hover:brightness-110 transition"
          >
            <span className="text-sm font-semibold text-arctic-blue dark:text-arctic-cyan inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Mode démo · accès limité
            </span>
            <span className="text-sm font-bold text-arctic-blue dark:text-arctic-cyan inline-flex items-center gap-1">
              Obtenir l&apos;accès <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        )}
        <main className="flex-1 overflow-y-auto px-6 lg:px-10 pb-12">{children}</main>
      </div>
    </div>
  );
}
