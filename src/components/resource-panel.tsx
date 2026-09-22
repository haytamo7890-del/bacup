"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { Upload, FileText, Trash2, Loader2, ExternalLink, Paperclip } from "lucide-react";

export type Scope = "subject" | "chapter" | "exam";
type Res = { id: string; name: string; storage_path: string; size_bytes: number };

const fmt = (b: number) => (b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} Ko` : `${(b / 1024 / 1024).toFixed(1)} Mo`);
const MAX = 25 * 1024 * 1024;

function useResources(scope: Scope, scopeKey: string) {
  const supabase = createBrowserSupabase();
  const [items, setItems] = useState<Res[]>([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    if (!scopeKey) { setItems([]); setLoading(false); return; }
    const { data } = await supabase
      .from("resources")
      .select("id, name, storage_path, size_bytes")
      .eq("scope", scope)
      .eq("scope_key", scopeKey)
      .order("created_at", { ascending: false });
    setItems((data ?? []) as Res[]);
    setLoading(false);
  }, [scope, scopeKey, supabase]);
  useEffect(() => { load(); }, [load]);
  const openUrl = (path: string) => supabase.storage.from("resources").getPublicUrl(path).data.publicUrl;
  return { supabase, items, setItems, loading, load, openUrl };
}

/** Admin: upload + list + delete resources for a subject/chapter/exam. */
export function ResourcePanel({ scope, scopeKey }: { scope: Scope; scopeKey: string }) {
  const { supabase, items, setItems, loading, load, openUrl } = useResources(scope, scopeKey);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  async function upload(file: File | null) {
    setErr("");
    if (!file) return;
    const ok = file.type === "application/pdf" || file.type.startsWith("image/");
    if (!ok) { setErr("PDF ou image uniquement."); return; }
    if (file.size > MAX) { setErr("Fichier trop lourd (max 25 Mo)."); return; }
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    const ext = file.name.split(".").pop() || "pdf";
    const path = `${scope}/${scopeKey}/${crypto.randomUUID()}.${ext}`;
    const up = await supabase.storage.from("resources").upload(path, file, { contentType: file.type });
    if (up.error) { setErr("Échec du téléversement : " + up.error.message); setBusy(false); return; }
    const { error } = await supabase.from("resources").insert({
      scope, scope_key: scopeKey, name: file.name, storage_path: path, size_bytes: file.size, created_by: user?.id ?? null,
    });
    if (error) { await supabase.storage.from("resources").remove([path]); setErr(error.message); setBusy(false); return; }
    setBusy(false);
    if (fileRef.current) fileRef.current.value = "";
    load();
  }

  async function del(r: Res) {
    if (!confirm("Supprimer cette ressource ?")) return;
    await supabase.storage.from("resources").remove([r.storage_path]);
    await supabase.from("resources").delete().eq("id", r.id);
    setItems((xs) => xs.filter((x) => x.id !== r.id));
  }

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div className="text-sm font-bold tracking-tight inline-flex items-center gap-2"><Paperclip className="w-4 h-4 text-arctic-blue dark:text-arctic-cyan" /> Ressources (PDF / image)</div>
        <button onClick={() => fileRef.current?.click()} disabled={busy} className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white hover:brightness-105 transition disabled:opacity-60">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Téléverser
        </button>
        <input ref={fileRef} type="file" accept="application/pdf,image/*" className="hidden" onChange={(e) => upload(e.target.files?.[0] ?? null)} />
      </div>
      {err && <p className="mt-2 text-sm text-red-500">{err}</p>}

      <div className="mt-3 space-y-2">
        {loading ? (
          <div className="grid place-items-center h-16 text-neutral-400"><Loader2 className="w-5 h-5 animate-spin" /></div>
        ) : items.length === 0 ? (
          <p className="text-sm text-neutral-400">Aucune ressource. Téléverse un sujet, un corrigé ou une fiche.</p>
        ) : (
          items.map((r) => (
            <div key={r.id} className="flex items-center gap-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] px-3 py-2.5">
              <span className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 grid place-items-center shrink-0"><FileText className="w-4 h-4" /></span>
              <a href={openUrl(r.storage_path)} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-0 text-sm font-medium truncate hover:text-arctic-blue dark:hover:text-arctic-cyan">{r.name}</a>
              <span className="text-[11px] text-neutral-400 shrink-0">{fmt(r.size_bytes)}</span>
              <a href={openUrl(r.storage_path)} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg text-neutral-400 hover:text-arctic-blue grid place-items-center"><ExternalLink className="w-4 h-4" /></a>
              <button onClick={() => del(r)} className="w-8 h-8 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-500/10 grid place-items-center transition"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/** Student: read-only list of resources for a chapter/exam. Renders nothing if empty. */
export function ResourceList({ scope, scopeKey, title = "Ressources" }: { scope: Scope; scopeKey: string; title?: string }) {
  const { items, loading, openUrl } = useResources(scope, scopeKey);
  if (loading || items.length === 0) return null;
  return (
    <div className="mt-5 glass rounded-3xl p-5">
      <div className="text-xs font-bold uppercase tracking-wide text-neutral-400 mb-3 inline-flex items-center gap-1.5"><Paperclip className="w-3.5 h-3.5" /> {title}</div>
      <div className="space-y-2">
        {items.map((r) => (
          <a key={r.id} href={openUrl(r.storage_path)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] px-3 py-2.5 hover:-translate-y-0.5 transition">
            <span className="w-8 h-8 rounded-lg bg-arctic-blue/10 text-arctic-blue dark:text-arctic-cyan grid place-items-center shrink-0"><FileText className="w-4 h-4" /></span>
            <span className="flex-1 min-w-0 text-sm font-medium truncate">{r.name}</span>
            <span className="text-[11px] text-neutral-400 shrink-0">{fmt(r.size_bytes)}</span>
            <ExternalLink className="w-4 h-4 text-neutral-400 shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
}
