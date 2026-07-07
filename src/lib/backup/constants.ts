import { AI_TOOLS_STORAGE_KEY } from "@/lib/ai-tools/constants";
import { CERTIFICATIONS_STORAGE_KEY } from "@/lib/certifications/constants";
import { GOALS_STORAGE_KEY } from "@/lib/goals/constants";
import { INSTAGRAM_STORAGE_KEY } from "@/lib/instagram/constants";
import { JOB_TRACKER_STORAGE_KEY } from "@/lib/job-tracker/constants";
import { LEARNING_STORAGE_KEY } from "@/lib/learning/constants";
import { LINKEDIN_STORAGE_KEY } from "@/lib/linkedin/constants";
import { PORTFOLIO_STORAGE_KEY } from "@/lib/portfolio/constants";
import { PROJECTS_STORAGE_KEY } from "@/lib/projects/constants";
import { SETTINGS_STORAGE_KEY } from "@/lib/settings/constants";

export const BACKUP_VERSION = 1;
export const BACKUP_APP_NAME = "CareerOS";
export const THEME_STORAGE_KEY = "careeros-theme";

export const CAREER_OS_KEY_PREFIXES = ["career-os-", "careeros-"] as const;

export const CAREER_OS_MODULE_KEYS = [
  LEARNING_STORAGE_KEY,
  AI_TOOLS_STORAGE_KEY,
  CERTIFICATIONS_STORAGE_KEY,
  PROJECTS_STORAGE_KEY,
  PORTFOLIO_STORAGE_KEY,
  JOB_TRACKER_STORAGE_KEY,
  LINKEDIN_STORAGE_KEY,
  INSTAGRAM_STORAGE_KEY,
  GOALS_STORAGE_KEY,
  SETTINGS_STORAGE_KEY,
  THEME_STORAGE_KEY,
] as const;
