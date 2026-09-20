import Image from "next/image";
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
  return (
    <Image
      src={optimizedSrc(src)}
      alt=""
      fill
      sizes={sizes}
      loading={loading}
      decoding="async"
      className={className}
    />
  );
}
