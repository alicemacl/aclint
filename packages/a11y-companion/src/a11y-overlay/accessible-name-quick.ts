/**
 * Lightweight accessible-name check for heuristics (patterns, lint-style rules).
 * Not a full accname implementation — mirrors prior component-patterns behavior.
 */

export function hasAccessibleName(el: HTMLElement): boolean {
  if (el.getAttribute('aria-label')?.trim()) return true;
  if (el.getAttribute('aria-labelledby')) {
    const ids = el.getAttribute('aria-labelledby')!.split(/\s+/);
    return ids.some((id) => document.getElementById(id)?.textContent?.trim());
  }
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    if (el.id && document.querySelector(`label[for="${el.id}"]`)) return true;
  }
  if (el.textContent?.trim()) return true;
  if (el.querySelector('img[alt]')) return true;
  if (el.querySelector('[aria-label]')) return true;
  return false;
}
