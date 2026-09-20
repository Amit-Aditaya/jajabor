"use client";

import { useRef, useState } from "react";
import PortfolioImage from "@/components/PortfolioImage";
import {
  ALL_GRID_HEIGHT,
  ALL_GRID_WIDTH,
  ALL_PREVIEW_HEIGHT,
  allPreviewTiles,
  allTiles,
} from "@/data/all-grid";

export default function AllGrid() {
  const [expanded, setExpanded] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const tiles = expanded ? allTiles : allPreviewTiles;
  const visibleHeight = expanded ? ALL_GRID_HEIGHT : ALL_PREVIEW_HEIGHT;

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    if (!next) {
      rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div ref={rootRef} className="mt-16">
      <div
        className="overflow-hidden"
        style={{ aspectRatio: `${ALL_GRID_WIDTH} / ${visibleHeight}` }}
      >
        <div
          className="relative w-full"
          style={{ aspectRatio: `${ALL_GRID_WIDTH} / ${ALL_GRID_HEIGHT}` }}
        >
          {tiles.map((tile) => {
            const span = tile.w > ALL_GRID_WIDTH / 2;
            return (
              <figure
                key={tile.src}
                className="absolute overflow-hidden"
                style={{
                  left: `${(tile.x / ALL_GRID_WIDTH) * 100}%`,
                  top: `${(tile.y / ALL_GRID_HEIGHT) * 100}%`,
                  width: `${(tile.w / ALL_GRID_WIDTH) * 100}%`,
                  height: `${(tile.h / ALL_GRID_HEIGHT) * 100}%`,
                }}
              >
                <PortfolioImage
                  src={tile.src}
                  sizes={span ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 1024px) 50vw, 33vw"}
                  loading={expanded ? "lazy" : "eager"}
                />
              </figure>
            );
          })}
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <button
          type="button"
          aria-expanded={expanded}
          onClick={toggle}
          className="bg-cream px-8 py-3 text-lg text-ink transition-colors hover:bg-[#eae6df]"
        >
          {expanded ? "See less" : "See all"}
        </button>
      </div>
    </div>
  );
}
