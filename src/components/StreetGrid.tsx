"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  STREET_GRID_HEIGHT,
  STREET_GRID_WIDTH,
  STREET_PREVIEW_HEIGHT,
  streetPreviewTiles,
  streetTiles,
} from "@/data/street-grid";

export default function StreetGrid() {
  const [expanded, setExpanded] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const tiles = expanded ? streetTiles : streetPreviewTiles;
  const visibleHeight = expanded ? STREET_GRID_HEIGHT : STREET_PREVIEW_HEIGHT;

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
        style={{ aspectRatio: `${STREET_GRID_WIDTH} / ${visibleHeight}` }}
      >
        <div
          className="relative w-full"
          style={{ aspectRatio: `${STREET_GRID_WIDTH} / ${STREET_GRID_HEIGHT}` }}
        >
          {tiles.map((tile) => {
            const span = tile.w > STREET_GRID_WIDTH / 2;
            return (
              <figure
                key={tile.src}
                className="absolute overflow-hidden"
                style={{
                  left: `${(tile.x / STREET_GRID_WIDTH) * 100}%`,
                  top: `${(tile.y / STREET_GRID_HEIGHT) * 100}%`,
                  width: `${(tile.w / STREET_GRID_WIDTH) * 100}%`,
                  height: `${(tile.h / STREET_GRID_HEIGHT) * 100}%`,
                }}
              >
                <Image
                  src={tile.src}
                  alt=""
                  fill
                  sizes={span ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 1024px) 50vw, 33vw"}
                  className="object-cover"
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
