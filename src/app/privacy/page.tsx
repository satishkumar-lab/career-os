import Link from "next/link";

import { CareerOsLogo } from "@/components/auth/careeros-logo";
import { APP_NAME } from "@/lib/auth/branding";
import { cardShell } from "@/lib/interaction-styles";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-12">
      <div className={`${cardShell} w-full max-w-lg p-8`}>
        <CareerOsLogo layout="horizontal" tone="default" size="sm" className="mb-6 justify-center" />
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Privacy Policy</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {APP_NAME} stores your career data locally in your browser and authenticates you through
          Google via Supabase. We do not sell your personal information.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
