import { allPreviewTiles } from "@/data/all-grid";
import { architecturalPreviewTiles } from "@/data/architectural-grid";
import { fashionPreviewTiles } from "@/data/fashion-grid";
import { foodPreviewTiles } from "@/data/food-grid";
import { productPreviewTiles } from "@/data/product-grid";
import { sportsPreviewTiles } from "@/data/sports-grid";
import { streetPreviewTiles } from "@/data/street-grid";
import { travelPreviewTiles } from "@/data/travel-grid";
import { videos } from "@/data/videos";
import { optimizedSrc } from "@/lib/media-src";

export const imageCategories = [
  "All",
  "Architectural",
  "Fashion",
  "Food",
  "Product",
  "Sports",
  "Street",
  "Travel and Nature",
] as const;

export type ImageCategory = (typeof imageCategories)[number];

const previewTiles: Record<ImageCategory, { src: string }[]> = {
  All: allPreviewTiles,
  Architectural: architecturalPreviewTiles,
  Fashion: fashionPreviewTiles,
  Food: foodPreviewTiles,
  Product: productPreviewTiles,
  Sports: sportsPreviewTiles,
  Street: streetPreviewTiles,
  "Travel and Nature": travelPreviewTiles,
};

export function previewSrcsFor(category: ImageCategory) {
  return previewTiles[category].map((tile) => optimizedSrc(tile.src));
}

export const allPreviewSrcs = imageCategories.flatMap(previewSrcsFor);

export const videoPosterSrcs = videos.map((video) => optimizedSrc(video.poster));
