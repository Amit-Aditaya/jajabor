"use client";

import { useState } from "react";
import { optimizedSrc } from "@/lib/media-src";

type PortfolioImageProps = {
  src: string;
  sizes: string;
  className?: string;
  loading?: "eager" | "lazy";
};

export default function PortfolioImage({
  src,
  sizes,
  className = "object-cover",
  loading = "lazy",
}: PortfolioImageProps) {
  const webp = optimizedSrc(src);
  const [current, setCurrent] = useState(webp);

  return (
    // next/image is unoptimized here, and its fill markup is what iOS Safari
    // paints as a broken image when a photo request is dropped.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt=""
      sizes={sizes}
      loading={loading}
      decoding="async"
      className={`absolute inset-0 h-full w-full ${className}`}
      onError={() => {
        if (current === webp) {
          const join = webp.includes("?") ? "&" : "?";
          setCurrent(`${webp}${join}retry=1`);
        }
      }}
    />
  );
}
