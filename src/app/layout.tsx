import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Outfit stands in for Ace Sans (commercial). Files are vendored so the
// production build does not download Google Fonts.
const heading = localFont({
  src: "../fonts/outfit/Outfit-Variable.woff2",
  weight: "100 900",
  variable: "--font-heading",
  display: "swap",
});

const display = localFont({
  src: [
    {
      path: "../fonts/bodoni-moda/BodoniModa-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/bodoni-moda/BodoniModa-Italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-bodoni",
  display: "swap",
});

const evolventa = localFont({
  src: [
    {
      path: "../fonts/evolventa/Evolventa-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/evolventa/Evolventa-Oblique.woff",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-evolventa",
  display: "swap",
  fallback: ["Century Gothic", "Futura", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Jajabor",
  description:
    "Jajabor — a creative studio. Explore our portfolio, our happy clients and get in touch to work together.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${heading.variable} ${evolventa.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">{children}</body>
    </html>
  );
}
