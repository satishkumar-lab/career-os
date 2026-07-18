import "server-only";

import {
  LINKEDIN_CONNECTIONS_TABLE,
  LINKEDIN_OAUTH_TOKENS_TABLE,
} from "@/lib/linkedin/oauth/constants";
import type {
  LinkedInConnectionRecord,
  LinkedInOAuthTokenRecord,
  SaveLinkedInConnectionInput,
} from "@/lib/linkedin/connection/types";
import { createAdminClient } from "@/lib/supabase/admin";

function normalizeConnection(row: Record<string, unknown>): LinkedInConnectionRecord {
  return {
    user_id: String(row.user_id),
    linkedin_member_id: String(row.linkedin_member_id),
    display_name: (row.display_name as string | null) ?? null,
    email: (row.email as string | null) ?? null,
    profile_picture_url: (row.profile_picture_url as string | null) ?? null,
    connected_at: String(row.connected_at),
    last_synced_at: (row.last_synced_at as string | null) ?? null,
    token_expires_at: String(row.token_expires_at),
    status: row.status as LinkedInConnectionRecord["status"],
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export async function getLinkedInConnectionByUserId(
  userId: string
): Promise<LinkedInConnectionRecord | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from(LINKEDIN_CONNECTIONS_TABLE)
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? normalizeConnection(data) : null;
}

export async function getLinkedInTokensByUserId(
  userId: string
): Promise<LinkedInOAuthTokenRecord | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from(LINKEDIN_OAUTH_TOKENS_TABLE)
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) return null;

  return {
    user_id: String(data.user_id),
    access_token: String(data.access_token),
    refresh_token: (data.refresh_token as string | null) ?? null,
    token_type: String(data.token_type ?? "Bearer"),
    scope: (data.scope as string | null) ?? null,
    created_at: String(data.created_at),
    updated_at: String(data.updated_at),
  };
}

export async function saveLinkedInConnection(input: SaveLinkedInConnectionInput): Promise<void> {
  const supabase = createAdminClient();
  const now = new Date().toISOString();

  const { error: connectionError } = await supabase.from(LINKEDIN_CONNECTIONS_TABLE).upsert(
    {
      user_id: input.userId,
      linkedin_member_id: input.memberId,
      display_name: input.displayName,
      email: input.email,
      profile_picture_url: input.profilePictureUrl,
      connected_at: now,
      last_synced_at: now,
      token_expires_at: input.tokenExpiresAt,
      status: "connected",
    },
    { onConflict: "user_id" }
  );

  if (connectionError) {
    throw connectionError;
  }

  const { error: tokenError } = await supabase.from(LINKEDIN_OAUTH_TOKENS_TABLE).upsert(
    {
      user_id: input.userId,
      access_token: input.accessToken,
      refresh_token: input.refreshToken,
      token_type: "Bearer",
      scope: input.scope,
    },
    { onConflict: "user_id" }
  );

  if (tokenError) {
    throw tokenError;
  }
}

export async function updateLinkedInConnectionProfile(
  userId: string,
  profile: {
    displayName: string | null;
    email: string | null;
    profilePictureUrl: string | null;
    tokenExpiresAt: string;
    status: LinkedInConnectionRecord["status"];
  }
): Promise<void> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from(LINKEDIN_CONNECTIONS_TABLE)
    .update({
      display_name: profile.displayName,
      email: profile.email,
      profile_picture_url: profile.profilePictureUrl,
      token_expires_at: profile.tokenExpiresAt,
      status: profile.status,
      last_synced_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
}

export async function updateLinkedInTokens(
  userId: string,
  tokens: {
    accessToken: string;
    refreshToken: string | null;
    scope: string | null;
  }
): Promise<void> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from(LINKEDIN_OAUTH_TOKENS_TABLE)
    .update({
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      scope: tokens.scope,
    })
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
}

export async function markLinkedInConnectionExpired(userId: string): Promise<void> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from(LINKEDIN_CONNECTIONS_TABLE)
    .update({ status: "expired" })
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
}

export async function deleteLinkedInConnection(userId: string): Promise<void> {
  const supabase = createAdminClient();

  const { error: tokenError } = await supabase
    .from(LINKEDIN_OAUTH_TOKENS_TABLE)
    .delete()
    .eq("user_id", userId);

  if (tokenError) {
    throw tokenError;
  }

  const { error: connectionError } = await supabase
    .from(LINKEDIN_CONNECTIONS_TABLE)
    .delete()
    .eq("user_id", userId);

  if (connectionError) {
    throw connectionError;
  }
}

export function isLinkedInTokenExpired(tokenExpiresAt: string): boolean {
  return Date.parse(tokenExpiresAt) <= Date.now();
}

export function toPublicProfile(record: LinkedInConnectionRecord) {
  return {
    linkedinMemberId: record.linkedin_member_id,
    displayName: record.display_name,
    email: record.email,
    profilePictureUrl: record.profile_picture_url,
    connectedAt: record.connected_at,
    lastSyncedAt: record.last_synced_at,
    tokenExpiresAt: record.token_expires_at,
  };
}

export function deriveLinkedInUiState(
  record: LinkedInConnectionRecord | null
): "not_connected" | "connected" | "expired" {
  if (!record || record.status === "revoked") {
    return "not_connected";
  }

  if (record.status === "expired" || isLinkedInTokenExpired(record.token_expires_at)) {
    return "expired";
  }

  return "connected";
}
