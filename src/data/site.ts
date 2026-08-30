/**
 * Everything about the person and the site that is not a publication, a
 * research area, or long-form prose. This is the file to edit for links,
 * affiliations, and the short homepage bio.
 */

export const site = {
  /**
   * Portrait motif. Flip this to compare treatments:
   * - `swiss` — hairline construction ring + persimmon disc
   * - `plate` — ink-light stroke + hard offset silhouette
   */
  portraitMotif: 'plate' as 'swiss' | 'plate',

  name: 'Nathanael Jo',
  /** Used in the nav mark and the footer: the "J" plus the disc. */
  shortName: 'Jo',
  /** Long form, used on the bio page and in the structured data. */
  role: 'PhD Student, Computer Science',
  /** Short form, used under the name in the hero and in the footer. */
  roleLine: 'PhD Student @ MIT EECS',
  affiliation: 'MIT',
  affiliationUrl: 'https://lids.mit.edu/',
  email: 'nathanjo@mit.edu',

  /** Two lines, hero. The one thing a visitor should leave with. */
  statement:
    'I study how people interact with AI systems, and use those insights to ask how AI should be designed and evaluated.',

  /** Opens the research section on the homepage and the /research page. */
  researchStatement:
    'I study the societal impacts of AI: how people behave when they work with these systems, what our evaluations of them actually measure, and how institutions should deploy them.',

  /** Homepage "About" section. The full bio lives in src/content/prose/about.md. */
  bioShort: [
    "I'm a PhD student in computer science at MIT, advised by Manish Raghavan and Ashia Wilson. My work sits at the intersection of machine learning and economics: I develop models of how people interact with AI systems, and of the mechanisms behind those interactions.",
    'Before MIT I was a research fellow at the Regulation, Evaluation, and Governance Lab (RegLab) at Stanford with Dan Ho, and a researcher at the USC Center for AI in Society with Phebe Vayanos.',
  ],

  seo: {
    title: 'Nathanael Jo',
    description:
      'Nathanael Jo is a PhD student in computer science at MIT studying the societal impacts of AI: how people interact with AI systems, what evaluations measure, and how algorithmic decisions should be governed.',
    keywords: [
      'Nathanael Jo',
      'Nathan Jo',
      'nathanaeljo',
      'MIT',
      'Stanford',
      'USC',
      'human-AI interaction',
      'AI evaluation',
      'AI governance',
      'algorithmic fairness',
      'machine learning',
      'economics',
    ],
    /** Open Graph image in /public. */
    image: '/og-image.png',
  },

  /** Ordered; `primary: true` links also appear under the hero. */
  links: [
    { label: 'Email', href: 'mailto:nathanjo@mit.edu', primary: true, external: false },
    {
      label: 'Google Scholar',
      href: 'https://scholar.google.com/citations?user=oBcEJDUAAAAJ',
      primary: true,
      external: true,
    },
    { label: 'GitHub', href: 'https://github.com/nathanaj99', primary: true, external: true },
    { label: 'CV', href: '/cv.pdf', primary: false, external: true },
    { label: 'X', href: 'https://twitter.com/NathanaelJo2', primary: false, external: true },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/nathanaeljo',
      primary: false,
      external: true,
    },
  ],

  nav: [
    { label: 'Research', href: '/research', external: false },
    { label: 'Bio', href: '/bio', external: false },
    { label: 'CV', href: '/cv.pdf', external: true },
  ],

  /** About page: where I've been. Years are only listed where they are known. */
  positions: [
    {
      role: 'PhD Student, Computer Science',
      org: 'Massachusetts Institute of Technology',
      orgUrl: 'https://lids.mit.edu/',
      detail: 'Advised by Manish Raghavan and Ashia Wilson',
      period: 'Current',
    },
    {
      role: 'Research Fellow',
      org: 'Regulation, Evaluation, and Governance Lab (RegLab), Stanford University',
      orgUrl: 'https://reglab.stanford.edu/',
      detail: 'Advised by Dan Ho',
      period: 'Previously',
    },
    {
      role: 'Researcher',
      org: 'Center for AI in Society, University of Southern California',
      orgUrl: 'https://cais.usc.edu/',
      detail: 'With Phebe Vayanos',
      period: 'Previously',
    },
  ],

  education: [
    {
      degree: 'MS, Data Science',
      org: 'University of Southern California',
      year: '2021',
    },
    {
      degree: 'BS, Applied Mathematics',
      org: 'University of Southern California',
      year: '2021',
    },
  ],

  contactNote: 'Feel free to reach out to me via email!',
} as const;

export type SiteLink = (typeof site.links)[number];
