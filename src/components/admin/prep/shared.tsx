"use client";

import { useEffect, useMemo, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { useAdminLevel } from "@/lib/admin-level";

export type Ref = { id: string; code: string; name: string };

export const sel = "rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:border-arctic-blue";
export const input = "w-full " + sel;
export const btn = "inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full transition disabled:opacity-50";
export const btnPrimary = btn + " bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white hover:brightness-105";
export const btnGhost = btn + " glass hover:-translate-y-0.5";

/** Levels / filières / matières + the admin's current niveau (header switch). */
export function useAdminRefs() {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const { niveau } = useAdminLevel();
  const [levels, setLevels] = useState<Ref[]>([]);
  const [tracks, setTracks] = useState<Ref[]>([]);
  const [subjects, setSubjects] = useState<Ref[]>([]);
  useEffect(() => {
    (async () => {
      const [{ data: lv }, { data: tr }, { data: su }] = await Promise.all([
        supabase.from("levels").select("id, code, name"),
        supabase.from("tracks").select("id, code, name").order("name"),
        supabase.from("subjects").select("id, code, name").order("name"),
      ]);
      setLevels((lv ?? []) as Ref[]); setTracks((tr ?? []) as Ref[]); setSubjects((su ?? []) as Ref[]);
    })();
  }, [supabase]);
  const level = levels.find((l) => l.code === niveau) ?? null;
  return { supabase, niveau, level, levels, tracks, subjects };
}

/** Subject + filière pickers used by the Séries and Couverture tabs. */
export function ScopePicker({ subjects, tracks, subjectId, setSubjectId, trackId, setTrackId }: {
  subjects: Ref[]; tracks: Ref[]; subjectId: string; setSubjectId: (v: string) => void; trackId: string; setTrackId: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <select className={sel} value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
        <option value="">— Matière —</option>
        {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>
      <select className={sel} value={trackId} onChange={(e) => setTrackId(e.target.value)} title="Filière (les chapitres communs sont toujours inclus)">
        <option value="">Toutes filières (communs)</option>
        {tracks.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>
    </div>
  );
}

export function Msg({ m }: { m: { ok: boolean; text: string } | null }) {
  if (!m) return null;
  return <div className={`mt-3 rounded-xl px-4 py-2.5 text-sm ${m.ok ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-500/10 text-red-500"}`}>{m.text}</div>;
}
