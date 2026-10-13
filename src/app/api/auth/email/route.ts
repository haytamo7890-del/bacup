import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Step 1 of email login: send a 6-digit code (creates the account if new). */
export async function POST(req: Request) {
  let email = "";
  try {
    const body: unknown = await req.json();
    const raw = (body as { email?: unknown })?.email;
    email = typeof raw === "string" ? raw.trim().toLowerCase() : "";
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  if (!EMAIL.test(email) || email.length > 200) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
  if (error) {
    const limited = error.status === 429;
    return NextResponse.json({ error: limited ? "rate_limited" : "send_failed" }, { status: limited ? 429 : 502 });
  }
  return NextResponse.json({ ok: true });
}
