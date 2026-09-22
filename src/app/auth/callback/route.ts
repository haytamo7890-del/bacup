import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { routeForUser } from "@/lib/post-auth";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) return NextResponse.redirect(`${origin}/login?error=oauth`);

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(`${origin}/login?error=oauth`);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(`${origin}/login?error=session`);

  // Land the user exactly where they belong (onboarding / payment / app).
  const dest = await routeForUser(supabase, user.id);
  return NextResponse.redirect(`${origin}${dest}`);
}
