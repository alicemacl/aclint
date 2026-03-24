import { FOCUSABLE_SELECTOR } from '../focus-tracking/focusable-elements';
import type { ComponentPattern } from './types';

export const dialogFocusPattern: ComponentPattern = {
  id: 'dialog-focus',
  name: 'Dialog / modal focus',
  description: 'Modal dialogs should trap focus and move focus inside when opened.',
  matches: (element) => {
    const role = element.getAttribute('role');
    const modal = element.getAttribute('aria-modal');
    return role === 'dialog' || role === 'alertdialog' || modal === 'true';
  },
  expectations: [
    {
      id: 'focusable-descendant',
      check: (el) => {
        const focusable = el.querySelector(FOCUSABLE_SELECTOR);
        return !!focusable;
      },
      message: 'Dialog has no focusable content',
      suggestion:
        'Ensure at least one focusable element exists inside the dialog when it is open, and move focus to it on open.',
      severity: 'serious',
      learnMore: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/',
    },
  ],
};
