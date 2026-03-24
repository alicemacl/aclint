import type { ComponentPattern } from './types';

export const disclosureTriggerPattern: ComponentPattern = {
  id: 'disclosure-trigger',
  name: 'Disclosure / expandable trigger',
  description: 'Elements that expand content should expose state and use an appropriate role.',
  matches: (element) => {
    const tag = element.tagName;
    const explicit = element.getAttribute('role');
    if (explicit === 'combobox' || explicit === 'searchbox' || explicit === 'textbox') {
      return false;
    }
    if (tag === 'BUTTON' || tag === 'A' || explicit === 'button' || explicit === 'link') {
      return element.hasAttribute('aria-expanded') || element.hasAttribute('aria-controls');
    }
    return false;
  },
  expectations: [
    {
      id: 'role-button',
      check: (el) => {
        const role = el.getAttribute('role');
        const tag = el.tagName;
        if (tag === 'BUTTON') return true;
        if (role === 'button') return true;
        return false;
      },
      message: 'Expandable control should be a button (or role="button")',
      suggestion:
        'Prefer <button> for controls that show/hide content. Links with aria-expanded confuse users expecting navigation.',
      severity: 'moderate',
      learnMore: 'https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/',
    },
    {
      id: 'has-controls',
      check: (el) => {
        if (!el.hasAttribute('aria-expanded')) return true;
        return el.hasAttribute('aria-controls');
      },
      message: 'aria-expanded is present but aria-controls is missing',
      suggestion: 'Add aria-controls pointing to the id of the panel you expand/collapse.',
      severity: 'moderate',
      learnMore: 'https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/',
    },
  ],
};
