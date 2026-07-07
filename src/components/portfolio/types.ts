export type PortfolioStage =
  | "research"
  | "wireframe"
  | "uiDesign"
  | "prototype"
  | "dev"
  | "published";

export type PortfolioCategory =
  | "UX Case Study"
  | "UI Design"
  | "Product Design"
  | "Mobile App"
  | "Website"
  | "Dashboard"
  | "Other";

export type PortfolioStatus = "Draft" | "Published" | "Archived";

export interface PortfolioProject {
  id: string;
  name: string;
  stages: Record<PortfolioStage, boolean>;
  favourite: boolean;
  archived: boolean;
}

export const PORTFOLIO_STAGES: { key: PortfolioStage; label: string }[] = [
  { key: "research", label: "Research" },
  { key: "wireframe", label: "Wireframe" },
  { key: "uiDesign", label: "UI Design" },
  { key: "prototype", label: "Prototype" },
  { key: "dev", label: "Dev" },
  { key: "published", label: "Published" },
];

export const defaultPortfolioStages: Record<PortfolioStage, boolean> = {
  research: false,
  wireframe: false,
  uiDesign: false,
  prototype: false,
  dev: false,
  published: false,
};
