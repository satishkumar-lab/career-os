"use client";

import { MissionSectionCard } from "@/components/linkedin-agent/mission-control/mission-section-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { contentCardRadius, listRowHover, textAction } from "@/lib/interaction-styles";
import type { NetworkingContact } from "@/lib/linkedin-agent/mission-control/types";
import { cn } from "@/lib/utils";

export interface NetworkingHubProps {
  contacts: NetworkingContact[];
  onAction: (contact: NetworkingContact) => void;
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function NetworkingHub({ contacts, onAction }: NetworkingHubProps) {
  return (
    <MissionSectionCard
      title="Networking Hub"
      description="Reconnect, collaborate, and grow your professional network."
      className="min-h-0"
    >
      <div className={cn(contentCardRadius, "divide-y divide-border/60 border border-border/80 bg-background/40")}>
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className={cn("flex items-start justify-between gap-4 px-4 py-4", listRowHover)}
          >
            <div className="flex min-w-0 items-start gap-3">
              <Avatar className="size-9 shrink-0 ring-1 ring-border/50">
                <AvatarFallback className="bg-muted/50 text-[10.5px] font-medium text-foreground">
                  {initials(contact.name)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-foreground">{contact.name}</p>
                <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
                  {contact.role} · {contact.company}
                </p>
                <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-muted-foreground">
                  {contact.context}
                </p>
                <p className="mt-2 text-[11px] text-muted-foreground/80">
                  Last touch · {contact.lastTouch}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onAction(contact)}
              className={cn(
                "shrink-0 pt-0.5 text-[12px] font-medium text-primary",
                textAction,
                "hover:underline"
              )}
            >
              {contact.actionLabel}
            </button>
          </div>
        ))}
      </div>

      <p className="mt-3 text-[11px] text-muted-foreground/80">
        Mock relationships · Production will sync from your network.
      </p>
    </MissionSectionCard>
  );
}
