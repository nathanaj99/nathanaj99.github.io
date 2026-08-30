const BASE = import.meta.env.BASE_URL || '/';

/**
 * Build an internal URL that survives a change of `base` in astro.config.mjs.
 * External URLs, mailto:, and bare hashes pass through untouched.
 */
export function url(path: string): string {
  if (!path) return BASE;
  if (/^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(path)) return path;
  const base = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
  const rest = path.startsWith('/') ? path : `/${path}`;
  return `${base}${rest}` || '/';
}

/** True when `href` is the page currently being rendered. */
export function isCurrent(pathname: string, href: string): boolean {
  const strip = (p: string) => {
    const withoutBase =
      BASE !== '/' && p.startsWith(BASE) ? p.slice(BASE.length - 1) : p;
    return withoutBase.replace(/\/+$/, '') || '/';
  };
  return strip(pathname) === strip(href);
}
