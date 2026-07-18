"use client";

import { Check, Loader2, RefreshCw, Unplug } from "lucide-react";

import { LinkedInIcon } from "@/components/linkedin-agent/mission-control/linkedin-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { LinkedInConnectionStatusResponse } from "@/lib/linkedin/connection/types";
import { cardShell, contentCardRadius, transitionPremium } from "@/lib/interaction-styles";
import { cn } from "@/lib/utils";

function formatTimestamp(value: string | null | undefined): string {
  if (!value) return "Never";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function initials(name: string | null | undefined): string {
  if (!name) return "LI";

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export interface LinkedInConnectionPanelProps {
  status: LinkedInConnectionStatusResponse;
  isLoading?: boolean;
  isConnecting?: boolean;
  isSyncing?: boolean;
  isDisconnecting?: boolean;
  onConnect: () => void;
  onSync: () => void;
  onDisconnect: () => void;
}

export function LinkedInConnectionPanel({
  status,
  isLoading = false,
  isConnecting = false,
  isSyncing = false,
  isDisconnecting = false,
  onConnect,
  onSync,
  onDisconnect,
}: LinkedInConnectionPanelProps) {
  if (isLoading) {
    return (
      <div className={cn(cardShell, contentCardRadius, "flex min-h-[88px] items-center gap-3 p-4")}>
        <span className="size-9 animate-pulse rounded-full bg-muted" />
        <div className="space-y-2">
          <div className="h-3.5 w-36 animate-pulse rounded bg-muted" />
          <div className="h-3 w-52 animate-pulse rounded bg-muted/80" />
        </div>
      </div>
    );
  }

  if (!status.configured) {
    return (
      <div className={cn(cardShell, contentCardRadius, "p-4")}>
        <p className="text-[13px] font-medium text-foreground">LinkedIn OAuth not configured</p>
        <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
          Add LinkedIn credentials on the server to enable real account connection.
        </p>
      </div>
    );
  }

  if (status.state === "not_connected") {
    return (
      <div className={cn(cardShell, contentCardRadius, "flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between")}>
        <div>
          <p className="text-[13px] font-medium text-foreground">Connect your LinkedIn account</p>
          <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
            Use LinkedIn&apos;s official OAuth flow to link your profile securely.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn("h-9 gap-1.5 rounded-xl px-3 text-[12px]", transitionPremium)}
          onClick={onConnect}
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
    );
  }

  if (status.state === "expired") {
    return (
      <div className={cn(cardShell, contentCardRadius, "p-4")}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[13px] font-medium text-amber-700">LinkedIn connection expired</p>
            <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
              Your LinkedIn authorization expired. Reconnect to continue syncing your profile.
            </p>
            {status.profile?.displayName ? (
              <p className="mt-2 text-[12px] text-muted-foreground">
                Previously connected as {status.profile.displayName}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              className={cn("h-9 rounded-xl px-3 text-[12px]", transitionPremium)}
              onClick={onConnect}
              disabled={isConnecting}
            >
              {isConnecting ? <Loader2 className="size-3.5 animate-spin" /> : null}
              Reconnect LinkedIn
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn("h-9 rounded-xl px-3 text-[12px]", transitionPremium)}
              onClick={onDisconnect}
              disabled={isDisconnecting}
            >
              Disconnect
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const profile = status.profile;

  return (
    <div className={cn(cardShell, contentCardRadius, "p-4")}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <Avatar className="size-11 ring-1 ring-border/60">
            {profile?.profilePictureUrl ? (
              <AvatarImage src={profile.profilePictureUrl} alt={profile.displayName ?? "LinkedIn profile"} />
            ) : null}
            <AvatarFallback className="bg-muted/60 text-[11px] font-medium">
              {initials(profile?.displayName)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-emerald-700">
                <Check className="size-3.5" strokeWidth={2.5} />
                LinkedIn Connected
              </span>
              <LinkedInIcon className="size-3.5 text-[#0A66C2]" />
            </div>

            <p className="mt-1 text-[13px] text-foreground">
              Connected as{" "}
              <span className="font-medium">{profile?.displayName ?? "LinkedIn member"}</span>
            </p>

            {profile?.email ? (
              <p className="mt-0.5 truncate text-[12px] text-muted-foreground">{profile.email}</p>
            ) : null}

            <p className="mt-2 text-[11.5px] text-muted-foreground">
              Last synced · {formatTimestamp(profile?.lastSyncedAt)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={cn("h-9 gap-1.5 rounded-xl px-3 text-[12px]", transitionPremium)}
            onClick={onSync}
            disabled={isSyncing || isDisconnecting}
          >
            {isSyncing ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <RefreshCw className="size-3.5" />
            )}
            Sync Again
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className={cn("h-9 gap-1.5 rounded-xl px-3 text-[12px]", transitionPremium)}
            onClick={onDisconnect}
            disabled={isDisconnecting || isSyncing}
          >
            {isDisconnecting ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Unplug className="size-3.5" />
            )}
            Disconnect
          </Button>
        </div>
      </div>
    </div>
  );
}
