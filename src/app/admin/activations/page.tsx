"use client";

import { useCallback, useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { Loader2, Check, X, Eye, Phone, User, Clock } from "lucide-react";

type Pair = { partner_name: string | null; partner_email: string | null; partner_level: string | null; partner_track: string | null };
type Req = {
  id: string; user_id: string; program: string; amount_mad: number; method: string;
  full_name: string; phone: string | null; receipt_path: string | null; status: string;
  admin_note: string | null; created_at: string;
  pseudo?: string | null; binome?: Pair | null;
};

const FILTERS = ["pending", "approved", "rejected", "all"] as const;
const F_LABEL: Record<string, string> = { pending: "En attente", approved: "Approuvés", rejected: "Refusés", all: "Tous" };

export default function ActivationsPage() {
  const supabase = createBrowserSupabase();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("pending");
  const [rows, setRows] = useState<Req[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [receipt, setReceipt] = useState<{ url: string; isPdf: boolean } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    // Query flat (no join) so a stale relationship cache can't blank the list.
    let q = supabase
      .from("payment_requests")
      .select("id, user_id, program, amount_mad, method, full_name, phone, receipt_path, status, admin_note, created_at")
      .order("created_at", { ascending: false });
    if (filter !== "all") q = q.eq("status", filter);
    const { data, error } = await q;
    if (error) { setErr(error.message); setRows([]); setLoading(false); return; }

    const list = (data ?? []) as Req[];
    // Fetch pseudos in a second, separate query.
    const ids = Array.from(new Set(list.map((r) => r.user_id)));
    const map = new Map<string, string | null>();
    const pairMap = new Map<string, Pair>();
    if (ids.length) {
      const [{ data: profs }, { data: pairs }] = await Promise.all([
        supabase.from("profiles").select("id, display_name").in("id", ids),
        supabase.from("binome_pairs").select("payer_id, partner_name, partner_email, partner_level, partner_track").in("payer_id", ids),
      ]);
      for (const p of (profs ?? []) as { id: string; display_name: string | null }[]) map.set(p.id, p.display_name);
      for (const p of (pairs ?? []) as (Pair & { payer_id: string })[]) pairMap.set(p.payer_id, p);
    }
    setRows(list.map((r) => ({ ...r, pseudo: map.get(r.user_id) ?? null, binome: pairMap.get(r.user_id) ?? null })));
    setLoading(false);
  }, [filter, supabase]);

  useEffect(() => { load(); }, [load]);

  async function viewReceipt(r: Req) {
    if (!r.receipt_path) { alert("Aucun reçu joint à ce paiement."); return; }
    setBusy("view:" + r.id);
    const { data, error } = await supabase.storage.from("receipts").createSignedUrl(r.receipt_path, 600);
    setBusy(null);
    if (error || !data?.signedUrl) {
      alert("Impossible d'ouvrir le reçu : " + (error?.message ?? "accès refusé.") +
        "\n\nVérifie que les migrations 0006 + 0007 sont appliquées et que ton compte a le rôle 'admin'.");
      return;
    }
    setReceipt({ url: data.signedUrl, isPdf: r.receipt_path.toLowerCase().endsWith(".pdf") });
  }

  async function approve(id: string) {
    setBusy(id);
    const { error } = await supabase.rpc("approve_payment", { p_id: id });
    if (error) alert("Erreur lors de l'activation : " + error.message);
    await load();
    setBusy(null);
  }

  async function reject(id: string) {
    const note = window.prompt("Motif du refus (visible par l'étudiant) :", "Reçu illisible ou montant incorrect.");
    if (note === null) return;
    setBusy(id);
    const { error } = await supabase.rpc("reject_payment", { p_id: id, p_note: note });
    if (error) alert("Erreur : " + error.message);
    await load();
    setBusy(null);
  }

  return (
    <div className="max-w-4xl fade-up">
      <h1 className="text-3xl font-bold tracking-tight">Activations</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Vérifie les reçus et active les comptes.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-sm font-semibold px-4 py-2 rounded-full transition ${filter === f ? "bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white" : "chip text-neutral-500 dark:text-neutral-300"}`}>
            {F_LABEL[f]}
          </button>
        ))}
      </div>

      {err && (
        <div className="mt-5 rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-sm">
          <div className="font-semibold text-red-500">Impossible de charger les paiements</div>
          <p className="mt-1 text-neutral-600 dark:text-neutral-300 break-words">{err}</p>
          <p className="mt-1 text-neutral-500">Vérifie que les migrations 0006 + 0007 sont appliquées et que ton compte a le rôle « admin ».</p>
        </div>
      )}

      {loading ? (
        <div className="grid place-items-center h-40 text-neutral-400"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : rows.length === 0 ? (
        <div className="mt-6 glass rounded-2xl p-10 text-center text-sm text-neutral-400">Rien ici pour l&apos;instant.</div>
      ) : (
        <div className="mt-5 space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="glass rounded-2xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 font-semibold tracking-tight">
                    <User className="w-4 h-4 text-neutral-400" /> {r.full_name}
                    <span className="text-xs font-normal text-neutral-400">· @{r.pseudo ?? "—"}</span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="px-2 py-0.5 rounded-full bg-arctic-blue/10 text-arctic-blue dark:text-arctic-cyan uppercase font-semibold">{r.program}</span>
                    <span className="px-2 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-neutral-500">{r.method}</span>
                    <span className="px-2 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-neutral-500">{r.amount_mad} DH</span>
                    {(r.binome || r.amount_mad >= 400) && <span className="px-2 py-0.5 rounded-full bg-arctic-blue/15 text-arctic-blue dark:text-arctic-cyan font-semibold">Binôme · 2 comptes</span>}
                    {r.phone && <span className="inline-flex items-center gap-1 text-neutral-400"><Phone className="w-3 h-3" /> {r.phone}</span>}
                    <span className="inline-flex items-center gap-1 text-neutral-400"><Clock className="w-3 h-3" /> {new Date(r.created_at).toLocaleString("fr-FR")}</span>
                  </div>
                  {r.binome && (
                    <div className="mt-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                      + Binôme : <b>{r.binome.partner_name ?? "—"}</b> ({r.binome.partner_email}) · {r.binome.partner_level ?? "?"} / {r.binome.partner_track ?? "?"} — activé automatiquement à l&apos;approbation.
                    </div>
                  )}
                  {r.status !== "pending" && (
                    <div className={`mt-2 text-xs font-semibold ${r.status === "approved" ? "text-emerald-500" : "text-red-500"}`}>
                      {r.status === "approved" ? "✓ Approuvé" : "✗ Refusé"}{r.admin_note ? ` — ${r.admin_note}` : ""}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {r.receipt_path && (
                    <button disabled={busy === "view:" + r.id} onClick={() => viewReceipt(r)} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full chip hover:-translate-y-0.5 transition disabled:opacity-50">
                      {busy === "view:" + r.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />} Reçu
                    </button>
                  )}
                  {r.status === "pending" && (
                    <>
                      <button disabled={busy === r.id} onClick={() => reject(r.id)} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition disabled:opacity-50"><X className="w-3.5 h-3.5" /> Refuser</button>
                      <button disabled={busy === r.id} onClick={() => approve(r.id)} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-500 transition disabled:opacity-50">
                        {busy === r.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} Activer
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* receipt lightbox */}
      {receipt && (
        <div className="fixed inset-0 z-50 bg-black/75 grid place-items-center p-6" onClick={() => setReceipt(null)}>
          <div className="max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            {receipt.isPdf ? (
              <iframe src={receipt.url} title="Reçu" className="w-full h-[75vh] rounded-2xl bg-white shadow-2xl" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={receipt.url} alt="Reçu" className="w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl bg-white" />
            )}
            <div className="mt-3 flex items-center justify-center gap-4">
              <a href={receipt.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-white/90 hover:text-white underline">Ouvrir dans un nouvel onglet</a>
              <button onClick={() => setReceipt(null)} className="text-sm font-semibold text-white/70 hover:text-white">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
