"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase-browser";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createBrowserSupabase();

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState<string>("");
  const [level, setLevel] = useState<string>("");
  const [track, setTrack] = useState<string>("");

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/signup");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .single();

      const { data: sp } = await supabase
        .from("student_profiles")
        .select("levels(name), tracks(name)")
        .eq("id", user.id)
        .single();

      setName(profile?.display_name ?? "");
      // embedded relations come back as objects
      const lv = sp?.levels as { name: string } | null | undefined;
      const tr = sp?.tracks as { name: string } | null | undefined;
      setLevel(lv?.name ?? "");
      setTrack(tr?.name ?? "");
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center text-neutral-400 text-sm">
        Chargement…
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900 px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-neutral-900 text-white grid place-items-center font-extrabold">
              H
            </div>
            <span className="text-lg font-bold tracking-tight">HSGenius</span>
          </div>
          <button
            onClick={signOut}
            className="text-sm text-neutral-500 hover:text-neutral-900"
          >
            Déconnexion
          </button>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight">
          Bonjour {name || "👋"}
        </h1>
        <p className="mt-2 text-neutral-500">
          {track && level
            ? `${track} · ${level}`
            : "Profil créé — on ajoutera bientôt ton contenu."}
        </p>

        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="text-sm font-semibold text-neutral-700">
            Ton tableau de bord arrive
          </div>
          <p className="mt-2 text-sm text-neutral-500">
            Ton compte, ton niveau et ta filière sont enregistrés. Prochaine étape :
            le coach IA et ta première leçon.
          </p>
        </div>
      </div>
    </main>
  );
}
