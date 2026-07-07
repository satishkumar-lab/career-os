"use client";

import { useEffect, useState } from "react";

import type { LinkedInPersistedState } from "@/lib/linkedin/storage";
import { initLinkedInState } from "@/lib/linkedin/storage";

export function useLinkedInState() {
  const [state, setState] = useState<LinkedInPersistedState | null>(null);

  useEffect(() => {
    setState(initLinkedInState());
  }, []);

  return [state, setState] as const;
}
