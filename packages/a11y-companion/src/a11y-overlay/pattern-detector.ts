/**
 * Runs semantic pattern checks against the focused element.
 */

import { ALL_PATTERNS } from './component-patterns';
import type { ComponentPattern } from './component-patterns';
import type { MappedIssue } from './map-violations';

export type PatternViolation = {
  patternId: string;
  patternName: string;
  message: string;
  severity: 'critical' | 'serious' | 'moderate';
  suggestion: string;
  learnMore: string;
};

function runPattern(pattern: ComponentPattern, element: HTMLElement): PatternViolation[] {
  if (!pattern.matches(element)) return [];
  const out: PatternViolation[] = [];
  for (const exp of pattern.expectations) {
    if (exp.check(element)) continue;
    out.push({
      patternId: `${pattern.id}:${exp.id}`,
      patternName: pattern.name,
      message: exp.message,
      severity: exp.severity,
      suggestion: exp.suggestion,
      learnMore: exp.learnMore,
    });
  }
  return out;
}

export function detectPatternIssues(
  element: HTMLElement,
  patterns: ComponentPattern[] = ALL_PATTERNS,
): PatternViolation[] {
  const violations: PatternViolation[] = [];
  for (const p of patterns) {
    violations.push(...runPattern(p, element));
  }
  return violations;
}

export function patternViolationsToMappedIssues(violations: PatternViolation[]): MappedIssue[] {
  return violations.map((v) => ({
    id: v.patternId,
    title: v.message,
    severity: v.severity,
    guidance: {
      why: v.patternName,
      fix: v.suggestion,
    },
    learnMoreUrl: v.learnMore,
    axeHelp: v.suggestion,
    axeDescription: v.message,
    source: 'pattern' as const,
  }));
}
