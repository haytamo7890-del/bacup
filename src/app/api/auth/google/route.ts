import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerSupabase } from "@/lib/supabase-server";
import { NEXT_COOKIE, safeNext } from "@/lib/bacup/safe-next";

/**
 * Starts Google sign-in from the static pages. `next` (where to come back) is
 * kept in a short-lived cookie so the Supabase redirect URL stays the same one
 * already allowed for /login (`/auth/callback`).
 */
export async function GET(req: Request) {
  const { origin, searchParams } = new URL(req.url);
  const next = safeNext(searchParams.get("next")) ?? "/onboarding";

  const jar = await cookies();
  jar.set(NEXT_COOKIE, next, { path: "/", maxAge: 600, httpOnly: true, sameSite: "lax", secure: origin.startsWith("https") });

  const supabase = await createServerSupabase();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/auth/callback`, skipBrowserRedirect: true },
  });
  if (error || !data.url) {
    const sep = next.includes("?") ? "&" : "?";
    return NextResponse.redirect(`${origin}${next}${sep}auth_error=google`);
  }
  return NextResponse.redirect(data.url);
}
