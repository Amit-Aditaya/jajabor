"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { videos, type PortfolioVideo } from "@/data/videos";
import { optimizedSrc } from "@/lib/media-src";

export default function VideoGrid({ active = true }: { active?: boolean }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const players = useRef<Record<string, HTMLVideoElement | null>>({});
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const updateScrollState = useCallback(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const { scrollLeft, scrollWidth, clientWidth } = root;
    setCanPrev(scrollLeft > 8);
    setCanNext(scrollLeft + clientWidth < scrollWidth - 8);
  }, []);

  useLayoutEffect(() => {
    const root = scrollerRef.current;
    if (!root || !active) return;

    updateScrollState();
    root.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      root.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [active, updateScrollState]);

  useEffect(() => {
    if (active) return;
    for (const el of Object.values(players.current)) {
      el?.pause();
      if (el) el.muted = true;
    }
    setPlayingId(null);
  }, [active]);

  const scrollByCard = (direction: 1 | -1) => {
    const root = scrollerRef.current;
    const card = root?.firstElementChild as HTMLElement | null;
    if (!root || !card) return;

    const styles = getComputedStyle(root);
    const gap = parseFloat(styles.columnGap || styles.gap) || 24;
    root.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: "smooth" });
  };

  const ensureSrc = (el: HTMLVideoElement, video: PortfolioVideo) => {
    if (el.getAttribute("src") !== video.src) {
      el.src = video.src;
    }
  };

  const playCard = (video: PortfolioVideo) => {
    const el = players.current[video.id];
    if (!el) return;

    for (const [id, other] of Object.entries(players.current)) {
      if (id !== video.id) {
        other?.pause();
        if (other) other.muted = true;
      }
    }

    ensureSrc(el, video);
    el.loop = true;
    el.muted = false;
    const play = el.play();
    if (play) {
      void play.catch(() => {
        el.muted = true;
        void el.play();
      });
    }
    setPlayingId(video.id);
  };

  const pauseCard = (video: PortfolioVideo) => {
    const el = players.current[video.id];
    if (el) {
      el.pause();
      el.muted = true;
    }
    setPlayingId((current) => (current === video.id ? null : current));
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
        {videos.map((video, index) => {
          const playing = playingId === video.id;
          const fit = video.landscape ? "object-contain bg-charcoal" : "object-cover";
          const poster = optimizedSrc(video.poster);

          return (
            <article
              key={video.id}
              className="group relative aspect-[9/16] w-full shrink-0 snap-start overflow-hidden bg-charcoal sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
              onMouseEnter={() => playCard(video)}
              onMouseLeave={() => pauseCard(video)}
              onClick={() => playCard(video)}
            >
              <video
                ref={(el) => {
                  players.current[video.id] = el;
                }}
                className={`absolute inset-0 h-full w-full ${fit}`}
                poster={poster}
                muted
                loop
                playsInline
                preload={index < 3 ? "metadata" : "none"}
                controlsList="nofullscreen nodownload noremoteplayback"
                disablePictureInPicture
              />

              <div
                className={`pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-charcoal/25 transition-opacity duration-300 ${
                  playing ? "opacity-0" : "opacity-100"
                }`}
              >
                <Image
                  src={poster}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading={index < 3 ? "eager" : "lazy"}
                  decoding="async"
                  className={`${fit} -z-10 opacity-80`}
                />
                <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-cream/90 bg-charcoal/30 backdrop-blur-sm">
                  <svg viewBox="0 0 24 24" aria-hidden className="ml-1 h-7 w-7 fill-cream">
                    <path d="M8 5.14v13.72L19.5 12 8 5.14Z" />
                  </svg>
                </span>
                <span className="font-sans text-sm tracking-[0.16em] text-cream">
                  {video.title}
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {canPrev && (
        <button
          type="button"
          aria-label="Previous videos"
          onClick={() => scrollByCard(-1)}
          className="absolute top-1/2 left-3 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-charcoal text-cream shadow-lg transition-colors hover:bg-charcoal-soft sm:left-4"
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
          className="absolute top-1/2 right-3 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-charcoal text-cream shadow-lg transition-colors hover:bg-charcoal-soft sm:right-4"
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
