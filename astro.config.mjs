// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// This repo is a GitHub *user* site (nathanaj99.github.io), so it is served from
// the domain root and needs no `base` path. If the site is ever moved into a
// project repo, set `base: '/repo-name'` here and nothing else has to change:
// every internal link in the site is built with the `url()` helper in src/lib/url.ts.
export default defineConfig({
  site: 'https://nathanaeljo.com',
  base: '/',
  trailingSlash: 'ignore',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
});
