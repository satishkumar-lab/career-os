import { NextResponse } from "next/server";

import { DASHBOARD_PATH, LOGIN_PATH } from "@/lib/auth/routes";
import { createClient } from "@/lib/supabase/server";

function getRedirectOrigin(request: Request): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";
  const { origin } = new URL(request.url);

  if (process.env.VERCEL && forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  return origin;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? DASHBOARD_PATH;
  const redirectOrigin = getRedirectOrigin(request);
  const redirectPath = next.startsWith("/") ? next : DASHBOARD_PATH;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${redirectOrigin}${redirectPath}`);
    }
  }

  return NextResponse.redirect(`${redirectOrigin}${LOGIN_PATH}?error=auth`);
}
