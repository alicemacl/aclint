import type { FixGuidance } from '../types';

export const ariaKeyboardDocumentEntries: Record<string, FixGuidance> = {
  'aria-valid-attr': {
    title: 'Invalid ARIA attribute',
    why: "This ARIA attribute doesn't exist. Screen readers will ignore it, so it's not doing what you think.",
    fix: 'Check the attribute name for typos. Use valid ARIA attributes from the specification.',
    codeExample: `<!-- Wrong -->
<button aria-labelled="Close">X</button>

<!-- Correct -->
<button aria-label="Close">X</button>`,
  },

  'aria-valid-attr-value': {
    title: 'Invalid ARIA value',
    why: 'This ARIA attribute has an invalid value. It may not work as expected with screen readers.',
    fix: 'Use a valid value for this ARIA attribute. Check the specification for allowed values.',
    codeExample: `<!-- Wrong -->
<div aria-hidden="yes">...</div>

<!-- Correct -->
<div aria-hidden="true">...</div>`,
  },

  'aria-allowed-attr': {
    title: 'ARIA attribute not allowed here',
    why: "This element's role doesn't support this ARIA attribute. It will be ignored.",
    fix: 'Remove the attribute or change the element/role to one that supports it.',
  },

  'scrollable-region-focusable': {
    title: 'Scrollable area not keyboard accessible',
    why: 'Keyboard users cannot scroll this content. They may miss important information.',
    fix: 'Add tabindex="0" to make the scrollable region focusable, or ensure content is accessible another way.',
    codeExample: `<div 
  class="scrollable"
  tabindex="0"
  role="region"
  aria-label="Code example"
>
  <!-- Scrollable content -->
</div>`,
    voiceOver: {
      goal: 'Verify keyboard users can scroll the content',
      steps: [
        'Press Tab to navigate to the scrollable area',
        'Use Arrow keys to scroll',
        'Verify you can access all content',
      ],
      expect: 'You should be able to scroll using the keyboard',
    },
  },

  'focus-visible': {
    title: 'Focus indicator not visible',
    why: 'Keyboard users cannot see where they are on the page. They may get lost.',
    fix: "Don't remove focus outlines. Style them to match your design, but keep them visible.",
    codeExample: `/* Don't do this */
*:focus { outline: none; }

/* Do this instead */
:focus-visible {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
}`,
    voiceOver: {
      goal: 'Verify focus is visible when tabbing',
      steps: [
        'Press Tab to move through interactive elements',
        'Look for a visible focus indicator on each element',
      ],
      expect: 'You should clearly see which element is focused',
    },
  },

  'document-title': {
    title: 'Page has no title',
    why: 'The browser tab and screen readers use the title to identify the page. Without it, navigation is harder.',
    fix: 'Add a descriptive <title> element in the <head>.',
    codeExample: `<head>
  <title>Products - My Store</title>
</head>`,
  },

  'html-has-lang': {
    title: 'Page language not set',
    why: 'Screen readers need to know the language to pronounce content correctly.',
    fix: 'Add a lang attribute to the <html> element.',
    codeExample: `<html lang="en">
  ...
</html>`,
  },
};
