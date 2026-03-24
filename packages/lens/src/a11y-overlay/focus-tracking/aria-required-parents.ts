/**
 * ARIA required parent roles: which parent roles satisfy ownership for a child role.
 * Single source for focus simulation + assistant guidance (ARIA 1.2–aligned).
 * Includes tabpanel (assistant) and radio → radiogroup (focus ownership).
 */

import { getImplicitRole } from './implicit-role';

export const ARIA_REQUIRED_PARENT_ROLES: Record<string, string[]> = {
  menuitem: ['menu', 'menubar'],
  menuitemcheckbox: ['menu', 'menubar'],
  menuitemradio: ['menu', 'menubar'],
  listitem: ['list'],
  option: ['listbox'],
  tab: ['tablist'],
  tabpanel: ['tablist'],
  treeitem: ['tree', 'group'],
  row: ['table', 'grid', 'treegrid', 'rowgroup'],
  cell: ['row'],
  gridcell: ['row'],
  columnheader: ['row'],
  rowheader: ['row'],
  radio: ['radiogroup'],
};

export function roleRequiresAriaParent(role: string): boolean {
  return role in ARIA_REQUIRED_PARENT_ROLES;
}

/**
 * Check if element has a valid ARIA-owning parent.
 * Returns the valid parent element and its role, or null if invalid / not required.
 */
export function getValidOwningParent(
  element: HTMLElement,
  role: string,
): { element: HTMLElement; role: string } | null {
  const validParents = ARIA_REQUIRED_PARENT_ROLES[role];
  if (!validParents) {
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

  return null;
}
