import Image from "next/image";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-black">
      <Image
        src="/images/3. Hero Image Noir Portrait.jpg"
        alt="Black and white architectural noir"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center md:hidden"
      />
      <Image
        src="/images/Hero_Image_Noir.jpg"
        alt="Black and white architectural noir"
        fill
        priority
        sizes="100vw"
        className="hidden object-cover object-center md:block"
      />
    </section>
  );
}
