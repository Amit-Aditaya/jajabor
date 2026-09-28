"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function readTime(quote: string) {
  const words = quote.trim().split(/\s+/).length;
  return Math.min(24000, Math.max(9000, words * 260));
}

const portrait = (file: string) =>
  `/9.%20Testimonials/Client%20Portraits/${encodeURIComponent(file)}`;

const testimonials = [
  {
    quote:
      "Jajabor has played a meaningful role in shaping Studio 7’s brand and how we present ourselves digitally. From our branding, visual direction to managing our presence across Meta, they have consistently understood what we want the studio to communicate and translated it into work that feels distinctly ours. What stands out is their ability to bring creative thinking into every part of the process while being attentive to our feedback and incredibly easy to work with. Jajabor has become a trusted creative partner for Studio 7, and we’re excited to continue building together.",
    name: "Hussain Habib Tarango",
    role: "Co Founder, Studio 7",
    src: portrait("Studio 7 b.png"),
  },
  {
    quote:
      "I have been working with Jajabor for 6 years now, and I couldn't be happier with the consistent quality of their work and their excellent communication. It feels so good to work with someone who is sincere, reliable, respectful and genuinely shares the client's interests. I would highly recommend them!",
    name: "Rahbar Khan",
    role: "Co Founder, Next Level Sports Management",
    src: portrait("NLSM.png"),
  },
  {
    quote:
      "Been working on projects since 2022. It has been nothing but a pleasant experience. Jajabor understands every project of PIO and the uniqueness that comes with it. Always meets time commitments and handles every piece of feedback and redo with patience. 100% reliable, 100% recommended.",
    name: "Mahiul Tilak",
    role: "Founder, PIO",
    src: portrait("Pio.png"),
  },
  {
    quote:
      "Working with Jajabor has been a wonderful experience for us. They helped transform the way our brand is presented across our Meta platforms, from product shoots to the overall visual direction of our content. Despite working within a very short timeline, the team was able to understand our vision and deliver work that gave the brand a completely refreshed outlook. They are creative, responsive and incredibly efficient, and we’ve genuinely enjoyed working with them.",
    name: "Rayhan Areefin",
    role: "Founder, Izaan",
    src: portrait("Izaan.png"),
  },
  {
    quote:
      "Working with Jajabor has honestly been a game changer for us at Kinky Coffee House. Between running the cafe and managing our cultural school where we teach everything from guitars to sculpture. Things get chaotic real quick. When Jajabor steps in to create content for us, they just get it. They capture that exact cosy, artsy vibe that we love, whether it is the bustle of the coffee bar or a clay covered art class in session. It never feels like stiff, corporate marketing; it feels real, warm and true to who we are. Absolute legends to work with!",
    name: "Rofiqul Islam Bablo",
    role: "Founder, Kinky Coffee House",
    src: portrait("Kinky Coffee House.png"),
  },
];

function Portrait({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <span
      className={`relative block overflow-hidden rounded-full bg-[#e6e1d8] ${className ?? ""}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="220px"
        className="object-cover"
      />
    </span>
  );
}

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const fromPointer = useRef(false);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);
  const holding = hovered || focused || !inView || reduced;
  const duration = readTime(testimonials[index].quote);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (holding) return;
    const timer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % testimonials.length);
    }, duration);
    return () => window.clearTimeout(timer);
  }, [holding, index, duration]);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="bg-cream py-24 sm:py-32 lg:py-40"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onPointerDown={() => {
        fromPointer.current = true;
      }}
      onFocusCapture={(event) => {
        if (fromPointer.current) {
          fromPointer.current = false;
          return;
        }
        if (event.target instanceof Element && event.target.matches(":focus-visible")) {
          setFocused(true);
        }
      }}
      onBlurCapture={(event) => {
        const next = event.relatedTarget;
        if (!(next instanceof Node) || !event.currentTarget.contains(next)) {
          setFocused(false);
        }
      }}
    >
      <div className="mx-auto max-w-[1480px] px-6 sm:px-10">
        <p className="text-center text-xs tracking-[0.28em] text-ink-muted uppercase">
          In their words
        </p>
        <h2 className="type-stroke mt-6 text-center font-sans text-[clamp(1.55rem,5.6vw,3.125rem)] uppercase tracking-[0.16em] text-ink">
          Testimonials
        </h2>

        <div
          className="mx-auto mt-16 max-w-[980px] lg:mt-24"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
        >
          <div className="overflow-hidden">
          <div
            className="flex items-stretch transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            style={{ transform: `translate3d(-${index * 100}%, 0, 0)` }}
          >
            {testimonials.map((item, itemIndex) => (
              <figure
                key={item.src}
                className="grid w-full shrink-0 basis-full items-stretch gap-10 self-stretch sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-12 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-20"
                aria-hidden={itemIndex !== index}
              >
                <Portrait
                  src={item.src}
                  alt={itemIndex === index ? item.name : ""}
                  className="mx-auto aspect-square w-[168px] self-start sm:w-full"
                />

                <div className="flex h-full flex-col">
                  <blockquote>
                    <p className="text-[17px] leading-[1.85] text-ink sm:text-[1.125rem]">
                      {item.quote}
                    </p>
                  </blockquote>
                  <div className="mt-auto pt-8">
                    <figcaption className="border-t border-ink/15 pt-6">
                      <p className="font-sans text-[15px] tracking-[0.14em] text-ink uppercase">
                        {item.name}
                      </p>
                      <p className="mt-2 text-xs tracking-[0.22em] text-ink-muted uppercase">
                        {item.role}
                      </p>
                    </figcaption>
                  </div>
                </div>
              </figure>
            ))}
          </div>
          </div>

          <div className="mt-10 h-px w-full bg-ink/10" aria-hidden>
            {!holding && (
              <div
                key={index}
                className="testimonial-progress h-full origin-left bg-ink/40"
                style={{ animation: `testimonial-progress ${duration}ms linear` }}
              />
            )}
          </div>

          <div
            className="mt-8 flex items-center justify-center gap-3"
            role="tablist"
            aria-label="Testimonials"
          >
            {testimonials.map((item, itemIndex) => {
              const selected = itemIndex === index;
              return (
                <button
                  key={item.src}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-label={`${item.name}, ${item.role}`}
                  onClick={() => setIndex(itemIndex)}
                  className={`relative rounded-full transition-opacity ${
                    selected ? "opacity-100" : "opacity-45 hover:opacity-80"
                  }`}
                >
                  <Portrait src={item.src} alt="" className="h-11 w-11 sm:h-12 sm:w-12" />
                  <span
                    className={`pointer-events-none absolute -inset-1 rounded-full ring-1 transition-opacity ${
                      selected ? "opacity-100 ring-ink/70" : "opacity-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
