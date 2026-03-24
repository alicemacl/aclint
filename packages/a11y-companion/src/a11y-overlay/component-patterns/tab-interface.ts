import type { ComponentPattern } from './types';

export const tabInterfacePattern: ComponentPattern = {
  id: 'tab-interface',
  name: 'Tab list structure',
  description: 'Tab widgets need tabs, tablist, and tabpanels with correct ARIA.',
  matches: (element) => element.getAttribute('role') === 'tablist',
  expectations: [
    {
      id: 'has-tabs',
      check: (el) => {
        const tabs = el.querySelectorAll('[role="tab"]');
        return tabs.length > 0;
      },
      message: 'tablist has no tab children',
      suggestion: 'Add elements with role="tab" inside the tablist.',
      severity: 'critical',
      learnMore: 'https://www.w3.org/WAI/ARIA/apg/patterns/tabs/',
    },
    {
      id: 'tabs-selected',
      check: (el) => {
        const tabs = el.querySelectorAll<HTMLElement>('[role="tab"]');
        if (tabs.length === 0) return true;
        return Array.from(tabs).some((t) => t.getAttribute('aria-selected') === 'true');
      },
      message: 'No tab is marked selected',
      suggestion: 'Set aria-selected="true" on the active tab and "false" on others.',
      severity: 'serious',
      learnMore: 'https://www.w3.org/WAI/ARIA/apg/patterns/tabs/',
    },
  ],
};
