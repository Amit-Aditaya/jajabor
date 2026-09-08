export const ALL_GRID_WIDTH = 6526;
export const ALL_GRID_HEIGHT = 18133;

const COL = 2134;
const GAP = 62;
const SPAN = COL * 2 + GAP;

const X1 = 0;
const X2 = COL + GAP;
const X3 = X2 + COL + GAP;

export type AllTile = {
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

export const ALL_PREVIEW_COUNT = 9;

export const allTiles: AllTile[] = [
  { src: "/images/portfolio/Sports/Sports-2.jpg", x: X1, y: 0, w: COL, h: 2134 },
  { src: "/images/portfolio/Product/Product-20.jpg", x: X1, y: 2196, w: COL, h: 2987 },
  { src: "/images/portfolio/Architectural/Archi-5.jpg", x: X1, y: 5245, w: COL, h: 2987 },
  { src: "/images/portfolio/Street/Street-28.jpg", x: X1, y: 8294, w: COL, h: 2987 },
  { src: "/images/portfolio/Sports/Sports-22.jpg", x: X1, y: 11343, w: COL, h: 2987 },
  { src: "/images/portfolio/Sports/Sports-20.jpg", x: X1, y: 14392, w: COL, h: 2987 },

  { src: encodeURI("/images/portfolio/Travel and Nature/Nomad-25.jpg"), x: X2, y: 0, w: COL, h: 2987 },
  { src: "/images/portfolio/Architectural/Archi-27.jpg", x: X2, y: 3049, w: COL, h: 2987 },
  { src: "/images/portfolio/Street/Street-6.jpg", x: X2, y: 6098, w: COL, h: 2987 },
  { src: "/images/portfolio/Product/Product-23.jpg", x: X2, y: 9147, w: COL, h: 2987 },
  { src: "/images/portfolio/Food/Food-6.jpg", x: X2, y: 12196, w: COL, h: 2987 },
  { src: encodeURI("/images/portfolio/Travel and Nature/Nomad-20.jpg"), x: X2, y: 15245, w: SPAN, h: 2888 },

  { src: "/images/portfolio/Fashion/Fashion-11.jpg", x: X3, y: 0, w: COL, h: 2987 },
  { src: "/images/portfolio/Sports/Sports-11.jpg", x: X3, y: 3049, w: COL, h: 2987 },
  { src: "/images/portfolio/Architectural/Archi-13.jpg", x: X3, y: 6098, w: COL, h: 2987 },
  { src: "/images/portfolio/Street/Street-13.jpg", x: X3, y: 9147, w: COL, h: 2987 },
  { src: encodeURI("/images/portfolio/Travel and Nature/Nomad-12.jpg"), x: X3, y: 12196, w: COL, h: 2987 },
];

export const allPreviewTiles = [...allTiles]
  .sort((a, b) => a.y - b.y || a.x - b.x)
  .slice(0, ALL_PREVIEW_COUNT);

export const ALL_PREVIEW_HEIGHT = Math.max(
  ...allPreviewTiles.map((tile) => tile.y + tile.h),
);
