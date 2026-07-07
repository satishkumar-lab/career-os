"use client";

import { SettingsSectionCard } from "@/components/settings/settings-section-card";
import { Button } from "@/components/ui/button";
import { useSignOut } from "@/lib/auth/use-sign-out";

export function AccountSection() {
  const { signOut, isSigningOut } = useSignOut();

  return (
    <SettingsSectionCard title="Account" description="Manage your login and account security.">
      <div className="flex flex-col gap-3 py-5 sm:flex-row sm:flex-wrap">
        <Button variant="outline" className="rounded-2xl" disabled>
          Change password
        </Button>
        <Button variant="outline" className="rounded-2xl" disabled>
          Two-factor auth
        </Button>
        <Button
          type="button"
          variant="outline"
          className="rounded-2xl"
          disabled={isSigningOut}
          onClick={() => {
            void signOut();
          }}
        >
          {isSigningOut ? "Logging out…" : "Logout"}
        </Button>
      </div>

      <div className="border-t border-border py-5">
        <p className="text-sm font-medium text-foreground">Delete account</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Permanently remove your account and all associated data.
        </p>
        <Button variant="destructive" className="mt-4 rounded-2xl" disabled>
          Delete account
        </Button>
      </div>
    </SettingsSectionCard>
  );
}
