"use client";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Sidebar, type SidebarUser } from "@/components/layout/sidebar";

export interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: SidebarUser;
  streakDays?: number;
}

/**
 * Mobile drawer variant of the sidebar. Reuses the exact same `Sidebar`
 * so navigation stays identical between desktop and mobile.
 */
export function MobileNav({ open, onOpenChange, user, streakDays }: MobileNavProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[230px] p-0">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <Sidebar user={user} streakDays={streakDays} />
      </SheetContent>
    </Sheet>
  );
}
