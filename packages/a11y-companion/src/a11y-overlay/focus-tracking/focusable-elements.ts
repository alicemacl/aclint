/**
 * Focusable selector and query (shared with pattern checks).
 */

export const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(', ');

/**
 * Get all focusable elements on the page.
 */
export function getFocusableElements(): HTMLElement[] {
  const elements = Array.from(document.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

  return elements.filter((el) => {
    if (el.offsetParent === null && el.tagName !== 'BODY') return false;
    if (el.closest('[data-a11y-panel]')) return false;
    return true;
  });
}
