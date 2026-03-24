import type { AssistantRule } from './types';

export const keyboardAccessibilityRule: AssistantRule = {
  id: 'keyboard-accessibility',
  axeRuleIds: ['scrollable-region-focusable', 'nested-interactive'],
  severity: 'critical',
  category: 'keyboard',
  summary: 'Interactive element is not keyboard accessible',
  explanation:
    'Keyboard users must be able to access and operate all interactive elements. If a clickable element cannot receive focus, keyboard users cannot activate it.',
  fixGuidance: {
    whatToDo: `Ensure interactive elements are focusable and operable with keyboard:
- Use native interactive elements (<button>, <a>, <input>) when possible
- If using a non-interactive element, add tabindex="0" and role
- Handle both click and keydown (Enter/Space) events
- Never use tabindex > 0`,
    codeExample: `<!-- Preferred: use native elements -->
<button onClick={handleClick}>Click me</button>

<!-- If you must use a div -->
<div
  role="button"
  tabindex="0"
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
>
  Click me
</div>`,
    commonMistakes: [
      'Using div or span with onClick but no keyboard support',
      'Forgetting to add tabindex to custom interactive elements',
      'Missing keyboard event handlers (Enter/Space)',
      'Using tabindex values greater than 0',
    ],
  },
  voiceOverTest: {
    goal: 'Ensure the element is reachable and operable with keyboard alone',
    steps: [
      'Put away your mouse',
      'Press Tab to navigate through the page',
      'Verify you can reach the interactive element',
      'Press Enter or Space to activate it',
    ],
    expectedOutput: 'Element receives visible focus, activates on Enter/Space.',
  },
};
