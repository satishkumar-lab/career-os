import { redirect } from "next/navigation";

import { LoginPageShell } from "@/components/auth/login-page-shell";
import { DASHBOARD_PATH } from "@/lib/auth/routes";
import { createClient } from "@/lib/supabase/server";

interface LoginPageProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(DASHBOARD_PATH);
  }

  const params = await searchParams;
  const authError =
    params.error === "auth"
      ? "Google authentication failed. Please try again."
      : null;

  return <LoginPageShell authError={authError} />;
}
