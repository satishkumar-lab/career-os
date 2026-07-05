import { Bell, Search } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface TopNavUser {
  initials: string;
}

export interface TopNavProps {
  user: TopNavUser;
  hasUnreadNotifications?: boolean;
  onMenuClick?: () => void;
  mobileMenuTrigger?: ReactNode;
  className?: string;
}

/**
 * Reusable top navigation bar shared by every page: search trigger,
 * notifications, and the account avatar. `mobileMenuTrigger` lets the
 * mobile drawer control (a `Sheet` trigger) be composed in without this
 * component depending on any specific drawer implementation.
 */
export function TopNav({ user, hasUnreadNotifications, mobileMenuTrigger, className }: TopNavProps) {
  return (
    <header
      className={cn(
        "flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-background px-4 sm:px-7",
        className
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {mobileMenuTrigger}

        <button
          type="button"
          className="flex w-full max-w-64 items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 text-left shadow-sm transition-colors hover:bg-accent/50"
        >
          <Search className="size-[13px] shrink-0 text-muted-foreground" />
          <span className="flex-1 truncate text-[13px] text-muted-foreground">Search...</span>
          <kbd className="shrink-0 rounded-[10px] bg-accent px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex size-9 items-center justify-center rounded-2xl text-foreground/80 transition-colors hover:bg-accent"
        >
          <Bell className="size-4" />
          {hasUnreadNotifications && (
            <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-background bg-primary" />
          )}
        </button>

        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-medium text-primary-foreground shadow-sm">
          {user.initials}
        </span>
      </div>
    </header>
  );
}
