"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";

export type Access = {
  loading: boolean;
  status: string; // 'demo' | 'active' | 'pending' | ''
  isDemo: boolean;
  isActive: boolean;
  demoStartedAt: string | null;
  /** demo users past their 24h Monk-Mode window */
  monkExpired: boolean;
};

/** Client hook: reads the signed-in student's access state for freemium gating. */
export function useAccess(): Access {
  const supabase = createBrowserSupabase();
  const [a, setA] = useState<Access>({
    loading: true, status: "", isDemo: false, isActive: false, demoStartedAt: null, monkExpired: false,
  });
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setA((s) => ({ ...s, loading: false })); return; }
      const { data } = await supabase
        .from("student_profiles")
        .select("status, demo_started_at")
        .eq("id", user.id)
        .maybeSingle();
      const status = data?.status ?? "";
      const isDemo = status === "demo";
      const isActive = status === "active";
      const ds = (data?.demo_started_at as string | null) ?? null;
      const monkExpired = isDemo && !!ds && Date.now() - new Date(ds).getTime() > 24 * 3600 * 1000;
      setA({ loading: false, status, isDemo, isActive, demoStartedAt: ds, monkExpired });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return a;
}
