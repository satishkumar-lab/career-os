import type { Course } from "@/components/learning/types";
import type { PersistedAiTool } from "@/lib/ai-tools/storage";
import type { PersistedCertification } from "@/lib/certifications/storage";
import type { PersistedGoal } from "@/lib/goals/storage";
import type { PersistedJobApplication } from "@/lib/job-tracker/storage";
import type { PersistedLinkedInPost } from "@/lib/linkedin/storage";
import type { PersistedInstagramPost } from "@/lib/instagram/storage";
import type { PersistedProject } from "@/lib/projects/storage";
import type { PersistedPortfolioProject } from "@/lib/portfolio/storage";
import { matchesSearch } from "@/lib/search/match";

export function filterCourses(courses: Course[], normalizedQuery: string): Course[] {
  if (!normalizedQuery) {
    return courses;
  }

  return courses.filter((course) => matchesSearch(normalizedQuery, course.title, course.provider));
}

export function filterPersistedAiTools(
  tools: PersistedAiTool[],
  normalizedQuery: string
): PersistedAiTool[] {
  if (!normalizedQuery) {
    return tools;
  }

  return tools.filter((tool) =>
    matchesSearch(normalizedQuery, tool.name, tool.category, tool.note)
  );
}

export function filterPersistedCertifications(
  certifications: PersistedCertification[],
  normalizedQuery: string
): PersistedCertification[] {
  if (!normalizedQuery) {
    return certifications;
  }

  return certifications.filter((certification) =>
    matchesSearch(normalizedQuery, certification.name, certification.provider)
  );
}

export function filterPersistedProjects(
  projects: PersistedProject[],
  normalizedQuery: string
): PersistedProject[] {
  if (!normalizedQuery) {
    return projects;
  }

  return projects.filter((project) =>
    matchesSearch(normalizedQuery, project.name, project.description, project.techStack)
  );
}

export function filterPersistedPortfolioProjects(
  projects: PersistedPortfolioProject[],
  normalizedQuery: string
): PersistedPortfolioProject[] {
  if (!normalizedQuery) {
    return projects;
  }

  return projects.filter((project) => matchesSearch(normalizedQuery, project.title));
}

export function filterPersistedJobApplications(
  applications: PersistedJobApplication[],
  normalizedQuery: string
): PersistedJobApplication[] {
  if (!normalizedQuery) {
    return applications;
  }

  return applications.filter((application) =>
    matchesSearch(normalizedQuery, application.companyName, application.jobTitle)
  );
}

export function filterPersistedLinkedInPosts(
  posts: PersistedLinkedInPost[],
  normalizedQuery: string
): PersistedLinkedInPost[] {
  if (!normalizedQuery) {
    return posts;
  }

  return posts.filter((post) =>
    matchesSearch(normalizedQuery, post.postTitle, post.topic, post.notes)
  );
}

export function filterPersistedInstagramPosts(
  posts: PersistedInstagramPost[],
  normalizedQuery: string
): PersistedInstagramPost[] {
  if (!normalizedQuery) {
    return posts;
  }

  return posts.filter((post) =>
    matchesSearch(normalizedQuery, post.caption, post.contentType)
  );
}

export function filterPersistedGoals(
  goals: PersistedGoal[],
  normalizedQuery: string
): PersistedGoal[] {
  if (!normalizedQuery) {
    return goals;
  }

  return goals.filter((goal) => matchesSearch(normalizedQuery, goal.goalTitle, goal.notes));
}
