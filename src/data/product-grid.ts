export const PRODUCT_GRID_WIDTH = 6526;
export const PRODUCT_GRID_HEIGHT = 26526;

const COL = 2134;
const GAP = 62;
const SPAN = COL * 2 + GAP;

const X1 = 0;
const X2 = COL + GAP;
const X3 = X2 + COL + GAP;

export type ProductTile = {
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

function img(n: number) {
  return `/images/portfolio/Product/Product-${n}.jpg`;
}

export const PRODUCT_PREVIEW_COUNT = 9;

export const productTiles: ProductTile[] = [
  { src: img(26), x: X1, y: 0, w: COL, h: 2987 },
  { src: img(22), x: X1, y: 3049, w: COL, h: 2987 },
  { src: img(13), x: X1, y: 6098, w: COL, h: 2987 },
  { src: img(24), x: X1, y: 9147, w: COL, h: 2987 },
  { src: img(6), x: X1, y: 12196, w: COL, h: 2134 },
  { src: img(5), x: X1, y: 14392, w: COL, h: 2987 },
  { src: img(11), x: X1, y: 17441, w: COL, h: 2134 },
  { src: img(12), x: X1, y: 19637, w: COL, h: 2987 },
  { src: img(10), x: X1, y: 22686, w: SPAN, h: 2888 },

  { src: img(19), x: X2, y: 0, w: COL, h: 2987 },
  { src: img(23), x: X2, y: 3049, w: COL, h: 2987 },
  { src: img(18), x: X2, y: 6098, w: COL, h: 2987 },
  { src: img(20), x: X2, y: 9147, w: COL, h: 2987 },
  { src: img(14), x: X2, y: 12196, w: COL, h: 2987 },
  { src: img(3), x: X2, y: 15245, w: COL, h: 2987 },
  { src: img(1), x: X2, y: 18294, w: COL, h: 2134 },
  { src: img(17), x: X2, y: 20490, w: COL, h: 2134 },

  { src: img(4), x: X3, y: 0, w: COL, h: 2987 },
  { src: img(7), x: X3, y: 3049, w: COL, h: 2134 },
  { src: img(25), x: X3, y: 5245, w: COL, h: 2987 },
  { src: img(21), x: X3, y: 8294, w: COL, h: 2987 },
  { src: img(8), x: X3, y: 11343, w: COL, h: 2987 },
  { src: img(2), x: X3, y: 14392, w: COL, h: 2987 },
  { src: img(16), x: X3, y: 17441, w: COL, h: 2987 },
  { src: img(15), x: X3, y: 20490, w: COL, h: 2987 },
  { src: img(9), x: X3, y: 23539, w: COL, h: 2987 },
];

export const productPreviewTiles = [...productTiles]
  .sort((a, b) => a.y - b.y || a.x - b.x)
  .slice(0, PRODUCT_PREVIEW_COUNT);

export const PRODUCT_PREVIEW_HEIGHT = Math.max(
  ...productPreviewTiles.map((tile) => tile.y + tile.h),
);
