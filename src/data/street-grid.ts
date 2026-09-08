export const STREET_GRID_WIDTH = 6526;
export const STREET_GRID_HEIGHT = 31672;

const COL = 2134;
const GAP = 62;
const SPAN = COL * 2 + GAP;

const X1 = 0;
const X2 = COL + GAP;
const X3 = X2 + COL + GAP;

export type StreetTile = {
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

function img(n: number) {
  return `/images/portfolio/Street/Street-${n}.jpg`;
}

export const STREET_PREVIEW_COUNT = 9;

export const streetTiles: StreetTile[] = [
  { src: img(26), x: X1, y: 0, w: COL, h: 2987 },
  { src: img(31), x: X1, y: 3049, w: COL, h: 2134 },
  { src: img(9), x: X1, y: 5245, w: COL, h: 2987 },
  { src: img(12), x: X1, y: 8294, w: COL, h: 2987 },
  { src: img(6), x: X1, y: 11343, w: COL, h: 2987 },
  { src: img(3), x: X1, y: 14392, w: COL, h: 2134 },
  { src: img(14), x: X1, y: 16588, w: COL, h: 2987 },
  { src: img(16), x: X1, y: 19637, w: COL, h: 2987 },
  { src: img(30), x: X1, y: 22686, w: COL, h: 2987 },
  { src: img(5), x: X1, y: 25735, w: SPAN, h: 2888 },
  { src: img(29), x: X1, y: 28685, w: COL, h: 2134 },

  { src: img(13), x: X2, y: 0, w: COL, h: 2987 },
  { src: img(18), x: X2, y: 3049, w: COL, h: 2987 },
  { src: img(27), x: X2, y: 6098, w: COL, h: 2987 },
  { src: img(4), x: X2, y: 9147, w: COL, h: 2134 },
  { src: img(10), x: X2, y: 11343, w: COL, h: 2987 },
  { src: img(25), x: X2, y: 14392, w: COL, h: 2987 },
  { src: img(1), x: X2, y: 17441, w: COL, h: 2134 },
  { src: img(17), x: X2, y: 19637, w: COL, h: 2987 },
  { src: img(19), x: X2, y: 22686, w: COL, h: 2987 },
  { src: img(15), x: X2, y: 28685, w: COL, h: 2987 },

  { src: img(8), x: X3, y: 0, w: COL, h: 2987 },
  { src: img(28), x: X3, y: 3049, w: COL, h: 2987 },
  { src: img(11), x: X3, y: 6098, w: COL, h: 2134 },
  { src: img(24), x: X3, y: 8294, w: COL, h: 2987 },
  { src: img(20), x: X3, y: 11343, w: COL, h: 2987 },
  { src: img(21), x: X3, y: 14392, w: COL, h: 2987 },
  { src: img(7), x: X3, y: 17441, w: COL, h: 2987 },
  { src: img(22), x: X3, y: 20490, w: COL, h: 2987 },
  { src: img(23), x: X3, y: 23539, w: COL, h: 2987 },
  { src: img(2), x: X3, y: 26588, w: COL, h: 2134 },
  { src: img(32), x: X3, y: 28784, w: COL, h: 2134 },
];

export const streetPreviewTiles = [...streetTiles]
  .sort((a, b) => a.y - b.y || a.x - b.x)
  .slice(0, STREET_PREVIEW_COUNT);

export const STREET_PREVIEW_HEIGHT = Math.max(
  ...streetPreviewTiles.map((tile) => tile.y + tile.h),
);
