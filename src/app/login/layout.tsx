import type { Metadata } from "next";

import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE } from "@/lib/auth/branding";

export const metadata: Metadata = {
  title: "Sign in",
  description: `${APP_TAGLINE} Sign in to ${APP_NAME} with your Google account.`,
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
