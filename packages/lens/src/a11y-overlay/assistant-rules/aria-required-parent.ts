import type { AssistantRule } from './types';

export const ariaRequiredParentRule: AssistantRule = {
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
