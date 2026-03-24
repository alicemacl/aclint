/**
 * Determine whether an element is expected to respond to Space / Enter activation.
 */

const ACTIVATABLE_ROLES = new Set([
  'button',
  'link',
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
  'tab',
  'switch',
  'option',
  'treeitem',
  'combobox',
  'checkbox',
  'radio',
]);

const SUBMIT_INPUT_TYPES = new Set(['button', 'submit', 'reset', 'image']);

const TRIGGER_ATTRS = ['aria-expanded', 'aria-haspopup', 'aria-controls'];

export function isActivatable(element: HTMLElement): boolean {
  const role = element.getAttribute('role');
  if (role && ACTIVATABLE_ROLES.has(role)) return true;

  const tag = element.tagName;

  if (tag === 'BUTTON') return true;
  if (tag === 'A') return true;
  if (tag === 'SUMMARY') return true;

  if (tag === 'INPUT' && element instanceof HTMLInputElement) {
    return SUBMIT_INPUT_TYPES.has(element.type);
  }

  if (element.hasAttribute('onclick')) return true;

  if (TRIGGER_ATTRS.some((a) => element.hasAttribute(a))) return true;

  return false;
}
