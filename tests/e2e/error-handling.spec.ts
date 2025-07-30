import { test, expect } from '@playwright/test';

test.describe('Error Handling Tests', () => {
  test('create recipe with invalid data', async ({ page }) => {
    await page.goto('/new-recipe');

    // Try to submit form without filling required fields
    await page.getByRole('button', { name: 'Save Recipe' }).click();

    // Check if error messages are displayed
    await expect(page.getByText('Recipe name is required')).toBeVisible();
  });

  test('create ingredient with invalid data', async ({ page }) => {
    await page.goto('/ingredients');

    // Click Add Ingredient button to show form
    await page.getByRole('button', { name: 'Add Ingredient' }).click();

    // Try to submit form without filling required fields
    await page.getByRole('button', { name: 'Save' }).click();

    // Check if error messages are displayed
    await expect(page.getByText('Name is required')).toBeVisible();
  });

  test('delete ingredient that is being used', async ({ page }) => {
    // First, create an ingredient and a recipe that uses it
    const randomNumber = Math.floor(Math.random() * 10000);
    const ingredientName = `test-ingredient-${randomNumber}`;
    const recipeName = `test-recipe-${randomNumber}`;

    // Create ingredient
    await page.goto('/ingredients');
    await page.getByRole('button', { name: 'Add Ingredient' }).click();
    await page.getByLabel('Name').fill(ingredientName);

    // Select unit - use the first SelectTrigger
    const selectTriggers = page.locator('[data-slot="select-trigger"]');
    await selectTriggers.first().click();
    await page.getByRole('option', { name: 'grams' }).click();

    // Select category - use the second SelectTrigger
    await selectTriggers.nth(1).click();
    await page.getByRole('option', { name: 'baking' }).click();

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByText('Ingredient created successfully')).toBeVisible(
      {
        timeout: 5000,
      }
    );

    // Create recipe using the ingredient
    await page.goto('/new-recipe');
    await page.getByLabel('Recipe Name').fill(recipeName);
    await page.waitForSelector('[data-slot="select-trigger"]', {
      timeout: 10000,
    });

    // Select the ingredient we just created
    const ingredientSelect = page
      .locator('[data-slot="select-trigger"]')
      .first();
    await ingredientSelect.click();
    await page
      .getByRole('option', { name: new RegExp(ingredientName) })
      .click();

    await page.getByLabel('Quantity').fill('100');
    await page.getByRole('button', { name: 'Add Ingredient' }).click();
    await page.getByRole('button', { name: 'Save Recipe' }).click();
    await expect(page.getByText('Recipe created successfully')).toBeVisible();

    // Now try to delete the ingredient
    await page.goto('/ingredients');

    // Find and click delete button for the ingredient
    const ingredientRow = page
      .locator('tr')
      .filter({ hasText: ingredientName });
    await ingredientRow.getByRole('button', { name: 'Delete' }).click();

    // Check if error message is displayed
    await expect(page.getByText('Cannot delete this ingredient')).toBeVisible();
    await expect(
      page.getByText('It is being used by the following recipes')
    ).toBeVisible();
    await expect(page.getByText(recipeName)).toBeVisible();
  });
});
