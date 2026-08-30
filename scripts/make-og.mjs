/**
 * Renders the social-share image and the touch icon into /public. Run it again
 * if the name, statement, or palette changes:
 *
 *   node scripts/make-og.mjs
 */
import { chromium } from 'playwright';
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';

const FONT = 'node_modules/@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2';
const font = `data:font/woff2;base64,${(await readFile(FONT)).toString('base64')}`;

const cream = '#f4ecdb';
const ink = '#1f1d19';
const persimmon = '#de4e26';
const gold = '#f2b32c';
const cobalt = '#2e56a6';

const html = `<!doctype html>
<html><head><meta charset="utf-8" /><style>
  @font-face {
    font-family: 'Archivo';
    src: url('${font}') format('woff2-variations');
    font-weight: 100 900;
  }
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; background: ${cream}; color: ${ink};
    font-family: 'Archivo', Helvetica, Arial, sans-serif;
    display: grid; grid-template-columns: 1fr auto; gap: 48px;
    padding: 64px 72px;
  }
  .label {
    font-size: 15px; font-weight: 600; letter-spacing: 2.6px; text-transform: uppercase;
    display: flex; align-items: center; gap: 12px;
  }
  .label i { width: 9px; height: 9px; border-radius: 50%; background: ${persimmon}; }
  .rule { height: 1px; background: rgba(31,29,25,.2); margin-top: 22px; }
  .name {
    margin-top: 40px; font-size: 128px; font-weight: 500; line-height: .86;
    letter-spacing: -4.4px; text-transform: uppercase;
  }
  .jo { display: flex; align-items: baseline; }
  .o { width: .72em; height: .72em; margin-left: .035em; }
  .statement {
    margin-top: 38px; font-size: 27px; line-height: 1.3; letter-spacing: -.4px; max-width: 22ch;
  }
  .col { display: flex; flex-direction: column; height: 100%; }
  .foot {
    margin-top: auto; font-size: 15px; font-weight: 600; letter-spacing: 2.6px;
    text-transform: uppercase; color: rgba(31,29,25,.55);
  }
  .art { align-self: stretch; }
</style></head>
<body>
  <div class="col">
    <div class="label"><i></i>PhD Student, Computer Science · MIT</div>
    <div class="rule"></div>
    <div class="name">
      <div>Nathanael</div>
      <div class="jo">J<svg class="o" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="44.5" fill="none" stroke="${ink}" stroke-width="10.5"/>
        <circle cx="50" cy="50" r="17.5" fill="${persimmon}"/>
      </svg></div>
    </div>
    <div class="statement">Human–AI interaction, AI evaluation, and algorithmic decisions inside institutions.</div>
    <div class="foot">nathanaj99.github.io</div>
  </div>

  <svg class="art" width="330" height="470" viewBox="0 0 330 470" fill="none">
    <line x1="120" y1="22" x2="120" y2="66" stroke="${ink}" stroke-width="1.4" opacity=".55"/>
    <line x1="58" y1="66" x2="212" y2="66" stroke="${ink}" stroke-width="1.4" opacity=".55"/>
    <circle cx="120" cy="22" r="4.5" fill="${ink}"/>
    <line x1="58" y1="66" x2="58" y2="112" stroke="${ink}" stroke-width="1.4" opacity=".55"/>
    <circle cx="58" cy="158" r="46" fill="${persimmon}"/>
    <line x1="212" y1="66" x2="212" y2="128" stroke="${ink}" stroke-width="1.4" opacity=".55"/>
    <line x1="188" y1="128" x2="290" y2="128" stroke="${ink}" stroke-width="1.4" opacity=".55"/>
    <line x1="188" y1="128" x2="188" y2="212" stroke="${ink}" stroke-width="1.4" opacity=".55"/>
    <circle cx="188" cy="244" r="32" fill="${gold}"/>
    <line x1="290" y1="128" x2="290" y2="348" stroke="${ink}" stroke-width="1.4" opacity=".55"/>
    <circle cx="290" cy="368" r="20" fill="${cobalt}"/>
  </svg>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.screenshot({ path: 'public/og-image.png' });
await browser.close();

// Touch icon: the same ring-and-disc mark as the favicon.
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="${cream}"/>
  <circle cx="50" cy="50" r="34" fill="none" stroke="${ink}" stroke-width="11"/>
  <circle cx="50" cy="50" r="15" fill="${persimmon}"/>
</svg>`;
await writeFile('public/apple-touch-icon.png', await sharp(Buffer.from(icon)).resize(180, 180).png().toBuffer());

console.log('wrote public/og-image.png and public/apple-touch-icon.png');
