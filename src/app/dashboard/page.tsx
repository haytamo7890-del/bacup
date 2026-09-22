"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import {
  Sparkles, Flame, Zap, Trophy, ArrowRight, BookOpen, FileText, PlayCircle,
  ChevronRight, ChevronLeft, Library, Upload,
} from "lucide-react";
import { ProgressCurve } from "@/components/dashboard/progress-curve";
import { subjectTheme } from "@/config/subjects";
import { SubjectName } from "@/components/subject-pad";

type Stats = {
  xp: number; level: number; streak: number; accuracy: number | null;
  note_estimee: number | null; rank: number | null;
  subjects: { name: string; mastery: number }[];
};
type LeaderRow = { rank: number; display_name: string; total_xp: number; is_me: boolean };
type NewContent = { kind: "cours" | "examen"; title: string; sub: string; href: string; subject: string } | null;
type ResumeItem = { key: string; chapter: string; subject: string; done: number; total: number; href: string };

const pad = (n: number) => String(n).padStart(2, "0");
const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export default function DashboardHome() {
  const supabase = createBrowserSupabase();
  const [greeting, setGreeting] = useState("Bonjour");
  const [name, setName] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [series, setSeries] = useState<number[]>([]);
  const [board, setBoard] = useState<LeaderRow[]>([]);
  const [fresh, setFresh] = useState<NewContent>(null);
  const [resume, setResume] = useState<ResumeItem[]>([]);
  const [monkStreak, setMonkStreak] = useState<number>(-1);
  const [monkTodayDone, setMonkTodayDone] = useState(false);
  const [libFiles, setLibFiles] = useState<{ id: string; name: string; size_bytes: number; subject_code: string | null }[]>([]);
  const [libUsed, setLibUsed] = useState(0);

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 5 ? "Bonsoir" : h < 18 ? "Bonjour" : "Bonsoir");
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle();
      setName(profile?.display_name ?? "");

      const [{ data: st }, { data: sd }, { data: lb }] = await Promise.all([
        supabase.rpc("my_stats"),
        supabase.rpc("my_xp_series", { p_days: 14 }),
        supabase.rpc("leaderboard", { p_limit: 5 }),
      ]);
      if (st && !(st as { error?: unknown }).error) setStats(st as Stats);
      if (sd) setSeries((sd as { xp: number }[]).map((r) => r.xp));
      if (lb) setBoard(lb as LeaderRow[]);

      // Bibliothèque preview (recent PDFs + storage used) — safe if empty.
      const { data: lf } = await supabase.from("library_files").select("id, name, size_bytes, subject_code").order("created_at", { ascending: false }).limit(3);
      if (lf) setLibFiles(lf as { id: string; name: string; size_bytes: number; subject_code: string | null }[]);
      const { data: lu } = await supabase.rpc("library_usage");
      if (lu != null) setLibUsed(Number(lu) || 0);

      const [{ data: les }, { data: exs }] = await Promise.all([
        supabase.from("lessons").select("id, title, created_at, chapters(name, subjects(code, name))").order("created_at", { ascending: false }).limit(1),
        supabase.from("exams").select("id, title, year, created_at, subjects(code, name)").order("created_at", { ascending: false }).limit(1),
      ]);
      const l0 = (les?.[0] ?? null) as { title: string; created_at: string; chapters: { name: string; subjects: { code: string; name: string } | null } | null } | null;
      const e0 = (exs?.[0] ?? null) as { title: string | null; year: number; created_at: string; subjects: { code: string; name: string } | null } | null;
      const lTime = l0 ? Date.parse(l0.created_at) : 0;
      const eTime = e0 ? Date.parse(e0.created_at) : 0;
      if (lTime === 0 && eTime === 0) setFresh(null);
      else if (lTime >= eTime && l0) setFresh({ kind: "cours", title: l0.chapters?.name ?? "Nouveau cours", sub: l0.title, href: "/dashboard/cours", subject: l0.chapters?.subjects?.code ?? l0.chapters?.subjects?.name ?? "" });
      else if (e0) setFresh({ kind: "examen", title: e0.title ?? `Examen ${e0.year}`, sub: "Nouvel examen disponible", href: "/dashboard/examens/preparation", subject: e0.subjects?.code ?? e0.subjects?.name ?? "" });

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

      const since = new Date(); since.setDate(since.getDate() - 120);
      const [{ data: mh, error: mhe }, { data: mc }] = await Promise.all([
        supabase.from("monk_habits").select("id, is_core").eq("active", true),
        supabase.from("monk_checks").select("habit_id, day").gte("day", ymd(since)),
      ]);
      if (mhe) { setMonkStreak(-1); return; }
      const coreIds = (mh ?? []).filter((x) => (x as { is_core: boolean }).is_core).map((x) => (x as { id: string }).id);
      if (coreIds.length < 4) { setMonkStreak(-1); return; }
      const byDay = new Map<string, Set<string>>();
      for (const c of (mc ?? []) as { habit_id: string; day: string }[]) { if (!byDay.has(c.day)) byDay.set(c.day, new Set()); byDay.get(c.day)!.add(c.habit_id); }
      const complete = (d: string) => { const s = byDay.get(d); return !!s && coreIds.every((id) => s.has(id)); };
      const today = ymd(new Date());
      setMonkTodayDone(complete(today));
      const dt = new Date();
      if (!complete(ymd(dt))) dt.setDate(dt.getDate() - 1);
      let s = 0;
      for (let i = 0; i < 400; i++) { if (complete(ymd(dt))) { s++; dt.setDate(dt.getDate() - 1); } else break; }
      setMonkStreak(s);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const firstName = name.split(" ")[0];
  const xp = stats?.xp ?? 0;
  const level = stats?.level ?? 1;
  const intoLevel = xp % 100;

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-5 fade-up">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{greeting}{firstName ? `, ${firstName}` : ""}.</h1>
        <p className="mt-1.5 text-neutral-500 dark:text-neutral-400">Voici où tu en es. Chaque QCM fait monter ces chiffres. 💪</p>
      </div>

      {/* BENTO — same asymmetric layout as the reference */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7"><NewContentBanner c={fresh} /></div>
        <div className="lg:col-span-5"><MonkCell streak={monkStreak} /></div>
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
            <h3 className="text-base font-semibold tracking-tight inline-flex items-center gap-2"><Trophy className="w-4 h-4 text-arctic-blue dark:text-arctic-cyan" /> Classement national</h3>
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
          <div className="text-sm text-neutral-400 text-center py-6">Commence un examen — ta maîtrise par matière apparaîtra ici. ✨</div>
        ) : (
          <div className="space-y-4">
            {stats.subjects.map((s) => {
              const col = subjectTheme(s.name);
              const pct = Math.max(0, Math.min(100, Math.round(s.mastery)));
              return (
                <div key={s.name}>
                  <div className="flex items-center justify-between mb-1.5 text-sm">
                    <span className="font-medium inline-flex items-center gap-2"><span className={`w-2.5 h-2.5 rounded-full ${col.bar}`} /> <SubjectName name={s.name} sizeClass="text-xl" swash={false} /></span>
                    <span className={`font-bold ${col.text}`}>{pct}%</span>
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

function NewContentBanner({ c }: { c: NewContent }) {
  // Dark pad with the subject's color glowing up from the bottom edge.
  const t = subjectTheme(c?.subject ?? "");
  return (
    <Link href={c?.href ?? "/dashboard/cours"} className="group block h-full min-h-[280px] rounded-3xl p-8 relative overflow-hidden border border-white/10 bg-gradient-to-b from-neutral-900 to-neutral-950 text-white shadow-lg shadow-black/20">
      <span className={`pointer-events-none absolute -bottom-16 left-1/2 -translate-x-1/2 w-[80%] h-44 rounded-full blur-3xl opacity-60 group-hover:opacity-80 transition-opacity ${c ? t.bar : "bg-arctic-blue"}`} />
      <span className="pointer-events-none absolute right-5 -bottom-3 text-[7rem] leading-none font-black text-white/[0.05] uppercase select-none">{c ? c.title.slice(0, 2) : "★"}</span>
      <div className="relative flex flex-col h-full justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-white/70"><Sparkles className="w-3.5 h-3.5" /> Nouveau contenu</span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight leading-tight max-w-md">{c ? c.title : "Bientôt du nouveau ✨"}</h2>
          <p className="mt-2 text-sm text-white/70 max-w-md">{c ? c.sub : "Le prochain cours ou examen ajouté apparaîtra ici en premier."}</p>
        </div>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide bg-white text-neutral-900 px-5 py-2.5 rounded-full w-fit group-hover:-translate-y-0.5 transition">
          {c ? (c.kind === "cours" ? <BookOpen className="w-4 h-4" /> : <FileText className="w-4 h-4" />) : <ArrowRight className="w-4 h-4" />}
          {c ? "Découvrir" : "Explorer"}
        </span>
      </div>
    </Link>
  );
}

function MonkCell({ streak }: { streak: number }) {
  const started = streak >= 0;
  return (
    <div className="glass rounded-3xl p-5 h-full min-h-[280px] flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold inline-flex items-center gap-2"><Flame className="w-4 h-4 text-orange-500" /> Monk Mode</span>
        <Link href="/dashboard/monk" className="text-neutral-400 hover:text-arctic-blue"><ChevronRight className="w-4 h-4" /></Link>
      </div>
      <div className="flex-1 rounded-2xl ring-2 ring-arctic-blue/70 bg-white/40 dark:bg-white/[0.03] grid place-items-center p-5 text-center relative overflow-hidden">
        <div className="pointer-events-none absolute -top-14 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-arctic-blue/15 blur-3xl" />
        {started ? (
          <div className="relative">
            <div className="text-7xl font-extrabold leading-none bg-gradient-to-br from-arctic-cyan to-arctic-blue bg-clip-text text-transparent">{streak}</div>
            <div className="mt-2 text-lg font-bold tracking-tight">jour{streak > 1 ? "s" : ""} de série</div>
            <div className="mt-1 text-xs text-neutral-400">{streak === 0 ? "Coche tes non-négociables" : "Ne casse pas la chaîne 🔥"}</div>
          </div>
        ) : (
          <div className="relative">
            <div className="text-lg font-bold tracking-tight">Lance ta discipline</div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 mb-4">4 non-négociables, une série qui monte.</p>
            <Link href="/dashboard/monk" className="inline-flex items-center gap-2 text-sm font-semibold rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white px-5 py-2.5 hover:brightness-105 transition"><Flame className="w-4 h-4" /> Démarrer</Link>
          </div>
        )}
      </div>
    </div>
  );
}

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
  const col = cur ? subjectTheme(cur.subject || cur.chapter) : subjectTheme("");
  const pct = cur ? Math.round((cur.done / cur.total) * 100) : 0;

  return (
    <div className="glass rounded-3xl p-5 h-full min-h-[280px] flex flex-col">
      <span className="text-sm font-semibold inline-flex items-center gap-2 mb-3"><PlayCircle className="w-4 h-4 text-arctic-blue dark:text-arctic-cyan" /> Reprends où tu t&apos;es arrêté</span>
      {!has || !cur ? (
        <div className="flex-1 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] grid place-items-center text-center p-6">
          <div>
            <p className="text-sm text-neutral-400">Rien en cours. Ouvre un chapitre et reprends-le ici. ✨</p>
            <Link href="/dashboard/cours" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white px-4 py-2.5">Explorer les cours <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      ) : (
        <>
          <Link href={cur.href} className="group flex-1 rounded-2xl p-6 relative overflow-hidden text-white border border-white/10 bg-gradient-to-b from-neutral-900 to-neutral-950 flex flex-col justify-between">
            <span className={`pointer-events-none absolute -bottom-14 left-1/2 -translate-x-1/2 w-2/3 h-28 rounded-full blur-3xl opacity-60 group-hover:opacity-80 transition-opacity ${col.bar}`} />
            <span className="pointer-events-none absolute right-4 -bottom-2 text-8xl font-black text-white/[0.05] uppercase select-none">{(cur.subject || cur.chapter).slice(0, 2)}</span>
            <div className="relative">
              <div className={`text-xs font-bold uppercase tracking-wide ${col.text}`}>{cur.subject || "Cours"}</div>
              <div className="mt-2 text-2xl font-extrabold tracking-tight leading-tight">{cur.chapter}</div>
              <div className="mt-1 text-sm text-white/70">{cur.done}/{cur.total} leçons terminées</div>
            </div>
            <div className="relative">
              <div className="h-1.5 rounded-full bg-white/15 overflow-hidden"><div className={`h-full ${col.bar} rounded-full`} style={{ width: `${Math.max(6, pct)}%` }} /></div>
              <span className="mt-3 inline-flex items-center gap-2 text-sm font-bold bg-white text-neutral-900 px-4 py-2 rounded-full group-hover:-translate-y-0.5 transition"><PlayCircle className="w-4 h-4" /> Reprendre</span>
            </div>
          </Link>
          {items.length > 1 && (
            <div className="mt-3 flex items-center justify-center gap-3">
              <button onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx === 0} className="w-8 h-8 rounded-full chip grid place-items-center disabled:opacity-40 hover:-translate-y-0.5 transition"><ChevronLeft className="w-4 h-4" /></button>
              <div className="flex gap-1.5">
                {items.map((_, i) => (
                  <button key={i} onClick={() => setIdx(i)} className={`h-2 rounded-full transition-all ${i === Math.min(idx, items.length - 1) ? "w-5 bg-arctic-blue" : "w-2 bg-neutral-300 dark:bg-neutral-700"}`} />
                ))}
              </div>
              <button onClick={() => setIdx((i) => Math.min(items.length - 1, i + 1))} disabled={idx >= items.length - 1} className="w-8 h-8 rounded-full chip grid place-items-center disabled:opacity-40 hover:-translate-y-0.5 transition"><ChevronRight className="w-4 h-4" /></button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
