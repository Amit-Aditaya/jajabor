"use client";

import { useState } from "react";
import PortfolioImage from "@/components/PortfolioImage";
import { scrollToPortfolioTabs } from "@/lib/scroll-portfolio-tabs";
import {
  PRODUCT_GRID_HEIGHT,
  PRODUCT_GRID_WIDTH,
  PRODUCT_PREVIEW_HEIGHT,
  productPreviewTiles,
  productTiles,
} from "@/data/product-grid";

export default function ProductGrid() {
  const [expanded, setExpanded] = useState(false);
  const tiles = expanded ? productTiles : productPreviewTiles;
  const visibleHeight = expanded ? PRODUCT_GRID_HEIGHT : PRODUCT_PREVIEW_HEIGHT;

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    if (!next) scrollToPortfolioTabs();
  };

  return (
    <div className="mt-16">
      <div
        className="overflow-hidden"
        style={{ aspectRatio: `${PRODUCT_GRID_WIDTH} / ${visibleHeight}` }}
      >
        <div
          className="relative w-full"
          style={{ aspectRatio: `${PRODUCT_GRID_WIDTH} / ${PRODUCT_GRID_HEIGHT}` }}
        >
          {tiles.map((tile) => {
            const span = tile.w > PRODUCT_GRID_WIDTH / 2;
            return (
              <figure
                key={tile.src}
                className="absolute overflow-hidden"
                style={{
                  left: `${(tile.x / PRODUCT_GRID_WIDTH) * 100}%`,
                  top: `${(tile.y / PRODUCT_GRID_HEIGHT) * 100}%`,
                  width: `${(tile.w / PRODUCT_GRID_WIDTH) * 100}%`,
                  height: `${(tile.h / PRODUCT_GRID_HEIGHT) * 100}%`,
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
