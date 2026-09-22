import { createClient } from "@supabase/supabase-js";

/**
 * Anonymous, cookie-less Supabase client for public server components
 * (SEO pages, sitemap). Content tables are public-read (RLS: read_all),
 * so this reads exams/exercises/questions/solutions without a session.
 */
export function createPublicSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
