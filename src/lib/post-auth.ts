import type { SupabaseClient } from "@supabase/supabase-js";
import { FEATURES } from "@/config";

/**
 * Where a signed-in user should land, based on role + onboarding + payment.
 *   admin              → /admin
 *   no filière/année    → /onboarding
 *   not yet activated   → /payment
 *   active student      → /dashboard
 */
export async function routeForUser(supabase: SupabaseClient, userId: string): Promise<string> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  if (profile?.role === "admin") return "/admin";

  // Binôme partner: if this email matches a paid pair, activate them now.
  await supabase.rpc("claim_partner_access");

  const { data: sp } = await supabase
    .from("student_profiles")
    .select("level_id, track_id, status, quiz_done, levels(code)")
    .eq("id", userId)
    .maybeSingle();

  if (!sp?.level_id || !sp?.track_id) return "/onboarding";
  // 1bac before launch: the app shows the « Bientôt » lock.
  const levelCode = (sp.levels as unknown as { code: string } | null)?.code;
  if (levelCode === "1bac" && !FEATURES.level1bac) return "/dashboard";
  if (!sp.quiz_done) return "/onboarding/quiz"; // personalization first
  // Freemium: demo AND active accounts enter the app; others go pay.
  if (sp.status === "active" || sp.status === "demo") return "/dashboard";
  return "/payment";
}
