export function isPlaceholderHref(href: string | null): boolean {
  if (!href) return true;
  const h = href.trim().toLowerCase();
  return h === '#' || h === '#!' || h.startsWith('javascript:') || h === '';
}
