import type { AssistantRule } from './types';

export const colorContrastRule: AssistantRule = {
  id: 'color-contrast',
  axeRuleIds: ['color-contrast', 'color-contrast-enhanced'],
  severity: 'warning',
  category: 'visual',
  summary: 'Text has insufficient color contrast',
  explanation:
    'Low contrast text is difficult to read for users with low vision, color blindness, or anyone in bright lighting. WCAG requires a minimum contrast ratio of 4.5:1 for normal text.',
  fixGuidance: {
    whatToDo: `Ensure text meets minimum contrast requirements:
- Normal text (< 18pt or < 14pt bold): 4.5:1 ratio
- Large text (≥ 18pt or ≥ 14pt bold): 3:1 ratio
- UI components and graphical objects: 3:1 ratio
- Use a contrast checker tool to verify ratios`,
    codeExample: `/* Good - sufficient contrast */
.text-primary {
  color: #333333; /* 12.6:1 on white */
}

/* Bad - insufficient contrast */
.text-light {
  color: #999999; /* 2.8:1 on white - fails */
}`,
    commonMistakes: [
      'Using light gray text on white backgrounds',
      'Not checking contrast for hover/focus states',
      'Assuming brand colors meet contrast requirements',
      'Forgetting to check contrast in dark mode',
    ],
  },
  voiceOverTest: {
    goal: 'Verify text is readable for users with low vision',
    steps: [
      'Use a contrast checker browser extension',
      'Scan the page for elements with low contrast',
      'Check text on images and gradient backgrounds',
    ],
    expectedOutput: 'All text meets the minimum contrast ratio for its size.',
  },
};
