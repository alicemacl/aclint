import type { ComponentPattern } from './types';

export const missingLabelPattern: ComponentPattern = {
  id: 'missing-label',
  name: 'Form control labeling',
  description: 'Native inputs should be programmatically associated with a label.',
  matches: (element) => {
    if (!(element instanceof HTMLInputElement)) return false;
    const t = element.type;
    if (['hidden', 'button', 'submit', 'reset', 'image'].includes(t)) return false;
    return true;
  },
  expectations: [
    {
      id: 'labeled',
      check: (el) => {
        if (!(el instanceof HTMLInputElement)) return true;
        if (el.getAttribute('aria-label')?.trim()) return true;
        if (el.getAttribute('aria-labelledby')) return true;
        if (el.id && document.querySelector(`label[for="${el.id}"]`)) return true;
        return false;
      },
      message: 'Form control has no associated label',
      suggestion: 'Use <label for="id">, or aria-label / aria-labelledby.',
      severity: 'serious',
      learnMore: 'https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html',
    },
  ],
};
