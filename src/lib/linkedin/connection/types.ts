export type LinkedInConnectionStatus = "connected" | "expired" | "revoked";

export interface LinkedInConnectionRecord {
  user_id: string;
  linkedin_member_id: string;
  display_name: string | null;
  email: string | null;
  profile_picture_url: string | null;
  connected_at: string;
  last_synced_at: string | null;
  token_expires_at: string;
  status: LinkedInConnectionStatus;
  created_at: string;
  updated_at: string;
}

export interface LinkedInOAuthTokenRecord {
  user_id: string;
  access_token: string;
  refresh_token: string | null;
  token_type: string;
  scope: string | null;
  created_at: string;
  updated_at: string;
}

export interface LinkedInConnectionPublicProfile {
  linkedinMemberId: string;
  displayName: string | null;
  email: string | null;
  profilePictureUrl: string | null;
  connectedAt: string;
  lastSyncedAt: string | null;
  tokenExpiresAt: string;
}

export type LinkedInConnectionUiState = "not_connected" | "connecting" | "connected" | "expired";

export interface LinkedInConnectionStatusResponse {
  state: LinkedInConnectionUiState;
  configured: boolean;
  profile: LinkedInConnectionPublicProfile | null;
}

export interface SaveLinkedInConnectionInput {
  userId: string;
  memberId: string;
  displayName: string | null;
  email: string | null;
  profilePictureUrl: string | null;
  accessToken: string;
  refreshToken: string | null;
  scope: string | null;
  tokenExpiresAt: string;
}
