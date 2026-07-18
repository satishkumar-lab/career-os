"use client";

import { MessageSquare, Sparkles } from "lucide-react";

import { LinkedInConnectionPanel } from "@/components/linkedin-agent/mission-control/linkedin-connection-panel";
import { Button } from "@/components/ui/button";
import type { LinkedInConnectionStatusResponse } from "@/lib/linkedin/connection/types";
import { transitionPremium } from "@/lib/interaction-styles";
import { cn } from "@/lib/utils";

export interface MissionControlHeaderProps {
  connectionStatus: LinkedInConnectionStatusResponse;
  isConnectionLoading?: boolean;
  isConnecting?: boolean;
  isSyncing?: boolean;
  isDisconnecting?: boolean;
  onConnect: () => void;
  onSync: () => void;
  onDisconnect: () => void;
  onOpenCoach: () => void;
}

export function MissionControlHeader({
  connectionStatus,
  isConnectionLoading = false,
  isConnecting = false,
  isSyncing = false,
  isDisconnecting = false,
  onConnect,
  onSync,
  onDisconnect,
  onOpenCoach,
}: MissionControlHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-medium tracking-[0.08em] text-primary uppercase">
            LinkedIn Mission Control
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-[26px]">
            AI Career Command Center
          </h1>
          <p className="mt-1 max-w-xl text-[13.5px] leading-relaxed text-muted-foreground">
            Proactive intelligence for your professional growth — powered by CareerOS
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn("h-8 gap-1.5 rounded-xl text-[12px]", transitionPremium)}
          onClick={onOpenCoach}
        >
          <MessageSquare className="size-3.5" />
          Ask AI Coach
        </Button>
      </div>

      <LinkedInConnectionPanel
        status={connectionStatus}
        isLoading={isConnectionLoading}
        isConnecting={isConnecting}
        isSyncing={isSyncing}
        isDisconnecting={isDisconnecting}
        onConnect={onConnect}
        onSync={onSync}
        onDisconnect={onDisconnect}
      />
    </div>
  );
}

export function MissionControlHeaderAccent() {
  return (
    <span
      className="inline-flex size-5 items-center justify-center rounded-lg shadow-sm"
      style={{ backgroundImage: "linear-gradient(135deg, #17a5fb 0%, #e80584 100%)" }}
    >
      <Sparkles className="size-3 text-white" />
    </span>
  );
}
