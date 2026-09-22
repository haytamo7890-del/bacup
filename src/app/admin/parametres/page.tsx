"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { Loader2, Check } from "lucide-react";

type Channel = { channel: string; label: string; holder: string | null; value: string | null; instructions: string | null; enabled: boolean; position: number };

export default function PaymentSettingsPage() {
  const supabase = createBrowserSupabase();
  const [rows, setRows] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("payment_settings").select("*").order("position");
      setRows((data ?? []) as Channel[]);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function edit(channel: string, patch: Partial<Channel>) {
    setRows((rs) => rs.map((r) => (r.channel === channel ? { ...r, ...patch } : r)));
  }

  async function save(c: Channel) {
    setBusy(c.channel);
    await supabase.from("payment_settings").update({
      label: c.label, holder: c.holder, value: c.value, instructions: c.instructions, enabled: c.enabled, updated_at: new Date().toISOString(),
    }).eq("channel", c.channel);
    setBusy(null);
    setSaved(c.channel);
    setTimeout(() => setSaved(null), 1500);
  }

  const input = "w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-arctic-blue";
  const lbl = "block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1";

  if (loading) return <div className="grid place-items-center h-40 text-neutral-400"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div className="max-w-2xl fade-up">
      <h1 className="text-3xl font-bold tracking-tight">Paiement</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Ces infos s&apos;affichent sur la page de paiement des étudiants.</p>

      <div className="mt-6 space-y-4">
        {rows.map((c) => (
          <div key={c.channel} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div className="font-semibold tracking-tight">{c.label}</div>
              <label className="inline-flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input type="checkbox" checked={c.enabled} onChange={(e) => edit(c.channel, { enabled: e.target.checked })} className="accent-arctic-blue" />
                {c.enabled ? "Actif" : "Masqué"}
              </label>
            </div>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              <div>
                <label className={lbl}>Bénéficiaire</label>
                <input className={input} value={c.holder ?? ""} onChange={(e) => edit(c.channel, { holder: e.target.value })} placeholder="Nom du titulaire" />
              </div>
              <div>
                <label className={lbl}>RIB / Numéro</label>
                <input className={input} value={c.value ?? ""} onChange={(e) => edit(c.channel, { value: e.target.value })} placeholder="RIB ou numéro" />
              </div>
            </div>
            <div className="mt-3">
              <label className={lbl}>Instructions</label>
              <textarea className={input} rows={2} value={c.instructions ?? ""} onChange={(e) => edit(c.channel, { instructions: e.target.value })} />
            </div>
            <div className="mt-3 flex justify-end">
              <button onClick={() => save(c)} disabled={busy === c.channel} className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition disabled:opacity-50">
                {busy === c.channel ? <Loader2 className="w-4 h-4 animate-spin" /> : saved === c.channel ? <Check className="w-4 h-4" /> : null}
                {saved === c.channel ? "Enregistré" : "Enregistrer"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
