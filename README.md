# StarCraft II Build Charts

An Astro site for interactive matchup charts. The first guide, **Protoss vs. Terran**, is transcribed from Harstem’s chart in `archive/flowchart.png`. The archive image is a reference only and is not served by the site.

## Run locally

With Node.js 22.12+:

```sh
npm ci
npm run dev
```

Open the URL Astro prints. The home page links to the PvT chart at `/pvt/`.

## Build and verify

```sh
npm test
npx playwright install chromium
npm run test:browser
npm run build
```

To preview at a GitHub Pages project path, use the same base for both commands:

```sh
SITE_BASE=/sc2-build-charts/ npm run build
SITE_BASE=/sc2-build-charts/ npm run preview
```

Open `/sc2-build-charts/` at the preview URL. The browser tests also build and preview under that base. They cover mouse, keyboard, touch, the phone-width layout, and rendering with JavaScript disabled.

## Add a guide

Create a data file in `src/guides/` and register it in `src/guides/index.js` when it’s ready to appear in the guide index. Cards use coordinates and dimensions in chart pixels; directed edges reference the source and destination card IDs and provide an SVG path in the same coordinate space. The shared Astro template rejects duplicate IDs and missing endpoints during build. Do not place reference images in `public/`.

## Publish when ready

Set the repository’s **Settings → Pages → Source** to **GitHub Actions**. Run **Deploy build guides to GitHub Pages** manually from the Actions tab. The workflow uses the Pages base path and uploads `dist/`. It does not run automatically on push.
