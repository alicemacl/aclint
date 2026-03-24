/**
 * Gradient text contrast false-positive filter.
 * Mirrors unreliable-contrast-context.ts from @aclint/lens.
 */

function hasCssGradientBackground(s: CSSStyleDeclaration): boolean {
  const bg = s.backgroundImage;
  return !!bg && bg !== 'none' && /\b(?:linear|radial|conic)-gradient\s*\(/i.test(bg);
}

function isFullyTransparentColor(value: string): boolean {
  const v = value.trim().toLowerCase();
  if (v === 'transparent') return true;
  if (/\brgba?\([^)]*\/\s*0\s*\)/.test(v)) return true;
  if (/\brgba?\([^)]+,\s*0\s*\)\s*$/.test(v)) return true;
  return false;
}

export function isContrastUnreliable(element: HTMLElement): boolean {
  const s = getComputedStyle(element);
  if (!hasCssGradientBackground(s)) return false;

  const clip = s.backgroundClip;
  const webkitClip = (s as CSSStyleDeclaration & { webkitBackgroundClip?: string })
    .webkitBackgroundClip;
  if (clip === 'text' || webkitClip === 'text') return true;

  const webkitFill = (s as CSSStyleDeclaration & { webkitTextFillColor?: string })
    .webkitTextFillColor;
  if (webkitFill && isFullyTransparentColor(webkitFill)) return true;

  if (isFullyTransparentColor(s.color)) return true;

  return false;
}
