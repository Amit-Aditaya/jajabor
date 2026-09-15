"use client";

import Image from "next/image";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { videos, type PortfolioVideo } from "@/data/videos";

function isHoverDevice() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export default function VideoGrid() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const players = useRef<Record<string, HTMLVideoElement | null>>({});
  const stopTimers = useRef<Record<string, number>>({});
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [fullscreenId, setFullscreenId] = useState<string | null>(null);

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

    const onFullscreen = () => {
      const fs =
        document.fullscreenElement ??
        (document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement ??
        null;
      const id =
        videos.find((video) => players.current[video.id] === fs)?.id ?? null;
      setFullscreenId(id);
    };
    document.addEventListener("fullscreenchange", onFullscreen);
    document.addEventListener("webkitfullscreenchange", onFullscreen);

    return () => {
      root.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      document.removeEventListener("fullscreenchange", onFullscreen);
      document.removeEventListener("webkitfullscreenchange", onFullscreen);
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

  const pauseOthers = (id: string) => {
    for (const [otherId, other] of Object.entries(players.current)) {
      if (otherId !== id) other?.pause();
    }
  };

  const start = (video: PortfolioVideo) => {
    const el = players.current[video.id];
    if (!el) return;

    const pending = stopTimers.current[video.id];
    if (pending) {
      window.clearTimeout(pending);
      delete stopTimers.current[video.id];
    }

    pauseOthers(video.id);
    if (el.getAttribute("src") !== video.src) {
      el.src = video.src;
    }
    el.muted = true;
    el.loop = true;
    void el.play();
    setActiveId(video.id);
  };

  const isFullscreen = (el: HTMLVideoElement) =>
    document.fullscreenElement === el ||
    (document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement === el;

  const stop = (video: PortfolioVideo) => {
    const existing = stopTimers.current[video.id];
    if (existing) window.clearTimeout(existing);

    stopTimers.current[video.id] = window.setTimeout(() => {
      const el = players.current[video.id];
      delete stopTimers.current[video.id];
      if (!el || isFullscreen(el)) return;
      el.pause();
      setActiveId((current) => (current === video.id ? null : current));
    }, 250);
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
        {videos.map((video) => {
          const active = activeId === video.id || fullscreenId === video.id;
          const fit = video.landscape ? "object-contain bg-black" : "object-cover";

          return (
            <article
              key={video.id}
              className="group relative aspect-[9/16] w-full shrink-0 snap-start overflow-hidden bg-neutral-900 sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
              onMouseEnter={() => {
                if (isHoverDevice()) start(video);
              }}
              onMouseLeave={() => {
                if (isHoverDevice()) stop(video);
              }}
            >
              <video
                ref={(el) => {
                  players.current[video.id] = el;
                }}
                className={`portfolio-video absolute inset-0 h-full w-full ${fit}`}
                poster={video.poster}
                muted
                loop
                playsInline
                preload="none"
                controls={active}
                onEnded={() => {
                  if (fullscreenId !== video.id) setActiveId(null);
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if (isHoverDevice()) return;
                  if (active) stop(video);
                  else start(video);
                }}
                aria-label={`Play ${video.title}`}
                className={`absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-black/25 transition-opacity duration-300 ${
                  active ? "pointer-events-none opacity-0" : "cursor-pointer"
                }`}
              >
                <Image
                  src={video.poster}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className={`${fit} -z-10 opacity-80 transition-transform duration-500 group-hover:scale-105`}
                />
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
              </button>
            </article>
          );
        })}
      </div>

      {canPrev && (
        <button
          type="button"
          aria-label="Previous videos"
          onClick={() => scrollByCard(-1)}
          className="absolute top-1/2 left-3 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg transition-colors hover:bg-neutral-700 sm:left-4"
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
          className="absolute top-1/2 right-3 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg transition-colors hover:bg-neutral-700 sm:right-4"
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
