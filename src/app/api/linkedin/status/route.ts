import { NextResponse } from "next/server";

import { requireAuthenticatedUser } from "@/lib/auth/require-user";
import { getLinkedInConnectionStatusForUser } from "@/lib/linkedin/connection/service";

export async function GET() {
  const auth = await requireAuthenticatedUser();
  if (!auth.user) {
    return auth.response;
  }

  const status = await getLinkedInConnectionStatusForUser(auth.user.id);
  return NextResponse.json(status);
}
