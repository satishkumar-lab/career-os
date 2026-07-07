type SupabaseEnv = {
  url: string;
  anonKey: string;
};

const MISSING_ENV_MESSAGE =
  "Your project's URL and Key are required to create a Supabase client! " +
  "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables and redeploy.";

/**
 * Supabase Auth requires the project base URL (https://xxx.supabase.co).
 * A REST API URL (…/rest/v1) sends OAuth to the wrong endpoint and returns
 * "No API key found in request".
 */
export function normalizeSupabaseUrl(url: string): string {
  let normalized = url.trim();

  // Strip REST suffix whether or not a trailing slash is present.
  normalized = normalized.replace(/\/rest\/v1\/?$/i, "");

  // Remove any trailing slashes.
  return normalized.replace(/\/+$/, "");
}

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

  const normalizedUrl = normalizeSupabaseUrl(url);

  if (normalizedUrl.includes("/rest/v1")) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL must be the project base URL (https://xxx.supabase.co), not the REST API URL."
    );
  }

  return { url: normalizedUrl, anonKey: anonKey.trim() };
}

function readSupabaseEnvFromProcess(): {
  url: string | undefined;
  anonKey: string | undefined;
} {
  return {
    url:
      readRuntimeEnv("NEXT_PUBLIC_SUPABASE_URL") ?? readRuntimeEnv("SUPABASE_URL"),
    anonKey:
      readRuntimeEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") ??
      readRuntimeEnv("SUPABASE_ANON_KEY"),
  };
}

/** Server Components, Route Handlers, and Edge Middleware. */
export function getSupabaseEnv(): SupabaseEnv {
  const { url, anonKey } = readSupabaseEnvFromProcess();
  return resolveSupabaseEnv(url, anonKey);
}

/** Client Components — uses build-time inlined NEXT_PUBLIC_* values. */
export function getSupabaseEnvForClient(): SupabaseEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  return resolveSupabaseEnv(url, anonKey);
}

/** Build-time helper for next.config.ts */
export function getBuildTimeSupabaseEnv(): SupabaseEnv {
  const { url, anonKey } = readSupabaseEnvFromProcess();
  return resolveSupabaseEnv(url, anonKey);
}
