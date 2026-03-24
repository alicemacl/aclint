import type { AssistantRule } from './types';

export const headingStructureRule: AssistantRule = {
  id: 'heading-structure',
  axeRuleIds: ['heading-order', 'empty-heading'],
  severity: 'warning',
  category: 'structure',
  summary: 'Heading structure is incorrect or incomplete',
  explanation:
    'Screen reader users navigate pages by headings using keyboard shortcuts. When heading levels are skipped (e.g., h1 → h3) or headings are empty, users lose their mental map of the page structure.',
  fixGuidance: {
    whatToDo: `Ensure headings follow a logical hierarchy:
- Start with a single h1 for the page title
- Use h2 for major sections, h3 for subsections, etc.
- Never skip levels (h2 → h4 is invalid)
- Every heading must have meaningful text content`,
    codeExample: `<!-- Correct heading structure -->
<h1>Page Title</h1>
  <h2>Section One</h2>
    <h3>Subsection</h3>
  <h2>Section Two</h2>

<!-- Wrong: skipped level -->
<h1>Page Title</h1>
  <h3>Subsection</h3>  <!-- Should be h2 -->`,
    commonMistakes: [
      'Skipping heading levels for visual styling (h1 → h3)',
      'Using headings just for font size/weight instead of structure',
      'Empty headings or headings with only whitespace',
      'Multiple h1 elements on the same page',
    ],
  },
  voiceOverTest: {
    goal: 'Verify screen reader users can navigate by headings',
    steps: [
      'Enable VoiceOver (Cmd + F5)',
      'Press VO + Cmd + H to jump to the next heading',
      'Continue pressing to move through all headings',
      'Open Rotor (VO + U) and navigate to Headings',
    ],
    expectedOutput:
      'VoiceOver announces each heading with its level and text, e.g. "Heading level 2, Section Title".',
  },
};
