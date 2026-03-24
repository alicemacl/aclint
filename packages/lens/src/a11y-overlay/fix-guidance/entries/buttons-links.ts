import type { FixGuidance } from '../types';

export const buttonsLinksEntries: Record<string, FixGuidance> = {
  'button-name': {
    title: 'Button has no label',
    why: "Screen readers can't tell users what this button does. They'll just hear \"button\" with no context.",
    fix: 'Add visible text inside the button. If the button only has an icon, add aria-label to describe what it does.',
    codeExample: `<!-- With visible text -->
<button>Save changes</button>

<!-- Icon-only button -->
<button aria-label="Close dialog">
  <IconX />
</button>`,
    avoid: [
      "Don't use title attribute - it's not announced by all screen readers",
      "Don't rely on placeholder text or visual cues alone",
    ],
    voiceOver: {
      goal: 'Verify the button announces its purpose when focused',
      steps: [
        'Press Cmd + F5 to start VoiceOver',
        'Press Tab until you reach this button',
        'Listen to what VoiceOver announces',
      ],
      expect: 'You should hear the button\'s purpose, like "Save changes, button"',
    },
  },

  'link-name': {
    title: 'Link has no label',
    why: "Screen readers can't describe where this link goes. Users won't know what happens when they click it.",
    fix: 'Add descriptive text inside the link. Avoid generic text like "click here" or "read more".',
    codeExample: `<!-- Good: Descriptive link text -->
<a href="/pricing">View pricing plans</a>

<!-- Icon link with label -->
<a href="/settings" aria-label="Account settings">
  <IconSettings />
</a>`,
    avoid: [
      'Avoid "click here", "read more", "learn more" without context',
      "Don't use the URL as the link text",
    ],
    voiceOver: {
      goal: 'Verify the link describes its destination',
      steps: [
        'Press Cmd + F5 to start VoiceOver',
        'Press Tab until you reach this link',
        'Listen to what VoiceOver announces',
      ],
      expect: 'You should hear where the link goes, like "View pricing plans, link"',
    },
  },

  'nested-interactive': {
    title: 'Interactive elements are nested',
    why: 'A button inside a link (or vice versa) confuses assistive technology. The behavior is unpredictable.',
    fix: 'Restructure so interactive elements are not nested. Use CSS to achieve the visual layout.',
    codeExample: `<!-- Wrong: Button inside link -->
<a href="/product">
  <button>Add to cart</button>
</a>

<!-- Correct: Separate elements -->
<a href="/product">View product</a>
<button>Add to cart</button>`,
  },

  'link-in-text-block': {
    title: 'Link not distinguishable from text',
    why: "Users can't tell this is a link without hovering. Color alone is not enough.",
    fix: 'Add an underline or other visual indicator besides color.',
    codeExample: `/* Links should be underlined or otherwise distinguishable */
a {
  color: #0066cc;
  text-decoration: underline;
}`,
  },
};
