import type { AssistantRule } from './types';

export const linkPurposeRule: AssistantRule = {
  id: 'link-purpose',
  axeRuleIds: ['link-in-text-block'],
  severity: 'info',
  category: 'advanced',
  summary: 'Link purpose may be unclear from context',
  explanation:
    'Links should be understandable on their own or with surrounding context. Screen reader users often navigate by listing all links, so generic link text provides no useful information.',
  fixGuidance: {
    whatToDo: `Make link text descriptive and meaningful:
- Use descriptive link text that explains the destination
- Avoid generic text like "click here", "read more", or "learn more"
- If the same text is used for multiple links, use aria-label to differentiate`,
    codeExample: `<!-- Good - descriptive link text -->
<a href="/pricing">View pricing plans</a>

<!-- Good - context from surrounding text -->
<p>Learn about our <a href="/features">product features</a>.</p>

<!-- Bad - generic link text -->
<a href="/pricing">Click here</a>`,
    commonMistakes: [
      'Using "click here" as link text',
      'Multiple "read more" links without differentiation',
      'Link text that only makes sense with visual context',
    ],
  },
  voiceOverTest: {
    goal: 'Ensure links are understandable when listed in isolation',
    steps: [
      'Enable VoiceOver (Cmd + F5)',
      'Open the rotor with VO + U',
      'Navigate to Links using Left/Right arrows',
      'Review the list of links',
    ],
    expectedOutput: 'Each link text clearly indicates its purpose or destination.',
  },
};
