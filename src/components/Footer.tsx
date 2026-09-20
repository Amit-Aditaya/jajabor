import Image from "next/image";

const socialLinks = [
  {
    name: "Facebook",
    href: "#",
    src: "/images/social_icons/Facebook.png",
    width: 513,
    height: 510,
  },
  {
    name: "Instagram",
    href: "#",
    src: "/images/social_icons/Instagram.png",
    width: 512,
    height: 512,
  },
  {
    name: "WhatsApp",
    href: "#",
    src: "/images/social_icons/WhatsApp.png",
    width: 514,
    height: 496,
  },
];

export default function Footer() {
  return (
    <footer className="bg-charcoal-soft py-8">
      <div className="mx-auto flex max-w-[1480px] flex-col items-center justify-between gap-6 px-6 sm:flex-row sm:px-10">
        <p className="text-cream/65">Jajabor &copy;. All rights reserved.</p>
        <nav aria-label="Social media" className="flex items-center gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              aria-label={link.name}
              className="inline-flex h-9 w-9 items-center justify-center opacity-80 transition-opacity hover:opacity-100"
            >
              <Image
                src={link.src}
                alt=""
                width={link.width}
                height={link.height}
                className="h-8 w-8 object-contain"
              />
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
