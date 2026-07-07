"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sidebar, type SidebarUser } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { MainContent } from "@/components/layout/main-content";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SearchProvider } from "@/lib/search/search-context";

export interface AppLayoutProps {
  user: SidebarUser;
  streakDays?: number;
  hasUnreadNotifications?: boolean;
  children: ReactNode;
}

/**
 * Reusable application shell shared by every page: a fixed sidebar on
 * desktop that collapses into a drawer on mobile, a top navigation bar,
 * and a scrollable main content area.
 */
export function AppLayout({ user, streakDays, hasUnreadNotifications, children }: AppLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <SearchProvider>
      <div className="flex h-svh overflow-hidden bg-background">
      <div className="hidden w-[230px] shrink-0 border-r border-border md:block">
        <Sidebar user={user} streakDays={streakDays} />
      </div>

      <MobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} user={user} streakDays={streakDays} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav
          user={user}
          hasUnreadNotifications={hasUnreadNotifications}
          mobileMenuTrigger={
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open navigation"
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
          }
        />
        <MainContent>{children}</MainContent>
      </div>
      </div>
    </SearchProvider>
  );
}
