# nathanaj99.github.io

Personal academic site for Nathanael Jo. Built with [Astro](https://astro.build), deployed to
GitHub Pages by GitHub Actions. No CSS framework, no UI kit, no client-side router: the pages are
static HTML, and the only JavaScript is a few kilobytes for the pointer-driven pieces in the hero.

This replaces the previous Jekyll / al-folio site. All of the content came across: publications,
coauthors, venues, paper and code links, press coverage, the biography, the CV, the headshot, and
the SEO metadata.

---

## Running it locally

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # writes dist/
npm run preview  # serves dist/ at http://localhost:4322
npm run check    # type-checks .astro files
```

Node 20 or newer.

---

## Editing content

Content is deliberately kept out of the components. Four files cover almost everything.

### `src/content/publications.yaml` — the bibliography

One entry per paper. This is what the old `_bibliography/papers.bib` became. Sort order is
computed, never manual: **year descending → working papers, then conference, then journal → month
descending**. So adding a paper is just adding an entry.

```yaml
- id: my-new-paper # unique; also the anchor on /publications
  title: The title of the paper
  authors: [Nathanael Jo, A Coauthor]
  year: 2026
  month: 7 # optional, only affects ordering within a year
  type: conference # working-paper | conference | journal
  venue: Full Venue Name # shown on /publications
  venueShort: NeurIPS # shown in tight columns
  status: Working paper # use instead of venue for unpublished work
  links: # omit anything that doesn't exist
    html: https://… # version of record; becomes the "Paper" link
    arxiv: "2503.15634" # id only, not a URL
    pdf: https://…
    code: https://…
  press:
    - name: CBS News
      url: https://…
  figure: my_figure.svg # file in public/figures, shown on hover on wide screens
  figureAlt: One sentence describing the figure.
  selected: true # → appears in "Selected work" on the homepage
  themes: [human-ai] # ids from research.yaml
```

Nothing else needs touching: counts, the year groupings, the per-area paper lists on `/research`,
and the homepage selection all derive from this file.

### `src/content/research.yaml` — the three research areas

Each area has a `title`, a `question`, a `summary`, an `accent` colour, and a short `label` (one
or two lines) used for the disc in the hero mobile. Papers join an area through their own `themes`
field, so a paper is never listed in two places.

The hero mobile is drawn for three areas. Adding a fourth needs a new disc and arm in
`src/components/ResearchMobile.astro` — the geometry is hand-placed on purpose.

### `src/content/prose/about.md` — the biography

Plain markdown, links and all. It is the full bio shown on `/about`.

### `src/data/site.ts` — name, links, affiliations, short bio

Email, social links, navigation, the hero statement, the shorter homepage bio, positions,
education, SEO description and keywords.

### Files

- `public/cv.pdf` — the CV. Replace the file, keep the name, and every link stays correct.
- `src/assets/portrait.png` — the headshot. Astro resizes and converts it at build time; a square
  image works best because it is masked into a circle.
- `public/figures/` — paper figures used for the hover previews on `/publications`.
- `public/og-image.png`, `public/apple-touch-icon.png` — generated. Re-run
  `node scripts/make-og.mjs` after changing the name, statement, or palette.

---

## Deployment

Pushing to `master` triggers `.github/workflows/deploy.yml`, which builds the site and publishes
`dist/` to GitHub Pages. Nothing is committed to a `gh-pages` branch — the artifact goes straight
to Pages.

**One-time setup:** in the repository, go to *Settings → Pages* and set **Source** to
**GitHub Actions**. (The old site was served from the `gh-pages` branch; that branch is now unused
and can be deleted.)

The site URL lives in `astro.config.mjs`. Because this is a user site
(`nathanaj99.github.io`), it is served from the domain root and `base` is `/`. If the site ever
moves into a project repository, set `base: '/repo-name'` there — every internal link is built
through the `url()` helper in `src/lib/url.ts`, so nothing else has to change.

---

## How the site is put together

```
src/
  assets/            portrait (processed at build time)
  components/        Nav, footer, name mark, hero mobile, publication row, section heading
  content/           publications.yaml, research.yaml, prose/about.md
  content.config.ts  schemas for the above — a typo in the YAML fails the build
  data/site.ts       identity, links, navigation
  layouts/Base.astro <head>, SEO tags, JSON-LD, header, footer, scroll-reveal
  lib/               sorting and link helpers, base-path-safe url()
  pages/             index, publications, research, about, 404
  scripts/motion.ts  the shared animation loop
  styles/global.css  colour, type scale, grid, the disc motif
scripts/             dev helpers: screenshots, layout checks, OG image
```

### The design system in one paragraph

Cream (`#f4ecdb`) surfaces, near-black (`#1f1d19`) text, and three accents used as large flat
fields rather than sprinkled details: persimmon, gold, cobalt. Type is Archivo (self-hosted
variable grotesk) with Instrument Serif italic for venue names and the research questions.
Everything sits on a 12-column grid with hairline rules instead of cards or shadows. The one
repeated shape is the circle — the O in "Jo", the discs in the hero mobile, the nav's current-page
dot, the portrait, the cropped arcs in the footer.

### Motion

All of it runs through `src/scripts/motion.ts`: a single `requestAnimationFrame` loop that stops
as soon as everything has settled. Two things respond to the pointer — the disc inside the O
leans a few pixels toward it, and the mobile's arms sway by up to three degrees. Both are damped
springs, both are disabled when `prefers-reduced-motion: reduce` is set or when there is no fine
pointer (so: nothing moves on touch devices). Sections fade in once as they scroll into view, and
that is the entire animation budget.

Everything readable is readable without hovering, without JavaScript, and without pointer input.
The hero mobile is a second way into the research areas, never the only way.

### Development helpers

```bash
node scripts/shots.mjs   http://localhost:4322   # page screenshots at four widths
node scripts/crops.mjs   http://localhost:4322   # full-resolution crops of single sections
node scripts/checks.mjs  http://localhost:4322   # horizontal overflow / alt text / h1 checks
node scripts/make-og.mjs                         # regenerate the share image and touch icon
```

They need a running `npm run preview` and a browser: `npx playwright install chromium`. The CI
build skips that download, so deploys stay fast.
