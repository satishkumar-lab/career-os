"use client";

import { useEffect, useState } from "react";

import type { LearningPersistedState } from "@/lib/learning/storage";
import { initLearningState } from "@/lib/learning/storage";

export function useLearningState() {
  const [state, setState] = useState<LearningPersistedState | null>(null);

  useEffect(() => {
    setState(initLearningState());
  }, []);

  return [state, setState] as const;
}
