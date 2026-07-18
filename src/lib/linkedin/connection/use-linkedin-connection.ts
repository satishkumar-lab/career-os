"use client";

import { useCallback, useEffect, useState } from "react";

import type { LinkedInConnectionStatusResponse } from "@/lib/linkedin/connection/types";

const INITIAL_STATUS: LinkedInConnectionStatusResponse = {
  state: "not_connected",
  configured: true,
  profile: null,
};

async function readLinkedInStatus(): Promise<LinkedInConnectionStatusResponse> {
  const response = await fetch("/api/linkedin/status", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to load LinkedIn connection status.");
  }

  return (await response.json()) as LinkedInConnectionStatusResponse;
}

export function useLinkedInConnection() {
  const [status, setStatus] = useState<LinkedInConnectionStatusResponse>(INITIAL_STATUS);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    const next = await readLinkedInStatus();
    setStatus(next);
    return next;
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const next = await readLinkedInStatus();
        if (!cancelled) {
          setStatus(next);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load LinkedIn status.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const connect = useCallback(() => {
    setIsConnecting(true);
    setError(null);
    window.location.href = "/api/linkedin/connect?returnTo=/linkedin";
  }, []);

  const sync = useCallback(async () => {
    setIsSyncing(true);
    setError(null);

    try {
      const response = await fetch("/api/linkedin/sync", { method: "POST" });
      const body = (await response.json()) as LinkedInConnectionStatusResponse & { error?: string };

      if (!response.ok) {
        throw new Error(body.error || "LinkedIn sync failed.");
      }

      setStatus(body);
      return body;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    setIsDisconnecting(true);
    setError(null);

    try {
      const response = await fetch("/api/linkedin/disconnect", { method: "POST" });
      const body = (await response.json()) as LinkedInConnectionStatusResponse & { error?: string };

      if (!response.ok) {
        throw new Error(body.error || "LinkedIn disconnect failed.");
      }

      setStatus(body);
      return body;
    } finally {
      setIsDisconnecting(false);
    }
  }, []);

  return {
    status,
    isLoading,
    isConnecting,
    isSyncing,
    isDisconnecting,
    error,
    refresh,
    connect,
    sync,
    disconnect,
  };
}
