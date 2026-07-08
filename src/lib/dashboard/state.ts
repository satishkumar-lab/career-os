import { getAiToolsState, type AiToolsPersistedState } from "@/lib/ai-tools/storage";
import { getCertificationsState, type CertificationsPersistedState } from "@/lib/certifications/storage";
import { getDashboardTasksState, type DashboardTasksPersistedState } from "@/lib/dashboard/tasks-storage";
import { getGoalsState, type GoalsPersistedState } from "@/lib/goals/storage";
import { getInstagramState, type InstagramPersistedState } from "@/lib/instagram/storage";
import { getJobTrackerState, type JobTrackerPersistedState } from "@/lib/job-tracker/storage";
import { getLearningState, type LearningPersistedState } from "@/lib/learning/storage";
import { getLinkedInState, type LinkedInPersistedState } from "@/lib/linkedin/storage";
import { getPortfolioState, type PortfolioPersistedState } from "@/lib/portfolio/storage";
import { getProjectsState, type ProjectsPersistedState } from "@/lib/projects/storage";

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
  dashboardTasks: DashboardTasksPersistedState;
}

export function loadDashboardModuleStates(): DashboardModuleStates {
  return {
    learning: getLearningState(),
    aiTools: getAiToolsState(),
    certifications: getCertificationsState(),
    projects: getProjectsState(),
    portfolio: getPortfolioState(),
    jobTracker: getJobTrackerState(),
    linkedIn: getLinkedInState(),
    instagram: getInstagramState(),
    goals: getGoalsState(),
    dashboardTasks: getDashboardTasksState(),
  };
}
