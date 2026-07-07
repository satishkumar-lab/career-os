"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AuthLoadingScreen } from "@/components/auth/auth-loading-screen";
import { LoginCard } from "@/components/auth/login-card";
import { LoginHeroPanel } from "@/components/auth/login-hero-panel";
import { DarkModeToggle } from "@/components/layout/dark-mode-toggle";
import { ToastProvider } from "@/components/shared/toast-provider";
import { DASHBOARD_PATH } from "@/lib/auth/routes";
import { createClient } from "@/lib/supabase/client";

export interface LoginPageShellProps {
  authError?: string | null;
}

function LoginPageContent({ authError }: LoginPageShellProps) {
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function verifySession() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (cancelled) {
        return;
      }

      if (user) {
        router.replace(DASHBOARD_PATH);
        return;
      }

      setIsCheckingSession(false);
    }

    void verifySession();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (isCheckingSession) {
    return <AuthLoadingScreen message="Checking your session…" />;
  }

  return (
    <div className="grid min-h-svh bg-background lg:grid-cols-2">
      <LoginHeroPanel />

      <div className="relative flex flex-col items-center justify-center px-4 py-10 sm:px-8">
        <div className="absolute top-4 right-4">
          <DarkModeToggle className="w-auto" />
        </div>

        <LoginCard authError={authError} />
      </div>
    </div>
  );
}

export function LoginPageShell(props: LoginPageShellProps) {
  return (
    <ToastProvider>
      <LoginPageContent {...props} />
    </ToastProvider>
  );
}
