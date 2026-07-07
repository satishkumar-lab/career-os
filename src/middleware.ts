import { NextResponse, type NextRequest } from "next/server";

import {
  AUTH_CALLBACK_PATH,
  DASHBOARD_PATH,
  isPublicPath,
  LOGIN_PATH,
} from "@/lib/auth/routes";
import { createMiddlewareClient } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let the auth callback route handler exchange the OAuth code without
  // middleware session checks interfering with cookie writes.
  if (pathname === AUTH_CALLBACK_PATH) {
    return NextResponse.next();
  }

  const { supabase, supabaseResponse } = createMiddlewareClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = user ? DASHBOARD_PATH : LOGIN_PATH;
    return NextResponse.redirect(url);
  }

  if (user && pathname === LOGIN_PATH) {
    const url = request.nextUrl.clone();
    url.pathname = DASHBOARD_PATH;
    return NextResponse.redirect(url);
  }

  if (!user && !isPublicPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
