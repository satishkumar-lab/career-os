"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";

import { LinkedInIcon } from "@/components/linkedin-agent/mission-control/linkedin-icon";
import { Button } from "@/components/ui/button";
import { cardShell, contentCardRadius, transitionPremium } from "@/lib/interaction-styles";
import { cn } from "@/lib/utils";

export interface OnboardingConnectStepProps {
  returnTo?: string;
}

export function OnboardingConnectStep({ returnTo = "/linkedin" }: OnboardingConnectStepProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  function handleConnect() {
    setIsConnecting(true);
    window.location.href = `/api/linkedin/connect?returnTo=${encodeURIComponent(returnTo)}`;
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Connect LinkedIn</h2>
        <p className="mt-1 text-[13.5px] text-muted-foreground">
          Link your LinkedIn account with LinkedIn&apos;s official OAuth flow. Tokens stay on the
          server and are never exposed to the browser.
        </p>
      </div>

      <div className={cn(contentCardRadius, "border border-border bg-card p-6 text-center shadow-xs")}>
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#0a66c2]/10">
          <LinkedInIcon className="size-5 text-[#0A66C2]" />
        </span>
        <p className="mt-4 text-[13.5px] font-medium text-foreground">Connect with LinkedIn</p>
        <p className="mt-1 text-xs text-muted-foreground">
          We store your member ID, name, email (if available), and profile picture only.
        </p>
        <Button
          type="button"
          variant="outline"
          className={cn("mt-4 rounded-2xl", transitionPremium)}
          onClick={handleConnect}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <LinkedInIcon className="size-3.5 text-[#0A66C2]" />
          )}
          Connect LinkedIn
        </Button>
      </div>

      <div className={cn(cardShell, "p-4")}>
        <p className="text-[12.5px] leading-relaxed text-muted-foreground">
          You can finish setup now and connect LinkedIn later from Mission Control. Your onboarding
          answers are saved so the AI workspace can personalize content as features launch.
        </p>
      </div>
    </div>
  );
}
