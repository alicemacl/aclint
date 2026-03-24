import type { AssistantRule } from './types';

export const focusVisibilityRule: AssistantRule = {
  id: 'focus-visibility',
  axeRuleIds: ['focus-order-semantics'],
  severity: 'critical',
  category: 'keyboard',
  summary: 'Focus indicator is not visible',
  explanation:
    'Keyboard users need visible focus indicators to understand which element is currently active. Without a clear focus state, users cannot navigate the page effectively.',
  fixGuidance: {
    whatToDo: `Ensure all interactive elements have a visible focus indicator:
- Do not remove outline styles without providing an alternative
- Use :focus-visible for keyboard-only focus styles
- Ensure focus indicator has sufficient contrast (3:1 ratio)`,
    codeExample: `/* Good - visible focus indicator */
button:focus-visible {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* Bad - removing focus without alternative */
button:focus {
  outline: none; /* Never do this without replacement */
}`,
    commonMistakes: [
      'Using outline: none without an alternative focus style',
      'Focus indicator with insufficient contrast',
      'Focus indicator that is too subtle or thin',
    ],
  },
  voiceOverTest: {
    goal: 'Ensure keyboard users can see which element is focused',
    steps: [
      'Disable your mouse or trackpad',
      'Use Tab to navigate through interactive elements',
      'Observe if each element shows a clear focus indicator',
    ],
    expectedOutput: 'Each interactive element shows a clear, visible focus ring when tabbed to.',
  },
};
