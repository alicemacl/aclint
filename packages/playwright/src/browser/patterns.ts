/**
 * Self-contained pattern detection for browser injection.
 * These are the same semantic patterns from @aclint/lens,
 * written as plain functions that can be serialized into page.evaluate().
 */

export type PatternViolation = {
  patternId: string;
  message: string;
  severity: 'critical' | 'serious' | 'moderate';
  suggestion: string;
  learnMoreUrl: string;
  selector: string;
  snippet: string;
};

// ── Helpers ──

function isPlaceholderHref(href: string | null): boolean {
  if (!href) return true;
  const h = href.trim().toLowerCase();
  return h === '#' || h === '#!' || h.startsWith('javascript:') || h === '';
}

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

function getSelector(el: HTMLElement): string {
  if (el.id) return `#${el.id}`;
  const tag = el.tagName.toLowerCase();
  const classes = Array.from(el.classList).slice(0, 2).join('.');
  const role = el.getAttribute('role');
  let s = tag;
  if (classes) s += `.${classes}`;
  if (role) s += `[role="${role}"]`;
  return s;
}

function getSnippet(el: HTMLElement): string {
  const html = el.outerHTML;
  if (html.length <= 200) return html;
  const open = html.indexOf('>');
  if (open === -1) return html.slice(0, 200) + '…';
  return html.slice(0, open + 1) + '…</' + el.tagName.toLowerCase() + '>';
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(', ');

// ── Pattern definitions ──

type Check = {
  id: string;
  check: (el: HTMLElement) => boolean;
  message: string;
  suggestion: string;
  severity: 'critical' | 'serious' | 'moderate';
  learnMore: string;
};

type Pattern = {
  id: string;
  matches: (el: HTMLElement) => boolean;
  checks: Check[];
};

const patterns: Pattern[] = [
  {
    id: 'link-as-trigger',
    matches: (el) => {
      if (el.tagName !== 'A') return false;
      if (el.hasAttribute('aria-expanded')) return true;
      if (el.hasAttribute('aria-haspopup')) return true;
      if (isPlaceholderHref(el.getAttribute('href'))) return true;
      return false;
    },
    checks: [
      {
        id: 'prefer-button',
        check: (el) => {
          if (el.tagName !== 'A') return true;
          return !(
            el.hasAttribute('aria-expanded') ||
            el.hasAttribute('aria-haspopup') ||
            isPlaceholderHref(el.getAttribute('href'))
          );
        },
        message: 'Anchor looks like a trigger (not navigation)',
        suggestion:
          'Use <button type="button"> with aria-expanded / aria-haspopup. Reserve <a href="..."> for real navigations.',
        severity: 'serious',
        learnMore: 'https://www.w3.org/WAI/ARIA/apg/patterns/',
      },
    ],
  },
  {
    id: 'disclosure-trigger',
    matches: (el) => {
      const role = el.getAttribute('role');
      if (role === 'combobox' || role === 'searchbox' || role === 'textbox') return false;
      const tag = el.tagName;
      if (tag === 'BUTTON' || tag === 'A' || role === 'button' || role === 'link') {
        return el.hasAttribute('aria-expanded') || el.hasAttribute('aria-controls');
      }
      return false;
    },
    checks: [
      {
        id: 'role-button',
        check: (el) => el.tagName === 'BUTTON' || el.getAttribute('role') === 'button',
        message: 'Expandable control should be a button (or role="button")',
        suggestion:
          'Prefer <button> for controls that show/hide content. Links with aria-expanded confuse users expecting navigation.',
        severity: 'moderate',
        learnMore: 'https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/',
      },
      {
        id: 'has-controls',
        check: (el) => !el.hasAttribute('aria-expanded') || el.hasAttribute('aria-controls'),
        message: 'aria-expanded present but aria-controls is missing',
        suggestion: 'Add aria-controls pointing to the id of the panel you expand/collapse.',
        severity: 'moderate',
        learnMore: 'https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/',
      },
    ],
  },
  {
    id: 'fake-button',
    matches: (el) => {
      const tag = el.tagName;
      if (tag === 'BUTTON' || tag === 'A' || tag === 'INPUT') return false;
      if (el.getAttribute('role') === 'button') return true;
      if (el.hasAttribute('onclick')) return true;
      return false;
    },
    checks: [
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
  },
  {
    id: 'missing-label',
    matches: (el) => {
      if (!(el instanceof HTMLInputElement)) return false;
      const t = el.type;
      return !['hidden', 'button', 'submit', 'reset', 'image'].includes(t);
    },
    checks: [
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
  },
  {
    id: 'dialog-focus',
    matches: (el) => {
      const role = el.getAttribute('role');
      const modal = el.getAttribute('aria-modal');
      return role === 'dialog' || role === 'alertdialog' || modal === 'true';
    },
    checks: [
      {
        id: 'focusable-descendant',
        check: (el) => !!el.querySelector(FOCUSABLE_SELECTOR),
        message: 'Dialog has no focusable content',
        suggestion:
          'Ensure at least one focusable element exists inside the dialog and move focus to it on open.',
        severity: 'serious',
        learnMore: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/',
      },
    ],
  },
  {
    id: 'tab-interface',
    matches: (el) => el.getAttribute('role') === 'tablist',
    checks: [
      {
        id: 'has-tabs',
        check: (el) => el.querySelectorAll('[role="tab"]').length > 0,
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
  },
];

// ── Runner ──

export function runPatternDetection(scopeSelector: string): PatternViolation[] {
  const scope = document.querySelector<HTMLElement>(scopeSelector) ?? document.body;
  const allElements = Array.from(scope.querySelectorAll<HTMLElement>('*'));
  const violations: PatternViolation[] = [];

  for (const el of allElements) {
    for (const pattern of patterns) {
      if (!pattern.matches(el)) continue;
      for (const check of pattern.checks) {
        if (check.check(el)) continue;
        violations.push({
          patternId: `${pattern.id}:${check.id}`,
          message: check.message,
          severity: check.severity,
          suggestion: check.suggestion,
          learnMoreUrl: check.learnMore,
          selector: getSelector(el),
          snippet: getSnippet(el),
        });
      }
    }
  }

  return violations;
}
