import { AUTH_CALLBACK_PATH, DASHBOARD_PATH } from "@/lib/auth/routes";

const LOCAL_DEV_APP_URL = "http://localhost:3000";

function readDevAppUrl(): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (configured) {
    return configured.replace(/\/+$/, "");
  }

  return LOCAL_DEV_APP_URL;
}

/**
 * Origin used for OAuth redirectTo in Client Components.
 * In local development we always use localhost:3000 so Supabase Auth
 * receives a URL that matches the dashboard allowlist, even when the
 * browser is opened via 127.0.0.1 or a LAN IP.
 */
export function getAuthRedirectOrigin(): string {
  if (process.env.NODE_ENV === "development") {
    return readDevAppUrl();
  }

  return window.location.origin;
}

/**
 * Origin used when the auth callback route redirects after code exchange.
 */
export function getAuthRedirectOriginFromRequest(request: Request): string {
  if (process.env.NODE_ENV === "development") {
    return readDevAppUrl();
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";
  const { origin } = new URL(request.url);

  if (process.env.VERCEL && forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  return origin;
}

/** OAuth callback URL sent to Supabase (no query params — see callback route). */
export function getAuthCallbackUrl(): string {
  return `${getAuthRedirectOrigin()}${AUTH_CALLBACK_PATH}`;
}

/** Post-login destination for local and production flows. */
export function getAuthSuccessPath(): string {
  return DASHBOARD_PATH;
}
