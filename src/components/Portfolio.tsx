"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import CategoryMosaic from "@/components/CategoryMosaic";
import VideoGrid from "@/components/VideoGrid";
import {
  imageCategories,
  previewSrcsFor,
  videoPosterSrcs,
  type ImageCategory,
} from "@/data/portfolio-previews";
import { prefetchImagesNow } from "@/lib/prefetch-images";
import { PORTFOLIO_TABS_ID } from "@/lib/scroll-portfolio-tabs";

const SHIFT_MS = 500;

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
          : "bg-[#eae6df] text-ink hover:bg-[#e0dbd2]"
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
  const [visitedVideos, setVisitedVideos] = useState(false);
  const [leavingMedia, setLeavingMedia] = useState<MediaTab | null>(null);
  const [mediaEntering, setMediaEntering] = useState(false);
  const [mediaShift, setMediaShift] = useState<"next" | "prev">("next");
  const mediaRef = useRef(media);
  const categoryRef = useRef(activeCategory);

  useEffect(() => {
    if (!leavingMedia && !mediaEntering) return;
    const id = window.setTimeout(() => {
      setLeavingMedia(null);
      setMediaEntering(false);
    }, SHIFT_MS);
    return () => window.clearTimeout(id);
  }, [media, leavingMedia, mediaEntering]);

  const showMedia = (tab: MediaTab) => {
    if (tab === mediaRef.current) return;
    const reduced = prefersReducedMotion();
    setMediaShift(mediaTabs.indexOf(tab) > mediaTabs.indexOf(mediaRef.current) ? "next" : "prev");
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
    categoryRef.current = category;
    setActiveCategory(category);
    prefetchImagesNow(previewSrcsFor(category));
  };

  return (
    <section id="portfolio" className="bg-cream py-24">
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

        <div
          className={`portfolio-stage ${
            leavingMedia || mediaEntering ? `is-shifting shift-${mediaShift}` : ""
          }`}
        >
          <div
            className={`portfolio-pane ${
              leavingMedia === "Images" ? "is-leaving" : ""
            } ${media === "Images" && mediaEntering ? "is-entering" : ""}`}
            hidden={media !== "Images" && leavingMedia !== "Images"}
            aria-hidden={media !== "Images"}
          >
            <CategoryMosaic category={activeCategory} />
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
