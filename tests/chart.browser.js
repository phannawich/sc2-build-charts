import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, test } from 'node:test';
import { build, preview } from 'astro';
import { chromium } from 'playwright';

const base = '/sc2-build-charts/';
let dir, browser, server, url;

before(async () => {
  dir = await mkdtemp(join(tmpdir(), 'sc2-guides-'));
  const config = { outDir: dir, logLevel: 'silent', server: { host: '127.0.0.1', port: 0 } };
  process.env.SITE_BASE = base;
  await build(config);
  server = await preview(config);
  url = `http://127.0.0.1:${server.port}${base}`;
  browser = await chromium.launch();
});

after(async () => {
  await browser?.close();
  await server?.stop();
  if (dir) await rm(dir, { recursive: true, force: true });
});

const card = (page, id) => page.locator(`[data-card="${id}"]`);
const active = (page) => page.locator('[data-card].is-active');
const highlighted = (page) => page.locator('.chart-edges > path.is-neighbor');

test('catalogue and direct guide URL work under the Pages base, without the archived image', async () => {
  const page = await browser.newPage();
  try {
    const badRequests = [];
    page.on('request', req => {
      if (!req.url().startsWith(url) || req.url().includes('flowchart.png')) badRequests.push(req.url());
    });
    page.on('response', res => { if (res.status() >= 400) badRequests.push(`${res.status()} ${res.url()}`); });
    await page.goto(url);
    assert.equal(await page.locator('.guide-listing').count(), 1);
    await page.getByRole('link', { name: 'Protoss vs. Terran' }).click();
    assert.equal(page.url(), `${url}pvt/`);
    assert.equal((await page.reload()).status(), 200);
    await page.evaluate(() => document.fonts.ready);
    assert.deepEqual(badRequests, []);
    assert.equal(await page.locator('[data-card]').count(), 14);
    assert.equal(await page.locator('.chart-edges > path[marker-end]').count(), 18);
    assert.match(await card(page, 'push').innerText(), /XX:XX[\s\S]+4:05[\s\S]+4:45/);
    assert.match(await card(page, 'mine').innerText(), /17:58 and 25:42/);
    assert.equal(await page.getByRole('link', { name: 'All guides' }).getAttribute('href'), base);
    const clipped = await page.locator('.card-step').evaluateAll(steps => steps.filter(step => {
      const outer = step.closest('button').getBoundingClientRect();
      const inner = step.getBoundingClientRect();
      return inner.top < outer.top || inner.bottom > outer.bottom || step.scrollWidth > step.clientWidth;
    }).map(step => step.innerText));
    assert.deepEqual(clipped, []);
  } finally { await page.close(); }
});

test('mouse and keyboard preview immediate neighbors, preserve pins, and clear', async () => {
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  try {
    await page.goto(`${url}pvt/`);
    const opening = card(page, 'opening');
    const scout = card(page, 'first-scout');
    await opening.hover();
    assert.equal(await active(page).getAttribute('id'), 'opening');
    assert.equal(await highlighted(page).count(), 2);
    assert.deepEqual(await page.locator('[data-card].is-neighbor').evaluateAll(cards => cards.map(c => c.id)), ['proxy', 'twilight']);
    await opening.click();
    assert.equal(await opening.getAttribute('aria-pressed'), 'true');
    await scout.hover();
    assert.equal(await active(page).getAttribute('id'), 'first-scout');
    assert.equal(await highlighted(page).count(), 6);
    assert.equal(await opening.getAttribute('aria-pressed'), 'true');
    await page.mouse.move(0, 0);
    assert.equal(await active(page).getAttribute('id'), 'opening');
    await scout.press('Escape');
    assert.equal(await highlighted(page).count(), 0);
    assert.equal(await opening.getAttribute('aria-pressed'), 'false');

    await page.locator('.chart-viewport').focus();
    await page.keyboard.press('Tab');
    assert.equal(await active(page).getAttribute('id'), 'opening');
    await page.keyboard.press('Enter');
    assert.equal(await opening.getAttribute('aria-pressed'), 'true');
    await page.keyboard.press('Space');
    assert.equal(await opening.getAttribute('aria-pressed'), 'false');
    await page.keyboard.press('Enter');
    await page.locator('.chart-plane').click({ position: { x: 600, y: 26 } });
    assert.equal(await active(page).count(), 0);
    assert.equal(await opening.getAttribute('aria-pressed'), 'false');
  } finally { await page.close(); }
});

test('phone layout stays page-width, chart scrolls sideways, and touch toggles a pin', async () => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  try {
    await page.goto(url);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390);
    await Promise.all([
      page.waitForURL(`${url}pvt/`),
      page.getByRole('link', { name: 'Protoss vs. Terran' }).tap(),
    ]);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390);
    const viewport = page.getByRole('region', { name: 'PvT build chart' });
    const overflow = await viewport.evaluate(el => el.scrollWidth - el.clientWidth);
    const opening = card(page, 'opening');
    assert.ok(overflow > 1000);
    await opening.tap();
    assert.equal(await opening.getAttribute('aria-pressed'), 'true');
    await opening.tap();
    assert.equal(await active(page).count(), 0);
    const scrollLeft = await viewport.evaluate(el => { el.scrollLeft = 150; return el.scrollLeft; });
    assert.equal(scrollLeft, 150);
  } finally { await page.close(); }
});

test('chart renders all cards and arrows with JavaScript disabled, and the opening jump still works', async () => {
  const page = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  try {
    await page.goto(`${url}pvt/`);
    assert.equal(await page.locator('[data-card]:visible').count(), 14);
    const paintedArrows = await page.locator('.chart-edges > path').evaluateAll(paths => paths.filter(path => {
      const style = getComputedStyle(path);
      return path.getTotalLength() > 0 && style.stroke !== 'none' && style.markerEnd !== 'none' && style.visibility === 'visible';
    }).length);
    assert.equal(paintedArrows, 18);
    await page.getByRole('link', { name: 'Go to opening' }).click();
    assert.ok(page.url().endsWith('#opening'));
    const opening = await card(page, 'opening').boundingBox();
    assert.ok(opening.x >= 0 && opening.x < 390 && opening.y >= 0 && opening.y < 844);
  } finally { await page.close(); }
});
