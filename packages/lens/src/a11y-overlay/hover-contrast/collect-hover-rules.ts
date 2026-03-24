/**
 * Walk the CSSOM to find :hover style overrides that apply to a given element.
 *
 * Returns the color / background-color values that would take effect on hover.
 * Only considers direct hover (the element itself matches the non-:hover part
 * of the selector) and ancestor hover (a parent matches the :hover part while
 * a descendant selector targets the element).
 */

export type HoverStyles = {
  color?: string;
  backgroundColor?: string;
};

function stripHover(selector: string): string {
  return selector.replace(/:hover/g, '');
}

/**
 * Test whether `element` would match a given CSS selector stripped of :hover.
 */
function matchesSafe(element: HTMLElement, selector: string): boolean {
  try {
    return element.matches(selector);
  } catch {
    return false;
  }
}

export function collectHoverStyles(element: HTMLElement): HoverStyles {
  const result: HoverStyles = {};

  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      continue;
    }

    scanRules(rules, element, result);
  }

  return result;
}

function scanRules(
  rules: CSSRuleList,
  element: HTMLElement,
  out: HoverStyles,
): void {
  for (const rule of Array.from(rules)) {
    if (rule instanceof CSSMediaRule || rule instanceof CSSSupportsRule) {
      scanRules(rule.cssRules, element, out);
      continue;
    }

    if (!(rule instanceof CSSStyleRule)) continue;

    const selectorText = rule.selectorText;
    if (!selectorText.includes(':hover')) continue;

    const parts = selectorText.split(',');
    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed.includes(':hover')) continue;

      const withoutHover = stripHover(trimmed);
      if (!matchesSafe(element, withoutHover)) continue;

      if (rule.style.color) {
        out.color = rule.style.color;
      }
      if (rule.style.backgroundColor) {
        out.backgroundColor = rule.style.backgroundColor;
      }
    }
  }
}
