/**
 * Composite widget focus: aria-activedescendant sync and related guards.
 */

export const COMPOSITE_NAVIGATION_KEYS = new Set([
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
  'PageUp',
  'PageDown',
]);

/**
 * Resolve the element the user experiences as "focused" in composites.
 */
export function getEffectiveFocusTarget(focused: HTMLElement): HTMLElement {
  let node: HTMLElement | null = focused;
  let depth = 0;
  while (node && node !== document.body && depth < 12) {
    const idRaw = node.getAttribute('aria-activedescendant');
    if (idRaw?.trim()) {
      const byId = document.getElementById(idRaw.trim());
      if (byId instanceof HTMLElement) {
        return byId;
      }
    }
    node = node.parentElement;
    depth++;
  }
  return focused;
}

export function isInsideA11yPanel(element: HTMLElement): boolean {
  return element.closest('[data-a11y-panel]') !== null;
}

/** Arrow keys in these controls move the caret / value, not a composite highlight. */
export function isTextEntryElement(element: HTMLElement): boolean {
  if (element instanceof HTMLTextAreaElement) return true;
  if (element.isContentEditable) return true;
  if (element instanceof HTMLInputElement) {
    const type = element.type;
    return (
      type === 'text' ||
      type === 'search' ||
      type === 'email' ||
      type === 'url' ||
      type === 'tel' ||
      type === 'password' ||
      type === '' ||
      type === 'number'
    );
  }
  return false;
}
