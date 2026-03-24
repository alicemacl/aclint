import type { FixGuidance } from '../types';

export const headingsLandmarksEntries: Record<string, FixGuidance> = {
  'heading-order': {
    title: 'Heading levels skip',
    why: 'Screen reader users navigate by headings. Skipping levels (like h1 to h3) breaks this navigation pattern.',
    fix: 'Use heading levels in order. Each page should have one h1, followed by h2s, then h3s under those, etc.',
    codeExample: `<!-- Correct heading structure -->
<h1>Product catalog</h1>
  <h2>Electronics</h2>
    <h3>Phones</h3>
    <h3>Laptops</h3>
  <h2>Clothing</h2>
    <h3>Men's</h3>`,
    avoid: [
      "Don't choose heading levels based on visual size - use CSS for styling",
      "Don't skip from h1 to h3",
    ],
    voiceOver: {
      goal: 'Verify the heading structure makes sense',
      steps: [
        'Press Cmd + F5 to start VoiceOver',
        'Press VO + Cmd + H repeatedly to navigate by headings',
        'Notice the heading levels announced',
      ],
      expect: 'You should hear levels in order: h1, h2, h3, etc. without skipping',
    },
  },

  'empty-heading': {
    title: 'Heading is empty',
    why: 'Screen reader users will hear "heading level X" but nothing else. Empty headings break navigation.',
    fix: 'Add text content to the heading, or remove it if not needed.',
    codeExample: `<!-- Bad: Empty heading -->
<h2></h2>

<!-- Good: Heading with content -->
<h2>Our services</h2>`,
  },

  'landmark-one-main': {
    title: 'Page has no main content area',
    why: 'Screen reader users use landmarks to jump to content. Without <main>, they must navigate through everything.',
    fix: 'Wrap your main content in a <main> element. There should be exactly one per page.',
    codeExample: `<header>...</header>
<main>
  <!-- Your page content here -->
</main>
<footer>...</footer>`,
    voiceOver: {
      goal: 'Verify users can jump to main content',
      steps: [
        'Press Cmd + F5 to start VoiceOver',
        'Press VO + U to open the rotor',
        'Navigate to "Landmarks" and look for "main"',
      ],
      expect: 'You should see "main" in the landmarks list',
    },
  },

  'landmark-no-duplicate-main': {
    title: 'Page has multiple main areas',
    why: "Screen reader users expect one main landmark. Multiple mains make it unclear where the primary content is.",
    fix: 'Keep only one <main> element. Move other content outside or use different elements.',
  },

  region: {
    title: 'Content outside landmarks',
    why: 'Screen reader users navigate by landmarks. Content outside landmarks may be missed.',
    fix: 'Ensure all content is within appropriate landmarks: <header>, <nav>, <main>, <aside>, or <footer>.',
  },
};
