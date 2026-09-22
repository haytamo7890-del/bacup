"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { useAccess } from "@/lib/use-access";
import { LockBadge } from "@/components/dashboard/paywall";
import { ResourceList } from "@/components/resource-panel";
import { Tex } from "@/components/math";
import { CourseContent } from "@/components/course/course-content";
import { FlashcardDeck } from "@/components/course/flashcards";
import { PracticeQuiz, type PQItem } from "@/components/course/practice-quiz";
import { notionSlug } from "@/config/notion-map";
import { curriculumFor, type SubjectRef } from "@/config/curriculum";
import { subjectTheme } from "@/config/subjects";
import { SubjectPad, PadChip, subjectIcon, SubjectAmbient } from "@/components/subject-pad";
import {
  ChevronLeft, ChevronRight, BookOpen, Loader2, Check, GraduationCap,
  FileText, Sparkles, ScrollText, Layers, Lock,
} from "lucide-react";

type Subject = { id: string; code: string; name: string };
type Track = { id: string; code: string; name: string };
type Chapter = { id: string; subject_id: string; track_id: string | null; name: string; position: number; domain?: string | null; unit?: string | null; unit_pos?: number | null };
type Lesson = { id: string; title: string; body: string | null; kind: string };
type SubjectCard = { id: string; code: string; name: string; coeff: number | null; chapters: Chapter[] };

type Kind = "cours" | "resume";

// Science filière order for the 2bac chips (own filière is prepended).
const SCIENCE_ORDER = ["sm_a", "sm_b", "pc", "svt", "eco"];
const SHORT: Record<string, string> = { sm_a: "SM-A", sm_b: "SM-B", pc: "PC", svt: "SVT", eco: "Éco" };

export default function CoursPage() {
  const supabase = createBrowserSupabase();
  const router = useRouter();
  const access = useAccess();
  const [loading, setLoading] = useState(true);

  const [levelCode, setLevelCode] = useState<string | null>(null);
  const [levelName, setLevelName] = useState("");
  const [ownTrack, setOwnTrack] = useState<string | null>(null);
  const [ownTrackName, setOwnTrackName] = useState("");
  const [subjectsById, setSubjectsById] = useState<Map<string, Subject>>(new Map());
  const [subjectsByCode, setSubjectsByCode] = useState<Map<string, Subject>>(new Map());
  const [trackIdByCode, setTrackIdByCode] = useState<Map<string, string>>(new Map());
  const [trackNameByCode, setTrackNameByCode] = useState<Map<string, string>>(new Map());
  const [chapters, setChapters] = useState<Chapter[]>([]);

  const [filiere, setFiliere] = useState<string | null>(null);
  const [subject, setSubject] = useState<SubjectCard | null>(null);
  const [dept, setDept] = useState<string>("");
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [kind, setKind] = useState<Kind | null>(null);

  // reading state
  const [busy, setBusy] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);       // for current kind
  const [coursBodies, setCoursBodies] = useState<string>("");  // raw cours text (for AI résumé)
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [reachedEnd, setReachedEnd] = useState(false);
  const [aiResume, setAiResume] = useState<string | null>(null);
  const [aiBusy, setAiBusy] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  // study layer: per-lesson mastery progress + flashcards deck
  const [prog, setProg] = useState<Record<string, { m: number; t: number }>>({});
  const [deckOpen, setDeckOpen] = useState(false);
  const [chapterItems, setChapterItems] = useState<PQItem[]>([]);
  const [practiceNotion, setPracticeNotion] = useState<string | null>(null);
  const onLessonProg = useCallback((id: string, m: number, t: number) => {
    setProg((p) => (p[id]?.m === m && p[id]?.t === t ? p : { ...p, [id]: { m, t } }));
  }, []);

  // Funnel → only this notion's exercises. Resolve the clicked section heading to
  // the questions tagged with it: (1) maths, via the slug keyword ruleset; (2) other
  // subjects, via phrase overlap between the heading and each question's notion tag.
  // Shared by practiceItems (what the quiz shows) and canPractice (whether to show
  // the CTA at all) so a section with no exercises simply hides its funnel — never
  // the old behaviour of falling back to the entire chapter bank.
  const selectForNotion = useCallback((notion: string): PQItem[] => {
    const available = new Set(chapterItems.map((q) => q.notion).filter(Boolean) as string[]);
    const slug = notionSlug(notion, available);
    let sel = slug ? chapterItems.filter((q) => q.notion === slug) : [];
    if (!sel.length) {
      const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9؀-ۿ ]/g, " ").replace(/\s+/g, " ").trim();
      const h = norm(notion);
      sel = chapterItems.filter((q) => {
        if (!q.notion) return false;
        const n = norm(q.notion);
        return n.length > 2 && (h.includes(n) || n.includes(h));
      });
    }
    return sel;
  }, [chapterItems]);

  const practiceItems = useMemo<PQItem[]>(() => {
    if (practiceNotion === null) return [];
    const sel = selectForNotion(practiceNotion);
    return sel.length ? sel : chapterItems; // safety net; the CTA is only shown when sel > 0
  }, [practiceNotion, chapterItems, selectForNotion]);

  const canPractice = useCallback((notion: string) => selectForNotion(notion).length > 0, [selectForNotion]);

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

      const [{ data: subs }, { data: trks }, { data: chs }] = await Promise.all([
        supabase.from("subjects").select("id, code, name"),
        supabase.from("tracks").select("id, code, name"),
        levelId
          ? supabase.from("chapters").select("id, subject_id, track_id, name, position, domain, unit, unit_pos").eq("level_id", levelId).order("position")
          : Promise.resolve({ data: [] as Chapter[] }),
      ]);
      const sById = new Map<string, Subject>(); const sByCode = new Map<string, Subject>();
      for (const s of (subs ?? []) as Subject[]) { sById.set(s.id, s); sByCode.set(s.code, s); }
      const tId = new Map<string, string>(); const tName = new Map<string, string>();
      for (const t of (trks ?? []) as Track[]) { tId.set(t.code, t.id); tName.set(t.code, t.name); }
      setSubjectsById(sById); setSubjectsByCode(sByCode);
      setTrackIdByCode(tId); setTrackNameByCode(tName);
      setChapters((chs ?? []) as Chapter[]);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Enable "mark as read" only once the student scrolls to the end of the cours.
  useEffect(() => {
    if (kind !== "cours" || !endRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) setReachedEnd(true); },
      { threshold: 0.4 }
    );
    obs.observe(endRef.current);
    return () => obs.disconnect();
  }, [kind, lessons]);

  const is2bac = levelCode === "2bac";

  const chips = useMemo(() => {
    if (!is2bac || !ownTrack) return [];
    const codes = [ownTrack, ...SCIENCE_ORDER.filter((c) => c !== ownTrack)];
    return codes.filter((c) => trackIdByCode.has(c)).map((c) => ({ code: c, label: SHORT[c] ?? c.toUpperCase(), name: trackNameByCode.get(c) ?? c }));
  }, [is2bac, ownTrack, trackIdByCode, trackNameByCode]);

  // Subjects for the selected filière (curriculum order), each with its chapters.
  const subjectCards = useMemo<SubjectCard[]>(() => {
    const f = filiere ?? ownTrack;
    if (!f || !levelCode) return [];
    const trackId = trackIdByCode.get(f) ?? null;
    const chaptersFor = (subjId: string) =>
      chapters
        .filter((c) => c.subject_id === subjId && (c.track_id === trackId || c.track_id == null))
        .sort((a, b) => a.position - b.position);
    const ref: SubjectRef[] | null = curriculumFor(levelCode, f);
    if (ref) {
      return ref.map((r) => {
        const s = subjectsByCode.get(r.code);
        if (!s) return null;
        return { id: s.id, code: s.code, name: s.name, coeff: r.coeff, chapters: chaptersFor(s.id) };
      }).filter(Boolean) as SubjectCard[];
    }
    const seen = new Set<string>();
    const out: SubjectCard[] = [];
    for (const c of chapters) {
      if (trackId && c.track_id && c.track_id !== trackId) continue;
      if (seen.has(c.subject_id)) continue;
      seen.add(c.subject_id);
      const s = subjectsById.get(c.subject_id);
      if (s) out.push({ id: s.id, code: s.code, name: s.name, coeff: null, chapters: chaptersFor(s.id) });
    }
    return out.sort((a, b) => a.name.localeCompare(b.name));
  }, [filiere, ownTrack, levelCode, trackIdByCode, chapters, subjectsByCode, subjectsById]);

  async function openChapterKind(c: Chapter, k: Kind) {
    setChapter(c);
    setKind(k);
    setProg({});
    setBusy(true);
    setAiResume(null);
    setReachedEnd(false);
    const { data } = await supabase
      .from("lessons")
      .select("id, title, body, kind")
      .eq("chapter_id", c.id)
      .order("position");
    const all = (data ?? []) as Lesson[];
    const cours = all.filter((l) => l.kind !== "resume");
    const show = k === "resume" ? all.filter((l) => l.kind === "resume") : cours;
    setLessons(show);
    setCoursBodies(cours.map((l) => `## ${l.title}\n${l.body ?? ""}`).join("\n\n"));

    // load the chapter's QCU as an interactive practice bank (for the cours funnels)
    const { data: exRows } = await supabase.from("exercises").select("id").eq("chapter_id", c.id);
    const exIds = (exRows ?? []).map((r) => r.id as string);
    if (exIds.length) {
      const { data: qRows } = await supabase.from("questions").select("id, statement, position, notion").in("exercise_id", exIds).order("position");
      const qs = (qRows ?? []) as { id: string; statement: string; notion: string | null }[];
      const qIds = qs.map((q) => q.id);
      const [{ data: oRows }, { data: sRows }] = await Promise.all([
        supabase.from("answer_options").select("question_id, label, is_correct, position").in("question_id", qIds),
        supabase.from("solutions").select("question_id, body").in("question_id", qIds),
      ]);
      const optsByQ = new Map<string, { label: string; correct: boolean; position: number }[]>();
      for (const o of (oRows ?? []) as { question_id: string; label: string; is_correct: boolean; position: number }[]) {
        const a = optsByQ.get(o.question_id) ?? []; a.push({ label: o.label, correct: o.is_correct, position: o.position }); optsByQ.set(o.question_id, a);
      }
      const solByQ = new Map<string, string>();
      for (const s of (sRows ?? []) as { question_id: string; body: string }[]) solByQ.set(s.question_id, s.body);
      setChapterItems(qs.map((q) => ({
        statement: q.statement,
        options: (optsByQ.get(q.id) ?? []).sort((a, b) => a.position - b.position).map((o) => ({ label: o.label, correct: o.correct })),
        solution: solByQ.get(q.id),
        notion: q.notion ?? undefined,
      })));
    } else setChapterItems([]);

    // load read-state for cours lessons only
    if (k === "cours" && show.length) {
      const { data: comp } = await supabase
        .from("lesson_completions").select("lesson_id").in("lesson_id", show.map((l) => l.id));
      setCompleted(new Set((comp ?? []).map((r) => r.lesson_id as string)));
    } else {
      setCompleted(new Set());
    }
    setBusy(false);
  }

  async function markRead(id: string) {
    await supabase.rpc("mark_lesson_read", { p_lesson: id });
    setCompleted((s) => new Set(s).add(id));
  }

  async function generateResume() {
    if (!chapter || !coursBodies.trim()) return;
    setAiBusy(true);
    setAiResume(null);
    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: subject?.name, chapter: chapter.name, body: coursBodies }),
      });
      const json = await res.json();
      setAiResume(json.text || `⚠ ${json.error || "Le résumé n'a pas pu être généré."}`);
    } catch {
      setAiResume("⚠ Impossible de générer le résumé.");
    }
    setAiBusy(false);
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold tracking-tight">Cours & Résumés</h1>
        <div className="grid place-items-center h-40 text-neutral-400"><Loader2 className="w-6 h-6 animate-spin" /></div>
      </div>
    );
  }

  // ---------- READING VIEW ----------
  if (chapter && kind) {
    const isResume = kind === "resume";
    const t = subjectTheme(subject?.code);
    return (
      <div className="max-w-3xl mx-auto py-8 fade-up">
        <SubjectAmbient code={subject?.code} />
        <button onClick={() => { setKind(null); setLessons([]); }} className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
          <ChevronLeft className="w-4 h-4" /> {chapter.name}
        </button>

        {/* bac-up chapter hero — subject accent, fading to the corner */}
        <div className={`mt-3 rounded-3xl p-7 relative overflow-hidden text-white bg-gradient-to-br ${t.grad} shadow-lg shadow-black/10`}>
          <div className="pointer-events-none absolute -top-20 -right-16 w-64 h-64 rounded-full bg-white/15 blur-3xl" />
          {(() => { const G = subjectIcon(subject?.code ?? ""); return <G className="pointer-events-none absolute -right-4 -bottom-5 w-28 h-28 rotate-[18deg] text-white/15" strokeWidth={1.25} />; })()}
          <div className="relative flex items-center gap-2 text-xs font-semibold text-white/85">
            {isResume ? <ScrollText className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
            {isResume ? "Résumé" : "Cours complet"} · {subject?.name}
          </div>
          <h1 dir="auto" className="relative mt-2 text-3xl font-extrabold tracking-tight">{chapter.name}</h1>
          <p className="relative mt-1.5 text-sm text-white/85">
            {isResume ? "L'essentiel à retenir avant l'examen." : "Présenté pas à pas, avec formules et méthode."}
          </p>
        </div>

        {kind === "cours" && (() => {
          const vals = Object.values(prog);
          const cm = vals.reduce((a, x) => a + x.m, 0);
          const ct = vals.reduce((a, x) => a + x.t, 0);
          const pct = ct ? Math.round((cm / ct) * 100) : 0;
          return (
            <div className="mt-4 glass rounded-2xl p-4 flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[180px]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-neutral-500 dark:text-neutral-400">Ta maîtrise du chapitre</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{pct}%{ct ? ` · ${cm}/${ct}` : ""}</span>
                </div>
                <div className="h-2 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden"><div className="h-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} /></div>
              </div>
              <button onClick={() => setDeckOpen(true)} className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full glass hover:-translate-y-0.5 transition"><Sparkles className="w-4 h-4 text-arctic-blue dark:text-arctic-cyan" /> Flashcards</button>
              <button onClick={() => router.push("/dashboard/examens/preparation")} className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white hover:brightness-105 transition"><FileText className="w-4 h-4" /> S&apos;entraîner</button>
            </div>
          );
        })()}

        {deckOpen && <FlashcardDeck bodies={lessons.map((l) => l.body ?? "")} onClose={() => setDeckOpen(false)} />}
        {practiceNotion !== null && <PracticeQuiz notion={practiceNotion} items={practiceItems} onClose={() => setPracticeNotion(null)} />}

        {busy ? (
          <div className="grid place-items-center h-40 text-neutral-400"><Loader2 className="w-6 h-6 animate-spin" /></div>
        ) : isResume ? (
          // RÉSUMÉ: authored résumés if any, else an instant AI résumé.
          lessons.length > 0 ? (
            <div className="mt-5 space-y-4">
              {lessons.map((l) => <Reader key={l.id} lesson={l} accent />)}
            </div>
          ) : (
            <div className="mt-5">
              {!aiResume && (
                <div className="glass rounded-3xl p-8 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-arctic-blue/10 text-arctic-blue dark:text-arctic-cyan grid place-items-center mx-auto"><Sparkles className="w-5 h-5" /></div>
                  <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
                    Aucun résumé rédigé pour ce chapitre — l&apos;IA Bac-up peut t&apos;en générer un instantanément à partir du cours.
                  </p>
                  <button
                    onClick={generateResume}
                    disabled={aiBusy || !coursBodies.trim()}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white px-5 py-2.5 hover:brightness-105 transition disabled:opacity-50"
                  >
                    {aiBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {coursBodies.trim() ? "Générer le résumé IA" : "Cours indisponible"}
                  </button>
                </div>
              )}
              {aiResume && (
                <div className="glass rounded-3xl p-7">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-arctic-blue dark:text-arctic-cyan mb-3">
                    <Sparkles className="w-3.5 h-3.5" /> Résumé généré par l&apos;IA Bac-up
                  </div>
                  <div className="text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-200 whitespace-pre-wrap"><Tex>{aiResume}</Tex></div>
                </div>
              )}
            </div>
          )
        ) : lessons.length === 0 ? (
          <Empty text="Le cours de ce chapitre arrive bientôt. ✨" />
        ) : (
          // COURS: full lessons + mark-as-read gamification.
          <div className="mt-5 space-y-4">
            {lessons.map((l) => (
              <div key={l.id} className="glass rounded-3xl p-7">
                <h3 dir="auto" className="text-lg font-bold tracking-tight mb-3"><Tex>{l.title}</Tex></h3>
                <CourseContent body={l.body ?? ""} lessonId={l.id} onProgress={(m, t) => onLessonProg(l.id, m, t)} onPractice={chapterItems.length ? (notion) => setPracticeNotion(notion) : undefined} canPractice={canPractice} />
                <div className="mt-5 pt-4 border-t border-neutral-200/60 dark:border-neutral-800 flex justify-end">
                  {completed.has(l.id) ? (
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-500"><Check className="w-4 h-4" /> Lu</span>
                  ) : (
                    <button onClick={() => markRead(l.id)} disabled={!reachedEnd} className="text-sm font-semibold rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-4 py-2 hover:opacity-90 transition disabled:opacity-40">
                      Marquer comme lu
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div ref={endRef} className="h-1" />
            {!reachedEnd && <p className="text-center text-xs text-neutral-400">Fais défiler jusqu&apos;en bas pour valider ta lecture.</p>}
          </div>
        )}
        <ResourceList scope="chapter" scopeKey={chapter.id} title="Ressources du chapitre" />
      </div>
    );
  }

  // ---------- CHAPTER → COURS / RÉSUMÉ CHOICE ----------
  if (chapter) {
    return (
      <Shell title={chapter.name} subtitle={subject?.name ?? undefined} onBack={() => setChapter(null)}>
        <div className="grid sm:grid-cols-2 gap-4">
          <button onClick={() => openChapterKind(chapter, "cours")} className="group glass rounded-3xl p-7 text-left hover:-translate-y-1 transition duration-300">
            <div className="w-12 h-12 rounded-2xl bg-arctic-blue/15 text-arctic-blue dark:text-arctic-cyan grid place-items-center group-hover:scale-105 transition"><BookOpen className="w-5 h-5" /></div>
            <div className="mt-4 font-semibold tracking-tight text-lg">Cours complet</div>
            <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">Le chapitre présenté pas à pas : définitions, propriétés, formules et méthode.</p>
          </button>
          <button onClick={() => openChapterKind(chapter, "resume")} className="group glass rounded-3xl p-7 text-left hover:-translate-y-1 transition duration-300 relative">
            <span className="absolute top-4 right-4 inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-arctic-blue/15 text-arctic-blue dark:text-arctic-cyan">Express</span>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-arctic-cyan to-arctic-blue text-white grid place-items-center group-hover:scale-105 transition"><ScrollText className="w-5 h-5" /></div>
            <div className="mt-4 font-semibold tracking-tight text-lg">Résumé</div>
            <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">L&apos;essentiel à retenir avant l&apos;examen — points clés et formules, en un coup d&apos;œil.</p>
          </button>
        </div>
      </Shell>
    );
  }

  // ---------- SUBJECT → CHAPTERS ----------
  if (subject) {
    const t = subjectTheme(subject.code);
    return (
      <div className="max-w-3xl mx-auto py-8 fade-up">
        <SubjectAmbient code={subject.code} />
        <button onClick={() => setSubject(null)} className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
          <ChevronLeft className="w-4 h-4" /> {is2bac ? `Retour · ${SHORT[filiere ?? ""] ?? "matières"}` : "Toutes les matières"}
        </button>
        <div className="mt-3 flex items-center gap-3">
          <span className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${t.grad} text-white grid place-items-center font-bold uppercase shadow-sm`}>{subject.name.slice(0, 2)}</span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{subject.name}</h1>
            <div className="text-sm text-neutral-400">{subject.chapters.length} chapitre{subject.chapters.length > 1 ? "s" : ""} · cours + résumés</div>
          </div>
        </div>

        {subject.chapters.length === 0 ? (
          <div className="mt-6 glass rounded-3xl p-10 text-center text-neutral-400">Les cours de cette matière arrivent très bientôt. ✨</div>
        ) : (() => {
          const hasDomains = subject.chapters.some((c) => c.domain);
          const firstId = subject.chapters[0]?.id;             // demo: only the very 1st chapter is open
          const lockedFor = (c: Chapter) => access.isDemo && c.id !== firstId;
          const chapterNum = new Map(subject.chapters.map((c, i) => [c.id, i + 1]));

          const Row = (c: Chapter) => {
            const locked = lockedFor(c);
            return (
              <button key={c.id} onClick={() => (locked ? router.push("/payment") : setChapter(c))} className={`w-full glass rounded-2xl p-4 sm:p-5 flex items-center gap-4 text-left transition ${locked ? "opacity-80 hover:opacity-100" : "hover:-translate-y-0.5"}`}>
                <span className={`w-9 h-9 rounded-xl ${t.soft} ${t.text} grid place-items-center font-bold text-sm shrink-0`}>{chapterNum.get(c.id)}</span>
                <div className="flex-1 min-w-0">
                  <div dir="auto" className="font-semibold tracking-tight flex items-center gap-2">{c.name}{locked && <LockBadge />}</div>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-neutral-400">
                    <span className="inline-flex items-center gap-1"><BookOpen className="w-3 h-3" /> Cours</span>
                    <span className="inline-flex items-center gap-1"><ScrollText className="w-3 h-3" /> Résumé</span>
                  </div>
                </div>
                {locked ? <Lock className="w-4 h-4 text-neutral-400 shrink-0" /> : <ChevronRight className="w-5 h-5 text-neutral-300 dark:text-neutral-600 shrink-0" />}
              </button>
            );
          };

          if (!hasDomains) return <div className="mt-5 space-y-2.5">{subject.chapters.map((c) => Row(c))}</div>;

          // Departments derived from the data (Physique/Chimie, or Géologie/Biologie…),
          // ordered by unit_pos. Falls back to the first available department.
          const seen = new Map<string, number>();
          for (const c of subject.chapters) {
            const d = c.domain ?? "";
            if (d && !seen.has(d)) seen.set(d, c.unit_pos ?? 0);
          }
          const DEPTS = [...seen.entries()]
            .sort((a, b) => a[1] - b[1])
            .map(([key]) => ({ key, label: key.charAt(0).toUpperCase() + key.slice(1) }));
          const activeDept = DEPTS.some((d) => d.key === dept) ? dept : (DEPTS[0]?.key ?? "");

          const inDept = subject.chapters
            .filter((c) => (c.domain ?? "") === activeDept)
            .sort((a, b) => (a.unit_pos ?? 0) - (b.unit_pos ?? 0) || a.position - b.position);
          const units: { unit: string; items: Chapter[] }[] = [];
          for (const c of inDept) {
            const u = c.unit ?? "Autres";
            const last = units[units.length - 1];
            if (last && last.unit === u) last.items.push(c);
            else units.push({ unit: u, items: [c] });
          }
          return (
            <div className="mt-5">
              {DEPTS.length > 1 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {DEPTS.map((d) => {
                    const on = d.key === activeDept;
                    return (
                      <button key={d.key} onClick={() => setDept(d.key)}
                        className={`flex-1 min-w-[120px] rounded-2xl px-4 py-3 text-sm font-bold tracking-tight transition ${on ? `bg-gradient-to-br ${t.grad} text-white shadow-lg shadow-black/10` : "glass text-neutral-600 dark:text-neutral-300 hover:-translate-y-0.5"}`}>
                        {d.label}
                      </button>
                    );
                  })}
                </div>
              )}
              <div className="space-y-6">
                {units.map((g) => (
                  <div key={g.unit}>
                    <div className="flex items-center gap-2 mb-2.5">
                      <span dir="auto" className={`text-[11px] font-bold uppercase tracking-wide ${t.text}`}>{g.unit}</span>
                      <span className="h-px flex-1 bg-black/[0.06] dark:bg-white/[0.08]" />
                      <span className="text-[11px] text-neutral-400">{g.items.length} chap.</span>
                    </div>
                    <div className="space-y-2.5">{g.items.map((c) => Row(c))}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>
    );
  }

  // ---------- BROWSE (filières → matières) ----------
  return (
    <div className="max-w-4xl mx-auto py-8 fade-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cours & Résumés</h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {ownTrackName ? `${ownTrackName} · ${levelName}` : "Cours complets et résumés, par chapitre."}
        </p>
      </div>

      {is2bac && chips.length > 0 && (
        <div className="mt-7">
          <div className="text-[11px] font-bold uppercase tracking-wide text-neutral-400 mb-2">Filière</div>
          <div className="flex flex-wrap gap-2">
            {chips.map((c) => {
              const isOwn = c.code === ownTrack;
              const on = c.code === filiere;
              return (
                <button key={c.code} onClick={() => { setFiliere(c.code); setSubject(null); }} title={c.name}
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
        <GraduationCap className="w-4 h-4" /> {is2bac ? (trackNameByCode.get(filiere ?? "") ?? "Matières") : (ownTrackName || "Matières")}
      </div>
      {subjectCards.length === 0 ? (
        <div className="mt-4 glass rounded-3xl p-10 text-center text-neutral-400">Le contenu arrive très bientôt. ✨</div>
      ) : (
        <div className="mt-4 space-y-3">
          {subjectCards.map((c) => {
            const has = c.chapters.length > 0;
            return (
              <SubjectPad key={c.code} code={c.code} name={c.name} onClick={() => has && setSubject(c)} disabled={!has}
                right={
                  <div className="flex flex-col items-end gap-1.5">
                    {c.coeff != null && <PadChip>Coeff. {c.coeff}</PadChip>}
                    {has ? (
                      <PadChip accent code={c.code}><Layers className="w-3 h-3" /> {c.chapters.length} chap.</PadChip>
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

function Reader({ lesson, accent }: { lesson: Lesson; accent?: boolean }) {
  return (
    <div className={`glass rounded-3xl p-7 ${accent ? "border-l-2 border-arctic-blue/40" : ""}`}>
      <h3 dir="auto" className="text-lg font-bold tracking-tight mb-3"><Tex>{lesson.title}</Tex></h3>
      <CourseContent body={lesson.body ?? ""} />
    </div>
  );
}

function Shell({ title, subtitle, onBack, children }: { title: string; subtitle?: string; onBack?: () => void; children: React.ReactNode }) {
  return (
    <div className="max-w-3xl mx-auto py-8 fade-up">
      {onBack && (
        <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white mb-4">
          <ChevronLeft className="w-4 h-4" /> Retour
        </button>
      )}
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {subtitle && <p className="mt-2 text-neutral-500 dark:text-neutral-400">{subtitle}</p>}
      <div className="mt-7">{children}</div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="mt-5 glass rounded-2xl p-8 text-center text-sm text-neutral-400">{text}</div>;
}
