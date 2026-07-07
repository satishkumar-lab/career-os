"use client";

import { useEffect, useState } from "react";

import { SettingsSectionCard } from "@/components/settings/settings-section-card";
import { ToastProvider, useToast } from "@/components/shared/toast-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProfile } from "@/lib/settings/profile-context";
import { deriveInitials, saveProfile } from "@/lib/settings/storage";

function ProfileSectionInner() {
  const { showToast } = useToast();
  const { profile, refreshProfile, isProfileReady } = useProfile();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    setTitle(profile.title);
    setLocation(profile.location);
    setBio(profile.bio);
  }, [profile]);

  function handleSave() {
    saveProfile({
      name: profile.name,
      email: profile.email,
      title,
      location,
      bio,
      initials: profile.initials,
      photoDataUrl: profile.photoDataUrl,
    });
    void refreshProfile();
    showToast("Profile saved successfully.");
  }

  if (!isProfileReady) {
    return null;
  }

  const initials = deriveInitials(profile.name) || profile.initials || "?";

  return (
    <SettingsSectionCard title="Profile" description="Your public identity across CareerOS.">
      <div className="flex flex-col gap-5 py-5 sm:flex-row sm:items-center">
        <Avatar size="lg" className="size-16">
          {profile.photoDataUrl ? (
            <AvatarImage src={profile.photoDataUrl} alt={profile.name || "Profile photo"} />
          ) : null}
          <AvatarFallback className="bg-[rgba(23,165,251,0.08)] text-base font-medium text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <p className="text-xs text-muted-foreground">
          Name, email, and photo are managed by your Google account.
        </p>
      </div>

      <div className="grid gap-4 pb-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="profile-name">Full name</Label>
          <Input
            id="profile-name"
            value={profile.name}
            readOnly
            disabled
            className="h-9 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-email">Email</Label>
          <Input
            id="profile-email"
            type="email"
            value={profile.email}
            readOnly
            disabled
            className="h-9 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-title">Title</Label>
          <Input
            id="profile-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="h-9 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-location">Location</Label>
          <Input
            id="profile-location"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="h-9 rounded-xl"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="profile-bio">Bio</Label>
          <Textarea
            id="profile-bio"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            className="min-h-20 rounded-xl"
          />
        </div>
      </div>

      <div className="flex justify-end border-t border-border py-4">
        <Button type="button" className="rounded-2xl px-4 shadow-sm" onClick={handleSave}>
          Save profile
        </Button>
      </div>
    </SettingsSectionCard>
  );
}

export function ProfileSection() {
  return (
    <ToastProvider>
      <ProfileSectionInner />
    </ToastProvider>
  );
}
