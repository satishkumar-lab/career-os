"use client";

import { useEffect, useState } from "react";

import type { PortfolioPersistedState } from "@/lib/portfolio/storage";
import { initPortfolioState } from "@/lib/portfolio/storage";

export function usePortfolioState() {
  const [state, setState] = useState<PortfolioPersistedState | null>(null);

  useEffect(() => {
    setState(initPortfolioState());
  }, []);

  return [state, setState] as const;
}
