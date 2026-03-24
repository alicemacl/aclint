import { hasAccessibleName } from '../accessible-name-quick';
import type { ComponentPattern } from './types';

export const fakeButtonPattern: ComponentPattern = {
  id: 'fake-button',
  name: 'Non-button element acting as button',
  description: 'Clickable divs/spans need keyboard support and an accessible role.',
  matches: (element) => {
    const tag = element.tagName;
    if (tag === 'BUTTON' || tag === 'A' || tag === 'INPUT') return false;
    if (element.getAttribute('role') === 'button') return true;
    if (element.hasAttribute('onclick')) return true;
    return false;
  },
  expectations: [
    {
      id: 'tabindex',
      check: (el) => {
        if (el.tagName === 'BUTTON' || el.tagName === 'A') return true;
        const tab = el.getAttribute('tabindex');
        return tab !== null && tab !== '-1';
      },
      message: 'Custom control may not be keyboard-focusable',
      suggestion:
        'Add tabindex="0" and role="button", and handle Enter/Space. Better: use a real <button>.',
      severity: 'serious',
      learnMore: 'https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/',
    },
    {
      id: 'name',
      check: (el) => hasAccessibleName(el),
      message: 'Custom control needs an accessible name',
      suggestion: 'Add visible text, aria-label, or aria-labelledby.',
      severity: 'critical',
      learnMore: 'https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html',
    },
  ],
};
