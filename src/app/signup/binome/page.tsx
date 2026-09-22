"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { SelectMenu } from "@/components/ui/select-menu";
import { FILIERE_SET } from "@/config/curriculum";
import { BrandLockup } from "@/components/brand";
import { Users, ArrowRight, Loader2, Check } from "lucide-react";

type Row = { id: string; code: string; name: string };
type Niveau = "1bac" | "2bac";

export default function BinomeSignupPage() {
  const router = useRouter();
  const supabase = createBrowserSupabase();

  const [levels, setLevels] = useState<Row[]>([]);
  const [tracks, setTracks] = useState<Row[]>([]);
  const [ready, setReady] = useState(false);

  // Toi (payer)
  const [aName, setAName] = useState("");
  const [aEmail, setAEmail] = useState("");
  const [aPhone, setAPhone] = useState("");
  const [aPass, setAPass] = useState("");
  const [aNiveau, setANiveau] = useState<Niveau>("2bac");
  const [aTrack, setATrack] = useState("");

  // Ton binôme (partner)
  const [bName, setBName] = useState("");
  const [bEmail, setBEmail] = useState("");
  const [bNiveau, setBNiveau] = useState<Niveau>("2bac");
  const [bTrack, setBTrack] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    (async () => {
      const [{ data: lv }, { data: tr }] = await Promise.all([
        supabase.from("levels").select("id, code, name").order("position"),
        supabase.from("tracks").select("id, code, name").order("name"),
      ]);
      setLevels((lv ?? []) as Row[]);
      setTracks(((tr ?? []) as Row[]).filter((t) => FILIERE_SET.has(t.code)));
      setReady(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const levelId = (code: Niveau) => levels.find((l) => l.code === code)?.id ?? null;
  const trackOpts = tracks.map((t) => ({ value: t.id, label: t.name }));
  const codeOf = (id: string) => tracks.find((t) => t.id === id)?.code ?? null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!aName.trim() || !aEmail.trim() || aPass.length < 6 || !aTrack) return setError("Complète tes infos (mot de passe 6+ caractères, filière).");
    if (!bName.trim() || !bEmail.trim() || !bTrack) return setError("Complète les infos de ton binôme.");
    if (aEmail.trim().toLowerCase() === bEmail.trim().toLowerCase()) return setError("Les deux emails doivent être différents.");
    setSaving(true);

    const { data, error: sErr } = await supabase.auth.signUp({
      email: aEmail.trim().toLowerCase(),
      password: aPass,
      options: { data: { display_name: aName.trim(), phone: aPhone.trim() } },
    });
    if (sErr) { setSaving(false); return setError(sErr.message.includes("already") ? "Un compte existe déjà avec ton email. Connecte-toi." : sErr.message); }
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      setSaving(false); return setError("Un compte existe déjà avec ton email. Connecte-toi.");
    }
    if (!data.session || !data.user) { setSaving(false); setSent(true); return; } // email confirmation on

    const uid = data.user.id;
    await supabase.from("profiles").upsert({ id: uid, role: "student", display_name: aName.trim(), phone: aPhone.trim() });
    await supabase.from("student_profiles").upsert({
      id: uid,
      level_id: levelId(aNiveau),
      track_id: aTrack,
      quiz_done: true,
      binome_role: "payer",
      binome_partner_email: bEmail.trim().toLowerCase(),
    });
    await supabase.from("binome_pairs").insert({
      payer_id: uid,
      payer_email: aEmail.trim().toLowerCase(),
      payer_level: aNiveau,
      payer_track: codeOf(aTrack),
      partner_name: bName.trim(),
      partner_email: bEmail.trim().toLowerCase(),
      partner_level: bNiveau,
      partner_track: codeOf(bTrack),
      paid: false,
    });
    router.push("/payment?formule=binome");
  }

  const input = "w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-arctic-blue";
  const lbl = "block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1";

  if (sent) {
    return (
      <main className="min-h-screen grid place-items-center bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 px-6">
        <div className="max-w-sm text-center">
          <Check className="w-10 h-10 mx-auto text-emerald-500" />
          <h1 className="mt-3 text-2xl font-extrabold">Vérifie ton email</h1>
          <p className="mt-2 text-sm text-neutral-500">Confirme ton compte, connecte-toi, puis finalise le paiement binôme.</p>
          <Link href="/login" className="mt-5 inline-block rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-6 py-3 text-sm font-semibold">Se connecter</Link>
        </div>
      </main>
    );
  }

  if (!ready) return <main className="min-h-screen grid place-items-center text-sm text-neutral-400">Chargement…</main>;

  const NiveauToggle = ({ v, set }: { v: Niveau; set: (n: Niveau) => void }) => (
    <div className="inline-flex gap-1 bg-black/[0.04] dark:bg-white/[0.06] p-1 rounded-xl">
      {(["1bac", "2bac"] as Niveau[]).map((n) => (
        <button key={n} type="button" onClick={() => set(n)} className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${v === n ? "bg-white dark:bg-neutral-800 text-arctic-blue dark:text-arctic-cyan shadow-sm" : "text-neutral-500"}`}>{n}-up</button>
      ))}
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-[#0a0f16] dark:to-[#05080c] text-neutral-900 dark:text-neutral-100 px-6 py-14">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex mb-6"><BrandLockup /></Link>

        <div className="inline-flex items-center gap-2 text-xs font-bold text-arctic-blue dark:text-arctic-cyan bg-arctic-cyan/10 border border-arctic-cyan/20 px-3 py-1.5 rounded-full"><Users className="w-4 h-4" /> Pack Binôme · 200 DH chacun</div>
        <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight">Le BAC se prépare à deux.</h1>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Un seul paiement (400 DH), deux comptes — chacun sa filière et son niveau. Ton binôme peut être en 1bac ou 2bac.</p>

        <form onSubmit={submit} className="mt-7 grid md:grid-cols-2 gap-5">
          {/* TOI */}
          <div className="glass rounded-3xl p-6">
            <div className="text-sm font-bold tracking-tight">Toi</div>
            <div className="mt-4 space-y-3">
              <div><label className={lbl}>Pseudo</label><input className={input} value={aName} onChange={(e) => setAName(e.target.value)} placeholder="yassine_2bac" /></div>
              <div><label className={lbl}>Email</label><input type="email" className={input} value={aEmail} onChange={(e) => setAEmail(e.target.value)} placeholder="toi@email.com" /></div>
              <div><label className={lbl}>Téléphone</label><input className={input} inputMode="tel" value={aPhone} onChange={(e) => setAPhone(e.target.value)} placeholder="06 12 34 56 78" /></div>
              <div><label className={lbl}>Mot de passe</label><input type="password" className={input} value={aPass} onChange={(e) => setAPass(e.target.value)} placeholder="6 caractères min." /></div>
              <div><label className={lbl}>Niveau</label><NiveauToggle v={aNiveau} set={setANiveau} /></div>
              <div><label className={lbl}>Filière</label><SelectMenu value={aTrack} onChange={setATrack} placeholder="Ta filière…" options={trackOpts} /></div>
            </div>
          </div>

          {/* BINÔME */}
          <div className="glass rounded-3xl p-6">
            <div className="text-sm font-bold tracking-tight">Ton binôme</div>
            <div className="mt-4 space-y-3">
              <div><label className={lbl}>Pseudo</label><input className={input} value={bName} onChange={(e) => setBName(e.target.value)} placeholder="son pseudo" /></div>
              <div><label className={lbl}>Email</label><input type="email" className={input} value={bEmail} onChange={(e) => setBEmail(e.target.value)} placeholder="ami@email.com" /></div>
              <div><label className={lbl}>Niveau</label><NiveauToggle v={bNiveau} set={setBNiveau} /></div>
              <div><label className={lbl}>Filière</label><SelectMenu value={bTrack} onChange={setBTrack} placeholder="Sa filière…" options={trackOpts} /></div>
              <p className="text-[11px] text-neutral-400 pt-1">Ton binôme recevra un email pour choisir son mot de passe et activer son accès.</p>
            </div>
          </div>

          {error && <p className="md:col-span-2 text-sm text-red-500">{error}</p>}

          <div className="md:col-span-2 flex items-center justify-between gap-4 flex-wrap">
            <Link href="/signup" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white">← Je préfère m’inscrire seul</Link>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white text-sm font-bold px-7 py-3.5 hover:brightness-105 transition disabled:opacity-60">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Continuer vers le paiement (400 DH) <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
