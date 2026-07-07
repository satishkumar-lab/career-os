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
import {
  getAuthProfileFields,
  mergeAuthWithStoredProfile,
} from "@/lib/auth/user-profile";
import { createClient } from "@/lib/supabase/client";
import { deriveInitials, getSettingsState, saveProfile } from "@/lib/settings/storage";

interface ProfileContextValue {
  profile: ProfileSettings;
  user: SidebarUser;
  isProfileReady: boolean;
  refreshProfile: () => Promise<void>;
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
    email: profile.email,
    status: profile.title || undefined,
    initials,
    photoDataUrl: profile.photoDataUrl,
  };
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileSettings>(emptyProfile);
  const [isProfileReady, setIsProfileReady] = useState(false);

  const refreshProfile = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const stored = getSettingsState().profile;

    if (user) {
      const merged = mergeAuthWithStoredProfile(getAuthProfileFields(user), stored);
      const identityChanged =
        merged.name !== stored.name ||
        merged.email !== stored.email ||
        merged.initials !== stored.initials ||
        merged.photoDataUrl !== stored.photoDataUrl;

      if (identityChanged) {
        saveProfile(merged);
      }

      setProfile(merged);
    } else {
      setProfile(stored);
    }

    setIsProfileReady(true);
  }, []);

  useEffect(() => {
    void refreshProfile();

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void refreshProfile();
    });

    function handleStorageChange() {
      void refreshProfile();
    }

    window.addEventListener("career-os-storage-change", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("career-os-storage-change", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [refreshProfile]);

  const value = useMemo(
    () => ({
      profile,
      user: profileToSidebarUser(profile),
      isProfileReady,
      refreshProfile,
    }),
    [profile, isProfileReady, refreshProfile]
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
