"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { loadDashboardModuleStates, type DashboardModuleStates } from "@/lib/dashboard/state";

export function useDashboardState() {
  const [state, setState] = useState<DashboardModuleStates | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    function refresh() {
      setState(loadDashboardModuleStates());
    }

    refresh();

    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    window.addEventListener("career-os-storage-change", refresh);

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        refresh();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("career-os-storage-change", refresh);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pathname]);

  return [state, setState] as const;
}
