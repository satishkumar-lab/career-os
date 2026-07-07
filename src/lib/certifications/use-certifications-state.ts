"use client";

import { useEffect, useState } from "react";

import type { CertificationsPersistedState } from "@/lib/certifications/storage";
import { initCertificationsState } from "@/lib/certifications/storage";

export function useCertificationsState() {
  const [state, setState] = useState<CertificationsPersistedState | null>(null);

  useEffect(() => {
    setState(initCertificationsState());
  }, []);

  return [state, setState] as const;
}
