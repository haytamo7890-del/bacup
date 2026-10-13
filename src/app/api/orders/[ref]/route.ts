import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

/** Status of one of the signed-in user's orders (the page polls it after Whop). */
export async function GET(_req: Request, { params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const { data } = await supabase
    .from("orders")
    .select("ref, status, method, total, promo_code")
    .eq("ref", ref.toUpperCase().slice(0, 12))
    .eq("user_id", user.id)
    .maybeSingle();
  if (!data) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
}
