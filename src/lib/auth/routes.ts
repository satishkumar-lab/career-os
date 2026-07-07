export const LOGIN_PATH = "/login";
export const DASHBOARD_PATH = "/dashboard";
export const AUTH_CALLBACK_PATH = "/auth/callback";
export const AUTH_SIGNOUT_PATH = "/auth/signout";

export const LEGAL_PATHS = ["/terms", "/privacy"] as const;

export const PUBLIC_PATHS = [
  LOGIN_PATH,
  AUTH_CALLBACK_PATH,
  AUTH_SIGNOUT_PATH,
  ...LEGAL_PATHS,
] as const;

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}
