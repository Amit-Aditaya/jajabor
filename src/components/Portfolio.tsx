"use client";

import Image from "next/image";
import { useState } from "react";

const categories = ["All", "Design", "Development", "Photography", "Product"] as const;
type Category = (typeof categories)[number];

type PortfolioItem = {
  src: string;
  title: string;
  category: Exclude<Category, "All">;
  ratio: string;
};

const items: PortfolioItem[] = [
  { src: "/images/portfolio/p1.jpg", title: "Minimal Watch", category: "Product", ratio: "aspect-[4/5]" },
  { src: "/images/portfolio/p4.jpg", title: "Instant Classic", category: "Photography", ratio: "aspect-[4/3]" },
  { src: "/images/portfolio/p5.jpg", title: "Studio Space", category: "Design", ratio: "aspect-[4/3]" },
  { src: "/images/portfolio/p3.jpg", title: "Suede Editorial", category: "Design", ratio: "aspect-[4/5]" },
  { src: "/images/portfolio/p2.jpg", title: "Sound Study", category: "Photography", ratio: "aspect-[4/3]" },
  { src: "/images/portfolio/p6.jpg", title: "Lightweight Store", category: "Development", ratio: "aspect-square" },
  { src: "/images/portfolio/p8.jpg", title: "Mono Audio", category: "Product", ratio: "aspect-[4/5]" },
];

export default function Portfolio() {
  const [active, setActive] = useState<Category>("All");

  const visible = active === "All" ? items : items.filter((item) => item.category === active);

  return (
    <section id="portfolio" className="bg-white py-24">
      <div className="mx-auto max-w-[1320px] px-6 sm:px-10">
        {/* Heading */}
        <h2 className="text-center text-5xl font-semibold text-neutral-400">Portfolio</h2>
        <div className="mx-auto mt-6 h-[3px] w-14 bg-neutral-500" />

        {/* Filters */}
        <div className="mt-14 flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActive(category)}
              className={`px-8 py-3 text-lg font-medium transition-colors ${
                active === category
                  ? "bg-neutral-800 text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Masonry grid */}
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
      </div>
    </section>
  );
}
