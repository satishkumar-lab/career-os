import { redirect } from "next/navigation";

import { DASHBOARD_PATH, LOGIN_PATH } from "@/lib/auth/routes";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  redirect(user ? DASHBOARD_PATH : LOGIN_PATH);
}
