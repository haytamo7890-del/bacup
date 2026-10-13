import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { loadMe } from "@/lib/bacup/me";

/** Session summary for the static pages (onboarding, ambassador funnel). */
export async function GET() {
  const supabase = await createServerSupabase();
  return NextResponse.json(await loadMe(supabase), { headers: { "Cache-Control": "no-store" } });
}
