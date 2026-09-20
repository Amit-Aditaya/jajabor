"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import ArchitecturalGrid from "@/components/ArchitecturalGrid";
import FashionGrid from "@/components/FashionGrid";
import FoodGrid from "@/components/FoodGrid";
import ProductGrid from "@/components/ProductGrid";
import SportsGrid from "@/components/SportsGrid";
import StreetGrid from "@/components/StreetGrid";
import TravelGrid from "@/components/TravelGrid";
import AllGrid from "@/components/AllGrid";
import VideoGrid from "@/components/VideoGrid";
import {
  allPreviewSrcs,
  imageCategories,
  previewSrcsFor,
  videoPosterSrcs,
  type ImageCategory,
} from "@/data/portfolio-previews";
import { prefetchImages, prefetchImagesNow } from "@/lib/prefetch-images";

const mediaTabs = ["Images", "Videos"] as const;
type MediaTab = (typeof mediaTabs)[number];

const imageGrids: Record<ImageCategory, () => ReactNode> = {
  All: () => <AllGrid />,
  Architectural: () => <ArchitecturalGrid />,
  Fashion: () => <FashionGrid />,
  Food: () => <FoodGrid />,
  Product: () => <ProductGrid />,
  Sports: () => <SportsGrid />,
  Street: () => <StreetGrid />,
  "Travel and Nature": () => <TravelGrid />,
};

function TabButton({
  active,
  children,
  onClick,
  onIntent,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
  onIntent?: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      onPointerEnter={onIntent}
      onFocus={onIntent}
      className={`px-8 py-3 text-lg font-medium transition-colors ${
        active
          ? "bg-neutral-800 text-white"
          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
      }`}
    >
      {children}
    </button>
  );
}

export default function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null);
  const [media, setMedia] = useState<MediaTab>("Images");
  const [activeCategory, setActiveCategory] = useState<ImageCategory>("All");
  const [visitedCategories, setVisitedCategories] = useState<Set<ImageCategory>>(
    () => new Set(["All"]),
  );
  const [visitedVideos, setVisitedVideos] = useState(false);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        prefetchImages([...allPreviewSrcs, ...videoPosterSrcs]);
        observer.disconnect();
      },
      { rootMargin: "400px" },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const showMedia = (tab: MediaTab) => {
    setMedia(tab);
    if (tab === "Videos") {
      setVisitedVideos(true);
      prefetchImagesNow(videoPosterSrcs);
    }
  };

  const showCategory = (category: ImageCategory) => {
    setActiveCategory(category);
    setVisitedCategories((current) => {
      if (current.has(category)) return current;
      const next = new Set(current);
      next.add(category);
      return next;
    });
  };

  return (
    <section ref={sectionRef} id="portfolio" className="bg-white py-24">
      <div className="mx-auto max-w-[1320px] px-6 sm:px-10">
        <h2 className="text-center text-5xl font-semibold text-neutral-400">Portfolio</h2>
        <div className="mx-auto mt-6 h-[3px] w-14 bg-neutral-500" />

        <div className="mt-14 flex flex-wrap justify-center gap-4">
          {mediaTabs.map((tab) => (
            <TabButton
              key={tab}
              active={media === tab}
              onClick={() => showMedia(tab)}
              onIntent={() => {
                if (tab === "Videos") prefetchImagesNow(videoPosterSrcs);
              }}
            >
              {tab}
            </TabButton>
          ))}
        </div>

        <div hidden={media !== "Images"} aria-hidden={media !== "Images"}>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {imageCategories.map((category) => (
              <TabButton
                key={category}
                active={activeCategory === category}
                onClick={() => showCategory(category)}
                onIntent={() => prefetchImagesNow(previewSrcsFor(category))}
              >
                {category}
              </TabButton>
            ))}
          </div>

          {imageCategories.map((category) => {
            if (!visitedCategories.has(category)) return null;
            const hidden = activeCategory !== category;
            return (
              <div key={category} hidden={hidden} aria-hidden={hidden}>
                {imageGrids[category]()}
              </div>
            );
          })}
        </div>

        {visitedVideos ? (
          <div hidden={media !== "Videos"} aria-hidden={media !== "Videos"}>
            <VideoGrid active={media === "Videos"} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
