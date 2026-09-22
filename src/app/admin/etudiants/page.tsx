"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { Loader2, Search, Ban, Check, ShieldCheck, ShieldOff } from "lucide-react";

type Student = {
  id: string; status: string; program: string | null; activated_at: string | null;
  levels: { name: string } | null; tracks: { name: string } | null;
  pseudo?: string | null; phone?: string | null; role?: string;
};

const STATUS_STYLE: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-500",
  demo: "bg-arctic-blue/15 text-arctic-blue dark:text-arctic-cyan",
  pending: "bg-amber-400/15 text-amber-500",
  suspended: "bg-red-500/15 text-red-500",
};

export default function StudentsPage() {
  const supabase = createBrowserSupabase();
  const [rows, setRows] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    const { data, error } = await supabase
      .from("student_profiles")
      .select("id, status, program, activated_at, levels(name), tracks(name)")
      .order("status");
    if (error) { setErr(error.message); setRows([]); setLoading(false); return; }

    const list = (data ?? []) as unknown as Student[];
    const ids = list.map((r) => r.id);
    const map = new Map<string, { display_name: string | null; phone: string | null; role: string | null }>();
    if (ids.length) {
      const { data: profs } = await supabase.from("profiles").select("id, display_name, phone, role").in("id", ids);
      for (const p of (profs ?? []) as { id: string; display_name: string | null; phone: string | null; role: string | null }[]) map.set(p.id, p);
    }
    setRows(list.map((r) => ({ ...r, pseudo: map.get(r.id)?.display_name ?? null, phone: map.get(r.id)?.phone ?? null, role: map.get(r.id)?.role ?? "student" })));
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  async function setStatus(id: string, status: string) {
    setBusy(id);
    await supabase.rpc("set_account_status", { p_user: id, p_status: status });
    await load();
    setBusy(null);
  }

  async function setRole(id: string, role: string) {
    setBusy(id);
    const { error } = await supabase.rpc("set_user_role", { p_user: id, p_role: role });
    if (error) alert("Erreur : " + error.message);
    await load();
    setBusy(null);
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      (r.pseudo ?? "").toLowerCase().includes(q) ||
      (r.phone ?? "").includes(q));
  }, [rows, query]);

  return (
    <div className="max-w-4xl fade-up">
      <h1 className="text-3xl font-bold tracking-tight">Étudiants</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{rows.length} compte(s). Active, suspends ou réactive.</p>

      <div className="mt-6 relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Chercher un pseudo ou téléphone…"
          className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent pl-10 pr-3.5 py-3 text-sm outline-none focus:border-arctic-blue" />
      </div>

      {err && (
        <div className="mt-5 rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-sm">
          <div className="font-semibold text-red-500">Impossible de charger les étudiants</div>
          <p className="mt-1 text-neutral-600 dark:text-neutral-300 break-words">{err}</p>
        </div>
      )}
      {loading ? (
        <div className="grid place-items-center h-40 text-neutral-400"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : (
        <div className="mt-5 space-y-2.5">
          {filtered.map((r) => (
            <div key={r.id} className="glass rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-semibold tracking-tight">@{r.pseudo ?? "—"}</div>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-neutral-400">
                  <span className={`px-2 py-0.5 rounded-full font-semibold ${STATUS_STYLE[r.status] ?? ""}`}>{r.status}</span>
                  {r.role === "admin" && <span className="px-2 py-0.5 rounded-full font-semibold bg-arctic-blue/15 text-arctic-blue dark:text-arctic-cyan inline-flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> admin</span>}
                  {r.tracks?.name && <span>{r.tracks.name}</span>}
                  {r.levels?.name && <span>· {r.levels.name}</span>}
                  {r.phone && <span>· {r.phone}</span>}
                  {r.program && <span>· {r.program}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {r.role === "admin" ? (
                  <button disabled={busy === r.id} onClick={() => setRole(r.id, "student")} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full chip text-neutral-500 hover:-translate-y-0.5 transition disabled:opacity-50"><ShieldOff className="w-3.5 h-3.5" /> Retirer admin</button>
                ) : (
                  <button disabled={busy === r.id} onClick={() => { if (confirm("Passer ce compte en admin ? Il aura accès à tout le back-office.")) setRole(r.id, "admin"); }} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full bg-arctic-blue/10 text-arctic-blue dark:text-arctic-cyan hover:bg-arctic-blue/20 transition disabled:opacity-50"><ShieldCheck className="w-3.5 h-3.5" /> Passer admin</button>
                )}
                {r.status === "active" ? (
                  <button disabled={busy === r.id} onClick={() => setStatus(r.id, "suspended")} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition disabled:opacity-50"><Ban className="w-3.5 h-3.5" /> Suspendre</button>
                ) : (
                  <button disabled={busy === r.id} onClick={() => setStatus(r.id, "active")} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-500 transition disabled:opacity-50">
                    {busy === r.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} Activer
                  </button>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="glass rounded-2xl p-8 text-center text-sm text-neutral-400">Aucun résultat.</div>}
        </div>
      )}
    </div>
  );
}
