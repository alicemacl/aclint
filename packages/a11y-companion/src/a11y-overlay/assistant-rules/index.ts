/**
 * Assistant rules — human-readable guidance for axe-core violations.
 * Each rule lives in its own file under this folder.
 */

export type { AssistantRule, FixGuidance, VoiceOverTest } from './types';

import type { AssistantRule } from './types';

import { accessibleNameRule } from './accessible-name';
import { ariaRequiredParentRule } from './aria-required-parent';
import { ariaValidRule } from './aria-valid';
import { colorContrastRule } from './color-contrast';
import { disabledFocusableRule } from './disabled-focusable';
import { focusVisibilityRule } from './focus-visibility';
import { formLabelRule } from './form-label';
import { headingStructureRule } from './heading-structure';
import { imageAltRule } from './image-alt';
import { keyboardAccessibilityRule } from './keyboard-accessibility';
import { landmarkStructureRule } from './landmark-structure';
import { linkPurposeRule } from './link-purpose';
import { ARIA_REQUIRED_PARENT_ROLES } from '../focus-tracking/aria-required-parents';

export const ASSISTANT_RULES: AssistantRule[] = [
  accessibleNameRule,
  formLabelRule,
  imageAltRule,
  headingStructureRule,
  keyboardAccessibilityRule,
  landmarkStructureRule,
  colorContrastRule,
  focusVisibilityRule,
  ariaValidRule,
  ariaRequiredParentRule,
  disabledFocusableRule,
  linkPurposeRule,
];

const axeRuleIdMap = new Map<string, AssistantRule>();
for (const rule of ASSISTANT_RULES) {
  for (const axeId of rule.axeRuleIds) {
    axeRuleIdMap.set(axeId, rule);
  }
}

export function getAssistantRule(axeRuleId: string): AssistantRule | undefined {
  return axeRuleIdMap.get(axeRuleId);
}

export function hasAssistantRule(axeRuleId: string): boolean {
  return axeRuleIdMap.has(axeRuleId);
}

export function getRequiredParentGuidance(elementRole: string): string | null {
  const role = elementRole.toLowerCase();
  const parents = ARIA_REQUIRED_PARENT_ROLES[role];

  if (!parents) {
    return null;
  }

  const parentList = parents.map((p) => `role="${p}"`).join(' or ');
  return `This ${role} must be inside a parent with ${parentList}.`;
}
