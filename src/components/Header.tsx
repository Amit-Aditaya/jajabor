"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
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

  // Ease-out cubic — glass settles in with a cinematic curve
  const eased = 1 - (1 - navProgress) ** 3;
  // Switch to light marks once the frost is dark enough for contrast
  const onScrolled = eased > 0.42;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Scroll-linked frosted glass */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(
            180deg,
            rgba(61, 58, 55, ${0.58 * eased}) 0%,
            rgba(61, 58, 55, ${0.72 * eased}) 100%
          )`,
          backdropFilter: `blur(${eased * 24}px) saturate(${100 + eased * 60}%)`,
          WebkitBackdropFilter: `blur(${eased * 24}px) saturate(${100 + eased * 60}%)`,
          boxShadow:
            eased > 0.02 ? `0 8px 28px rgba(61,58,55,${0.18 * eased})` : "none",
        }}
      />
      <div
        className={`relative mx-auto flex h-16 max-w-[1600px] items-center px-6 transition-colors duration-300 sm:h-[4.5rem] sm:px-10 ${
          onScrolled ? "text-cream" : "text-ink"
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

        {/* Logo — dark at rest, light over the frosted glass bar */}
        <a href="#home" className="absolute left-1/2 -translate-x-1/2">
          <span className="relative block h-14 w-14 sm:h-[4.25rem] sm:w-[4.25rem]">
            <Image
              src="/images/logo/logo-black.png"
              alt="Jajabor"
              width={2134}
              height={2134}
              priority
              className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${
                onScrolled ? "opacity-0" : "opacity-100"
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
                onScrolled ? "opacity-100" : "opacity-0"
              }`}
            />
          </span>
        </a>
      </div>

      {/* Fullscreen menu overlay */}
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-charcoal/95 text-cream transition-opacity duration-300 ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
          className="absolute right-8 top-7 font-sans text-4xl leading-none"
        >
          &times;
        </button>
        <nav className="flex flex-col items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-sans text-[1.75rem] tracking-[0.18em] text-cream/80 transition-colors hover:text-cream sm:text-[2.2rem]"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
