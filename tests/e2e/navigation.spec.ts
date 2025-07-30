import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('homepage navigation elements', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /Orchestrate Your Dishes/ })
    ).toBeVisible();

    await expect(
      page.getByRole('link', { name: 'Check Recipes' })
    ).toBeVisible();

    await expect(
      page.getByRole('link', { name: 'Manage Ingredients' })
    ).toBeVisible();

    await expect(
      page.getByRole('link', { name: 'Create New Recipe' })
    ).toBeVisible();
  });

  test('navigate to recipes page', async ({ page }) => {
    await page.getByRole('link', { name: 'Check Recipes' }).click();
    await expect(page).toHaveURL('/recipes');

    await expect(
      page.locator('h1').filter({ hasText: 'Recipes List' })
    ).toBeVisible();
  });

  test('navigate to ingredients page', async ({ page }) => {
    await page.getByRole('link', { name: 'Manage Ingredients' }).click();
    await expect(page).toHaveURL('/ingredients');

    await expect(
      page.locator('h1').filter({ hasText: 'Ingredients List' })
    ).toBeVisible();
  });

  test('navigate to new recipe page', async ({ page }) => {
    await page.getByRole('link', { name: 'Create New Recipe' }).click();
    await expect(page).toHaveURL('/new-recipe');

    await expect(
      page.locator('h1').filter({ hasText: 'New Recipe' })
    ).toBeVisible();
  });

  test('mobile navigation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/recipes');

    await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible();

    await expect(page.getByText('Weaver Plate')).toBeVisible();

    await page.getByRole('button', { name: 'Open menu' }).click();

    await expect(
      page.getByRole('link', { name: 'Recipes List' })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Ingredients List' })
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'New Recipe' })).toBeVisible();

    await page.getByRole('link', { name: 'Ingredients List' }).click();
    await expect(page).toHaveURL('/ingredients');
  });
});
