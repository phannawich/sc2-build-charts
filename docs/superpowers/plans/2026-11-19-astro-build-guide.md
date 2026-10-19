# Astro Build Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish-ready static home and playable-in-browser PvT chart matching the approved design, without publishing it yet.

**Architecture:** Astro generates `/` and `/pvt/` from a guide registry. Each guide owns the positioned card transcription and directed SVG paths; a shared component validates that data and renders it before an optional browser script adds interaction.

**Tech Stack:** Astro, HTML, SVG, CSS, vanilla JavaScript, Node test runner, Playwright for browser verification.

---

### Task 1: Transcribe and validate PvT

- [x] In `src/guides/pvt.js`, transcribe all 14 cards and 18 arrows from `archive/flowchart.png`, preserving relative geometry, text, emphasis, counts, and video timestamps. Use `{ id, title, x, y, width, steps }` cards and `{ from, to, path }` edges.
- [x] Add `tests/guide.test.js` assertions for duplicate IDs and dangling endpoints, then implement `validateGuide(guide)` in `src/guides/validate.js`. Run `npm test` and compare the transcription against the image.

### Task 2: Render the static site

- [x] Configure `package.json` and `astro.config.mjs` with static output and `SITE_BASE` (defaults to `/`). Use `import.meta.env.BASE_URL` for internal URLs.
- [x] Register PvT in `src/guides/index.js`. In `src/pages/index.astro` generate the published catalogue; in `src/pages/[guide]/index.astro`, generate guide routes with `getStaticPaths`.
- [x] Add `src/layouts/SiteLayout.astro`, `src/styles/site.css`, and `src/components/Chart.astro`. Use self-hosted Sakura Chroma fonts, cream paper, brown outlines, halftone, and ribbons. Render SVG paths and accessible card buttons in a fixed, horizontally scrollable chart plane. Run `npm run build` and verify both pages exist under `dist/`.

### Task 3: Add and verify interaction

- [x] Add `src/scripts/chart.js`: determine the active card from preview or pin, mark incident edges and their two endpoint cards, and keep `aria-pressed` synchronized with the pin. Escape and blank-space clicks reset state. Use native button activation for mouse, tap, Enter, and Space.
- [x] Add `tests/chart.browser.js` for desktop, touch, keyboard, and disabled-JavaScript scenarios, including internal links under a nonroot build base. Run `npm test` and `npm run test:browser`; inspect the responsive home and chart and confirm no archive PNG is requested.
- [x] Add `README.md` for local dev and preview and a manual-only `.github/workflows/pages.yml` that uses the configured Pages base. Do not create a remote, trigger a deployment, or push.
