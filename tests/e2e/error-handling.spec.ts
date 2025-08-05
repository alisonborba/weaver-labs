import { test, expect } from '@playwright/test';

test.describe('Error Handling Tests', () => {
  test('create recipe with invalid data', async ({ page }) => {
    await page.goto('/new-recipe');
    await page.waitForLoadState('networkidle');

    // Try to submit form without filling required fields
    await page
      .getByRole('button', { name: 'Save Recipe' })
      .waitFor({ state: 'visible', timeout: 10000 });
    await page.getByRole('button', { name: 'Save Recipe' }).click();

    // Check if error messages are displayed
    await expect(page.getByText('Recipe name is required')).toBeVisible({
      timeout: 10000,
    });
  });

  test('create ingredient with invalid data', async ({ page }) => {
    await page.goto('/ingredients');
    await page.waitForLoadState('networkidle');

    // Click Add Ingredient button to show form
    await page
      .getByRole('button', { name: 'Add Ingredient' })
      .waitFor({ state: 'visible', timeout: 10000 });
    await page.getByRole('button', { name: 'Add Ingredient' }).click();

    // Try to submit form without filling required fields
    await page
      .getByRole('button', { name: 'Save' })
      .waitFor({ state: 'visible', timeout: 10000 });
    await page.getByRole('button', { name: 'Save' }).click();

    // Check if error messages are displayed
    await expect(page.getByText('Name is required')).toBeVisible({
      timeout: 10000,
    });
  });

  test('delete ingredient that is being used', async ({ page }) => {
    // First, create an ingredient and a recipe that uses it
    const randomNumber = Math.floor(Math.random() * 10000);
    const ingredientName = `test-ingredient-${randomNumber}`;
    const recipeName = `test-recipe-${randomNumber}`;

    // Create ingredient
    await page.goto('/ingredients');
    await page.waitForLoadState('networkidle');

    await page
      .getByRole('button', { name: 'Add Ingredient' })
      .waitFor({ state: 'visible', timeout: 10000 });
    await page.getByRole('button', { name: 'Add Ingredient' }).click();

    await page.getByLabel('Name').waitFor({ state: 'visible', timeout: 10000 });
    await page.getByLabel('Name').fill(ingredientName);

    // Select unit - use the first SelectTrigger
    const selectTriggers = page.locator('[data-slot="select-trigger"]');
    await selectTriggers.first().waitFor({ state: 'visible', timeout: 10000 });
    await selectTriggers.first().click();
    await page
      .getByRole('option', { name: 'grams' })
      .waitFor({ state: 'visible', timeout: 10000 });
    await page.getByRole('option', { name: 'grams' }).click();

    // Select category - use the second SelectTrigger
    await selectTriggers.nth(1).waitFor({ state: 'visible', timeout: 10000 });
    await selectTriggers.nth(1).click();
    await page
      .getByRole('option', { name: 'baking' })
      .waitFor({ state: 'visible', timeout: 10000 });
    await page.getByRole('option', { name: 'baking' }).click();

    await page
      .getByRole('button', { name: 'Save' })
      .waitFor({ state: 'visible', timeout: 10000 });
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByText('Ingredient created successfully')).toBeVisible(
      {
        timeout: 10000,
      }
    );

    // Wait for page to update
    await page.waitForLoadState('networkidle');

    // Create recipe using the ingredient
    await page.goto('/new-recipe');
    await page.waitForLoadState('networkidle');

    await page
      .getByLabel('Recipe Name')
      .waitFor({ state: 'visible', timeout: 10000 });
    await page.getByLabel('Recipe Name').fill(recipeName);

    await page.waitForSelector('[data-slot="select-trigger"]', {
      timeout: 10000,
    });

    // Select the ingredient we just created
    const ingredientSelect = page
      .locator('[data-slot="select-trigger"]')
      .first();
    await ingredientSelect.waitFor({ state: 'visible', timeout: 10000 });
    await ingredientSelect.click();

    const ingredientOption = page.getByRole('option', {
      name: new RegExp(ingredientName),
    });
    await ingredientOption.waitFor({ state: 'visible', timeout: 10000 });
    await ingredientOption.click();

    await page
      .getByLabel('Quantity')
      .waitFor({ state: 'visible', timeout: 10000 });
    await page.getByLabel('Quantity').fill('100');

    await page
      .getByRole('button', { name: 'Add Ingredient' })
      .waitFor({ state: 'visible', timeout: 10000 });
    await page.getByRole('button', { name: 'Add Ingredient' }).click();

    await page
      .getByRole('button', { name: 'Save Recipe' })
      .waitFor({ state: 'visible', timeout: 10000 });
    await page.getByRole('button', { name: 'Save Recipe' }).click();

    await expect(page.getByText('Recipe created successfully')).toBeVisible({
      timeout: 10000,
    });

    await page.waitForTimeout(2000);

    // Now try to delete the ingredient
    await page.goto('/ingredients');
    await page.waitForLoadState('networkidle');

    // Wait for table to be visible
    await page.locator('table').waitFor({ state: 'visible', timeout: 10000 });

    // Find and click delete button for the ingredient
    const ingredientRow = page
      .locator('tr')
      .filter({ hasText: ingredientName });

    await ingredientRow.waitFor({ state: 'visible', timeout: 10000 });
    await ingredientRow
      .getByRole('button', { name: 'Delete' })
      .waitFor({ state: 'visible', timeout: 10000 });
    await ingredientRow.getByRole('button', { name: 'Delete' }).click();

    // Check if error message is displayed
    await expect(page.getByText('Cannot delete this ingredient')).toBeVisible({
      timeout: 10000,
    });
    await expect(
      page.getByText('It is being used by the following recipes')
    ).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(recipeName)).toBeVisible({ timeout: 10000 });
  });
});
