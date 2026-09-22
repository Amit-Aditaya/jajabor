const offerings = [
  {
    n: "01",
    title: "Brand",
    copy: "Strategy, Identity & Positioning.",
    icon: IconBrand,
  },
  {
    n: "02",
    title: "Content",
    copy: "Content Strategy, Social Media, Photography, Video, Motion.",
    icon: IconContent,
  },
  {
    n: "03",
    title: "Creative",
    copy: "Creative Campaigns & Visual Communication",
    icon: IconCreative,
  },
  {
    n: "04",
    title: "Digital",
    copy: "Website Design, Meta Ads, Google Ads, Lead Generation & Performance Marketing",
    icon: IconDigital,
  },
  {
    n: "05",
    title: "Growth",
    copy: "SEO & Digital Growth Strategy",
    icon: IconGrowth,
  },
];

const ideas = [
  { n: "01", title: "Ideas." },
  { n: "02", title: "Stories." },
  { n: "03", title: "Growth." },
];

function iconClass(className?: string) {
  return `h-8 w-8 ${className ?? ""}`;
}

function IconBrand({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={iconClass(className)}
      aria-hidden
    >
      <path
        d="M16 4.5 27.5 16 16 27.5 4.5 16 16 4.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconContent({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={iconClass(className)}
      aria-hidden
    >
      <rect
        x="5.5"
        y="6.5"
        width="14"
        height="14"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <rect
        x="12.5"
        y="11.5"
        width="14"
        height="14"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function IconCreative({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={iconClass(className)}
      aria-hidden
    >
      <path
        d="M16 5.5 18.2 13.8 26.5 16 18.2 18.2 16 26.5 13.8 18.2 5.5 16 13.8 13.8 16 5.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconDigital({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={iconClass(className)}
      aria-hidden
    >
      <rect
        x="5.5"
        y="7.5"
        width="21"
        height="14"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M12 25.5h8M16 21.5v4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconGrowth({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={iconClass(className)}
      aria-hidden
    >
      <path
        d="M8 22.5v-6M16 22.5V9.5M24 22.5V13"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M6 25.5h20"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Services() {
  return (
    <section
      id="services"
      className="relative overflow-hidden bg-charcoal py-24 text-cream sm:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-[1480px] px-6 sm:px-10">
        <p className="text-xs tracking-[0.28em] text-cream/55 uppercase">
          What we do
        </p>

        <h2 className="type-stroke mt-5 whitespace-nowrap font-sans text-[clamp(1.55rem,5.4vw,3.125rem)] uppercase tracking-[0.16em] text-cream">
          Our Services
        </h2>

        <ul className="mt-14 grid max-w-3xl grid-cols-1 gap-0 sm:grid-cols-3">
          {ideas.map((idea, index) => (
            <li
              key={idea.title}
              className={`min-w-0 border-t border-cream/20 py-6 sm:py-7 ${
                index === 0 ? "sm:pr-5" : ""
              } ${index === 1 ? "sm:border-x sm:border-cream/20 sm:px-5" : ""} ${
                index === 2 ? "sm:pl-5" : ""
              }`}
            >
              <p className="text-[11px] tracking-[0.28em] text-cream/45">
                {idea.n}
              </p>
              <p className="mt-3 font-sans text-[1.05rem] tracking-[0.06em] text-cream">
                {idea.title}
              </p>
            </li>
          ))}
        </ul>

        <ul className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {offerings.map((item, index) => (
            <li
              key={item.title}
              className={`min-w-0 border-t border-cream/20 py-10 sm:py-12 ${
                index === 0 ? "sm:pr-8 lg:pr-6" : "sm:px-8 lg:px-6"
              } ${index === offerings.length - 1 ? "sm:pr-0" : ""}`}
            >
              <item.icon className="text-cream" />
              <p className="mt-8 text-[11px] tracking-[0.28em] text-cream/45">
                {item.n}
              </p>
              <h3 className="mt-4 font-sans text-[1.5625rem] tracking-[0.08em]">
                {item.title}
              </h3>
              <p className="mt-5 max-w-[16rem] text-[15px] leading-[1.7] text-cream/80">
                {item.copy}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
