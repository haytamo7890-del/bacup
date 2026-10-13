import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { routeForUser } from "@/lib/post-auth";
import { cookies } from "next/headers";
import { NEXT_COOKIE, safeNext } from "@/lib/bacup/safe-next";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) return NextResponse.redirect(`${origin}/login?error=oauth`);

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(`${origin}/login?error=oauth`);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(`${origin}/login?error=session`);

  // Started from a static page (onboarding, ambassador funnel): go back there.
  const jar = await cookies();
  const next = safeNext(jar.get(NEXT_COOKIE)?.value);
  if (next) {
    jar.delete(NEXT_COOKIE);
    return NextResponse.redirect(`${origin}${next}`);
  }

  // Land the user exactly where they belong (onboarding / payment / app).
  const dest = await routeForUser(supabase, user.id);
  return NextResponse.redirect(`${origin}${dest}`);
}
