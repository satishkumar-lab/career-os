"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";

import { SettingsSectionCard } from "@/components/settings/settings-section-card";
import { ToastProvider, useToast } from "@/components/shared/toast-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProfile } from "@/lib/settings/profile-context";
import { deriveInitials, getSettingsState, saveProfile } from "@/lib/settings/storage";

const ACCEPTED_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function ProfileSectionInner() {
  const { showToast } = useToast();
  const { profile, refreshProfile } = useProfile();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    const { profile: storedProfile } = getSettingsState();

    setName(storedProfile.name);
    setEmail(storedProfile.email);
    setTitle(storedProfile.title);
    setLocation(storedProfile.location);
    setBio(storedProfile.bio);
    setLoaded(true);
    refreshProfile();
  }, [refreshProfile]);

  function persistProfile(photoDataUrl: string | undefined) {
    saveProfile({
      name,
      email,
      title,
      location,
      bio,
      initials: deriveInitials(name),
      photoDataUrl,
    });
    refreshProfile();
  }

  function handleSave() {
    persistProfile(profile.photoDataUrl);
    showToast("Profile saved successfully.");
  }

  function handleChangePhotoClick() {
    photoInputRef.current?.click();
  }

  function handleRemovePhoto() {
    persistProfile(undefined);
    showToast("Profile photo removed successfully.");
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!ACCEPTED_PHOTO_TYPES.has(file.type)) {
      showToast("Please choose a JPG, PNG, or WebP image.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const nextPhoto = typeof reader.result === "string" ? reader.result : undefined;

      if (!nextPhoto) {
        return;
      }

      persistProfile(nextPhoto);
    };

    reader.readAsDataURL(file);
  }

  if (!loaded) {
    return null;
  }

  const photoDataUrl = profile.photoDataUrl;
  const initials = deriveInitials(name) || "?";

  return (
    <SettingsSectionCard title="Profile" description="Your public identity across CareerOS.">
      <div className="flex flex-col gap-5 py-5 sm:flex-row sm:items-center">
        <Avatar size="lg" className="size-16">
          {photoDataUrl ? <AvatarImage src={photoDataUrl} alt={name || "Profile photo"} /> : null}
          <AvatarFallback className="bg-[rgba(23,165,251,0.08)] text-base font-medium text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-2xl"
            onClick={handleChangePhotoClick}
          >
            Change photo
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="rounded-2xl text-muted-foreground"
            disabled={!photoDataUrl}
            onClick={handleRemovePhoto}
          >
            Remove
          </Button>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>
      </div>

      <div className="grid gap-4 pb-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="profile-name">Full name</Label>
          <Input
            id="profile-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-9 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-email">Email</Label>
          <Input
            id="profile-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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
