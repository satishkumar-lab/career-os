export interface LinkedInTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  refresh_token_expires_in?: number;
  scope?: string;
  token_type?: string;
  id_token?: string;
}

export interface LinkedInUserInfo {
  sub: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email?: string;
  email_verified?: boolean;
  locale?: string;
}

export interface LinkedInOAuthStatePayload {
  state: string;
  userId: string;
  returnTo: string;
  issuedAt: number;
}
