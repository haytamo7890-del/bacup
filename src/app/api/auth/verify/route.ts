import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { loadMe } from "@/lib/bacup/me";

/** Step 2 of email login: check the 6-digit code, open the session (cookies). */
export async function POST(req: Request) {
  let email = "";
  let code = "";
  try {
    const body = (await req.json()) as { email?: unknown; code?: unknown };
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    code = typeof body.code === "string" ? body.code.replace(/\D/g, "") : "";
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  if (!email || code.length < 6 || code.length > 10) {
    return NextResponse.json({ error: "invalid_code" }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.verifyOtp({ email, token: code, type: "email" });
  if (error) {
    const limited = error.status === 429;
    return NextResponse.json({ error: limited ? "rate_limited" : "invalid_code" }, { status: limited ? 429 : 400 });
  }
  return NextResponse.json(await loadMe(supabase), { headers: { "Cache-Control": "no-store" } });
}
