export type PortfolioStage =
  | "research"
  | "wireframe"
  | "uiDesign"
  | "prototype"
  | "dev"
  | "published";

export interface PortfolioProject {
  id: string;
  name: string;
  stages: Record<PortfolioStage, boolean>;
}

export const PORTFOLIO_STAGES: { key: PortfolioStage; label: string }[] = [
  { key: "research", label: "Research" },
  { key: "wireframe", label: "Wireframe" },
  { key: "uiDesign", label: "UI Design" },
  { key: "prototype", label: "Prototype" },
  { key: "dev", label: "Dev" },
  { key: "published", label: "Published" },
];
