import { FOCUSABLE_SELECTOR } from '../focus-tracking/focusable-elements';
import type { ComponentPattern } from './types';

export const focusTrapHeuristicPattern: ComponentPattern = {
  id: 'focus-trap-heuristic',
  name: 'Modal dialog focus surface',
  description:
    'Dialogs should expose enough focusable controls; full focus-trap behavior must be tested manually with Tab.',
  matches: (element) => !!element.closest('[aria-modal="true"]'),
  expectations: [
    {
      id: 'enough-focusables',
      check: (el) => {
        const modal = el.closest<HTMLElement>('[aria-modal="true"]');
        if (!modal) return true;
        const count = modal.querySelectorAll(FOCUSABLE_SELECTOR).length;
        return count >= 1;
      },
      message: 'Modal appears to have no focusable elements',
      suggestion:
        'Ensure the dialog contains focusable controls and that focus moves into the dialog when it opens. Test Tab / Shift+Tab to confirm focus stays within the modal.',
      severity: 'serious',
      learnMore: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/',
    },
  ],
};
