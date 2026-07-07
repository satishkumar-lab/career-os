import type {
  AppearanceSettings,
  CareerPreferences,
  IntegrationSetting,
  ToggleSetting,
} from "@/components/settings/types";

export const careerPreferences: CareerPreferences = {
  targetRole: "Senior Product Manager",
  targetIndustry: "Tech / SaaS",
  workMode: "Hybrid",
  openToRoles: true,
};

export const appearanceSettings: AppearanceSettings = {
  darkMode: false,
  compactSidebar: false,
};

export const notificationSettings: ToggleSetting[] = [
  {
    id: "goal-reminders",
    label: "Goal reminders",
    description: "Weekly nudges when goals need attention.",
    enabled: true,
  },
  {
    id: "learning-updates",
    label: "Learning updates",
    description: "Course progress and streak milestones.",
    enabled: true,
  },
  {
    id: "job-alerts",
    label: "Job tracker alerts",
    description: "Status changes and follow-up reminders.",
    enabled: false,
  },
  {
    id: "social-insights",
    label: "Social insights",
    description: "LinkedIn and Instagram performance summaries.",
    enabled: true,
  },
  {
    id: "product-updates",
    label: "Product updates",
    description: "New features and CareerOS announcements.",
    enabled: false,
  },
];

export const dashboardPreferences: ToggleSetting[] = [
  {
    id: "show-streak",
    label: "Show streak",
    description: "Display your daily streak in the sidebar.",
    enabled: true,
  },
  {
    id: "show-goals",
    label: "Active goals",
    description: "Highlight goals on the dashboard.",
    enabled: true,
  },
  {
    id: "show-learning",
    label: "Learning progress",
    description: "Surface course hours and weekly chart.",
    enabled: true,
  },
  {
    id: "show-social",
    label: "Social growth",
    description: "Show LinkedIn and Instagram metrics.",
    enabled: false,
  },
  {
    id: "show-ai-focus",
    label: "AI focus",
    description: "Display your current AI learning focus.",
    enabled: true,
  },
];

export const integrations: IntegrationSetting[] = [
  {
    id: "linkedin",
    name: "LinkedIn",
    description: "Sync posts, followers, and engagement metrics.",
  },
  {
    id: "instagram",
    name: "Instagram",
    description: "Import reels, carousels, and follower growth.",
  },
  {
    id: "github",
    name: "GitHub",
    description: "Track repositories and contribution activity.",
  },
  {
    id: "notion",
    name: "Notion",
    description: "Sync notes and learning resources.",
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Connect deadlines and interview schedules.",
  },
];

export const careerRoleOptions = [
  "Senior Product Manager",
  "Product Manager",
  "Engineering Manager",
  "Staff Engineer",
  "Design Lead",
];

export const careerIndustryOptions = [
  "Tech / SaaS",
  "Fintech",
  "Healthcare",
  "E-commerce",
  "AI / ML",
];

export const careerWorkModeOptions = ["Remote", "Hybrid", "On-site"];
