import type { ProfileSettings } from "@/components/settings/types";
import { SETTINGS_STORAGE_KEY } from "@/lib/settings/constants";
import { readStorage, writeStorage } from "@/lib/storage/local-storage";

export interface SettingsPersistedState {
  profile: ProfileSettings;
}

function createDefaultProfile(): ProfileSettings {
  return {
    name: "",
    email: "",
    initials: "",
    title: "",
    location: "",
    bio: "",
  };
}

export function deriveInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function normalizeProfile(profile: ProfileSettings): ProfileSettings {
  const name = profile.name.trim();

  return {
    name,
    email: profile.email.trim(),
    title: profile.title.trim(),
    location: profile.location.trim(),
    bio: profile.bio.trim(),
    initials: deriveInitials(name),
    photoDataUrl: profile.photoDataUrl?.trim() || undefined,
  };
}

export function getSettingsState(): SettingsPersistedState {
  const stored = readStorage<SettingsPersistedState>(SETTINGS_STORAGE_KEY);

  if (!stored?.profile) {
    return { profile: createDefaultProfile() };
  }

  return {
    profile: {
      ...createDefaultProfile(),
      ...stored.profile,
    },
  };
}

export function saveProfile(profile: ProfileSettings): SettingsPersistedState {
  const state: SettingsPersistedState = {
    profile: normalizeProfile(profile),
  };

  writeStorage(SETTINGS_STORAGE_KEY, state);
  return state;
}
