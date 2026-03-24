/**
 * WCAG 2.x contrast-ratio utilities.
 *
 * Resolves any CSS color string to linear-sRGB via a hidden probe element,
 * then applies the standard relative-luminance + contrast-ratio formulae.
 */

let probe: HTMLSpanElement | null = null;

function getProbe(): HTMLSpanElement {
  if (probe && probe.isConnected) return probe;
  probe = document.createElement('span');
  probe.style.cssText = 'position:fixed;visibility:hidden;pointer-events:none;';
  document.body.appendChild(probe);
  return probe;
}

type RGB = [r: number, g: number, b: number];

/**
 * Resolve any CSS color value to an [r,g,b] tuple (0-255) by assigning it to a
 * hidden element and reading back the computed value (always `rgb(…)` or `rgba(…)`).
 * Returns null for fully-transparent or unresolvable values.
 */
export function resolveCssColor(raw: string): RGB | null {
  if (!raw || raw === 'transparent' || raw === 'initial' || raw === 'inherit' || raw === 'currentColor') {
    return null;
  }

  const el = getProbe();
  el.style.color = '';
  el.style.color = raw;
  const resolved = getComputedStyle(el).color;
  if (!resolved) return null;

  const m = resolved.match(
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/,
  );
  if (!m) return null;

  const r = Number(m[1]);
  const g = Number(m[2]);
  const b = Number(m[3]);

  const a = resolved.match(/,\s*([\d.]+)\s*\)$/);
  if (a && Number(a[1]) === 0) return null;

  return [r, g, b];
}

function linearize(c8bit: number): number {
  const c = c8bit / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance([r, g, b]: RGB): number {
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/**
 * WCAG contrast ratio between two sRGB colors (returns value >= 1).
 */
export function contrastRatio(a: RGB, b: RGB): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

const LARGE_TEXT_BOLD_PX = 14 * (96 / 72); // 14pt → px

/**
 * Determine whether the element's text is "large" for WCAG purposes.
 */
export function isLargeText(element: HTMLElement): boolean {
  const s = getComputedStyle(element);
  const size = parseFloat(s.fontSize);
  if (size >= 24) return true;
  const weight = parseInt(s.fontWeight, 10);
  const isBold = weight >= 700 || s.fontWeight === 'bold' || s.fontWeight === 'bolder';
  return isBold && size >= LARGE_TEXT_BOLD_PX;
}

/**
 * Minimum contrast ratio for WCAG AA (4.5 for normal text, 3.0 for large text).
 */
export function wcagAAThreshold(element: HTMLElement): number {
  return isLargeText(element) ? 3.0 : 4.5;
}
