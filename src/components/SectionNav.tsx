"use client";

import { useEffect, useRef, useState } from "react";

const SECTIONS = [
  { id: "home", n: "01", label: "Home" },
  { id: "about", n: "02", label: "About" },
  { id: "services", n: "03", label: "Services" },
  { id: "portfolio", n: "04", label: "Portfolio" },
  { id: "clients", n: "05", label: "Clients" },
  { id: "testimonials", n: "06", label: "Testimonials" },
  { id: "contact", n: "07", label: "Contact" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

const DURATION = 500;
const DESKTOP_QUERY = "(min-width: 1024px)";
const SWITCH_EASE = "cubic-bezier(0.5, 0.12, 0.46, 0.88)";

function easeInOutCirc(t: number) {
  return (t *= 2) < 1
    ? -0.5 * (Math.sqrt(1 - t * t) - 1)
    : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
}

function sectionTop(id: string) {
  const el = document.getElementById(id);
  if (!el) return null;
  return Math.round(el.getBoundingClientRect().top + window.scrollY);
}

function sectionScrollTarget(id: string, deltaY: number) {
  const top = sectionTop(id);
  if (top == null) return null;
  // Entering the tall portfolio from below should stop on its last screen,
  // not jump to the heading and on into Services.
  if (id !== "portfolio" || deltaY >= 0) return top;
  const el = document.getElementById(id);
  if (!el) return top;
  const bottom = Math.round(el.getBoundingClientRect().bottom + window.scrollY);
  return Math.max(top, bottom - window.innerHeight);
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

export default function SectionNav() {
  const [active, setActive] = useState<SectionId>("home");
  const goToRef = useRef<(id: SectionId) => void>(() => {});

  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;

    let animating = false;
    let busyUntil = 0;
    let frame = 0;
    let spyFrame = 0;
    let current: SectionId = "home";
    let needsWheelRelease = false;

    const known = new Set<string>(SECTIONS.map((section) => section.id));

    const commit = (id: SectionId) => {
      if (current === id) return;
      current = id;
      setActive(id);
      const hash = `#${id}`;
      if (window.location.hash !== hash) {
        window.history.replaceState(null, "", hash);
      }
    };

    const spy = () => {
      const y = window.scrollY;
      // Stay with the section at the top of the screen. A deeper line skips
      // clients, which is shorter than the viewport, and highlights testimonials.
      const line = y + Math.min(80, window.innerHeight * 0.12);
      let id: SectionId = SECTIONS[0].id;
      for (const section of SECTIONS) {
        const top = sectionTop(section.id);
        if (top != null && top <= line) id = section.id;
      }
      if (!animating) commit(id);
    };

    const finishScroll = (previousBehavior: string) => {
      root.style.scrollBehavior = previousBehavior;
      animating = false;
      busyUntil = 0;
      spy();
      // Snapping into Portfolio calls preventDefault, so Chrome keeps the wheel
      // target until the pointer moves. Release it for both directions.
      const portfolioTop = sectionTop("portfolio");
      const clientsTop = sectionTop("clients");
      const y = window.scrollY + 10;
      needsWheelRelease =
        portfolioTop != null &&
        portfolioTop <= y &&
        (clientsTop == null || clientsTop > y);
      releaseWheelTarget();
    };

    const scrollToId = (id: SectionId, deltaY = 1) => {
      if (!desktop.matches || animating || performance.now() < busyUntil) return;
      const top = sectionScrollTarget(id, deltaY);
      if (top == null) return;
      commit(id);

      if (reduced.matches || Math.abs(top - window.scrollY) < 2) {
        const previousBehavior = root.style.scrollBehavior;
        root.style.scrollBehavior = "auto";
        window.scrollTo(0, top);
        root.style.scrollBehavior = previousBehavior;
        return;
      }

      animating = true;
      busyUntil = Number.POSITIVE_INFINITY;
      const start = window.scrollY;
      const change = top - start;
      const started = performance.now();
      const previousBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";

      const step = (now: number) => {
        const t = Math.min(1, (now - started) / DURATION);
        window.scrollTo(0, start + change * easeInOutCirc(t));
        if (t < 1) {
          frame = requestAnimationFrame(step);
          return;
        }
        finishScroll(previousBehavior);
      };

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(step);
    };

    goToRef.current = scrollToId;

    const destinationFor = (id: string, deltaY: number) => {
      const index = SECTIONS.findIndex((section) => section.id === id);
      if (index < 0) return null;
      const top = sectionTop(id);
      if (top == null) return null;
      const y = window.scrollY;

      if (deltaY > 0) {
        let next = index + 1;
        if (top > y + 48) next = index;
        return next < SECTIONS.length ? SECTIONS[next].id : null;
      }

      let prev = index - 1;
      if (top < y - 48) prev = index;
      return prev >= 0 ? SECTIONS[prev].id : null;
    };

    const sectionInView = () => {
      const y = window.scrollY + 10;
      let id: SectionId = SECTIONS[0].id;
      for (const section of SECTIONS) {
        const top = sectionTop(section.id);
        if (top != null && top <= y) id = section.id;
      }
      return id;
    };

    const wheelSamples: number[] = [];
    let lastWheelAt = 0;
    let lastWheelSign = 0;
    let handledGesture = false;
    let sawCoast = false;
    let queued = false;
    let wheelTarget: EventTarget | null = null;

    const trailingAverage = (values: number[], count: number) => {
      const slice = values.slice(-count);
      if (!slice.length) return 0;
      let sum = 0;
      for (const value of slice) sum += value;
      return sum / slice.length;
    };

    // Chrome on a trackpad keeps the wheel target from the first gesture until the
    // pointer moves. Dropping pointer-events for a frame forces a fresh hit test.
    const releaseWheelTarget = () => {
      if (!(wheelTarget instanceof HTMLElement)) return;
      const element = wheelTarget;
      const previous = element.style.pointerEvents;
      element.style.pointerEvents = "none";
      requestAnimationFrame(() => {
        element.style.pointerEvents = previous;
      });
    };

    const onWheel = (event: WheelEvent) => {
      if (!desktop.matches || reduced.matches || event.ctrlKey) return;
      if (event.deltaY === 0 || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

      const now = performance.now();

      // Portfolio is taller than the screen. Scroll that section normally, and
      // keep section snapping everywhere else. Swallow the gesture that snapped
      // into it so the coast cannot keep traveling up into Services.
      if (sectionInView() === "portfolio") {
        const sign = Math.sign(event.deltaY);
        const gap = now - lastWheelAt;
        const newGesture =
          !animating &&
          (gap > 180 || (lastWheelSign !== 0 && sign !== lastWheelSign));
        if (newGesture || needsWheelRelease) {
          handledGesture = false;
          needsWheelRelease = false;
          // The snap called preventDefault, so Chrome keeps sending wheel
          // events to the old target until the pointer moves. Force a new hit
          // test so scrolling continues without nudging the mouse.
          wheelTarget = event.target;
          releaseWheelTarget();
        }
        lastWheelAt = now;
        lastWheelSign = sign;
        if (animating || handledGesture) event.preventDefault();
        return;
      }

      const sign = Math.sign(event.deltaY);
      const gap = now - lastWheelAt;
      lastWheelAt = now;
      wheelTarget = event.target;

      if (gap > 180 || (lastWheelSign !== 0 && sign !== lastWheelSign)) {
        wheelSamples.length = 0;
        handledGesture = false;
        sawCoast = false;
        queued = false;
      }
      lastWheelSign = sign;

      wheelSamples.push(Math.abs(event.deltaY));
      if (wheelSamples.length > 150) wheelSamples.shift();

      const recent = trailingAverage(wheelSamples, 4);
      const earlier = trailingAverage(wheelSamples.slice(0, -4), 8);
      const kicked = wheelSamples.length >= 8 && recent > earlier * 1.35 && recent >= 2;
      if (!kicked && earlier > recent * 1.15) sawCoast = true;
      if (sawCoast && kicked) {
        sawCoast = false;
        queued = true;
        handledGesture = false;
      }

      const accelerating =
        trailingAverage(wheelSamples, 10) >=
        wheelSamples.reduce((sum, value) => sum + value, 0) / 70;

      const dest = destinationFor(sectionInView(), event.deltaY);
      const shouldMove =
        !animating &&
        !!dest &&
        (queued || (!handledGesture && (kicked || accelerating)));

      if (!shouldMove) {
        if (animating || handledGesture) event.preventDefault();
        return;
      }

      event.preventDefault();
      handledGesture = true;
      sawCoast = false;
      queued = false;
      scrollToId(dest, event.deltaY);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!desktop.matches || animating) return;
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      if (isTypingTarget(event.target)) return;

      const index = SECTIONS.findIndex((section) => section.id === current);
      const next = event.key === "ArrowDown" ? index + 1 : index - 1;
      if (next < 0 || next >= SECTIONS.length) return;
      event.preventDefault();
      scrollToId(SECTIONS[next].id, event.key === "ArrowDown" ? 1 : -1);
    };

    const onClick = (event: MouseEvent) => {
      if (!desktop.matches) return;
      const link = (event.target as Element | null)?.closest?.("a[href^='#']");
      if (!link) return;
      const id = link.getAttribute("href")?.slice(1);
      if (!id || !known.has(id)) return;
      event.preventDefault();
      scrollToId(id as SectionId);
    };

    const onScroll = () => {
      cancelAnimationFrame(spyFrame);
      spyFrame = requestAnimationFrame(spy);
    };

    const previousBehavior = root.style.scrollBehavior;
    if (desktop.matches && !reduced.matches) {
      root.style.scrollBehavior = "auto";
    }

    document.addEventListener("wheel", onWheel, { passive: false, capture: true });
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onClick);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("load", spy);
    spy();

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(spyFrame);
      root.style.scrollBehavior = previousBehavior;
      document.removeEventListener("wheel", onWheel, { capture: true });
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("load", spy);
    };
  }, []);

  return (
    <nav
      aria-label="Section"
      className="pointer-events-none fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 mix-blend-difference text-white lg:block"
    >
      <ol className="flex flex-col items-center">
        {SECTIONS.map((section) => {
          const isActive = active === section.id;
          return (
            <li key={section.id} className="relative my-2.5">
              <button
                type="button"
                aria-label={`${section.label}, section ${section.n}`}
                aria-current={isActive ? "true" : undefined}
                onClick={() => goToRef.current(section.id)}
                className="pointer-events-auto flex h-5 w-5 cursor-pointer items-center justify-center"
              >
                <span className="block h-0.5 w-3 bg-current" />
              </button>
              <span
                aria-hidden
                style={{ transitionTimingFunction: SWITCH_EASE }}
                className={`pointer-events-none absolute top-1/2 right-[calc(100%+10px)] -translate-y-1/2 font-sans text-[16px] leading-none font-bold transition-opacity duration-300 ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              >
                {section.n}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
