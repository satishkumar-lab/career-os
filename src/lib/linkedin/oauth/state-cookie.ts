import { createHmac, randomBytes, timingSafeEqual } from "crypto";

import {
  LINKEDIN_OAUTH_STATE_COOKIE,
  LINKEDIN_OAUTH_STATE_MAX_AGE_SECONDS,
} from "@/lib/linkedin/oauth/constants";
import { getLinkedInOAuthStateSecret } from "@/lib/linkedin/oauth/config";
import type { LinkedInOAuthStatePayload } from "@/lib/linkedin/oauth/types";

function signPayload(encodedPayload: string): string {
  return createHmac("sha256", getLinkedInOAuthStateSecret())
    .update(encodedPayload)
    .digest("base64url");
}

export function createLinkedInOAuthState(
  userId: string,
  returnTo: string
): { state: string; cookieValue: string } {
  const payload: LinkedInOAuthStatePayload = {
    state: randomBytes(24).toString("hex"),
    userId,
    returnTo,
    issuedAt: Date.now(),
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = signPayload(encodedPayload);

  return {
    state: payload.state,
    cookieValue: `${encodedPayload}.${signature}`,
  };
}

export function parseLinkedInOAuthState(cookieValue: string | undefined): LinkedInOAuthStatePayload | null {
  if (!cookieValue) return null;

  const [encodedPayload, signature] = cookieValue.split(".");
  if (!encodedPayload || !signature) return null;

  const expectedSignature = signPayload(encodedPayload);
  const provided = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    ) as LinkedInOAuthStatePayload;

    if (!payload.state || !payload.userId || !payload.issuedAt) {
      return null;
    }

    const ageMs = Date.now() - payload.issuedAt;
    if (ageMs > LINKEDIN_OAUTH_STATE_MAX_AGE_SECONDS * 1000) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function linkedInOAuthStateCookieOptions(isProduction: boolean) {
  return {
    name: LINKEDIN_OAUTH_STATE_COOKIE,
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
    maxAge: LINKEDIN_OAUTH_STATE_MAX_AGE_SECONDS,
  };
}
