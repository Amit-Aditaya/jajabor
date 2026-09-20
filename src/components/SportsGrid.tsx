"use client";

import { useRef, useState } from "react";
import PortfolioImage from "@/components/PortfolioImage";
import {
  SPORTS_GRID_HEIGHT,
  SPORTS_GRID_WIDTH,
  SPORTS_PREVIEW_HEIGHT,
  sportsPreviewTiles,
  sportsTiles,
} from "@/data/sports-grid";

export default function SportsGrid() {
  const [expanded, setExpanded] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const tiles = expanded ? sportsTiles : sportsPreviewTiles;
  const visibleHeight = expanded ? SPORTS_GRID_HEIGHT : SPORTS_PREVIEW_HEIGHT;

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
        style={{ aspectRatio: `${SPORTS_GRID_WIDTH} / ${visibleHeight}` }}
      >
        <div
          className="relative w-full"
          style={{ aspectRatio: `${SPORTS_GRID_WIDTH} / ${SPORTS_GRID_HEIGHT}` }}
        >
          {tiles.map((tile) => {
            const span = tile.w > SPORTS_GRID_WIDTH / 2;
            return (
              <figure
                key={tile.src}
                className="absolute overflow-hidden"
                style={{
                  left: `${(tile.x / SPORTS_GRID_WIDTH) * 100}%`,
                  top: `${(tile.y / SPORTS_GRID_HEIGHT) * 100}%`,
                  width: `${(tile.w / SPORTS_GRID_WIDTH) * 100}%`,
                  height: `${(tile.h / SPORTS_GRID_HEIGHT) * 100}%`,
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
          className="bg-neutral-100 px-8 py-3 text-lg font-medium text-neutral-700 transition-colors hover:bg-neutral-200"
        >
          {expanded ? "See less" : "See all"}
        </button>
      </div>
    </div>
  );
}
