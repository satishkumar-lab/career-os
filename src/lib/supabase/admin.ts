import { createClient } from "@supabase/supabase-js";

import { getSupabaseEnv } from "@/lib/supabase/env";
import { getSupabaseServiceRoleKey } from "@/lib/supabase/service-env";

/**
 * Supabase client with service role — bypasses RLS.
 * Use only in Route Handlers / Server Actions. Never import in client code.
 */
export function createAdminClient() {
  const { url } = getSupabaseEnv();

  return createClient(url, getSupabaseServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
