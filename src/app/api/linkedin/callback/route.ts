import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { requireAuthenticatedUser } from "@/lib/auth/require-user";
import { persistLinkedInOAuthResult } from "@/lib/linkedin/connection/service";
import { isPostgresUniqueViolation } from "@/lib/linkedin/connection/repository";
import {
  exchangeLinkedInAuthorizationCode,
  fetchLinkedInUserInfo,
} from "@/lib/linkedin/oauth/client";
import { isLinkedInOAuthConfigured } from "@/lib/linkedin/oauth/config";
import {
  LINKEDIN_OAUTH_STATE_COOKIE,
} from "@/lib/linkedin/oauth/constants";
import {
  buildLinkedInReturnUrl,
  getLinkedInOAuthOriginFromRequest,
} from "@/lib/linkedin/oauth/request-origin";
import { parseLinkedInOAuthState } from "@/lib/linkedin/oauth/state-cookie";

export async function GET(request: Request) {
  const origin = getLinkedInOAuthOriginFromRequest(request);
  const url = new URL(request.url);
  const oauthError = url.searchParams.get("error");
  const oauthErrorDescription = url.searchParams.get("error_description");

  const cookieStore = await cookies();
  const storedState = parseLinkedInOAuthState(cookieStore.get(LINKEDIN_OAUTH_STATE_COOKIE)?.value);
  const returnTo = storedState?.returnTo;

  function redirectWithResult(params: Record<string, string>) {
    return NextResponse.redirect(buildLinkedInReturnUrl(origin, params, returnTo));
  }

  if (oauthError) {
    cookieStore.delete(LINKEDIN_OAUTH_STATE_COOKIE);

    return redirectWithResult({
      linkedin: "error",
      reason: oauthErrorDescription || oauthError,
    });
  }

  if (!isLinkedInOAuthConfigured()) {
    return redirectWithResult({
      linkedin: "error",
      reason: "LinkedIn OAuth is not configured.",
    });
  }

  const auth = await requireAuthenticatedUser();
  if (!auth.user) {
    cookieStore.delete(LINKEDIN_OAUTH_STATE_COOKIE);

    return redirectWithResult({
      linkedin: "error",
      reason: "Please sign in to CareerOS before connecting LinkedIn.",
    });
  }

  const code = url.searchParams.get("code");
  const stateParam = url.searchParams.get("state");

  cookieStore.delete(LINKEDIN_OAUTH_STATE_COOKIE);

  if (!code || !stateParam || !storedState || storedState.state !== stateParam) {
    return redirectWithResult({
      linkedin: "error",
      reason: "Invalid or expired LinkedIn authorization state.",
    });
  }

  if (storedState.userId !== auth.user.id) {
    return redirectWithResult({
      linkedin: "error",
      reason: "LinkedIn authorization does not match the signed-in CareerOS user.",
    });
  }

  try {
    const tokenResponse = await exchangeLinkedInAuthorizationCode(origin, code);
    const profile = await fetchLinkedInUserInfo(tokenResponse.access_token);

    if (!profile.sub) {
      throw new Error("LinkedIn did not return a member identifier.");
    }

    await persistLinkedInOAuthResult(auth.user.id, tokenResponse, profile);

    return redirectWithResult({
      linkedin: "connected",
    });
  } catch (error) {
    let reason = error instanceof Error ? error.message : "LinkedIn connection failed.";

    if (isPostgresUniqueViolation(error)) {
      reason = "This LinkedIn account is already connected to another CareerOS user.";
    }

    return redirectWithResult({
      linkedin: "error",
      reason,
    });
  }
}
