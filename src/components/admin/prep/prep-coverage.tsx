"use client";

/**
 * Couverture — for one matière (+ filière): every chapter → its cours notions
 * (## headings) → how many QCU each notion has, plus séries count.
 * Red = notion with 0 exercices (the content team's to-do list).
 * Export → a "bacup.prep/v1" pack of the existing content (with ids), so the
 * content team can edit it as JSON and re-import it (updates in place).
 */
import { useCallback, useEffect, useState } from "react";
import { groupByNotion, lessonNotions, notionLabel } from "@/lib/notions";
import { downloadJson, PACK_FORMAT, type Pack, type PackExercise, type PackSerie } from "@/lib/prep-pack";
import { useAdminRefs, ScopePicker, btnGhost } from "./shared";
import { Loader2, Download, AlertTriangle, CheckCircle2 } from "lucide-react";

type Ch = { id: string; code: string | null; name: string; position: number; track_id: string | null };
type Row = { ch: Ch; notions: { notion: string; n: number; extra?: boolean }[]; total: number; series: number };

export function PrepCoverage() {
  const { supabase, level, niveau, subjects, tracks } = useAdminRefs();
  const [subjectId, setSubjectId] = useState("");
  const [trackId, setTrackId] = useState("");
  const [data, setData] = useState<{ key: string; rows: Row[] } | null>(null);
  const scopeKey = `${level?.id ?? ""}|${subjectId}|${trackId}`;
  const rows = data?.key === scopeKey ? data.rows : null;
  const busy = !!subjectId && !rows;
  const [exporting, setExporting] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!level || !subjectId) return;
    const key = `${level.id}|${subjectId}|${trackId}`;
    const { data: chs } = await supabase.from("chapters").select("id, code, name, position, track_id").eq("level_id", level.id).eq("subject_id", subjectId).order("position");
    const chapters = ((chs ?? []) as Ch[]).filter((c) => !trackId || c.track_id === trackId || c.track_id == null);
    const ids = chapters.map((c) => c.id);
    const [{ data: ls }, { data: ex }, { data: se }] = await Promise.all([
      ids.length ? supabase.from("lessons").select("chapter_id, body, kind, position").in("chapter_id", ids).order("position") : Promise.resolve({ data: [] }),
      ids.length ? supabase.from("exercises").select("id, chapter_id").in("chapter_id", ids) : Promise.resolve({ data: [] }),
      ids.length ? supabase.from("series").select("id, chapter_id").in("chapter_id", ids) : Promise.resolve({ data: [] }),
    ]);
    const exRows = (ex ?? []) as { id: string; chapter_id: string }[];
    const chByEx = new Map(exRows.map((e) => [e.id, e.chapter_id]));
    const qs: { id: string; chapter_id: string; notion: string | null }[] = [];
    for (let i = 0; i < exRows.length; i += 150) {
      const { data } = await supabase.from("questions").select("id, exercise_id, notion").in("exercise_id", exRows.slice(i, i + 150).map((e) => e.id));
      for (const q of (data ?? []) as { id: string; exercise_id: string; notion: string | null }[]) qs.push({ id: q.id, chapter_id: chByEx.get(q.exercise_id) ?? "", notion: q.notion });
    }
    const out: Row[] = chapters.map((ch) => {
      const heads = ((ls ?? []) as { chapter_id: string; body: string | null; kind: string }[])
        .filter((l) => l.chapter_id === ch.id && l.kind !== "resume")
        .flatMap((l) => lessonNotions(l.body).map((n) => ({ notion: n, lessonId: null })));
      const items = qs.filter((q) => q.chapter_id === ch.id);
      return {
        ch, total: items.length,
        notions: groupByNotion(heads, items).map((g) => ({ notion: g.notion, n: g.items.length, extra: g.extra })),
        series: ((se ?? []) as { chapter_id: string }[]).filter((s) => s.chapter_id === ch.id).length,
      };
    });
    setData({ key, rows: out });
  }, [level, subjectId, trackId, supabase]);

  useEffect(() => { void load(); }, [load]);

  /** Export existing content of some chapters as an editable pack (ids kept for round-trip). */
  async function exportPack(chs: Ch[], key: string) {
    const subject = subjects.find((s) => s.id === subjectId);
    if (!subject || !chs.length) return;
    setExporting(key);
    const ids = chs.map((c) => c.id);
    const { data: ex } = await supabase.from("exercises")
      .select("id, ref, chapter_id, title, difficulty, statement, position, kind, figure, origin, questions(id, ref, statement, notion, points, position, hint, methode, difficulty, part, answer_options(label, is_correct, position, why), solutions(body))")
      .in("chapter_id", ids).order("position");
    type QRow = { id: string; ref: string | null; statement: string; notion: string | null; points: number | null; position: number; hint: string | null; methode: string | null; difficulty: number | null; part: string | null; answer_options: { label: string; is_correct: boolean; position: number; why: string | null }[]; solutions: { body: string }[] };
    type ExRow = { id: string; ref: string | null; chapter_id: string; title: string | null; difficulty: number | null; statement: string | null; kind: string | null; figure: string | null; origin: PackExercise["origin"] | null; questions: QRow[] };
    const chKey = new Map(chs.map((c) => [c.id, c.code || c.name]));
    const exercises: PackExercise[] = ((ex ?? []) as unknown as ExRow[]).map((e) => ({
      ...(e.ref ? { ref: e.ref } : {}), id: e.id,
      chapter: chKey.get(e.chapter_id) ?? "",
      title: e.title ?? undefined,
      difficulty: (e.difficulty ?? 1) as 1 | 2 | 3,
      ...(e.statement ? { context: e.statement } : {}),
      ...(e.kind === "probleme" ? { kind: "probleme" as const } : {}),
      ...(e.figure ? { figure: e.figure } : {}),
      ...(e.origin ? { origin: e.origin } : {}),
      questions: [...e.questions].sort((a, b) => a.position - b.position).map((q) => {
        const opts = [...q.answer_options].sort((a, b) => a.position - b.position);
        return {
          ...(q.ref ? { ref: q.ref } : {}), id: q.id,
          notion: q.notion ?? undefined,
          statement: q.statement,
          options: opts.some((o) => o.why) ? opts.map((o) => ({ label: o.label, ...(o.is_correct ? { correct: true } : {}), ...(o.why ? { why: o.why } : {}) })) : opts.map((o) => o.label),
          ...(opts.some((o) => o.why) ? {} : { correct: Math.max(0, opts.findIndex((o) => o.is_correct)) }),
          ...(q.hint ? { hint: q.hint } : {}),
          ...(q.methode ? { methode: q.methode } : {}),
          ...(q.difficulty ? { difficulty: q.difficulty as 1 | 2 | 3 } : {}),
          ...(q.part ? { part: q.part } : {}),
          solution: q.solutions?.[0]?.body ?? undefined,
          ...(q.points != null && Number(q.points) !== 1 ? { points: Number(q.points) } : {}),
        };
      }),
    }));
    // hand-made séries (auto ones are regenerated, not exported)
    const { data: se } = await supabase.from("series")
      .select("slug, title, description, kind, chapter_id, unit, difficulty, xp_bonus, position, is_published, series_items(position, questions(id, ref))")
      .eq("subject_id", subjectId).in("chapter_id", ids).not("slug", "like", "auto:%");
    type SRow = { slug: string | null; title: string; description: string | null; kind: PackSerie["kind"]; chapter_id: string | null; unit: string | null; difficulty: number; xp_bonus: number; position: number; is_published: boolean; series_items: { position: number; questions: { id: string; ref: string | null } | null }[] };
    const series: PackSerie[] = ((se ?? []) as unknown as SRow[]).filter((s) => s.slug).map((s) => ({
      slug: s.slug!, title: s.title, ...(s.description ? { description: s.description } : {}), kind: s.kind,
      chapter: s.chapter_id ? chKey.get(s.chapter_id) ?? null : null, ...(s.unit ? { unit: s.unit } : {}),
      difficulty: s.difficulty as 1 | 2 | 3, xp_bonus: s.xp_bonus, position: s.position, published: s.is_published,
      questions: [...s.series_items].sort((a, b) => a.position - b.position).map((i) => i.questions?.ref || i.questions?.id || "").filter(Boolean),
    }));
    const track = tracks.find((t) => t.id === trackId)?.code ?? null;
    const pack: Pack = { format: PACK_FORMAT, level: niveau, subject: subject.code, track, exercises, ...(series.length ? { series } : {}) };
    downloadJson(`${subject.code}-${niveau}${track ? `-${track}` : ""}-${key}.json`, pack);
    setExporting(null);
  }

  const empty = rows?.reduce((a, r) => a + r.notions.filter((n) => n.n === 0).length, 0) ?? 0;
  const totalN = rows?.reduce((a, r) => a + r.notions.length, 0) ?? 0;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ScopePicker subjects={subjects} tracks={tracks} subjectId={subjectId} setSubjectId={setSubjectId} trackId={trackId} setTrackId={setTrackId} />
        {rows && rows.length > 0 && (
          <button onClick={() => exportPack(rows.map((r) => r.ch), "tout")} disabled={!!exporting} className={btnGhost}>
            {exporting === "tout" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} Exporter la matière (JSON)
          </button>
        )}
      </div>

      {!subjectId ? <p className="mt-6 text-sm text-neutral-400">Choisis une matière.</p>
        : busy || !rows ? <div className="grid place-items-center h-32 text-neutral-400"><Loader2 className="w-5 h-5 animate-spin" /></div>
        : (
          <>
            <div className="mt-4 text-sm text-neutral-500">
              {rows.length} chapitres · {totalN} notions · <span className={empty ? "text-red-500 font-semibold" : "text-emerald-500 font-semibold"}>{empty} notion{empty > 1 ? "s" : ""} sans exercice</span>
            </div>
            <div className="mt-3 space-y-2.5">
              {rows.map((r) => (
                <details key={r.ch.id} className="glass rounded-2xl overflow-hidden" open={r.notions.some((n) => n.n === 0)}>
                  <summary className="cursor-pointer list-none px-4 py-3 flex items-center gap-3">
                    {r.total === 0 || r.notions.some((n) => n.n === 0) ? <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{r.ch.name}</div>
                      <div className="text-[11px] text-neutral-400">code : <code>{r.ch.code ?? "—"}</code> · {r.total} QCU · {r.series} série(s) · {r.ch.track_id ? tracks.find((t) => t.id === r.ch.track_id)?.code : "commun"}</div>
                    </div>
                    <button onClick={(e) => { e.preventDefault(); void exportPack([r.ch], r.ch.code || r.ch.id.slice(0, 8)); }} className="text-xs font-semibold text-arctic-blue dark:text-arctic-cyan inline-flex items-center gap-1">
                      {exporting === (r.ch.code || r.ch.id.slice(0, 8)) ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />} JSON
                    </button>
                  </summary>
                  <div className="px-4 pb-3 grid sm:grid-cols-2 gap-1.5">
                    {r.notions.length === 0 && <div className="text-xs text-neutral-400">Pas encore de cours pour ce chapitre.</div>}
                    {r.notions.map((n) => (
                      <div key={n.notion} title={n.extra ? "Tag qui ne correspond à aucun titre ## du cours — à renommer" : undefined}
                        className={`flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-xs ${n.n === 0 ? "bg-red-500/10 text-red-600 dark:text-red-400" : n.extra ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 italic" : "bg-black/[0.03] dark:bg-white/[0.04]"}`}>
                        <span className="truncate">{n.extra ? "⚠ " : ""}{notionLabel(n.notion)}</span><b className="tabular-nums">{n.n}</b>
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </>
        )}
    </div>
  );
}
