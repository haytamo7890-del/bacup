import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client for reading public data (uses the public/anon key).
 * For authenticated/server actions we'll add an @supabase/ssr client later.
 */
export function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Variables Supabase manquantes — vérifie .env.local et redémarre le serveur."
    );
  }
  return createClient(url, key);
}
