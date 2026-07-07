"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { LOGIN_PATH } from "@/lib/auth/routes";
import { createClient } from "@/lib/supabase/client";

export function useSignOut() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const signOut = useCallback(async () => {
    setIsSigningOut(true);

    const supabase = createClient();
    await supabase.auth.signOut();

    router.push(LOGIN_PATH);
    router.refresh();
  }, [router]);

  return { signOut, isSigningOut };
}
