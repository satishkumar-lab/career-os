"use client";

import { useEffect, useState } from "react";

import type { GoalsPersistedState } from "@/lib/goals/storage";
import { initGoalsState } from "@/lib/goals/storage";

export function useGoalsState() {
  const [state, setState] = useState<GoalsPersistedState | null>(null);

  useEffect(() => {
    setState(initGoalsState());
  }, []);

  return [state, setState] as const;
}
