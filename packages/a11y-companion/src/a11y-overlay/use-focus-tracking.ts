/**
 * Hook to track focus changes and compute accessibility information.
 * Automatically runs axe checks on focus change with debouncing.
 *
 * This module simulates VoiceOver announcements by respecting ARIA ownership
 * rules. Position and context are only announced when the element has a valid
 * ARIA-owning parent (e.g., menuitem inside menu, tab inside tablist).
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import { checkElementWithAccessLint } from './a11y-accesslint-check';
import type { AxeCheckResult } from './a11y-axe-check';
import { checkElement, getCachedResult, hasCachedResult } from './a11y-axe-check';
import type { ParentContext, PositionInSet } from './focus-types';
import type { MappedIssue } from './map-violations';
import { detectPatternIssues, patternViolationsToMappedIssues } from './pattern-detector';
import type { VOAnnouncement } from './vo-engine';
import { generateVOAnnouncement } from './vo-engine';

// ============================================================================
// ARIA Ownership Rules
// ============================================================================

/**
 * ARIA ownership rules: which parent roles provide context for child roles.
 * VoiceOver only announces position/context when these relationships are valid.
 * Based on ARIA 1.2 specification.
 */
const VALID_OWNERSHIP: Record<string, string[]> = {
  // Menu roles
  menuitem: ['menu', 'menubar'],
  menuitemcheckbox: ['menu', 'menubar'],
  menuitemradio: ['menu', 'menubar'],

  // List roles
  listitem: ['list'],

  // Listbox/combobox
  option: ['listbox'],

  // Tabs
  tab: ['tablist'],

  // Tree
  treeitem: ['tree', 'group'],

  // Table/grid
  row: ['table', 'grid', 'treegrid', 'rowgroup'],
  cell: ['row'],
  gridcell: ['row'],
  columnheader: ['row'],
  rowheader: ['row'],

  // Radio
  radio: ['radiogroup'],
};

/**
 * Tags that have implicit ARIA roles.
 */
const TAG_TO_IMPLICIT_ROLE: Record<string, string> = {
  UL: 'list',
  OL: 'list',
  MENU: 'menu',
  NAV: 'navigation',
  MAIN: 'main',
  HEADER: 'banner',
  FOOTER: 'contentinfo',
  ASIDE: 'complementary',
  FORM: 'form',
  TABLE: 'table',
  DIALOG: 'dialog',
  ARTICLE: 'article',
  SECTION: 'region',
};

/**
 * Roles that are landmarks (always announced by VoiceOver regardless of ownership).
 */
// ============================================================================
// Types
// ============================================================================

export type { ParentContext, PositionInSet } from './focus-types';

export type FocusedElementInfo = {
  element: HTMLElement;
  role: string;
  name: string;
  description: string | null;
  states: string[];
  /** Primary string VoiceOver would speak (same as voOutput.text) */
  announcement: string;
  /** Structured VoiceOver segments for teaching / breakdown */
  voOutput: VOAnnouncement;
  selector: string;
  snippet: string; // Truncated HTML snippet
  // Enhanced context
  positionInSet: PositionInSet;
  parentContext: ParentContext;
  level: number | null; // For headings
  // Ownership validation
  hasValidOwnership: boolean;
  ownershipIssue: string | null;
};

export type FocusTrackingResult = {
  current: FocusedElementInfo | null;
  prev: FocusedElementInfo | null;
  next: FocusedElementInfo | null;
  currentIndex: number;
  totalFocusable: number;
  issues: MappedIssue[];
  isChecking: boolean;
  axeResult: AxeCheckResult | null;
};

// ============================================================================
// Ownership Validation
// ============================================================================

/**
 * Get the implicit ARIA role for an HTML element.
 */
function getImplicitRole(element: HTMLElement): string | null {
  return TAG_TO_IMPLICIT_ROLE[element.tagName] || null;
}

/**
 * Get the accessible name of a container element.
 */
function getContainerName(element: HTMLElement): string | null {
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;

  const ariaLabelledBy = element.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const name = ariaLabelledBy
      .split(' ')
      .map((id) => document.getElementById(id)?.textContent?.trim())
      .filter(Boolean)
      .join(' ');
    return name || null;
  }

  return null;
}

/**
 * Check if element has a valid ARIA-owning parent.
 * Returns the valid parent element and its role, or null if invalid.
 */
function getValidOwningParent(
  element: HTMLElement,
  role: string,
): { element: HTMLElement; role: string } | null {
  const validParents = VALID_OWNERSHIP[role];
  if (!validParents) {
    // Role doesn't require specific parent
    return null;
  }

  let current = element.parentElement;
  let depth = 0;

  while (current && current !== document.body && depth < 10) {
    const explicitRole = current.getAttribute('role');
    const implicitRole = getImplicitRole(current);
    const parentRole = explicitRole || implicitRole;

    if (parentRole && validParents.includes(parentRole)) {
      return { element: current, role: parentRole };
    }

    current = current.parentElement;
    depth++;
  }

  return null; // No valid parent found
}

// ============================================================================
// Focusable Elements
// ============================================================================

/**
 * Get all focusable elements on the page.
 */
function getFocusableElements(): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(', ');

  const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));

  return elements.filter((el) => {
    // Skip hidden elements
    if (el.offsetParent === null && el.tagName !== 'BODY') return false;
    // Skip elements inside the a11y panel
    if (el.closest('[data-a11y-panel]')) return false;
    return true;
  });
}

/**
 * Get the computed accessible role for an element.
 */
function getComputedRole(element: HTMLElement): string {
  // Use the browser's computed role if available
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const el = element as any;
  if (el.computedRole) {
    return el.computedRole;
  }

  // Fallback to explicit role or implicit role from tag
  const explicitRole = element.getAttribute('role');
  if (explicitRole) return explicitRole;

  // Map common tags to implicit roles
  const tagRoles: Record<string, string> = {
    A: 'link',
    BUTTON: 'button',
    INPUT: getInputRole(element as HTMLInputElement),
    SELECT: 'combobox',
    TEXTAREA: 'textbox',
    IMG: 'img',
    NAV: 'navigation',
    MAIN: 'main',
    HEADER: 'banner',
    FOOTER: 'contentinfo',
    ASIDE: 'complementary',
    ARTICLE: 'article',
    SECTION: 'region',
    H1: 'heading',
    H2: 'heading',
    H3: 'heading',
    H4: 'heading',
    H5: 'heading',
    H6: 'heading',
  };

  return tagRoles[element.tagName] || 'generic';
}

/**
 * Get the role for an input element based on its type.
 */
function getInputRole(input: HTMLInputElement): string {
  const typeRoles: Record<string, string> = {
    button: 'button',
    checkbox: 'checkbox',
    radio: 'radio',
    range: 'slider',
    search: 'searchbox',
    submit: 'button',
    reset: 'button',
  };
  return typeRoles[input.type] || 'textbox';
}

/**
 * Get the computed accessible name for an element.
 */
function getComputedName(element: HTMLElement): string {
  // Use the browser's computed accessible name API if available
  // This is the most accurate method as it follows the full accname spec
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const el = element as any;
  if (typeof el.computedName === 'string' && el.computedName) {
    return el.computedName;
  }

  // Fallback: manual computation

  // Check aria-label on the element itself
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;

  // Check aria-labelledby
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labels = labelledBy
      .split(' ')
      .map((id) => document.getElementById(id)?.textContent?.trim())
      .filter(Boolean);
    if (labels.length > 0) return labels.join(' ');
  }

  // Check for associated label (for form elements)
  if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) {
    const id = element.id;
    if (id) {
      const label = document.querySelector<HTMLLabelElement>(`label[for="${id}"]`);
      if (label) return label.textContent?.trim() || '';
    }
  }

  // Check alt for images
  if (element instanceof HTMLImageElement) {
    if (element.alt) return element.alt;
  }

  // Check value for input buttons
  if (element instanceof HTMLInputElement && ['submit', 'reset', 'button'].includes(element.type)) {
    if (element.value) return element.value;
  }

  // Check for aria-label on direct children (important for SVG inside links/buttons)
  const childWithLabel = element.querySelector('[aria-label]');
  if (childWithLabel) {
    const childLabel = childWithLabel.getAttribute('aria-label');
    if (childLabel) return childLabel;
  }

  // Check for img with alt inside
  const imgChild = element.querySelector('img[alt]');
  if (imgChild) {
    const alt = imgChild.getAttribute('alt');
    if (alt) return alt;
  }

  // Check for SVG with title element
  const svgChild = element.querySelector('svg');
  if (svgChild) {
    const svgTitle = svgChild.querySelector('title');
    if (svgTitle?.textContent) return svgTitle.textContent.trim();
  }

  // Use text content as last resort
  const textContent = element.textContent?.trim();
  if (textContent) return textContent;

  return '';
}

/**
 * Get the computed accessible description for an element.
 */
function getComputedDescription(element: HTMLElement): string | null {
  const describedBy = element.getAttribute('aria-describedby');
  if (describedBy) {
    const descriptions = describedBy
      .split(' ')
      .map((id) => document.getElementById(id)?.textContent?.trim())
      .filter(Boolean);
    if (descriptions.length > 0) return descriptions.join(' ');
  }

  const title = element.getAttribute('title');
  if (title) return title;

  return null;
}

/**
 * Get accessibility states for an element.
 */
function getStates(element: HTMLElement): string[] {
  const states: string[] = [];

  // Expanded/collapsed
  const expanded = element.getAttribute('aria-expanded');
  if (expanded === 'true') states.push('expanded');
  if (expanded === 'false') states.push('collapsed');

  // Checked
  const checked = element.getAttribute('aria-checked');
  if (checked === 'true') states.push('checked');
  if (checked === 'false') states.push('not checked');
  if (checked === 'mixed') states.push('partially checked');

  // For native checkboxes
  if (element instanceof HTMLInputElement && element.type === 'checkbox') {
    states.push(element.checked ? 'checked' : 'not checked');
  }

  // Selected
  const selected = element.getAttribute('aria-selected');
  if (selected === 'true') states.push('selected');

  // Pressed
  const pressed = element.getAttribute('aria-pressed');
  if (pressed === 'true') states.push('pressed');
  if (pressed === 'false') states.push('not pressed');

  // Disabled
  if (element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true') {
    states.push('disabled');
  }

  // Required
  if (element.hasAttribute('required') || element.getAttribute('aria-required') === 'true') {
    states.push('required');
  }

  // Invalid
  if (element.getAttribute('aria-invalid') === 'true') {
    states.push('invalid');
  }

  // Read-only
  if (element.hasAttribute('readonly') || element.getAttribute('aria-readonly') === 'true') {
    states.push('read-only');
  }

  // Current
  const current = element.getAttribute('aria-current');
  if (current && current !== 'false') {
    states.push(current === 'true' ? 'current' : `current ${current}`);
  }

  return states;
}

/**
 * Get position in set for an element (item X of Y).
 * Respects ARIA ownership rules - only returns position when the element
 * has a valid owning parent that VoiceOver would recognize.
 */
function getPositionInSet(
  element: HTMLElement,
  role: string,
  validParent: { element: HTMLElement; role: string } | null,
): PositionInSet {
  // 1. Check explicit ARIA attributes first (always trust these)
  const posInSet = element.getAttribute('aria-posinset');
  const setSize = element.getAttribute('aria-setsize');

  if (posInSet && setSize) {
    return {
      current: parseInt(posInSet, 10),
      total: parseInt(setSize, 10),
    };
  }

  // 2. Check if this role requires a specific parent
  const requiresOwnership = role in VALID_OWNERSHIP;

  // 3. If role requires parent but none found, don't compute position
  // VoiceOver won't announce position without valid ownership
  if (requiresOwnership && !validParent) {
    return null;
  }

  // 4. If valid parent exists, compute position within that parent
  if (validParent) {
    // Find siblings with the same role within the valid parent
    const siblings = Array.from(
      validParent.element.querySelectorAll(`[role="${role}"]`),
    ).filter((el) => {
      // Only include direct descendants (not nested)
      const elParent = getValidOwningParent(el as HTMLElement, role);
      return elParent?.element === validParent.element;
    });

    const index = siblings.indexOf(element);
    if (index >= 0 && siblings.length > 0) {
      return {
        current: index + 1,
        total: siblings.length,
      };
    }
  }

  // 5. For native list items (li) inside proper list containers
  if (element.tagName === 'LI' || element.closest('li')) {
    const listItem = element.tagName === 'LI' ? element : element.closest('li')!;
    const list = listItem.closest('ul, ol, [role="list"]');

    if (list) {
      const listRole = list.getAttribute('role') || getImplicitRole(list as HTMLElement);
      // Only count if this is a proper list (not menu, listbox, etc.)
      if (listRole === 'list') {
        const items = Array.from(list.querySelectorAll(':scope > li'));
        const index = items.indexOf(listItem);
        if (index >= 0) {
          return {
            current: index + 1,
            total: items.length,
          };
        }
      }
    }
  }

  return null;
}

/**
 * Get parent context roles that VoiceOver would actually announce.
 * Respects ARIA ownership rules - only includes valid owning parents
 * and landmark regions.
 */
function getParentContext(
  element: HTMLElement,
  role: string,
  validParent: { element: HTMLElement; role: string } | null,
): ParentContext {
  const context: ParentContext = [];

  // 1. If there's a valid owning parent, include it first
  if (validParent) {
    const name = getContainerName(validParent.element);
    context.push({
      role: validParent.role,
      name,
      containerElement: validParent.element,
    });
  }

  // 2. Continue up the tree for landmarks and other meaningful context
  // Start from the valid parent (if exists) or the element itself
  let current = validParent?.element.parentElement || element.parentElement;
  let depth = 0;

  // Container roles that VoiceOver announces (beyond ownership)
  // Note: VoiceOver announces dialog/alertdialog when entering, not for each element inside
  const announcedContainerRoles = new Set([
    // Landmarks (always announced)
    'navigation',
    'main',
    'banner',
    'contentinfo',
    'complementary',
    'region',
    'search',
    'form',
    // Other meaningful containers
    'list',
    'toolbar',
    'article',
  ]);

  while (current && current !== document.body && depth < 10) {
    const explicitRole = current.getAttribute('role');
    const implicitRole = getImplicitRole(current);
    const parentRole = explicitRole || implicitRole;

    if (parentRole && announcedContainerRoles.has(parentRole)) {
      const name = getContainerName(current);
      const entry: ParentContext[number] = {
        role: parentRole,
        name,
        containerElement: current,
      };

      if (parentRole === 'list') {
        entry.itemCount = current.querySelectorAll(':scope > li, :scope > [role="listitem"]').length;
      }

      context.push(entry);
    }

    current = current.parentElement;
    depth++;
  }

  return context;
}

/**
 * Get heading level for heading elements.
 */
function getHeadingLevel(element: HTMLElement): number | null {
  // Check aria-level first
  const ariaLevel = element.getAttribute('aria-level');
  if (ariaLevel) {
    return parseInt(ariaLevel, 10);
  }

  // Check tag name
  const match = element.tagName.match(/^H([1-6])$/);
  if (match) {
    return parseInt(match[1], 10);
  }

  // Check if it has heading role
  if (element.getAttribute('role') === 'heading') {
    return 2; // Default level for role="heading" without aria-level
  }

  return null;
}

/**
 * Generate a CSS selector for an element.
 */
function getElementSelector(element: HTMLElement): string {
  const parts: string[] = [];
  let current: HTMLElement | null = element;
  let depth = 0;

  while (current && current !== document.body && depth < 4) {
    let selector = current.tagName.toLowerCase();

    // Add id if available
    if (current.id) {
      selector = `#${current.id}`;
      parts.unshift(selector);
      break;
    }

    // Add classes (first 2)
    const classes = Array.from(current.classList).slice(0, 2);
    if (classes.length > 0) {
      selector += '.' + classes.join('.');
    }

    parts.unshift(selector);
    current = current.parentElement;
    depth++;
  }

  return parts.join(' > ');
}

/**
 * Build element info from an HTML element.
 */
/**
 * Get a truncated HTML snippet for an element.
 */
function getElementSnippet(element: HTMLElement, maxLength = 200): string {
  const html = element.outerHTML;
  
  if (html.length <= maxLength) {
    return html;
  }
  
  // Try to truncate at a reasonable point
  // Find the end of the opening tag
  const openTagEnd = html.indexOf('>');
  if (openTagEnd === -1) {
    return html.slice(0, maxLength) + '...';
  }
  
  // If the opening tag itself is too long, truncate it
  if (openTagEnd > maxLength) {
    return html.slice(0, maxLength) + '...>';
  }
  
  // Return opening tag + truncated content + indicator
  const openTag = html.slice(0, openTagEnd + 1);
  const remaining = maxLength - openTag.length - 10; // Reserve space for "...</tag>"
  
  if (remaining > 20) {
    const content = html.slice(openTagEnd + 1, openTagEnd + 1 + remaining);
    return openTag + content + '...';
  }
  
  return openTag + '...';
}

/**
 * Keys that move highlight inside composite widgets (listbox, menu, tabs, grid)
 * without always moving DOM focus — we re-sync after these so the panel matches
 * aria-activedescendant and roving tabindex updates.
 */
const COMPOSITE_NAVIGATION_KEYS = new Set([
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
  'PageUp',
  'PageDown',
]);

/**
 * Resolve the element the user experiences as "focused" in composites.
 * When DOM focus stays on a combobox/listbox container, aria-activedescendant
 * points at the highlighted option/item.
 */
function getEffectiveFocusTarget(focused: HTMLElement): HTMLElement {
  let node: HTMLElement | null = focused;
  let depth = 0;
  while (node && node !== document.body && depth < 12) {
    const idRaw = node.getAttribute('aria-activedescendant');
    if (idRaw?.trim()) {
      const byId = document.getElementById(idRaw.trim());
      if (byId instanceof HTMLElement) {
        return byId;
      }
    }
    node = node.parentElement;
    depth++;
  }
  return focused;
}

function isInsideA11yPanel(element: HTMLElement): boolean {
  return element.closest('[data-a11y-panel]') !== null;
}

/** Arrow keys in these controls move the caret / value, not a composite highlight. */
function isTextEntryElement(element: HTMLElement): boolean {
  if (element instanceof HTMLTextAreaElement) return true;
  if (element.isContentEditable) return true;
  if (element instanceof HTMLInputElement) {
    const type = element.type;
    return (
      type === 'text' ||
      type === 'search' ||
      type === 'email' ||
      type === 'url' ||
      type === 'tel' ||
      type === 'password' ||
      type === '' ||
      type === 'number'
    );
  }
  return false;
}

function getElementInfo(
  element: HTMLElement,
  previousContextContainer: HTMLElement | null = null,
): FocusedElementInfo {
  const role = getComputedRole(element);
  const name = getComputedName(element);
  const description = getComputedDescription(element);
  const states = getStates(element);
  const selector = getElementSelector(element);
  const snippet = getElementSnippet(element);
  const level = getHeadingLevel(element);

  // Ownership validation
  const requiresOwnership = role in VALID_OWNERSHIP;
  const validParent = getValidOwningParent(element, role);
  const hasValidOwnership = !requiresOwnership || validParent !== null;

  // Generate ownership issue message if applicable
  let ownershipIssue: string | null = null;
  if (requiresOwnership && !validParent) {
    const expectedParents = VALID_OWNERSHIP[role];
    const expectedList = expectedParents.map((p) => `"${p}"`).join(' or ');
    ownershipIssue = `This ${role} must be inside a parent with role ${expectedList}`;
  }

  // Compute position/context with ownership awareness
  const positionInSet = getPositionInSet(element, role, validParent);
  const parentContext = getParentContext(element, role, validParent);

  const voOutput = generateVOAnnouncement({
    element,
    role,
    name,
    description,
    level,
    positionInSet,
    parentContext,
    hasValidOwnership,
    previousContextContainer,
  });

  return {
    element,
    role,
    name,
    description,
    states,
    announcement: voOutput.text,
    voOutput,
    selector,
    snippet,
    positionInSet,
    parentContext,
    level,
    hasValidOwnership,
    ownershipIssue,
  };
}

/**
 * Merge axe and AccessLint issues, skipping AccessLint duplicates
 * when axe already reported a violation with the same title text.
 */
function mergeIssues(
  patternIssues: MappedIssue[],
  axeIssues: MappedIssue[],
  alIssues: MappedIssue[],
): MappedIssue[] {
  const seen = new Set<string>();
  const out: MappedIssue[] = [];

  for (const i of patternIssues) {
    const k = `p:${i.title.toLowerCase()}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(i);
  }
  for (const i of axeIssues) {
    const k = `a:${i.id}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(i);
  }
  const axeTitles = new Set(axeIssues.map((i) => i.title.toLowerCase()));
  for (const i of alIssues) {
    if (axeTitles.has(i.title.toLowerCase())) continue;
    const k = `al:${i.title.toLowerCase()}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(i);
  }
  return out;
}

/**
 * Hook to track focus and run accessibility checks.
 */
export function useFocusTracking(isEnabled: boolean): FocusTrackingResult {
  const [current, setCurrent] = useState<FocusedElementInfo | null>(null);
  const [prev, setPrev] = useState<FocusedElementInfo | null>(null);
  const [next, setNext] = useState<FocusedElementInfo | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalFocusable, setTotalFocusable] = useState(0);
  const [issues, setIssues] = useState<MappedIssue[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [axeResult, setAxeResult] = useState<AxeCheckResult | null>(null);

  const checkTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const compositeNavSyncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Closest announced container from previous focus — skip repeating list/landmark in VO string */
  const previousContextContainerRef = useRef<HTMLElement | null>(null);

  // Update navigation context
  const updateNavigation = useCallback((focusedElement: HTMLElement) => {
    const focusable = getFocusableElements();
    setTotalFocusable(focusable.length);

    const index = focusable.indexOf(focusedElement);
    if (index >= 0) {
      setCurrentIndex(index + 1);
      setPrev(index > 0 ? getElementInfo(focusable[index - 1]) : null);
      setNext(index < focusable.length - 1 ? getElementInfo(focusable[index + 1]) : null);
    }
  }, []);

  // Run axe + AccessLint checks with debounce
  const runCheck = useCallback(async (element: HTMLElement) => {
    const patternMapped = patternViolationsToMappedIssues(detectPatternIssues(element));

    // Check cache first (axe only)
    if (hasCachedResult(element)) {
      const cached = getCachedResult(element)!;
      setAxeResult(cached);

      const alIssues = await checkElementWithAccessLint(element);
      setIssues(mergeIssues(patternMapped, cached.issues, alIssues));
      return;
    }

    setIsChecking(true);

    try {
      const [axeResult, alIssues] = await Promise.all([
        checkElement(element),
        checkElementWithAccessLint(element),
      ]);

      setAxeResult(axeResult);
      setIssues(mergeIssues(patternMapped, axeResult.issues, alIssues));
    } catch {
      setAxeResult(null);
      setIssues(patternMapped);
    } finally {
      setIsChecking(false);
    }
  }, []);

  // Handle focus change + composite / control updates that don't fire focusin
  useEffect(() => {
    if (!isEnabled) return;

    /**
     * `domFocusElement` is the node that actually has DOM focus (tab order).
     * Panel content + highlight use the effective target (e.g. activedescendant option).
     */
    const applyFocusSync = (domFocusElement: HTMLElement | null) => {
      if (!domFocusElement || domFocusElement === document.body) return;
      if (isInsideA11yPanel(domFocusElement)) return;

      const effective = getEffectiveFocusTarget(domFocusElement);
      const info = getElementInfo(effective, previousContextContainerRef.current);
      previousContextContainerRef.current = info.parentContext[0]?.containerElement ?? null;
      setCurrent(info);
      updateNavigation(domFocusElement);

      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }

      setAxeResult(null);
      setIssues([]);

      checkTimeoutRef.current = setTimeout(() => {
        runCheck(effective);
      }, 150);
    };

    const scheduleCompositeRefresh = () => {
      if (compositeNavSyncTimeoutRef.current != null) {
        clearTimeout(compositeNavSyncTimeoutRef.current);
      }
      // Defer so aria-activedescendant / roving tabindex updates land after the key handler.
      compositeNavSyncTimeoutRef.current = setTimeout(() => {
        compositeNavSyncTimeoutRef.current = null;
        const ae = document.activeElement;
        if (ae instanceof HTMLElement) {
          applyFocusSync(ae);
        }
      }, 0);
    };

    const handleFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      applyFocusSync(target);
    };

    const handleKeyDownCapture = (event: KeyboardEvent) => {
      if (!COMPOSITE_NAVIGATION_KEYS.has(event.key)) return;
      const ae = document.activeElement;
      if (!(ae instanceof HTMLElement) || isInsideA11yPanel(ae)) return;
      if (isTextEntryElement(ae)) return;
      scheduleCompositeRefresh();
    };

    const handleChangeCapture = (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement) || isInsideA11yPanel(target)) return;
      requestAnimationFrame(() => {
        const ae = document.activeElement;
        const domFocus =
          ae instanceof HTMLElement && !isInsideA11yPanel(ae) ? ae : target;
        applyFocusSync(domFocus);
      });
    };

    const handleClickCapture = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement) || isInsideA11yPanel(target)) return;
      const role = target.getAttribute('role');
      const isToggleControl =
        (target instanceof HTMLInputElement &&
          (target.type === 'checkbox' || target.type === 'radio')) ||
        role === 'checkbox' ||
        role === 'switch' ||
        role === 'menuitemcheckbox' ||
        role === 'menuitemradio';
      if (!isToggleControl) return;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const ae = document.activeElement;
          const domFocus =
            ae instanceof HTMLElement && !isInsideA11yPanel(ae) ? ae : target;
          applyFocusSync(domFocus);
        });
      });
    };

    document.addEventListener('focusin', handleFocus);
    document.addEventListener('keydown', handleKeyDownCapture, true);
    document.addEventListener('change', handleChangeCapture, true);
    document.addEventListener('click', handleClickCapture, true);

    // Initialize with currently focused element
    if (document.activeElement && document.activeElement !== document.body) {
      applyFocusSync(document.activeElement as HTMLElement);
    }

    return () => {
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('keydown', handleKeyDownCapture, true);
      document.removeEventListener('change', handleChangeCapture, true);
      document.removeEventListener('click', handleClickCapture, true);
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
      if (compositeNavSyncTimeoutRef.current != null) {
        clearTimeout(compositeNavSyncTimeoutRef.current);
        compositeNavSyncTimeoutRef.current = null;
      }
    };
  }, [isEnabled, updateNavigation, runCheck]);

  return {
    current,
    prev,
    next,
    currentIndex,
    totalFocusable,
    issues,
    isChecking,
    axeResult,
  };
}
