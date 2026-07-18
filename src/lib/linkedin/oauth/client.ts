import {
  LINKEDIN_AUTHORIZE_URL,
  LINKEDIN_TOKEN_URL,
  LINKEDIN_USERINFO_URL,
} from "@/lib/linkedin/oauth/constants";
import {
  getLinkedInClientId,
  getLinkedInClientSecret,
  getLinkedInRedirectUri,
  getLinkedInScopeParam,
} from "@/lib/linkedin/oauth/config";
import type { LinkedInTokenResponse, LinkedInUserInfo } from "@/lib/linkedin/oauth/types";

export function buildLinkedInAuthorizationUrl(origin: string, state: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: getLinkedInClientId(),
    redirect_uri: getLinkedInRedirectUri(origin),
    state,
    scope: getLinkedInScopeParam(),
  });

  return `${LINKEDIN_AUTHORIZE_URL}?${params.toString()}`;
}

async function parseLinkedInError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string; error_description?: string };
    return body.error_description || body.error || `LinkedIn request failed (${response.status})`;
  } catch {
    return `LinkedIn request failed (${response.status})`;
  }
}

export async function exchangeLinkedInAuthorizationCode(
  origin: string,
  code: string
): Promise<LinkedInTokenResponse> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: getLinkedInClientId(),
    client_secret: getLinkedInClientSecret(),
    redirect_uri: getLinkedInRedirectUri(origin),
  });

  const response = await fetch(LINKEDIN_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseLinkedInError(response));
  }

  return (await response.json()) as LinkedInTokenResponse;
}

export async function refreshLinkedInAccessToken(refreshToken: string): Promise<LinkedInTokenResponse> {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: getLinkedInClientId(),
    client_secret: getLinkedInClientSecret(),
  });

  const response = await fetch(LINKEDIN_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseLinkedInError(response));
  }

  return (await response.json()) as LinkedInTokenResponse;
}

export async function fetchLinkedInUserInfo(accessToken: string): Promise<LinkedInUserInfo> {
  const response = await fetch(LINKEDIN_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseLinkedInError(response));
  }

  return (await response.json()) as LinkedInUserInfo;
}

export function computeTokenExpiresAt(expiresInSeconds: number): string {
  return new Date(Date.now() + expiresInSeconds * 1000).toISOString();
}
