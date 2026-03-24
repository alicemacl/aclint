/**
 * When computed styles show "gradient as text fill" (background-clip: text, etc.),
 * engines compare a bogus solid `color` to the background — ratios are often wrong.
 * We skip showing AccessLint color-contrast hits for those elements (verify manually / pixel tools).
 */

function hasCssGradientBackground(s: CSSStyleDeclaration): boolean {
  const bg = s.backgroundImage;
  return !!bg && bg !== 'none' && /\b(?:linear|radial|conic)-gradient\s*\(/i.test(bg);
}

function isFullyTransparentColor(value: string): boolean {
  const v = value.trim().toLowerCase();
  if (v === 'transparent') return true;
  // rgba(..., 0) or rgb(... / 0)
  if (/\brgba?\([^)]*\/\s*0\s*\)/.test(v)) return true;
  if (/\brgba?\([^)]+,\s*0\s*\)\s*$/.test(v)) return true;
  return false;
}

/**
 * True when automated contrast (AccessLint / similar) is not trustworthy for this element.
 */
export function isAutomatedContrastUnreliable(element: HTMLElement): boolean {
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

export function isAccessLintColorContrastRule(ruleId: string): boolean {
  return (
    ruleId === 'distinguishable/color-contrast' ||
    ruleId === 'distinguishable/color-contrast-enhanced'
  );
}
