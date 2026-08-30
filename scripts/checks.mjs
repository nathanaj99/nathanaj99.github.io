/**
 * Development helper: sanity checks across pages and widths — horizontal
 * overflow, elements wider than the viewport, and missing alt text.
 *
 *   node scripts/checks.mjs [baseUrl]
 */
import { chromium } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:4322';
const paths = ['/', '/publications', '/research', '/about', '/404'];
const widths = [1680, 1440, 1280, 1024, 834, 768, 600, 430, 390, 360, 320];

const browser = await chromium.launch();
let problems = 0;

for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  for (const path of paths) {
    await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    const report = await page.evaluate(() => {
      const doc = document.documentElement;
      const overflow = doc.scrollWidth - doc.clientWidth;
      const wide = [...document.querySelectorAll('body *')]
        .filter((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.width === 0) return false;
          const style = getComputedStyle(el);
          if (style.position === 'fixed') return false;
          // Ignore elements the design deliberately crops at the edge.
          if (el.closest('.foot__arc, .area__mark, svg')) return false;
          return rect.right > window.innerWidth + 1 || rect.left < -1;
        })
        .slice(0, 5)
        .map((el) => `${el.tagName.toLowerCase()}.${el.className}`.slice(0, 80));
      const imagesWithoutAlt = [...document.querySelectorAll('img:not([alt])')].length;
      const headings = [...document.querySelectorAll('h1')].length;
      return { overflow, wide, imagesWithoutAlt, h1Count: headings };
    });

    const issues = [];
    if (report.overflow > 0) issues.push(`overflow ${report.overflow}px`);
    if (report.wide.length) issues.push(`escaping: ${report.wide.join(' | ')}`);
    if (report.imagesWithoutAlt) issues.push(`${report.imagesWithoutAlt} img without alt`);
    if (report.h1Count !== 1) issues.push(`${report.h1Count} h1 elements`);

    if (issues.length) {
      problems += issues.length;
      console.log(`✗ ${width}px ${path}: ${issues.join('; ')}`);
    }
  }
  await page.close();
}

console.log(problems === 0 ? '✓ no layout problems found' : `${problems} problem(s)`);
await browser.close();
