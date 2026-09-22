"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { BrandLockup } from "@/components/brand";
import { Mail } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createBrowserSupabase();
  const [pseudo, setPseudo] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: { data: { display_name: pseudo.trim(), phone: phone.trim() } },
    });
    if (error) {
      setLoading(false);
      setMessage(error.message.includes("already registered") ? "Un compte existe déjà avec cet email." : error.message);
      return;
    }
    // Supabase returns a user with no identities when the email already exists.
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      setLoading(false);
      setMessage("Un compte existe déjà avec cet email. Connecte-toi.");
      return;
    }
    if (data.session && data.user) {
      // Auto sign-in (email confirmation off) → save profile, continue.
      await supabase.from("profiles").upsert({ id: data.user.id, role: "student", display_name: pseudo.trim(), phone: phone.trim() });
      router.push("/onboarding");
      return;
    }
    // Email confirmation required → tell them to check their inbox.
    setLoading(false);
    setSent(true);
  }

  async function google() {
    setMessage("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setMessage(error.message);
  }

  const input =
    "w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent px-3.5 py-3 text-sm outline-none focus:border-arctic-blue";
  const lbl = "block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5";

  if (sent) {
    return (
      <main className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm text-center">
          <span className="w-14 h-14 rounded-2xl bg-arctic-blue/10 text-arctic-blue dark:text-arctic-cyan grid place-items-center mx-auto"><Mail className="w-6 h-6" /></span>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight">Vérifie ton email</h1>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            On a envoyé un lien de confirmation à <span className="font-semibold text-neutral-800 dark:text-neutral-200">{email.trim()}</span>. Clique dessus pour activer ton compte, puis connecte-toi.
          </p>
          <Link href="/login" className="mt-6 inline-block rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-sm font-semibold px-6 py-3 hover:opacity-90 transition">Aller à la connexion</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="inline-flex mb-8"><BrandLockup /></Link>

        <h1 className="text-2xl font-extrabold tracking-tight">Crée ton compte</h1>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Rejoins Bac-up et prépare ton BAC.</p>

        <button
          onClick={google}
          type="button"
          className="mt-6 w-full flex items-center justify-center gap-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 py-3 text-sm font-semibold hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition"
        >
          <GoogleIcon /> Continuer avec Google
        </button>

        <div className="flex items-center gap-3 my-5 text-xs text-neutral-400">
          <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" /> ou <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={lbl}>Pseudo</label>
            <input type="text" required value={pseudo} onChange={(e) => setPseudo(e.target.value)} placeholder="Ex. yassine_2bac" className={input} />
          </div>
          <div>
            <label className={lbl}>Téléphone</label>
            <input type="tel" required inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="06 12 34 56 78" className={input} />
          </div>
          <div>
            <label className={lbl}>Adresse email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ton.email@gmail.com" className={input} />
          </div>
          <div>
            <label className={lbl}>Mot de passe</label>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="6 caractères minimum" className={input} />
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-sm font-semibold py-3 hover:opacity-90 transition disabled:opacity-50">
            {loading ? "Création…" : "Continuer →"}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-red-600">{message}</p>}

        <p className="mt-6 text-sm text-neutral-500">
          Déjà un compte ?{" "}
          <Link href="/login" className="font-semibold text-neutral-900 dark:text-white underline">Se connecter</Link>
        </p>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.5 0 10.5-2.1 14.3-5.6l-6.6-5.6C29.6 34.4 26.9 35 24 35c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.6 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.7l6.6 5.6C41.4 36 44 30.5 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  );
}
