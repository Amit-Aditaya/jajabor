import Image from "next/image";

const clients = Array.from({ length: 8 }, (_, i) => ({
  src: `/images/clients/logo-${i + 1}.svg`,
  alt: `Client logo ${i + 1}`,
}));

export default function Clients() {
  return (
    <section id="clients" className="bg-white py-24">
      <div className="mx-auto max-w-[1480px] px-6 sm:px-10">
        <p className="text-center text-xs uppercase tracking-[0.45em] text-neutral-800">
          Our clients and partners
        </p>
        <h2 className="mt-6 text-center text-5xl font-normal tracking-wide text-neutral-900 sm:text-6xl">
          HAPPY CLIENTS
        </h2>

        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4">
          {clients.map((client, index) => (
            <div
              key={client.src}
              className={`flex items-center justify-center border-neutral-200 px-8 py-10 ${
                index % 2 !== 0 ? "border-l" : ""
              } ${index % 4 !== 0 ? "lg:border-l" : "lg:border-l-0"} ${
                index >= 2 ? "border-t" : ""
              } ${index >= 2 && index < 4 ? "lg:border-t-0" : ""}`}
            >
              <Image
                src={client.src}
                alt={client.alt}
                width={200}
                height={130}
                className="h-auto w-full max-w-[190px] opacity-80 transition-opacity duration-300 hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
