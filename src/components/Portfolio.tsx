"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import ArchitecturalGrid from "@/components/ArchitecturalGrid";
import FashionGrid from "@/components/FashionGrid";
import FoodGrid from "@/components/FoodGrid";
import ProductGrid from "@/components/ProductGrid";
import SportsGrid from "@/components/SportsGrid";
import StreetGrid from "@/components/StreetGrid";
import TravelGrid from "@/components/TravelGrid";
import AllGrid from "@/components/AllGrid";
import VideoGrid from "@/components/VideoGrid";

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

            {activeCategory === "All" ? (
              <AllGrid />
            ) : activeCategory === "Architectural" ? (
              <ArchitecturalGrid />
            ) : activeCategory === "Fashion" ? (
              <FashionGrid />
            ) : activeCategory === "Food" ? (
              <FoodGrid />
            ) : activeCategory === "Product" ? (
              <ProductGrid />
            ) : activeCategory === "Sports" ? (
              <SportsGrid />
            ) : activeCategory === "Street" ? (
              <StreetGrid />
            ) : activeCategory === "Travel and Nature" ? (
              <TravelGrid />
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
