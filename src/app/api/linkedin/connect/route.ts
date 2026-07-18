import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { requireAuthenticatedUser } from "@/lib/auth/require-user";
import { buildLinkedInAuthorizationUrl } from "@/lib/linkedin/oauth/client";
import { isLinkedInOAuthConfigured } from "@/lib/linkedin/oauth/config";
import { getAppOriginFromRequest } from "@/lib/linkedin/oauth/request-origin";
import {
  createLinkedInOAuthState,
  linkedInOAuthStateCookieOptions,
} from "@/lib/linkedin/oauth/state-cookie";

export async function GET(request: Request) {
  if (!isLinkedInOAuthConfigured()) {
    return NextResponse.json(
      { error: "LinkedIn OAuth is not configured on the server." },
      { status: 503 }
    );
  }

  const auth = await requireAuthenticatedUser();
  if (!auth.user) {
    return auth.response;
  }

  const origin = getAppOriginFromRequest(request);
  const returnTo = new URL(request.url).searchParams.get("returnTo") || "/linkedin";
  const { state, cookieValue } = createLinkedInOAuthState(auth.user.id, returnTo);
  const authorizationUrl = buildLinkedInAuthorizationUrl(origin, state);

  const cookieStore = await cookies();
  const cookieOptions = linkedInOAuthStateCookieOptions(process.env.NODE_ENV === "production");

  cookieStore.set(cookieOptions.name, cookieValue, {
    httpOnly: cookieOptions.httpOnly,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
    path: cookieOptions.path,
    maxAge: cookieOptions.maxAge,
  });

  return NextResponse.redirect(authorizationUrl);
}
