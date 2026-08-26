"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { GraduationCap, Target, Trophy, Flame, Zap, type LucideIcon } from "lucide-react";

export default function DashboardHome() {
  const supabase = createBrowserSupabase();
  const [name, setName] = useState("");
  const [greeting, setGreeting] = useState("Bonjour");
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 5 ? "Bonsoir" : h < 18 ? "Bonjour" : "Bonsoir");
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
      const { data: subs } = await supabase
        .from("subjects")
        .select("id, name")
        .order("name")
        .limit(8);
      setName(profile?.display_name ?? "");
      setSubjects(subs ?? []);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const firstName = name.split(" ")[0];

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8 fade-up">
      {/* greeting */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          {greeting}
          {firstName ? `, ${firstName}` : ""}.
        </h1>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">
          Voici où tu en es. Chaque QCM fait monter ces chiffres. 💪
        </p>
      </div>

      {/* ratio cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Ratio icon={GraduationCap} label="Note Bac estimée" value="—" unit="/20" accent />
        <Ratio icon={Target} label="Précision" value="—" unit="%" />
        <Ratio icon={Flame} label="Série" value="0" unit="j" color="text-orange-500" />
        <Ratio icon={Trophy} label="Rang national" value="—" />
      </div>

      {/* level / XP */}
      <div className="glass rounded-3xl p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-arctic-blue/15 text-arctic-blue dark:text-arctic-cyan grid place-items-center">
              <Zap className="w-5 h-5" />
            </span>
            <div>
              <div className="font-semibold tracking-tight">Niveau 1</div>
              <div className="text-xs text-neutral-400">Débutant</div>
            </div>
          </div>
          <div className="text-sm text-neutral-400">
            0 / 100 <span className="font-medium">XP</span>
          </div>
        </div>
        <div className="h-2.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
          <div className="h-full w-[3%] bg-gradient-to-r from-arctic-cyan to-arctic-blue" />
        </div>
        <p className="mt-3 text-xs text-neutral-400">
          Gagne 100 XP pour atteindre le niveau 2 — chaque bonne réponse compte.
        </p>
      </div>

      {/* mastery per subject */}
      <div className="glass rounded-3xl p-6">
        <h3 className="text-base font-semibold tracking-tight mb-5">Maîtrise par matière</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {subjects.length === 0 && (
            <div className="text-sm text-neutral-400">Chargement…</div>
          )}
          {subjects.slice(0, 4).map((s) => (
            <Ring key={s.id} value={0} label={s.name} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Ratio({
  icon: Icon,
  label,
  value,
  unit,
  accent = false,
  color,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  unit?: string;
  accent?: boolean;
  color?: string;
}) {
  return (
    <div className={`glass rounded-2xl p-5 ${accent ? "ring-1 ring-arctic-blue/25" : ""}`}>
      <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-xs">
        <Icon className={`w-4 h-4 ${color ?? ""}`} /> {label}
      </div>
      <div className="mt-2 text-3xl font-bold tracking-tight">
        {value}
        {unit && <span className="text-lg text-neutral-400 font-medium">{unit}</span>}
      </div>
    </div>
  );
}

function Ring({ value, label }: { value: number; label: string }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="relative w-[72px] h-[72px]">
        <svg width="72" height="72" className="-rotate-90">
          <circle cx="36" cy="36" r={r} strokeWidth="6" fill="none" className="stroke-black/5 dark:stroke-white/10" />
          <circle
            cx="36"
            cy="36"
            r={r}
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            stroke="#1b7fdc"
            strokeDasharray={c}
            strokeDashoffset={off}
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center text-sm font-bold">{value}%</span>
      </div>
      <span className="text-xs text-neutral-400 text-center truncate max-w-[80px]">{label}</span>
    </div>
  );
}
