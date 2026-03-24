/**
 * Proactively check whether :hover styles on an element meet WCAG AA contrast.
 *
 * Walks the CSSOM for :hover overrides, resolves CSS values to RGB,
 * computes contrast, and returns a MappedIssue when it fails.
 */

import type { MappedIssue } from '../map-violations';
import { collectHoverStyles } from './collect-hover-rules';
import { contrastRatio, resolveCssColor, wcagAAThreshold } from './contrast-ratio';

export function checkHoverContrast(element: HTMLElement): MappedIssue | null {
  const hover = collectHoverStyles(element);
  if (!hover.color && !hover.backgroundColor) return null;

  const computed = getComputedStyle(element);

  const fgRaw = hover.color ?? computed.color;
  const bgRaw = hover.backgroundColor ?? computed.backgroundColor;

  const fg = resolveCssColor(fgRaw);
  const bg = resolveCssColor(bgRaw);
  if (!fg || !bg) return null;

  const ratio = contrastRatio(fg, bg);
  const threshold = wcagAAThreshold(element);
  if (ratio >= threshold) return null;

  const ratioStr = ratio.toFixed(2);

  return {
    id: 'hover-color-contrast',
    title: `Hover text contrast is ${ratioStr}:1 (needs ${threshold}:1)`,
    severity: ratio < 3 ? 'serious' : 'moderate',
    guidance: {
      why:
        'When the :hover style changes text or background color, the new combination must still meet WCAG AA contrast requirements. Low-contrast hover states make text unreadable for users with low vision.',
      fix:
        `Adjust the hover color or hover background so the contrast ratio is at least ${threshold}:1. Current hover foreground: ${fgRaw}; background: ${bgRaw}.`,
    },
    learnMoreUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html',
    axeHelp: `Hover color contrast ratio is ${ratioStr}:1`,
    axeDescription: 'Ensures hover state text has sufficient color contrast.',
    source: 'hover-contrast',
  };
}
