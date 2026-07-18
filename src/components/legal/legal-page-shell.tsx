import type { ReactNode } from "react";

import { CareerOsLogo } from "@/components/auth/careeros-logo";
import { APP_NAME } from "@/lib/auth/branding";
import { cardShell, contentCardRadius } from "@/lib/interaction-styles";
import { cn } from "@/lib/utils";

export interface LegalPageShellProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

export function LegalPageShell({ title, lastUpdated, children }: LegalPageShellProps) {
  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-8">
          <CareerOsLogo layout="horizontal" tone="default" size="sm" className="mb-6" />
          <p className="text-[11px] font-medium tracking-[0.08em] text-primary uppercase">
            Legal
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">
            {title}
          </h1>
          <p className="mt-2 text-[13px] text-muted-foreground">Last updated: {lastUpdated}</p>
        </header>

        <article className={cn(cardShell, contentCardRadius, "space-y-8 p-6 sm:p-8")}>
          {children}
        </article>

        <footer className="mt-8 text-center text-[12px] text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <p className="mt-1">
            Questions?{" "}
            <a href="mailto:support@careeros.app" className="font-medium text-primary hover:underline">
              support@careeros.app
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
