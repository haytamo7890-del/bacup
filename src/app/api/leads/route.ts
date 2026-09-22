import { createPublicSupabase } from "@/lib/supabase-public";

/** Landing lead capture (demo email + newsletter). Insert-only (RLS). */
export async function POST(req: Request) {
  try {
    const { email, source, level } = await req.json();
    if (typeof email !== "string" || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 200) {
      return Response.json({ ok: false, error: "invalid_email" }, { status: 400 });
    }
    const sb = createPublicSupabase();
    const { error } = await sb.from("leads").insert({
      email: email.trim().toLowerCase(),
      source: typeof source === "string" ? source.slice(0, 40) : null,
      level: level === "1bac" || level === "2bac" ? level : null,
    });
    if (error) return Response.json({ ok: false, error: "insert_failed" }, { status: 500 });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
}
