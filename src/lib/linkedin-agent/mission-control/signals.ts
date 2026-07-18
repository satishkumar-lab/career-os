import {
  Award,
  Calendar,
  FileText,
  Images,
  LayoutGrid,
  Mail,
  PenLine,
  RefreshCw,
  Rocket,
  Send,
  Target,
  UserRound,
} from "lucide-react";

import { loadDashboardModuleStates } from "@/lib/dashboard/state";
import { getLinkedInState } from "@/lib/linkedin/storage";
import { getSettingsState } from "@/lib/settings/storage";

import type {
  BriefInsight,
  ContentItem,
  MissionAction,
  MissionBrief,
  MissionControlData,
  MissionOpportunity,
  NetworkingContact,
  RecommendedAction,
  TrendingTopic,
} from "./types";

function getGreeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatDateLabel(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? "there";
}

function daysSince(dateStr: string): number | null {
  const parsed = Date.parse(dateStr);
  if (Number.isNaN(parsed)) return null;
  return Math.floor((Date.now() - parsed) / (1000 * 60 * 60 * 24));
}

interface CareerSignals {
  userName: string;
  firstName: string;
  hasCareerOsData: boolean;
  activeProject: { name: string } | null;
  completedCert: { name: string } | null;
  inProgressCert: { name: string } | null;
  portfolioCount: number;
  learningHours: string | null;
  learningStreak: string | null;
  learningCourse: string | null;
  activeGoal: { title: string; progress: number } | null;
  jobSearchActive: boolean;
  activeApplications: number;
  profileTitle: string | null;
  profileBio: string | null;
  daysSinceLastPost: number | null;
}

function readCareerSignals(forceEmpty = false): CareerSignals {
  if (forceEmpty) {
    return {
      userName: "CareerOS User",
      firstName: "there",
      hasCareerOsData: false,
      activeProject: null,
      completedCert: null,
      inProgressCert: null,
      portfolioCount: 0,
      learningHours: null,
      learningStreak: null,
      learningCourse: null,
      activeGoal: null,
      jobSearchActive: false,
      activeApplications: 0,
      profileTitle: null,
      profileBio: null,
      daysSinceLastPost: null,
    };
  }

  const settings = getSettingsState();
  const m = loadDashboardModuleStates();
  const linkedInPosts = getLinkedInState().posts.filter((p) => !p.archived);

  const activeProjects = m.projects.projects.filter(
    (p) => !p.archived && (p.status === "Building" || p.status === "Live")
  );
  const completedCerts = m.certifications.certifications.filter(
    (c) => !c.archived && c.status === "Completed"
  );
  const inProgressCerts = m.certifications.certifications.filter(
    (c) => !c.archived && c.status === "In Progress"
  );
  const portfolio = m.portfolio.projects.filter((p) => !p.archived);
  const activeGoals = m.goals.goals.filter(
    (g) => !g.archived && g.status !== "Completed"
  );
  const activeJobs = m.jobTracker.applications.filter(
    (a) => !a.archived && a.applicationStatus === "Active"
  );
  const activeCourse = m.learning.courses.find((c) => c.status !== "completed");

  const publishedDates = linkedInPosts
    .map((p) => p.publishDate)
    .filter(Boolean)
    .sort()
    .reverse();
  const daysSinceLastPost = publishedDates[0] ? daysSince(publishedDates[0]) : null;

  const userName = settings.profile.name.trim() || "CareerOS User";

  const hasCareerOsData =
    activeProjects.length > 0 ||
    completedCerts.length > 0 ||
    inProgressCerts.length > 0 ||
    portfolio.length > 0 ||
    activeGoals.length > 0 ||
    activeJobs.length > 0 ||
    Boolean(m.learning.hoursThisWeek) ||
    Boolean(settings.profile.title) ||
    Boolean(settings.profile.bio);

  return {
    userName,
    firstName: firstName(userName),
    hasCareerOsData,
    activeProject: activeProjects[0] ? { name: activeProjects[0].name } : null,
    completedCert: completedCerts[0] ? { name: completedCerts[0].name } : null,
    inProgressCert: inProgressCerts[0] ? { name: inProgressCerts[0].name } : null,
    portfolioCount: portfolio.length,
    learningHours: m.learning.hoursThisWeek || null,
    learningStreak: m.learning.dailyStreak || null,
    learningCourse: activeCourse?.title ?? m.learning.courses[0]?.title ?? null,
    activeGoal: activeGoals[0]
      ? { title: activeGoals[0].goalTitle, progress: activeGoals[0].progress }
      : null,
    jobSearchActive: activeJobs.length > 0,
    activeApplications: activeJobs.length,
    profileTitle: settings.profile.title || null,
    profileBio: settings.profile.bio || null,
    daysSinceLastPost,
  };
}

const priorityWeight = { high: 3, medium: 2, low: 1 } as const;

function buildOpportunities(signals: CareerSignals): {
  opportunities: MissionOpportunity[];
  improvements: MissionOpportunity[];
  achievements: MissionOpportunity[];
} {
  const opportunities: MissionOpportunity[] = [];
  const improvements: MissionOpportunity[] = [];
  const achievements: MissionOpportunity[] = [];

  if (signals.activeProject) {
    opportunities.push({
      id: "opp-project",
      kind: "opportunity",
      title: `Your ${signals.activeProject.name} project is ready to announce`,
      description: "A launch post could establish credibility while momentum is high.",
      source: "Projects",
      priority: "high",
      actionId: "generate-post",
      ctaLabel: "Generate launch post",
      whyReason: `Your project "${signals.activeProject.name}" is actively in progress in CareerOS.`,
      leadIn: "I found",
    });
  }

  if (signals.completedCert) {
    achievements.push({
      id: "ach-cert",
      kind: "achievement",
      title: `Your ${signals.completedCert.name} certification is worth sharing`,
      description: "Celebration posts build authority when they're authentic.",
      source: "Certifications",
      priority: "high",
      actionId: "generate-post",
      ctaLabel: "Celebrate achievement",
      whyReason: `You recently completed ${signals.completedCert.name} in CareerOS.`,
      leadIn: "I noticed",
    });
  }

  if (signals.learningStreak && parseInt(signals.learningStreak, 10) >= 3) {
    achievements.push({
      id: "ach-streak",
      kind: "achievement",
      title: `Your learning streak reached ${signals.learningStreak} days`,
      description: "Consistency stories resonate — your network values discipline.",
      source: "Learning",
      priority: "high",
      actionId: "generate-post",
      ctaLabel: "Share learning win",
      whyReason: `Your daily learning streak in CareerOS hit ${signals.learningStreak} days.`,
      leadIn: "I noticed",
    });
  }

  if (signals.portfolioCount > 0) {
    opportunities.push({
      id: "opp-portfolio",
      kind: "opportunity",
      title: "Your portfolio hasn't been shared recently",
      description: `${signals.portfolioCount} published item${signals.portfolioCount === 1 ? "" : "s"} could become LinkedIn content.`,
      source: "Portfolio",
      priority: "medium",
      actionId: "generate-carousel",
      ctaLabel: "Create showcase post",
      whyReason: "CareerOS shows portfolio work that hasn't been turned into content yet.",
      leadIn: "I recommend",
    });
  }

  if (signals.daysSinceLastPost !== null && signals.daysSinceLastPost >= 7) {
    opportunities.push({
      id: "opp-post-cadence",
      kind: "opportunity",
      title: `You haven't posted in ${signals.daysSinceLastPost} days`,
      description: "Regular presence keeps you visible to your network.",
      source: "Content Hub",
      priority: "medium",
      actionId: "generate-post",
      ctaLabel: "Draft a post today",
      whyReason: "Based on your LinkedIn activity tracked in CareerOS.",
      leadIn: "Based on your recent activity",
    });
  } else if (signals.daysSinceLastPost === null && linkedInPostsEmpty(signals)) {
    opportunities.push({
      id: "opp-first-post",
      kind: "opportunity",
      title: "You haven't shared anything on LinkedIn yet",
      description: "Your CareerOS data gives you plenty to talk about for a first post.",
      source: "Content Hub",
      priority: "medium",
      actionId: "generate-post",
      ctaLabel: "Write first post",
      whyReason: "No published posts found in your CareerOS LinkedIn tracker.",
      leadIn: "I found",
    });
  }

  if (signals.inProgressCert) {
    opportunities.push({
      id: "opp-cert-progress",
      kind: "opportunity",
      title: `Share progress on ${signals.inProgressCert.name}`,
      description: "Learning-in-public posts perform well mid-journey.",
      source: "Certifications",
      priority: "medium",
      actionId: "generate-post",
      ctaLabel: "Draft progress post",
      whyReason: `${signals.inProgressCert.name} is in progress in your Certifications module.`,
      leadIn: "I recommend",
    });
  }

  if (signals.learningHours) {
    opportunities.push({
      id: "opp-learning",
      kind: "opportunity",
      title: `Share what you learned this week (${signals.learningHours})`,
      description: signals.learningCourse
        ? `${signals.learningCourse} progress is fresh — ideal for a recap.`
        : "Weekly learning recaps position you as a continuous learner.",
      source: "Learning",
      priority: "medium",
      actionId: "generate-post",
      ctaLabel: "Draft learning post",
      whyReason: `You logged ${signals.learningHours} in CareerOS Learning this week.`,
      leadIn: "Based on your recent activity",
    });
  }

  if (signals.activeGoal && signals.activeGoal.progress >= 70) {
    achievements.push({
      id: "ach-goal",
      kind: "achievement",
      title: `Goal milestone: ${signals.activeGoal.title}`,
      description: `${signals.activeGoal.progress}% complete — worth sharing publicly.`,
      source: "Goals",
      priority: "high",
      actionId: "generate-post",
      ctaLabel: "Share milestone",
      whyReason: `Your goal "${signals.activeGoal.title}" is ${signals.activeGoal.progress}% complete.`,
      leadIn: "I noticed",
    });
  }

  if (signals.jobSearchActive) {
    opportunities.push({
      id: "opp-jobs",
      kind: "opportunity",
      title: "Optimize your profile before your next application",
      description: `${signals.activeApplications} active application${signals.activeApplications === 1 ? "" : "s"} — your headline matters now.`,
      source: "Job Tracker",
      priority: "high",
      actionId: "improve-headline",
      ctaLabel: "Improve headline",
      whyReason: "CareerOS Job Tracker shows an active search in progress.",
      leadIn: "AI Recommendation",
    });
  }

  if (!signals.profileTitle) {
    improvements.push({
      id: "imp-headline",
      kind: "improvement",
      title: "Your LinkedIn headline needs a sharper angle",
      description: "Add your professional title in Settings for better AI drafts.",
      source: "Settings",
      priority: "medium",
      actionId: "improve-headline",
      ctaLabel: "Improve headline",
      whyReason: "No professional title found in your CareerOS profile.",
      leadIn: "I noticed",
    });
  }

  if (!signals.profileBio) {
    improvements.push({
      id: "imp-bio",
      kind: "improvement",
      title: "Your About section could be stronger",
      description: "A bio in Settings unlocks much better personalization.",
      source: "Settings",
      priority: "medium",
      actionId: "generate-about",
      ctaLabel: "Generate About draft",
      whyReason: "Your CareerOS profile bio is empty — AI has less context to work with.",
      leadIn: "I recommend",
    });
  }

  if (!signals.hasCareerOsData) {
    opportunities.push({
      id: "opp-empty",
      kind: "opportunity",
      title: "Add career data to unlock smarter recommendations",
      description: "Projects, certifications, and goals power your Mission Control brief.",
      source: "CareerOS",
      priority: "low",
      actionId: "weekly-plan",
      ctaLabel: "Create content plan",
      whyReason: "CareerOS modules are mostly empty — add data to personalize further.",
      leadIn: "I found",
    });
  }

  return { opportunities, improvements, achievements };
}

function linkedInPostsEmpty(_signals: CareerSignals): boolean {
  return getLinkedInState().posts.filter((p) => !p.archived).length === 0;
}

function categoryLabelFromOpportunity(item: MissionOpportunity): string {
  const byId: Record<string, string> = {
    "opp-first-post": "Getting Started",
    "opp-learning": "Learning",
    "ach-streak": "Learning Streak",
    "imp-headline": "Profile",
    "imp-bio": "Personal Brand",
    "opp-post-cadence": "Content Cadence",
    "opp-jobs": "Job Search",
  };

  if (byId[item.id]) return byId[item.id];

  const bySource: Partial<Record<MissionOpportunity["source"], string>> = {
    Projects: "Projects",
    Learning: "Learning",
    Goals: "Goals",
    Certifications: "Certifications",
    Portfolio: "Portfolio",
    Settings: "Profile",
    "Content Hub": "Content",
    "Job Tracker": "Job Search",
  };

  return bySource[item.source] ?? "Insight";
}

const FALLBACK_INSIGHTS: BriefInsight[] = [
  {
    id: "fb-rhythm",
    categoryLabel: "Content Rhythm",
    text: "A steady weekly rhythm keeps you visible without burnout.",
    leadIn: "I recommend",
    sources: ["CareerOS"],
    whyReason: "Consistent presence compounds over time.",
    priority: "low",
  },
  {
    id: "fb-network",
    categoryLabel: "Networking",
    text: "One thoughtful follow-up can reopen a valuable connection.",
    leadIn: "I noticed",
    sources: ["CareerOS"],
    whyReason: "Warm outreach outperforms cold posting alone.",
    priority: "low",
  },
  {
    id: "fb-brand",
    categoryLabel: "Personal Brand",
    text: "Your story is clearer when projects and learning align.",
    leadIn: "Based on your recent activity",
    sources: ["CareerOS"],
    whyReason: "Cross-module signals make stronger narratives.",
    priority: "low",
  },
  {
    id: "fb-plan",
    categoryLabel: "Planning",
    text: "A content plan turns scattered ideas into a focused week.",
    leadIn: "I found",
    sources: ["CareerOS"],
    whyReason: "Structure reduces decision fatigue before you post.",
    priority: "low",
  },
];

function buildActiveDataSources(signals: CareerSignals): BriefInsight["sources"] {
  const sources: BriefInsight["sources"] = [];

  if (signals.activeProject) sources.push("Projects");
  if (signals.completedCert || signals.inProgressCert) sources.push("Certifications");
  if (signals.learningHours || signals.learningStreak || signals.learningCourse) {
    sources.push("Learning");
  }
  if (signals.activeGoal) sources.push("Goals");
  if (signals.portfolioCount > 0) sources.push("Portfolio");
  if (signals.jobSearchActive) sources.push("Job Tracker");
  if (signals.profileTitle || signals.profileBio) sources.push("Settings");

  return sources.length > 0 ? sources : ["CareerOS"];
}

function buildBriefInsights(
  opportunities: MissionOpportunity[],
  improvements: MissionOpportunity[],
  achievements: MissionOpportunity[]
): BriefInsight[] {
  const ranked = [...achievements, ...opportunities, ...improvements].sort(
    (a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]
  );

  const insights = ranked.slice(0, 4).map((item) => ({
    id: `insight-${item.id}`,
    categoryLabel: categoryLabelFromOpportunity(item),
    text: item.title,
    leadIn: item.leadIn,
    sources: [item.source],
    whyReason: item.whyReason,
    priority: item.priority,
  }));

  let fallbackIndex = 0;
  while (insights.length < 4 && fallbackIndex < FALLBACK_INSIGHTS.length) {
    const candidate = FALLBACK_INSIGHTS[fallbackIndex];
    fallbackIndex += 1;
    if (!insights.some((insight) => insight.id === candidate.id)) {
      insights.push(candidate);
    }
  }

  return insights.slice(0, 4);
}

function buildRecommended(
  opportunities: MissionOpportunity[],
  achievements: MissionOpportunity[],
  signals: CareerSignals
): RecommendedAction {
  const top =
    [...achievements, ...opportunities]
      .sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority])[0] ??
    opportunities[0] ??
    achievements[0];

  if (top?.id === "opp-project" && signals.activeProject) {
    return {
      id: "rec-project",
      title: `Launch ${signals.activeProject.name} on LinkedIn`,
      subtitle: "Your highest-impact move today — turn active work into visibility.",
      ctaLabel: "Generate Post",
      actionId: "generate-post",
      accent: "#17a5fb",
      tint: "rgba(23,165,251,0.12)",
      whyReason: `Recommended because your "${signals.activeProject.name}" project was recently updated in CareerOS.`,
      sources: ["Projects"],
      leadIn: "AI Recommendation",
    };
  }

  if (top) {
    const title =
      top.id === "opp-project" && signals.activeProject
        ? `Launch ${signals.activeProject.name} on LinkedIn`
        : top.title;

    return {
      id: `rec-${top.id}`,
      title,
      subtitle: top.description,
      ctaLabel: top.ctaLabel,
      actionId: top.actionId,
      accent: top.kind === "achievement" ? "#e80584" : "#17a5fb",
      tint: top.kind === "achievement" ? "rgba(232,5,132,0.10)" : "rgba(23,165,251,0.12)",
      whyReason: top.whyReason,
      sources: [top.source],
      leadIn: "AI Recommendation",
    };
  }

  return {
    id: "rec-default",
    title: "Create your weekly content plan",
    subtitle: "Start with structure — the AI will fill in topics from your career data.",
    ctaLabel: "Create Weekly Plan",
    actionId: "weekly-plan",
    accent: "#8b5cf6",
    tint: "rgba(139,92,246,0.10)",
    whyReason: "A plan gives you clarity when CareerOS data is still growing.",
    sources: ["CareerOS"],
    leadIn: "I recommend",
  };
}

function buildActions(signals: CareerSignals): MissionAction[] {
  const templates: Array<
    Omit<MissionAction, "relevance"> & { when: (s: CareerSignals) => boolean; relevance: number }
  > = [
    {
      id: "project-launch",
      label: "Project Launch Post",
      description: signals.activeProject?.name ?? "From your active project",
      icon: Rocket,
      color: "#17a5fb",
      tint: "rgba(23,165,251,0.12)",
      category: "create",
      whyReason: signals.activeProject
        ? `Suggested because "${signals.activeProject.name}" is building in CareerOS.`
        : "Create content from your projects.",
      sources: ["Projects"],
      relevance: 95,
      when: (s) => Boolean(s.activeProject),
    },
    {
      id: "cert-celebrate",
      label: "Celebrate Certification",
      description: signals.completedCert?.name ?? "Share your win",
      icon: Award,
      color: "#e80584",
      tint: "rgba(232,5,132,0.10)",
      category: "create",
      whyReason: signals.completedCert
        ? `Suggested because you completed ${signals.completedCert.name}.`
        : "Share a certification milestone.",
      sources: ["Certifications"],
      relevance: 90,
      when: (s) => Boolean(s.completedCert),
    },
    {
      id: "generate-post",
      label: "Generate LinkedIn Post",
      description: "Draft from your CareerOS context",
      icon: PenLine,
      color: "#17a5fb",
      tint: "rgba(23,165,251,0.12)",
      category: "create",
      whyReason: "Your most flexible starting point for any topic.",
      sources: ["CareerOS"],
      relevance: 80,
      when: () => true,
    },
    {
      id: "improve-headline",
      label: "Improve Headline",
      description: "Recruiter-optimized options",
      icon: Target,
      color: "#f59e0b",
      tint: "rgba(245,158,11,0.12)",
      category: "optimize",
      whyReason: signals.jobSearchActive
        ? "Suggested because you have active job applications."
        : "A sharper headline improves discoverability.",
      sources: signals.jobSearchActive ? ["Job Tracker", "Settings"] : ["Settings"],
      relevance: signals.jobSearchActive ? 88 : 65,
      when: (s) => s.jobSearchActive || !s.profileTitle,
    },
    {
      id: "generate-carousel",
      label: "Generate Carousel",
      description: "Multi-slide visual content",
      icon: Images,
      color: "#8b5cf6",
      tint: "rgba(139,92,246,0.12)",
      category: "create",
      whyReason: "Suggested because you have portfolio work to showcase.",
      sources: ["Portfolio"],
      relevance: 75,
      when: (s) => s.portfolioCount > 0,
    },
    {
      id: "weekly-plan",
      label: "Weekly Content Plan",
      description: "5-day posting roadmap",
      icon: Calendar,
      color: "#17a5fb",
      tint: "rgba(23,165,251,0.12)",
      category: "plan",
      whyReason: "Structure your week based on CareerOS activity.",
      sources: ["Learning", "Projects", "Goals"],
      relevance: 70,
      when: () => true,
    },
    {
      id: "generate-about",
      label: "Generate About Section",
      description: "Professional summary draft",
      icon: FileText,
      color: "#e80584",
      tint: "rgba(232,5,132,0.10)",
      category: "optimize",
      whyReason: "Suggested because your profile bio needs strengthening.",
      sources: ["Settings"],
      relevance: 68,
      when: (s) => !s.profileBio,
    },
    {
      id: "networking-followup",
      label: "Networking Follow-up",
      description: "Re-engage a connection",
      icon: Mail,
      color: "#8b5cf6",
      tint: "rgba(139,92,246,0.12)",
      category: "network",
      whyReason: "Warm follow-ups maintain relationships.",
      sources: ["CareerOS"],
      relevance: 60,
      when: () => true,
    },
    {
      id: "outreach-message",
      label: "Generate Outreach Message",
      description: "Personalized connection note",
      icon: Send,
      color: "#0ea5e9",
      tint: "rgba(14,165,233,0.12)",
      category: "network",
      whyReason: "Suggested because you're actively job searching.",
      sources: ["Job Tracker"],
      relevance: 85,
      when: (s) => s.jobSearchActive,
    },
    {
      id: "content-calendar",
      label: "Create Content Calendar",
      description: "Month-at-a-glance plan",
      icon: LayoutGrid,
      color: "#6366f1",
      tint: "rgba(99,102,241,0.12)",
      category: "plan",
      whyReason: "Suggested because you have enough CareerOS data to plan ahead.",
      sources: ["Projects", "Learning", "Goals"],
      relevance: 55,
      when: (s) => s.hasCareerOsData,
    },
    {
      id: "rewrite-post",
      label: "Rewrite Existing Post",
      description: "Improve tone & clarity",
      icon: RefreshCw,
      color: "#6366f1",
      tint: "rgba(99,102,241,0.12)",
      category: "create",
      whyReason: "Refine something you've already drafted.",
      sources: ["Content Hub"],
      relevance: 50,
      when: () => true,
    },
    {
      id: "review-profile",
      label: "Review LinkedIn Profile",
      description: "Structured improvement checklist",
      icon: UserRound,
      color: "#10b981",
      tint: "rgba(16,185,129,0.12)",
      category: "optimize",
      whyReason: "A quick audit before you publish.",
      sources: ["Settings", "CareerOS"],
      relevance: 45,
      when: () => true,
    },
  ];

  return templates
    .filter((t) => t.when(signals))
    .sort((a, b) => b.relevance - a.relevance)
    .map(({ when: _when, relevance, ...action }) => ({ ...action, relevance }));
}

function buildNetworkingMock(signals: CareerSignals): NetworkingContact[] {
  const base: NetworkingContact[] = [
    {
      id: "net-1",
      name: "Priya Sharma",
      role: "Engineering Manager",
      company: "Stripe",
      context: "Met at AWS re:Invent — discussed cloud architecture",
      category: "reconnect",
      lastTouch: "3 months ago",
      actionLabel: "Draft reconnect message",
      whyReason: "It's been 3 months since your last interaction.",
      leadIn: "I recommend",
    },
    {
      id: "net-2",
      name: "James Okonkwo",
      role: "Senior Recruiter",
      company: "Meta",
      context: "Reached out about platform engineering roles",
      category: "recruiter",
      lastTouch: "1 week ago",
      actionLabel: "Send follow-up",
      whyReason: "Active job search — follow up while the conversation is warm.",
      leadIn: "Based on your recent activity",
    },
    {
      id: "net-3",
      name: "Alex Chen",
      role: "Founder",
      company: "DevTools startup",
      context: "Potential collaborator on open-source tooling",
      category: "collaborator",
      lastTouch: "2 weeks ago",
      actionLabel: "Suggest collaboration",
      whyReason: "Their work aligns with your active projects.",
      leadIn: "I found",
    },
    {
      id: "net-4",
      name: "Maria Santos",
      role: "Product Designer",
      company: "Figma",
      context: "Commented on your last post — follow up while warm",
      category: "follow-up",
      lastTouch: "4 days ago",
      actionLabel: "Write follow-up",
      whyReason: "Recent engagement — ideal moment to deepen the connection.",
      leadIn: "I noticed",
    },
  ];

  if (signals.jobSearchActive) return base;
  return base.filter((c) => c.category !== "recruiter").slice(0, 3);
}

function buildContentMock(signals: CareerSignals): ContentItem[] {
  const items: ContentItem[] = [];

  if (signals.activeProject) {
    items.push({
      id: "cnt-1",
      title: `${signals.activeProject.name} launch draft`,
      subtitle: "AI-recommended · Not yet published",
      status: "draft",
      actionLabel: "Open draft",
      whyReason: "Draft created from your active project in CareerOS.",
      sources: ["Projects"],
    });
  }

  items.push(
    {
      id: "cnt-2",
      title: "Weekly content plan",
      subtitle: "Mon–Fri posting schedule",
      status: "plan",
      dateLabel: "This week",
      actionLabel: "View plan",
      whyReason: "Structured from your Learning and Goals activity.",
      sources: ["Learning", "Goals"],
    },
    {
      id: "cnt-3",
      title: "Build in public thread",
      subtitle: "Idea · Career growth narrative",
      status: "idea",
      actionLabel: "Develop idea",
      whyReason: "Suggested based on your project momentum.",
      sources: ["Projects"],
    }
  );

  if (signals.completedCert) {
    items.push({
      id: "cnt-4",
      title: `${signals.completedCert.name} celebration post`,
      subtitle: "Ready to refine",
      status: "scheduled",
      dateLabel: "Suggested for tomorrow",
      actionLabel: "Edit draft",
      whyReason: `Tied to your completed ${signals.completedCert.name} certification.`,
      sources: ["Certifications"],
    });
  }

  return items.slice(0, 4);
}

function buildTrending(signals: CareerSignals): TrendingTopic[] {
  const topics: TrendingTopic[] = [
    {
      id: "t1",
      topic: "AI in career development",
      relevance: "Matches your AI Tools activity",
      whyReason: "Inferred from modules you use in CareerOS.",
      sources: ["CareerOS"],
    },
    {
      id: "t2",
      topic: "Build in public",
      relevance: "Aligns with your active projects",
      whyReason: signals.activeProject
        ? `Relevant to ${signals.activeProject.name}.`
        : "Popular among builders in your space.",
      sources: signals.activeProject ? ["Projects"] : ["CareerOS"],
    },
  ];

  if (signals.completedCert || signals.inProgressCert) {
    topics.push({
      id: "t3",
      topic: "Cloud certification journeys",
      relevance: "From your certification path",
      whyReason: "Suggested because you're pursuing cloud credentials.",
      sources: ["Certifications"],
    });
  }

  return topics.slice(0, 3);
}

export function buildMissionControlData(options?: {
  forceEmpty?: boolean;
  userNameOverride?: string;
}): MissionControlData {
  const signals = readCareerSignals(options?.forceEmpty);
  if (options?.userNameOverride) {
    signals.userName = options.userNameOverride;
    signals.firstName = firstName(options.userNameOverride);
  }

  const { opportunities, improvements, achievements } = buildOpportunities(signals);
  const now = new Date();
  const insights = buildBriefInsights(opportunities, improvements, achievements);

  const brief: MissionBrief = {
    greeting: getGreeting(now.getHours()),
    dateLabel: formatDateLabel(now),
    narrativeIntro: signals.hasCareerOsData
      ? "I've analyzed your CareerOS — here's what deserves your attention today."
      : "I'm ready to analyze your career — add data in CareerOS to go deeper.",
    analysisLine: "Four signals surfaced from your modules.",
    insights,
    activeDataSources: buildActiveDataSources(signals),
    recommended: buildRecommended(opportunities, achievements, signals),
    opportunities,
    improvements,
    achievements,
  };

  return {
    userName: signals.userName,
    firstName: signals.firstName,
    brief,
    actions: buildActions(signals),
    networking: buildNetworkingMock(signals),
    content: buildContentMock(signals),
    trending: buildTrending(signals),
    hasCareerOsData: signals.hasCareerOsData,
  };
}

export function buildMockDraft(actionId: string, data: MissionControlData): {
  title: string;
  content: string;
  type: string;
} {
  const project =
    data.brief.opportunities.find((o) => o.id === "opp-project")?.title.match(/Your (.+) project/)?.[1] ??
    "your project";

  const drafts: Record<string, { title: string; content: string; type: string }> = {
    "generate-post": {
      title: "LinkedIn Post Draft",
      type: "post",
      content: `🚀 Excited to share progress on ${project}.

What started as a side project is becoming something I'm genuinely proud of.

Key lessons this week:
→ Ship small, iterate fast
→ Let your Career OS compound daily habits
→ Share the journey, not just the outcome

More updates soon. #BuildInPublic #CareerGrowth`,
    },
    "generate-carousel": {
      title: "Carousel Outline · 5 slides",
      type: "carousel",
      content: `Slide 1: Hook — "What I learned building in public"
Slide 2: The problem you set out to solve
Slide 3: 3 technical decisions & trade-offs
Slide 4: Honest results from CareerOS (no vanity metrics)
Slide 5: CTA — ask your network a question`,
    },
    "weekly-plan": {
      title: "Weekly Content Plan",
      type: "plan",
      content: `Mon — Project progress update
Tue — Learning recap
Wed — Industry insight / trending topic
Thu — Achievement or milestone share
Fri — Networking follow-up + question post`,
    },
    "improve-headline": {
      title: "Headline Options",
      type: "headline",
      content: `Option A: Software Engineer · Building ${project} · Cloud & AI
Option B: Full-Stack Engineer · Open to opportunities
Option C: Engineer · Learning in public · Career growth systems`,
    },
    "generate-about": {
      title: "About Section Draft",
      type: "about",
      content: `I build products that help people grow their careers with intention.

Currently focused on ${project} and continuous learning. I believe in documenting the journey — the wins, the failures, and the systems that make progress repeatable.

Let's connect if you're building, hiring, or learning in public.`,
    },
    "networking-followup": {
      title: "Follow-up Message",
      type: "message",
      content: `Hi [Name] — hope you've been well since we last connected. I noticed your recent post on [topic] and it resonated with work I'm doing on ${project}. Would love to catch up briefly if you're open to it.`,
    },
    default: {
      title: "AI Output",
      type: "draft",
      content: "Your personalized draft will appear here. This prototype simulates output — production will use real AI.",
    },
  };

  return drafts[actionId] ?? drafts.default;
}
