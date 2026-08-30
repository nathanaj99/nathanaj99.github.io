import type { CollectionEntry } from 'astro:content';

export type Publication = CollectionEntry<'publications'>;
export type PublicationData = Publication['data'];

/** Working papers first, then conference, then journal — as in the old bib file. */
const TYPE_RANK: Record<PublicationData['type'], number> = {
  'working-paper': 0,
  conference: 1,
  journal: 2,
};

export const TYPE_LABEL: Record<PublicationData['type'], string> = {
  'working-paper': 'Working paper',
  conference: 'Conference paper',
  journal: 'Journal article',
};

export const TYPE_LABEL_PLURAL: Record<PublicationData['type'], string> = {
  'working-paper': 'Working papers',
  conference: 'Conference papers',
  journal: 'Journal articles',
};

/** Year desc → type → month desc → title. Deterministic, so builds are stable. */
export function sortPublications(entries: Publication[]): Publication[] {
  return [...entries].sort((a, b) => {
    if (a.data.year !== b.data.year) return b.data.year - a.data.year;
    const rank = TYPE_RANK[a.data.type] - TYPE_RANK[b.data.type];
    if (rank !== 0) return rank;
    const month = (b.data.month ?? 0) - (a.data.month ?? 0);
    if (month !== 0) return month;
    return a.data.title.localeCompare(b.data.title);
  });
}

export function groupByYear(entries: Publication[]) {
  const sorted = sortPublications(entries);
  const years: { year: number; items: Publication[] }[] = [];
  for (const entry of sorted) {
    const last = years.at(-1);
    if (last && last.year === entry.data.year) last.items.push(entry);
    else years.push({ year: entry.data.year, items: [entry] });
  }
  return years;
}

export function countByType(entries: Publication[]) {
  const counts = new Map<PublicationData['type'], number>();
  for (const entry of entries) {
    counts.set(entry.data.type, (counts.get(entry.data.type) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => TYPE_RANK[a[0]] - TYPE_RANK[b[0]])
    .map(([type, count]) => ({ type, count, label: TYPE_LABEL_PLURAL[type] }));
}

export interface PaperLink {
  label: string;
  href: string;
}

/** Ordered link list for a paper. Only what exists is returned. */
export function paperLinks(data: PublicationData): PaperLink[] {
  const links: PaperLink[] = [];
  if (data.links.html) links.push({ label: 'Paper', href: data.links.html });
  if (data.links.arxiv)
    links.push({ label: 'arXiv', href: `https://arxiv.org/abs/${data.links.arxiv}` });
  if (data.links.pdf) links.push({ label: 'PDF', href: data.links.pdf });
  if (data.links.code) links.push({ label: 'Code', href: data.links.code });
  return links;
}

/** Where a whole row should point when it is clicked. */
export function primaryHref(data: PublicationData): string | undefined {
  return paperLinks(data)[0]?.href;
}

/** Marks which author is the site owner, so the name can be emphasised. */
export function authorParts(authors: readonly string[], self: string) {
  const selfLast = self.split(' ').at(-1);
  return authors.map((name) => ({
    name,
    isSelf: name === self || (!!selfLast && name.endsWith(selfLast) && name.startsWith('Nathanael')),
  }));
}

/** "NeurIPS · 2025", "Working paper · 2026" — the one-line provenance. */
export function venueLine(data: PublicationData): string {
  const venue = data.venueShort ?? data.venue ?? data.status;
  return [venue, data.year].filter(Boolean).join(' · ');
}
