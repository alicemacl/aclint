/**
 * Assistant Rules - Human-readable guidance for axe-core violations.
 * Imported from a11y-panel-mvp with comprehensive fix guidance.
 */

export type VoiceOverTest = {
  goal: string;
  steps: string[];
  expectedOutput: string;
};

export type FixGuidance = {
  whatToDo: string;
  codeExample?: string;
  commonMistakes?: string[];
};

export type AssistantRule = {
  id: string;
  axeRuleIds: string[];
  severity: 'critical' | 'warning' | 'info';
  category: string;
  summary: string;
  explanation: string;
  fixGuidance: FixGuidance;
  voiceOverTest: VoiceOverTest;
};

// ============================================================================
// Rules
// ============================================================================

const accessibleNameRule: AssistantRule = {
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

const formLabelRule: AssistantRule = {
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

const imageAltRule: AssistantRule = {
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

const headingStructureRule: AssistantRule = {
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

const keyboardAccessibilityRule: AssistantRule = {
  id: 'keyboard-accessibility',
  axeRuleIds: ['scrollable-region-focusable', 'nested-interactive'],
  severity: 'critical',
  category: 'keyboard',
  summary: 'Interactive element is not keyboard accessible',
  explanation:
    'Keyboard users must be able to access and operate all interactive elements. If a clickable element cannot receive focus, keyboard users cannot activate it.',
  fixGuidance: {
    whatToDo: `Ensure interactive elements are focusable and operable with keyboard:
- Use native interactive elements (<button>, <a>, <input>) when possible
- If using a non-interactive element, add tabindex="0" and role
- Handle both click and keydown (Enter/Space) events
- Never use tabindex > 0`,
    codeExample: `<!-- Preferred: use native elements -->
<button onClick={handleClick}>Click me</button>

<!-- If you must use a div -->
<div
  role="button"
  tabindex="0"
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
>
  Click me
</div>`,
    commonMistakes: [
      'Using div or span with onClick but no keyboard support',
      'Forgetting to add tabindex to custom interactive elements',
      'Missing keyboard event handlers (Enter/Space)',
      'Using tabindex values greater than 0',
    ],
  },
  voiceOverTest: {
    goal: 'Ensure the element is reachable and operable with keyboard alone',
    steps: [
      'Put away your mouse',
      'Press Tab to navigate through the page',
      'Verify you can reach the interactive element',
      'Press Enter or Space to activate it',
    ],
    expectedOutput: 'Element receives visible focus, activates on Enter/Space.',
  },
};

const landmarkStructureRule: AssistantRule = {
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

const colorContrastRule: AssistantRule = {
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

const focusVisibilityRule: AssistantRule = {
  id: 'focus-visibility',
  axeRuleIds: ['focus-order-semantics'],
  severity: 'critical',
  category: 'keyboard',
  summary: 'Focus indicator is not visible',
  explanation:
    'Keyboard users need visible focus indicators to understand which element is currently active. Without a clear focus state, users cannot navigate the page effectively.',
  fixGuidance: {
    whatToDo: `Ensure all interactive elements have a visible focus indicator:
- Do not remove outline styles without providing an alternative
- Use :focus-visible for keyboard-only focus styles
- Ensure focus indicator has sufficient contrast (3:1 ratio)`,
    codeExample: `/* Good - visible focus indicator */
button:focus-visible {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* Bad - removing focus without alternative */
button:focus {
  outline: none; /* Never do this without replacement */
}`,
    commonMistakes: [
      'Using outline: none without an alternative focus style',
      'Focus indicator with insufficient contrast',
      'Focus indicator that is too subtle or thin',
    ],
  },
  voiceOverTest: {
    goal: 'Ensure keyboard users can see which element is focused',
    steps: [
      'Disable your mouse or trackpad',
      'Use Tab to navigate through interactive elements',
      'Observe if each element shows a clear focus indicator',
    ],
    expectedOutput: 'Each interactive element shows a clear, visible focus ring when tabbed to.',
  },
};

const ariaValidRule: AssistantRule = {
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

const disabledFocusableRule: AssistantRule = {
  id: 'disabled-focusable',
  axeRuleIds: ['aria-hidden-focus'],
  severity: 'warning',
  category: 'keyboard',
  summary: 'Disabled element is still focusable',
  explanation:
    'Elements that appear disabled but remain focusable create confusion for keyboard users. Disabled elements should be removed from the tab order entirely.',
  fixGuidance: {
    whatToDo: `Ensure disabled elements are not focusable:
- Use the disabled attribute on form controls (removes from tab order)
- Use aria-disabled="true" with tabindex="-1" for custom components
- Do not rely on visual styling alone to indicate disabled state`,
    codeExample: `<!-- Good - native disabled removes from tab order -->
<button disabled>Submit</button>

<!-- Good - custom disabled with tabindex -->
<div role="button" aria-disabled="true" tabindex="-1">
  Submit
</div>

<!-- Bad - visually disabled but still focusable -->
<button class="disabled-looking" aria-disabled="true">
  Submit
</button>`,
    commonMistakes: [
      'Using aria-disabled without removing from tab order',
      'Styling elements as disabled without using the disabled attribute',
      'Keeping disabled elements in the tab sequence',
    ],
  },
  voiceOverTest: {
    goal: 'Ensure disabled elements cannot be focused',
    steps: [
      'Identify any disabled-looking elements on the page',
      'Use Tab to navigate through the page',
      'Verify that disabled elements are skipped',
    ],
    expectedOutput: 'Disabled elements are skipped when tabbing through the page.',
  },
};

const linkPurposeRule: AssistantRule = {
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

const ariaRequiredParentRule: AssistantRule = {
  id: 'aria-required-parent',
  axeRuleIds: ['aria-required-parent'],
  severity: 'critical',
  category: 'advanced',
  summary: 'Element is missing its required parent role',
  explanation:
    'Some ARIA roles must be nested inside specific parent roles to work correctly. Screen readers use these relationships to provide context like "item 2 of 5".',
  fixGuidance: {
    whatToDo: `Wrap this element in a parent with the correct role:

Role → Required parent:
• menuitem → menu or menubar
• tab → tablist
• listitem → list
• option → listbox
• row → table, grid, or treegrid
• cell, gridcell → row
• treeitem → tree or group`,
    codeExample: `<!-- menuitem needs menu parent -->
<div role="menu">
  <button role="menuitem">Edit</button>
  <button role="menuitem">Delete</button>
</div>

<!-- tab needs tablist parent -->
<div role="tablist">
  <button role="tab">Settings</button>
  <button role="tab">Profile</button>
</div>

<!-- option needs listbox parent -->
<div role="listbox">
  <div role="option">Option 1</div>
  <div role="option">Option 2</div>
</div>`,
    commonMistakes: [
      'Using Portal to render menu items outside the menu container',
      'Applying role to individual items without wrapping parent',
      'Nesting roles incorrectly (e.g., listitem directly in div)',
    ],
  },
  voiceOverTest: {
    goal: 'Verify screen reader announces position in set',
    steps: [
      'Enable VoiceOver (Cmd + F5)',
      'Navigate to the element',
      'Listen for position context (e.g., "1 of 3")',
    ],
    expectedOutput: 'VoiceOver announces the item with its position, e.g. "Edit, menu item, 1 of 3".',
  },
};

// ============================================================================
// Exports
// ============================================================================

export const ASSISTANT_RULES: AssistantRule[] = [
  // Core rules
  accessibleNameRule,
  formLabelRule,
  imageAltRule,
  headingStructureRule,
  keyboardAccessibilityRule,
  landmarkStructureRule,
  // Visual rules
  colorContrastRule,
  focusVisibilityRule,
  // Advanced rules
  ariaValidRule,
  ariaRequiredParentRule,
  disabledFocusableRule,
  linkPurposeRule,
];

/**
 * Build a map from axe rule ID to assistant rule for fast lookup.
 */
const axeRuleIdMap = new Map<string, AssistantRule>();
for (const rule of ASSISTANT_RULES) {
  for (const axeId of rule.axeRuleIds) {
    axeRuleIdMap.set(axeId, rule);
  }
}

/**
 * Get assistant rule for an axe rule ID.
 */
export function getAssistantRule(axeRuleId: string): AssistantRule | undefined {
  return axeRuleIdMap.get(axeRuleId);
}

/**
 * Check if we have guidance for an axe rule.
 */
export function hasAssistantRule(axeRuleId: string): boolean {
  return axeRuleIdMap.has(axeRuleId);
}

// ============================================================================
// Context-specific guidance helpers
// ============================================================================

/**
 * Required parent roles for common ARIA roles.
 */
const REQUIRED_PARENTS: Record<string, string[]> = {
  menuitem: ['menu', 'menubar'],
  menuitemcheckbox: ['menu', 'menubar'],
  menuitemradio: ['menu', 'menubar'],
  tab: ['tablist'],
  tabpanel: ['tablist'], // technically needs aria-labelledby to tab
  listitem: ['list'],
  option: ['listbox'],
  row: ['table', 'grid', 'treegrid', 'rowgroup'],
  cell: ['row'],
  gridcell: ['row'],
  columnheader: ['row'],
  rowheader: ['row'],
  treeitem: ['tree', 'group'],
};

/**
 * Get specific guidance for aria-required-parent based on the element's role.
 */
export function getRequiredParentGuidance(elementRole: string): string | null {
  const role = elementRole.toLowerCase();
  const parents = REQUIRED_PARENTS[role];

  if (!parents) {
    return null;
  }

  const parentList = parents.map((p) => `role="${p}"`).join(' or ');
  return `This ${role} must be inside a parent with ${parentList}.`;
}
