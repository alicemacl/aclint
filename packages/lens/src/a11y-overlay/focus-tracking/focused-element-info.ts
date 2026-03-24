/**
 * Build FocusedElementInfo from a DOM node + VO announcement.
 */

import { ARIA_REQUIRED_PARENT_ROLES, getValidOwningParent, roleRequiresAriaParent } from './aria-required-parents';
import {
  getComputedDescription,
  getComputedName,
  getComputedRole,
  getStates,
} from './computed-accessible';
import {
  getElementSelector,
  getElementSnippet,
  getHeadingLevel,
  getParentContext,
  getPositionInSet,
} from './element-context';
import type { FocusedElementInfo } from './types';
import { generateVOAnnouncement } from '../vo-engine';

export function getElementInfo(
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

  const requiresOwnership = roleRequiresAriaParent(role);
  const validParent = getValidOwningParent(element, role);
  const hasValidOwnership = !requiresOwnership || validParent !== null;

  let ownershipIssue: string | null = null;
  if (requiresOwnership && !validParent) {
    const expectedParents = ARIA_REQUIRED_PARENT_ROLES[role];
    const expectedList = expectedParents.map((p) => `"${p}"`).join(' or ');
    ownershipIssue = `This ${role} must be inside a parent with role ${expectedList}`;
  }

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
