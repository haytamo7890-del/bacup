import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { loadMe } from "@/lib/bacup/me";
import { ONBOARDING_CHOICES, isBacLevel, trackForStream } from "@/config/bacup";
import { FEATURES } from "@/config";

type Body = {
  pseudo?: unknown;
  avatarKey?: unknown;
  level?: unknown;
  stream?: unknown;
  average?: unknown;
  goal?: unknown;
  dreamSchool?: unknown;
};

const str = (v: unknown, max: number): string | null => {
  if (typeof v !== "string") return null;
  const t = v.replace(/[<>"&]/g, "").replace(/\s+/g, " ").trim().slice(0, max);
  return t || null;
};

/**
 * Saves the Carte élève answers from the onboarding (pseudo, avatar, year,
 * stream, average, goal, dream school). Unknown or invalid values are ignored,
 * never stored. Paid status / member number are protected by DB triggers.
 */
export async function POST(req: Request) {
  let b: Body;
  try {
    b = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const patch: Record<string, string | number | boolean | null> = {};

  const pseudo = str(b.pseudo, 18);
  if (pseudo && pseudo.length >= 2) patch.pseudo = pseudo;

  const avatar = typeof b.avatarKey === "string" ? b.avatarKey : "";
  if ((ONBOARDING_CHOICES.avatars as readonly string[]).includes(avatar)) patch.avatar_key = avatar;

  const level = isBacLevel(b.level) ? b.level : null;
  if (level && typeof b.stream === "string") {
    const trackCode = trackForStream(level, b.stream);
    if (trackCode) {
      const [{ data: lv }, { data: tr }] = await Promise.all([
        supabase.from("levels").select("id").eq("code", level).maybeSingle(),
        supabase.from("tracks").select("id").eq("code", trackCode).maybeSingle(),
      ]);
      if (lv?.id && tr?.id) {
        patch.level_id = lv.id as string;
        patch.track_id = tr.id as string;
      }
    }
  }

  const avg = typeof b.average === "number" ? b.average : Number.NaN;
  if (Number.isFinite(avg) && avg >= 0 && avg <= 20) patch.average_now = Math.round(avg * 2) / 2;

  if (level && typeof b.goal === "string" && ONBOARDING_CHOICES.goals[level].includes(b.goal)) patch.goal = b.goal;

  if (level === "2bac" && typeof b.dreamSchool === "string" &&
      (ONBOARDING_CHOICES.dreamSchools as readonly string[]).includes(b.dreamSchool)) {
    patch.dream_school = b.dreamSchool;
  }

  // The new onboarding replaces the old personalisation quiz.
  if (patch.level_id) patch.quiz_done = true;

  if (Object.keys(patch).length) {
    const { error } = await supabase.from("student_profiles").update(patch).eq("id", user.id);
    if (error) return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }
  if (pseudo) await supabase.from("profiles").update({ display_name: pseudo }).eq("id", user.id);

  // Free account opens for 2bac (and for 1bac once it is live). 1bac stays
  // pending + locked until FEATURES.level1bac.
  if (patch.level_id && (level === "2bac" || FEATURES.level1bac)) {
    await supabase.rpc("start_demo", { p_user: user.id });
  }
  await supabase.rpc("ensure_member_number");

  return NextResponse.json(await loadMe(supabase), { headers: { "Cache-Control": "no-store" } });
}
