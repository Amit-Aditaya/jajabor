export const FOOD_GRID_WIDTH = 6526;
export const FOOD_GRID_HEIGHT = 20918;

const COL = 2134;
const GAP = 62;
const SPAN = COL * 2 + GAP;

const X1 = 0;
const X2 = COL + GAP;
const X3 = X2 + COL + GAP;

export type FoodTile = {
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

function img(n: number) {
  return `/images/portfolio/Food/Food-${n}.jpg`;
}

export const FOOD_PREVIEW_COUNT = 9;

export const foodTiles: FoodTile[] = [
  { src: img(5), x: X1, y: 0, w: COL, h: 2987 },
  { src: img(10), x: X1, y: 3049, w: COL, h: 2987 },
  { src: img(9), x: X1, y: 6098, w: COL, h: 2134 },
  { src: img(2), x: X1, y: 8294, w: COL, h: 2134 },
  { src: img(16), x: X1, y: 10490, w: COL, h: 2134 },
  { src: img(8), x: X1, y: 12686, w: COL, h: 2987 },
  { src: img(17), x: X1, y: 15735, w: COL, h: 2987 },
  { src: img(18), x: X1, y: 18784, w: COL, h: 2134 },

  { src: img(3), x: X2, y: 0, w: COL, h: 2987 },
  { src: img(1), x: X2, y: 3049, w: SPAN, h: 2888 },
  { src: img(4), x: X2, y: 5999, w: SPAN, h: 2888 },
  { src: img(11), x: X2, y: 8949, w: COL, h: 2987 },
  { src: img(7), x: X2, y: 11998, w: COL, h: 2987 },
  { src: img(12), x: X2, y: 15047, w: SPAN, h: 2888 },
  { src: img(13), x: X2, y: 17997, w: SPAN, h: 2888 },

  { src: img(6), x: X3, y: 0, w: COL, h: 2987 },
  { src: img(15), x: X3, y: 8949, w: COL, h: 2987 },
  { src: img(14), x: X3, y: 11998, w: COL, h: 2987 },
];

export const foodPreviewTiles = [...foodTiles]
  .sort((a, b) => a.y - b.y || a.x - b.x)
  .slice(0, FOOD_PREVIEW_COUNT);

export const FOOD_PREVIEW_HEIGHT = Math.max(
  ...foodPreviewTiles.map((tile) => tile.y + tile.h),
);
