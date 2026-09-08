export const SPORTS_GRID_WIDTH = 1566;
export const SPORTS_GRID_HEIGHT = 6895;

const COL = 512;
const GAP = 15;

const X1 = 0;
const X2 = COL + GAP;
const X3 = X2 + COL + GAP;

export type SportsTile = {
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

function img(n: number) {
  return `/images/portfolio/Sports/Sports-${n}.jpg`;
}

export const SPORTS_PREVIEW_COUNT = 9;

export const sportsTiles: SportsTile[] = [
  { src: img(2), x: X1, y: 0, w: COL, h: 512 },
  { src: img(9), x: X1, y: 527, w: COL, h: 717 },
  { src: img(29), x: X1, y: 1259, w: COL, h: 512 },
  { src: img(21), x: X1, y: 1786, w: COL, h: 717 },
  { src: img(10), x: X1, y: 2518, w: COL, h: 717 },
  { src: img(1), x: X1, y: 3250, w: COL, h: 717 },
  { src: img(25), x: X1, y: 3982, w: COL, h: 717 },
  { src: img(14), x: X1, y: 4714, w: COL, h: 717 },
  { src: img(30), x: X1, y: 5446, w: COL, h: 512 },
  { src: img(7), x: X1, y: 5973, w: COL, h: 717 },

  { src: img(16), x: X2, y: 0, w: COL, h: 717 },
  { src: img(18), x: X2, y: 732, w: COL, h: 717 },
  { src: img(17), x: X2, y: 1464, w: COL, h: 717 },
  { src: img(15), x: X2, y: 2196, w: COL, h: 717 },
  { src: img(4), x: X2, y: 2928, w: COL, h: 512 },
  { src: img(8), x: X2, y: 3455, w: COL, h: 717 },
  { src: img(22), x: X2, y: 4187, w: COL, h: 717 },
  { src: img(23), x: X2, y: 4919, w: COL, h: 717 },
  { src: img(24), x: X2, y: 5651, w: COL, h: 717 },
  { src: img(3), x: X2, y: 6383, w: COL, h: 512 },

  { src: img(20), x: X3, y: 0, w: COL, h: 717 },
  { src: img(11), x: X3, y: 732, w: COL, h: 717 },
  { src: img(5), x: X3, y: 1464, w: COL, h: 512 },
  { src: img(12), x: X3, y: 1991, w: COL, h: 717 },
  { src: img(27), x: X3, y: 2723, w: COL, h: 512 },
  { src: img(26), x: X3, y: 3250, w: COL, h: 512 },
  { src: img(13), x: X3, y: 3777, w: COL, h: 717 },
  { src: img(28), x: X3, y: 4509, w: COL, h: 512 },
  { src: img(19), x: X3, y: 5036, w: COL, h: 512 },
  { src: img(6), x: X3, y: 5563, w: COL, h: 512 },
  { src: img(31), x: X3, y: 6090, w: COL, h: 512 },
];

export const sportsPreviewTiles = [...sportsTiles]
  .sort((a, b) => a.y - b.y || a.x - b.x)
  .slice(0, SPORTS_PREVIEW_COUNT);

export const SPORTS_PREVIEW_HEIGHT = Math.max(
  ...sportsPreviewTiles.map((tile) => tile.y + tile.h),
);
