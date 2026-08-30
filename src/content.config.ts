import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Publications live in a single YAML file so the whole bibliography can be
 * edited in one place (the way papers.bib used to work).
 */
const publications = defineCollection({
  loader: file('src/content/publications.yaml'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    authors: z.array(z.string()),
    year: z.number(),
    /** 1–12. Only used for ordering within a year. */
    month: z.number().min(1).max(12).optional(),
    type: z.enum(['working-paper', 'conference', 'journal']),
    /** Full venue name, e.g. "Advances in Neural Information Processing Systems". */
    venue: z.string().optional(),
    /** Short venue name used in tight columns, e.g. "NeurIPS". */
    venueShort: z.string().optional(),
    /** Free-form status, e.g. "Working paper", "Forthcoming". */
    status: z.string().optional(),
    links: z
      .object({
        arxiv: z.string().optional(),
        pdf: z.string().optional(),
        html: z.string().optional(),
        code: z.string().optional(),
      })
      .default({}),
    press: z.array(z.object({ name: z.string(), url: z.string() })).default([]),
    /** File in /public/figures, shown as a hover/focus preview. */
    figure: z.string().optional(),
    figureAlt: z.string().optional(),
    /** Surfaced in the "Selected work" section on the homepage. */
    selected: z.boolean().default(false),
    /** Ids from research.yaml. */
    themes: z.array(z.string()).default([]),
  }),
});

/** Research areas. Papers attach themselves to these via `themes`. */
const research = defineCollection({
  loader: file('src/content/research.yaml'),
  schema: z.object({
    id: z.string(),
    order: z.number(),
    title: z.string(),
    /** The one-line question that frames the area. */
    question: z.string(),
    summary: z.string(),
    accent: z.enum(['persimmon', 'gold', 'cobalt']),
    /** Short label for the hero mobile: one array item per line. */
    label: z.array(z.string()).min(1).max(2),
  }),
});

/** Long-form prose: the about page, and anything else narrative. */
const prose = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/prose' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { publications, research, prose };
