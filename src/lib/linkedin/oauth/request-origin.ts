import { getAuthRedirectOriginFromRequest } from "@/lib/auth/app-origin";

const DEFAULT_LINKEDIN_RETURN_PATH = "/linkedin";

export function getAppOriginFromRequest(request: Request): string {
  return getAuthRedirectOriginFromRequest(request);
}

/** Canonical app origin for LinkedIn redirect_uri — prefers NEXT_PUBLIC_APP_URL when set. */
export function getLinkedInOAuthOriginFromRequest(request: Request): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (configured) {
    return configured.replace(/\/+$/, "");
  }

  return getAppOriginFromRequest(request);
}

export function sanitizeLinkedInReturnPath(returnTo: string | undefined | null): string {
  if (!returnTo || !returnTo.startsWith("/") || returnTo.startsWith("//")) {
    return DEFAULT_LINKEDIN_RETURN_PATH;
  }

  return returnTo;
}

export function buildLinkedInReturnUrl(
  origin: string,
  params: Record<string, string>,
  returnTo?: string | null
): string {
  const url = new URL(sanitizeLinkedInReturnPath(returnTo), origin);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return url.toString();
}
