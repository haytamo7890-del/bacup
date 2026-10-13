"use client";

/**
 * « J-237 · BAC » — always-visible countdown in the top bar (2BAC only, national exam).
 * Tap → the Plan BAC. Date lives in src/lib/plan/engine.ts (EXAM_DATE).
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { daysUntilExam } from "@/lib/plan/engine";

export function BacCountdown() {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const [show, setShow] = useState(false);
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    let live = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("student_profiles").select("levels(code)").eq("id", user.id).maybeSingle();
      if (!live) return;
      setShow((data?.levels as unknown as { code: string } | null)?.code === "2bac");
      setLeft(daysUntilExam());
    })();
    return () => { live = false; };
  }, [supabase]);

  if (!show || left == null) return null;
  return (
    <Link href="/dashboard/plan" className="jpill" aria-label={`J moins ${left} avant le BAC, ouvrir mon plan`} title="Jours avant le BAC national">
      J-{left}<small className="hidden sm:inline">· BAC</small>
    </Link>
  );
}
