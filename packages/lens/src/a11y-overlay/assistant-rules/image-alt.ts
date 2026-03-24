import type { AssistantRule } from './types';

export const imageAltRule: AssistantRule = {
  id: 'image-alt',
  axeRuleIds: ['image-alt', 'input-image-alt', 'role-img-alt', 'svg-img-alt'],
  severity: 'critical',
  category: 'media',
  summary: 'Image is missing alternative text',
  explanation:
    'Images without alternative text are invisible to screen reader users. The alt attribute provides a text equivalent for visual content, allowing blind users to understand what the image conveys.',
  fixGuidance: {
    whatToDo: `Provide appropriate alternative text for all images:
- Describe the content or function of the image
- Keep alt text concise (typically under 125 characters)
- Use alt="" for purely decorative images
- For complex images, provide extended descriptions`,
    codeExample: `<!-- Informative image -->
<img src="chart.png" alt="Sales increased 40% in Q3 2024" />

<!-- Decorative image -->
<img src="decoration.png" alt="" />

<!-- Image as button -->
<button>
  <img src="search.svg" alt="Search" />
</button>`,
    commonMistakes: [
      'Leaving alt attribute empty for informative images',
      'Using "image of..." or "picture of..." (redundant)',
      'Writing alt text that is too long or verbose',
      'Using the filename as alt text',
    ],
  },
  voiceOverTest: {
    goal: 'Ensure images are announced with meaningful descriptions',
    steps: [
      'Enable VoiceOver (Cmd + F5)',
      'Navigate to images using VO + Right Arrow',
      'Listen to how VoiceOver announces each image',
    ],
    expectedOutput: 'VoiceOver announces meaningful descriptions, e.g. "Sales chart showing 40% growth, image".',
  },
};
