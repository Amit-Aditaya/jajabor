"use client";

import { useLayoutEffect, useRef, useState } from "react";
import PortfolioImage from "@/components/PortfolioImage";
import { scrollToPortfolioTabs } from "@/lib/scroll-portfolio-tabs";
import type { ImageCategory } from "@/data/portfolio-previews";
import {
  ALL_GRID_HEIGHT,
  ALL_GRID_WIDTH,
  ALL_PREVIEW_HEIGHT,
  allPreviewTiles,
  allTiles,
} from "@/data/all-grid";
import {
  ARCHITECTURAL_GRID_HEIGHT,
  ARCHITECTURAL_GRID_WIDTH,
  ARCHITECTURAL_PREVIEW_HEIGHT,
  architecturalPreviewTiles,
  architecturalTiles,
} from "@/data/architectural-grid";
import {
  FASHION_GRID_HEIGHT,
  FASHION_GRID_WIDTH,
  FASHION_PREVIEW_HEIGHT,
  fashionPreviewTiles,
  fashionTiles,
} from "@/data/fashion-grid";
import {
  FOOD_GRID_HEIGHT,
  FOOD_GRID_WIDTH,
  FOOD_PREVIEW_HEIGHT,
  foodPreviewTiles,
  foodTiles,
} from "@/data/food-grid";
import {
  PRODUCT_GRID_HEIGHT,
  PRODUCT_GRID_WIDTH,
  PRODUCT_PREVIEW_HEIGHT,
  productPreviewTiles,
  productTiles,
} from "@/data/product-grid";
import {
  SPORTS_GRID_HEIGHT,
  SPORTS_GRID_WIDTH,
  SPORTS_PREVIEW_HEIGHT,
  sportsPreviewTiles,
  sportsTiles,
} from "@/data/sports-grid";
import {
  STREET_GRID_HEIGHT,
  STREET_GRID_WIDTH,
  STREET_PREVIEW_HEIGHT,
  streetPreviewTiles,
  streetTiles,
} from "@/data/street-grid";
import {
  TRAVEL_GRID_HEIGHT,
  TRAVEL_GRID_WIDTH,
  TRAVEL_PREVIEW_HEIGHT,
  travelPreviewTiles,
  travelTiles,
} from "@/data/travel-grid";

const SHIFT_MS = 500;

type Tile = { src: string; x: number; y: number; w: number; h: number };

type Layout = {
  gridWidth: number;
  gridHeight: number;
  previewHeight: number;
  tiles: Tile[];
  previewTiles: Tile[];
};

const layouts: Record<ImageCategory, Layout> = {
  All: {
    gridWidth: ALL_GRID_WIDTH,
    gridHeight: ALL_GRID_HEIGHT,
    previewHeight: ALL_PREVIEW_HEIGHT,
    tiles: allTiles,
    previewTiles: allPreviewTiles,
  },
  Architectural: {
    gridWidth: ARCHITECTURAL_GRID_WIDTH,
    gridHeight: ARCHITECTURAL_GRID_HEIGHT,
    previewHeight: ARCHITECTURAL_PREVIEW_HEIGHT,
    tiles: architecturalTiles,
    previewTiles: architecturalPreviewTiles,
  },
  Fashion: {
    gridWidth: FASHION_GRID_WIDTH,
    gridHeight: FASHION_GRID_HEIGHT,
    previewHeight: FASHION_PREVIEW_HEIGHT,
    tiles: fashionTiles,
    previewTiles: fashionPreviewTiles,
  },
  Food: {
    gridWidth: FOOD_GRID_WIDTH,
    gridHeight: FOOD_GRID_HEIGHT,
    previewHeight: FOOD_PREVIEW_HEIGHT,
    tiles: foodTiles,
    previewTiles: foodPreviewTiles,
  },
  Product: {
    gridWidth: PRODUCT_GRID_WIDTH,
    gridHeight: PRODUCT_GRID_HEIGHT,
    previewHeight: PRODUCT_PREVIEW_HEIGHT,
    tiles: productTiles,
    previewTiles: productPreviewTiles,
  },
  Sports: {
    gridWidth: SPORTS_GRID_WIDTH,
    gridHeight: SPORTS_GRID_HEIGHT,
    previewHeight: SPORTS_PREVIEW_HEIGHT,
    tiles: sportsTiles,
    previewTiles: sportsPreviewTiles,
  },
  Street: {
    gridWidth: STREET_GRID_WIDTH,
    gridHeight: STREET_GRID_HEIGHT,
    previewHeight: STREET_PREVIEW_HEIGHT,
    tiles: streetTiles,
    previewTiles: streetPreviewTiles,
  },
  "Travel and Nature": {
    gridWidth: TRAVEL_GRID_WIDTH,
    gridHeight: TRAVEL_GRID_HEIGHT,
    previewHeight: TRAVEL_PREVIEW_HEIGHT,
    tiles: travelTiles,
    previewTiles: travelPreviewTiles,
  },
};

type Item = {
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
  span: boolean;
  status: "live" | "exit";
  hidden: boolean;
};

type Frame = {
  category: ImageCategory;
  motion: boolean;
  clip: number;
  items: Item[];
};

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function place(tiles: Tile[], gridWidth: number, containerWidth: number) {
  const scale = containerWidth / gridWidth;
  return tiles.map((tile) => ({
    src: tile.src,
    x: tile.x * scale,
    y: tile.y * scale,
    w: tile.w * scale,
    h: tile.h * scale,
    span: tile.w > gridWidth / 2,
  }));
}

function readVisual(root: HTMLElement) {
  const base = root.getBoundingClientRect();
  const map = new Map<string, Pick<Item, "x" | "y" | "w" | "h">>();
  root.querySelectorAll<HTMLElement>("[data-status='live']").forEach((el) => {
    const src = el.dataset.tile;
    if (!src || el.offsetWidth < 1) return;
    const rect = el.getBoundingClientRect();
    const scale = rect.width / el.offsetWidth;
    if (scale < 0.92 || scale > 1.08) return;
    if (Number.parseFloat(getComputedStyle(el).opacity) < 0.85) return;
    map.set(src, {
      x: rect.left - base.left,
      y: rect.top - base.top,
      w: el.offsetWidth,
      h: el.offsetHeight,
    });
  });
  return map;
}

export default function CategoryMosaic({ category }: { category: ImageCategory }) {
  const layout = layouts[category];
  const [expandedByCategory, setExpandedByCategory] = useState<
    Partial<Record<ImageCategory, boolean>>
  >({});
  const expanded = expandedByCategory[category] ?? false;
  const tiles = expanded ? layout.tiles : layout.previewTiles;
  const visibleHeight = expanded ? layout.gridHeight : layout.previewHeight;
  const [frame, setFrame] = useState<Frame | null>(null);
  const settledRef = useRef<Frame | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const widthRef = useRef(0);
  const generationRef = useRef(0);
  const shiftingRef = useRef(false);

  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const width = box.clientWidth;
    if (width < 2) return;
    widthRef.current = width;

    const generation = ++generationRef.current;
    const reduced = prefersReducedMotion();
    const targets = place(tiles, layout.gridWidth, width);
    const clip = (visibleHeight / layout.gridWidth) * width;
    const settled = settledRef.current;
    const visual = settled ? readVisual(box) : null;

    const at = (src: string, fallback: Pick<Item, "x" | "y" | "w" | "h">) =>
      visual?.get(src) ?? fallback;

    const commit = (next: Frame, remember: boolean) => {
      if (remember) settledRef.current = next;
      setFrame(next);
    };

    if (!settled || settled.category === category || reduced) {
      shiftingRef.current = false;
      commit(
        {
          category,
          motion: false,
          clip,
          items: targets.map((tile) => ({ ...tile, status: "live", hidden: false })),
        },
        true,
      );
      return;
    }

    const prevLive = new Map(
      settled.items.filter((item) => item.status === "live").map((item) => [item.src, item]),
    );
    const targetSrcs = new Set(targets.map((tile) => tile.src));
    const exiting = settled.items
      .filter((item) => item.status === "live" && !targetSrcs.has(item.src))
      .map((item) => ({
        ...item,
        ...at(item.src, item),
        status: "exit" as const,
        hidden: false,
      }));

    const startItems: Item[] = [
      ...targets.map((tile) => {
        const old = prevLive.get(tile.src);
        if (!old) return { ...tile, status: "live" as const, hidden: true };
        return {
          ...tile,
          ...at(tile.src, old),
          span: tile.span,
          status: "live" as const,
          hidden: false,
        };
      }),
      ...exiting,
    ];
    const endItems: Item[] = [
      ...targets.map((tile) => ({ ...tile, status: "live" as const, hidden: false })),
      ...exiting.map((item) => ({ ...item, hidden: true })),
    ];

    shiftingRef.current = true;
    const startFrame: Frame = { category, motion: false, clip: settled.clip, items: startItems };
    commit(startFrame, false);

    let second = 0;
    let third = 0;
    const first = window.requestAnimationFrame(() => {
      second = window.requestAnimationFrame(() => {
        if (generationRef.current !== generation) return;
        setFrame({ ...startFrame, motion: true });
        third = window.requestAnimationFrame(() => {
          if (generationRef.current !== generation) return;
          setFrame({ category, motion: true, clip, items: endItems });
        });
      });
    });
    const timer = window.setTimeout(() => {
      if (generationRef.current !== generation) return;
      shiftingRef.current = false;
      const done: Frame = {
        category,
        motion: false,
        clip,
        items: endItems.filter((item) => item.status === "live"),
      };
      settledRef.current = done;
      setFrame(done);
    }, SHIFT_MS + 60);

    return () => {
      window.cancelAnimationFrame(first);
      window.cancelAnimationFrame(second);
      window.cancelAnimationFrame(third);
      window.clearTimeout(timer);
    };
  }, [category, expanded, layout.gridWidth, tiles, visibleHeight]);

  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      if (shiftingRef.current) return;
      const width = box.clientWidth;
      if (width < 2 || Math.abs(width - widthRef.current) < 1) return;
      widthRef.current = width;
      const current = layouts[category];
      const open = expandedByCategory[category] ?? false;
      const nextTiles = open ? current.tiles : current.previewTiles;
      const nextVisible = open ? current.gridHeight : current.previewHeight;
      const next: Frame = {
        category,
        motion: false,
        clip: (nextVisible / current.gridWidth) * width,
        items: place(nextTiles, current.gridWidth, width).map((tile) => ({
          ...tile,
          status: "live",
          hidden: false,
        })),
      };
      settledRef.current = next;
      setFrame(next);
    });
    observer.observe(box);
    return () => observer.disconnect();
  }, [category, expandedByCategory]);

  const toggle = () => {
    const next = !expanded;
    setExpandedByCategory((current) => ({ ...current, [category]: next }));
    if (!next) scrollToPortfolioTabs();
  };

  const clipStyle = frame
    ? {
        height: frame.clip,
        transition: frame.motion ? `height ${SHIFT_MS}ms ease` : "none",
      }
    : { aspectRatio: `${layout.gridWidth} / ${visibleHeight}` };

  const previewSrcs = new Set(layout.previewTiles.map((tile) => tile.src));

  return (
    <div className="mt-16">
      <div ref={boxRef} className="relative overflow-hidden" style={clipStyle}>
        {frame ? (
          frame.items.map((tile) => {
            const hidden = tile.hidden;
            return (
              <figure
                key={tile.src}
                data-tile={tile.src}
                data-status={tile.status}
                aria-hidden={hidden || undefined}
                className="absolute overflow-hidden"
                style={{
                  left: 0,
                  top: 0,
                  width: tile.w,
                  height: tile.h,
                  transformOrigin: "center center",
                  transform: `translate3d(${tile.x}px, ${tile.y}px, 0) scale(${hidden ? 0.001 : 1})`,
                  opacity: hidden ? 0 : 1,
                  zIndex: tile.status === "exit" ? 1 : 2,
                  pointerEvents: hidden || tile.status === "exit" ? "none" : undefined,
                  transition: frame.motion
                    ? `transform ${SHIFT_MS}ms ease, width ${SHIFT_MS}ms ease, height ${SHIFT_MS}ms ease, opacity ${SHIFT_MS}ms ease`
                    : "none",
                }}
              >
                <PortfolioImage
                  src={tile.src}
                  sizes={
                    tile.span
                      ? "(max-width: 1024px) 100vw, 66vw"
                      : "(max-width: 1024px) 50vw, 33vw"
                  }
                  loading={previewSrcs.has(tile.src) ? "eager" : "lazy"}
                />
              </figure>
            );
          })
        ) : (
          <div
            className="relative w-full"
            style={{ aspectRatio: `${layout.gridWidth} / ${layout.gridHeight}` }}
          >
            {tiles.map((tile) => {
              const span = tile.w > layout.gridWidth / 2;
              return (
                <figure
                  key={tile.src}
                  className="absolute overflow-hidden"
                  style={{
                    left: `${(tile.x / layout.gridWidth) * 100}%`,
                    top: `${(tile.y / layout.gridHeight) * 100}%`,
                    width: `${(tile.w / layout.gridWidth) * 100}%`,
                    height: `${(tile.h / layout.gridHeight) * 100}%`,
                  }}
                >
                  <PortfolioImage
                    src={tile.src}
                    sizes={
                      span ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 1024px) 50vw, 33vw"
                    }
                    loading="eager"
                  />
                </figure>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-10 flex justify-center">
        <button
          type="button"
          aria-expanded={expanded}
          onClick={toggle}
          className="bg-[#eae6df] px-8 py-3 text-lg text-ink transition-colors hover:bg-[#e0dbd2]"
        >
          {expanded ? "See less" : "See all"}
        </button>
      </div>
    </div>
  );
}
