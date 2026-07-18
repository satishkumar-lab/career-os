import type { Metadata } from "next";

import { LegalList, LegalSection } from "@/components/legal/legal-section";
import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { APP_NAME } from "@/lib/auth/branding";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${APP_NAME} collects, uses, and protects your information.`,
};

const LAST_UPDATED = "July 18, 2026";

export default function PrivacyPage() {
  return (
    <LegalPageShell title="Privacy Policy" lastUpdated={LAST_UPDATED}>
      <LegalSection id="introduction" title="Introduction">
        <p>
          {APP_NAME} (&quot;CareerOS,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is a
          personal career growth platform. This Privacy Policy explains how we collect, use, store,
          and protect information when you use our website and services.
        </p>
        <p>
          By using CareerOS, you agree to the practices described in this policy. If you do not
          agree, please do not use the service.
        </p>
      </LegalSection>

      <LegalSection id="information-we-collect" title="Information We Collect">
        <p>We may collect the following categories of information:</p>
        <LegalList
          items={[
            "Account information — such as your name, email address, and profile photo when you sign in through Google via Supabase Authentication.",
            "Career and productivity data — including learning progress, certifications, projects, goals, job applications, portfolio items, and content you choose to store in CareerOS.",
            "LinkedIn connection data — when you explicitly connect LinkedIn, we store your LinkedIn member identifier, display name, email (if provided by LinkedIn), profile picture URL, and connection timestamps.",
            "Usage information — such as feature interactions and technical logs needed to operate, secure, and improve the service.",
            "Device and browser information — including IP address, browser type, and general usage data collected through standard web technologies.",
          ]}
        />
      </LegalSection>

      <LegalSection id="how-we-use" title="How We Use Your Information">
        <p>We use your information to:</p>
        <LegalList
          items={[
            "Provide, maintain, and improve CareerOS features.",
            "Authenticate you and keep your account secure.",
            "Personalize your experience, including AI-assisted career insights you request.",
            "Sync and display LinkedIn profile information when you choose to connect your account.",
            "Respond to support requests and communicate service-related updates.",
            "Detect, prevent, and address fraud, abuse, or security issues.",
            "Comply with applicable legal obligations.",
          ]}
        />
        <p>We do not sell your personal information.</p>
      </LegalSection>

      <LegalSection id="linkedin-oauth" title="LinkedIn OAuth">
        <p>
          CareerOS connects to LinkedIn only after you give explicit permission through LinkedIn&apos;s
          official OAuth 2.0 authorization flow.
        </p>
        <LegalList
          items={[
            "CareerOS never posts to LinkedIn without your consent.",
            "You can disconnect LinkedIn at any time from within CareerOS.",
            "OAuth access credentials are stored securely on our servers and are never exposed to the browser or client-side application code.",
            "We use LinkedIn data only to provide features you initiate, such as profile sync and career tools you choose to use.",
            "CareerOS does not display LinkedIn analytics such as followers, profile views, or impressions unless officially supported by LinkedIn APIs and explicitly enabled by you in the future.",
          ]}
        />
      </LegalSection>

      <LegalSection id="third-party-services" title="Third-Party Services">
        <p>CareerOS relies on trusted third-party providers to operate, including:</p>
        <LegalList
          items={[
            "Supabase — authentication and secure database hosting.",
            "Google — sign-in provider when you choose to authenticate with Google.",
            "LinkedIn — optional account connection when you authorize OAuth access.",
            "Vercel — application hosting and delivery.",
            "AI service providers — when you use AI-powered features you request.",
          ]}
        />
        <p>
          These providers process data according to their own privacy policies and our agreements
          with them. We share only the information necessary to provide the relevant service.
        </p>
      </LegalSection>

      <LegalSection id="ai-processing" title="AI Processing">
        <p>
          Some CareerOS features use artificial intelligence to generate suggestions, drafts, or
          insights based on information in your account. AI outputs are provided for your review
          and are not automatically published to third-party platforms.
        </p>
        <p>
          When you use AI features, relevant context from your CareerOS data may be processed to
          generate a response. We design these flows so that you remain in control of what is
          created, edited, and shared.
        </p>
      </LegalSection>

      <LegalSection id="data-security" title="Data Security">
        <p>
          We follow industry-standard security practices to protect your information, including
          encrypted connections (HTTPS), access controls, and secure storage of sensitive
          credentials such as OAuth tokens on the server.
        </p>
        <p>
          No method of transmission or storage is completely secure. While we work to protect your
          data, we cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection id="cookies" title="Cookies">
        <p>
          CareerOS uses cookies and similar technologies to maintain your session, remember
          preferences such as theme settings, and keep the service secure.
        </p>
        <p>
          You can control cookies through your browser settings. Disabling certain cookies may limit
          some functionality, including authentication.
        </p>
      </LegalSection>

      <LegalSection id="user-rights" title="User Rights">
        <p>Depending on your location, you may have the right to:</p>
        <LegalList
          items={[
            "Access the personal information we hold about you.",
            "Request correction of inaccurate information.",
            "Request deletion of your account and associated data, subject to legal retention requirements.",
            "Withdraw consent for optional integrations such as LinkedIn.",
            "Object to or restrict certain processing where applicable law provides those rights.",
          ]}
        />
        <p>
          To exercise these rights, contact us at{" "}
          <a href="mailto:support@careeros.app" className="font-medium text-primary hover:underline">
            support@careeros.app
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection id="disconnecting-linkedin" title="Disconnecting LinkedIn">
        <p>
          You may disconnect your LinkedIn account at any time from CareerOS. When you disconnect,
          we remove stored LinkedIn OAuth credentials and associated connection metadata from our
          systems, except where retention is required by law or for legitimate security purposes
          such as audit logs.
        </p>
        <p>
          Disconnecting LinkedIn stops CareerOS from accessing your LinkedIn profile on your behalf
          until you choose to reconnect.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="Contact">
        <p>
          If you have questions about this Privacy Policy or our data practices, contact us at{" "}
          <a href="mailto:support@careeros.app" className="font-medium text-primary hover:underline">
            support@careeros.app
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection id="policy-updates" title="Policy Updates">
        <p>
          We may update this Privacy Policy from time to time. When we do, we will revise the
          &quot;Last updated&quot; date at the top of this page. Material changes may be communicated
          through the service or by email where appropriate.
        </p>
        <p>Your continued use of CareerOS after an update constitutes acceptance of the revised policy.</p>
      </LegalSection>
    </LegalPageShell>
  );
}
