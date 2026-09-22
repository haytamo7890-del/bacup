import { createServerSupabase } from "@/lib/supabase-server";
import { AI_LIMITS } from "@/config";

type GuardResult = { ok: true; userId: string } | { ok: false; status: number; message: string };

/**
 * Gate every AI route: requires a signed-in user and enforces a daily quota
 * (atomic check+increment in the DB). Protects Anthropic cost at scale.
 */
export async function guardAI(): Promise<GuardResult> {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, status: 401, message: "Connecte-toi pour utiliser l'IA." };

  // Paid-only: demo/free users can't hit the AI directly (protects Anthropic cost).
  const { data: prof } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (prof?.role !== "admin") {
    const { data: sp } = await supabase.from("student_profiles").select("status").eq("id", user.id).maybeSingle();
    if (sp?.status !== "active") {
      return { ok: false, status: 402, message: "L'IA est réservée à l'accès complet. Obtiens ton accès pour l'utiliser." };
    }
  }

  const { data, error } = await supabase.rpc("ai_can_use", { p_max: AI_LIMITS.pro.questionsPerDay });
  if (error) return { ok: false, status: 500, message: "Quota IA indisponible. Réessaie plus tard." };
  if (!data) return { ok: false, status: 429, message: "Tu as atteint ta limite d'IA du jour. Reviens demain 💪" };

  return { ok: true, userId: user.id };
}
