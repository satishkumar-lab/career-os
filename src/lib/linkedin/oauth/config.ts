import { LINKEDIN_OAUTH_SCOPES } from "@/lib/linkedin/oauth/constants";

function requireServerEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required server environment variable: ${name}`);
  }

  return value;
}

export function getLinkedInClientId(): string {
  return requireServerEnv("LINKEDIN_CLIENT_ID");
}

export function getLinkedInClientSecret(): string {
  return requireServerEnv("LINKEDIN_CLIENT_SECRET");
}

export function getLinkedInOAuthStateSecret(): string {
  return process.env.LINKEDIN_OAUTH_STATE_SECRET?.trim() || getLinkedInClientSecret();
}

export function getLinkedInRedirectUri(origin: string): string {
  return `${origin.replace(/\/+$/, "")}/api/linkedin/callback`;
}

export function getLinkedInScopeParam(): string {
  return LINKEDIN_OAUTH_SCOPES.join(" ");
}

export function isLinkedInOAuthConfigured(): boolean {
  return Boolean(process.env.LINKEDIN_CLIENT_ID?.trim() && process.env.LINKEDIN_CLIENT_SECRET?.trim());
}
