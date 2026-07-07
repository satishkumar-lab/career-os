import type { NextConfig } from "next";

import { getBuildTimeSupabaseEnv } from "./src/lib/supabase/env";

function loadSupabaseBuildEnv() {
  try {
    const { url, anonKey } = getBuildTimeSupabaseEnv();
    return { url, anonKey };
  } catch {
    return {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "",
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "",
    };
  }
}

const { url: supabaseUrl, anonKey: supabaseAnonKey } = loadSupabaseBuildEnv();

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey,
  },
};

export default nextConfig;
