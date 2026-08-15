import type { Metadata } from "next";
import { Jost, Mr_Dafoe } from "next/font/google";
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

const mrDafoe = Mr_Dafoe({
  variable: "--font-script",
  weight: "400",
  subsets: ["latin"],
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
      className={`${jost.variable} ${mrDafoe.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
