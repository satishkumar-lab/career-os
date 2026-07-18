import { NextResponse } from "next/server";

import { requireAuthenticatedUser } from "@/lib/auth/require-user";
import { deleteLinkedInConnection } from "@/lib/linkedin/connection/repository";

import { isLinkedInOAuthConfigured } from "@/lib/linkedin/oauth/config";

export async function POST() {
  const auth = await requireAuthenticatedUser();
  if (!auth.user) {
    return auth.response;
  }

  await deleteLinkedInConnection(auth.user.id);

  return NextResponse.json({
    state: "not_connected",
    configured: isLinkedInOAuthConfigured(),
    profile: null,
  });
}
