import type { AssistantRule } from './types';

export const ariaValidRule: AssistantRule = {
  id: 'aria-valid',
  axeRuleIds: [
    'aria-valid-attr',
    'aria-valid-attr-value',
    'aria-allowed-attr',
    'aria-required-attr',
    'aria-roles',
  ],
  severity: 'warning',
  category: 'advanced',
  summary: 'Invalid or misused ARIA attribute',
  explanation:
    'ARIA attributes must be valid and correctly applied. Invalid ARIA can break assistive technology support entirely, making elements unusable for screen reader users.',
  fixGuidance: {
    whatToDo: `Ensure all ARIA attributes are valid:
- Use only valid ARIA attribute names (check spelling)
- Use allowed values for each attribute
- Include all required attributes for the role
- Prefer native HTML elements over ARIA when possible`,
    codeExample: `<!-- Good - valid ARIA usage -->
<div role="dialog" aria-labelledby="dialog-title" aria-modal="true">
  <h2 id="dialog-title">Confirm Action</h2>
</div>

<!-- Bad - invalid attribute value -->
<div role="button" aria-pressed="maybe">Toggle</div>

<!-- Prefer native elements when possible -->
<button>Submit</button> <!-- Better than div role="button" -->`,
    commonMistakes: [
      'Typos in ARIA attribute names (aria-lable vs aria-label)',
      'Invalid values (aria-pressed="maybe" instead of true/false)',
      'Missing required attributes for complex roles',
      'Using ARIA when native HTML would work better',
    ],
  },
  voiceOverTest: {
    goal: 'Ensure ARIA attributes are correctly interpreted',
    steps: [
      'Enable VoiceOver (Cmd + F5)',
      'Navigate to elements with ARIA attributes',
      'Listen for correct role and state announcements',
    ],
    expectedOutput: 'VoiceOver announces roles and states correctly.',
  },
};
