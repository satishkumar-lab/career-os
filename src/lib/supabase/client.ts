import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseEnvForClient } from "@/lib/supabase/env";

/**
 * Supabase client for use in Client Components.
 */
export function createClient() {
  const { url, anonKey } = getSupabaseEnvForClient();

  return createBrowserClient(url, anonKey);
}
