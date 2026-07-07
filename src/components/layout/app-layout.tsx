"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Menu } from "lucide-react";

import { AuthLoadingScreen } from "@/components/auth/auth-loading-screen";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { MainContent } from "@/components/layout/main-content";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SearchProvider } from "@/lib/search/search-context";
import { ProfileProvider, useProfile } from "@/lib/settings/profile-context";

export interface AppLayoutProps {
  streakDays?: number;
  hasUnreadNotifications?: boolean;
  children: ReactNode;
}

function AppLayoutInner({
  streakDays,
  hasUnreadNotifications,
  children,
}: AppLayoutProps) {
  const { user, isProfileReady } = useProfile();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (!isProfileReady) {
    return <AuthLoadingScreen message="Loading your workspace…" />;
  }

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

/**
 * Reusable application shell shared by every page: a fixed sidebar on
 * desktop that collapses into a drawer on mobile, a top navigation bar,
 * and a scrollable main content area.
 */
export function AppLayout(props: AppLayoutProps) {
  return (
    <ProfileProvider>
      <AppLayoutInner {...props} />
    </ProfileProvider>
  );
}
