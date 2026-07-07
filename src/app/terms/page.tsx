import Link from "next/link";

import { CareerOsLogo } from "@/components/auth/careeros-logo";
import { APP_NAME } from "@/lib/auth/branding";
import { cardShell } from "@/lib/interaction-styles";

export default function TermsPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-12">
      <div className={`${cardShell} w-full max-w-lg p-8`}>
        <CareerOsLogo layout="horizontal" tone="default" size="sm" className="mb-6 justify-center" />
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Terms of Service</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          By using {APP_NAME}, you agree to use the platform responsibly for personal career
          development. These terms may be updated as the product evolves.
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
