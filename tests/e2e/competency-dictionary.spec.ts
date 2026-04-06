import { test, expect } from '@playwright/test';

test.describe('Admin can manage competency dictionaries', () => {
  test.beforeEach(async ({ page }) => {
    const title = test.info().title;
    console.log(`[Test: ${title}] Navigating to /admin/competency-dictionary...`);

    const response = await page.goto('/admin/competency-dictionary');
    console.log(`[Test: ${title}] Status: ${response?.status()} | URL: ${page.url()}`);

    await expect(page).toHaveURL(/\/admin\/competency-dictionary/);
    await expect(page.getByTestId('competency-dictionary-page-nav')).toBeVisible();
  });

  test('Admin views the competency dictionary list', async ({ page }) => {
    await expect(page.getByTestId('competency-dictionary-list-container')).toBeVisible();

    // Wait for async data to load
    const firstItem = page.locator('[data-testid^="competency-dictionary-item-"]').first();
    await expect(firstItem).toBeVisible({ timeout: 10000 });

    const count = await page.locator('[data-testid^="competency-dictionary-item-"]').count();
    console.log(`[Competency Dictionary List] Found ${count} items`);
    expect(count).toBeGreaterThan(0);
  });

  test('Admin uploads a valid template file', async ({ page }) => {
    const title = test.info().title;

    // Create a fake file to upload via the hidden file input
    const fileInput = page.getByTestId('template-file-input');
    await fileInput.setInputFiles({
      name: `E2E-Template-${Date.now()}.xlsx`,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      buffer: Buffer.from('fake-excel-content'),
    });

    await expect(page.getByTestId('upload-success-alert'))
      .toContainText('Template uploaded successfully');
    console.log(`[Test: ${title}] Template uploaded successfully`);
  });
});
