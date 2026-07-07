"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Settings, Zap } from "lucide-react";

import { cn } from "@/lib/utils";
import { navItemActive, navItemBase } from "@/lib/interaction-styles";
import { navSections } from "@/components/layout/nav-items";
import { DarkModeToggle } from "@/components/layout/dark-mode-toggle";

export interface SidebarUser {
  name: string;
  status?: string;
  initials: string;
}

export interface SidebarProps {
  user: SidebarUser;
  streakDays?: number;
  className?: string;
}

function isNavItemActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Reusable application sidebar: brand header, primary navigation, an
 * optional streak banner, and account/theme actions in the footer.
 * Shared by the desktop layout and the mobile navigation drawer.
 */
export function Sidebar({ user, streakDays, className }: SidebarProps) {
  // `usePathname()` is populated from the current request URL during SSR
  // and from the same URL on the client's first render, so the active nav
  // item is identical in both passes. `pathname` can briefly be `null`
  // during route transitions, so `isNavItemActive` guards against that.
  const pathname = usePathname();

  return (
    <div className={cn("flex h-full w-full flex-col bg-card", className)}>
      <div className="flex h-16 shrink-0 items-center border-b border-border px-5">
        <Link href="/" className="flex items-center gap-3 rounded-2xl transition-opacity duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:opacity-80">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-2xl bg-primary shadow-sm">
            <Zap className="size-[15px] fill-primary-foreground text-primary-foreground" />
          </span>
          <span className="flex flex-col">
            <span className="text-[15px] font-semibold tracking-tight text-foreground">CareerOS</span>
            <span className="text-[10px] font-medium text-muted-foreground">Personal Growth OS</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navSections.map((section, index) => (
          <div key={section.title ?? `section-${index}`} className={cn(index > 0 && "pt-5")}>
            {section.title && (
              <p className="px-3 pb-1.5 text-[10px] font-medium tracking-[0.1em] text-muted-foreground uppercase">
                {section.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = isNavItemActive(pathname ?? "", item.href);
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[13px] font-medium text-muted-foreground",
                        navItemBase,
                        active && navItemActive
                      )}
                    >
                      <Icon className="size-[15px] shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {typeof streakDays === "number" && (
        <div className="shrink-0 px-3 pb-3">
          <div
            className="flex flex-col gap-1 rounded-2xl p-4"
            style={{ backgroundImage: "linear-gradient(161deg, #17a5fb 0%, #e80584 100%)" }}
          >
            <div className="flex items-center gap-2">
              <Flame className="size-3.5 shrink-0 text-white" />
              <p className="text-xs font-medium text-white">{streakDays}-Day Streak</p>
            </div>
            <p className="text-[11px] font-medium text-white/70">Keep showing up every day.</p>
          </div>
        </div>
      )}

      <div className="shrink-0 border-t border-border p-3">
        <DarkModeToggle />
        <Link
          href="/settings"
          aria-current={isNavItemActive(pathname ?? "", "/settings") ? "page" : undefined}
          className={cn(
            "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-[13px] font-medium text-muted-foreground",
            navItemBase,
            isNavItemActive(pathname ?? "", "/settings") && navItemActive
          )}
        >
          <Settings className="size-[15px] shrink-0" />
          <span>Settings</span>
        </Link>

        <div className="mt-1 flex items-center gap-3 rounded-2xl p-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-medium text-primary-foreground shadow-sm">
            {user.initials}
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-[13px] font-medium text-foreground">{user.name}</span>
            {user.status && (
              <span className="truncate text-[11px] font-medium text-muted-foreground">{user.status}</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
