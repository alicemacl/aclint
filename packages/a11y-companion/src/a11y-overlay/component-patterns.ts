/**
 * Semantic UI patterns — expectations beyond raw WCAG attributes.
 */

export type PatternSeverity = 'critical' | 'serious' | 'moderate';

export type PatternExpectation = {
  id: string;
  check: (element: HTMLElement) => boolean;
  message: string;
  suggestion: string;
  severity: PatternSeverity;
  learnMore: string;
};

export type ComponentPattern = {
  id: string;
  name: string;
  description: string;
  matches: (element: HTMLElement) => boolean;
  expectations: PatternExpectation[];
};

function hasAccessibleName(el: HTMLElement): boolean {
  if (el.getAttribute('aria-label')?.trim()) return true;
  if (el.getAttribute('aria-labelledby')) {
    const ids = el.getAttribute('aria-labelledby')!.split(/\s+/);
    return ids.some((id) => document.getElementById(id)?.textContent?.trim());
  }
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    if (el.id && document.querySelector(`label[for="${el.id}"]`)) return true;
  }
  if (el.textContent?.trim()) return true;
  if (el.querySelector('img[alt]')) return true;
  if (el.querySelector('[aria-label]')) return true;
  return false;
}

function isPlaceholderHref(href: string | null): boolean {
  if (!href) return true;
  const h = href.trim().toLowerCase();
  return h === '#' || h === '#!' || h.startsWith('javascript:') || h === '';
}

/** Anchor used as a disclosure / menu trigger instead of navigation */
export const linkAsTriggerPattern: ComponentPattern = {
  id: 'link-as-trigger',
  name: 'Link used as interactive trigger',
  description:
    'A link that behaves like a button (dropdown, disclosure) should usually be a button for predictable keyboard and screen reader behavior.',
  matches: (element) => {
    if (element.tagName !== 'A') return false;
    const href = element.getAttribute('href');
    if (element.hasAttribute('aria-expanded')) return true;
    if (element.hasAttribute('aria-haspopup')) return true;
    if (isPlaceholderHref(href)) return true;
    return false;
  },
  expectations: [
    {
      id: 'prefer-button',
      check: (el) => {
        if (el.tagName !== 'A') return true;
        const isTriggerLike =
          el.hasAttribute('aria-expanded') ||
          el.hasAttribute('aria-haspopup') ||
          isPlaceholderHref(el.getAttribute('href'));
        return !isTriggerLike;
      },
      message: 'This anchor looks like a trigger (not navigation)',
      suggestion:
        'Use <button type="button"> with aria-expanded / aria-haspopup when opening panels or menus. Reserve <a href="..."> for real navigations.',
      severity: 'serious',
      learnMore: 'https://www.w3.org/WAI/ARIA/apg/patterns/',
    },
  ],
};

export const disclosureTriggerPattern: ComponentPattern = {
  id: 'disclosure-trigger',
  name: 'Disclosure / expandable trigger',
  description: 'Elements that expand content should expose state and use an appropriate role.',
  matches: (element) => {
    const tag = element.tagName;
    const explicit = element.getAttribute('role');
    if (explicit === 'combobox' || explicit === 'searchbox' || explicit === 'textbox') {
      return false;
    }
    if (tag === 'BUTTON' || tag === 'A' || explicit === 'button' || explicit === 'link') {
      return element.hasAttribute('aria-expanded') || element.hasAttribute('aria-controls');
    }
    return false;
  },
  expectations: [
    {
      id: 'role-button',
      check: (el) => {
        const role = el.getAttribute('role');
        const tag = el.tagName;
        if (tag === 'BUTTON') return true;
        if (role === 'button') return true;
        return false;
      },
      message: 'Expandable control should be a button (or role="button")',
      suggestion:
        'Prefer <button> for controls that show/hide content. Links with aria-expanded confuse users expecting navigation.',
      severity: 'moderate',
      learnMore: 'https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/',
    },
    {
      id: 'has-controls',
      check: (el) => {
        if (!el.hasAttribute('aria-expanded')) return true;
        return el.hasAttribute('aria-controls');
      },
      message: 'aria-expanded is present but aria-controls is missing',
      suggestion: 'Add aria-controls pointing to the id of the panel you expand/collapse.',
      severity: 'moderate',
      learnMore: 'https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/',
    },
  ],
};

export const fakeButtonPattern: ComponentPattern = {
  id: 'fake-button',
  name: 'Non-button element acting as button',
  description: 'Clickable divs/spans need keyboard support and an accessible role.',
  matches: (element) => {
    const tag = element.tagName;
    if (tag === 'BUTTON' || tag === 'A' || tag === 'INPUT') return false;
    if (element.getAttribute('role') === 'button') return true;
    if (element.hasAttribute('onclick')) return true;
    return false;
  },
  expectations: [
    {
      id: 'tabindex',
      check: (el) => {
        if (el.tagName === 'BUTTON' || el.tagName === 'A') return true;
        const tab = el.getAttribute('tabindex');
        return tab !== null && tab !== '-1';
      },
      message: 'Custom control may not be keyboard-focusable',
      suggestion:
        'Add tabindex="0" and role="button", and handle Enter/Space. Better: use a real <button>.',
      severity: 'serious',
      learnMore: 'https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/',
    },
    {
      id: 'name',
      check: (el) => hasAccessibleName(el),
      message: 'Custom control needs an accessible name',
      suggestion: 'Add visible text, aria-label, or aria-labelledby.',
      severity: 'critical',
      learnMore: 'https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html',
    },
  ],
};

export const missingLabelPattern: ComponentPattern = {
  id: 'missing-label',
  name: 'Form control labeling',
  description: 'Native inputs should be programmatically associated with a label.',
  matches: (element) => {
    if (!(element instanceof HTMLInputElement)) return false;
    const t = element.type;
    if (['hidden', 'button', 'submit', 'reset', 'image'].includes(t)) return false;
    return true;
  },
  expectations: [
    {
      id: 'labeled',
      check: (el) => {
        if (!(el instanceof HTMLInputElement)) return true;
        if (el.getAttribute('aria-label')?.trim()) return true;
        if (el.getAttribute('aria-labelledby')) return true;
        if (el.id && document.querySelector(`label[for="${el.id}"]`)) return true;
        return false;
      },
      message: 'Form control has no associated label',
      suggestion: 'Use <label for="id">, or aria-label / aria-labelledby.',
      severity: 'serious',
      learnMore: 'https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html',
    },
  ],
};

/** Dialog: focus should move inside; Escape often closes (heuristic) */
export const dialogFocusPattern: ComponentPattern = {
  id: 'dialog-focus',
  name: 'Dialog / modal focus',
  description: 'Modal dialogs should trap focus and move focus inside when opened.',
  matches: (element) => {
    const role = element.getAttribute('role');
    const modal = element.getAttribute('aria-modal');
    return role === 'dialog' || role === 'alertdialog' || modal === 'true';
  },
  expectations: [
    {
      id: 'focusable-descendant',
      check: (el) => {
        const focusable = el.querySelector(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        return !!focusable;
      },
      message: 'Dialog has no focusable content',
      suggestion:
        'Ensure at least one focusable element exists inside the dialog when it is open, and move focus to it on open.',
      severity: 'serious',
      learnMore: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/',
    },
  ],
};

/** Tab list: should contain tabs with selection state */
export const tabInterfacePattern: ComponentPattern = {
  id: 'tab-interface',
  name: 'Tab list structure',
  description: 'Tab widgets need tabs, tablist, and tabpanels with correct ARIA.',
  matches: (element) => element.getAttribute('role') === 'tablist',
  expectations: [
    {
      id: 'has-tabs',
      check: (el) => {
        const tabs = el.querySelectorAll('[role="tab"]');
        return tabs.length > 0;
      },
      message: 'tablist has no tab children',
      suggestion: 'Add elements with role="tab" inside the tablist.',
      severity: 'critical',
      learnMore: 'https://www.w3.org/WAI/ARIA/apg/patterns/tabs/',
    },
    {
      id: 'tabs-selected',
      check: (el) => {
        const tabs = el.querySelectorAll<HTMLElement>('[role="tab"]');
        if (tabs.length === 0) return true;
        return Array.from(tabs).some((t) => t.getAttribute('aria-selected') === 'true');
      },
      message: 'No tab is marked selected',
      suggestion: 'Set aria-selected="true" on the active tab and "false" on others.',
      severity: 'serious',
      learnMore: 'https://www.w3.org/WAI/ARIA/apg/patterns/tabs/',
    },
  ],
};

/** Inside an aria-modal dialog: static hint when focusables are very sparse */
export const focusTrapHeuristicPattern: ComponentPattern = {
  id: 'focus-trap-heuristic',
  name: 'Modal dialog focus surface',
  description:
    'Dialogs should expose enough focusable controls; full focus-trap behavior must be tested manually with Tab.',
  matches: (element) => !!element.closest('[aria-modal="true"]'),
  expectations: [
    {
      id: 'enough-focusables',
      check: (el) => {
        const modal = el.closest<HTMLElement>('[aria-modal="true"]');
        if (!modal) return true;
        const count = modal.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ).length;
        return count >= 1;
      },
      message: 'Modal appears to have no focusable elements',
      suggestion:
        'Ensure the dialog contains focusable controls and that focus moves into the dialog when it opens. Test Tab / Shift+Tab to confirm focus stays within the modal.',
      severity: 'serious',
      learnMore: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/',
    },
  ],
};

export const ALL_PATTERNS: ComponentPattern[] = [
  linkAsTriggerPattern,
  disclosureTriggerPattern,
  fakeButtonPattern,
  missingLabelPattern,
  dialogFocusPattern,
  tabInterfacePattern,
  focusTrapHeuristicPattern,
];
