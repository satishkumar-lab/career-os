"use client";

import { useEffect, useState } from "react";

import type { JobTrackerPersistedState } from "@/lib/job-tracker/storage";
import { initJobTrackerState } from "@/lib/job-tracker/storage";

export function useJobTrackerState() {
  const [state, setState] = useState<JobTrackerPersistedState | null>(null);

  useEffect(() => {
    setState(initJobTrackerState());
  }, []);

  return [state, setState] as const;
}
