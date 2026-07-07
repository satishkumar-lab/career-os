"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";
import { navItemBase } from "@/lib/interaction-styles";

const STORAGE_KEY = "careeros-theme";

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
}

/**
 * Sidebar footer action that toggles light/dark mode, persisted locally.
 */
export function DarkModeToggle({ className }: { className?: string }) {
  // Server and the client's first render both start from `isDark = false`
  // (no window/localStorage access happens during render), so the initial
  // HTML always matches. The actual `localStorage`/`matchMedia` reads only
  // happen inside this effect, which runs after hydration completes.
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const dark =
      stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(dark);
    applyTheme(dark);
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    applyTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-[13px] font-medium text-muted-foreground",
        navItemBase,
        className
      )}
    >
      {isDark ? <Sun className="size-[15px] shrink-0" /> : <Moon className="size-[15px] shrink-0" />}
      <span>{isDark ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}
