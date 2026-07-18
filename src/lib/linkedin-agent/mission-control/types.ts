import type { LucideIcon } from "lucide-react";

export type LinkedInConnectionState = "not_connected" | "connecting" | "connected" | "expired";

export type OpportunityPriority = "high" | "medium" | "low";

export type OpportunityKind = "opportunity" | "improvement" | "achievement";

export type AiLeadIn =
  | "I noticed"
  | "I found"
  | "I recommend"
  | "Based on your recent activity"
  | "AI Recommendation";

export type CareerOsSource =
  | "Projects"
  | "Portfolio"
  | "Certifications"
  | "Learning"
  | "Goals"
  | "Job Tracker"
  | "Settings"
  | "Content Hub"
  | "CareerOS";

export interface BriefInsight {
  id: string;
  categoryLabel: string;
  text: string;
  leadIn: AiLeadIn;
  sources: CareerOsSource[];
  whyReason: string;
  priority: OpportunityPriority;
}

export interface RecommendedAction {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  actionId: string;
  accent: string;
  tint: string;
  whyReason: string;
  sources: CareerOsSource[];
  leadIn: AiLeadIn;
}

export interface MissionAction {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  tint: string;
  category: "create" | "optimize" | "plan" | "network";
  whyReason: string;
  sources: CareerOsSource[];
  relevance: number;
}

export interface MissionOpportunity {
  id: string;
  kind: OpportunityKind;
  title: string;
  description: string;
  source: CareerOsSource;
  priority: OpportunityPriority;
  actionId: string;
  ctaLabel: string;
  whyReason: string;
  leadIn: AiLeadIn;
}

export interface NetworkingContact {
  id: string;
  name: string;
  role: string;
  company: string;
  context: string;
  category: "reconnect" | "follow-up" | "collaborator" | "recruiter";
  lastTouch: string;
  actionLabel: string;
  whyReason: string;
  leadIn: AiLeadIn;
}

export interface ContentItem {
  id: string;
  title: string;
  subtitle: string;
  status: "draft" | "scheduled" | "idea" | "plan";
  dateLabel?: string;
  actionLabel: string;
  whyReason?: string;
  sources?: CareerOsSource[];
}

export interface TrendingTopic {
  id: string;
  topic: string;
  relevance: string;
  whyReason: string;
  sources: CareerOsSource[];
}

export interface MissionBrief {
  greeting: string;
  dateLabel: string;
  narrativeIntro: string;
  analysisLine: string;
  insights: BriefInsight[];
  activeDataSources: CareerOsSource[];
  recommended: RecommendedAction;
  opportunities: MissionOpportunity[];
  improvements: MissionOpportunity[];
  achievements: MissionOpportunity[];
}

export interface MissionControlData {
  userName: string;
  firstName: string;
  brief: MissionBrief;
  actions: MissionAction[];
  networking: NetworkingContact[];
  content: ContentItem[];
  trending: TrendingTopic[];
  hasCareerOsData: boolean;
}

export interface CoachMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}
