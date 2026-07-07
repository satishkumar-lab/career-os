"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { SidebarUser } from "@/components/layout/sidebar";
import type { ProfileSettings } from "@/components/settings/types";
import { deriveInitials, getSettingsState } from "@/lib/settings/storage";

interface ProfileContextValue {
  profile: ProfileSettings;
  user: SidebarUser;
  refreshProfile: () => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

const emptyProfile: ProfileSettings = {
  name: "",
  email: "",
  initials: "",
  title: "",
  location: "",
  bio: "",
};

export function profileToSidebarUser(profile: ProfileSettings): SidebarUser {
  const initials = deriveInitials(profile.name) || profile.initials || "?";

  return {
    name: profile.name,
    status: profile.title || undefined,
    initials,
    photoDataUrl: profile.photoDataUrl,
  };
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileSettings>(emptyProfile);

  const refreshProfile = useCallback(() => {
    setProfile(getSettingsState().profile);
  }, []);

  useEffect(() => {
    refreshProfile();

    window.addEventListener("career-os-storage-change", refreshProfile);
    window.addEventListener("storage", refreshProfile);

    return () => {
      window.removeEventListener("career-os-storage-change", refreshProfile);
      window.removeEventListener("storage", refreshProfile);
    };
  }, [refreshProfile]);

  const value = useMemo(
    () => ({
      profile,
      user: profileToSidebarUser(profile),
      refreshProfile,
    }),
    [profile, refreshProfile]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error("useProfile must be used within ProfileProvider");
  }

  return context;
}
