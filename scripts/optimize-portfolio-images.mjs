import { readdir, mkdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORTFOLIO = path.join(ROOT, "public/images/portfolio");
const MAX_EDGE = 1600;
const WEBP_QUALITY = 78;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "Videos" && path.basename(dir) === "portfolio") {
        files.push(...(await walk(path.join(full, "posters"))));
        continue;
      }
      files.push(...(await walk(full)));
      continue;
    }

    if (/\.jpe?g$/i.test(entry.name) && !entry.name.startsWith(".")) {
      files.push(full);
    }
  }

  return files;
}

async function shouldSkip(src, dest) {
  try {
    const [inStat, outStat] = await Promise.all([stat(src), stat(dest)]);
    return outStat.mtimeMs >= inStat.mtimeMs && outStat.size > 0;
  } catch {
    return false;
  }
}

async function convert(src) {
  const dest = src.replace(/\.jpe?g$/i, ".webp");
  if (await shouldSkip(src, dest)) return { src, dest, skipped: true };

  await mkdir(path.dirname(dest), { recursive: true });
  await sharp(src)
    .rotate()
    .resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toFile(dest);

  return { src, dest, skipped: false };
}

const files = await walk(PORTFOLIO);
let converted = 0;
let skipped = 0;

for (const file of files) {
  const result = await convert(file);
  if (result.skipped) skipped += 1;
  else converted += 1;
}

console.log(
  `Portfolio images: ${converted} converted, ${skipped} up-to-date, ${files.length} total`,
);

const dataDir = path.join(ROOT, "src/data");
const dataFiles = (await readdir(dataDir)).filter((name) => name.endsWith(".ts"));
const referenced = new Set();

for (const name of dataFiles) {
  const text = await readFile(path.join(dataDir, name), "utf8");

  for (const match of text.matchAll(/["'`](\/images\/portfolio\/[^"'`$]+\.jpe?g)["'`]/g)) {
    referenced.add(match[1]);
  }

  const numbers = [...text.matchAll(/\bimg\((\d+)\)/g)].map((match) => match[1]);
  for (const match of text.matchAll(/`(\/images\/portfolio\/[^`$]*\$\{n\}[^`$]*\.jpe?g)`/g)) {
    for (const n of numbers) {
      referenced.add(match[1].replaceAll("${n}", n));
    }
  }

  for (const match of text.matchAll(/\bvideo\(\s*"([^"]+\.mp4)"/g)) {
    referenced.add(`/images/portfolio/Videos/posters/${match[1]}.jpg`);
  }
}

const missing = [];
for (const src of referenced) {
  const webp = path.join(ROOT, "public", decodeURI(src).replace(/\.jpe?g$/i, ".webp").slice(1));
  try {
    const info = await stat(webp);
    if (info.size === 0) missing.push(src);
  } catch {
    missing.push(src);
  }
}

if (missing.length) {
  console.error(
    `Missing ${missing.length} portfolio display image(s). Run this script where the JPEG masters exist, then commit the generated .webp files:`,
  );
  for (const src of missing.sort()) console.error(`  ${src}`);
  process.exit(1);
}
