"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { FILIERE_SET } from "@/config/curriculum";
import { SelectMenu } from "@/components/ui/select-menu";
import {
  User, GraduationCap, ShieldCheck, Palette, LogOut, Loader2, Check, Sun, Moon, Mail, BadgeInfo, Lock,
} from "lucide-react";

type Row = { id: string; name: string; code?: string };

function studentId(uuid: string): string {
  let h = 0;
  for (let i = 0; i < uuid.length; i++) h = (h * 31 + uuid.charCodeAt(i)) >>> 0;
  return String((h % 90000) + 10000);
}

const input = "w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-arctic-blue";
const lbl = "block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1";

export default function ReglagesPage() {
  const router = useRouter();
  const supabase = createBrowserSupabase();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [ready, setReady] = useState(false);
  const [uid, setUid] = useState("");
  const [email, setEmail] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [phone, setPhone] = useState("");
  const [levels, setLevels] = useState<Row[]>([]);
  const [tracks, setTracks] = useState<Row[]>([]);
  const [levelId, setLevelId] = useState("");
  const [trackId, setTrackId] = useState("");
  const [program, setProgram] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");

  const [savingP, setSavingP] = useState(false); const [savedP, setSavedP] = useState(false);
  const [savingS, setSavingS] = useState(false); const [savedS, setSavedS] = useState(false);
  const [pwd, setPwd] = useState(""); const [pwd2, setPwd2] = useState("");
  const [savingPwd, setSavingPwd] = useState(false); const [pwdMsg, setPwdMsg] = useState("");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }
      setUid(user.id); setEmail(user.email ?? "");
      const [{ data: p }, { data: sp }, { data: lv }, { data: tr }] = await Promise.all([
        supabase.from("profiles").select("display_name, phone").eq("id", user.id).maybeSingle(),
        supabase.from("student_profiles").select("level_id, track_id, program, status").eq("id", user.id).maybeSingle(),
        supabase.from("levels").select("id, name").order("position"),
        supabase.from("tracks").select("id, name, code").order("name"),
      ]);
      setPseudo(p?.display_name ?? ""); setPhone(p?.phone ?? "");
      setLevelId(sp?.level_id ?? ""); setTrackId(sp?.track_id ?? "");
      setProgram(sp?.program ?? null); setStatus(sp?.status ?? "");
      setLevels((lv ?? []) as Row[]); setTracks(((tr ?? []) as Row[]).filter((t) => !t.code || FILIERE_SET.has(t.code)));
      setReady(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function saveProfile() {
    setSavingP(true); setSavedP(false);
    await supabase.from("profiles").update({ display_name: pseudo.trim(), phone: phone.trim() }).eq("id", uid);
    setSavingP(false); setSavedP(true); setTimeout(() => setSavedP(false), 1500);
  }
  async function saveStudy() {
    setSavingS(true); setSavedS(false);
    await supabase.from("student_profiles").update({ track_id: trackId || null }).eq("id", uid);
    setSavingS(false); setSavedS(true); setTimeout(() => setSavedS(false), 1500);
  }
  async function changePwd() {
    setPwdMsg("");
    if (pwd.length < 6) { setPwdMsg("6 caractères minimum."); return; }
    if (pwd !== pwd2) { setPwdMsg("Les mots de passe ne correspondent pas."); return; }
    setSavingPwd(true);
    const { error } = await supabase.auth.updateUser({ password: pwd });
    setSavingPwd(false);
    setPwdMsg(error ? error.message : "✓ Mot de passe mis à jour.");
    if (!error) { setPwd(""); setPwd2(""); }
  }
  async function logout() { await supabase.auth.signOut(); router.replace("/login"); }

  if (!ready) return <div className="grid place-items-center h-64 text-neutral-400"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  const isDark = resolvedTheme === "dark";
  const statusStyle = status === "active" ? "text-emerald-500" : status === "suspended" ? "text-red-500" : "text-amber-500";

  return (
    <div className="max-w-2xl mx-auto py-8 fade-up">
      <h1 className="text-3xl font-bold tracking-tight">Réglages</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Gère ton compte, ta filière et tes préférences.</p>

      {/* PROFIL */}
      <Section icon={<User className="w-4 h-4" />} title="Profil">
        <div className="grid sm:grid-cols-2 gap-3">
          <div><label className={lbl}>Pseudo</label><input className={input} value={pseudo} onChange={(e) => setPseudo(e.target.value)} /></div>
          <div><label className={lbl}>Téléphone</label><input className={input} inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
        </div>
        <div className="mt-3 flex justify-end">
          <SaveBtn saving={savingP} saved={savedP} onClick={saveProfile} />
        </div>
      </Section>

      {/* FILIÈRE */}
      <Section icon={<GraduationCap className="w-4 h-4" />} title="Filière & niveau">
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className={lbl}>Niveau</label>
            <div className={`${input} flex items-center justify-between text-neutral-500 dark:text-neutral-400 cursor-not-allowed`}>
              <span>{levels.find((l) => l.id === levelId)?.name ?? "—"}</span>
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <label className={lbl}>Filière</label>
            <SelectMenu value={trackId} onChange={setTrackId} placeholder="Choisis ta filière…" options={tracks.map((t) => ({ value: t.id, label: t.name }))} />
          </div>
        </div>
        <p className="mt-2 text-xs text-neutral-400">Ton niveau est lié à ton programme et ne peut pas être modifié. Tu peux ajuster ta filière.</p>
        <div className="mt-3 flex justify-end"><SaveBtn saving={savingS} saved={savedS} onClick={saveStudy} /></div>
      </Section>

      {/* COMPTE */}
      <Section icon={<BadgeInfo className="w-4 h-4" />} title="Compte">
        <div className="space-y-2 text-sm">
          <Info icon={<Mail className="w-4 h-4 text-neutral-400" />} label="Email" value={email} />
          <Info icon={<BadgeInfo className="w-4 h-4 text-neutral-400" />} label="ID Élève" value={uid ? studentId(uid) : "—"} />
          <Info icon={<ShieldCheck className="w-4 h-4 text-neutral-400" />} label="Programme" value={program ? program.toUpperCase() : "—"} />
          <div className="flex items-center justify-between py-1.5">
            <span className="text-neutral-500 dark:text-neutral-400 inline-flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-neutral-400" /> Statut</span>
            <span className={`font-semibold capitalize ${statusStyle}`}>{status || "—"}</span>
          </div>
        </div>
      </Section>

      {/* SÉCURITÉ */}
      <Section icon={<ShieldCheck className="w-4 h-4" />} title="Sécurité">
        <div className="grid sm:grid-cols-2 gap-3">
          <div><label className={lbl}>Nouveau mot de passe</label><input type="password" className={input} value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="••••••" /></div>
          <div><label className={lbl}>Confirmer</label><input type="password" className={input} value={pwd2} onChange={(e) => setPwd2(e.target.value)} placeholder="••••••" /></div>
        </div>
        {pwdMsg && <p className={`mt-2 text-sm ${pwdMsg.startsWith("✓") ? "text-emerald-500" : "text-red-500"}`}>{pwdMsg}</p>}
        <div className="mt-3 flex justify-end">
          <button onClick={changePwd} disabled={savingPwd} className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition disabled:opacity-50">
            {savingPwd ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />} Mettre à jour
          </button>
        </div>
      </Section>

      {/* APPARENCE */}
      <Section icon={<Palette className="w-4 h-4" />} title="Apparence">
        <div className="flex gap-2">
          <button onClick={() => setTheme("light")} className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${mounted && !isDark ? "border-arctic-blue bg-arctic-blue/10 text-arctic-blue" : "border-neutral-300 dark:border-neutral-700 text-neutral-500"}`}><Sun className="w-4 h-4" /> Clair</button>
          <button onClick={() => setTheme("dark")} className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${mounted && isDark ? "border-arctic-blue bg-arctic-blue/10 text-arctic-cyan" : "border-neutral-300 dark:border-neutral-700 text-neutral-500"}`}><Moon className="w-4 h-4" /> Sombre</button>
        </div>
      </Section>

      {/* DÉCONNEXION */}
      <button onClick={logout} className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-red-400/40 text-red-500 py-3 text-sm font-semibold hover:bg-red-500/10 transition">
        <LogOut className="w-4 h-4" /> Se déconnecter
      </button>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 glass rounded-2xl p-5">
      <div className="flex items-center gap-2 text-sm font-bold tracking-tight mb-4">
        <span className="w-8 h-8 rounded-xl bg-arctic-blue/10 text-arctic-blue dark:text-arctic-cyan grid place-items-center">{icon}</span>
        {title}
      </div>
      {children}
    </div>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-neutral-500 dark:text-neutral-400 inline-flex items-center gap-2">{icon} {label}</span>
      <span className="font-medium truncate max-w-[60%] text-right">{value}</span>
    </div>
  );
}

function SaveBtn({ saving, saved, onClick }: { saving: boolean; saved: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} disabled={saving} className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white hover:brightness-105 transition disabled:opacity-50">
      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
      {saved ? "Enregistré" : "Enregistrer"}
    </button>
  );
}
