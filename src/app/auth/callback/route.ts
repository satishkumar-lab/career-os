import { NextResponse } from "next/server";

import {
  getAuthRedirectOriginFromRequest,
  getAuthSuccessPath,
} from "@/lib/auth/app-origin";
import { LOGIN_PATH } from "@/lib/auth/routes";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? getAuthSuccessPath();
  const redirectOrigin = getAuthRedirectOriginFromRequest(request);
  const redirectPath = next.startsWith("/") ? next : getAuthSuccessPath();

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${redirectOrigin}${redirectPath}`);
    }
  }

  return NextResponse.redirect(`${redirectOrigin}${LOGIN_PATH}?error=auth`);
}
