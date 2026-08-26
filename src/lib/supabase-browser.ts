import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for the browser (client components).
 * Handles auth (signup/login) and stores the session.
 */
export function createBrowserSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
