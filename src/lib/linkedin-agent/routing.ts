import type { LinkedInAgentProfile } from "@/lib/linkedin-agent/types";

export type LinkedInAgentView = "onboarding" | "home";

export function resolveLinkedInAgentView(
  profile: LinkedInAgentProfile | null,
  forcedView?: LinkedInAgentView | null
): LinkedInAgentView {
  if (forcedView) {
    return forcedView;
  }

  if (!profile) {
    return "onboarding";
  }

  if (profile.onboarding_completed) {
    return "home";
  }

  if (profile.onboarding_skipped) {
    return "home";
  }

  return "onboarding";
}

export function isOnboardingIncomplete(profile: LinkedInAgentProfile | null): boolean {
  if (!profile) {
    return true;
  }

  return !profile.onboarding_completed;
}

export function profileToResumeMessage(profile: LinkedInAgentProfile | null): string | null {
  if (!profile || profile.onboarding_completed) {
    return null;
  }

  if (profile.onboarding_skipped) {
    return "You skipped onboarding. Complete your setup to unlock the full AI LinkedIn experience.";
  }

  return "Finish onboarding to personalize your AI LinkedIn workspace.";
}
