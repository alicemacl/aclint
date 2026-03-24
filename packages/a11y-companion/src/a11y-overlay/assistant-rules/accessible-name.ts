import type { AssistantRule } from './types';

export const accessibleNameRule: AssistantRule = {
  id: 'accessible-name',
  axeRuleIds: ['button-name', 'link-name', 'aria-command-name', 'input-button-name'],
  severity: 'critical',
  category: 'controls',
  summary: 'Interactive element has no accessible name',
  explanation:
    'Screen reader users rely on accessible names to understand what a control does. If a button or link has no accessible name, it will be announced only as its role (e.g. "button"), which makes it unusable.',
  fixGuidance: {
    whatToDo: `Ensure the element has a meaningful accessible name. This can come from:
- Visible text
- A <label> associated with the control
- aria-label
- aria-labelledby`,
    codeExample: `<!-- Good -->
<button>Submit</button>

<!-- Also acceptable -->
<button aria-label="Submit form">
  <IconSend />
</button>`,
    commonMistakes: [
      'Using icons without accessible text',
      'Relying on placeholder text as a label',
      'Adding aria-label when visible text already exists',
    ],
  },
  voiceOverTest: {
    goal: 'Ensure the control is announced with a meaningful name',
    steps: [
      'Enable VoiceOver (Cmd + F5)',
      'Navigate to the element using VO + Right Arrow',
      'Listen to how VoiceOver announces the control',
    ],
    expectedOutput: 'VoiceOver announces a meaningful name followed by the role, e.g. "Submit, button".',
  },
};
