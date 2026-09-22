"use client";

import { useState } from "react";

const fields = [
  { name: "name", label: "Your Name (required)", type: "text", required: true },
  { name: "email", label: "Your Email (required)", type: "email", required: true },
  { name: "subject", label: "Subject", type: "text", required: false },
] as const;

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" className="bg-charcoal py-28 text-cream">
      <div className="mx-auto max-w-[1000px] px-6 sm:px-10">
        <p className="text-center text-xs tracking-[0.28em] text-cream/55 uppercase">
          Get in touch
        </p>
        <h2 className="type-stroke mt-8 whitespace-nowrap text-center font-sans text-[clamp(1.15rem,4.2vw,2.75rem)] uppercase tracking-[0.12em] text-cream">
          Let&apos;s Work Together
        </h2>

        {sent ? (
          <p className="mt-20 text-center text-lg text-cream/80">
            Thank you! Your message has been sent — we&apos;ll get back to you soon.
          </p>
        ) : (
          <form
            className="mx-auto mt-20 max-w-[660px]"
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
            }}
          >
            {fields.map((field) => (
              <div key={field.name} className="mt-10 first:mt-0">
                <label htmlFor={field.name} className="block text-center text-cream/65">
                  {field.label}
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  className="mt-4 w-full border-b border-cream/30 bg-transparent pb-3 text-center text-lg outline-none transition-colors focus:border-cream"
                />
              </div>
            ))}

            <div className="mt-10">
              <label htmlFor="message" className="block text-center text-cream/65">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                className="mt-4 w-full resize-y border-b border-cream/30 bg-transparent pb-3 text-center text-lg outline-none transition-colors focus:border-cream"
              />
            </div>

            <div className="mt-16 text-center">
              <button
                type="submit"
                className="border-b border-cream pb-1 font-sans text-lg tracking-[0.2em] transition-colors hover:text-cream/70"
              >
                Send
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
