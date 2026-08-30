/**
 * Development helper: screenshot pages at a few widths so the design can be
 * reviewed as pictures rather than as markup.
 *
 *   node scripts/shots.mjs [baseUrl] [outDir]
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const base = process.argv[2] ?? 'http://localhost:4321';
const outDir = process.argv[3] ?? '.staging/shots';

const pages = [
  { name: 'home', path: '/' },
  { name: 'publications', path: '/publications' },
  { name: 'research', path: '/research' },
  { name: 'about', path: '/about' },
  { name: '404', path: '/404' },
];

const viewports = [
  { name: 'desktop', width: 1440, height: 900, full: true },
  { name: 'laptop', width: 1280, height: 800, full: false },
  { name: 'tablet', width: 834, height: 1112, full: true },
  { name: 'mobile', width: 390, height: 844, full: true },
];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    hasTouch: viewport.name === 'mobile',
    isMobile: viewport.name === 'mobile',
  });
  const page = await context.newPage();

  for (const target of pages) {
    if (process.argv[4] && target.name !== process.argv[4]) continue;
    await page.goto(`${base}${target.path}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    // Walk the page so scroll-triggered reveals have all fired before a
    // full-page capture, then return to the top.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        // `behavior: instant` beats the site's smooth scrolling.
        window.scrollTo({ top: y, behavior: 'instant' });
        await new Promise((r) => setTimeout(r, 80));
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 200));
    });
    await page.waitForTimeout(700);
    const file = `${outDir}/${target.name}-${viewport.name}.png`;
    await page.screenshot({ path: file, fullPage: viewport.full });
    console.log(file);
  }

  await context.close();
}

await browser.close();
