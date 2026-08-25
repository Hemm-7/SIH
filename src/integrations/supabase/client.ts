import { createClient } from "@supabase/supabase-js";

import type { Database } from "./types";

const url = import.meta.env.VITE_SUPABASE_URL;
// The base repo named this PUBLISHABLE; ANON is the name Supabase's own docs use.
// Accept either so neither convention silently yields an unauthenticated client.
const anonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !anonKey) {
  throw new Error(
    "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env, then restart the dev server — Vite only reads env at startup.",
  );
}

// Typed against the generated Database, so table/column typos fail at build time
// rather than at runtime in front of a judge.
export const supabase = createClient<Database>(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
