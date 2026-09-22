"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { LogoMark } from "./primitives";

/**
 * Demo = INSTANT access (no account creation). We capture the email as a lead,
 * open an anonymous Supabase session, seed a 'demo' student profile, and drop
 * the visitor straight into the real dashboard (gated). Figma/Canva-style.
 *
 * Requires "Anonymous sign-ins" enabled in Supabase → Auth → Providers.
 */
export function LeadModal({ open, onClose, level }: { open: boolean; onClose: () => void; level: "1bac" | "2bac" }) {
  const router = useRouter();
  const supabase = createBrowserSupabase();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setState("error");
      setMsg("Entre un email valide.");
      return;
    }
    setState("loading");
    setMsg("");

    // 1) capture the lead (non-blocking)
    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase(), source: "demo", level }),
    }).catch(() => {});

    // 2) instant anonymous session → real app in demo mode
    try {
      const { data: anon, error } = await supabase.auth.signInAnonymously();
      if (error || !anon.user) throw error ?? new Error("no-session");
      const uid = anon.user.id;

      const [{ data: lvl }, { data: trk }] = await Promise.all([
        supabase.from("levels").select("id").eq("code", level).maybeSingle(),
        supabase.from("tracks").select("id").eq("code", "pc").maybeSingle(),
      ]);
      let trackId = trk?.id ?? null;
      if (!trackId) {
        const { data: anyTrack } = await supabase.from("tracks").select("id").limit(1).maybeSingle();
        trackId = anyTrack?.id ?? null;
      }

      await supabase.from("profiles").upsert({ id: uid, role: "student", display_name: "Élève démo" });
      const { error: spErr } = await supabase.from("student_profiles").upsert({
        id: uid,
        level_id: lvl?.id ?? null,
        track_id: trackId,
        status: "demo", // free tier — enters the real app, gated
        quiz_done: true, // skip the quiz for instant access
      });
      if (spErr) throw spErr;
      await supabase.rpc("start_demo", { p_user: uid }); // sets demo_started_at (24h Monk window)

      router.push("/dashboard");
    } catch (err) {
      const m = err instanceof Error ? err.message : "";
      setState("error");
      setMsg(m ? `Démo indisponible : ${m}` : "La démo est momentanément indisponible.");
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center p-4 bg-[#050a12]/70 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-3xl bg-[#0c1320] border border-white/10 shadow-2xl overflow-hidden">
        <div className="relative p-6 sm:p-8">
          <button onClick={onClose} aria-label="Fermer" className="absolute top-4 right-4 w-8 h-8 grid place-items-center rounded-full text-white/40 hover:bg-white/10 transition">
            <X className="w-4 h-4" />
          </button>

          <LogoMark size={44} />
          <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-white">Essaie la démo, tout de suite.</h3>
          <p className="mt-2 text-sm text-white/55">
            Accès instantané, sans créer de compte. Explore l’app en entier — examens, corrections /20, IA, classement.
          </p>
          <form onSubmit={submit} className="mt-5 space-y-3">
            <input
              type="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton@email.com"
              className="w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-arctic-cyan"
            />
            {state === "error" && <p className="text-sm text-red-400">{msg}</p>}
            <button
              type="submit"
              disabled={state === "loading"}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white text-sm font-bold py-3.5 shadow-[0_10px_30px_rgba(27,127,220,.35)] hover:brightness-110 transition disabled:opacity-60"
            >
              {state === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {state === "loading" ? "Ouverture de ta démo…" : "Entrer dans la démo"}
              {state !== "loading" && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
          <p className="mt-3 text-[11px] text-white/40 text-center">
            On t’envoie aussi les conseils BAC. Désinscription à tout moment.
          </p>
        </div>
      </div>
    </div>
  );
}
