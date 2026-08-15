import Image from "next/image";

export default function Hero() {
  return (
    <section id="home" className="relative flex min-h-screen items-end justify-center overflow-hidden bg-black">
      <div className="relative mt-24 h-[85vh] w-full max-w-[1100px]">
        <Image
          src="/images/hero.jpg"
          alt="Black and white portrait"
          fill
          priority
          sizes="100vw"
          className="object-contain object-bottom grayscale"
        />
        {/* soft fade into the black backdrop */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.85)_100%)]" />
      </div>
    </section>
  );
}
