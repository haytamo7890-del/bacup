"use client";

/**
 * Student goal pill (top bar): "17/20 · Médecine", from the onboarding quiz
 * (student_profiles.target_note / ambition). Click → small panel with the gap
 * to the estimated grade (shown after MIN_ATTEMPTS answers) and in-place editing.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { X, Loader2 } from "lucide-react";
import { BrandLogo } from "@/components/brand";

const MIN_ATTEMPTS = 20;
const NOTES = [12, 13, 14, 15, 16, 17, 18, 19, 20];
const AMBITIONS = ["Médecine", "Ingénierie", "Business", "Autre"];
const fr = (n: number) => n.toLocaleString("fr-FR", { maximumFractionDigits: 1 });

export function GoalPill() {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [target, setTarget] = useState<number | null>(null);
  const [ambition, setAmbition] = useState<string | null>(null);
  const [estimate, setEstimate] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draftT, setDraftT] = useState<number | null>(null);
  const [draftA, setDraftA] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let live = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !live) return;
      const [{ data: sp }, { data: st }, { count }] = await Promise.all([
        supabase.from("student_profiles").select("target_note, ambition").eq("id", user.id).maybeSingle(),
        supabase.rpc("my_stats"),
        supabase.from("attempts").select("id", { count: "exact", head: true }),
      ]);
      if (!live) return;
      setUserId(user.id);
      const p = sp as { target_note: number | null; ambition: string | null } | null;
      setTarget(p?.target_note != null ? Number(p.target_note) : null);
      setAmbition(p?.ambition ?? null);
      const ne = (st as { note_estimee?: number | null } | null)?.note_estimee;
      setEstimate(ne != null ? Number(ne) : null);
      setAttempts(count ?? 0);
      setReady(true);
    })();
    return () => { live = false; };
  }, [supabase]);

  // close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  if (!ready) return null;

  const openPanel = () => {
    setOpen((o) => !o);
    setEditing(target == null);
    setDraftT(target ?? 15);
    setDraftA(ambition);
  };

  async function save() {
    if (!userId || draftT == null) return;
    setSaving(true);
    const { error } = await supabase.from("student_profiles").update({ target_note: draftT, ambition: draftA }).eq("id", userId);
    setSaving(false);
    if (error) return;
    setTarget(draftT); setAmbition(draftA); setEditing(false);
  }

  const showGap = target != null && estimate != null && attempts >= MIN_ATTEMPTS;
  const gap = showGap ? Math.max(0, target! - estimate!) : 0;
  const ambitionLabel = ambition && ambition !== "Autre" ? ambition : null;

  return (
    <div ref={box} className="relative">
      <button type="button" onClick={openPanel} aria-expanded={open} aria-haspopup="dialog"
        className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/10 transition">
        <BrandLogo size={18} className="shrink-0" />
        {target != null ? (
          <span className="goal-shine tabular-nums whitespace-nowrap">
            {fr(target)}/20{ambitionLabel && <span className="hidden 2xl:inline"> · {ambitionLabel}</span>}
          </span>
        ) : (
          <span className="goal-shine whitespace-nowrap">Fixe ton objectif</span>
        )}
      </button>

      {open && (
        <div role="dialog" aria-label="Mon objectif" className="absolute left-1/2 -translate-x-1/2 top-11 z-50 w-72 glass rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Mon objectif au BAC</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Fermer" className="w-7 h-7 grid place-items-center rounded-full text-neutral-400 hover:bg-black/5 dark:hover:bg-white/10"><X className="w-4 h-4" /></button>
          </div>

          {!editing && target != null && (
            <>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-bold tabular-nums tracking-tight">{fr(target)}<span className="text-base text-neutral-400">/20</span></span>
                {ambitionLabel && <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{ambitionLabel}</span>}
              </div>

              {showGap ? (
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-neutral-500 dark:text-neutral-400">Note estimée <b className="text-neutral-800 dark:text-neutral-100 tabular-nums">{fr(estimate!)}</b></span>
                    <span className="font-semibold tabular-nums text-arctic-blue dark:text-arctic-cyan">{gap > 0 ? `encore +${fr(gap)}` : "Objectif atteint"}</span>
                  </div>
                  <div className="h-2 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue transition-all duration-700" style={{ width: `${Math.min(100, (estimate! / target) * 100)}%` }} />
                  </div>
                </div>
              ) : (
                <div className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
                  Réponds à {MIN_ATTEMPTS} questions pour voir l&apos;écart avec ta note estimée.
                  <div className="mt-1.5 h-1.5 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden">
                    <div className="h-full rounded-full bg-arctic-blue/60" style={{ width: `${Math.min(100, (attempts / MIN_ATTEMPTS) * 100)}%` }} />
                  </div>
                  <div className="mt-1 tabular-nums">{Math.min(attempts, MIN_ATTEMPTS)}/{MIN_ATTEMPTS}</div>
                </div>
              )}

              <button type="button" onClick={() => setEditing(true)} className="mt-4 text-xs font-semibold text-arctic-blue dark:text-arctic-cyan hover:underline">Modifier mon objectif</button>
            </>
          )}

          {editing && (
            <div className="mt-2">
              <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Note visée</div>
              <div className="grid grid-cols-5 gap-1.5">
                {NOTES.map((n) => (
                  <button key={n} type="button" onClick={() => setDraftT(n)}
                    className={`h-8 rounded-lg text-sm font-semibold tabular-nums transition ${draftT === n ? "bg-gradient-to-br from-arctic-cyan to-arctic-blue text-white" : "chip"}`}>{n}</button>
                ))}
              </div>
              <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mt-3 mb-1.5">Ton projet</div>
              <div className="flex flex-wrap gap-1.5">
                {AMBITIONS.map((a) => (
                  <button key={a} type="button" onClick={() => setDraftA(a)}
                    className={`px-3 h-8 rounded-full text-xs font-semibold transition ${draftA === a ? "bg-gradient-to-br from-arctic-cyan to-arctic-blue text-white" : "chip"}`}>{a === "Autre" ? "En réflexion" : a}</button>
                ))}
              </div>
              <div className="mt-4 flex justify-end gap-2">
                {target != null && <button type="button" onClick={() => setEditing(false)} className="px-3 h-8 rounded-full text-xs font-semibold chip">Annuler</button>}
                <button type="button" onClick={save} disabled={saving || draftT == null}
                  className="inline-flex items-center gap-1.5 px-4 h-8 rounded-full text-xs font-semibold bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white disabled:opacity-60">
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Enregistrer
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
