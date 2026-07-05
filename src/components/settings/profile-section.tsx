"use client";

import { useState } from "react";

import { SettingsSectionCard } from "@/components/settings/settings-section-card";
import type { ProfileSettings } from "@/components/settings/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ProfileSection({ profile }: { profile: ProfileSettings }) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [title, setTitle] = useState(profile.title);
  const [location, setLocation] = useState(profile.location);
  const [bio, setBio] = useState(profile.bio);

  return (
    <SettingsSectionCard title="Profile" description="Your public identity across CareerOS.">
      <div className="flex flex-col gap-5 py-5 sm:flex-row sm:items-center">
        <Avatar size="lg" className="size-16">
          <AvatarFallback className="bg-[rgba(23,165,251,0.08)] text-base font-medium text-primary">
            {profile.initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="rounded-2xl" disabled>
            Change photo
          </Button>
          <Button variant="ghost" className="rounded-2xl text-muted-foreground" disabled>
            Remove
          </Button>
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
        <Button className="rounded-2xl px-4 shadow-sm">Save profile</Button>
      </div>
    </SettingsSectionCard>
  );
}
