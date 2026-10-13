"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import {
  Zap, Trophy, ArrowRight, FileText,
  ChevronRight, Library, Upload,
} from "lucide-react";
import { ProgressCurve } from "@/components/dashboard/progress-curve";
import { subjectTheme } from "@/config/subjects";
import { SubjectBanner } from "@/components/subject-banner";
import { MonkCard } from "@/components/dashboard/monk-card";
import { Mascot, dashboardLines, type MascotLine } from "@/components/mascot/mascot";
import { PlanTodayCard, type PlanDayInfo } from "@/components/plan/today-card";
import { loadPlan } from "@/lib/plan/data";
import { loadPrepStats } from "@/lib/prep";

type Stats = {
  xp: number; level: number; streak: number; accuracy: number | null;
  note_estimee: number | null; rank: number | null;
  subjects: { name: string; mastery: number }[];
};
type LeaderRow = { rank: number; display_name: string; total_xp: number; is_me: boolean };
type ResumeItem = { key: string; chapter: string; subject: string; done: number; total: number; href: string };


export default function DashboardHome() {
  const supabase = createBrowserSupabase();
  const [greeting, setGreeting] = useState("Bonjour");
  const [tagline, setTagline] = useState("");
  const [name, setName] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [series, setSeries] = useState<number[]>([]);
  const [board, setBoard] = useState<LeaderRow[]>([]);
  const [myRank, setMyRank] = useState<{ rank: number; total_xp: number } | null>(null);
  const [resume, setResume] = useState<ResumeItem[]>([]);
  const [libFiles, setLibFiles] = useState<{ id: string; name: string; size_bytes: number; subject_code: string | null }[]>([]);
  const [libUsed, setLibUsed] = useState(0);
  const [talkIn, setTalkIn] = useState<Omit<Parameters<typeof dashboardLines>[0], "plan"> & { hasPlan: boolean } | null>(null);
  const [planDay, setPlanDay] = useState<PlanDayInfo | undefined>(undefined);
  const talk = useMemo<MascotLine[]>(() => {
    if (!talkIn || (talkIn.hasPlan && planDay === undefined)) return [];
    return dashboardLines({ ...talkIn, plan: planDay ?? null });
  }, [talkIn, planDay]);

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 5 ? "Bonsoir" : h < 18 ? "Bonjour" : "Bonsoir");
    // tagline changes with the moment of the day (matin · après-midi · soir)
    setTagline(
      h >= 5 && h < 12 ? "La tête est fraîche, profites-en."
      : h >= 12 && h < 18 ? "Une série maintenant, c'est ça de pris."
      : "Dix minutes ce soir valent mieux que rien demain.",
    );
    // Le Lauréat: away for a while? reviews / errors waiting? non-négociables left tonight?
    (async () => {
      const VISIT = "bacup.lastVisit";
      let daysAway = 0;
      try {
        const prev = localStorage.getItem(VISIT);
        if (prev) daysAway = Math.floor((Date.now() - Date.parse(prev)) / 86_400_000);
        localStorage.setItem(VISIT, new Date().toISOString());
      } catch { /* private mode */ }
      const d = new Date();
      const day = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const [st, { data: hb, error: he }, { data: ck }, plan, { data: lv }] = await Promise.all([
        loadPrepStats(supabase).catch(() => null),
        supabase.from("monk_habits").select("id, is_core").eq("active", true),
        supabase.from("monk_checks").select("habit_id").eq("day", day),
        loadPlan(supabase).catch(() => null),
        supabase.auth.getUser().then(async ({ data: { user } }) => user ? await supabase.from("student_profiles").select("levels(code)").eq("id", user.id).maybeSingle() : { data: null }),
      ]);
      const is2bac = (lv?.levels as unknown as { code: string } | null)?.code === "2bac";
      let monkLeft: number | null = null;
      if (!he) {
        const core = ((hb ?? []) as { id: string; is_core: boolean }[]).filter((x) => x.is_core).map((x) => x.id);
        const done = new Set(((ck ?? []) as { habit_id: string }[]).map((x) => x.habit_id));
        if (core.length >= 4) monkLeft = core.filter((id) => !done.has(id)).length;
      }
      setTalkIn({ daysAway, due: st?.due ?? 0, errors: st?.errors ?? 0, monkLeft, hour: h, noPlan: is2bac && !plan, hasPlan: !!plan });
    })();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle();
      setName(profile?.display_name ?? "");

      const [{ data: st }, { data: sd }, { data: lb }, { data: mr }] = await Promise.all([
        supabase.rpc("my_stats"),
        supabase.rpc("my_xp_series", { p_days: 14 }),
        supabase.rpc("leaderboard", { p_period: "week", p_limit: 3 }),
        supabase.rpc("my_rank", { p_period: "week" }),
      ]);
      if (st && !(st as { error?: unknown }).error) setStats(st as Stats);
      if (sd) setSeries((sd as { xp: number }[]).map((r) => r.xp));
      if (lb) setBoard(lb as LeaderRow[]);
      { const m = Array.isArray(mr) ? mr[0] : mr; if (m) setMyRank({ rank: Number((m as { rank: number }).rank), total_xp: Number((m as { total_xp: number }).total_xp) }); }

      // Bibliothèque preview (recent PDFs + storage used) — safe if empty.
      const { data: lf } = await supabase.from("library_files").select("id, name, size_bytes, subject_code").order("created_at", { ascending: false }).limit(3);
      if (lf) setLibFiles(lf as { id: string; name: string; size_bytes: number; subject_code: string | null }[]);
      const { data: lu } = await supabase.rpc("library_usage");
      if (lu != null) setLibUsed(Number(lu) || 0);


      const { data: comp } = await supabase.from("lesson_completions").select("lesson_id");
      const doneIds = new Set((comp ?? []).map((r) => r.lesson_id as string));
      if (doneIds.size > 0) {
        const { data: allLes } = await supabase.from("lessons").select("id, chapter_id, chapters(name, subjects(name))").limit(500);
        const byChap = new Map<string, { name: string; subject: string; total: number; done: number }>();
        for (const l of (allLes ?? []) as unknown as { id: string; chapter_id: string; chapters: { name: string; subjects: { name: string } | null } | null }[]) {
          if (!l.chapter_id) continue;
          const cur = byChap.get(l.chapter_id) ?? { name: l.chapters?.name ?? "Chapitre", subject: l.chapters?.subjects?.name ?? "", total: 0, done: 0 };
          cur.total += 1; if (doneIds.has(l.id)) cur.done += 1;
          byChap.set(l.chapter_id, cur);
        }
        const items: ResumeItem[] = [];
        for (const [key, v] of byChap) if (v.done > 0 && v.done < v.total) items.push({ key, chapter: v.name, subject: v.subject, done: v.done, total: v.total, href: "/dashboard/cours" });
        setResume(items.slice(0, 6));
      }

    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const firstName = name.split(" ")[0];
  const xp = stats?.xp ?? 0;
  const level = stats?.level ?? 1;
  const intoLevel = xp % 100;

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-5 fade-up">
      <Mascot lines={talk} size="sm" variant="inline">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{greeting}{firstName ? `, ${firstName}` : ""}.</h1>
        <p className="mt-1.5 min-h-[1.5em] text-neutral-500 dark:text-neutral-400">{tagline}</p>
      </Mascot>

      {/* BENTO — same asymmetric layout as the reference */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 min-w-0"><PlanTodayCard onDay={setPlanDay} /></div>
        <div className="lg:col-span-5"><MonkCard /></div>
        <div className="lg:col-span-5"><LibraryCell files={libFiles} usedBytes={libUsed} /></div>
        <div className="lg:col-span-7"><ResumeCarousel items={resume} /></div>
      </div>

      {/* XP level bar */}
      <div className="glass rounded-3xl p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-arctic-blue/15 text-arctic-blue dark:text-arctic-cyan grid place-items-center"><Zap className="w-5 h-5" /></span>
            <div><div className="font-semibold tracking-tight">Niveau {level}</div><div className="text-xs text-neutral-400">{xp} XP au total</div></div>
          </div>
          <div className="text-sm text-neutral-400">{intoLevel} / 100 <span className="font-medium">XP</span></div>
        </div>
        <div className="h-2.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-arctic-cyan to-arctic-blue transition-all" style={{ width: `${Math.max(3, intoLevel)}%` }} />
        </div>
        <p className="mt-3 text-xs text-neutral-400">Encore {100 - intoLevel} XP pour atteindre le niveau {level + 1}.</p>
      </div>

      {/* classement + courbe */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="glass rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold tracking-tight inline-flex items-center gap-2"><Trophy className="w-4 h-4 text-arctic-blue dark:text-arctic-cyan" /> Classement · ta filière</h3>
            <Link href="/dashboard/classement" className="text-xs font-semibold text-arctic-blue dark:text-arctic-cyan inline-flex items-center gap-1">Tout voir <ChevronRight className="w-3.5 h-3.5" /></Link>
          </div>
          {board.length === 0 ? (
            <div className="text-sm text-neutral-400 text-center py-6">Le classement se remplit dès les premiers QCM.</div>
          ) : (
            <ul className="space-y-1">
              {board.map((r) => (
                <li key={`${r.rank}-${r.display_name}`} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${r.is_me ? "bg-arctic-blue/10 ring-1 ring-arctic-blue/25" : ""}`}>
                  <span className={`w-6 text-center font-bold text-sm ${r.rank <= 3 ? "text-arctic-blue dark:text-arctic-cyan" : "text-neutral-400"}`}>{r.rank}</span>
                  <span className="w-8 h-8 rounded-full bg-arctic-blue/15 grid place-items-center text-[11px] font-bold text-arctic-blue dark:text-arctic-cyan uppercase">{r.display_name.slice(0, 2)}</span>
                  <span className="flex-1 text-sm font-medium truncate">{r.display_name}{r.is_me && <span className="ml-2 text-xs text-arctic-blue dark:text-arctic-cyan">(toi)</span>}</span>
                  <span className="text-sm font-semibold">{r.total_xp} XP</span>
                </li>
              ))}
            </ul>
          )}
          {myRank && !board.some((r) => r.is_me) && board.length > 0 && (
            <div className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 bg-arctic-blue/10 ring-1 ring-arctic-blue/25">
              <span className="w-6 text-center font-bold text-sm text-arctic-blue dark:text-arctic-cyan">{myRank.rank}</span>
              <span className="w-8 h-8 rounded-full bg-arctic-blue/15 grid place-items-center text-[11px] font-bold text-arctic-blue dark:text-arctic-cyan uppercase">TO</span>
              <span className="flex-1 text-sm font-medium truncate">Toi <span className="ml-1 text-xs text-arctic-blue dark:text-arctic-cyan">(cette semaine)</span></span>
              <span className="text-sm font-semibold">{myRank.total_xp} XP</span>
            </div>
          )}
        </div>
        <div className="glass rounded-3xl p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold tracking-tight">Ta progression</h3>
            <span className="text-xs text-neutral-400">14 j · XP</span>
          </div>
          <ProgressCurve points={series} />
        </div>
      </div>

      {/* maîtrise par matière */}
      <div className="glass rounded-3xl p-6">
        <h3 className="text-base font-semibold tracking-tight mb-5">Maîtrise par matière</h3>
        {!stats || stats.subjects.length === 0 ? (
          <div className="text-sm text-neutral-400 text-center py-6">Commence un examen — ta maîtrise par matière apparaîtra ici.</div>
        ) : (
          <div className="space-y-4">
            {stats.subjects.map((s) => {
              const col = subjectTheme(s.name);
              const pct = Math.max(0, Math.min(100, Math.round(s.mastery)));
              return (
                <div key={s.name}>
                  <div className="flex items-center justify-between mb-1.5 text-sm">
                    <span className="inline-flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${col.bar}`} /> <span dir="auto" className="font-display text-[15px] font-medium text-neutral-800 dark:text-neutral-100">{s.name}</span></span>
                    <span className="font-display text-[15px] font-semibold tabular-nums text-neutral-500 dark:text-neutral-400">{pct}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                    <div className={`h-full ${col.bar} rounded-full transition-all duration-500`} style={{ width: `${Math.max(3, pct)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- BENTO CELLS ---------- */

function LibraryCell({ files, usedBytes }: { files: { id: string; name: string; size_bytes: number; subject_code: string | null }[]; usedBytes: number }) {
  const QUOTA = 250 * 1024 * 1024;
  const pct = Math.min(100, Math.round((usedBytes / QUOTA) * 100));
  const fmt = (b: number) => (b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} Ko` : `${(b / 1024 / 1024).toFixed(1)} Mo`);
  return (
    <div className="glass rounded-3xl p-5 h-full min-h-[280px] flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold inline-flex items-center gap-2"><Library className="w-4 h-4 text-arctic-blue dark:text-arctic-cyan" /> Bibliothèque</span>
        <Link href="/dashboard/bibliotheque" className="text-neutral-400 hover:text-arctic-blue"><ChevronRight className="w-4 h-4" /></Link>
      </div>

      {files.length === 0 ? (
        <Link href="/dashboard/bibliotheque" className="group flex-1 rounded-2xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 grid place-items-center text-center p-5 hover:border-arctic-blue/60 transition">
          <div>
            <span className="w-12 h-12 rounded-2xl bg-arctic-blue/10 text-arctic-blue dark:text-arctic-cyan grid place-items-center mx-auto group-hover:scale-105 transition"><Upload className="w-5 h-5" /></span>
            <div className="mt-3 text-sm font-bold tracking-tight">Ajoute tes PDF</div>
            <p className="text-xs text-neutral-400 mt-1">Range tes fiches et révise-les dans l&apos;app.</p>
          </div>
        </Link>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="space-y-1.5">
            {files.map((f) => (
              <Link key={f.id} href="/dashboard/bibliotheque" className="group flex items-center gap-3 rounded-xl px-2.5 py-2 hover:bg-black/[0.04] dark:hover:bg-white/[0.05] transition">
                <span className="w-9 h-9 rounded-lg bg-red-500/10 text-red-500 grid place-items-center shrink-0"><FileText className="w-4 h-4" /></span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 min-w-0">
                    {f.subject_code && <span className={`w-2 h-2 rounded-full shrink-0 ${subjectTheme(f.subject_code).bar}`} />}
                    <span className="block text-sm font-medium truncate">{f.name}</span>
                  </span>
                  <span className="block text-[11px] text-neutral-400">{fmt(f.size_bytes)}</span>
                </span>
                <ArrowRight className="w-4 h-4 text-neutral-300 dark:text-neutral-600 opacity-0 group-hover:opacity-100 transition" />
              </Link>
            ))}
          </div>
          <div className="mt-auto pt-3">
            <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
              <span>{fmt(usedBytes)} / 250 Mo</span>
              <Link href="/dashboard/bibliotheque" className="font-semibold text-arctic-blue dark:text-arctic-cyan inline-flex items-center gap-1">Ouvrir <ChevronRight className="w-3 h-3" /></Link>
            </div>
            <div className="h-1.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden"><div className="h-full bg-gradient-to-r from-arctic-cyan to-arctic-blue rounded-full" style={{ width: `${Math.max(2, pct)}%` }} /></div>
          </div>
        </div>
      )}
    </div>
  );
}

function ResumeCarousel({ items }: { items: ResumeItem[] }) {
  const [idx, setIdx] = useState(0);
  const has = items.length > 0;
  const cur = has ? items[Math.min(idx, items.length - 1)] : null;
  if (!has || !cur) {
    return (
      <SubjectBanner mode="new" code="" name="Bac Up" href="/dashboard/cours" subtitle="Rien en cours — ouvre un chapitre et reprends-le ici." className="h-full min-h-[220px]" />
    );
  }
  return (
    <div className="h-full flex flex-col gap-3">
      <SubjectBanner
        mode="resume"
        code={cur.subject || cur.chapter}
        name={cur.subject || cur.chapter}
        href={cur.href}
        subtitle={`${cur.chapter} · ${cur.done}/${cur.total} leçons`}
        done={cur.done}
        total={cur.total}
        className="flex-1 min-h-[220px]"
      />
      {items.length > 1 && (
        <div className="flex items-center justify-center gap-1.5">
          {items.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} aria-label={`Reprise ${i + 1}`} className={`h-2 rounded-full transition-all ${i === Math.min(idx, items.length - 1) ? "w-5 bg-arctic-blue" : "w-2 bg-neutral-300 dark:bg-neutral-700"}`} />
          ))}
        </div>
      )}
    </div>
  );
}
