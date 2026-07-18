import type { Metadata } from "next";

import { LegalList, LegalSection } from "@/components/legal/legal-section";
import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { APP_NAME } from "@/lib/auth/branding";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms and conditions for using ${APP_NAME}.`,
};

const LAST_UPDATED = "July 18, 2026";

export default function TermsPage() {
  return (
    <LegalPageShell title="Terms of Service" lastUpdated={LAST_UPDATED}>
      <LegalSection id="acceptance" title="Acceptance of Terms">
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of {APP_NAME}
          (&quot;CareerOS,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). By creating an
          account or using the service, you agree to these Terms and our Privacy Policy.
        </p>
        <p>If you do not agree, you may not use CareerOS.</p>
      </LegalSection>

      <LegalSection id="user-accounts" title="User Accounts">
        <p>
          You must provide accurate account information and keep your credentials secure. You are
          responsible for all activity that occurs under your account.
        </p>
        <p>
          CareerOS uses third-party authentication providers such as Google. You are responsible for
          maintaining access to the email and identity provider associated with your account.
        </p>
        <p>
          We may suspend or terminate accounts that violate these Terms or pose a security risk.
        </p>
      </LegalSection>

      <LegalSection id="user-responsibilities" title="User Responsibilities">
        <p>You agree to use CareerOS lawfully and responsibly. You will not:</p>
        <LegalList
          items={[
            "Use the service for unlawful, harmful, or fraudulent purposes.",
            "Attempt to gain unauthorized access to CareerOS systems or other users' accounts.",
            "Upload malicious code or interfere with the operation of the platform.",
            "Misrepresent your identity or impersonate another person.",
            "Use CareerOS to spam, harass, or violate the rights of others.",
            "Reverse engineer or misuse the service except where permitted by law.",
          ]}
        />
        <p>
          You are solely responsible for the career content, posts, and communications you create or
          publish using information from CareerOS.
        </p>
      </LegalSection>

      <LegalSection id="ai-content" title="AI-Generated Content Disclaimer">
        <p>
          CareerOS may provide AI-generated suggestions, drafts, summaries, or recommendations.
          These outputs are provided for informational and productivity purposes only.
        </p>
        <LegalList
          items={[
            "AI content may be inaccurate, incomplete, or outdated.",
            "You are responsible for reviewing, editing, and approving any content before use or publication.",
            "CareerOS does not guarantee hiring outcomes, audience growth, or professional results.",
            "AI features do not constitute legal, financial, or professional advice.",
          ]}
        />
      </LegalSection>

      <LegalSection id="third-party-integrations" title="Third-Party Integrations">
        <p>
          CareerOS may integrate with third-party services such as LinkedIn, Google, and hosting or
          AI providers. Your use of those services is subject to their respective terms and policies.
        </p>
        <p>
          Optional integrations such as LinkedIn require your explicit authorization. CareerOS does
          not post to LinkedIn or other platforms without your consent. You may disconnect
          integrations at any time.
        </p>
        <p>
          We are not responsible for third-party service availability, changes, or actions taken on
          those platforms.
        </p>
      </LegalSection>

      <LegalSection id="intellectual-property" title="Intellectual Property">
        <p>
          CareerOS and its original content, features, branding, and software are owned by CareerOS
          and protected by applicable intellectual property laws.
        </p>
        <p>
          You retain ownership of the content you create and store in CareerOS. By using the
          service, you grant us a limited license to host, process, and display your content solely
          to operate and improve the platform.
        </p>
      </LegalSection>

      <LegalSection id="limitation-of-liability" title="Limitation of Liability">
        <p>
          CareerOS is provided on an &quot;as is&quot; and &quot;as available&quot; basis without
          warranties of any kind, whether express or implied, including merchantability, fitness
          for a particular purpose, and non-infringement.
        </p>
        <p>
          To the fullest extent permitted by law, CareerOS and its operators will not be liable for
          any indirect, incidental, special, consequential, or punitive damages, or any loss of
          profits, data, goodwill, or business opportunities arising from your use of the service.
        </p>
        <p>
          Our total liability for any claim relating to the service will not exceed the amount you
          paid us, if any, in the twelve months preceding the claim.
        </p>
      </LegalSection>

      <LegalSection id="termination" title="Termination">
        <p>
          You may stop using CareerOS at any time. We may suspend or terminate your access if you
          violate these Terms, create security or legal risk, or if we discontinue the service.
        </p>
        <p>
          Upon termination, your right to use CareerOS ends. Provisions that by their nature should
          survive termination — including disclaimers, limitations of liability, and intellectual
          property terms — will remain in effect.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="Contact">
        <p>
          For questions about these Terms, contact us at{" "}
          <a href="mailto:support@careeros.app" className="font-medium text-primary hover:underline">
            support@careeros.app
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
