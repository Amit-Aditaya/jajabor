"use client";

import Image from "next/image";
import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import ArchitecturalGrid from "@/components/ArchitecturalGrid";
import FashionGrid from "@/components/FashionGrid";

const mediaTabs = ["Images", "Videos"] as const;
type MediaTab = (typeof mediaTabs)[number];

const imageCategories = [
  "All",
  "Architectural",
  "Fashion",
  "Food",
  "Product",
  "Sports",
  "Street",
  "Travel and Nature",
] as const;
type ImageCategory = (typeof imageCategories)[number];

type PortfolioItem = {
  src: string;
  title: string;
  category: Exclude<ImageCategory, "All">;
  ratio: string;
};

const items: PortfolioItem[] = [
  { src: "/images/portfolio/p1.jpg", title: "Minimal Watch", category: "Product", ratio: "aspect-[4/5]" },
  { src: "/images/portfolio/p4.jpg", title: "Instant Classic", category: "Fashion", ratio: "aspect-[4/3]" },
  { src: "/images/portfolio/p5.jpg", title: "Studio Space", category: "Architectural", ratio: "aspect-[4/3]" },
  { src: "/images/portfolio/p3.jpg", title: "Suede Editorial", category: "Fashion", ratio: "aspect-[4/5]" },
  { src: "/images/portfolio/p2.jpg", title: "Sound Study", category: "Street", ratio: "aspect-[4/3]" },
  { src: "/images/portfolio/p6.jpg", title: "Lightweight Store", category: "Architectural", ratio: "aspect-square" },
  { src: "/images/portfolio/p8.jpg", title: "Mono Audio", category: "Product", ratio: "aspect-[4/5]" },
];

const videos = [
  { id: "v1", title: "Reel 01", poster: "/images/portfolio/p1.jpg" },
  { id: "v2", title: "Reel 02", poster: "/images/portfolio/p3.jpg" },
  { id: "v3", title: "Reel 03", poster: "/images/portfolio/p5.jpg" },
  { id: "v4", title: "Reel 04", poster: "/images/portfolio/p2.jpg" },
  { id: "v5", title: "Reel 05", poster: "/images/portfolio/p4.jpg" },
  { id: "v6", title: "Reel 06", poster: "/images/portfolio/p8.jpg" },
];

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
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

function VideoGrid() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const { scrollLeft, scrollWidth, clientWidth } = root;
    setCanPrev(scrollLeft > 8);
    setCanNext(scrollLeft + clientWidth < scrollWidth - 8);
  }, []);

  useLayoutEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;

    updateScrollState();
    root.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      root.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scrollByCard = (direction: 1 | -1) => {
    const root = scrollerRef.current;
    const card = root?.firstElementChild as HTMLElement | null;
    if (!root || !card) return;

    const styles = getComputedStyle(root);
    const gap = parseFloat(styles.columnGap || styles.gap) || 24;
    root.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: "smooth" });
  };

  return (
    <div className="relative mt-16">
      <div
        ref={scrollerRef}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="region"
        aria-label="Portfolio videos"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            scrollByCard(1);
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            scrollByCard(-1);
          }
        }}
      >
        {videos.map((video) => (
          <article
            key={video.id}
            className="group relative aspect-[9/16] w-full shrink-0 snap-start overflow-hidden bg-neutral-900 sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
          >
            <Image
              src={video.poster}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/90 bg-black/30 backdrop-blur-sm">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden
                  className="ml-1 h-7 w-7 fill-white"
                >
                  <path d="M8 5.14v13.72L19.5 12 8 5.14Z" />
                </svg>
              </span>
              <span className="text-sm uppercase tracking-[0.3em] text-white">
                {video.title}
              </span>
            </div>
          </article>
        ))}
      </div>

      {canPrev && (
        <button
          type="button"
          aria-label="Previous videos"
          onClick={() => scrollByCard(-1)}
          className="absolute top-1/2 left-3 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg transition-colors hover:bg-neutral-700 sm:left-4"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden
            className="h-6 w-6 fill-none stroke-current stroke-[1.8]"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 5 8 12l7 7" />
          </svg>
        </button>
      )}

      {canNext && (
        <button
          type="button"
          aria-label="More videos"
          onClick={() => scrollByCard(1)}
          className="absolute top-1/2 right-3 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg transition-colors hover:bg-neutral-700 sm:right-4"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden
            className="h-6 w-6 fill-none stroke-current stroke-[1.8]"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 5 7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default function Portfolio() {
  const [media, setMedia] = useState<MediaTab>("Images");
  const [activeCategory, setActiveCategory] = useState<ImageCategory>("All");

  const visible =
    activeCategory === "All"
      ? items
      : items.filter((item) => item.category === activeCategory);

  return (
    <section id="portfolio" className="bg-white py-24">
      <div className="mx-auto max-w-[1320px] px-6 sm:px-10">
        <h2 className="text-center text-5xl font-semibold text-neutral-400">Portfolio</h2>
        <div className="mx-auto mt-6 h-[3px] w-14 bg-neutral-500" />

        <div className="mt-14 flex flex-wrap justify-center gap-4">
          {mediaTabs.map((tab) => (
            <TabButton key={tab} active={media === tab} onClick={() => setMedia(tab)}>
              {tab}
            </TabButton>
          ))}
        </div>

        {media === "Images" && (
          <>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              {imageCategories.map((category) => (
                <TabButton
                  key={category}
                  active={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </TabButton>
              ))}
            </div>

            {activeCategory === "Architectural" ? (
              <ArchitecturalGrid />
            ) : activeCategory === "Fashion" ? (
              <FashionGrid />
            ) : visible.length > 0 ? (
              <div className="mt-16 columns-1 gap-6 sm:columns-2 lg:columns-3">
                {visible.map((item) => (
                  <figure key={item.src} className="group relative mb-6 break-inside-avoid overflow-hidden">
                    <div className={`relative w-full ${item.ratio}`}>
                      <Image
                        src={item.src}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <figcaption className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="text-xl font-medium text-white">{item.title}</span>
                      <span className="text-sm uppercase tracking-[0.25em] text-neutral-300">
                        {item.category}
                      </span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <p className="mt-16 text-center text-neutral-400">
                No images in this category yet.
              </p>
            )}
          </>
        )}

        {media === "Videos" && <VideoGrid />}
      </div>
    </section>
  );
}
