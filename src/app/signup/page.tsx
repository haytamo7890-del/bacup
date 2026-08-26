"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabase-browser";

type Status = "idle" | "loading" | "error";
type Row = { id: string; code: string; name: string };

export default function SignupPage() {
  const router = useRouter();
  const supabase = createBrowserSupabase();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [levelId, setLevelId] = useState("");
  const [trackId, setTrackId] = useState("");
  const [levels, setLevels] = useState<Row[]>([]);
  const [tracks, setTracks] = useState<Row[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  // Load niveaux + filières for step 2
  useEffect(() => {
    (async () => {
      const [{ data: lv }, { data: tr }] = await Promise.all([
        supabase.from("levels").select("id, code, name").order("position"),
        supabase.from("tracks").select("id, code, name").order("name"),
      ]);
      if (lv) setLevels(lv);
      if (tr) setTracks(tr);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Step 1 — create the auth account
  async function handleCreateAccount(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }
    setStatus("idle");
    setStep(2);
  }

  // Step 2 — save the student profile
  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setStatus("error");
      setMessage(
        "Session non active. Désactive « Confirm email » dans Supabase pour tester, puis réessaie."
      );
      return;
    }

    const { error: pErr } = await supabase
      .from("profiles")
      .upsert({ id: user.id, role: "student", display_name: name });
    if (pErr) {
      setStatus("error");
      setMessage(pErr.message);
      return;
    }

    const { error: sErr } = await supabase
      .from("student_profiles")
      .upsert({ id: user.id, level_id: levelId || null, track_id: trackId || null });
    if (sErr) {
      setStatus("error");
      setMessage(sErr.message);
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

        {/* step indicator */}
        <div className="flex gap-1.5 mb-6">
          <div className={`h-1 flex-1 rounded ${step >= 1 ? "bg-neutral-900" : "bg-neutral-200"}`} />
          <div className={`h-1 flex-1 rounded ${step >= 2 ? "bg-neutral-900" : "bg-neutral-200"}`} />
        </div>

        {step === 1 ? (
          <>
            <h1 className="text-2xl font-extrabold tracking-tight">Crée ton compte</h1>
            <p className="mt-2 text-sm text-neutral-500">
              Commence ton essai gratuit. Aucune carte requise.
            </p>
            <form onSubmit={handleCreateAccount} className="mt-6 space-y-4">
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
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6 caractères minimum"
                  className={input}
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-full bg-neutral-900 text-white text-sm font-semibold py-3 hover:bg-black transition disabled:opacity-50"
              >
                {status === "loading" ? "Création…" : "Continuer →"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-extrabold tracking-tight">Ton profil</h1>
            <p className="mt-2 text-sm text-neutral-500">
              On adapte le contenu à ton niveau et ta filière.
            </p>
            <form onSubmit={handleSaveProfile} className="mt-6 space-y-4">
              <div>
                <label className={labelCls}>Ton prénom</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Yassine"
                  className={input}
                />
              </div>
              <div>
                <label className={labelCls}>Niveau</label>
                <select
                  required
                  value={levelId}
                  onChange={(e) => setLevelId(e.target.value)}
                  className={input}
                >
                  <option value="">Choisis ton niveau…</option>
                  {levels.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Filière</label>
                <select
                  required
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value)}
                  className={input}
                >
                  <option value="">Choisis ta filière…</option>
                  {tracks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-full bg-neutral-900 text-white text-sm font-semibold py-3 hover:bg-black transition disabled:opacity-50"
              >
                {status === "loading" ? "Enregistrement…" : "Accéder à mon tableau de bord →"}
              </button>
            </form>
          </>
        )}

        {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
      </div>
    </main>
  );
}
