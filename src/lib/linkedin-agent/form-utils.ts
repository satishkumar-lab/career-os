import type {
  LinkedInAgentOnboardingForm,
  LinkedInAgentProfile,
} from "@/lib/linkedin-agent/types";
import { emptyLinkedInAgentOnboardingForm } from "@/lib/linkedin-agent/types";

export function profileToForm(profile: LinkedInAgentProfile | null): LinkedInAgentOnboardingForm {
  if (!profile) {
    return emptyLinkedInAgentOnboardingForm;
  }

  return {
    career: profile.career ?? "",
    experience: profile.experience ?? "",
    goal: profile.goal ?? "",
    tone: profile.tone ?? "",
    posting_frequency: profile.posting_frequency ?? "",
    location: profile.location ?? "",
    niche: profile.niche ?? "",
  };
}

export function formToUpsertFields(form: LinkedInAgentOnboardingForm) {
  return {
    career: form.career.trim() || null,
    experience: form.experience.trim() || null,
    goal: form.goal.trim() || null,
    tone: form.tone.trim() || null,
    posting_frequency: form.posting_frequency.trim() || null,
    location: form.location.trim() || null,
    niche: form.niche.trim() || null,
  };
}

export function validateOnboardingStep(
  step: number,
  form: LinkedInAgentOnboardingForm
): string | null {
  switch (step) {
    case 0:
      return form.career.trim() ? null : "Tell us about your career focus.";
    case 1:
      return form.experience.trim() ? null : "Select your experience level.";
    case 2:
      return form.goal.trim() ? null : "Share your primary career goal.";
    case 3:
      return form.tone.trim() ? null : "Choose a preferred content tone.";
    case 4:
      return form.posting_frequency.trim() ? null : "Select your posting frequency.";
    case 5:
      return form.location.trim() ? null : "Add your location.";
    case 6:
      return form.niche.trim() ? null : "Enter your primary niche.";
    default:
      return null;
  }
}
