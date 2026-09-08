export const TRAVEL_GRID_WIDTH = 6526;
export const TRAVEL_GRID_HEIGHT = 34622;

const COL = 2134;
const GAP = 62;
const SPAN = COL * 2 + GAP;

const X1 = 0;
const X2 = COL + GAP;
const X3 = X2 + COL + GAP;

export type TravelTile = {
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

function img(n: number) {
  return encodeURI(`/images/portfolio/Travel and Nature/Nomad-${n}.jpg`);
}

export const TRAVEL_PREVIEW_COUNT = 9;

export const travelTiles: TravelTile[] = [
  { src: img(23), x: X1, y: 0, w: COL, h: 2987 },
  { src: img(22), x: X1, y: 3049, w: COL, h: 2987 },
  { src: img(12), x: X1, y: 6098, w: COL, h: 2987 },
  { src: img(4), x: X1, y: 9147, w: COL, h: 2987 },
  { src: img(31), x: X1, y: 12196, w: COL, h: 2134 },
  { src: img(29), x: X1, y: 14392, w: COL, h: 2987 },
  { src: img(5), x: X1, y: 17441, w: COL, h: 2987 },
  { src: img(3), x: X1, y: 20490, w: COL, h: 2987 },
  { src: img(28), x: X1, y: 23539, w: COL, h: 2987 },
  { src: img(13), x: X1, y: 26588, w: COL, h: 2134 },
  { src: img(17), x: X1, y: 28784, w: COL, h: 2987 },

  { src: img(20), x: X2, y: 0, w: SPAN, h: 2888 },
  { src: img(7), x: X2, y: 2950, w: COL, h: 2987 },
  { src: img(32), x: X2, y: 5999, w: SPAN, h: 2888 },
  { src: img(9), x: X2, y: 8949, w: COL, h: 2987 },
  { src: img(25), x: X2, y: 11998, w: COL, h: 2987 },
  { src: img(18), x: X2, y: 15047, w: COL, h: 2987 },
  { src: img(30), x: X2, y: 18096, w: COL, h: 2987 },
  { src: img(2), x: X2, y: 21145, w: COL, h: 2987 },
  { src: img(26), x: X2, y: 24194, w: COL, h: 2987 },
  { src: img(21), x: X2, y: 27243, w: COL, h: 2987 },
  { src: img(15), x: X2, y: 30292, w: COL, h: 2987 },

  { src: img(6), x: X3, y: 2950, w: COL, h: 2987 },
  { src: img(1), x: X3, y: 8949, w: COL, h: 2987 },
  { src: img(14), x: X3, y: 11998, w: COL, h: 2134 },
  { src: img(19), x: X3, y: 14194, w: COL, h: 2987 },
  { src: img(24), x: X3, y: 17243, w: COL, h: 2987 },
  { src: img(11), x: X3, y: 20292, w: COL, h: 2987 },
  { src: img(27), x: X3, y: 23341, w: COL, h: 2987 },
  { src: img(8), x: X3, y: 26390, w: COL, h: 2134 },
  { src: img(16), x: X3, y: 28586, w: COL, h: 2987 },
  { src: img(10), x: X3, y: 31635, w: COL, h: 2987 },
];

export const travelPreviewTiles = [...travelTiles]
  .sort((a, b) => a.y - b.y || a.x - b.x)
  .slice(0, TRAVEL_PREVIEW_COUNT);

export const TRAVEL_PREVIEW_HEIGHT = Math.max(
  ...travelPreviewTiles.map((tile) => tile.y + tile.h),
);
