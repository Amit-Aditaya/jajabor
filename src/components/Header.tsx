"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Clients", href: "#clients" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navProgress, setNavProgress] = useState(0);

  useEffect(() => {
    const FADE_DISTANCE = 140;
    let frame = 0;

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = Math.min(1, Math.max(0, window.scrollY / FADE_DISTANCE));
        setNavProgress(next);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Ease-out cubic — settles into black with a cinematic curve
  const eased = 1 - (1 - navProgress) ** 3;
  // Switch to light marks once the backdrop is dark enough
  const onDark = eased > 0.45;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Scroll-linked backdrop: frosted glass → solid black */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: eased,
          background: `linear-gradient(
            to bottom,
            rgba(0, 0, 0, ${0.72 + eased * 0.28}) 0%,
            rgba(0, 0, 0, ${0.55 + eased * 0.45}) 100%
          )`,
          backdropFilter: `blur(${eased * 16}px) saturate(${100 + eased * 40}%)`,
          WebkitBackdropFilter: `blur(${eased * 16}px) saturate(${100 + eased * 40}%)`,
          boxShadow:
            eased > 0.02
              ? `inset 0 -1px 0 rgba(255,255,255,${0.08 * eased}), 0 18px 48px rgba(0,0,0,${0.45 * eased})`
              : "none",
          maskImage: `linear-gradient(to bottom, black 0%, black ${70 + eased * 30}%, transparent 100%)`,
          WebkitMaskImage: `linear-gradient(to bottom, black 0%, black ${70 + eased * 30}%, transparent 100%)`,
        }}
      />
      <div
        className={`relative mx-auto flex h-16 max-w-[1600px] items-center px-6 transition-colors duration-300 sm:h-[4.5rem] sm:px-10 ${
          onDark ? "text-white" : "text-black"
        }`}
      >
        {/* Hamburger */}
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
          className="flex h-10 w-10 flex-col items-start justify-center gap-1.5"
        >
          <span className="block h-[2.5px] w-7 rounded-full bg-current" />
          <span className="block h-[2.5px] w-7 rounded-full bg-current" />
          <span className="block h-[2.5px] w-7 rounded-full bg-current" />
        </button>

        {/* Logo — black at rest, white over dark scrolled bar */}
        <a href="#home" className="absolute left-1/2 -translate-x-1/2">
          <span className="relative block h-14 w-14 sm:h-[4.25rem] sm:w-[4.25rem]">
            <Image
              src="/images/logo/logo-black.png"
              alt="Jajabor"
              width={2134}
              height={2134}
              priority
              className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${
                onDark ? "opacity-0" : "opacity-100"
              }`}
            />
            <Image
              src="/images/logo/logo.png"
              alt=""
              aria-hidden
              width={2134}
              height={2134}
              priority
              className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${
                onDark ? "opacity-100" : "opacity-0"
              }`}
            />
          </span>
        </a>
      </div>

      {/* Fullscreen menu overlay */}
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 text-white transition-opacity duration-300 ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
          className="absolute right-8 top-7 text-4xl font-light leading-none"
        >
          &times;
        </button>
        <nav className="flex flex-col items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-3xl uppercase tracking-[0.3em] text-neutral-300 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
