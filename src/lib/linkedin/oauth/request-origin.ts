import { getAuthRedirectOriginFromRequest } from "@/lib/auth/app-origin";

export function getAppOriginFromRequest(request: Request): string {
  return getAuthRedirectOriginFromRequest(request);
}

export function buildLinkedInReturnUrl(origin: string, params: Record<string, string>): string {
  const url = new URL("/linkedin", origin);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return url.toString();
}
