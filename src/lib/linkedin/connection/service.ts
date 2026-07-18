import "server-only";

import {
  computeTokenExpiresAt,
  fetchLinkedInUserInfo,
  refreshLinkedInAccessToken,
} from "@/lib/linkedin/oauth/client";
import type { LinkedInTokenResponse } from "@/lib/linkedin/oauth/types";
import {
  deriveLinkedInUiState,
  getLinkedInConnectionByUserId,
  getLinkedInTokensByUserId,
  isLinkedInTokenExpired,
  markLinkedInConnectionExpired,
  toPublicProfile,
  updateLinkedInConnectionProfile,
  updateLinkedInTokens,
} from "@/lib/linkedin/connection/repository";
import type { LinkedInConnectionStatusResponse } from "@/lib/linkedin/connection/types";
import { isLinkedInOAuthConfigured } from "@/lib/linkedin/oauth/config";

async function ensureFreshAccessToken(userId: string): Promise<string> {
  const [connection, tokens] = await Promise.all([
    getLinkedInConnectionByUserId(userId),
    getLinkedInTokensByUserId(userId),
  ]);

  if (!connection || !tokens) {
    throw new Error("LinkedIn is not connected for this user.");
  }

  if (!isLinkedInTokenExpired(connection.token_expires_at)) {
    return tokens.access_token;
  }

  if (!tokens.refresh_token) {
    await markLinkedInConnectionExpired(userId);
    throw new Error("LinkedIn access token expired. Reconnect required.");
  }

  const refreshed = await refreshLinkedInAccessToken(tokens.refresh_token);
  await persistTokenRefresh(userId, refreshed);

  return refreshed.access_token;
}

async function persistTokenRefresh(userId: string, tokenResponse: LinkedInTokenResponse): Promise<void> {
  const tokenExpiresAt = computeTokenExpiresAt(tokenResponse.expires_in);

  await updateLinkedInTokens(userId, {
    accessToken: tokenResponse.access_token,
    refreshToken: tokenResponse.refresh_token ?? null,
    scope: tokenResponse.scope ?? null,
  });

  const connection = await getLinkedInConnectionByUserId(userId);
  if (!connection) return;

  await updateLinkedInConnectionProfile(userId, {
    displayName: connection.display_name,
    email: connection.email,
    profilePictureUrl: connection.profile_picture_url,
    tokenExpiresAt,
    status: "connected",
  });
}

export async function getLinkedInConnectionStatusForUser(
  userId: string
): Promise<LinkedInConnectionStatusResponse> {
  const configured = isLinkedInOAuthConfigured();
  const record = await getLinkedInConnectionByUserId(userId);

  if (!record) {
    return {
      state: "not_connected",
      configured,
      profile: null,
    };
  }

  if (isLinkedInTokenExpired(record.token_expires_at) && record.status === "connected") {
    await markLinkedInConnectionExpired(userId);
    record.status = "expired";
  }

  const state = deriveLinkedInUiState(record);

  return {
    state,
    configured,
    profile: state === "not_connected" ? null : toPublicProfile(record),
  };
}

export async function syncLinkedInConnectionForUser(userId: string) {
  const accessToken = await ensureFreshAccessToken(userId);
  const profile = await fetchLinkedInUserInfo(accessToken);
  const connection = await getLinkedInConnectionByUserId(userId);

  if (!connection) {
    throw new Error("LinkedIn connection metadata missing.");
  }

  await updateLinkedInConnectionProfile(userId, {
    displayName: profile.name ?? connection.display_name,
    email: profile.email ?? connection.email,
    profilePictureUrl: profile.picture ?? connection.profile_picture_url,
    tokenExpiresAt: connection.token_expires_at,
    status: "connected",
  });

  return getLinkedInConnectionStatusForUser(userId);
}

export async function persistLinkedInOAuthResult(
  userId: string,
  tokenResponse: LinkedInTokenResponse,
  profile: Awaited<ReturnType<typeof fetchLinkedInUserInfo>>
) {
  const { saveLinkedInConnection } = await import("@/lib/linkedin/connection/repository");

  await saveLinkedInConnection({
    userId,
    memberId: profile.sub,
    displayName: profile.name ?? null,
    email: profile.email ?? null,
    profilePictureUrl: profile.picture ?? null,
    accessToken: tokenResponse.access_token,
    refreshToken: tokenResponse.refresh_token ?? null,
    scope: tokenResponse.scope ?? null,
    tokenExpiresAt: computeTokenExpiresAt(tokenResponse.expires_in),
  });
}
