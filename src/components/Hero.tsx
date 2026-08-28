import Image from "next/image";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-black">
      <Image
        src="/images/Hero_Image_Noir.png"
        alt="Black and white architectural noir"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
    </section>
  );
}
