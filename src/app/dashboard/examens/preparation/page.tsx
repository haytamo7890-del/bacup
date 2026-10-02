"use client";

/**
 * Espace de préparation — hub.
 * Same browse as the Cours (filière chips → subject pads, curriculum order,
 * subject theming), with each pad summarising the three prep modes:
 * Par notion (chapter banks) · Séries · Examens (annales / blancs).
 * Route: /dashboard/examens/preparation[?f=<track>]
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { curriculumFor, fmtDuration, type SubjectRef } from "@/config/curriculum";
import { SubjectPad, PadChip } from "@/components/subject-pad";
import { SubjectBanner } from "@/components/subject-banner";
import { PrepAlerts } from "@/components/prep/prep-alerts";
import { filiereChips } from "@/lib/filieres";
import {
  loadStudentCtx, loadChapters, loadBank, loadSeries, loadMastery, prepRoutes,
  type StudentCtx, type PrepChapter, type BankQ, type Serie, type ChapterMastery,
} from "@/lib/prep";
import { Loader2, Target, Layers, FileText, Timer, Trophy, Calculator, LayoutDashboard, Sparkles, GraduationCap } from "lucide-react";

type Exam = { id: string; subject_id: string; track_id: string | null; exam_type: string };
type Card = { id: string; code: string; name: string; coeff: number | null; durationMin: number | null; chapters: PrepChapter[]; nQ: number; nSeries: number; nExams: number; mastery: number | null; worked: number };

const TOOLS = [
  { icon: LayoutDashboard, label: "Ma progression", href: "/dashboard" },
  { icon: Trophy, label: "Classement", href: "/dashboard/classement" },
  { icon: Calculator, label: "Note de Bac", href: "/dashboard/calculette" },
  { icon: Sparkles, label: "Défi National", href: "/defi" },
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

  // student context once
  useEffect(() => {
    (async () => {
      const c = await loadStudentCtx(supabase);
      setCtx(c);
      const f = new URLSearchParams(window.location.search).get("f");
      setFiliere(f || c?.ownTrack || null);
      if (!c?.levelId || !(f || c.ownTrack)) setLoading(false);
    })();
  }, [supabase]);

  // content for the selected filière
  useEffect(() => {
    if (!ctx?.levelId || !filiere) return;
    let live = true;
    (async () => {
      setLoading(true);
      const trackId = ctx.trackIdByCode.get(filiere) ?? null;
      const chs = await loadChapters(supabase, ctx.levelId!, null, trackId);
      const [b, se, { data: ex }, m] = await Promise.all([
        loadBank(supabase, chs.map((c) => c.id)),
        loadSeries(supabase, ctx.levelId!, null, trackId),
        supabase.from("exams").select("id, subject_id, track_id, exam_type").eq("level_id", ctx.levelId!),
        loadMastery(supabase, chs.map((c) => c.id)),
      ]);
      if (!live) return;
      setChapters(chs); setBank(b.questions); setBankExamIds(b.bankExamIds); setSeries(se);
      setExams(((ex ?? []) as Exam[]).filter((e) => e.track_id === trackId || e.track_id == null));
      setMastery(m);
      setLoading(false);
    })();
    return () => { live = false; };
  }, [ctx, filiere, supabase]);

  const is2bac = ctx?.levelCode === "2bac";
  const chips = useMemo(() => (ctx && is2bac ? filiereChips(ctx.ownTrack, ctx.trackIdByCode, ctx.trackNameByCode) : []), [ctx, is2bac]);

  const cards = useMemo<Card[]>(() => {
    if (!ctx || !filiere) return [];
    const qByCh = new Map<string, number>();
    for (const q of bank) qByCh.set(q.chapter_id, (qByCh.get(q.chapter_id) ?? 0) + 1);
    const build = (s: { id: string; code: string; name: string }, coeff: number | null, durationMin: number | null): Card => {
      const chs = chapters.filter((c) => c.subject_id === s.id);
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
        <h1 className="text-3xl font-bold tracking-tight">Espace de préparation</h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {ctx?.ownTrackName ? `${ctx.ownTrackName} · ${ctx.levelName}` : "Par notion, par séries, ou en conditions d'examen."}
        </p>
      </div>

      {/* three modes legend */}
      <div className="mt-6 grid sm:grid-cols-3 gap-3">
        {[
          { icon: Target, t: "Par notion", d: "Les exercices de chaque notion du cours." },
          { icon: Layers, t: "Séries", d: "Des séries dosées, avec ton meilleur score." },
          { icon: Timer, t: "Examens", d: "Annales et examens blancs, notés /20." },
        ].map((m) => (
          <div key={m.t} className="glass rounded-2xl p-4 flex items-start gap-3">
            <span className="w-9 h-9 rounded-xl bg-arctic-blue/10 text-arctic-blue dark:text-arctic-cyan grid place-items-center shrink-0"><m.icon className="w-4.5 h-4.5" /></span>
            <div><div className="text-sm font-semibold">{m.t}</div><div className="text-xs text-neutral-400">{m.d}</div></div>
          </div>
        ))}
      </div>

      <PrepAlerts className="mt-5" />

      {resume && (
        <div className="mt-5">
          <SubjectBanner mode="resume" code={resume.card.code} name={resume.card.name}
            subtitle={`${resume.ch.name} · ${resume.pct}% de réussite`}
            done={resume.card.worked} total={Math.max(resume.card.chapters.length, 1)}
            href={prepRoutes.subject(resume.card.code, { f: filiere !== ctx?.ownTrack ? filiere : null, mode: "notion", chapter: resume.ch.id })} />
        </div>
      )}

      {is2bac && chips.length > 0 && (
        <div className="mt-7">
          <div className="text-[11px] font-bold uppercase tracking-wide text-neutral-400 mb-2">Filière</div>
          <div className="flex flex-wrap gap-2">
            {chips.map((c) => {
              const isOwn = c.code === ctx?.ownTrack;
              const on = c.code === filiere;
              return (
                <button key={c.code} onClick={() => setFiliere(c.code)} title={c.name}
                  className={`inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full transition ${on ? "bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white shadow-lg shadow-arctic-blue/20" : "chip text-neutral-600 dark:text-neutral-300 hover:-translate-y-0.5"}`}>
                  {c.label}
                  {isOwn && <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${on ? "bg-white/25" : "bg-arctic-blue/15 text-arctic-blue dark:text-arctic-cyan"}`}>TA FILIÈRE</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-neutral-400">
        <GraduationCap className="w-4 h-4" /> {(is2bac ? ctx?.trackNameByCode.get(filiere ?? "") : ctx?.ownTrackName) || "Matières"}
      </div>

      {loading ? (
        <div className="grid place-items-center h-40 text-neutral-400"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : cards.length === 0 ? (
        <div className="mt-4 glass rounded-3xl p-10 text-center text-neutral-400">Le contenu arrive très bientôt. ✨</div>
      ) : (
        <div className="mt-4 space-y-3">
          {cards.map((c) => {
            const has = c.nQ + c.nSeries + c.nExams > 0;
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
