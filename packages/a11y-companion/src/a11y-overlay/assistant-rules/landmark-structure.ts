import type { AssistantRule } from './types';

export const landmarkStructureRule: AssistantRule = {
  id: 'landmark-structure',
  axeRuleIds: ['landmark-one-main', 'landmark-no-duplicate-main', 'landmark-no-duplicate-banner', 'region'],
  severity: 'warning',
  category: 'structure',
  summary: 'Page has missing or incorrect landmark structure',
  explanation:
    'Landmarks help screen reader users navigate quickly to major sections of the page. Without proper landmarks, users must read through all content linearly.',
  fixGuidance: {
    whatToDo: `Ensure your page has proper landmark structure:
- Exactly one <main> element containing the primary content
- One <header> (banner) at the top level
- One <footer> (contentinfo) at the top level
- Use <nav> for navigation sections
- Wrap all visible content in landmarks`,
    codeExample: `<!-- Correct landmark structure -->
<body>
  <header>
    <nav aria-label="Main">...</nav>
  </header>
  
  <main>
    <h1>Page Title</h1>
    <!-- Primary content -->
  </main>
  
  <footer>
    <!-- Footer content -->
  </footer>
</body>`,
    commonMistakes: [
      'Multiple <main> elements on the same page',
      'Missing <main> element entirely',
      'Content outside of any landmark region',
      'Nesting <header> or <footer> inside <main>',
    ],
  },
  voiceOverTest: {
    goal: 'Verify screen reader users can navigate by landmarks',
    steps: [
      'Enable VoiceOver (Cmd + F5)',
      'Open the Rotor (VO + U)',
      'Navigate to the Landmarks section',
      'Review the list of landmarks',
    ],
    expectedOutput: 'Rotor shows landmarks: "banner", "main", "contentinfo".',
  },
};
