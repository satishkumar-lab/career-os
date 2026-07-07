import type { User } from "@supabase/supabase-js";

import type { ProfileSettings } from "@/components/settings/types";
import { deriveInitials } from "@/lib/settings/storage";

export type AuthProfileFields = Pick<
  ProfileSettings,
  "name" | "email" | "initials" | "photoDataUrl"
>;

function readMetadataString(
  metadata: Record<string, unknown>,
  key: string
): string | undefined {
  const value = metadata[key];

  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

export function getAuthProfileFields(user: User): AuthProfileFields {
  const metadata = user.user_metadata ?? {};
  const name =
    readMetadataString(metadata, "full_name") ??
    readMetadataString(metadata, "name") ??
    user.email?.split("@")[0] ??
    "";

  const email = user.email ?? "";
  const photoDataUrl =
    readMetadataString(metadata, "avatar_url") ??
    readMetadataString(metadata, "picture");

  return {
    name,
    email,
    initials: deriveInitials(name),
    photoDataUrl,
  };
}

export function mergeAuthWithStoredProfile(
  authFields: AuthProfileFields,
  stored: ProfileSettings
): ProfileSettings {
  return {
    ...stored,
    name: authFields.name,
    email: authFields.email,
    initials: authFields.initials,
    photoDataUrl: authFields.photoDataUrl,
  };
}
