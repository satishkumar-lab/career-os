/** Official LinkedIn OAuth 2.0 / OpenID Connect endpoints (Microsoft Learn). */
export const LINKEDIN_AUTHORIZE_URL = "https://www.linkedin.com/oauth/v2/authorization";
export const LINKEDIN_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";
export const LINKEDIN_USERINFO_URL = "https://api.linkedin.com/v2/userinfo";

/** Sign In with LinkedIn using OpenID Connect — official scopes. */
export const LINKEDIN_OAUTH_SCOPES = ["openid", "profile", "email"] as const;

export const LINKEDIN_OAUTH_STATE_COOKIE = "career_os_linkedin_oauth_state";
export const LINKEDIN_OAUTH_STATE_MAX_AGE_SECONDS = 600;

export const LINKEDIN_CONNECTIONS_TABLE = "linkedin_connections";
export const LINKEDIN_OAUTH_TOKENS_TABLE = "linkedin_oauth_tokens";
