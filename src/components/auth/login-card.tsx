"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Mail } from "lucide-react";

import { CareerOsLogo } from "@/components/auth/careeros-logo";
import { GoogleIcon } from "@/components/auth/google-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  APP_NAME,
  LOGIN_CARD_SUBTITLE,
  LOGIN_CARD_TITLE,
} from "@/lib/auth/branding";
import { getAuthCallbackUrl } from "@/lib/auth/app-origin";
import { cardShell } from "@/lib/interaction-styles";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/shared/toast-provider";
import { cn } from "@/lib/utils";

export interface LoginCardProps {
  authError?: string | null;
}

export function LoginCard({ authError }: LoginCardProps) {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (authError) {
      showToast(authError, { variant: "error" });
    }
  }, [authError, showToast]);

  async function handleGoogleSignIn() {
    setIsLoading(true);

    const supabase = createClient();
    const redirectTo = getAuthCallbackUrl();

    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (signInError) {
      showToast("Google sign-in failed. Please try again.", { variant: "error" });
      setIsLoading(false);
    }
  }

  return (
    <div
      className={cn(
        cardShell,
        "animate-in fade-in slide-in-from-bottom-4 w-full max-w-[420px] p-8 duration-500"
      )}
    >
      <div className="mb-8 lg:hidden">
        <CareerOsLogo layout="horizontal" tone="default" size="sm" className="justify-center" />
      </div>

      <div className="mb-8">
        <h2 className="text-[22px] font-semibold tracking-tight text-foreground">
          {LOGIN_CARD_TITLE}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {LOGIN_CARD_SUBTITLE}
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        size="lg"
        className="h-11 w-full rounded-2xl text-[13px] font-medium shadow-xs transition-[transform,box-shadow] duration-200 hover:shadow-sm active:scale-[0.99]"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        <GoogleIcon className="size-4" />
        {isLoading ? "Redirecting to Google…" : "Continue with Google"}
      </Button>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
          Or
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="email" className="text-[13px] font-medium text-foreground">
            Email
          </Label>
          <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-[10.5px] font-medium">
            Coming Soon
          </Badge>
        </div>
        <div className="relative">
          <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            disabled
            className="h-11 rounded-2xl pl-10 opacity-60"
          />
        </div>
      </div>

      <p className="mt-8 text-center text-[11px] leading-relaxed text-muted-foreground">
        By continuing, you agree to {APP_NAME}&apos;s{" "}
        <Link href="/terms" className="font-medium text-foreground underline-offset-4 hover:underline">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="font-medium text-foreground underline-offset-4 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
