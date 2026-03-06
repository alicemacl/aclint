/**
 * Axe-core integration with caching for efficient element checking.
 */

import type { RunOptions } from 'axe-core';

import type { AxeViolation, MappedIssue } from './map-violations';
import { mapViolationsToIssues } from './map-violations';

export type AxeCheckResult = {
  violations: AxeViolation[];
  issues: MappedIssue[];
  passes: number;
  incomplete: number;
  timestamp: number;
};

// Cache for element check results
const elementCache = new WeakMap<HTMLElement, AxeCheckResult>();

/**
 * Check a single element for accessibility violations.
 * Always runs fresh check to detect DOM changes.
 */
export async function checkElement(
  element: HTMLElement,
  options?: Partial<RunOptions>,
): Promise<AxeCheckResult> {
  // Always clear cache first to detect DOM changes
  elementCache.delete(element);

  const axe = await import('axe-core');

  const runOptions: RunOptions = {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
    },
    resultTypes: ['violations', 'passes', 'incomplete'],
    ...options,
  };

  try {
    const results = await axe.default.run(element, runOptions);

    const violations: AxeViolation[] = results.violations.map((v) => ({
      id: v.id,
      impact: v.impact as AxeViolation['impact'],
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      nodes: v.nodes.map((n) => ({
        html: n.html,
        failureSummary: n.failureSummary,
      })),
    }));

    const result: AxeCheckResult = {
      violations,
      issues: mapViolationsToIssues(violations),
      passes: results.passes.length,
      incomplete: results.incomplete.length,
      timestamp: Date.now(),
    };

    // Cache the result
    elementCache.set(element, result);

    return result;
  } catch (error) {
    console.error('[A11y Panel] axe-core check failed:', error);
    return {
      violations: [],
      issues: [],
      passes: 0,
      incomplete: 0,
      timestamp: Date.now(),
    };
  }
}

/**
 * Clear the cache for a specific element.
 */
export function clearElementCache(element: HTMLElement): void {
  elementCache.delete(element);
}

/**
 * Check if an element has cached results.
 */
export function hasCachedResult(element: HTMLElement): boolean {
  return elementCache.has(element);
}

/**
 * Get cached result for an element (if available).
 */
export function getCachedResult(element: HTMLElement): AxeCheckResult | undefined {
  return elementCache.get(element);
}
