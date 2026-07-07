type SupabaseEnv = {
  url: string;
  anonKey: string;
};

const MISSING_ENV_MESSAGE =
  "Your project's URL and Key are required to create a Supabase client! " +
  "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables and redeploy.";

/**
 * Dynamic env lookup — avoids Next.js build-time inlining so Vercel can
 * inject values at runtime in Edge Middleware and Server Functions.
 */
function readRuntimeEnv(name: string): string | undefined {
  const value = process.env[name];

  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }

  return undefined;
}

function resolveSupabaseEnv(
  url: string | undefined,
  anonKey: string | undefined
): SupabaseEnv {
  if (!url || !anonKey) {
    throw new Error(MISSING_ENV_MESSAGE);
  }

  return { url, anonKey };
}

/** Server Components, Route Handlers, and Edge Middleware. */
export function getSupabaseEnv(): SupabaseEnv {
  const url =
    readRuntimeEnv("NEXT_PUBLIC_SUPABASE_URL") ?? readRuntimeEnv("SUPABASE_URL");
  const anonKey =
    readRuntimeEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") ??
    readRuntimeEnv("SUPABASE_ANON_KEY");

  return resolveSupabaseEnv(url, anonKey);
}

/**
 * Client Components — static references so Next.js can inline values into
 * the browser bundle when they are present at build time.
 */
export function getSupabaseEnvForClient(): SupabaseEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  return resolveSupabaseEnv(url, anonKey);
}
