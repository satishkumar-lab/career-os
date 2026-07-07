"use client";

import { useEffect, useState } from "react";

import type { InstagramPersistedState } from "@/lib/instagram/storage";
import { initInstagramState } from "@/lib/instagram/storage";

export function useInstagramState() {
  const [state, setState] = useState<InstagramPersistedState | null>(null);

  useEffect(() => {
    setState(initInstagramState());
  }, []);

  return [state, setState] as const;
}
