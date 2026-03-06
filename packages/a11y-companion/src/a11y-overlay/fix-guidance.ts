/**
 * Plain-language fix guidance for common accessibility issues.
 * Maps axe-core rule IDs to human-readable explanations and fixes.
 */

export type VoiceOverGuide = {
  goal: string;
  steps: string[];
  expect: string;
};

export type FixGuidance = {
  title: string;
  why: string;
  fix: string;
  codeExample?: string;
  avoid?: string[];
  voiceOver?: VoiceOverGuide;
};

/**
 * Fix guidance for common axe-core rule violations.
 * Written in plain language - no WCAG jargon.
 */
export const FIX_GUIDANCE: Record<string, FixGuidance> = {
  // Button issues
  'button-name': {
    title: 'Button has no label',
    why: "Screen readers can't tell users what this button does. They'll just hear \"button\" with no context.",
    fix: 'Add visible text inside the button. If the button only has an icon, add aria-label to describe what it does.',
    codeExample: `<!-- With visible text -->
<button>Save changes</button>

<!-- Icon-only button -->
<button aria-label="Close dialog">
  <IconX />
</button>`,
    avoid: [
      "Don't use title attribute - it's not announced by all screen readers",
      "Don't rely on placeholder text or visual cues alone",
    ],
    voiceOver: {
      goal: 'Verify the button announces its purpose when focused',
      steps: [
        'Press Cmd + F5 to start VoiceOver',
        'Press Tab until you reach this button',
        'Listen to what VoiceOver announces',
      ],
      expect: 'You should hear the button\'s purpose, like "Save changes, button"',
    },
  },

  // Link issues
  'link-name': {
    title: 'Link has no label',
    why: "Screen readers can't describe where this link goes. Users won't know what happens when they click it.",
    fix: 'Add descriptive text inside the link. Avoid generic text like "click here" or "read more".',
    codeExample: `<!-- Good: Descriptive link text -->
<a href="/pricing">View pricing plans</a>

<!-- Icon link with label -->
<a href="/settings" aria-label="Account settings">
  <IconSettings />
</a>`,
    avoid: [
      'Avoid "click here", "read more", "learn more" without context',
      "Don't use the URL as the link text",
    ],
    voiceOver: {
      goal: 'Verify the link describes its destination',
      steps: [
        'Press Cmd + F5 to start VoiceOver',
        'Press Tab until you reach this link',
        'Listen to what VoiceOver announces',
      ],
      expect: 'You should hear where the link goes, like "View pricing plans, link"',
    },
  },

  // Image issues
  'image-alt': {
    title: 'Image has no description',
    why: "Screen reader users can't perceive this image. They won't know what it shows or why it's there.",
    fix: 'Add alt text that describes the image. If the image is decorative, use an empty alt="".',
    codeExample: `<!-- Informative image -->
<img src="chart.png" alt="Sales increased 25% in Q4" />

<!-- Decorative image -->
<img src="divider.png" alt="" />`,
    avoid: [
      'Don\'t start with "Image of..." or "Picture of..." - screen readers already say "image"',
      "Don't describe decorative images - use empty alt instead",
    ],
    voiceOver: {
      goal: 'Verify the image is described or properly hidden',
      steps: [
        'Press Cmd + F5 to start VoiceOver',
        'Use VO + Right Arrow to navigate to this image',
        'Listen to what VoiceOver announces',
      ],
      expect: 'You should hear a description of what the image shows, or nothing if it\'s decorative',
    },
  },

  // Form label issues
  'label': {
    title: 'Input has no label',
    why: "Screen reader users won't know what to enter in this field. They'll just hear the input type.",
    fix: 'Add a visible <label> element connected to the input, or use aria-label if a visible label is not possible.',
    codeExample: `<!-- With visible label (preferred) -->
<label for="email">Email address</label>
<input type="email" id="email" />

<!-- With aria-label (when visible label not possible) -->
<input type="search" aria-label="Search products" />`,
    avoid: [
      "Don't use placeholder as the only label - it disappears when typing",
      "Don't rely on surrounding text to explain the field",
    ],
    voiceOver: {
      goal: 'Verify the input announces its purpose',
      steps: [
        'Press Cmd + F5 to start VoiceOver',
        'Press Tab until you reach this input',
        'Listen to what VoiceOver announces',
      ],
      expect: 'You should hear the field\'s purpose, like "Email address, text field"',
    },
  },

  'select-name': {
    title: 'Select has no label',
    why: "Screen reader users won't know what this dropdown is for.",
    fix: 'Add a visible <label> element connected to the select.',
    codeExample: `<label for="country">Country</label>
<select id="country">
  <option>Norway</option>
  <option>Sweden</option>
</select>`,
    voiceOver: {
      goal: 'Verify the select announces its purpose',
      steps: [
        'Press Cmd + F5 to start VoiceOver',
        'Press Tab until you reach this select',
        'Listen to what VoiceOver announces',
      ],
      expect: 'You should hear what the dropdown is for, like "Country, popup button"',
    },
  },

  // Color contrast
  'color-contrast': {
    title: 'Text is hard to read',
    why: 'The contrast between text and background is too low. Users with low vision may not be able to read it.',
    fix: 'Increase the contrast ratio. For normal text, aim for at least 4.5:1. For large text, 3:1 is acceptable.',
    codeExample: `/* Low contrast - hard to read */
.bad { color: #999; background: #fff; } /* 2.8:1 ratio */

/* Good contrast */
.good { color: #595959; background: #fff; } /* 4.5:1 ratio */`,
    avoid: [
      "Don't rely on color alone to convey information",
      "Don't use light gray text on white backgrounds",
    ],
  },

  // Heading structure
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

  // Landmark structure
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

  'region': {
    title: 'Content outside landmarks',
    why: 'Screen reader users navigate by landmarks. Content outside landmarks may be missed.',
    fix: 'Ensure all content is within appropriate landmarks: <header>, <nav>, <main>, <aside>, or <footer>.',
  },

  // ARIA issues
  'aria-valid-attr': {
    title: 'Invalid ARIA attribute',
    why: "This ARIA attribute doesn't exist. Screen readers will ignore it, so it's not doing what you think.",
    fix: 'Check the attribute name for typos. Use valid ARIA attributes from the specification.',
    codeExample: `<!-- Wrong -->
<button aria-labelled="Close">X</button>

<!-- Correct -->
<button aria-label="Close">X</button>`,
  },

  'aria-valid-attr-value': {
    title: 'Invalid ARIA value',
    why: 'This ARIA attribute has an invalid value. It may not work as expected with screen readers.',
    fix: 'Use a valid value for this ARIA attribute. Check the specification for allowed values.',
    codeExample: `<!-- Wrong -->
<div aria-hidden="yes">...</div>

<!-- Correct -->
<div aria-hidden="true">...</div>`,
  },

  'aria-allowed-attr': {
    title: 'ARIA attribute not allowed here',
    why: "This element's role doesn't support this ARIA attribute. It will be ignored.",
    fix: 'Remove the attribute or change the element/role to one that supports it.',
  },

  // Keyboard accessibility
  'scrollable-region-focusable': {
    title: 'Scrollable area not keyboard accessible',
    why: 'Keyboard users cannot scroll this content. They may miss important information.',
    fix: 'Add tabindex="0" to make the scrollable region focusable, or ensure content is accessible another way.',
    codeExample: `<div 
  class="scrollable"
  tabindex="0"
  role="region"
  aria-label="Code example"
>
  <!-- Scrollable content -->
</div>`,
    voiceOver: {
      goal: 'Verify keyboard users can scroll the content',
      steps: [
        'Press Tab to navigate to the scrollable area',
        'Use Arrow keys to scroll',
        'Verify you can access all content',
      ],
      expect: 'You should be able to scroll using the keyboard',
    },
  },

  'nested-interactive': {
    title: 'Interactive elements are nested',
    why: 'A button inside a link (or vice versa) confuses assistive technology. The behavior is unpredictable.',
    fix: 'Restructure so interactive elements are not nested. Use CSS to achieve the visual layout.',
    codeExample: `<!-- Wrong: Button inside link -->
<a href="/product">
  <button>Add to cart</button>
</a>

<!-- Correct: Separate elements -->
<a href="/product">View product</a>
<button>Add to cart</button>`,
  },

  // Focus visibility
  'focus-visible': {
    title: 'Focus indicator not visible',
    why: 'Keyboard users cannot see where they are on the page. They may get lost.',
    fix: "Don't remove focus outlines. Style them to match your design, but keep them visible.",
    codeExample: `/* Don't do this */
*:focus { outline: none; }

/* Do this instead */
:focus-visible {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
}`,
    voiceOver: {
      goal: 'Verify focus is visible when tabbing',
      steps: [
        'Press Tab to move through interactive elements',
        'Look for a visible focus indicator on each element',
      ],
      expect: 'You should clearly see which element is focused',
    },
  },

  // Link purpose
  'link-in-text-block': {
    title: 'Link not distinguishable from text',
    why: "Users can't tell this is a link without hovering. Color alone is not enough.",
    fix: 'Add an underline or other visual indicator besides color.',
    codeExample: `/* Links should be underlined or otherwise distinguishable */
a {
  color: #0066cc;
  text-decoration: underline;
}`,
  },

  // Document
  'document-title': {
    title: 'Page has no title',
    why: 'The browser tab and screen readers use the title to identify the page. Without it, navigation is harder.',
    fix: 'Add a descriptive <title> element in the <head>.',
    codeExample: `<head>
  <title>Products - My Store</title>
</head>`,
  },

  'html-has-lang': {
    title: 'Page language not set',
    why: 'Screen readers need to know the language to pronounce content correctly.',
    fix: 'Add a lang attribute to the <html> element.',
    codeExample: `<html lang="en">
  ...
</html>`,
  },

  // Tables
  'td-headers-attr': {
    title: 'Table cell has invalid headers',
    why: 'Screen readers use headers to describe table cells. Invalid references break this association.',
    fix: 'Ensure the headers attribute references valid <th> elements with matching id values.',
  },

  'th-has-data-cells': {
    title: 'Table header has no data cells',
    why: 'This table header is not associated with any data cells. It may confuse screen reader users.',
    fix: 'Ensure each <th> is associated with at least one <td> in its row or column.',
  },
};

/**
 * Get fix guidance for an axe rule ID.
 * Returns undefined if no guidance is available.
 */
export function getFixGuidance(ruleId: string): FixGuidance | undefined {
  return FIX_GUIDANCE[ruleId];
}

/**
 * Check if we have fix guidance for a rule.
 */
export function hasFixGuidance(ruleId: string): boolean {
  return ruleId in FIX_GUIDANCE;
}
