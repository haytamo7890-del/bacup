"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { Trophy, Timer, Users, Share2, Flame, MapPin, ChevronRight, Zap, RefreshCw } from "lucide-react";

export type Challenge = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  level_code: string | null;
  subject_name: string | null;
  opens_at: string;
  closes_at: string;
  status: "upcoming" | "live" | "closed";
  participants: number;
};
export type Row = { rank: number; name: string; city: string | null; track: string | null; score: number; time_spent_s: number | null };

function maskName(n: string): string {
  const parts = n.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[1].charAt(0).toUpperCase()}.`;
}
function fmtTime(s: number | null): string {
  if (s == null) return "—";
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${String(ss).padStart(2, "0")}`;
}
function useCountdown(target: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, new Date(target).getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s, done: diff === 0 };
}

export default function DefiClient({ challenge, initialBoard }: { challenge: Challenge | null; initialBoard: Row[] }) {
  const supabase = createBrowserSupabase();
  const [board, setBoard] = useState<Row[]>(initialBoard);
  const [filter, setFilter] = useState<string>("National");
  const [refreshing, setRefreshing] = useState(false);
  const [participants, setParticipants] = useState(challenge?.participants ?? 0);

  const isLive = challenge?.status === "live";
  const target = challenge ? (challenge.status === "upcoming" ? challenge.opens_at : challenge.closes_at) : new Date().toISOString();
  const cd = useCountdown(target);

  const refresh = useMemo(
    () => async () => {
      if (!challenge) return;
      setRefreshing(true);
      const { data } = await supabase.rpc("challenge_leaderboard", { p_challenge: challenge.id, p_limit: 50 });
      if (data) setBoard(data as Row[]);
      const { data: cc } = await supabase.rpc("current_challenge");
      if (cc && cc[0]) setParticipants(cc[0].participants);
      setRefreshing(false);
    },
    [challenge, supabase]
  );

  // auto-refresh the live leaderboard every 30s
  useEffect(() => {
    if (!isLive) return;
    const id = setInterval(refresh, 30000);
    return () => clearInterval(id);
  }, [isLive, refresh]);

  const tracks = useMemo(() => {
    const set = new Set<string>();
    board.forEach((r) => r.track && set.add(r.track));
    return ["National", ...[...set].sort()];
  }, [board]);
  const shown = useMemo(() => {
    if (filter === "National") return board;
    const filtered = board.filter((r) => r.track === filter);
    return filtered.map((r, i) => ({ ...r, rank: i + 1 }));
  }, [board, filter]);

  function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = "Je participe au Défi National Bac-up cette semaine 🇲🇦📚 Rejoins-moi et grimpe dans le classement !";
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: "Défi National Bac-up", text, url }).catch(() => {});
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`${text} ${url}`);
    }
  }

  if (!challenge) {
    return (
      <div className="c-card rounded-3xl p-10 text-center max-w-xl mx-auto">
        <Trophy className="w-8 h-8 c-accent mx-auto" />
        <h2 className="mt-4 text-xl font-bold">Le prochain Défi arrive bientôt.</h2>
        <p className="mt-2 c-sub text-sm">Reviens vite — le concours national de la semaine se prépare.</p>
      </div>
    );
  }

  const badge =
    challenge.status === "live"
      ? { t: "EN DIRECT", c: "bg-emerald-500/15 text-emerald-500" }
      : challenge.status === "upcoming"
      ? { t: "BIENTÔT", c: "bg-amber-500/15 text-amber-500" }
      : { t: "TERMINÉ", c: "c-chip" };

  return (
    <div className="space-y-8">
      {/* hero card */}
      <div className="relative overflow-hidden rounded-[28px] border border-arctic-cyan/25 bg-gradient-to-br from-arctic-cyan/12 to-arctic-blue/8 p-7 sm:p-9">
        <div className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 bg-arctic-cyan/20 blur-[90px] rounded-full" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold tracking-wide px-2.5 py-1 rounded-full ${badge.c}`}>
              {challenge.status === "live" && <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5 align-middle" />}
              {badge.t}
            </span>
            <span className="text-[11px] font-semibold c-chip px-2.5 py-1 rounded-full">{challenge.level_code} · {challenge.subject_name}</span>
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight">{challenge.title}</h1>
          {challenge.subtitle && <p className="mt-2 c-sub">{challenge.subtitle}</p>}

          {/* countdown */}
          <div className="mt-6">
            <div className="text-xs font-semibold c-dim uppercase tracking-wide">
              {challenge.status === "upcoming" ? "Ouverture dans" : challenge.status === "live" ? "Se termine dans" : "Défi clôturé"}
            </div>
            {challenge.status !== "closed" && (
              <div className="mt-2 flex gap-2.5">
                {[{ v: cd.d, l: "j" }, { v: cd.h, l: "h" }, { v: cd.m, l: "min" }, { v: cd.s, l: "s" }].map((u) => (
                  <div key={u.l} className="c-card rounded-xl px-3 py-2 text-center min-w-[54px]">
                    <div className="text-2xl font-extrabold tabular-nums">{String(u.v).padStart(2, "0")}</div>
                    <div className="text-[10px] c-dim">{u.l}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* stats + CTAs */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-sm c-sub"><Users className="w-4 h-4 c-accent" /> <b className="tabular-nums">{participants}</b> participant{participants > 1 ? "s" : ""}</span>
            {isLive ? (
              <Link href={`/dashboard/examens?defi=${challenge.id}`} className="px-6 py-3 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white text-sm font-semibold hover:brightness-105 transition inline-flex items-center gap-2">
                <Zap className="w-4 h-4" /> Participer maintenant
              </Link>
            ) : challenge.status === "upcoming" ? (
              <span className="px-6 py-3 rounded-full c-soft text-sm font-semibold inline-flex items-center gap-2 opacity-70"><Timer className="w-4 h-4" /> Bientôt disponible</span>
            ) : (
              <Link href="/signup" className="px-6 py-3 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white text-sm font-semibold hover:brightness-105 transition">Voir le prochain défi</Link>
            )}
            <button onClick={share} className="px-5 py-3 rounded-full c-soft text-sm font-semibold hover:brightness-95 transition inline-flex items-center gap-2">
              <Share2 className="w-4 h-4" /> Partager
            </button>
          </div>
        </div>
      </div>

      {/* how it works */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { icon: Timer, t: "Même sujet, même semaine", d: "Tout le Maroc passe le même examen blanc chronométré, dans la fenêtre du défi." },
          { icon: Trophy, t: "Classement national en direct", d: "Ta note /20 et ton temps te placent instantanément dans le classement, par filière et par ville." },
          { icon: Flame, t: "XP, badges & fierté", d: "Gagne de l'XP, garde ta série, et partage ton rang avec tes amis et tes parents." },
        ].map((s) => (
          <div key={s.t} className="c-card rounded-2xl p-5">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-arctic-cyan/25 to-arctic-blue/25 c-accent grid place-items-center"><s.icon className="w-5 h-5" /></span>
            <h3 className="mt-3 font-bold tracking-tight">{s.t}</h3>
            <p className="mt-1.5 text-sm c-sub leading-relaxed">{s.d}</p>
          </div>
        ))}
      </div>

      {/* leaderboard */}
      <div className="c-card rounded-3xl p-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-lg font-bold tracking-tight flex items-center gap-2"><Trophy className="w-5 h-5 c-accent" /> Classement national</h2>
          <button onClick={refresh} className="text-xs c-sub inline-flex items-center gap-1.5 hover:opacity-80">
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} /> Actualiser
          </button>
        </div>

        {tracks.length > 1 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tracks.map((t) => (
              <button key={t} onClick={() => setFilter(t)} className={`text-xs font-semibold px-3 py-1.5 rounded-full transition ${filter === t ? "bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white" : "c-chip"}`}>
                {t}
              </button>
            ))}
          </div>
        )}

        {shown.length === 0 ? (
          <div className="mt-6 rounded-2xl c-soft p-8 text-center">
            <Zap className="w-7 h-7 c-accent mx-auto" />
            <p className="mt-3 font-semibold">Le classement se remplit en direct.</p>
            <p className="mt-1 text-sm c-sub">{isLive ? "Sois le premier à lancer le Défi cette semaine — ta place t'attend en haut du tableau." : "Reviens à l'ouverture du prochain défi."}</p>
            {isLive && (
              <Link href={`/dashboard/examens?defi=${challenge.id}`} className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white text-sm font-semibold">
                Prendre la 1ʳᵉ place <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        ) : (
          <div className="mt-5 space-y-1.5">
            {shown.map((r) => (
              <div key={`${r.name}-${r.rank}`} className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 ${r.rank <= 3 ? "bg-arctic-cyan/10 border border-arctic-cyan/20" : "c-soft"}`}>
                <span className={`w-7 text-center font-extrabold ${r.rank === 1 ? "text-amber-400" : r.rank === 2 ? "text-slate-400" : r.rank === 3 ? "text-orange-400" : "c-dim text-sm"}`}>
                  {r.rank <= 3 ? ["🥇", "🥈", "🥉"][r.rank - 1] : r.rank}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold truncate">{maskName(r.name)}</div>
                  <div className="text-[11px] c-dim flex items-center gap-2">
                    {r.track && <span>{r.track}</span>}
                    {r.city && <span className="inline-flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {r.city}</span>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold c-accent tabular-nums">{Number(r.score).toFixed(1)}<span className="text-[11px] c-dim">/20</span></div>
                  <div className="text-[11px] c-dim tabular-nums">{fmtTime(r.time_spent_s)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
