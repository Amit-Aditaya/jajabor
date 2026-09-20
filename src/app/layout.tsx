import type { Metadata } from "next";
import { Bodoni_Moda, Outfit } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Outfit stands in for Ace Sans (commercial). Replace with next/font/local when licensed files are available.
const heading = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "400",
});

const display = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
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
