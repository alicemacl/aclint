/**
 * AccessLint Core integration for page-level WCAG auditing.
 *
 * Unlike axe-core (which scopes to a single element), AccessLint runs
 * against the full document. We cache the page audit and filter violations
 * to the currently focused element.
 */

import type { MappedIssue, Severity } from './map-violations';

type AccessLintViolation = {
  ruleId: string;
  message: string;
  selector: string;
  impact: string;
};

type PageAuditResult = {
  violations: AccessLintViolation[];
  timestamp: number;
};

let cachedPageResult: PageAuditResult | null = null;
const MIN_INTERVAL_MS = 3000;

/**
 * Run a page-level AccessLint audit (throttled + cached).
 * Returns only the violations relevant to the given element.
 */
export async function checkElementWithAccessLint(
  element: HTMLElement,
): Promise<MappedIssue[]> {
  const now = Date.now();

  if (!cachedPageResult || now - cachedPageResult.timestamp > MIN_INTERVAL_MS) {
    try {
      const { runAudit } = await import('@accesslint/core');
      const result = runAudit(document);

      cachedPageResult = {
        violations: result.violations as AccessLintViolation[],
        timestamp: now,
      };
    } catch (error) {
      console.error('[A11y Panel] AccessLint check failed:', error);
      return [];
    }
  }

  const elementViolations = filterViolationsForElement(
    element,
    cachedPageResult.violations,
  );

  return elementViolations.map(toMappedIssue);
}

/**
 * Invalidate the cached page audit so the next check re-runs.
 */
export function invalidateAccessLintCache(): void {
  cachedPageResult = null;
}

function filterViolationsForElement(
  element: HTMLElement,
  violations: AccessLintViolation[],
): AccessLintViolation[] {
  return violations.filter((v) => {
    try {
      const matched = document.querySelectorAll(v.selector);
      return Array.from(matched).some(
        (el) => el === element || element.contains(el),
      );
    } catch {
      return false;
    }
  });
}

function toMappedIssue(v: AccessLintViolation): MappedIssue {
  return {
    id: v.ruleId,
    title: v.message,
    severity: normalizeImpact(v.impact),
    guidance: null,
    learnMoreUrl: `https://accesslint.com/core/docs/rules/#${v.ruleId}`,
    axeHelp: v.message,
    axeDescription: v.message,
    source: 'accesslint',
  };
}

function normalizeImpact(impact: string): Severity | null {
  const valid: Severity[] = ['critical', 'serious', 'moderate', 'minor'];
  return valid.includes(impact as Severity) ? (impact as Severity) : null;
}
