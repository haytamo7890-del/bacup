"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { routeForUser } from "@/lib/post-auth";
import { BrandLockup } from "@/components/brand";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createBrowserSupabase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Already logged in? Skip the form (stay-logged-in like other apps).
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) router.replace(await routeForUser(supabase, user.id));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    if (error || !data.user) {
      setLoading(false);
      const m = error?.message ?? "";
      setMessage(
        m.includes("Invalid login credentials") ? "Email ou mot de passe incorrect."
        : m.includes("Email not confirmed") ? "Confirme ton email avant de te connecter (vérifie ta boîte mail)."
        : m || "Connexion impossible."
      );
      return;
    }
    router.push(await routeForUser(supabase, data.user.id));
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

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="inline-flex mb-8"><BrandLockup /></Link>

        <h1 className="text-2xl font-extrabold tracking-tight">Bon retour 👋</h1>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Connecte-toi à ton compte.</p>

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
            <label className={lbl}>Adresse email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ton.email@gmail.com" className={input} />
          </div>
          <div>
            <label className={lbl}>Mot de passe</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Ton mot de passe" className={input} />
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-sm font-semibold py-3 hover:opacity-90 transition disabled:opacity-50">
            {loading ? "Connexion…" : "Se connecter →"}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-red-600">{message}</p>}

        <p className="mt-6 text-sm text-neutral-500">
          Pas encore de compte ?{" "}
          <Link href="/signup" className="font-semibold text-neutral-900 dark:text-white underline">Créer un compte</Link>
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
