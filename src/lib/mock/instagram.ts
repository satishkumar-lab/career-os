import type { InstagramContentType } from "@/components/instagram/types";

export interface InstagramPostSeed {
  id: string;
  title: string;
  contentType: InstagramContentType;
}

export const instagramPostSeeds: InstagramPostSeed[] = [
  { id: "seed-reel", title: "PM metrics reel", contentType: "Reel" },
  { id: "seed-carousel", title: "Career tips carousel", contentType: "Carousel" },
  { id: "seed-static", title: "Behind the scenes post", contentType: "Single Image" },
];
