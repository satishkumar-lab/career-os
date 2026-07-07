export type ProjectThumbnail =
  | { type: "none" }
  | { type: "custom"; dataUrl: string };
