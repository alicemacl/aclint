import type { AssistantRule } from './types';

export const disabledFocusableRule: AssistantRule = {
  id: 'disabled-focusable',
  axeRuleIds: ['aria-hidden-focus'],
  severity: 'warning',
  category: 'keyboard',
  summary: 'Disabled element is still focusable',
  explanation:
    'Elements that appear disabled but remain focusable create confusion for keyboard users. Disabled elements should be removed from the tab order entirely.',
  fixGuidance: {
    whatToDo: `Ensure disabled elements are not focusable:
- Use the disabled attribute on form controls (removes from tab order)
- Use aria-disabled="true" with tabindex="-1" for custom components
- Do not rely on visual styling alone to indicate disabled state`,
    codeExample: `<!-- Good - native disabled removes from tab order -->
<button disabled>Submit</button>

<!-- Good - custom disabled with tabindex -->
<div role="button" aria-disabled="true" tabindex="-1">
  Submit
</div>

<!-- Bad - visually disabled but still focusable -->
<button class="disabled-looking" aria-disabled="true">
  Submit
</button>`,
    commonMistakes: [
      'Using aria-disabled without removing from tab order',
      'Styling elements as disabled without using the disabled attribute',
      'Keeping disabled elements in the tab sequence',
    ],
  },
  voiceOverTest: {
    goal: 'Ensure disabled elements cannot be focused',
    steps: [
      'Identify any disabled-looking elements on the page',
      'Use Tab to navigate through the page',
      'Verify that disabled elements are skipped',
    ],
    expectedOutput: 'Disabled elements are skipped when tabbing through the page.',
  },
};
