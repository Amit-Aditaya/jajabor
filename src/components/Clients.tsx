import Image from "next/image";

const clients = [
  { src: "/images/client_logos/1. Studio 7.png", alt: "Studio 7" },
  { src: "/images/client_logos/9. Moire Studio.png", alt: "Moire Studio" },
  { src: "/images/client_logos/2. Pull it Off.png", alt: "Pull it Off" },
  { src: "/images/client_logos/10. Kinky Cafe.png", alt: "Kinky Cafe" },
  { src: "/images/client_logos/3. Izaan.png", alt: "Izaan" },
  { src: "/images/client_logos/11. DOUR.png", alt: "DOUR" },
  { src: "/images/client_logos/4. Final Third Soccer.png", alt: "Final Third Soccer" },
  { src: "/images/client_logos/12. BANAi.png", alt: "BANAi" },
  {
    src: "/images/client_logos/5. Next Level Sports Management.png",
    alt: "Next Level Sports Management",
  },
  { src: "/images/client_logos/13. Ethereal.png", alt: "Ethereal" },
  { src: "/images/client_logos/6. Bangladesh Drip.png", alt: "Bangladesh Drip" },
  { src: "/images/client_logos/14. The Sugarist.png", alt: "The Sugarist" },
  { src: "/images/client_logos/7. Central Fitness.png", alt: "Central Fitness" },
  { src: "/images/client_logos/15. Outliers.png", alt: "Outliers" },
  { src: "/images/client_logos/8. IHSB.png", alt: "IHSB" },
  { src: "/images/client_logos/16. Jithbo.png", alt: "Jithbo" },
];

function LogoGroup({
  decorative = false,
}: {
  decorative?: boolean;
}) {
  return (
    <div
      className="clients-carousel-group"
      aria-hidden={decorative || undefined}
    >
      {clients.map((client, index) => (
        <div
          key={`${client.src}-${decorative ? "dup" : "src"}-${index}`}
          className="clients-carousel-card flex aspect-square shrink-0 items-center justify-center"
        >
          <Image
            src={client.src}
            alt={decorative ? "" : client.alt}
            width={180}
            height={180}
            draggable={false}
            className="pointer-events-none max-h-[72%] max-w-[82%] object-contain"
          />
        </div>
      ))}
    </div>
  );
}

export default function Clients() {
  return (
    <section id="clients" className="bg-canvas py-24">
      <div className="mx-auto max-w-[1480px] px-6 sm:px-10">
        <p className="text-center text-xs tracking-[0.28em] text-ink-muted uppercase">
          Our clients and partners
        </p>
        <h2 className="type-stroke mt-6 text-center font-sans text-[2.5rem] tracking-[0.16em] text-ink sm:text-[3.125rem]">
          Happy Clients
        </h2>
      </div>

      <div
        className="clients-carousel mt-16 overflow-hidden select-none"
        role="region"
        aria-label="Client logos"
      >
        <div className="clients-carousel-track">
          <LogoGroup />
          <LogoGroup decorative />
        </div>
      </div>
    </section>
  );
}
