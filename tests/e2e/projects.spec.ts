import { test, expect } from '@playwright/test';

test.describe('Admin can manage projects', () => {
  test.beforeEach(async ({ page }) => {
    const title = test.info().title;
    console.log(`[Test: ${title}] Navigating to /admin/projects...`);

    const response = await page.goto('/admin/projects');
    console.log(`[Test: ${title}] Status: ${response?.status()} | URL: ${page.url()}`);

    await expect(page).toHaveURL(/\/admin\/projects/);
    await expect(page.getByTestId('projects-menu')).toBeVisible();
  });

  test('Admin views the project list', async ({ page }) => {
    await expect(page.getByTestId('project-list')).toBeVisible();

    // Wait for async data to load
    const firstItem = page.locator('[data-testid^="project-item-"]').first();
    await expect(firstItem).toBeVisible({ timeout: 10000 });

    const count = await page.locator('[data-testid^="project-item-"]').count();
    console.log(`[Project List] Found ${count} items`);
    expect(count).toBeGreaterThan(0);
  });

  test('Admin creates a new project', async ({ page }) => {
    const uniqueName = `E2E Project ${Date.now()}`;

    await page.getByTestId('project-name-input').fill(uniqueName);
    await page.getByTestId('start-date-input').fill('2023-01-01');
    await page.getByTestId('end-date-input').fill('2023-12-31');
    await page.getByTestId('save-project-btn').click();

    await expect(page.getByTestId('project-created-alert'))
      .toContainText('Project created successfully');
    console.log(`[Project] Created: ${uniqueName}`);

    // Verify it appears in the list
    await expect(page.getByText(uniqueName)).toBeVisible({ timeout: 10000 });
  });

  test('Admin sees validation error for missing fields', async ({ page }) => {
    // Submit form with empty fields
    await page.getByTestId('save-project-btn').click();

    await expect(page.getByTestId('project-error-alert'))
      .toContainText('All fields are required');
  });

  test('Admin sees validation error for invalid date range', async ({ page }) => {
    await page.getByTestId('project-name-input').fill('Invalid Date Project');
    await page.getByTestId('start-date-input').fill('2023-12-31');
    await page.getByTestId('end-date-input').fill('2023-01-01');
    await page.getByTestId('save-project-btn').click();

    await expect(page.getByTestId('project-error-alert'))
      .toContainText('End date must be after start date');
  });

  test('Admin accesses projects via navigation link', async ({ page }) => {
    // Navigate away first
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin/);

    // Click the Projects nav link
    const projectsNav = page.getByTestId('projects-menu');
    await expect(projectsNav).toBeVisible();
    await projectsNav.click();

    await expect(page).toHaveURL(/\/admin\/projects/);
    await expect(page.getByTestId('project-list')).toBeVisible();
    console.log('[Navigation] Successfully navigated to Projects via nav link');
  });
});
