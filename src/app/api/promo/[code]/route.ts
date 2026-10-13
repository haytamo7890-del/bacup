import { NextResponse } from "next/server";
import { createPublicSupabase } from "@/lib/supabase-public";

/** Checkout code check: active promo or active ambassador code only. */
export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const sb = createPublicSupabase();
  const { data } = await sb.rpc("validate_promo", { p_code: code.slice(0, 20) });
  const row = Array.isArray(data)
    ? (data[0] as { code: string; discount: number; ambassador_pseudo: string | null } | undefined)
    : undefined;
  if (!row) return NextResponse.json({ valid: false }, { status: 404 });
  return NextResponse.json({ valid: true, code: row.code, discount: row.discount, ambassadorPseudo: row.ambassador_pseudo });
}
