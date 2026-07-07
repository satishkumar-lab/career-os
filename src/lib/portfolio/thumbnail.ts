export type PortfolioThumbnail =
  | { type: "none" }
  | { type: "custom"; dataUrl: string };
