"use client";

import { Bell, Search } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

import { usePageSearch } from "@/lib/search/search-context";
import { cn } from "@/lib/utils";
import { iconButton } from "@/lib/interaction-styles";

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

export function TopNav({ user, hasUnreadNotifications, mobileMenuTrigger, className }: TopNavProps) {
  const { query, setQuery } = usePageSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header
      className={cn(
        "flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-background px-4 sm:px-7",
        className
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {mobileMenuTrigger}

        <div className="flex w-full max-w-64 items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 text-left shadow-sm transition-[color,background-color,border-color,box-shadow,opacity] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 hover:border-foreground/10 hover:bg-accent/50 hover:shadow-md">
          <Search className="size-[13px] shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search..."
            aria-label="Search current page"
            className="min-w-0 flex-1 truncate bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
          />
          {!query && (
            <kbd className="shrink-0 rounded-[10px] bg-accent px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          aria-label="Notifications"
          className={cn("relative flex size-9 items-center justify-center rounded-2xl text-foreground/80", iconButton)}
        >
          <Bell className="size-4" />
          {hasUnreadNotifications && (
            <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-background bg-primary" />
          )}
        </button>

        <button
          type="button"
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-medium text-primary-foreground shadow-sm transition-[box-shadow,opacity] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:opacity-90",
          )}
        >
          {user.initials}
        </button>
      </div>
    </header>
  );
}
