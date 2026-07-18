/**
 * Core onboarding fields for the AI LinkedIn Agent.
 * Additional future fields should go in `profile_metadata` to avoid schema churn.
 */
export interface LinkedInAgentOnboardingFields {
  career: string | null;
  experience: string | null;
  goal: string | null;
  tone: string | null;
  posting_frequency: string | null;
  location: string | null;
  niche: string | null;
}

export interface LinkedInAgentProfile extends LinkedInAgentOnboardingFields {
  user_id: string;
  onboarding_completed: boolean;
  onboarding_skipped: boolean;
  onboarding_skipped_at: string | null;
  profile_metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export type LinkedInAgentProfileUpsert = Partial<LinkedInAgentOnboardingFields> & {
  onboarding_completed?: boolean;
  onboarding_skipped?: boolean;
  onboarding_skipped_at?: string | null;
  profile_metadata?: Record<string, unknown>;
};

export interface LinkedInAgentOnboardingForm {
  career: string;
  experience: string;
  goal: string;
  tone: string;
  posting_frequency: string;
  location: string;
  niche: string;
}

export const emptyLinkedInAgentOnboardingForm: LinkedInAgentOnboardingForm = {
  career: "",
  experience: "",
  goal: "",
  tone: "",
  posting_frequency: "",
  location: "",
  niche: "",
};
