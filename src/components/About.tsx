import Image from "next/image";

const pillars = [
  { n: "01", lines: ["Creative", "thinking"] },
  { n: "02", lines: ["Strategic", "direction"] },
  { n: "03", lines: ["Measurable", "growth"] },
];

export default function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-cream py-24 sm:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-[1480px] px-6 sm:px-10">
        <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)] lg:gap-16 xl:gap-24">
          <figure className="order-2 min-w-0 lg:order-1 lg:sticky lg:top-28">
            <div className="relative">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#e6e1d8]">
                <Image
                  src="/images/portfolio/Architectural/Archi-5.jpg"
                  alt="Sunlit colonnade photographed for Jajabor"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <div className="pointer-events-none absolute -bottom-8 right-6 hidden w-[46%] overflow-hidden shadow-[0_24px_60px_rgba(61,58,55,0.22)] ring-[10px] ring-cream lg:block">
                <div className="relative aspect-[4/5]">
                  <Image
                    src="/images/portfolio/Architectural/Archi-9.jpg"
                    alt=""
                    fill
                    sizes="18vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
            <figcaption className="mt-6 flex items-center gap-4 text-[11px] tracking-[0.28em] text-ink-muted lg:mt-16">
              <span>Architecture · Culture · Craft</span>
              <span className="h-px flex-1 bg-ink/20" />
            </figcaption>
          </figure>

          <div className="order-1 min-w-0 lg:order-2 lg:pt-4">
            <p className="text-xs tracking-[0.28em] text-ink-muted uppercase">
              The Studio
            </p>

            <h2 className="type-stroke mt-5 whitespace-nowrap font-sans text-[clamp(1.75rem,6.5vw,3.125rem)] uppercase tracking-[0.16em] text-ink">
              About Us
            </h2>

            <ul className="mt-14 grid grid-cols-1 gap-0 sm:grid-cols-3">
              {pillars.map((pillar, index) => (
                <li
                  key={pillar.n}
                  className={`min-w-0 border-t border-ink/20 py-6 sm:py-7 ${
                    index === 0 ? "sm:pr-5" : ""
                  } ${index === 1 ? "sm:border-x sm:px-5" : ""} ${
                    index === 2 ? "sm:pl-5" : ""
                  }`}
                >
                  <p className="text-[11px] tracking-[0.28em] text-ink-muted">
                    {pillar.n}
                  </p>
                  <p className="mt-3 font-sans text-[1.05rem] leading-[1.45] tracking-[0.06em] text-ink">
                    {pillar.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-12 max-w-[38rem] space-y-7">
              <p className="font-sans text-[1.45rem] leading-[1.45] text-ink sm:text-[1.5625rem]">
                Jajabor is a creative media agency bringing together marketing
                and storytelling from an artist&apos;s perspective.
              </p>
              <p className="text-[17px] leading-[1.85] text-ink">
                Founded by a multidisciplinary team shaped by architecture,
                business and the creative arts, we see brands as stories with a
                visual language, a point of view and a place in culture.
              </p>
              <p className="text-[17px] leading-[1.85] text-ink">
                Through branding, content, visual production and digital
                marketing, we translate that perspective into distinctive
                identities and purposeful communication resulting in work that
                earns attention, builds recognition and moves people. From brand
                storytelling and social-first content to Meta and Google, we
                create for the places where modern brands are seen, remembered,
                and chosen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
