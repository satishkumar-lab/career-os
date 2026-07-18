import { LINKEDIN_AGENT_TABLE } from "@/lib/linkedin-agent/constants";
import type {
  LinkedInAgentProfile,
  LinkedInAgentProfileUpsert,
} from "@/lib/linkedin-agent/types";
import { createClient } from "@/lib/supabase/client";

function normalizeProfile(row: Record<string, unknown>): LinkedInAgentProfile {
  return {
    user_id: String(row.user_id),
    onboarding_completed: Boolean(row.onboarding_completed),
    onboarding_skipped: Boolean(row.onboarding_skipped),
    onboarding_skipped_at: (row.onboarding_skipped_at as string | null) ?? null,
    career: (row.career as string | null) ?? null,
    experience: (row.experience as string | null) ?? null,
    goal: (row.goal as string | null) ?? null,
    tone: (row.tone as string | null) ?? null,
    posting_frequency: (row.posting_frequency as string | null) ?? null,
    location: (row.location as string | null) ?? null,
    niche: (row.niche as string | null) ?? null,
    profile_metadata:
      row.profile_metadata && typeof row.profile_metadata === "object"
        ? (row.profile_metadata as Record<string, unknown>)
        : {},
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export async function fetchLinkedInAgentProfile(
  userId: string
): Promise<LinkedInAgentProfile | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from(LINKEDIN_AGENT_TABLE)
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return normalizeProfile(data);
}

export async function upsertLinkedInAgentProfile(
  userId: string,
  input: LinkedInAgentProfileUpsert
): Promise<LinkedInAgentProfile> {
  const supabase = createClient();

  const payload = {
    user_id: userId,
    ...input,
  };

  const { data, error } = await supabase
    .from(LINKEDIN_AGENT_TABLE)
    .upsert(payload, { onConflict: "user_id" })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return normalizeProfile(data);
}
