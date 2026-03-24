import { expect, test } from '@playwright/test';
import { scan, formatResults } from '@aclint/playwright';

const routes = [
  { path: '/', name: 'Landing' },
  { path: '/playground', name: 'Playground' },
  { path: '/package', name: 'Package docs' },
  { path: '/extension', name: 'Extension docs' },
];

for (const route of routes) {
  test(`${route.name} (${route.path}) has no serious a11y violations`, async ({ page }) => {
    await page.goto(route.path);
    await page.waitForLoadState('networkidle');

    const result = await scan(page, { minSeverity: 'serious' });

    if (result.violations.length > 0) {
      throw new Error(formatResults(result));
    }
  });
}

test('all routes return 200', async ({ page }) => {
  for (const route of routes) {
    const response = await page.goto(route.path);
    expect(response?.status(), `${route.path} should return 200`).toBe(200);
  }
});
