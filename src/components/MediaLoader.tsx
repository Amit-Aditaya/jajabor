type MediaMarkProps = {
  tone?: "ink" | "cream";
  size?: "tile" | "badge";
};

export function MediaMark({ tone = "ink", size = "tile" }: MediaMarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden
      className={`media-loader-mark ${size === "badge" ? "media-loader-mark-badge" : ""} ${
        tone === "cream" ? "text-cream" : "text-ink"
      }`}
    >
      <circle
        cx="24"
        cy="24"
        r="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.15"
        opacity="0.34"
      />
      <g className="media-loader-iris">
        <circle
          cx="24"
          cy="24"
          r="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeDasharray="22 66"
        />
      </g>
      <circle className="media-loader-dot" cx="24" cy="24" r="1.7" fill="currentColor" />
    </svg>
  );
}

type MediaLoaderProps = {
  tone?: "light" | "dark";
  visible: boolean;
  instant?: boolean;
};

export default function MediaLoader({
  tone = "light",
  visible,
  instant = false,
}: MediaLoaderProps) {
  return (
    <span
      aria-hidden
      data-tone={tone}
      data-ready={visible ? "false" : "true"}
      className={`media-loader pointer-events-none absolute inset-0 z-20 ${
        instant ? "transition-none" : "transition-opacity duration-700 ease-out"
      } ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <span className="media-loader-sheen" />
      <MediaMark tone={tone === "dark" ? "cream" : "ink"} />
    </span>
  );
}
