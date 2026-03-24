/**
 * Container names, position in set, parent context, heading level, selector/snippet.
 */

import type { ParentContext, PositionInSet } from '../focus-types';
import { getValidOwningParent, roleRequiresAriaParent } from './aria-required-parents';
import { getImplicitRole } from './implicit-role';

/**
 * Get the accessible name of a container element.
 */
export function getContainerName(element: HTMLElement): string | null {
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
 * Get position in set for an element (item X of Y).
 */
export function getPositionInSet(
  element: HTMLElement,
  role: string,
  validParent: { element: HTMLElement; role: string } | null,
): PositionInSet {
  const posInSet = element.getAttribute('aria-posinset');
  const setSize = element.getAttribute('aria-setsize');

  if (posInSet && setSize) {
    return {
      current: parseInt(posInSet, 10),
      total: parseInt(setSize, 10),
    };
  }

  const requiresOwnership = roleRequiresAriaParent(role);

  if (requiresOwnership && !validParent) {
    return null;
  }

  if (validParent) {
    const siblings = Array.from(
      validParent.element.querySelectorAll(`[role="${role}"]`),
    ).filter((el) => {
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

  if (element.tagName === 'LI' || element.closest('li')) {
    const listItem = element.tagName === 'LI' ? element : element.closest('li')!;
    const list = listItem.closest('ul, ol, [role="list"]');

    if (list) {
      const listRole = list.getAttribute('role') || getImplicitRole(list as HTMLElement);
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
 * Get parent context roles that VoiceOver would announce.
 */
export function getParentContext(
  element: HTMLElement,
  _role: string,
  validParent: { element: HTMLElement; role: string } | null,
): ParentContext {
  const context: ParentContext = [];

  if (validParent) {
    const name = getContainerName(validParent.element);
    context.push({
      role: validParent.role,
      name,
      containerElement: validParent.element,
    });
  }

  let current = validParent?.element.parentElement || element.parentElement;
  let depth = 0;

  const announcedContainerRoles = new Set([
    'navigation',
    'main',
    'banner',
    'contentinfo',
    'complementary',
    'region',
    'search',
    'form',
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
export function getHeadingLevel(element: HTMLElement): number | null {
  const ariaLevel = element.getAttribute('aria-level');
  if (ariaLevel) {
    return parseInt(ariaLevel, 10);
  }

  const match = element.tagName.match(/^H([1-6])$/);
  if (match) {
    return parseInt(match[1], 10);
  }

  if (element.getAttribute('role') === 'heading') {
    return 2;
  }

  return null;
}

/**
 * Generate a CSS selector for an element.
 */
export function getElementSelector(element: HTMLElement): string {
  const parts: string[] = [];
  let current: HTMLElement | null = element;
  let depth = 0;

  while (current && current !== document.body && depth < 4) {
    let selector = current.tagName.toLowerCase();

    if (current.id) {
      selector = `#${current.id}`;
      parts.unshift(selector);
      break;
    }

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
 * Get a truncated HTML snippet for an element.
 */
export function getElementSnippet(element: HTMLElement, maxLength = 200): string {
  const html = element.outerHTML;

  if (html.length <= maxLength) {
    return html;
  }

  const openTagEnd = html.indexOf('>');
  if (openTagEnd === -1) {
    return html.slice(0, maxLength) + '...';
  }

  if (openTagEnd > maxLength) {
    return html.slice(0, maxLength) + '...>';
  }

  const openTag = html.slice(0, openTagEnd + 1);
  const remaining = maxLength - openTag.length - 10;

  if (remaining > 20) {
    const content = html.slice(openTagEnd + 1, openTagEnd + 1 + remaining);
    return openTag + content + '...';
  }

  return openTag + '...';
}
