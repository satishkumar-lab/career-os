"use client";

import Link from "next/link";
import { LogOut, Settings } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/shared/user-avatar";
import { useSignOut } from "@/lib/auth/use-sign-out";
import { useProfile } from "@/lib/settings/profile-context";
import { cn } from "@/lib/utils";

export function ProfileMenu() {
  const { user: profileUser } = useProfile();
  const { signOut, isSigningOut } = useSignOut();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open profile menu"
        className={cn(
          "rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        )}
      >
        <UserAvatar user={profileUser} size="default" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-60 rounded-2xl p-1.5">
        <DropdownMenuLabel className="px-2 py-2">
          <div className="flex items-center gap-3">
            <UserAvatar user={profileUser} size="lg" />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-foreground">
                {profileUser.name}
              </p>
              {profileUser.email ? (
                <p className="truncate text-[11px] font-normal text-muted-foreground">
                  {profileUser.email}
                </p>
              ) : null}
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          render={<Link href="/settings" />}
          className="rounded-xl px-2 py-2 text-[13px]"
        >
          <Settings className="size-4" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          disabled={isSigningOut}
          onClick={() => {
            void signOut();
          }}
          className="rounded-xl px-2 py-2 text-[13px]"
        >
          <LogOut className="size-4" />
          {isSigningOut ? "Logging out…" : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
