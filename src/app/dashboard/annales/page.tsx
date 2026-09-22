"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { useAccess } from "@/lib/use-access";
import { PdfReader } from "@/components/pdf-reader";
import { curriculumFor, type SubjectRef, examTokensFor, tracksForSubject, COMMON_PAPER_SUBJECTS, FILIERE_SHORT } from "@/config/curriculum";
import { subjectTheme } from "@/config/subjects";
import { SubjectPad, PadChip, subjectIcon, SubjectAmbient } from "@/components/subject-pad";
import {
  ChevronLeft, FileText, Loader2, Lock, GraduationCap,
  ScrollText, Layers, CheckCircle2, CalendarDays,
} from "lucide-react";

type Subject = { id: string; code: string; name: string };
type Track = { id: string; code: string; name: string };
type Res = {
  id: string; scope_key: string; name: string; storage_path: string;
  filiere: string | null; year: number | null; session: string | null; kind: string; niveau: string | null;
};
type Exam = { key: string; filiere: string | null; year: number | null; session: string | null; sujet: Res; corrige: Res | null };

const SCIENCE_ORDER = ["sm_a", "sm_b", "pc", "svt", "eco"];
const SHORT: Record<string, string> = { sm_a: "SM-A", sm_b: "SM-B", pc: "PC", svt: "SVT", eco: "Éco" };
const TOKEN_SHORT: Record<string, string> = { sm: "SM", smb: "SM-B", pc: "PC", svt: "SVT" };

const SESSION_RANK: Record<string, number> = { normale: 0, rattrapage: 1 };
function sortExams(a: Exam, b: Exam) {
  return (b.year ?? 0) - (a.year ?? 0)
    || (SESSION_RANK[a.session ?? ""] ?? 9) - (SESSION_RANK[b.session ?? ""] ?? 9)
    || (a.filiere ?? "").localeCompare(b.filiere ?? "");
}

export default function AnnalesPage() {
  const supabase = createBrowserSupabase();
  const router = useRouter();
  const access = useAccess();
  const [loading, setLoading] = useState(true);

  const [levelCode, setLevelCode] = useState<string | null>(null);
  const [levelName, setLevelName] = useState("");
  const [ownTrack, setOwnTrack] = useState<string | null>(null);
  const [ownTrackName, setOwnTrackName] = useState("");
  const [trackNameByCode, setTrackNameByCode] = useState<Map<string, string>>(new Map());
  const [subjectsByCode, setSubjectsByCode] = useState<Map<string, Subject>>(new Map());
  const [resByCode, setResByCode] = useState<Map<string, Res[]>>(new Map());

  const [filiere, setFiliere] = useState<string | null>(null);
  const [subjectCode, setSubjectCode] = useState<string | null>(null);
  const [filFilter, setFilFilter] = useState<string | null>(null);
  const [reading, setReading] = useState<{ exam: Exam; mode: "sujet" | "corrige" } | null>(null);

  function openSubject(code: string) {
    setSubjectCode(code);
    setFilFilter(null);
  }
  function closeSubject() {
    setSubjectCode(null);
    setFilFilter(null);
  }

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const [{ data: subs }, { data: trks }, { data: res }] = await Promise.all([
        supabase.from("subjects").select("id, code, name"),
        supabase.from("tracks").select("id, code, name"),
        supabase.from("resources").select("id, scope_key, name, storage_path, filiere, year, session, kind, niveau").eq("scope", "subject"),
      ]);
      if (user) {
        const { data: sp } = await supabase.from("student_profiles")
          .select("levels(code,name), tracks(code,name)").eq("id", user.id).maybeSingle();
        const lc = (sp?.levels as unknown as { code: string } | null)?.code ?? null;
        const tc = (sp?.tracks as unknown as { code: string } | null)?.code ?? null;
        setLevelCode(lc);
        setLevelName((sp?.levels as unknown as { name: string } | null)?.name ?? "");
        setOwnTrack(tc);
        setOwnTrackName((sp?.tracks as unknown as { name: string } | null)?.name ?? "");
        setFiliere(tc);
      }
      const sByCode = new Map<string, Subject>();
      for (const s of (subs ?? []) as Subject[]) sByCode.set(s.code, s);
      const tName = new Map<string, string>();
      for (const t of (trks ?? []) as Track[]) tName.set(t.code, t.name);
      const byCode = new Map<string, Res[]>();
      for (const r of (res ?? []) as Res[]) {
        if (!byCode.has(r.scope_key)) byCode.set(r.scope_key, []);
        byCode.get(r.scope_key)!.push(r);
      }
      setSubjectsByCode(sByCode); setTrackNameByCode(tName); setResByCode(byCode);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const url = (p: string) => supabase.storage.from("resources").getPublicUrl(p).data.publicUrl;
  const is2bac = levelCode === "2bac";
  const activeFil = filiere ?? ownTrack;

  const chips = useMemo(() => {
    if (!is2bac || !ownTrack) return [];
    const codes = [ownTrack, ...SCIENCE_ORDER.filter((c) => c !== ownTrack)];
    return codes.filter((c) => trackNameByCode.has(c))
      .map((c) => ({ code: c, label: SHORT[c] ?? c.toUpperCase(), name: trackNameByCode.get(c) ?? c }));
  }, [is2bac, ownTrack, trackNameByCode]);

  // Pair sujet+corrigé into exams for a matière (all filières), newest first.
  function pairedExams(code: string): Exam[] {
    const nv = levelCode ?? "2bac";
    const rows = (resByCode.get(code) ?? []).filter((r) => (r.niveau ?? "2bac") === nv);
    const map = new Map<string, Exam>();
    for (const r of rows) {
      const key = `${r.filiere}|${r.year}|${r.session}`;
      let e = map.get(key);
      if (!e) { e = { key, filiere: r.filiere, year: r.year, session: r.session, sujet: r, corrige: null }; map.set(key, e); }
      if (r.kind === "corrige") e.corrige = r; else e.sujet = r;
    }
    return [...map.values()].filter((e) => e.sujet).sort(sortExams);
  }

  // Exams for a subject under one filière (strict: only that filière's papers).
  // Common-paper subjects (philo, anglais…) return the single shared list.
  function examsForFiliere(code: string, track: string | null): Exam[] {
    const all = pairedExams(code);
    if (COMMON_PAPER_SUBJECTS.has(code)) return all;
    if (!track) return [];
    const toks = examTokensFor(code, track);
    return all.filter((e) => e.filiere && toks.includes(e.filiere));
  }

  const subjectCards = useMemo(() => {
    const f = activeFil;
    if (!f || !levelCode) return [] as { code: string; name: string; coeff: number | null; count: number }[];
    const ref: SubjectRef[] | null = curriculumFor(levelCode, f);
    const list = ref ? ref.map((r) => ({ code: r.code, coeff: r.coeff })) : [...resByCode.keys()].map((c) => ({ code: c, coeff: null as number | null }));
    return list.map(({ code, coeff }) => ({
      code, name: subjectsByCode.get(code)?.name ?? code.toUpperCase(), coeff,
      count: examsForFiliere(code, f).length,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFil, levelCode, resByCode, subjectsByCode]);

  if (loading) return <div className="grid place-items-center h-64 text-neutral-400"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  // ---------- IN-APP READER ----------
  if (reading) {
    const { exam, mode } = reading;
    const name = subjectsByCode.get(subjectCode ?? exam.sujet.scope_key)?.name ?? "";
    return (
      <PdfReader
        title={`${name} · ${exam.year} · ${exam.session === "rattrapage" ? "Rattrapage" : "Normale"}`}
        subtitle={exam.filiere ? (TOKEN_SHORT[exam.filiere] ?? exam.filiere.toUpperCase()) : undefined}
        sujetUrl={url(exam.sujet.storage_path)}
        corrigeUrl={exam.corrige ? url(exam.corrige.storage_path) : null}
        corrigeLocked={!access.isActive}
        initialMode={mode}
        onBack={() => setReading(null)}
        onUpgrade={() => router.push("/payment")}
      />
    );
  }

  // ---------- MATIÈRE → SESSIONS ----------
  if (subjectCode) {
    const t = subjectTheme(subjectCode);
    const Glyph = subjectIcon(subjectCode);
    const name = subjectsByCode.get(subjectCode)?.name ?? subjectCode.toUpperCase();
    const common = COMMON_PAPER_SUBJECTS.has(subjectCode); // one paper for every filière
    const nv = levelCode ?? "2bac";

    // Filière buttons = tracks whose national curriculum includes this subject, own-first.
    const curTracks = common ? [] : tracksForSubject(nv, subjectCode);
    const tracks = activeFil && curTracks.includes(activeFil)
      ? [activeFil, ...curTracks.filter((tr) => tr !== activeFil)]
      : curTracks;
    const hasSwitcher = tracks.length > 1;
    const selTrack = filFilter ?? (activeFil && tracks.includes(activeFil) ? activeFil : (tracks[0] ?? null));
    const rows = examsForFiliere(subjectCode, common ? null : selTrack); // strict: only this filière
    const ownRows = examsForFiliere(subjectCode, common ? null : activeFil);
    const freeKey = ownRows[0]?.key; // newest normale of own filière = the demo-free session
    const countForTrack = (tr: string) => examsForFiliere(subjectCode, tr).length;

    const sessionLabel = (s: string | null) => (s === "rattrapage" ? "Session de Rattrapage" : "Session Ordinaire");
    // Fixed action columns so the SUJET / CORRIGÉ headers sit exactly over their buttons.
    const COLS = "grid grid-cols-[3.5rem_minmax(0,1fr)_8.5rem_8.5rem] items-center gap-x-3 px-5";

    const ExamTable = ({ list, lockedFor }: { list: Exam[]; lockedFor: (e: Exam) => boolean }) => (
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[580px]">
            <div className={`${COLS} py-3 text-[11px] font-bold uppercase tracking-wide text-neutral-400 border-b border-black/5 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.03]`}>
              <div>Année</div>
              <div>Session</div>
              <div className="text-center">Sujet</div>
              <div className="text-center">Corrigé</div>
            </div>
            {list.map((e) => {
              const sujetLocked = lockedFor(e);
              const corrigeLocked = !access.isActive;
              const isRatt = e.session === "rattrapage";
              return (
                <div key={e.key} className={`${COLS} py-3 border-b border-black/5 dark:border-white/10 last:border-0 hover:bg-arctic-blue/[0.04] dark:hover:bg-white/[0.04] transition-colors`}>
                  <div className="text-lg font-extrabold tracking-tight tabular-nums text-arctic-blue dark:text-arctic-cyan">{e.year}</div>
                  <div className="min-w-0 flex items-center gap-2.5">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isRatt ? "bg-amber-400" : "bg-emerald-400"}`} />
                    <span className="font-semibold tracking-tight truncate">{sessionLabel(e.session)}</span>
                  </div>
                  <div className="justify-self-stretch">
                    <button
                      onClick={() => (sujetLocked ? router.push("/payment") : setReading({ exam: e, mode: "sujet" }))}
                      title={sujetLocked ? "Débloque le sujet" : "Voir le sujet"}
                      className={`w-full inline-flex items-center justify-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition ${sujetLocked ? "bg-arctic-blue/10 text-arctic-blue dark:text-arctic-cyan hover:bg-arctic-blue/15" : "bg-arctic-blue text-white hover:brightness-110 shadow-sm shadow-arctic-blue/25"}`}>
                      {sujetLocked ? <Lock className="w-4 h-4" /> : <FileText className="w-4 h-4" />} Sujet
                    </button>
                  </div>
                  <div className="justify-self-stretch">
                    {e.corrige ? (
                      <button
                        onClick={() => (corrigeLocked ? router.push("/payment") : setReading({ exam: e, mode: "corrige" }))}
                        title={corrigeLocked ? "Débloque le corrigé" : "Voir le corrigé"}
                        className={`w-full inline-flex items-center justify-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition ${corrigeLocked ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/15" : "bg-emerald-500 text-white hover:brightness-105 shadow-sm shadow-emerald-500/25"}`}>
                        {corrigeLocked ? <Lock className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />} Corrigé
                      </button>
                    ) : (
                      <span className="w-full inline-flex items-center justify-center text-[11px] font-medium text-neutral-400 py-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.04]">Bientôt</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );

    return (
      <div className="max-w-4xl mx-auto py-8 fade-up">
        <SubjectAmbient code={subjectCode} />
        <button onClick={closeSubject} className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
          <ChevronLeft className="w-4 h-4" /> {is2bac ? `Retour · ${SHORT[activeFil ?? ""] ?? "matières"}` : "Toutes les matières"}
        </button>

        <div className={`mt-3 rounded-3xl p-7 relative overflow-hidden text-white bg-gradient-to-br ${t.grad} shadow-lg shadow-black/10`}>
          <div className="pointer-events-none absolute -top-20 -right-16 w-64 h-64 rounded-full bg-white/15 blur-3xl" />
          <Glyph className="pointer-events-none absolute -right-4 -bottom-5 w-28 h-28 rotate-[18deg] text-white/15" strokeWidth={1.25} />
          <div className="relative flex items-center gap-2 text-xs font-semibold text-white/85"><ScrollText className="w-4 h-4" /> Annales officielles · {is2bac ? (trackNameByCode.get(activeFil ?? "") ?? "") : ownTrackName}</div>
          <h1 className="relative mt-2 text-3xl font-extrabold tracking-tight">{name}</h1>
          <p className="relative mt-1.5 text-sm text-white/85">{rows.length > 0
            ? `${rows.length} session${rows.length > 1 ? "s" : ""} · sujet + corrigé${access.isDemo ? " · 1 gratuit en démo" : ""}.`
            : "Annales à compléter — bientôt disponibles."}</p>
        </div>

        {tracks.length === 0 && rows.length === 0 ? (
          <div className="mt-6 glass rounded-3xl p-10 text-center text-neutral-400">Les annales de cette matière arrivent très bientôt. ✨</div>
        ) : (
          <>
            {hasSwitcher && (
              <div className="mt-6">
                <div className="text-[11px] font-bold uppercase tracking-wide text-neutral-400 mb-2">Filière</div>
                <div className="flex flex-wrap gap-2">
                  {tracks.map((tr) => {
                    const on = tr === selTrack;
                    const own = tr === activeFil;
                    const n = countForTrack(tr);
                    const empty = n === 0;
                    return (
                      <button key={tr} onClick={() => setFilFilter(tr)} title={own ? "Ta filière" : (FILIERE_SHORT[tr] ?? tr)}
                        className={`inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full transition ${on
                          ? "bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white shadow-lg shadow-arctic-blue/20"
                          : empty
                            ? "border border-dashed border-black/15 dark:border-white/15 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                            : "chip text-neutral-600 dark:text-neutral-300 hover:-translate-y-0.5"}`}>
                        {FILIERE_SHORT[tr] ?? tr.toUpperCase()}
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full tabular-nums ${on ? "bg-white/25" : empty ? "bg-amber-500/15 text-amber-500" : "bg-black/5 dark:bg-white/10"}`}>{n}</span>
                        {own && <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${on ? "bg-white/25" : "bg-arctic-blue/15 text-arctic-blue dark:text-arctic-cyan"}`}>TA</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {rows.length === 0 ? (
              <div className="mt-5 glass rounded-3xl p-10 text-center">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] grid place-items-center text-neutral-400"><ScrollText className="w-6 h-6" /></div>
                <p className="mt-3 font-semibold">Aucune annale{selTrack ? ` pour ${FILIERE_SHORT[selTrack] ?? selTrack}` : ""} pour l&apos;instant</p>
                <p className="mt-1 text-sm text-neutral-400">Sujet + corrigé à ajouter — ils apparaîtront ici dès l&apos;upload.</p>
              </div>
            ) : (
              <div className="mt-5">
                <ExamTable list={rows} lockedFor={(e) => !(access.isActive || (access.isDemo && e.key === freeKey))} />
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // ---------- BROWSE (filières → matières) ----------
  return (
    <div className="max-w-4xl mx-auto py-8 fade-up">
      <div className="flex items-center gap-3">
        <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-arctic-cyan to-arctic-blue text-white grid place-items-center shadow-lg shadow-arctic-blue/30"><ScrollText className="w-6 h-6" /></span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Annales</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {ownTrackName ? `${ownTrackName} · ${levelName}` : "Sujets officiels + corrigés, dans la plateforme."}
          </p>
        </div>
      </div>

      {is2bac && chips.length > 0 && (
        <div className="mt-7">
          <div className="text-[11px] font-bold uppercase tracking-wide text-neutral-400 mb-2">Filière</div>
          <div className="flex flex-wrap gap-2">
            {chips.map((c) => {
              const isOwn = c.code === ownTrack;
              const on = c.code === activeFil;
              return (
                <button key={c.code} onClick={() => { setFiliere(c.code); setSubjectCode(null); }} title={c.name}
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
        <GraduationCap className="w-4 h-4" /> {is2bac ? (trackNameByCode.get(activeFil ?? "") ?? "Matières") : (ownTrackName || "Matières")}
      </div>
      {subjectCards.length === 0 ? (
        <div className="mt-4 glass rounded-3xl p-10 text-center text-neutral-400">Les annales arrivent très bientôt. ✨</div>
      ) : (
        <div className="mt-4 space-y-3">
          {subjectCards.map((c) => {
            const has = c.count > 0;
            return (
              <SubjectPad key={c.code} code={c.code} name={c.name} onClick={() => has && openSubject(c.code)} disabled={!has}
                right={
                  <div className="flex flex-col items-end gap-1.5">
                    {c.coeff != null && <PadChip>Coeff. {c.coeff}</PadChip>}
                    {has ? (
                      <PadChip accent code={c.code}><Layers className="w-3 h-3" /> {c.count} session{c.count > 1 ? "s" : ""}</PadChip>
                    ) : (
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/20 text-amber-300">Bientôt</span>
                    )}
                    {has && access.isDemo && <PadChip><CalendarDays className="w-3 h-3" /> 1 gratuit</PadChip>}
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
