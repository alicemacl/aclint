import type { Page } from '@playwright/test';
import axe from 'axe-core';

import { BROWSER_SCRIPT } from './browser/inject';
import type { A11yViolation, ScanOptions, ScanResult, Severity } from './types';

const SEVERITY_ORDER: Severity[] = ['minor', 'moderate', 'serious', 'critical'];

function meetsMinSeverity(severity: Severity, min: Severity): boolean {
  return SEVERITY_ORDER.indexOf(severity) >= SEVERITY_ORDER.indexOf(min);
}

function mapAxeSeverity(impact: string | undefined): Severity {
  switch (impact) {
    case 'critical':
      return 'critical';
    case 'serious':
      return 'serious';
    case 'moderate':
      return 'moderate';
    default:
      return 'minor';
  }
}

async function injectHelpers(page: Page): Promise<void> {
  const alreadyInjected = await page.evaluate(() => '__aclint' in window);
  if (!alreadyInjected) {
    await page.addScriptTag({ content: BROWSER_SCRIPT });
  }
}

export async function scanPage(page: Page, options: ScanOptions = {}): Promise<ScanResult> {
  const {
    disableRules = [],
    minSeverity = 'minor',
    includePatterns = true,
    includeAxe = true,
    reactSourceMapping = true,
    scope = 'body',
  } = options;

  const start = Date.now();
  const url = page.url();
  const violations: A11yViolation[] = [];

  await injectHelpers(page);

  // ── axe-core ──
  if (includeAxe) {
    const axeAlready = await page.evaluate(() => 'axe' in window);
    if (!axeAlready) {
      await page.addScriptTag({ content: axe.source });
    }

    const axeViolations = await page.evaluate(
      ([scopeSel, disabled, doSourceMap]: [string, string[], boolean]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const axeLib = (window as any).axe;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const lens = (window as any).__aclint;
        const ctx = document.querySelector(scopeSel) ?? document;

        return axeLib
          .run(ctx, {
            rules: Object.fromEntries(disabled.map((id: string) => [id, { enabled: false }])),
          })
          .then(
            (results: {
              violations: {
                id: string;
                help: string;
                description: string;
                helpUrl: string;
                nodes: { target: string[]; html: string; impact?: string }[];
              }[];
            }) => {
              const out: {
                id: string;
                severity: string;
                message: string;
                help: string;
                selector: string;
                snippet: string;
                learnMoreUrl: string;
                sourceLocation: {
                  fileName: string;
                  lineNumber: number;
                  columnNumber?: number;
                } | null;
              }[] = [];

              for (const v of results.violations) {
                for (const node of v.nodes) {
                  const sel = node.target?.[0] ?? '';
                  const el = sel ? document.querySelector<HTMLElement>(sel) : null;

                  if (v.id === 'color-contrast' && el && lens.isContrastUnreliable(el)) {
                    continue;
                  }

                  let source = null;
                  if (doSourceMap && el) {
                    source = lens.getReactSource(el);
                  }

                  out.push({
                    id: v.id,
                    severity: node.impact ?? 'minor',
                    message: v.help,
                    help: v.description,
                    selector: sel,
                    snippet: (node.html ?? '').slice(0, 300),
                    learnMoreUrl: v.helpUrl,
                    sourceLocation: source,
                  });
                }
              }

              return out;
            },
          );
      },
      [scope, disableRules, reactSourceMapping] as [string, string[], boolean],
    );

    for (const v of axeViolations) {
      const severity = mapAxeSeverity(v.severity);
      if (!meetsMinSeverity(severity, minSeverity)) continue;

      violations.push({
        id: v.id,
        source: 'axe',
        severity,
        message: v.message,
        help: v.help,
        selector: v.selector,
        snippet: v.snippet,
        learnMoreUrl: v.learnMoreUrl,
        sourceLocation: v.sourceLocation ?? undefined,
      });
    }
  }

  // ── Pattern detection ──
  if (includePatterns) {
    const patternResults = await page.evaluate(
      ([scopeSel, doSourceMap]: [string, boolean]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const lens = (window as any).__aclint;
        const raw = lens.runPatterns(scopeSel);

        return raw.map(
          (v: {
            patternId: string;
            message: string;
            severity: string;
            suggestion: string;
            learnMoreUrl: string;
            selector: string;
            snippet: string;
          }) => {
            let source = null;
            if (doSourceMap && v.selector) {
              try {
                const el = document.querySelector<HTMLElement>(v.selector);
                if (el) source = lens.getReactSource(el);
              } catch { /* selector may not be querySelector-safe */ }
            }
            return { ...v, sourceLocation: source };
          },
        );
      },
      [scope, reactSourceMapping] as [string, boolean],
    );

    for (const v of patternResults) {
      if (!meetsMinSeverity(v.severity as Severity, minSeverity)) continue;

      violations.push({
        id: v.patternId,
        source: 'pattern',
        severity: v.severity as Severity,
        message: v.message,
        help: v.suggestion,
        selector: v.selector,
        snippet: v.snippet,
        learnMoreUrl: v.learnMoreUrl,
        sourceLocation: v.sourceLocation ?? undefined,
      });
    }
  }

  const elementsScanned = await page.evaluate((sel: string) => {
    const s = document.querySelector(sel) ?? document.body;
    return s.querySelectorAll('*').length;
  }, scope);

  return {
    url,
    violations,
    elementsScanned,
    scanDurationMs: Date.now() - start,
  };
}
