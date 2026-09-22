"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { Trophy, Loader2 } from "lucide-react";
import { ProgressCurve } from "@/components/dashboard/progress-curve";
import { useAccess } from "@/lib/use-access";
import { UpgradeCard } from "@/components/dashboard/paywall";

type Row = { rank: number; display_name: string; total_xp: number; is_me: boolean };

export default function ClassementPage() {
  const supabase = createBrowserSupabase();
  const access = useAccess();
  const [rows, setRows] = useState<Row[]>([]);
  const [series, setSeries] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.rpc("leaderboard", { p_limit: 50 });
      setRows((data ?? []) as Row[]);
      const { data: sd } = await supabase.rpc("my_xp_series", { p_days: 14 });
      if (sd) setSeries((sd as { xp: number }[]).map((r) => r.xp));
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-8 fade-up">
      <div className="flex items-center gap-3">
        <span className="w-11 h-11 rounded-2xl bg-arctic-blue/15 text-arctic-blue dark:text-arctic-cyan grid place-items-center">
          <Trophy className="w-5 h-5" />
        </span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Classement</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            Grimpe en révisant. Chaque bonne réponse te rapporte des XP.
          </p>
        </div>
      </div>

      {access.isDemo ? (
        <div className="mt-7">
          <UpgradeCard
            title="Le classement est réservé à l’accès complet"
            sub="Gagne des XP, grimpe le classement et débloque toute la gamification. 220 DH pour toute l’année."
          />
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

      <div className="glass rounded-3xl p-4 mt-5">
        {loading ? (
          <div className="grid place-items-center h-40 text-neutral-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center text-sm text-neutral-400 py-10">
            Le classement se remplit dès que les élèves commencent à s&apos;entraîner.
          </div>
        ) : (
          <ul className="space-y-1">
            {rows.map((r) => (
              <li
                key={`${r.rank}-${r.display_name}`}
                className={`flex items-center gap-3 rounded-2xl px-3 py-3 ${
                  r.is_me ? "bg-arctic-blue/10 ring-1 ring-arctic-blue/25" : ""
                }`}
              >
                <span
                  className={`w-8 text-center font-bold ${
                    r.rank <= 3 ? "text-arctic-blue dark:text-arctic-cyan" : "text-neutral-400"
                  }`}
                >
                  {r.rank}
                </span>
                <span className="w-9 h-9 rounded-full bg-arctic-blue/15 grid place-items-center text-xs font-bold text-arctic-blue dark:text-arctic-cyan uppercase">
                  {r.display_name.slice(0, 2)}
                </span>
                <span className="flex-1 text-sm font-medium truncate">
                  {r.display_name}
                  {r.is_me && <span className="ml-2 text-xs text-arctic-blue dark:text-arctic-cyan">(toi)</span>}
                </span>
                <span className="text-sm font-semibold">{r.total_xp} XP</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      </>
      )}
    </div>
  );
}
