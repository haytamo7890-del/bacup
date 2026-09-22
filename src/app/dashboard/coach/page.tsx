"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { CoachAvatar } from "@/components/dashboard/coach-avatar";
import { Sparkles, Loader2, TrendingUp, TrendingDown, Lock } from "lucide-react";
import { useAccess } from "@/lib/use-access";

export default function CoachPage() {
  const supabase = createBrowserSupabase();
  const router = useRouter();
  const access = useAccess();
  const [name, setName] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .single();
      const { data: subs } = await supabase.from("subjects").select("name").order("name");
      setName(profile?.display_name ?? "");
      setSubjects((subs ?? []).map((s) => s.name as string));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function analyse() {
    setLoading(true);
    setResult(null);
    try {
      const { data: stats } = await supabase.rpc("my_stats");
      const mastery = ((stats?.subjects ?? []) as { name: string; mastery: number }[]).map(
        (s) => ({ chapter: s.name, pct: s.mastery })
      );
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, subjects, mastery }),
      });
      const json = await res.json();
      setResult(json.text || `⚠ ${json.error || "Le coach n'a pas pu répondre."}`);
    } catch {
      setResult("⚠ Impossible de contacter le coach.");
    }
    setLoading(false);
  }

  const firstName = name.split(" ")[0];

  return (
    <div className="max-w-3xl mx-auto py-8 fade-up">
      {/* coach hero */}
      <div className="glass rounded-3xl p-8 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-16 -right-10 w-64 h-64 bg-arctic-cyan/25 blur-3xl rounded-full" />
        <div className="relative flex items-center gap-4">
          <CoachAvatar size={64} className="shrink-0 drop-shadow-lg" />
          <div>
            <div className="text-xs font-semibold text-arctic-blue dark:text-arctic-cyan">
              Ton coach IA
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Salut {firstName || "👋"}
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-md">
              J&apos;analyse tes performances, je repère tes forces et tes lacunes,
              et je te propose un plan sur mesure.
            </p>
          </div>
        </div>
        <button
          onClick={() => (access.isDemo ? router.push("/payment") : analyse())}
          disabled={loading}
          className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white text-sm font-semibold px-6 py-3.5 hover:opacity-90 transition shadow-lg shadow-arctic-blue/20 disabled:opacity-60"
        >
          {access.isDemo ? <Lock className="w-4 h-4" /> : loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {access.isDemo ? "Débloque le coach IA" : "Analyse ma performance"}
        </button>
      </div>

      {/* strengths / weaknesses */}
      <div className="grid sm:grid-cols-2 gap-4 mt-5">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 text-emerald-500 text-sm font-semibold">
            <TrendingUp className="w-4 h-4" /> Tes forces
          </div>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Elles se révéleront ici après tes premiers QCM — le coach saura ce que
            tu maîtrises déjà.
          </p>
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 text-orange-500 text-sm font-semibold">
            <TrendingDown className="w-4 h-4" /> À travailler
          </div>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Le coach identifiera tes chapitres faibles et te dira exactement quoi
            réviser en priorité.
          </p>
        </div>
      </div>

      {/* result */}
      {result && (
        <div className="glass rounded-3xl p-6 mt-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-arctic-blue dark:text-arctic-cyan mb-3">
            <CoachAvatar size={22} /> Ton analyse
          </div>
          <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-200 whitespace-pre-wrap">
            {result}
          </p>
        </div>
      )}
    </div>
  );
}
