import { NextResponse } from "next/server";

import { requireAuthenticatedUser } from "@/lib/auth/require-user";
import { syncLinkedInConnectionForUser } from "@/lib/linkedin/connection/service";
import { isLinkedInOAuthConfigured } from "@/lib/linkedin/oauth/config";

export async function POST() {
  if (!isLinkedInOAuthConfigured()) {
    return NextResponse.json(
      { error: "LinkedIn OAuth is not configured on the server." },
      { status: 503 }
    );
  }

  const auth = await requireAuthenticatedUser();
  if (!auth.user) {
    return auth.response;
  }

  try {
    const status = await syncLinkedInConnectionForUser(auth.user.id);
    return NextResponse.json(status);
  } catch (error) {
    const message = error instanceof Error ? error.message : "LinkedIn sync failed.";
    const statusCode = message.includes("Reconnect") ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
