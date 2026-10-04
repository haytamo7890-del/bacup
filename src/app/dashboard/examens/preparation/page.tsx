"use client";

/**
 * Préparation — hub.
 * Same browse as the Cours (filière chips → subject pads, curriculum order,
 * subject theming), with each pad summarising the three prep modes:
 * Par notion (chapter banks) · Séries · Examens (annales / blancs).
 * Route: /dashboard/examens/preparation[?f=<track>]
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { curriculumFor, fmtDuration, PREP_FILIERES, type SubjectRef } from "@/config/curriculum";
import { SubjectPad, PadChip } from "@/components/subject-pad";
import { SubjectBanner } from "@/components/subject-banner";
import { PrepAlerts } from "@/components/prep/prep-alerts";
import { SoonPill, ExamsSoonPanel } from "@/components/prep/exams-soon";
import { FEATURES } from "@/config";
import {
  loadStudentCtx, loadChapters, loadBank, loadSeries, loadMastery, prepRoutes,
  type StudentCtx, type PrepChapter, type BankQ, type Serie, type ChapterMastery,
} from "@/lib/prep";
import { Loader2, Target, Layers, FileText, Timer, Lock, Trophy, Calculator, LayoutDashboard, GraduationCap, Flag } from "lucide-react";

type Exam = { id: string; subject_id: string; track_id: string | null; exam_type: string };
type Card = { id: string; code: string; name: string; coeff: number | null; durationMin: number | null; chapters: PrepChapter[]; nQ: number; nSeries: number; nExams: number; mastery: number | null; worked: number };

const TOOLS = [
  { icon: LayoutDashboard, label: "Ma progression", href: "/dashboard" },
  { icon: Trophy, label: "Classement", href: "/dashboard/classement" },
  { icon: Calculator, label: "Note de Bac", href: "/dashboard/calculette" },
  { icon: Flag, label: "Défi National", href: "/defi" },
];

export default function PreparationHub() {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [ctx, setCtx] = useState<StudentCtx | null>(null);
  const [filiere, setFiliere] = useState<string | null>(null);
  const [chapters, setChapters] = useState<PrepChapter[]>([]);
  const [bank, setBank] = useState<BankQ[]>([]);
  const [bankExamIds, setBankExamIds] = useState<Set<string>>(new Set());
  const [series, setSeries] = useState<Serie[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [mastery, setMastery] = useState<Map<string, ChapterMastery>>(new Map());
  const [soonOpen, setSoonOpen] = useState(false);

  // student context once
  useEffect(() => {
    (async () => {
      const c = await loadStudentCtx(supabase);
      setCtx(c);
      // Own filière only: a student never browses another filière's content.
      setFiliere(c?.ownTrack || null);
      if (!c?.levelId || !c.ownTrack) setLoading(false);
    })();
  }, [supabase]);

  // content for the selected filière
  useEffect(() => {
    if (!ctx?.levelId || !filiere) return;
    let live = true;
    (async () => {
      setLoading(true);
      const trackId = ctx.trackIdByCode.get(filiere) ?? null;
      const chs = await loadChapters(supabase, ctx.levelId!, null, trackId, filiere);
      const [b, se, { data: ex }, m] = await Promise.all([
        loadBank(supabase, chs.map((c) => c.id)),
        loadSeries(supabase, ctx.levelId!, null, trackId),
        supabase.from("exams").select("id, subject_id, track_id, exam_type").eq("level_id", ctx.levelId!),
        loadMastery(supabase, chs.map((c) => c.id)),
      ]);
      if (!live) return;
      setChapters(chs); setBank(b.questions); setBankExamIds(b.bankExamIds); setSeries(se.filter((x) => !x.chapter_id || chs.some((c) => c.id === x.chapter_id)));
      setExams(FEATURES.examEngine ? ((ex ?? []) as Exam[]).filter((e) => e.track_id === trackId || e.track_id == null) : []);
      setMastery(m);
      setLoading(false);
    })();
    return () => { live = false; };
  }, [ctx, filiere, supabase]);

  const is2bac = ctx?.levelCode === "2bac";
  const supported = !!(is2bac && filiere && PREP_FILIERES.has(filiere));

  const cards = useMemo<Card[]>(() => {
    if (!ctx || !filiere) return [];
    const qByCh = new Map<string, number>();
    for (const q of bank) qByCh.set(q.chapter_id, (qByCh.get(q.chapter_id) ?? 0) + 1);
    const build = (s: { id: string; code: string; name: string }, coeff: number | null, durationMin: number | null): Card => {
      // only chapters that already have questions count (empty ones are hidden)
      const chs = chapters.filter((c) => c.subject_id === s.id && (qByCh.get(c.id) ?? 0) > 0);
      const ms = chs.map((c) => mastery.get(c.id)).filter(Boolean) as ChapterMastery[];
      return {
        id: s.id, code: s.code, name: s.name, coeff, durationMin, chapters: chs,
        nQ: chs.reduce((a, c) => a + (qByCh.get(c.id) ?? 0), 0),
        nSeries: series.filter((x) => x.subject_id === s.id).length,
        nExams: exams.filter((e) => e.subject_id === s.id && !bankExamIds.has(e.id)).length,
        mastery: ms.length ? Math.round(ms.reduce((a, x) => a + x.mastery_pct, 0) / ms.length) : null,
        worked: ms.length,
      };
    };
    const ref: SubjectRef[] | null = curriculumFor(ctx.levelCode, filiere);
    if (ref) return ref.map((r) => { const s = ctx.subjectsByCode.get(r.code); return s ? build(s, r.coeff, r.durationMin) : null; }).filter(Boolean) as Card[];
    const ids = [...new Set(chapters.map((c) => c.subject_id))];
    return ids.map((id) => ctx.subjectsById.get(id)).filter(Boolean).map((s) => build(s!, null, null)).sort((a, b) => a.name.localeCompare(b.name));
  }, [ctx, filiere, chapters, bank, series, exams, bankExamIds, mastery]);

  // Resume = most recently practiced chapter in this filière.
  const resume = useMemo(() => {
    let best: ChapterMastery | null = null;
    for (const m of mastery.values()) if (m.last_practiced_at && (!best || m.last_practiced_at > (best.last_practiced_at ?? ""))) best = m;
    if (!best) return null;
    const ch = chapters.find((c) => c.id === best!.chapter_id);
    const card = ch ? cards.find((c) => c.id === ch.subject_id) : null;
    return ch && card ? { ch, card, pct: Math.round(best.mastery_pct) } : null;
  }, [mastery, chapters, cards]);

  const open = (c: Card) => router.push(prepRoutes.subject(c.code, { f: filiere !== ctx?.ownTrack ? filiere : null }));

  return (
    <div className="max-w-4xl mx-auto py-8 fade-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Préparation</h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {ctx?.ownTrackName ? `${ctx.ownTrackName} · ${ctx.levelName}` : "Par notion, par séries, ou en conditions d'examen."}
        </p>
      </div>

      {/* three modes legend */}
      <div className="mt-6 grid sm:grid-cols-3 gap-3">
        {[
          { icon: Target, t: "Par notion", d: "Les exercices de chaque notion du cours." },
          { icon: Layers, t: "Séries", d: "Des séries dosées, avec ton meilleur score." },
          { icon: Timer, t: "Examens", d: "Vrais sujets et examens blancs, notés /20.", soon: !FEATURES.examEngine },
        ].map((m) => m.soon ? (
          <button key={m.t} onClick={() => setSoonOpen(true)} aria-haspopup="dialog"
            className="glass rounded-2xl p-4 flex items-start gap-3 text-left relative overflow-hidden hover:-translate-y-0.5 transition">
            <span className="w-9 h-9 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] text-neutral-400 grid place-items-center shrink-0"><Lock className="w-4 h-4" /></span>
            <div className="min-w-0">
              <div className="text-sm font-semibold flex items-center gap-2 text-neutral-500 dark:text-neutral-400">{m.t} <SoonPill /></div>
              <div className="text-xs text-neutral-400">{m.d}</div>
            </div>
          </button>
        ) : (
          <div key={m.t} className="glass rounded-2xl p-4 flex items-start gap-3">
            <span className="w-9 h-9 rounded-xl bg-arctic-blue/10 text-arctic-blue dark:text-arctic-cyan grid place-items-center shrink-0"><m.icon className="w-4.5 h-4.5" /></span>
            <div><div className="text-sm font-semibold">{m.t}</div><div className="text-xs text-neutral-400">{m.d}</div></div>
          </div>
        ))}
      </div>
      <ExamsSoonPanel open={soonOpen} onClose={() => setSoonOpen(false)} />

      <PrepAlerts className="mt-5" />

      {resume && (
        <div className="mt-5">
          <SubjectBanner mode="resume" code={resume.card.code} name={resume.card.name}
            subtitle={`${resume.ch.name} · ${resume.pct}% de réussite`}
            done={resume.card.worked} total={Math.max(resume.card.chapters.length, 1)}
            href={prepRoutes.subject(resume.card.code, { f: filiere !== ctx?.ownTrack ? filiere : null, mode: "notion", chapter: resume.ch.id })} />
        </div>
      )}

      <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-neutral-400">
        <GraduationCap className="w-4 h-4" /> {(is2bac ? ctx?.trackNameByCode.get(filiere ?? "") : ctx?.ownTrackName) || "Matières"}
      </div>

      {!loading && ctx && !supported ? (
        <div className="mt-4 glass rounded-3xl p-10 text-center text-neutral-400">La Préparation arrive bientôt pour ta filière.</div>
      ) : loading ? (
        <div className="grid place-items-center h-40 text-neutral-400"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : cards.length === 0 ? (
        <div className="mt-4 glass rounded-3xl p-10 text-center text-neutral-400">Le contenu arrive très bientôt.</div>
      ) : (
        <div className="mt-4 space-y-3">
          {cards.map((c) => {
            const has = c.nQ > 0;
            return (
              <SubjectPad key={c.code} code={c.code} name={c.name} onClick={() => has && open(c)} disabled={!has}
                subtitle={c.mastery != null ? `${c.mastery}% de réussite · ${c.worked}/${c.chapters.length} chapitres travaillés` : undefined}
                right={
                  <div className="flex flex-col items-end gap-1.5">
                    {c.coeff != null && <PadChip>Coeff. {c.coeff}{c.durationMin != null ? ` · ${fmtDuration(c.durationMin)}` : ""}</PadChip>}
                    {has ? (
                      <>
                        {c.nQ > 0 && <PadChip accent code={c.code}><Target className="w-3 h-3" /> {c.nQ} exos</PadChip>}
                        {c.nSeries > 0 && <PadChip accent code={c.code}><Layers className="w-3 h-3" /> {c.nSeries} séries</PadChip>}
                        {c.nExams > 0 && <PadChip><FileText className="w-3 h-3" /> {c.nExams} examen{c.nExams > 1 ? "s" : ""}</PadChip>}
                      </>
                    ) : (
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/20 text-amber-300">Bientôt</span>
                    )}
                  </div>
                }
              />
            );
          })}
        </div>
      )}

      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {TOOLS.map((t) => (
          <Link key={t.label} href={t.href} className="glass rounded-2xl p-4 flex items-center gap-3 hover:-translate-y-0.5 transition">
            <span className="w-9 h-9 rounded-xl bg-arctic-blue/10 text-arctic-blue dark:text-arctic-cyan grid place-items-center"><t.icon className="w-4.5 h-4.5" /></span>
            <span className="text-sm font-semibold">{t.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
