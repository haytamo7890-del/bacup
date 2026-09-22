"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { routeForUser } from "@/lib/post-auth";
import { FILIERE_SET } from "@/config/curriculum";
import { SelectMenu } from "@/components/ui/select-menu";

type Row = { id: string; code: string; name: string };

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createBrowserSupabase();

  const [ready, setReady] = useState(false);
  const [levels, setLevels] = useState<Row[]>([]);
  const [tracks, setTracks] = useState<Row[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [hasPseudo, setHasPseudo] = useState(false);
  const [hasPhone, setHasPhone] = useState(false);
  const [levelId, setLevelId] = useState("");
  const [trackId, setTrackId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      // Already onboarded? route by payment status (→ /payment or /dashboard).
      const { data: sp } = await supabase
        .from("student_profiles")
        .select("level_id, track_id")
        .eq("id", user.id)
        .single();
      if (sp?.level_id && sp?.track_id) {
        router.push(await routeForUser(supabase, user.id));
        return;
      }
      const [{ data: lv }, { data: tr }] = await Promise.all([
        supabase.from("levels").select("id, code, name").order("position"),
        supabase.from("tracks").select("id, code, name").order("name"),
      ]);
      setLevels(lv ?? []);
      setTracks((tr ?? []).filter((t) => FILIERE_SET.has(t.code)));
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, phone")
        .eq("id", user.id)
        .maybeSingle();
      if (profile?.display_name) { setName(profile.display_name); setHasPseudo(true); }
      if (profile?.phone) { setPhone(profile.phone); setHasPhone(true); }
      setReady(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!levelId || !trackId) { setError("Choisis ton niveau et ta filière."); return; }
    if ((!hasPseudo && !name.trim()) || (!hasPhone && !phone.trim())) { setError("Complète tes informations."); return; }
    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    const { error: pErr } = await supabase
      .from("profiles")
      .upsert({ id: user.id, role: "student", display_name: name, phone });
    if (pErr) {
      setError(pErr.message);
      setSaving(false);
      return;
    }
    const { error: sErr } = await supabase
      .from("student_profiles")
      .upsert({ id: user.id, level_id: levelId, track_id: trackId });
    if (sErr) {
      setError(sErr.message);
      setSaving(false);
      return;
    }
    // Freemium: new accounts start in the free "demo" tier (enter the real app,
    // gated). Upgrading to 220 DH flips them to "active".
    await supabase.rpc("start_demo", { p_user: user.id });
    router.push(await routeForUser(supabase, user.id));
  }

  const input =
    "w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-transparent px-3.5 py-3 text-sm outline-none focus:border-arctic-blue";
  const lbl = "block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5";

  if (!ready) {
    return <main className="min-h-screen grid place-items-center text-sm text-neutral-400">Chargement…</main>;
  }

  return (
    <main className="min-h-screen grid place-items-center px-6 py-16 bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-[#0a0f16] dark:to-[#05080c]">
      <div className="w-full max-w-md glass rounded-3xl p-8">
        <div className="flex items-center gap-2.5 mb-6">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-arctic-cyan to-arctic-blue text-white grid place-items-center font-extrabold">B</span>
          <span className="font-bold tracking-tight text-lg">Bac<span className="text-arctic-blue dark:text-arctic-cyan">-up</span></span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Ton programme</h1>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          On adapte tout ton contenu à ta classe et ta filière.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {!hasPseudo && (
            <div>
              <label className={lbl}>Pseudo</label>
              <input className={input} required value={name} onChange={(e) => setName(e.target.value)} placeholder="yassine_2bac" />
            </div>
          )}
          {!hasPhone && (
            <div>
              <label className={lbl}>Téléphone</label>
              <input className={input} required inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="06 12 34 56 78" />
            </div>
          )}
          <div>
            <label className={lbl}>Niveau</label>
            <SelectMenu value={levelId} onChange={setLevelId} placeholder="Choisis ton niveau…" options={levels.map((l) => ({ value: l.id, label: l.name }))} />
          </div>
          <div>
            <label className={lbl}>Filière</label>
            <SelectMenu value={trackId} onChange={setTrackId} placeholder="Choisis ta filière…" options={tracks.map((t) => ({ value: t.id, label: t.name }))} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white text-sm font-semibold py-3 hover:opacity-90 transition disabled:opacity-60"
          >
            {saving ? "Enregistrement…" : "Continuer →"}
          </button>
        </form>
      </div>
    </main>
  );
}
