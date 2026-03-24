import { test as base, type Page } from '@playwright/test';

import { buildFailureMessage, formatResults } from './reporter';
import { scanPage } from './scanner';
import type { ScanOptions, ScanResult } from './types';

export type A11yFixtures = {
  a11yScan: (options?: ScanOptions) => Promise<ScanResult>;
};

/**
 * Extended Playwright test with `a11yScan` fixture.
 *
 * @example
 * ```ts
 * import { test, expect } from '@aclint/playwright';
 *
 * test('page is accessible', async ({ page, a11yScan }) => {
 *   await page.goto('/');
 *   const result = await a11yScan();
 *   expect(result.violations).toEqual([]);
 * });
 * ```
 */
export const test = base.extend<A11yFixtures>({
  a11yScan: async ({ page }, use) => {
    const scan = async (options?: ScanOptions) => {
      const result = await scanPage(page, options);
      // eslint-disable-next-line no-console
      console.log(formatResults(result));
      return result;
    };
    await use(scan);
  },
});

/**
 * Standalone scan function — use when you don't want the fixture.
 *
 * @example
 * ```ts
 * import { scan } from '@aclint/playwright';
 *
 * test('check a11y', async ({ page }) => {
 *   await page.goto('/');
 *   const result = await scan(page);
 *   expect(result.violations).toHaveLength(0);
 * });
 * ```
 */
export async function scan(page: Page, options?: ScanOptions): Promise<ScanResult> {
  return scanPage(page, options);
}

/**
 * Assert no violations, with formatted failure message.
 */
export async function assertAccessible(page: Page, options?: ScanOptions): Promise<void> {
  const result = await scanPage(page, options);
  // eslint-disable-next-line no-console
  console.log(formatResults(result));
  const msg = buildFailureMessage(result);
  if (msg) throw new Error(msg);
}
