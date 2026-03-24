import type { ComponentPattern } from './types';
import { isPlaceholderHref } from './utils';

export const linkAsTriggerPattern: ComponentPattern = {
  id: 'link-as-trigger',
  name: 'Link used as interactive trigger',
  description:
    'A link that behaves like a button (dropdown, disclosure) should usually be a button for predictable keyboard and screen reader behavior.',
  matches: (element) => {
    if (element.tagName !== 'A') return false;
    const href = element.getAttribute('href');
    if (element.hasAttribute('aria-expanded')) return true;
    if (element.hasAttribute('aria-haspopup')) return true;
    if (isPlaceholderHref(href)) return true;
    return false;
  },
  expectations: [
    {
      id: 'prefer-button',
      check: (el) => {
        if (el.tagName !== 'A') return true;
        const isTriggerLike =
          el.hasAttribute('aria-expanded') ||
          el.hasAttribute('aria-haspopup') ||
          isPlaceholderHref(el.getAttribute('href'));
        return !isTriggerLike;
      },
      message: 'This anchor looks like a trigger (not navigation)',
      suggestion:
        'Use <button type="button"> with aria-expanded / aria-haspopup when opening panels or menus. Reserve <a href="..."> for real navigations.',
      severity: 'serious',
      learnMore: 'https://www.w3.org/WAI/ARIA/apg/patterns/',
    },
  ],
};
