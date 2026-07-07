"use client";

import { useEffect, useState } from "react";

import type { AiToolsPersistedState } from "@/lib/ai-tools/storage";
import { initAiToolsState } from "@/lib/ai-tools/storage";

export function useAiToolsState() {
  const [state, setState] = useState<AiToolsPersistedState | null>(null);

  useEffect(() => {
    setState(initAiToolsState());
  }, []);

  return [state, setState] as const;
}
