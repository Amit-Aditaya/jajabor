"use client";

import { useState, type FormEvent } from "react";

const CONTACT_EMAIL = "jforjajabor@gmail.com";

const fields = [
  { name: "name", label: "Your Name (required)", type: "text", required: true },
  { name: "email", label: "Your Email (required)", type: "email", required: true },
  { name: "subject", label: "Subject", type: "text", required: false },
] as const;

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<"" | "activation" | "failed">("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = event.currentTarget;
    const data = new FormData(form);

    if (String(data.get("_honey") ?? "").length > 0) {
      setSent(true);
      return;
    }

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const subject = String(data.get("subject") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    setSending(true);

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent(CONTACT_EMAIL)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            subject,
            message,
            _subject: subject
              ? `Jajabor website: ${subject}`
              : "New message from the Jajabor website",
            _template: "table",
            _captcha: "false",
            _replyto: email,
          }),
        },
      );

      const result = (await response.json().catch(() => null)) as {
        success?: string | boolean;
        message?: string;
      } | null;

      const delivered =
        response.ok &&
        (result?.success === true || result?.success === "true");

      if (!delivered) {
        setError(/activat/i.test(result?.message ?? "") ? "activation" : "failed");
        return;
      }

      setSent(true);
    } catch {
      setError("failed");
    } finally {
      setSending(false);
    }
  }

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
          <form className="mx-auto mt-20 max-w-[660px]" onSubmit={handleSubmit}>
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
                  disabled={sending}
                  className="mt-4 w-full border-b border-cream/30 bg-transparent pb-3 text-center text-lg outline-none transition-colors focus:border-cream disabled:opacity-60"
                />
              </div>
            ))}

            <div className="mt-10">
              <label htmlFor="message" className="block text-center text-cream/65">
                Your Message (required)
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                required
                disabled={sending}
                className="mt-4 w-full resize-y border-b border-cream/30 bg-transparent pb-3 text-center text-lg outline-none transition-colors focus:border-cream disabled:opacity-60"
              />
            </div>

            <input
              type="text"
              name="_honey"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            {error === "activation" ? (
              <p role="alert" className="mt-10 text-center text-cream/80">
                One step left. Open the activation email sent to{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="border-b border-cream/40 transition-colors hover:border-cream"
                >
                  {CONTACT_EMAIL}
                </a>
                , click Activate Form, then send this message again.
              </p>
            ) : null}

            {error === "failed" ? (
              <p role="alert" className="mt-10 text-center text-cream/80">
                We could not send your message. Please try again, or write to us at{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="border-b border-cream/40 transition-colors hover:border-cream"
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            ) : null}

            <div className="mt-16 text-center">
              <button
                type="submit"
                disabled={sending}
                className="border-b border-cream pb-1 font-sans text-lg tracking-[0.2em] transition-colors hover:text-cream/70 disabled:cursor-wait disabled:text-cream/50"
              >
                {sending ? "Sending" : "Send"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
