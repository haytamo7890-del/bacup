"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createBrowserSupabase();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      setMessage(error.message);
      return;
    }
    router.push("/dashboard");
  }

  const input =
    "w-full rounded-xl border border-neutral-300 px-3.5 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
  const labelCls = "block text-sm font-semibold text-neutral-700 mb-1.5";

  return (
    <main className="min-h-screen bg-white text-neutral-900 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-lg bg-neutral-900 text-white grid place-items-center font-extrabold">
            H
          </div>
          <span className="text-lg font-bold tracking-tight">HSGenius</span>
        </Link>

        <h1 className="text-2xl font-extrabold tracking-tight">Bon retour 👋</h1>
        <p className="mt-2 text-sm text-neutral-500">Connecte-toi à ton compte.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className={labelCls}>Adresse email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton.email@gmail.com"
              className={input}
            />
          </div>
          <div>
            <label className={labelCls}>Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ton mot de passe"
              className={input}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-neutral-900 text-white text-sm font-semibold py-3 hover:bg-black transition disabled:opacity-50"
          >
            {loading ? "Connexion…" : "Se connecter →"}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-red-600">{message}</p>}

        <p className="mt-6 text-sm text-neutral-500">
          Pas encore de compte ?{" "}
          <Link href="/signup" className="font-semibold text-neutral-900 underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </main>
  );
}
