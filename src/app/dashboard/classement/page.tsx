"use client";

import { useCallback, useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { Trophy, Loader2, Crown } from "lucide-react";
import { ProgressCurve } from "@/components/dashboard/progress-curve";
import { useAccess } from "@/lib/use-access";
import { UpgradeCard } from "@/components/dashboard/paywall";

type Row = { rank: number; display_name: string; total_xp: number; is_me: boolean };
type Period = "week" | "all";

export default function ClassementPage() {
  const supabase = createBrowserSupabase();
  const access = useAccess();
  const [period, setPeriod] = useState<Period>("week");
  const [rows, setRows] = useState<Row[]>([]);
  const [me, setMe] = useState<{ rank: number; total_xp: number; cohort_size: number } | null>(null);
  const [series, setSeries] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (p: Period) => {
    setLoading(true);
    const [{ data: lb }, { data: mr }] = await Promise.all([
      supabase.rpc("leaderboard", { p_period: p, p_limit: 10 }),
      supabase.rpc("my_rank", { p_period: p }),
    ]);
    setRows((lb ?? []) as Row[]);
    const m = Array.isArray(mr) ? mr[0] : mr;
    setMe(m ? { rank: Number(m.rank), total_xp: Number(m.total_xp), cohort_size: Number(m.cohort_size) } : null);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    if (access.loading || access.isDemo) { if (!access.loading) setLoading(false); return; }
    load(period);
    supabase.rpc("my_xp_series", { p_days: 14 }).then(({ data }) => {
      if (data) setSeries((data as { xp: number }[]).map((r) => r.xp));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, access.loading, access.isDemo]);

  const meInTop = rows.some((r) => r.is_me);

  return (
    <div className="max-w-2xl mx-auto py-8 fade-up">
      <div className="flex items-center gap-3">
        <span className="w-11 h-11 rounded-2xl bg-arctic-blue/15 text-arctic-blue dark:text-arctic-cyan grid place-items-center"><Trophy className="w-5 h-5" /></span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Classement</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">Tu es classé face aux élèves de ta filière. Chaque XP compte.</p>
        </div>
      </div>

      {access.isDemo ? (
        <div className="mt-7">
          <UpgradeCard title="Le classement est réservé à l'accès complet"
            sub="Gagne des XP, grimpe le classement et débloque toute la gamification. 220 DH pour toute l'année." />
        </div>
      ) : (
      <>
      <div className="glass rounded-3xl p-5 mt-7">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold tracking-tight">Ta progression</h3>
          <span className="text-xs text-neutral-400">14 j · XP</span>
        </div>
        <ProgressCurve points={series} />
      </div>

      {/* period toggle */}
      <div className="mt-5 inline-flex rounded-full bg-black/[0.04] dark:bg-white/[0.06] p-1">
        {(["week", "all"] as Period[]).map((p) => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${period === p ? "bg-white dark:bg-neutral-800 shadow text-arctic-blue dark:text-arctic-cyan" : "text-neutral-500"}`}>
            {p === "week" ? "Cette semaine" : "Depuis toujours"}
          </button>
        ))}
      </div>

      <div className="glass rounded-3xl p-4 mt-3">
        {loading ? (
          <div className="grid place-items-center h-40 text-neutral-400"><Loader2 className="w-6 h-6 animate-spin" /></div>
        ) : rows.length === 0 ? (
          <div className="text-center text-sm text-neutral-400 py-10">Le classement se remplit dès que les élèves de ta filière commencent à s&apos;entraîner.</div>
        ) : (
          <>
            <ul className="space-y-1">
              {rows.map((r) => <LbRow key={`${r.rank}-${r.display_name}`} r={r} />)}
            </ul>
            {me && !meInTop && (
              <>
                <div className="text-center text-neutral-300 dark:text-neutral-600 text-lg leading-none py-1">···</div>
                <LbRow r={{ rank: me.rank, display_name: "Toi", total_xp: me.total_xp, is_me: true }} />
              </>
            )}
            {me && <div className="mt-2 text-center text-[11px] text-neutral-400">{me.cohort_size} élève{me.cohort_size > 1 ? "s" : ""} dans ta filière</div>}
          </>
        )}
      </div>
      </>
      )}
    </div>
  );
}

function LbRow({ r }: { r: Row }) {
  return (
    <li className={`flex items-center gap-3 rounded-2xl px-3 py-3 ${r.is_me ? "bg-arctic-blue/10 ring-1 ring-arctic-blue/25" : ""}`}>
      <span className={`w-8 text-center font-bold ${r.rank <= 3 ? "text-arctic-blue dark:text-arctic-cyan" : "text-neutral-400"}`}>
        {r.rank === 1 ? <Crown className="w-4 h-4 mx-auto text-amber-400" /> : r.rank}
      </span>
      <span className="w-9 h-9 rounded-full bg-arctic-blue/15 grid place-items-center text-xs font-bold text-arctic-blue dark:text-arctic-cyan uppercase">{r.display_name.slice(0, 2)}</span>
      <span className="flex-1 text-sm font-medium truncate">
        {r.display_name}
        {r.is_me && <span className="ml-2 text-xs text-arctic-blue dark:text-arctic-cyan">(toi)</span>}
      </span>
      <span className="text-sm font-semibold">{r.total_xp} XP</span>
    </li>
  );
}
