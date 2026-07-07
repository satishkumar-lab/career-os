"use client";

import { useEffect, useState } from "react";

import type { ProjectsPersistedState } from "@/lib/projects/storage";
import { initProjectsState } from "@/lib/projects/storage";

export function useProjectsState() {
  const [state, setState] = useState<ProjectsPersistedState | null>(null);

  useEffect(() => {
    setState(initProjectsState());
  }, []);

  return [state, setState] as const;
}
