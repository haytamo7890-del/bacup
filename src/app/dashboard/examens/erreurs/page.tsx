"use client";

/**
 * Espace de préparation — journal d'erreurs.
 * Every question whose LATEST attempt is wrong (prep runs + full exams), grouped
 * matière → chapitre → notion, with "Rejouer" at every level. Replays run in the
 * practice runner as kind "review" (record_practice): a right answer clears the
 * error from the journal and climbs its spaced-review box.
 * Route: /dashboard/examens/erreurs[?s=<subjectCode>]
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { Tex } from "@/components/math";
import { subjectTheme } from "@/config/subjects";
import { notionLabel, OTHER_NOTIONS } from "@/lib/notions";
import { loadStudentCtx, loadErrors, prepRoutes, type ErrorRow, type StudentCtx } from "@/lib/prep";
import { ChevronLeft, ChevronDown, Loader2, NotebookPen, RotateCw, BookOpen, Brain, Timer, PartyPopper } from "lucide-react";

type NotionGroup = { key: string; notion: string | null; rows: ErrorRow[] };
type ChapterGroup = { key: string; chapterId: string | null; name: string; position: number; notions: NotionGroup[]; n: number };
type SubjectGroup = { code: string; chapters: ChapterGroup[]; n: number };

const dayMs = 86_400_000;
function dueLabel(r: ErrorRow): string {
  if (!r.due_at) return "";
  const d = Math.ceil((Date.parse(r.due_at) - Date.now()) / dayMs);
  return d <= 0 ? "à revoir aujourd'hui" : d === 1 ? "revient demain" : `revient dans ${d} j`;
}

function group(rows: ErrorRow[]): SubjectGroup[] {
  const subj = new Map<string, Map<string, ChapterGroup>>();
  for (const r of rows) {
    if (!subj.has(r.subject_code)) subj.set(r.subject_code, new Map());
    const chs = subj.get(r.subject_code)!;
    const ck = r.chapter_id ?? "__exam";
    if (!chs.has(ck)) chs.set(ck, { key: ck, chapterId: r.chapter_id, name: r.chapter_name ?? "Examens (hors chapitre)", position: r.chapter_position ?? 9999, notions: [], n: 0 });
    const cg = chs.get(ck)!;
    const nk = r.notion ?? OTHER_NOTIONS;
    let ng = cg.notions.find((x) => x.key === nk);
    if (!ng) { ng = { key: nk, notion: r.notion, rows: [] }; cg.notions.push(ng); }
    ng.rows.push(r); cg.n += 1;
  }
  return [...subj.entries()].map(([code, chs]) => {
    const chapters = [...chs.values()].sort((a, b) => a.position - b.position);
    for (const c of chapters) c.notions.sort((a, b) => b.rows.length - a.rows.length);
    return { code, chapters, n: chapters.reduce((s, c) => s + c.n, 0) };
  }).sort((a, b) => b.n - a.n);
}

export default function ErreursPage() {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const [ctx, setCtx] = useState<StudentCtx | null>(null);
  const [rows, setRows] = useState<ErrorRow[] | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [open, setOpen] = useState<Record<string, boolean>>({});

  useEffect(() => {
    (async () => {
      const s = new URLSearchParams(window.location.search).get("s");
      const [c, r] = await Promise.all([loadStudentCtx(supabase), loadErrors(supabase)]);
      setCtx(c); setRows(r); setFilter(s && r.some((x) => x.subject_code === s) ? s : null);
    })();
  }, [supabase]);

  const subjects = useMemo(() => group(rows ?? []), [rows]);
  const shown = filter ? subjects.filter((s) => s.code === filter) : subjects;
  const total = shown.reduce((s, g) => s + g.n, 0);
  const dueToday = (rows ?? []).filter((r) => (!filter || r.subject_code === filter) && r.due_at && Date.parse(r.due_at) <= Date.now()).length;
  const fromExam = (rows ?? []).filter((r) => (!filter || r.subject_code === filter) && r.from_exam).length;
  const name = (code: string) => ctx?.subjectsByCode.get(code)?.name ?? code;

  return (
    <div className="max-w-4xl mx-auto py-8 fade-up">
      <Link href={prepRoutes.hub()} className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
        <ChevronLeft className="w-4 h-4" /> Espace de préparation
      </Link>

      <div className="mt-3 rounded-3xl p-6 sm:p-7 relative overflow-hidden text-white bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 shadow-lg shadow-black/10">
        <div className="pointer-events-none absolute -top-20 -right-16 w-64 h-64 rounded-full bg-white/15 blur-3xl" />
        <NotebookPen className="pointer-events-none absolute -right-4 -bottom-5 w-28 h-28 rotate-[18deg] text-white/15" strokeWidth={1.25} />
        <div className="relative text-xs font-semibold text-white/85">Journal d&apos;erreurs</div>
        <h1 className="relative mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight">Mes erreurs</h1>
        <p className="relative mt-1.5 text-sm text-white/85 max-w-xl">
          Chaque question ratée (exercices et examens) reste ici jusqu&apos;à ce que tu la réussisses. Rejoue-les par notion — c&apos;est là que se gagnent les points.
        </p>
        {rows && total > 0 && (
          <div className="relative mt-4 flex flex-wrap items-center gap-2">
            <Link href={prepRoutes.replayErrors({ subject: filter })} className="inline-flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-full bg-white text-rose-600 hover:-translate-y-0.5 transition shadow-md">
              <RotateCw className="w-4 h-4" /> Rejouer mes erreurs{total > 20 ? " (20)" : ` (${total})`}
            </Link>
            {dueToday > 0 && (
              <Link href={prepRoutes.review(filter ?? undefined)} className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 transition">
                <Brain className="w-4 h-4" /> {dueToday} à réviser aujourd&apos;hui
              </Link>
            )}
          </div>
        )}
      </div>

      {!rows ? (
        <div className="grid place-items-center h-60 text-neutral-400"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : subjects.length === 0 ? (
        <div className="mt-5 glass rounded-3xl p-10 text-center">
          <PartyPopper className="w-8 h-8 mx-auto text-emerald-500" />
          <div className="mt-3 font-semibold">Aucune erreur en cours 🎉</div>
          <p className="mt-1 text-sm text-neutral-400">Tes erreurs apparaîtront ici dès ta prochaine série ou ton prochain examen.</p>
          <Link href={prepRoutes.hub()} className="mt-4 inline-flex text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white">S&apos;entraîner</Link>
        </div>
      ) : (
        <>
          {/* stats + subject filter */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { k: "Erreurs", v: total },
              { k: "À réviser aujourd'hui", v: dueToday },
              { k: "Venues d'examens", v: fromExam },
            ].map((s) => (
              <div key={s.k} className="glass rounded-2xl p-4">
                <div className="text-2xl font-extrabold tracking-tight">{s.v}</div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">{s.k}</div>
              </div>
            ))}
          </div>
          {subjects.length > 1 && (
            <div className="mt-5 flex flex-wrap gap-2">
              <button onClick={() => setFilter(null)} className={`text-sm font-semibold px-4 py-2 rounded-full transition ${!filter ? "bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white shadow-lg shadow-arctic-blue/20" : "chip text-neutral-600 dark:text-neutral-300"}`}>Toutes · {subjects.reduce((s, g) => s + g.n, 0)}</button>
              {subjects.map((g) => (
                <button key={g.code} onClick={() => setFilter(g.code)} className={`text-sm font-semibold px-4 py-2 rounded-full transition ${filter === g.code ? "bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white shadow-lg shadow-arctic-blue/20" : "chip text-neutral-600 dark:text-neutral-300"}`}>{name(g.code)} · {g.n}</button>
              ))}
            </div>
          )}

          <div className="mt-6 space-y-6">
            {shown.map((sg) => {
              const t = subjectTheme(sg.code);
              return (
                <section key={sg.code}>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <h2 className="text-lg font-bold tracking-tight inline-flex items-center gap-2"><span className={`w-2.5 h-2.5 rounded-full ${t.bar}`} />{name(sg.code)}</h2>
                    <Link href={prepRoutes.replayErrors({ subject: sg.code })} className={`text-xs font-semibold inline-flex items-center gap-1 ${t.text}`}><RotateCw className="w-3.5 h-3.5" /> Rejouer la matière</Link>
                  </div>
                  <div className="space-y-3">
                    {sg.chapters.map((cg) => (
                      <div key={cg.key} className="glass rounded-2xl p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-semibold tracking-tight truncate inline-flex items-center gap-2">{!cg.chapterId && <Timer className="w-4 h-4 text-neutral-400" />}{cg.name}</div>
                            <div className="text-xs text-neutral-400">{cg.n} erreur{cg.n > 1 ? "s" : ""}</div>
                          </div>
                          {cg.chapterId && (
                            <Link href={prepRoutes.cours(cg.chapterId)} className="shrink-0 text-xs font-semibold inline-flex items-center gap-1 px-3 py-1.5 rounded-full chip text-neutral-600 dark:text-neutral-300"><BookOpen className="w-3.5 h-3.5" /> Cours</Link>
                          )}
                        </div>
                        <ul className="mt-3 divide-y divide-black/5 dark:divide-white/5">
                          {cg.notions.map((ng) => {
                            const k = `${sg.code}|${cg.key}|${ng.key}`;
                            const isOpen = !!open[k];
                            const misses = ng.rows.reduce((s, r) => s + r.misses, 0);
                            return (
                              <li key={k} className="py-2.5">
                                <div className="flex items-center gap-3">
                                  <button onClick={() => setOpen((m) => ({ ...m, [k]: !m[k] }))} className="flex-1 min-w-0 flex items-center gap-2 text-left">
                                    <ChevronDown className={`w-4 h-4 text-neutral-400 shrink-0 transition ${isOpen ? "" : "-rotate-90"}`} />
                                    <span className="text-sm font-medium truncate" dir="auto">{ng.notion ? notionLabel(ng.notion) : "Autres questions"}</span>
                                    <span className="shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/12 text-rose-600 dark:text-rose-300">{ng.rows.length}</span>
                                    {misses > ng.rows.length && <span className="shrink-0 text-[11px] text-neutral-400">{misses} ratés</span>}
                                  </button>
                                  <Link href={prepRoutes.replayErrors({ subject: sg.code, chapter: cg.key, notion: ng.key })}
                                    className={`shrink-0 text-xs font-bold inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-white bg-gradient-to-r ${t.grad}`}>
                                    <RotateCw className="w-3.5 h-3.5" /> Rejouer
                                  </Link>
                                </div>
                                {isOpen && (
                                  <ul className="mt-2 ml-6 space-y-2">
                                    {ng.rows.map((r) => (
                                      <li key={r.question_id} className="rounded-xl bg-black/[0.03] dark:bg-white/[0.04] px-3 py-2">
                                        <div className="text-sm text-neutral-700 dark:text-neutral-200 line-clamp-3" dir="auto"><Tex>{r.statement}</Tex></div>
                                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-neutral-400">
                                          {r.from_exam && <span className="font-semibold text-amber-600 dark:text-amber-300">Examen</span>}
                                          <span>raté {r.misses}×</span>
                                          {dueLabel(r) && <span>{dueLabel(r)}</span>}
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
