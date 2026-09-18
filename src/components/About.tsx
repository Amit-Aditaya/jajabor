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
      className="relative overflow-hidden bg-[#f4f1ec] py-24 sm:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-[1480px] px-6 sm:px-10">
        <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)] lg:gap-16 xl:gap-24">
          <figure className="order-2 min-w-0 lg:order-1 lg:sticky lg:top-28">
            <div className="relative">
              <div className="relative aspect-[3/4] overflow-hidden bg-neutral-200">
                <Image
                  src="/images/portfolio/Architectural/Archi-5.jpg"
                  alt="Sunlit colonnade photographed for Jajabor"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <div className="pointer-events-none absolute -bottom-8 right-6 hidden w-[46%] overflow-hidden shadow-[0_24px_60px_rgba(20,16,12,0.28)] ring-[10px] ring-[#f4f1ec] lg:block">
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
            <figcaption className="mt-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.32em] text-neutral-500 lg:mt-16">
              <span>Architecture · Culture · Craft</span>
              <span className="h-px flex-1 bg-neutral-300" />
            </figcaption>
          </figure>

          <div className="order-1 min-w-0 lg:order-2 lg:pt-4">
            <p className="text-xs uppercase tracking-[0.45em] text-neutral-500">
              The Studio
            </p>

            <h2 className="mt-5">
              <span className="font-script block text-[4.75rem] leading-[0.85] text-neutral-800 sm:text-[6.75rem]">
                About
              </span>
              <span className="mt-3 block text-5xl font-normal uppercase tracking-[0.32em] text-neutral-900 sm:mt-4 sm:text-6xl">
                Us
              </span>
            </h2>

            <ul className="mt-14 grid grid-cols-1 gap-0 sm:grid-cols-3">
              {pillars.map((pillar, index) => (
                <li
                  key={pillar.n}
                  className={`min-w-0 border-t border-neutral-300 py-6 sm:py-7 ${
                    index === 0 ? "sm:pr-5" : ""
                  } ${index === 1 ? "sm:border-x sm:px-5" : ""} ${
                    index === 2 ? "sm:pl-5" : ""
                  }`}
                >
                  <p className="text-[11px] tracking-[0.35em] text-neutral-400">
                    {pillar.n}
                  </p>
                  <p className="mt-3 text-[12px] uppercase leading-[1.55] tracking-[0.14em] text-neutral-800">
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
              <p className="text-[1.35rem] font-light leading-[1.45] text-neutral-800 sm:text-[1.5rem]">
                Jajabor is a creative media agency bringing together marketing
                and storytelling from an artist&apos;s perspective.
              </p>
              <p className="text-[17px] leading-[1.85] text-neutral-600">
                Founded by a multidisciplinary team shaped by architecture,
                business and the creative arts, we see brands as stories with a
                visual language, a point of view and a place in culture.
              </p>
              <p className="text-[17px] leading-[1.85] text-neutral-600">
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
