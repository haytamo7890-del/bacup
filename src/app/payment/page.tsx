"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { PROGRAMS, programForLevel, type ProgramCode } from "@/config";
import { BrandLockup } from "@/components/brand";
import {
  Loader2, Copy, Check, Upload, ShieldCheck, Clock, LogOut, CreditCard, RefreshCw, AlertCircle,
} from "lucide-react";

type Channel = { channel: string; label: string; holder: string | null; value: string | null; instructions: string | null; enabled: boolean; position: number };
type Req = { id: string; status: string; method: string; admin_note: string | null; created_at: string };

export default function PaymentPage() {
  const router = useRouter();
  const supabase = createBrowserSupabase();

  const [ready, setReady] = useState(false);
  const [program, setProgram] = useState<ProgramCode>("bac2");
  const [channels, setChannels] = useState<Channel[]>([]);
  const [request, setRequest] = useState<Req | null>(null);
  const [isBinome, setIsBinome] = useState(false);

  // Anonymous demo users must set real credentials before they can pay.
  const [needsCreds, setNeedsCreds] = useState(false);
  const [cEmail, setCEmail] = useState("");
  const [cPass, setCPass] = useState("");
  const [credErr, setCredErr] = useState("");
  const [linking, setLinking] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace("/login"); return; }
    setNeedsCreds(!!(user as { is_anonymous?: boolean }).is_anonymous || !user.email);

    const { data: profile } = await supabase.from("profiles").select("role, phone").eq("id", user.id).maybeSingle();
    if (profile?.role === "admin") { router.replace("/admin"); return; }
    if (profile?.phone) setPhone(profile.phone);

    const { data: sp } = await supabase
      .from("student_profiles")
      .select("level_id, track_id, status, levels(code)")
      .eq("id", user.id)
      .maybeSingle();
    if (!sp?.level_id || !sp?.track_id) { router.replace("/onboarding"); return; }
    if (sp.status === "active") { router.replace("/dashboard"); return; }
    setProgram(programForLevel((sp?.levels as unknown as { code: string } | null)?.code));

    const { data: pair } = await supabase.from("binome_pairs").select("id").eq("payer_id", user.id).maybeSingle();
    const paramBinome = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("formule") === "binome";
    setIsBinome(!!pair || paramBinome);

    const [{ data: ch }, { data: reqs }] = await Promise.all([
      supabase.from("payment_settings").select("*").eq("enabled", true).order("position"),
      supabase.from("payment_requests").select("id, status, method, admin_note, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1),
    ]);
    const list = (ch ?? []) as Channel[];
    setChannels(list);
    setMethod((m) => m || list[0]?.channel || "");
    setRequest((reqs?.[0] as Req) ?? null);
    setReady(true);
  }

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  // While waiting on verification, quietly re-check so the app unlocks itself.
  useEffect(() => {
    if (request?.status !== "pending") return;
    const t = setInterval(() => { load(); }, 20000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request?.status]);

  const selected = useMemo(() => channels.find((c) => c.channel === method) ?? null, [channels, method]);
  const price = isBinome ? 400 : PROGRAMS[program].price;

  async function copyValue() {
    if (!selected?.value) return;
    try { await navigator.clipboard.writeText(selected.value); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* ignore */ }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!file) { setError("Ajoute la capture de ton reçu."); return; }
    if (!fullName.trim()) { setError("Indique le nom complet de l'expéditeur."); return; }
    setSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace("/login"); return; }

    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/${Date.now()}.${ext}`;
    const up = await supabase.storage.from("receipts").upload(path, file, { upsert: false });
    if (up.error) { setError("Échec du téléversement : " + up.error.message); setSubmitting(false); return; }

    const { error: insErr } = await supabase.from("payment_requests").insert({
      user_id: user.id,
      program,
      amount_mad: price,
      method,
      full_name: fullName.trim(),
      phone: phone.trim() || null,
      receipt_path: path,
      status: "pending",
    });
    if (insErr) { setError(insErr.message); setSubmitting(false); return; }
    await load();
    setSubmitting(false);
  }

  async function linkCreds(e: React.FormEvent) {
    e.preventDefault();
    setCredErr("");
    if (cPass.length < 6) { setCredErr("Mot de passe : 6 caractères minimum."); return; }
    setLinking(true);
    const { error } = await supabase.auth.updateUser({ email: cEmail.trim().toLowerCase(), password: cPass });
    if (error) { setLinking(false); setCredErr(error.message.includes("registered") ? "Cet email a déjà un compte. Connecte-toi." : error.message); return; }
    setNeedsCreds(false);
    await load();
    setLinking(false);
  }

  async function logout() { await supabase.auth.signOut(); router.replace("/login"); }

  if (!ready) return <main className="min-h-screen grid place-items-center text-sm text-neutral-400"><Loader2 className="w-5 h-5 animate-spin" /></main>;

  // Anonymous demo → capture real credentials so their paid access persists.
  if (needsCreds) {
    return (
      <main className="min-h-screen grid place-items-center px-6 bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-[#0a0f16] dark:to-[#05080c] text-neutral-900 dark:text-neutral-100">
        <div className="w-full max-w-sm glass rounded-3xl p-8">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-arctic-cyan to-arctic-blue text-white grid place-items-center"><ShieldCheck className="w-5 h-5" /></div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight">Finalise ton compte</h1>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Tu es en mode démo. Crée tes identifiants pour garder ta progression et débloquer l&apos;accès complet.</p>
          <form onSubmit={linkCreds} className="mt-6 space-y-4">
            <input type="email" required value={cEmail} onChange={(e) => setCEmail(e.target.value)} placeholder="Ton email" className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent px-3.5 py-3 text-sm outline-none focus:border-arctic-blue" />
            <input type="password" required minLength={6} value={cPass} onChange={(e) => setCPass(e.target.value)} placeholder="Mot de passe (6+ caractères)" className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent px-3.5 py-3 text-sm outline-none focus:border-arctic-blue" />
            {credErr && <p className="text-sm text-red-600">{credErr}</p>}
            <button type="submit" disabled={linking} className="w-full rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white text-sm font-semibold py-3 hover:brightness-105 transition disabled:opacity-60 inline-flex items-center justify-center gap-2">
              {linking ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Continuer vers le paiement →
            </button>
          </form>
          <button onClick={logout} className="mt-4 w-full text-xs text-neutral-400 hover:text-neutral-600">Quitter la démo</button>
        </div>
      </main>
    );
  }

  const pending = request?.status === "pending";
  const rejected = request?.status === "rejected";

  return (
    <main className="min-h-screen px-6 py-12 bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-[#0a0f16] dark:to-[#05080c] text-neutral-900 dark:text-neutral-100">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <BrandLockup />
          <button onClick={logout} className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"><LogOut className="w-3.5 h-3.5" /> Déconnexion</button>
        </div>

        {/* PENDING — waiting for admin verification */}
        {pending ? (
          <div className="glass rounded-3xl p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/15 text-amber-500 grid place-items-center mx-auto"><Clock className="w-7 h-7" /></div>
            <h1 className="mt-4 text-2xl font-bold tracking-tight">Vérification en cours…</h1>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              On a bien reçu ton reçu. Ton compte sera activé sous <span className="font-semibold text-neutral-900 dark:text-white">10 à 15 minutes</span> après vérification du paiement.
            </p>
            <button onClick={load} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-5 py-2.5 hover:opacity-90 transition">
              <RefreshCw className="w-4 h-4" /> Vérifier mon activation
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-extrabold tracking-tight">Active ton accès Bac-up</h1>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              {isBinome
                ? "Pack Binôme — deux comptes activés d'un seul paiement (le tien et celui de ton binôme)."
                : `Accès complet à ${PROGRAMS[program].label} — annales, corrections, IA & examens blancs.`}
            </p>

            {/* price card */}
            <div className="mt-5 glass rounded-2xl p-5 flex items-center justify-between">
              <div>
                <div className="font-semibold tracking-tight">{isBinome ? "Pack Binôme · 2 comptes" : PROGRAMS[program].label}</div>
                <div className="text-xs text-neutral-400">{isBinome ? "200 DH chacun · un seul paiement" : "Accès annuel · activation manuelle"}</div>
              </div>
              <div className="text-2xl font-extrabold text-arctic-blue dark:text-arctic-cyan">{price} <span className="text-sm font-medium text-neutral-400">DH</span></div>
            </div>

            {rejected && (
              <div className="mt-4 rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-sm">
                <div className="flex items-center gap-1.5 font-semibold text-red-500"><AlertCircle className="w-4 h-4" /> Paiement refusé</div>
                {request?.admin_note && <p className="mt-1 text-neutral-600 dark:text-neutral-300">{request.admin_note}</p>}
                <p className="mt-1 text-neutral-500">Vérifie les infos et renvoie ton reçu ci-dessous.</p>
              </div>
            )}

            <form onSubmit={submit} className="mt-6 space-y-5">
              {/* method chips */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-neutral-400 mb-2">Méthode de paiement</div>
                <div className="flex flex-wrap gap-2">
                  {channels.map((c) => (
                    <button type="button" key={c.channel} onClick={() => setMethod(c.channel)}
                      className={`text-sm font-semibold px-4 py-2 rounded-full transition ${method === c.channel ? "bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white" : "chip text-neutral-500 dark:text-neutral-300"}`}>
                      {c.label}
                    </button>
                  ))}
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full chip text-neutral-400 opacity-70 cursor-not-allowed">
                    <CreditCard className="w-3.5 h-3.5" /> Carte / PayPal <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-neutral-400/20">Bientôt</span>
                  </span>
                </div>
              </div>

              {/* selected channel details */}
              {selected && (
                <div className="glass rounded-2xl p-5">
                  <div className="text-xs font-semibold text-arctic-blue dark:text-arctic-cyan">{selected.label}</div>
                  {selected.holder && <div className="mt-1 text-sm">Bénéficiaire : <span className="font-semibold">{selected.holder}</span></div>}
                  <div className="mt-2 flex items-center gap-2">
                    <code className="flex-1 text-sm font-mono bg-black/[0.05] dark:bg-white/[0.06] rounded-lg px-3 py-2 break-all">{selected.value}</code>
                    <button type="button" onClick={copyValue} className="shrink-0 w-9 h-9 rounded-lg bg-arctic-blue/10 text-arctic-blue dark:text-arctic-cyan grid place-items-center hover:bg-arctic-blue/20 transition">
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  {selected.instructions && <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">{selected.instructions}</p>}
                </div>
              )}

              {/* payer identity */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Nom complet de l&apos;expéditeur</label>
                  <input required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ex. Yassine El Amrani"
                    className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent px-3.5 py-3 text-sm outline-none focus:border-arctic-blue" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Téléphone</label>
                  <input inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="06 12 34 56 78"
                    className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent px-3.5 py-3 text-sm outline-none focus:border-arctic-blue" />
                </div>
              </div>

              {/* receipt upload */}
              <div>
                <label className="block text-sm font-semibold mb-1.5">Capture du reçu</label>
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="w-full rounded-2xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 px-4 py-6 text-center hover:border-arctic-blue/60 transition">
                  <Upload className="w-6 h-6 mx-auto text-neutral-400" />
                  <div className="mt-2 text-sm font-medium">{file ? file.name : "Téléverser une image du reçu"}</div>
                  <div className="text-xs text-neutral-400">JPG ou PNG</div>
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button type="submit" disabled={submitting}
                className="w-full rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white text-sm font-semibold py-3.5 hover:brightness-105 transition disabled:opacity-60 inline-flex items-center justify-center gap-2">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                {submitting ? "Envoi…" : "J'ai payé — envoyer mon reçu"}
              </button>
              <p className="text-center text-xs text-neutral-400 flex items-center justify-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Activation sous 10–15 min après vérification.
              </p>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
