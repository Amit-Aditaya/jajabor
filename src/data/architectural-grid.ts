export const ARCHITECTURAL_GRID_WIDTH = 6526;
export const ARCHITECTURAL_GRID_HEIGHT = 38321;

const COL = 2134;
const GAP = 62;
const SPAN = COL * 2 + GAP;

const X1 = 0;
const X2 = COL + GAP;
const X3 = X2 + COL + GAP;

export type ArchitecturalTile = {
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

function img(n: number) {
  return `/images/portfolio/Architectural/Archi-${n}.jpg`;
}

export const ARCHITECTURAL_PREVIEW_COUNT = 9;

export const architecturalTiles: ArchitecturalTile[] = [
  { src: img(14), x: X1, y: 0, w: COL, h: 2987 },
  { src: img(27), x: X1, y: 3049, w: COL, h: 2986 },
  { src: img(33), x: X1, y: 6097, w: COL, h: 2987 },
  { src: img(1), x: X1, y: 9146, w: COL, h: 2133 },
  { src: img(16), x: X1, y: 11341, w: COL, h: 2987 },
  { src: img(8), x: X1, y: 14390, w: COL, h: 2986 },
  { src: img(22), x: X1, y: 17438, w: COL, h: 2987 },
  { src: img(9), x: X1, y: 20487, w: COL, h: 2986 },
  { src: img(28), x: X1, y: 23535, w: COL, h: 2987 },
  { src: img(21), x: X1, y: 26584, w: COL, h: 2986 },
  { src: img(29), x: X1, y: 29632, w: COL, h: 2134 },
  { src: img(10), x: X1, y: 31831, w: COL, h: 2987 },
  { src: img(3), x: X1, y: 34884, w: COL, h: 2133 },

  { src: img(25), x: X2, y: 0, w: COL, h: 2134 },
  { src: img(5), x: X2, y: 2196, w: COL, h: 2986 },
  { src: img(20), x: X2, y: 5245, w: COL, h: 2986 },
  { src: img(13), x: X2, y: 8293, w: COL, h: 2987 },
  { src: img(23), x: X2, y: 11341, w: SPAN, h: 2888 },
  { src: img(18), x: X2, y: 14290, w: COL, h: 2987 },
  { src: img(32), x: X2, y: 17338, w: SPAN, h: 2888 },
  { src: img(6), x: X2, y: 20288, w: COL, h: 2986 },
  { src: img(19), x: X2, y: 23336, w: SPAN, h: 2887 },
  { src: img(30), x: X2, y: 26285, w: SPAN, h: 2888 },
  { src: img(11), x: X2, y: 29237, w: COL, h: 2986 },
  { src: img(2), x: X2, y: 32286, w: COL, h: 2986 },
  { src: img(4), x: X2, y: 35334, w: COL, h: 2987 },

  { src: img(31), x: X3, y: 0, w: COL, h: 2987 },
  { src: img(34), x: X3, y: 3049, w: COL, h: 2986 },
  { src: img(15), x: X3, y: 6097, w: COL, h: 2987 },
  { src: img(24), x: X3, y: 9146, w: COL, h: 2133 },
  { src: img(17), x: X3, y: 14290, w: COL, h: 2987 },
  { src: img(12), x: X3, y: 20288, w: COL, h: 2986 },
  { src: img(26), x: X3, y: 29237, w: COL, h: 2986 },
  { src: img(7), x: X3, y: 32286, w: COL, h: 2986 },
];

export const architecturalPreviewTiles = [...architecturalTiles]
  .sort((a, b) => a.y - b.y || a.x - b.x)
  .slice(0, ARCHITECTURAL_PREVIEW_COUNT);

export const ARCHITECTURAL_PREVIEW_HEIGHT = Math.max(
  ...architecturalPreviewTiles.map((tile) => tile.y + tile.h),
);
