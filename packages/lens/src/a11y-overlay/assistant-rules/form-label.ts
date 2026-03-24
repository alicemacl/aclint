import type { AssistantRule } from './types';

export const formLabelRule: AssistantRule = {
  id: 'form-label',
  axeRuleIds: ['label'],
  severity: 'critical',
  category: 'forms',
  summary: 'Form control is missing an accessible label',
  explanation:
    'Form controls must have an accessible label so screen reader users understand what information is required. Without a label, the input is announced without context.',
  fixGuidance: {
    whatToDo: `Associate a label with the form control using one of the following:
- <label for="...">
- Wrapping the input in <label>
- aria-label
- aria-labelledby`,
    codeExample: `<!-- Preferred -->
<label for="email">Email</label>
<input id="email" type="email" />

<!-- Also valid -->
<input aria-label="Email" type="email" />`,
    commonMistakes: [
      'Using placeholder text as a label',
      'Relying only on visual proximity',
      'Hiding labels without alternatives',
    ],
  },
  voiceOverTest: {
    goal: 'Ensure the input is announced with a clear label',
    steps: [
      'Enable VoiceOver (Cmd + F5)',
      'Navigate to the input using VO + Right Arrow',
      'Listen for label, role, and required state',
    ],
    expectedOutput: 'VoiceOver announces something like "Email, text field".',
  },
};
