import { test, expect } from '@playwright/test';

test.describe('Admin can manage exam scenarios', () => {
  test.beforeEach(async ({ page }) => {
    const title = test.info().title;
    console.log(`[Test: ${title}] Navigating to /admin/scenario-management...`);

    const response = await page.goto('/admin/scenario-management');
    console.log(`[Test: ${title}] Status: ${response?.status()} | URL: ${page.url()}`);

    await expect(page).toHaveURL(/\/admin\/scenario-management/);
    await expect(page.getByTestId('scenario-management-page-nav')).toBeVisible();
  });

  test('Admin views the scenarios list', async ({ page }) => {
    await expect(page.getByTestId('scenario-list-container')).toBeVisible();

    // Wait for async data to load
    const firstItem = page.locator('[data-testid^="scenario-item-"]').first();
    await expect(firstItem).toBeVisible({ timeout: 10000 });

    const count = await page.locator('[data-testid^="scenario-item-"]').count();
    console.log(`[Scenario List] Found ${count} items`);
    expect(count).toBeGreaterThan(0);
  });

  test('Admin configures a new exam scenario', async ({ page }) => {
    const title = test.info().title;
    const uniqueName = `E2E Scenario ${Date.now()}`;

    await page.getByTestId('scenario-name-input').fill(uniqueName);
    await page.getByTestId('save-scenario-btn').click();

    await expect(page.getByTestId('scenario-created-alert'))
      .toContainText('Scenario saved successfully');
    console.log(`[Test: ${title}] Scenario created: ${uniqueName}`);
  });

  test('Admin sees validation error for empty scenario name', async ({ page }) => {
    await page.getByTestId('save-scenario-btn').click();

    await expect(page.getByTestId('scenario-error-alert'))
      .toContainText('Scenario name is required');
  });
});
