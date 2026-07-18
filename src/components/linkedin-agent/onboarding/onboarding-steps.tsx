"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LinkedInAgentOnboardingForm } from "@/lib/linkedin-agent/types";

export interface OnboardingStepProps {
  form: LinkedInAgentOnboardingForm;
  onChange: (field: keyof LinkedInAgentOnboardingForm, value: string) => void;
  error?: string | null;
}

export function OnboardingStepCareer({ form, onChange, error }: OnboardingStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">What&apos;s your career focus?</h2>
        <p className="mt-1 text-[13.5px] text-muted-foreground">
          Help your AI LinkedIn agent understand your professional direction.
        </p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="onboarding-career">Career</Label>
        <Input
          id="onboarding-career"
          value={form.career}
          onChange={(event) => onChange("career", event.target.value)}
          placeholder="e.g. Product Manager, Software Engineer, Data Analyst"
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    </div>
  );
}

export function OnboardingStepExperience({ form, onChange, error }: OnboardingStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Experience level</h2>
        <p className="mt-1 text-[13.5px] text-muted-foreground">
          This shapes the depth and positioning of your future LinkedIn content.
        </p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="onboarding-experience">Experience Level</Label>
        <Input
          id="onboarding-experience"
          value={form.experience}
          onChange={(event) => onChange("experience", event.target.value)}
          placeholder="e.g. Mid Level, Senior, Lead"
          list="experience-level-options"
        />
        <datalist id="experience-level-options">
          <option value="Entry Level" />
          <option value="Mid Level" />
          <option value="Senior" />
          <option value="Lead" />
          <option value="Executive" />
        </datalist>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    </div>
  );
}

export function OnboardingStepGoal({ form, onChange, error }: OnboardingStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Career goal</h2>
        <p className="mt-1 text-[13.5px] text-muted-foreground">
          What outcome should your LinkedIn presence support?
        </p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="onboarding-goal">Career Goal</Label>
        <Input
          id="onboarding-goal"
          value={form.goal}
          onChange={(event) => onChange("goal", event.target.value)}
          placeholder="e.g. Land a senior PM role, grow thought leadership, attract clients"
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    </div>
  );
}

export function OnboardingStepTone({ form, onChange, error }: OnboardingStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Preferred content tone</h2>
        <p className="mt-1 text-[13.5px] text-muted-foreground">
          Choose how you want your future posts to sound on LinkedIn.
        </p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="onboarding-tone">Content Tone</Label>
        <Input
          id="onboarding-tone"
          value={form.tone}
          onChange={(event) => onChange("tone", event.target.value)}
          placeholder="e.g. Professional, Conversational, Inspirational"
          list="content-tone-options"
        />
        <datalist id="content-tone-options">
          <option value="Professional" />
          <option value="Conversational" />
          <option value="Inspirational" />
          <option value="Educational" />
          <option value="Bold" />
        </datalist>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    </div>
  );
}

export function OnboardingStepFrequency({ form, onChange, error }: OnboardingStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Posting frequency</h2>
        <p className="mt-1 text-[13.5px] text-muted-foreground">
          How often do you plan to publish on LinkedIn?
        </p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="onboarding-frequency">Posting Frequency</Label>
        <Input
          id="onboarding-frequency"
          value={form.posting_frequency}
          onChange={(event) => onChange("posting_frequency", event.target.value)}
          placeholder="e.g. Weekly, 3x per week"
          list="posting-frequency-options"
        />
        <datalist id="posting-frequency-options">
          <option value="Daily" />
          <option value="3x per week" />
          <option value="Weekly" />
          <option value="Bi-weekly" />
          <option value="Monthly" />
        </datalist>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    </div>
  );
}

export function OnboardingStepLocation({ form, onChange, error }: OnboardingStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Location</h2>
        <p className="mt-1 text-[13.5px] text-muted-foreground">
          Add your city or region for localized content suggestions later.
        </p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="onboarding-location">Location</Label>
        <Input
          id="onboarding-location"
          value={form.location}
          onChange={(event) => onChange("location", event.target.value)}
          placeholder="e.g. Bangalore, India"
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    </div>
  );
}

export function OnboardingStepNiche({ form, onChange, error }: OnboardingStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Primary niche</h2>
        <p className="mt-1 text-[13.5px] text-muted-foreground">
          What topic should your AI LinkedIn agent focus on first?
        </p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="onboarding-niche">Primary Niche</Label>
        <Input
          id="onboarding-niche"
          value={form.niche}
          onChange={(event) => onChange("niche", event.target.value)}
          placeholder="e.g. AI Product Management, SaaS Growth, Cloud Engineering"
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    </div>
  );
}
