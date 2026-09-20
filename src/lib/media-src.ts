export function optimizedSrc(src: string) {
  return src.replace(/\.jpe?g$/i, ".webp");
}
