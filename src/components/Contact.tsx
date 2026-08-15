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
    <section id="contact" className="bg-[#1d1b19] py-28 text-white">
      <div className="mx-auto max-w-[1000px] px-6 sm:px-10">
        <p className="text-center text-xs uppercase tracking-[0.45em] text-neutral-300">
          Get in touch
        </p>
        <h2 className="mt-8 text-center text-4xl font-medium uppercase tracking-wide sm:text-5xl lg:text-6xl">
          Let&apos;s Work Together
        </h2>

        {sent ? (
          <p className="mt-20 text-center text-lg text-neutral-300">
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
                <label htmlFor={field.name} className="block text-center text-neutral-400">
                  {field.label}
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  className="mt-4 w-full border-b border-neutral-600 bg-transparent pb-3 text-center text-lg outline-none transition-colors focus:border-neutral-300"
                />
              </div>
            ))}

            <div className="mt-10">
              <label htmlFor="message" className="block text-center text-neutral-400">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                className="mt-4 w-full resize-y border-b border-neutral-600 bg-transparent pb-3 text-center text-lg outline-none transition-colors focus:border-neutral-300"
              />
            </div>

            <div className="mt-16 text-center">
              <button
                type="submit"
                className="border-b-2 border-indigo-600 pb-1 text-lg tracking-[0.2em] transition-colors hover:border-indigo-400 hover:text-neutral-300"
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
