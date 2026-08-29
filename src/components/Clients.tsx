"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";

const clients = [
  { src: "/images/client_logos/1. Studio 7.png", alt: "Studio 7" },
  { src: "/images/client_logos/2. Pull it Off.png", alt: "Pull it Off" },
  { src: "/images/client_logos/3. Izaan.png", alt: "Izaan" },
  { src: "/images/client_logos/4. Final Third Soccer.png", alt: "Final Third Soccer" },
  {
    src: "/images/client_logos/5. Next Level Sports Management.png",
    alt: "Next Level Sports Management",
  },
  { src: "/images/client_logos/6. Bangladesh Drip.png", alt: "Bangladesh Drip" },
  { src: "/images/client_logos/7. Central Fitness.png", alt: "Central Fitness" },
  { src: "/images/client_logos/8. IHSB.png", alt: "IHSB" },
  { src: "/images/client_logos/9. Moire Studio.png", alt: "Moire Studio" },
  { src: "/images/client_logos/10. Kinky Cafe.png", alt: "Kinky Cafe" },
  { src: "/images/client_logos/11. DOUR.png", alt: "DOUR" },
  { src: "/images/client_logos/12. BANAi.png", alt: "BANAi" },
  { src: "/images/client_logos/13. Ethereal.png", alt: "Ethereal" },
  { src: "/images/client_logos/14. The Sugarist.png", alt: "The Sugarist" },
  { src: "/images/client_logos/15. Outliers.png", alt: "Outliers" },
  { src: "/images/client_logos/16. Jithbo.png", alt: "Jithbo" },
];

const LOOP_COPIES = 3;
const slides = Array.from({ length: LOOP_COPIES }, () => clients).flat();

export default function Clients() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const count = clients.length;
    let index = count;
    let dragging = false;
    let startX = 0;
    let startOffset = 0;
    let dragDelta = 0;
    let autoplayId = 0;
    let paused = false;
    let pointerId: number | null = null;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const cardWidth = () => {
      const card = track.firstElementChild as HTMLElement | null;
      return card ? card.getBoundingClientRect().width : 0;
    };

    const step = () => {
      const gap = parseFloat(getComputedStyle(track).columnGap || "0") || 0;
      return cardWidth() + gap;
    };

    const setTransform = (offset: number, animate: boolean) => {
      track.style.transition = animate
        ? "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)"
        : "none";
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
    };

    const offsetFor = (i: number) => i * step() + cardWidth() * 0.28;

    const wrapIndex = () => {
      if (index >= count * 2) index -= count;
      else if (index < count) index += count;
      else return false;
      setTransform(offsetFor(index), false);
      return true;
    };

    const goTo = (next: number, animate = true) => {
      index = next;
      setTransform(offsetFor(index), animate && !reducedMotion);
      if (!animate || reducedMotion) wrapIndex();
    };

    const schedule = () => {
      window.clearInterval(autoplayId);
      if (reducedMotion || paused) return;
      autoplayId = window.setInterval(() => goTo(index + 1), 3200);
    };

    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.target !== track || event.propertyName !== "transform") return;
      wrapIndex();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      dragging = true;
      paused = true;
      window.clearInterval(autoplayId);
      pointerId = event.pointerId;
      startX = event.clientX;
      startOffset = offsetFor(index);
      dragDelta = 0;
      viewport.setPointerCapture(event.pointerId);
      viewport.classList.add("cursor-grabbing");
      setTransform(startOffset, false);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      dragDelta = event.clientX - startX;
      setTransform(startOffset - dragDelta, false);
    };

    const onPointerUp = () => {
      if (!dragging) return;
      dragging = false;
      paused = false;
      viewport.classList.remove("cursor-grabbing");
      if (pointerId !== null && viewport.hasPointerCapture(pointerId)) {
        viewport.releasePointerCapture(pointerId);
      }
      pointerId = null;

      const cardStep = step();
      const threshold = Math.max(40, cardStep * 0.18);
      let delta = 0;
      if (dragDelta <= -threshold) delta = 1;
      else if (dragDelta >= threshold) delta = -1;

      goTo(index + delta);
      schedule();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(index + 1);
        schedule();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(index - 1);
        schedule();
      }
    };

    const onEnter = () => {
      paused = true;
      window.clearInterval(autoplayId);
    };

    const onLeave = () => {
      if (dragging) return;
      paused = false;
      schedule();
    };

    const onResize = () => goTo(index, false);

    goTo(index, false);
    schedule();

    track.addEventListener("transitionend", onTransitionEnd);
    viewport.addEventListener("pointerdown", onPointerDown);
    viewport.addEventListener("pointermove", onPointerMove);
    viewport.addEventListener("pointerup", onPointerUp);
    viewport.addEventListener("pointercancel", onPointerUp);
    viewport.addEventListener("keydown", onKeyDown);
    viewport.addEventListener("mouseenter", onEnter);
    viewport.addEventListener("mouseleave", onLeave);
    viewport.addEventListener("focus", onEnter);
    viewport.addEventListener("blur", onLeave);
    window.addEventListener("resize", onResize);

    return () => {
      window.clearInterval(autoplayId);
      track.removeEventListener("transitionend", onTransitionEnd);
      viewport.removeEventListener("pointerdown", onPointerDown);
      viewport.removeEventListener("pointermove", onPointerMove);
      viewport.removeEventListener("pointerup", onPointerUp);
      viewport.removeEventListener("pointercancel", onPointerUp);
      viewport.removeEventListener("keydown", onKeyDown);
      viewport.removeEventListener("mouseenter", onEnter);
      viewport.removeEventListener("mouseleave", onLeave);
      viewport.removeEventListener("focus", onEnter);
      viewport.removeEventListener("blur", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section id="clients" className="bg-white py-24">
      <div className="mx-auto max-w-[1480px] px-6 sm:px-10">
        <p className="text-center text-xs uppercase tracking-[0.45em] text-neutral-800">
          Our clients and partners
        </p>
        <h2 className="mt-6 text-center text-5xl font-normal tracking-wide text-neutral-900 sm:text-6xl">
          HAPPY CLIENTS
        </h2>
      </div>

      <div
        ref={viewportRef}
        className="clients-carousel mt-16 cursor-grab overflow-hidden select-none outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-inset"
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Client logos"
      >
        <div ref={trackRef} className="clients-carousel-track flex items-start will-change-transform">
          {slides.map((client, index) => (
            <div
              key={`${client.src}-${index}`}
              className="clients-carousel-card flex aspect-square shrink-0 items-center justify-center bg-[#f5f5f5]"
            >
              <Image
                src={client.src}
                alt={client.alt}
                width={180}
                height={180}
                draggable={false}
                className="pointer-events-none max-h-[58%] max-w-[70%] object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
