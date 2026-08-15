# Jajabor

Static one-page website for **Jajabor**, built with Next.js (App Router) and Tailwind CSS, based on the mockups in [Jajabor-mockup/](Jajabor-mockup/).

## Sections

- **Hero** — full-screen black hero with a B&W portrait, hamburger menu, centered signature logo and account/search/bag icons
- **Portfolio** — filterable masonry grid (All / Design / Development / Photography / Product)
- **Clients** — "Happy Clients" logo grid with divider lines
- **Contact** — "Let's Work Together" form with underline-style inputs (front-end only for now)

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router, `output: "export"` — fully static site)
- React 19
- Tailwind CSS 4
- TypeScript

## Getting started

### Prerequisites

- Node.js **20.9+** (Node 22 recommended)
- npm (comes with Node)

### Run locally

```bash
git clone <repo-url>
cd Jajabor
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The page hot-reloads as you edit files.

## Production build

The site is configured with `output: "export"`, so a build produces a fully static site in `out/` — no Node server needed to host it:

```bash
npm run build
```

Deploy the `out/` folder to any static host (nginx, GitHub Pages, S3, Netlify, etc.).

## Run with Docker

No Node.js required — only [Docker](https://docs.docker.com/get-docker/):

```bash
docker compose up --build
```

Then open [http://localhost:3000](http://localhost:3000).

Or without Compose:

```bash
docker build -t jajabor .
docker run -p 3000:80 jajabor
```

The image is a two-stage build: Node 22 builds the static export, then nginx serves it (see [Dockerfile](Dockerfile) and [nginx.conf](nginx.conf)). Since the site is baked at build time, any future `NEXT_PUBLIC_*` env vars must be provided during `docker build`, not `docker run`.

## Project structure

```
src/
  app/            # App Router entry: layout, page, global styles, favicon
  components/     # Hero, Portfolio, Clients, Contact, Header, Footer
public/
  images/         # Hero, portfolio, and client-logo assets
Jajabor-mockup/   # Design mockups the site is based on
```

## Scripts

| Command         | What it does                             |
| --------------- | ---------------------------------------- |
| `npm run dev`   | Start the dev server on `localhost:3000` |
| `npm run build` | Build the static site into `out/`        |
| `npm run lint`  | Run ESLint                               |

## Placeholder assets

All imagery is placeholder content, meant to be swapped later:

- `public/images/hero.jpg` and `public/images/portfolio/*.jpg` — free photos from Unsplash
- `public/images/clients/logo-*.svg` — hand-made Logoipsum-style placeholder logos
- Logo — the "Jajabor" wordmark is rendered in the Mr Dafoe script font (via `next/font`)
- Favicon — `src/app/icon.svg` ("J" monogram)
