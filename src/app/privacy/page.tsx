import Link from "next/link";

import { CareerOsLogo } from "@/components/auth/careeros-logo";
import { APP_NAME } from "@/lib/auth/branding";
import { cardShell } from "@/lib/interaction-styles";

const LAST_UPDATED = "July 18, 2026";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-svh flex-col items-center bg-background px-4 py-12">
      <div className={`${cardShell} w-full max-w-2xl p-8 sm:p-10`}>
        <CareerOsLogo layout="horizontal" tone="default" size="sm" className="mb-6 justify-center" />

        <h1 className="text-xl font-semibold tracking-tight text-foreground">Privacy Policy</h1>
        <p className="mt-2 text-[12px] text-muted-foreground">Last updated: {LAST_UPDATED}</p>

        <div className="mt-6 space-y-5 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-[13px] font-medium text-foreground">Overview</h2>
            <p className="mt-2">
              {APP_NAME} is a personal career dashboard. This policy explains what information we
              collect, how we use it, and how we protect it when you use our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-[13px] font-medium text-foreground">Sign in with Google</h2>
            <p className="mt-2">
              We use Supabase Authentication to sign you in with Google. When you sign in, we may
              receive your name, email address, and profile picture to create and maintain your
              {APP_NAME} account.
            </p>
          </section>

          <section>
            <h2 className="text-[13px] font-medium text-foreground">LinkedIn connection (optional)</h2>
            <p className="mt-2">
              If you choose to connect your LinkedIn account, {APP_NAME} uses LinkedIn&apos;s official
              OAuth 2.0 and OpenID Connect flow. With your permission, we may receive:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>LinkedIn member ID</li>
              <li>Name</li>
              <li>Email address (if LinkedIn provides it)</li>
              <li>Profile picture URL</li>
            </ul>
            <p className="mt-2">
              LinkedIn access and refresh tokens are stored securely on our servers and are never
              exposed to the browser. We use this connection only to sync your basic profile and
              support {APP_NAME} LinkedIn features you explicitly use.
            </p>
            <p className="mt-2">
              We do not collect or display LinkedIn analytics such as follower counts, profile
              views, impressions, or engagement metrics unless you add such features in the future
              and we update this policy.
            </p>
            <p className="mt-2">
              You can disconnect LinkedIn at any time from the LinkedIn section in {APP_NAME}.
            </p>
          </section>

          <section>
            <h2 className="text-[13px] font-medium text-foreground">Career data in the app</h2>
            <p className="mt-2">
              Career modules you use (learning, projects, certifications, goals, job tracking, and
              similar features) may store data in your browser and, where enabled, in your account
              on our backend. This data is used to power your personal dashboard and AI-assisted
              recommendations inside {APP_NAME}.
            </p>
          </section>

          <section>
            <h2 className="text-[13px] font-medium text-foreground">How we use your information</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Authenticate you and keep your account secure</li>
              <li>Provide and improve {APP_NAME} features you use</li>
              <li>Connect optional third-party services you authorize (such as LinkedIn)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[13px] font-medium text-foreground">Sharing and sale of data</h2>
            <p className="mt-2">
              We do not sell your personal information. We share data only with service providers
              required to operate {APP_NAME} (for example, Supabase for authentication and database
              hosting) and when required by law.
            </p>
          </section>

          <section>
            <h2 className="text-[13px] font-medium text-foreground">Data retention and security</h2>
            <p className="mt-2">
              We retain your account and connection data while your account is active. When you
              disconnect LinkedIn or delete your account, associated connection data is removed from
              our systems. We use industry-standard security practices, including encrypted
              connections (HTTPS) and server-side storage for sensitive tokens.
            </p>
          </section>

          <section>
            <h2 className="text-[13px] font-medium text-foreground">Contact</h2>
            <p className="mt-2">
              For privacy questions about {APP_NAME}, contact the app owner through the LinkedIn
              Company Page associated with this application.
            </p>
          </section>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <Link href="/terms" className="font-medium text-primary hover:underline">
            Terms of Service
          </Link>
          <Link href="/login" className="font-medium text-primary hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
