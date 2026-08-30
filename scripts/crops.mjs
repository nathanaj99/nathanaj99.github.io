/**
 * Development helper: screenshot individual elements at full resolution, for
 * looking closely at one piece of the design at a time.
 *
 *   node scripts/crops.mjs [baseUrl] [outDir] [width]
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const base = process.argv[2] ?? 'http://localhost:4322';
const outDir = process.argv[3] ?? '.staging/crops';
const width = Number(process.argv[4] ?? 1440);

const targets = [
  { name: 'hero', path: '/', selector: '.hero' },
  { name: 'research', path: '/', selector: 'section[aria-labelledby="research-head"]' },
  { name: 'work', path: '/', selector: 'section[aria-labelledby="work-head"]' },
  { name: 'aboutband', path: '/', selector: '.about' },
  { name: 'footer', path: '/', selector: 'footer' },
  { name: 'pubs-head', path: '/publications', selector: '.page' },
  { name: 'pubs-year', path: '/publications', selector: 'section.year' },
  { name: 'research-area', path: '/research', selector: 'section.area' },
  { name: 'about-body', path: '/about', selector: '.body' },
  { name: 'notfound', path: '/404', selector: '.lost' },
];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height: 1000 }, deviceScaleFactor: 1 });

let current = '';
for (const target of targets) {
  if (current !== target.path) {
    await page.goto(`${base}${target.path}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo({ top: y, behavior: 'instant' });
        await new Promise((r) => setTimeout(r, 80));
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.waitForTimeout(500);
    current = target.path;
  }

  const element = page.locator(target.selector).first();
  const file = `${outDir}/${target.name}.png`;
  await element.screenshot({ path: file });
  console.log(file);
}

await browser.close();
