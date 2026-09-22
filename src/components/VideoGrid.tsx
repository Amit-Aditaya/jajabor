"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { videos, type PortfolioVideo } from "@/data/videos";
import { optimizedSrc } from "@/lib/media-src";

function hasSrc(el: HTMLVideoElement, src: string) {
  if (el.getAttribute("src") === src) return true;
  try {
    return el.src === new URL(src, window.location.href).href;
  } catch {
    return false;
  }
}

function setElementAudible(el: HTMLVideoElement, audible: boolean) {
  el.defaultMuted = !audible;
  el.muted = !audible;
  if (audible) {
    el.volume = 1;
    el.removeAttribute("muted");
  } else {
    el.setAttribute("muted", "");
  }
}

export default function VideoGrid({ active = true }: { active?: boolean }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const players = useRef<Record<string, HTMLVideoElement | null>>({});
  const playerRefs = useRef<Record<string, (el: HTMLVideoElement | null) => void>>({});
  const hoverCapable = useRef(false);
  const audibleId = useRef<string | null>(null);
  const soundBlocked = useRef(false);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [playingIds, setPlayingIds] = useState<ReadonlySet<string>>(() => new Set());

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

  const markPlaying = useCallback((id: string, playing: boolean) => {
    setPlayingIds((current) => {
      if (current.has(id) === playing) return current;
      const next = new Set(current);
      if (playing) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const playerRef = (id: string) => {
    if (!playerRefs.current[id]) {
      playerRefs.current[id] = (el) => {
        players.current[id] = el;
        if (el) {
          el.muted = true;
          el.defaultMuted = true;
          el.playsInline = true;
        }
      };
    }
    return playerRefs.current[id];
  };

  const playCard = useCallback(
    (video: PortfolioVideo) => {
      const el = players.current[video.id];
      if (!el) return;

      if (!hasSrc(el, video.src)) el.src = video.src;
      el.loop = true;
      el.playsInline = true;
      const audible = audibleId.current === video.id && !soundBlocked.current;
      setElementAudible(el, audible);

      const start = el.play();
      if (!start) return;
      void start.catch(() => {
        soundBlocked.current = true;
        setElementAudible(el, false);
        if (audibleId.current === video.id) audibleId.current = null;
        void el.play().catch(() => {
          markPlaying(video.id, false);
        });
      });
    },
    [markPlaying],
  );

  const pauseCard = useCallback(
    (video: PortfolioVideo) => {
      const el = players.current[video.id];
      if (!el) return;
      el.pause();
      setElementAudible(el, false);
      if (audibleId.current === video.id) audibleId.current = null;
    },
    [],
  );

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => {
      hoverCapable.current = query.matches;
    };
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const prefersInlineSound = useCallback(() => {
    const hover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    hoverCapable.current = hover;
    return !hover || window.matchMedia("(max-width: 639px)").matches;
  }, []);

  const syncVisiblePlayback = useCallback(() => {
    const root = scrollerRef.current;
    if (!root || !active) return;
    const rootRect = root.getBoundingClientRect();
    if (rootRect.width < 8) return;

    const withSound = prefersInlineSound();
    let primaryId: string | null = null;
    let primaryRatio = 0;

    const cards = videos.map((video) => {
      const el = players.current[video.id];
      if (!el) return { video, el: null, ratio: 0, onScreen: false };
      const rect = el.getBoundingClientRect();
      const visibleWidth =
        Math.min(rect.right, rootRect.right) - Math.max(rect.left, rootRect.left);
      const ratio = rect.width > 0 ? Math.max(0, visibleWidth) / rect.width : 0;
      const visibleHeight =
        Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      const onScreen = visibleHeight >= 64 && ratio >= 0.55;
      if (onScreen && ratio > primaryRatio) {
        primaryRatio = ratio;
        primaryId = video.id;
      }
      return { video, el, ratio, onScreen };
    });

    if (!withSound) {
      for (const { video, el, onScreen } of cards) {
        if (!el) continue;
        const hovered = audibleId.current === video.id;
        if (onScreen && hovered) {
          if (el.paused || !hasSrc(el, video.src)) playCard(video);
        } else if (!el.paused) {
          pauseCard(video);
        }
      }
      return;
    }

    if (!soundBlocked.current) audibleId.current = primaryId;

    for (const { video, el, onScreen } of cards) {
      if (!el) continue;
      if (onScreen) {
        if (!el.paused && hasSrc(el, video.src)) {
          setElementAudible(el, !soundBlocked.current && video.id === primaryId);
        }
        if (el.paused || !hasSrc(el, video.src)) playCard(video);
      } else if (!el.paused) {
        pauseCard(video);
      }
    }
  }, [active, pauseCard, playCard, prefersInlineSound]);

  useEffect(() => {
    if (active) return;
    audibleId.current = null;
    soundBlocked.current = false;
    for (const el of Object.values(players.current)) {
      if (!el) continue;
      el.pause();
      setElementAudible(el, false);
    }
    setPlayingIds(new Set());
  }, [active]);

  useLayoutEffect(() => {
    if (!active) return;

    const unlock = () => {
      if (!prefersInlineSound()) return;
      soundBlocked.current = false;
      syncVisiblePlayback();
    };

    syncVisiblePlayback();
    const frame = requestAnimationFrame(syncVisiblePlayback);
    const root = scrollerRef.current;
    window.addEventListener("portfolio-unlock-sound", unlock);
    if (!root) {
      return () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("portfolio-unlock-sound", unlock);
      };
    }

    root.addEventListener("scroll", syncVisiblePlayback, { passive: true });
    window.addEventListener("resize", syncVisiblePlayback);
    window.addEventListener("scroll", syncVisiblePlayback, { passive: true, capture: true });
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener("scroll", syncVisiblePlayback);
      window.removeEventListener("resize", syncVisiblePlayback);
      window.removeEventListener("scroll", syncVisiblePlayback, { capture: true });
      window.removeEventListener("portfolio-unlock-sound", unlock);
    };
  }, [active, prefersInlineSound, syncVisiblePlayback]);

  const scrollByCard = (direction: 1 | -1) => {
    const root = scrollerRef.current;
    const card = root?.firstElementChild as HTMLElement | null;
    if (!root || !card) return;

    const styles = getComputedStyle(root);
    const gap = parseFloat(styles.columnGap || styles.gap) || 24;
    root.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: "smooth" });
  };

  const playHovered = (video: PortfolioVideo) => {
    if (prefersInlineSound()) return;
    audibleId.current = video.id;
    soundBlocked.current = false;
    for (const item of videos) {
      if (item.id !== video.id) pauseCard(item);
    }
    playCard(video);
  };

  const unlockInlineSound = () => {
    if (!prefersInlineSound()) return;
    soundBlocked.current = false;
    syncVisiblePlayback();
  };

  const stopHovered = (video: PortfolioVideo) => {
    if (prefersInlineSound()) return;
    pauseCard(video);
  };

  return (
    <div className="relative mt-16" onPointerUp={unlockInlineSound}>
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
          const playing = playingIds.has(video.id);
          const fit = video.landscape ? "object-contain bg-charcoal" : "object-cover";
          const poster = optimizedSrc(video.poster);

          return (
            <article
              key={video.id}
              data-video-id={video.id}
              className="group relative aspect-[9/16] w-full shrink-0 snap-start overflow-hidden bg-charcoal sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
              onMouseEnter={() => playHovered(video)}
              onMouseLeave={() => stopHovered(video)}
              onClick={() => {
                if (!prefersInlineSound()) {
                  playHovered(video);
                  return;
                }
                const el = players.current[video.id];
                if (el?.paused) playCard(video);
              }}
            >
              <video
                ref={playerRef(video.id)}
                className={`portfolio-video absolute inset-0 h-full w-full ${fit}`}
                poster={poster}
                loop
                playsInline
                preload={index < 2 ? "auto" : "none"}
                onPlay={() => markPlaying(video.id, true)}
                onPause={() => markPlaying(video.id, false)}
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
