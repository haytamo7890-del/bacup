"use client";

/**
 * Préparation — hub. Two blocks, one decision:
 *   1. « Aujourd'hui » : ONE next action (révision due → erreurs → reprendre → commencer)
 *      + the day's gamification (série de jours, objectif XP du jour, niveau).
 *   2. « Tes matières » : one row per matière, one ring (chapitres travaillés → réussite),
 *      one status. Everything else lives inside the matière.
 * Route: /dashboard/examens/preparation
 */
import { createElement, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { curriculumFor, fmtDuration, PREP_FILIERES, type SubjectRef } from "@/config/curriculum";
import { subjectTheme } from "@/config/subjects";
import { subjectIcon } from "@/components/subject-pad";
import { FEATURES, PREP_GOALS } from "@/config";
import { CARD, ACCENT, Tray, Ring } from "@/components/prep/ui";
import {
  loadStudentCtx, loadChapters, loadBank, loadMastery, loadPrepStats, prepRoutes,
  type StudentCtx, type PrepChapter, type ChapterMastery, type PrepStats,
} from "@/lib/prep";
import { Loader2, ChevronRight, Flame, Zap, Brain, NotebookPen, Play, Compass, type LucideIcon } from "lucide-react";

type Row = { id: string; code: string; name: string; coeff: number | null; durationMin: number | null; chapters: PrepChapter[]; nQ: number; mastery: number | null; worked: number };
type Me = { xp: number; level: number; streak: number; today: number };
type Next = { eyebrow: string; title: string; sub: string; href: string; cta: string; icon: LucideIcon };

export default function PreparationHub() {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const [loading, setLoading] = useState(true);
  const [ctx, setCtx] = useState<StudentCtx | null>(null);
  const [chapters, setChapters] = useState<PrepChapter[]>([]);
  const [qByCh, setQByCh] = useState<Map<string, number>>(new Map());
  const [mastery, setMastery] = useState<Map<string, ChapterMastery>>(new Map());
  const [stats, setStats] = useState<PrepStats | null>(null);
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    let live = true;
    (async () => {
      const c = await loadStudentCtx(supabase);
      if (!live) return;
      setCtx(c);
      // gamification strip — independent of the content load
      void Promise.all([
        supabase.rpc("my_stats"),
        supabase.rpc("my_xp_series", { p_days: 1 }),
        loadPrepStats(supabase).catch(() => null),
      ]).then(([{ data: st }, { data: sd }, ps]) => {
        if (!live) return;
        const s = st as { xp?: number; level?: number; streak?: number; error?: unknown } | null;
        const days = (sd ?? []) as { xp: number }[];
        if (s && !s.error) setMe({ xp: s.xp ?? 0, level: s.level ?? 1, streak: s.streak ?? 0, today: Number(days[days.length - 1]?.xp ?? 0) });
        setStats(ps);
      });
      // Own filière only: a student never browses another filière's content.
      if (!c?.levelId || !c.ownTrack) { setLoading(false); return; }
      const trackId = c.trackIdByCode.get(c.ownTrack) ?? null;
      const chs = await loadChapters(supabase, c.levelId, null, trackId, c.ownTrack);
      const [b, m] = await Promise.all([loadBank(supabase, chs.map((x) => x.id)), loadMastery(supabase, chs.map((x) => x.id))]);
      if (!live) return;
      const counts = new Map<string, number>();
      for (const q of b.questions) counts.set(q.chapter_id, (counts.get(q.chapter_id) ?? 0) + 1);
      setChapters(chs); setQByCh(counts); setMastery(m);
      setLoading(false);
    })();
    return () => { live = false; };
  }, [supabase]);

  const filiere = ctx?.ownTrack ?? null;
  const supported = !!(ctx?.levelCode === "2bac" && filiere && PREP_FILIERES.has(filiere));

  const rows = useMemo<Row[]>(() => {
    if (!ctx || !filiere) return [];
    const build = (s: { id: string; code: string; name: string }, coeff: number | null, durationMin: number | null): Row => {
      const chs = chapters.filter((c) => c.subject_id === s.id && (qByCh.get(c.id) ?? 0) > 0); // empty chapters hidden
      const ms = chs.map((c) => mastery.get(c.id)).filter(Boolean) as ChapterMastery[];
      return {
        id: s.id, code: s.code, name: s.name, coeff, durationMin, chapters: chs,
        nQ: chs.reduce((a, c) => a + (qByCh.get(c.id) ?? 0), 0),
        mastery: ms.length ? Math.round(ms.reduce((a, x) => a + x.mastery_pct, 0) / ms.length) : null,
        worked: ms.length,
      };
    };
    const ref: SubjectRef[] | null = curriculumFor(ctx.levelCode, filiere);
    if (ref) return ref.map((r) => { const s = ctx.subjectsByCode.get(r.code); return s ? build(s, r.coeff, r.durationMin) : null; }).filter(Boolean) as Row[];
    const ids = [...new Set(chapters.map((c) => c.subject_id))];
    return ids.map((id) => ctx.subjectsById.get(id)).filter(Boolean).map((s) => build(s!, null, null)).sort((a, b) => a.name.localeCompare(b.name));
  }, [ctx, filiere, chapters, qByCh, mastery]);

  // ONE next action, in priority order.
  const next = useMemo<Next | null>(() => {
    if (stats?.due) return {
      eyebrow: "Révision du jour", icon: Brain, href: prepRoutes.review(), cta: "Réviser",
      title: `${stats.due} question${stats.due > 1 ? "s" : ""} à revoir`,
      sub: "Tes anciennes erreurs reviennent au bon moment. C'est le plus rentable de ta journée.",
    };
    if (stats?.errors) return {
      eyebrow: "Journal d'erreurs", icon: NotebookPen, href: prepRoutes.errors(), cta: "Corriger",
      title: `${stats.errors} erreur${stats.errors > 1 ? "s" : ""} à corriger`,
      sub: "Rejoue-les jusqu'à les réussir : chacune corrigée compte pour ta maîtrise.",
    };
    let best: ChapterMastery | null = null;
    for (const m of mastery.values()) if (m.last_practiced_at && (!best || m.last_practiced_at > (best.last_practiced_at ?? ""))) best = m;
    const ch = best ? chapters.find((c) => c.id === best!.chapter_id) : null;
    const row = ch ? rows.find((r) => r.id === ch.subject_id) : null;
    if (ch && row) return {
      eyebrow: `Reprendre · ${row.name}`, icon: Play, cta: "Continuer",
      href: prepRoutes.subject(row.code, { chapter: ch.id }),
      title: ch.name, sub: `${Math.round(best!.mastery_pct)} % de réussite sur ce chapitre. Termine ses notions.`,
    };
    const first = rows.find((r) => r.nQ > 0);
    if (first) return {
      eyebrow: "Premier pas", icon: Compass, cta: "Commencer",
      href: prepRoutes.subject(first.code, first.chapters[0] ? { chapter: first.chapters[0].id } : {}),
      title: `Commence par ${first.name}`, sub: "Une notion à la fois : des QCU courts, corrigés tout de suite.",
    };
    return null;
  }, [stats, mastery, chapters, rows]);

  // secondary review entry (the one not chosen as primary)
  const side = stats && next?.icon === Brain && stats.errors > 0
    ? { href: prepRoutes.errors(), label: `Mes erreurs · ${stats.errors}` }
    : null;

  const goalPct = me ? Math.round((Math.min(me.today, PREP_GOALS.dailyXp) / PREP_GOALS.dailyXp) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8 fade-up">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Préparation</h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {ctx?.ownTrackName ? `${ctx.ownTrackName} · ${ctx.levelName}` : "Entraîne-toi notion par notion, jusqu'au niveau BAC."}
        </p>
      </header>

      {/* ---------------- Aujourd'hui ---------------- */}
      <Tray title="Aujourd'hui">
        <div className={`${CARD} p-5 sm:p-6`}>
          {next ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <span className={`w-11 h-11 rounded-xl bg-arctic-blue/10 ${ACCENT} grid place-items-center shrink-0`}><next.icon className="w-5 h-5" /></span>
              <div className="flex-1 min-w-0">
                <div className={`text-[11px] font-bold uppercase tracking-wider ${ACCENT}`}>{next.eyebrow}</div>
                <div dir="auto" className="mt-0.5 text-lg font-semibold tracking-tight truncate">{next.title}</div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{next.sub}</p>
              </div>
              <Link href={next.href} className="inline-flex items-center justify-center gap-1.5 shrink-0 rounded-full bg-arctic-blue text-white text-sm font-semibold px-5 py-2.5 hover:bg-arctic-deep transition">
                {next.cta} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="text-sm text-neutral-400">{loading ? "Chargement…" : "Le contenu de ta filière arrive très bientôt."}</div>
          )}
          {side && (
            <Link href={side.href} className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition">
              <NotebookPen className="w-3.5 h-3.5" /> {side.label} <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* gamification strip: same three numbers every day */}
        <div className="grid grid-cols-3 gap-1.5">
          <Stat icon={<Flame className="w-4 h-4" />} value={me ? `${me.streak} j` : "—"} label="Série de jours" />
          <div className={`${CARD} p-3 sm:p-4 flex items-center gap-3`}>
            <Ring pct={goalPct} size={36} stroke={4} className={ACCENT} />
            <div className="min-w-0">
              <div className="text-sm font-bold tabular-nums">{me ? `${Math.min(me.today, 999)}/${PREP_GOALS.dailyXp}` : "—"}</div>
              <div className="text-[11px] text-neutral-400 truncate">{goalPct >= 100 ? "Objectif atteint" : "XP du jour"}</div>
            </div>
          </div>
          <Stat icon={<Zap className="w-4 h-4" />} value={me ? `Niv. ${me.level}` : "—"} label={me ? `${me.xp} XP` : "Niveau"} />
        </div>
      </Tray>

      {/* ---------------- Matières ---------------- */}
      <Tray title="Tes matières" meta={rows.length ? "Réussite moyenne sur les chapitres travaillés" : undefined}>
        {!loading && ctx && !supported ? (
          <div className={`${CARD} p-8 text-center text-sm text-neutral-400`}>La Préparation arrive bientôt pour ta filière.</div>
        ) : loading ? (
          <div className={`${CARD} grid place-items-center h-32 text-neutral-400`}><Loader2 className="w-5 h-5 animate-spin" /></div>
        ) : rows.length === 0 ? (
          <div className={`${CARD} p-8 text-center text-sm text-neutral-400`}>Le contenu arrive très bientôt.</div>
        ) : rows.map((r) => <SubjectRow key={r.code} r={r} due={(stats?.due_by_subject[r.code] ?? 0) + (stats?.errors_by_subject[r.code] ?? 0)} />)}
      </Tray>

      {!FEATURES.examEngine && (
        <p className="text-center text-xs text-neutral-400">Le mode Examen (vrais sujets chronométrés, notés /20) arrive bientôt.</p>
      )}
    </div>
  );
}

function Stat({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <div className={`${CARD} p-3 sm:p-4 flex items-center gap-3`}>
      <span className={`w-9 h-9 rounded-full bg-arctic-blue/10 ${ACCENT} grid place-items-center shrink-0`}>{icon}</span>
      <div className="min-w-0">
        <div className="text-sm font-bold tabular-nums truncate">{value}</div>
        <div className="text-[11px] text-neutral-400 truncate">{label}</div>
      </div>
    </div>
  );
}

function SubjectRow({ r, due }: { r: Row; due: number }) {
  const t = subjectTheme(r.code);
  const has = r.nQ > 0;
  const inner = (
    <>
      <Ring pct={r.mastery ?? 0} size={46} stroke={4} className={has ? t.text : "text-neutral-300 dark:text-neutral-600"}>
        {createElement(subjectIcon(r.code), { className: "w-4.5 h-4.5" })}
      </Ring>
      <div className="flex-1 min-w-0">
        <div dir="auto" className="font-semibold tracking-tight truncate">{r.name}</div>
        <div className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400 truncate">
          {has
            ? `${r.worked}/${r.chapters.length} chapitres travaillés${r.mastery != null ? ` · ${r.mastery} %` : ""}`
            : "Bientôt disponible"}
          {r.coeff != null && <span className="text-neutral-400"> · Coeff. {r.coeff}{r.durationMin != null ? ` · ${fmtDuration(r.durationMin)}` : ""}</span>}
        </div>
      </div>
      {has && due > 0 && <span className="shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-neutral-600 dark:text-neutral-300">{due} à revoir</span>}
      {has && r.worked === 0 && due === 0 && <span className={`shrink-0 text-[11px] font-semibold ${t.text}`}>Nouveau</span>}
      {has && <ChevronRight className="w-5 h-5 text-neutral-300 dark:text-neutral-600 shrink-0 group-hover:translate-x-0.5 transition" />}
    </>
  );
  return has ? (
    <Link href={prepRoutes.subject(r.code)} className={`group ${CARD} p-3.5 sm:p-4 flex items-center gap-3.5 hover:border-black/[0.12] dark:hover:border-white/[0.14] transition`}>{inner}</Link>
  ) : (
    <div className={`${CARD} p-3.5 sm:p-4 flex items-center gap-3.5 opacity-60`}>{inner}</div>
  );
}
