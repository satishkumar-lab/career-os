"use client";

import { Suspense } from "react";

import { LinkedInMissionControl } from "@/components/linkedin-agent/mission-control/linkedin-mission-control";
import { ToastProvider } from "@/components/shared/toast-provider";

export function AiLinkedInAgentPageContent() {
  return (
    <ToastProvider>
      <Suspense fallback={<div className="mx-auto max-w-6xl p-6 text-sm text-muted-foreground">Loading Mission Control…</div>}>
        <LinkedInMissionControl />
      </Suspense>
    </ToastProvider>
  );
}
