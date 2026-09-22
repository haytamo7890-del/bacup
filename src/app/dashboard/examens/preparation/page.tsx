"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { curriculumFor, fmtDuration, type SubjectRef } from "@/config/curriculum";
import { subjectTheme } from "@/config/subjects";
import { SubjectPad, PadChip, SubjectAmbient } from "@/components/subject-pad";
import {
  ChevronLeft, ChevronRight, BookOpen, Loader2, FileText, Timer, Trophy,
  Calculator, LayoutDashboard, CheckCircle2, Sparkles, GraduationCap,
} from "lucide-react";

type Exam = { id: string; subject_id: string; track_id: string | null; year: number; session: string; exam_type: string; duration_minutes: number | null; title: string | null };
type Subject = { id: string; code: string; name: string };
type Track = { id: string; code: string; name: string };
type SubjectCard = { id: string; code: string; name: string; coeff: number | null; durationMin: number | null; exams: Exam[] };

const TOOLS = [
  { icon: LayoutDashboard, label: "Ma progression", href: "/dashboard" },
  { icon: Trophy, label: "Classement", href: "/dashboard/classement" },
  { icon: Calculator, label: "Note de Bac", href: "/dashboard/calculette" },
  { icon: Sparkles, label: "Défi National", href: "/defi" },
];

// Science filière order for the 2bac chips (own filière is prepended).
const SCIENCE_ORDER = ["sm_a", "sm_b", "pc", "svt", "eco"];
const SHORT: Record<string, string> = { sm_a: "SM-A", sm_b: "SM-B", pc: "PC", svt: "SVT", eco: "Éco" };

export default function ExamensBrowser() {
  const supabase = createBrowserSupabase();
  const [loading, setLoading] = useState(true);
  const [levelCode, setLevelCode] = useState<string | null>(null);
  const [levelName, setLevelName] = useState("");
  const [ownTrack, setOwnTrack] = useState<string | null>(null);
  const [ownTrackName, setOwnTrackName] = useState("");
  const [subjectsById, setSubjectsById] = useState<Map<string, Subject>>(new Map());
  const [subjectsByCode, setSubjectsByCode] = useState<Map<string, Subject>>(new Map());
  const [trackIdByCode, setTrackIdByCode] = useState<Map<string, string>>(new Map());
  const [trackNameByCode, setTrackNameByCode] = useState<Map<string, string>>(new Map());
  const [exams, setExams] = useState<Exam[]>([]);

  const [filiere, setFiliere] = useState<string | null>(null); // selected filière (track code)
  const [selected, setSelected] = useState<SubjectCard | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data: sp } = await supabase
        .from("student_profiles")
        .select("level_id, track_id, levels(code,name), tracks(code,name)")
        .eq("id", user.id)
        .single();
      const lc = (sp?.levels as unknown as { code: string } | null)?.code ?? null;
      const tc = (sp?.tracks as unknown as { code: string } | null)?.code ?? null;
      setLevelCode(lc);
      setLevelName((sp?.levels as unknown as { name: string } | null)?.name ?? "");
      setOwnTrack(tc);
      setOwnTrackName((sp?.tracks as unknown as { name: string } | null)?.name ?? "");
      setFiliere(tc);
      const levelId = sp?.level_id ?? null;

      const [{ data: subs }, { data: trks }, { data: exs }] = await Promise.all([
        supabase.from("subjects").select("id, code, name"),
        supabase.from("tracks").select("id, code, name"),
        levelId
          ? supabase.from("exams").select("id, subject_id, track_id, year, session, exam_type, duration_minutes, title").eq("level_id", levelId).order("year", { ascending: false })
          : Promise.resolve({ data: [] as Exam[] }),
      ]);
      const sById = new Map<string, Subject>(); const sByCode = new Map<string, Subject>();
      for (const s of (subs ?? []) as Subject[]) { sById.set(s.id, s); sByCode.set(s.code, s); }
      const tId = new Map<string, string>(); const tName = new Map<string, string>();
      for (const t of (trks ?? []) as Track[]) { tId.set(t.code, t.id); tName.set(t.code, t.name); }
      setSubjectsById(sById); setSubjectsByCode(sByCode);
      setTrackIdByCode(tId); setTrackNameByCode(tName);
      setExams((exs ?? []) as Exam[]);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const is2bac = levelCode === "2bac";

  // filière chips: own first, then the other science filières that exist.
  const chips = useMemo(() => {
    if (!is2bac || !ownTrack) return [];
    const codes = [ownTrack, ...SCIENCE_ORDER.filter((c) => c !== ownTrack)];
    return codes.filter((c) => trackIdByCode.has(c)).map((c) => ({ code: c, label: SHORT[c] ?? c.toUpperCase(), name: trackNameByCode.get(c) ?? c }));
  }, [is2bac, ownTrack, trackIdByCode, trackNameByCode]);

  // subjects for the selected filière (ordered by curriculum), with their annales.
  const subjectCards = useMemo<SubjectCard[]>(() => {
    const f = filiere ?? ownTrack;
    if (!f || !levelCode) return [];
    const trackId = trackIdByCode.get(f) ?? null;
    const forFiliere = (subjId: string) => exams.filter((e) => e.subject_id === subjId && (e.track_id === trackId || e.track_id == null));
    const ref: SubjectRef[] | null = curriculumFor(levelCode, f);
    if (ref) {
      return ref
        .map((r) => {
          const s = subjectsByCode.get(r.code);
          if (!s) return null;
          return { id: s.id, code: s.code, name: s.name, coeff: r.coeff, durationMin: r.durationMin, exams: forFiliere(s.id) };
        })
        .filter(Boolean) as SubjectCard[];
    }
    const seen = new Set<string>();
    const out: SubjectCard[] = [];
    for (const e of exams) {
      if (trackId && e.track_id && e.track_id !== trackId) continue;
      if (seen.has(e.subject_id)) continue;
      seen.add(e.subject_id);
      const s = subjectsById.get(e.subject_id);
      if (s) out.push({ id: s.id, code: s.code, name: s.name, coeff: null, durationMin: null, exams: forFiliere(s.id) });
    }
    return out.sort((a, b) => a.name.localeCompare(b.name));
  }, [filiere, ownTrack, levelCode, trackIdByCode, exams, subjectsByCode, subjectsById]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold tracking-tight">Examens</h1>
        <div className="grid place-items-center h-40 text-neutral-400"><Loader2 className="w-6 h-6 animate-spin" /></div>
      </div>
    );
  }

  // ---------- SUBJECT → ANNALES ----------
  if (selected) {
    const t = subjectTheme(selected.code);
    return (
      <div className="max-w-3xl mx-auto py-8 fade-up">
        <SubjectAmbient code={selected.code} />
        <button onClick={() => setSelected(null)} className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
          <ChevronLeft className="w-4 h-4" /> {is2bac ? `Retour · ${SHORT[filiere ?? ""] ?? "matières"}` : "Toutes les matières"}
        </button>
        <div className="mt-3 flex items-center gap-3">
          <span className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${t.grad} text-white grid place-items-center font-bold uppercase shadow-sm`}>{selected.name.slice(0, 2)}</span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{selected.name}</h1>
            <div className="text-sm text-neutral-400">
              {selected.coeff != null && <>Coeff. {selected.coeff} · </>}
              {selected.durationMin != null && <>{fmtDuration(selected.durationMin)} · </>}
              {selected.exams.length} annale{selected.exams.length > 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* mode legend */}
        <div className="mt-5 grid sm:grid-cols-2 gap-3">
          <div className="glass rounded-2xl p-4 flex items-start gap-3">
            <span className="w-9 h-9 rounded-xl bg-arctic-blue/10 text-arctic-blue dark:text-arctic-cyan grid place-items-center shrink-0"><BookOpen className="w-4.5 h-4.5" /></span>
            <div><div className="text-sm font-semibold">Réviser</div><div className="text-xs text-neutral-400">Sans chrono. Correction détaillée + IA à chaque question.</div></div>
          </div>
          <div className="glass rounded-2xl p-4 flex items-start gap-3">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-arctic-cyan to-arctic-blue text-white grid place-items-center shrink-0"><Timer className="w-4.5 h-4.5" /></span>
            <div><div className="text-sm font-semibold">Examen blanc</div><div className="text-xs text-neutral-400">Chronométré comme le jour J. Noté /20, compte pour le classement.</div></div>
          </div>
        </div>

        {selected.exams.length === 0 ? (
          <div className="mt-6 glass rounded-3xl p-10 text-center text-neutral-400">Les annales de cette matière arrivent très bientôt. ✨</div>
        ) : (
          <div className="mt-4 space-y-2.5">
            {selected.exams.map((e) => (
              <div key={e.id} className="glass rounded-2xl p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold text-sm tracking-tight">
                    {e.exam_type === "national" ? "National" : e.exam_type === "regional" ? "Régional" : "Blanc"} {e.year}
                  </div>
                  <div className="text-[11px] text-neutral-400 capitalize">Session {e.session}{e.duration_minutes ? ` · ${Math.round(e.duration_minutes / 60)}h` : ""}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/dashboard/examens?exam=${e.id}&mode=etude`} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full bg-arctic-blue/10 text-arctic-blue dark:text-arctic-cyan hover:bg-arctic-blue/20 transition">
                    <BookOpen className="w-3.5 h-3.5" /> Réviser
                  </Link>
                  <Link href={`/dashboard/examens?exam=${e.id}`} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white hover:brightness-105 transition">
                    <Timer className="w-3.5 h-3.5" /> Examen
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ---------- BROWSE ----------
  return (
    <div className="max-w-4xl mx-auto py-8 fade-up">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Examens</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {ownTrackName ? `${ownTrackName} · ${levelName}` : "Annales, corrections et examens blancs."}
          </p>
        </div>
      </div>

      {/* tools row */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {TOOLS.map((t) => (
          <Link key={t.label} href={t.href} className="glass rounded-2xl p-4 flex items-center gap-3 hover:-translate-y-0.5 transition">
            <span className="w-9 h-9 rounded-xl bg-arctic-blue/10 text-arctic-blue dark:text-arctic-cyan grid place-items-center"><t.icon className="w-4.5 h-4.5" /></span>
            <span className="text-sm font-semibold">{t.label}</span>
          </Link>
        ))}
      </div>

      {/* filière chips (2bac) */}
      {is2bac && chips.length > 0 && (
        <div className="mt-8">
          <div className="text-[11px] font-bold uppercase tracking-wide text-neutral-400 mb-2">Filière</div>
          <div className="flex flex-wrap gap-2">
            {chips.map((c) => {
              const isOwn = c.code === ownTrack;
              const on = c.code === filiere;
              return (
                <button
                  key={c.code}
                  onClick={() => { setFiliere(c.code); setSelected(null); }}
                  title={c.name}
                  className={`inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full transition ${on ? "bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white shadow-lg shadow-arctic-blue/20" : "chip text-neutral-600 dark:text-neutral-300 hover:-translate-y-0.5"}`}
                >
                  {c.label}
                  {isOwn && <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${on ? "bg-white/25" : "bg-arctic-blue/15 text-arctic-blue dark:text-arctic-cyan"}`}>TA FILIÈRE</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* subjects */}
      <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-neutral-400">
        <GraduationCap className="w-4 h-4" /> {is2bac ? (trackNameByCode.get(filiere ?? "") ?? "Matières") : (ownTrackName || "Matières")}
      </div>
      {subjectCards.length === 0 ? (
        <div className="mt-4 glass rounded-3xl p-10 text-center text-neutral-400">Le contenu arrive très bientôt. ✨</div>
      ) : (
        <div className="mt-4 space-y-3">
          {subjectCards.map((c) => {
            const has = c.exams.length > 0;
            return (
              <SubjectPad key={c.code} code={c.code} name={c.name} onClick={() => has && setSelected(c)} disabled={!has}
                right={
                  <div className="flex flex-col items-end gap-1.5">
                    {c.coeff != null && <PadChip>Coeff. {c.coeff}</PadChip>}
                    {c.durationMin != null && <PadChip><Timer className="w-3 h-3" /> {fmtDuration(c.durationMin)}</PadChip>}
                    {has ? (
                      <PadChip accent code={c.code}><FileText className="w-3 h-3" /> {c.exams.length} annale{c.exams.length > 1 ? "s" : ""}</PadChip>
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
    </div>
  );
}
