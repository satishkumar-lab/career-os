import type { PortfolioCategory, PortfolioStatus } from "@/components/portfolio/types";

export const PORTFOLIO_STORAGE_KEY = "career-os-portfolio";

export const portfolioCategories: PortfolioCategory[] = [
  "UX Case Study",
  "UI Design",
  "Product Design",
  "Mobile App",
  "Website",
  "Dashboard",
  "Other",
];

export const portfolioStatuses: PortfolioStatus[] = ["Draft", "Published", "Archived"];

export const portfolioTagOptions = [
  "Case Study",
  "Fintech",
  "Mobile",
  "SaaS",
  "Dashboard",
  "Onboarding",
  "UX Research",
  "Product Design",
  "Website",
];

export const portfolioFormSchema = {
  title: { required: true },
  category: { required: true },
  status: { required: true },
  behanceUrl: { url: true },
  dribbbleUrl: { url: true },
  liveWebsiteUrl: { url: true },
  figmaUrl: { url: true },
};

export const defaultSeedCategories: Record<string, PortfolioCategory> = {
  "fintech-dashboard": "Dashboard",
  "mobile-redesign-paytm": "Mobile App",
  "careeros-case-study": "UX Case Study",
  "b2b-saas-onboarding": "Product Design",
};

export const defaultSeedTags: Record<string, string[]> = {
  "fintech-dashboard": ["Fintech", "Dashboard"],
  "mobile-redesign-paytm": ["Mobile", "Case Study"],
  "careeros-case-study": ["Case Study", "Product Design"],
  "b2b-saas-onboarding": ["SaaS", "Onboarding"],
};
