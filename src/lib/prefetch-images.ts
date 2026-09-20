const queued = new Set<string>();

export function prefetchImages(urls: string[]) {
  if (typeof window === "undefined") return;

  for (const url of urls) {
    if (!url || queued.has(url)) continue;
    queued.add(url);

    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "image";
    link.href = url;
    document.head.appendChild(link);
  }
}

export function prefetchImagesNow(urls: string[]) {
  if (typeof window === "undefined") return;

  for (const url of urls) {
    if (!url || queued.has(url)) continue;
    queued.add(url);

    const image = new Image();
    image.decoding = "async";
    image.src = url;
  }
}
