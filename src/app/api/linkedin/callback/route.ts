import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { requireAuthenticatedUser } from "@/lib/auth/require-user";
import {
  getLinkedInConnectionStatusForUser,
  persistLinkedInOAuthResult,
} from "@/lib/linkedin/connection/service";
import {
  exchangeLinkedInAuthorizationCode,
  fetchLinkedInUserInfo,
} from "@/lib/linkedin/oauth/client";
import { isLinkedInOAuthConfigured } from "@/lib/linkedin/oauth/config";
import {
  LINKEDIN_OAUTH_STATE_COOKIE,
} from "@/lib/linkedin/oauth/constants";
import { buildLinkedInReturnUrl, getAppOriginFromRequest } from "@/lib/linkedin/oauth/request-origin";
import { parseLinkedInOAuthState } from "@/lib/linkedin/oauth/state-cookie";

export async function GET(request: Request) {
  const origin = getAppOriginFromRequest(request);
  const url = new URL(request.url);
  const oauthError = url.searchParams.get("error");
  const oauthErrorDescription = url.searchParams.get("error_description");

  if (oauthError) {
    return NextResponse.redirect(
      buildLinkedInReturnUrl(origin, {
        linkedin: "error",
        reason: oauthErrorDescription || oauthError,
      })
    );
  }

  if (!isLinkedInOAuthConfigured()) {
    return NextResponse.redirect(
      buildLinkedInReturnUrl(origin, {
        linkedin: "error",
        reason: "LinkedIn OAuth is not configured.",
      })
    );
  }

  const auth = await requireAuthenticatedUser();
  if (!auth.user) {
    return NextResponse.redirect(
      buildLinkedInReturnUrl(origin, {
        linkedin: "error",
        reason: "Please sign in to CareerOS before connecting LinkedIn.",
      })
    );
  }

  const code = url.searchParams.get("code");
  const stateParam = url.searchParams.get("state");

  const cookieStore = await cookies();
  const storedState = parseLinkedInOAuthState(cookieStore.get(LINKEDIN_OAUTH_STATE_COOKIE)?.value);

  cookieStore.delete(LINKEDIN_OAUTH_STATE_COOKIE);

  if (!code || !stateParam || !storedState || storedState.state !== stateParam) {
    return NextResponse.redirect(
      buildLinkedInReturnUrl(origin, {
        linkedin: "error",
        reason: "Invalid or expired LinkedIn authorization state.",
      })
    );
  }

  if (storedState.userId !== auth.user.id) {
    return NextResponse.redirect(
      buildLinkedInReturnUrl(origin, {
        linkedin: "error",
        reason: "LinkedIn authorization does not match the signed-in CareerOS user.",
      })
    );
  }

  try {
    const tokenResponse = await exchangeLinkedInAuthorizationCode(origin, code);
    const profile = await fetchLinkedInUserInfo(tokenResponse.access_token);

    await persistLinkedInOAuthResult(auth.user.id, tokenResponse, profile);

    return NextResponse.redirect(
      buildLinkedInReturnUrl(origin, {
        linkedin: "connected",
      })
    );
  } catch (error) {
    let reason = error instanceof Error ? error.message : "LinkedIn connection failed.";

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505"
    ) {
      reason = "This LinkedIn account is already connected to another CareerOS user.";
    }

    return NextResponse.redirect(
      buildLinkedInReturnUrl(origin, {
        linkedin: "error",
        reason,
      })
    );
  }
}
