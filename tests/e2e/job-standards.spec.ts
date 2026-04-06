import { test, expect } from '@playwright/test';

test.describe('Admin can manage job standards', () => {
  test.beforeEach(async ({ page }) => {
    const title = test.info().title;
    console.log(`[Test: ${title}] Navigating to /admin/job-standards...`);

    const response = await page.goto('/admin/job-standards');
    console.log(`[Test: ${title}] Status: ${response?.status()} | URL: ${page.url()}`);

    await expect(page).toHaveURL(/\/admin\/job-standards/);
    await expect(page.getByTestId('job-standards-page-nav')).toBeVisible();
  });

  test('Admin views the job standards list', async ({ page }) => {
    await expect(page.getByTestId('job-standards-list-container')).toBeVisible();

    // Wait for async data to load
    const firstItem = page.locator('[data-testid^="job-standard-item-"]').first();
    await expect(firstItem).toBeVisible({ timeout: 10000 });

    const count = await page.locator('[data-testid^="job-standard-item-"]').count();
    console.log(`[Job Standards List] Found ${count} items`);
    expect(count).toBeGreaterThan(0);
  });

  test('Admin sets score expectations for a job', async ({ page }) => {
    const title = test.info().title;
    const uniqueTitle = `E2E Job Title ${Date.now()}`;

    await page.getByTestId('job-title-input').fill(uniqueTitle);
    await page.getByTestId('score-expectation-input').fill('90');
    await page.getByTestId('save-score-btn').click();

    await expect(page.getByTestId('job-standards-created-alert'))
      .toContainText('Score expectations saved successfully');
    console.log(`[Test: ${title}] Score expectations saved for: ${uniqueTitle}`);
  });

  test('Admin sees validation error for empty fields', async ({ page }) => {
    await page.getByTestId('save-score-btn').click();

    await expect(page.getByTestId('job-standards-error-alert'))
      .toContainText('All fields are required');
  });
});
