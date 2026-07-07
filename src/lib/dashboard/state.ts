import { initAiToolsState, type AiToolsPersistedState } from "@/lib/ai-tools/storage";
import { initCertificationsState, type CertificationsPersistedState } from "@/lib/certifications/storage";
import { initGoalsState, type GoalsPersistedState } from "@/lib/goals/storage";
import { initInstagramState, type InstagramPersistedState } from "@/lib/instagram/storage";
import { initJobTrackerState, type JobTrackerPersistedState } from "@/lib/job-tracker/storage";
import { initLearningState, type LearningPersistedState } from "@/lib/learning/storage";
import { initLinkedInState, type LinkedInPersistedState } from "@/lib/linkedin/storage";
import { initPortfolioState, type PortfolioPersistedState } from "@/lib/portfolio/storage";
import { initProjectsState, type ProjectsPersistedState } from "@/lib/projects/storage";

export interface DashboardModuleStates {
  learning: LearningPersistedState;
  aiTools: AiToolsPersistedState;
  certifications: CertificationsPersistedState;
  projects: ProjectsPersistedState;
  portfolio: PortfolioPersistedState;
  jobTracker: JobTrackerPersistedState;
  linkedIn: LinkedInPersistedState;
  instagram: InstagramPersistedState;
  goals: GoalsPersistedState;
}

export function loadDashboardModuleStates(): DashboardModuleStates {
  return {
    learning: initLearningState(),
    aiTools: initAiToolsState(),
    certifications: initCertificationsState(),
    projects: initProjectsState(),
    portfolio: initPortfolioState(),
    jobTracker: initJobTrackerState(),
    linkedIn: initLinkedInState(),
    instagram: initInstagramState(),
    goals: initGoalsState(),
  };
}
