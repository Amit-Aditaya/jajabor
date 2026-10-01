"use client";

import { useLayoutEffect, useRef, useState } from "react";
import MediaLoader from "@/components/MediaLoader";
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
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [instant, setInstant] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const loaded = loadedSrc === current;

  useLayoutEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) {
      setInstant(true);
      setLoadedSrc(current);
      return;
    }
    setInstant(false);
  }, [current]);

  return (
    <>
      <MediaLoader tone="light" visible={!loaded} instant={instant} />
      {/* next/image is unoptimized here, and its fill markup is what iOS Safari
          paints as a broken image when a photo request is dropped. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={current}
        alt=""
        sizes={sizes}
        loading={loading}
        decoding="async"
        className={`media-reveal absolute inset-0 z-[1] h-full w-full ${
          instant ? "transition-none" : "transition-opacity duration-700 ease-out"
        } ${className} ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoadedSrc(current)}
        onError={() => {
          if (current === webp) {
            const join = webp.includes("?") ? "&" : "?";
            setCurrent(`${webp}${join}retry=1`);
            return;
          }
          setLoadedSrc(current);
        }}
      />
    </>
  );
}
