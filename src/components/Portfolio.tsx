"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
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
  imageCategories,
  previewSrcsFor,
  videoPosterSrcs,
  type ImageCategory,
} from "@/data/portfolio-previews";
import { prefetchImagesNow } from "@/lib/prefetch-images";
import { PORTFOLIO_TABS_ID } from "@/lib/scroll-portfolio-tabs";

const FLIP_MS = 1000;

const mediaTabs = ["Images", "Videos"] as const;
type MediaTab = (typeof mediaTabs)[number];

const mediaTabLabels: Record<MediaTab, string> = {
  Images: "Photography",
  Videos: "Videography",
};

const categoryLabels: Record<ImageCategory, string> = {
  All: "All",
  Architectural: "Architecture",
  Fashion: "Fashion",
  Food: "Culinary",
  Product: "Product",
  Sports: "Athletics",
  Street: "Street",
  "Travel and Nature": "Nature",
};

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
  onPointerDown,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
  onIntent?: () => void;
  onPointerDown?: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerEnter={onIntent}
      onFocus={onIntent}
      className={`px-8 py-3 text-lg transition-colors ${
        active
          ? "bg-charcoal text-cream"
          : "bg-cream text-ink hover:bg-[#eae6df]"
      }`}
    >
      {children}
    </button>
  );
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function Portfolio() {
  const [media, setMedia] = useState<MediaTab>("Images");
  const [activeCategory, setActiveCategory] = useState<ImageCategory>("All");
  const [visitedCategories, setVisitedCategories] = useState<Set<ImageCategory>>(
    () => new Set(["All"]),
  );
  const [visitedVideos, setVisitedVideos] = useState(false);
  const [leavingMedia, setLeavingMedia] = useState<MediaTab | null>(null);
  const [mediaEntering, setMediaEntering] = useState(false);
  const [leavingCategory, setLeavingCategory] = useState<ImageCategory | null>(null);
  const [categoryEntering, setCategoryEntering] = useState(false);
  const mediaRef = useRef(media);
  const categoryRef = useRef(activeCategory);

  useEffect(() => {
    if (!leavingMedia && !mediaEntering) return;
    const id = window.setTimeout(() => {
      setLeavingMedia(null);
      setMediaEntering(false);
    }, FLIP_MS);
    return () => window.clearTimeout(id);
  }, [media, leavingMedia, mediaEntering]);

  useEffect(() => {
    if (!leavingCategory && !categoryEntering) return;
    const id = window.setTimeout(() => {
      setLeavingCategory(null);
      setCategoryEntering(false);
    }, FLIP_MS);
    return () => window.clearTimeout(id);
  }, [activeCategory, leavingCategory, categoryEntering]);

  const rememberCategory = (category: ImageCategory) => {
    setVisitedCategories((current) => {
      if (current.has(category)) return current;
      const next = new Set(current);
      next.add(category);
      return next;
    });
  };

  const showMedia = (tab: MediaTab) => {
    if (tab === mediaRef.current) return;
    const reduced = prefersReducedMotion();
    setLeavingMedia(reduced ? null : mediaRef.current);
    setMediaEntering(!reduced);
    mediaRef.current = tab;
    setMedia(tab);
    if (tab === "Videos") {
      setVisitedVideos(true);
      prefetchImagesNow(videoPosterSrcs);
    }
  };

  const showCategory = (category: ImageCategory) => {
    if (category === categoryRef.current) return;
    const reduced = prefersReducedMotion();
    setLeavingCategory(reduced ? null : categoryRef.current);
    setCategoryEntering(!reduced);
    categoryRef.current = category;
    setActiveCategory(category);
    rememberCategory(category);
    prefetchImagesNow(previewSrcsFor(category));
  };

  return (
    <section id="portfolio" className="bg-canvas py-24">
      <div className="mx-auto max-w-[1320px] px-6 sm:px-10">
        <h2 className="type-stroke text-center font-sans text-[clamp(1.75rem,6.5vw,3.125rem)] uppercase tracking-[0.16em] text-ink">
          Portfolio
        </h2>
        <div className="mx-auto mt-6 h-px w-14 bg-ink/40" />

        <div
          id={PORTFOLIO_TABS_ID}
          className="mt-14 flex flex-wrap justify-center gap-4 scroll-mt-20 sm:scroll-mt-24"
        >
          {mediaTabs.map((tab) => (
            <TabButton
              key={tab}
              active={media === tab}
              onClick={() => {
                showMedia(tab);
                if (tab === "Videos") {
                  window.dispatchEvent(new Event("portfolio-unlock-sound"));
                }
              }}
              onPointerDown={
                tab === "Videos"
                  ? () => {
                      prefetchImagesNow(videoPosterSrcs);
                      flushSync(() => {
                        showMedia("Videos");
                      });
                    }
                  : undefined
              }
              onIntent={() => {
                if (tab === "Videos") prefetchImagesNow(videoPosterSrcs);
              }}
            >
              {mediaTabLabels[tab]}
            </TabButton>
          ))}
        </div>

        {media === "Images" || leavingMedia === "Images" ? (
          <div
            className={`mt-6 flex flex-wrap justify-center gap-4 ${
              media === "Images" ? "" : "invisible pointer-events-none"
            }`}
          >
            {imageCategories.map((category) => (
              <TabButton
                key={category}
                active={activeCategory === category}
                onClick={() => showCategory(category)}
                onIntent={() => prefetchImagesNow(previewSrcsFor(category))}
              >
                {categoryLabels[category]}
              </TabButton>
            ))}
          </div>
        ) : null}

        <div className="portfolio-stage">
          <div
            className={`portfolio-pane ${
              leavingMedia === "Images" ? "is-leaving" : ""
            } ${media === "Images" && mediaEntering ? "is-entering" : ""}`}
            hidden={media !== "Images" && leavingMedia !== "Images"}
            aria-hidden={media !== "Images"}
          >
            <div className="portfolio-stage">
              {imageCategories.map((category) => {
                if (!visitedCategories.has(category)) return null;
                const isActive = activeCategory === category;
                const isLeaving = leavingCategory === category;
                const hidden = !isActive && !isLeaving;
                return (
                  <div
                    key={category}
                    hidden={hidden}
                    aria-hidden={hidden}
                    className={`portfolio-pane ${isLeaving ? "is-leaving" : ""} ${
                      isActive && categoryEntering ? "is-entering" : ""
                    }`}
                  >
                    {imageGrids[category]()}
                  </div>
                );
              })}
            </div>
          </div>

          {visitedVideos ? (
            <div
              className={`portfolio-pane ${
                leavingMedia === "Videos" ? "is-leaving" : ""
              } ${media === "Videos" && mediaEntering ? "is-entering" : ""}`}
              hidden={media !== "Videos" && leavingMedia !== "Videos"}
              aria-hidden={media !== "Videos"}
            >
              <VideoGrid active={media === "Videos"} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
