import { test, expect } from '@playwright/test';
import fs from 'fs/promises';

test.describe.serial('Insert and Delete Flow', () => {
  let ingredientName: string;
  let recipeName: string;

  test.beforeEach(async () => {
    // Generate random names for each test
    const randomNumber = Math.floor(Math.random() * 10000);
    ingredientName = `salt-${randomNumber}`;
    recipeName = `Test Recipe ${randomNumber}`;
  });

  test('create ingredient and recipe flow', async ({ page }) => {
    // Navigate to /ingredients and add an ingredient
    await page.goto('/ingredients');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Wait for table to be visible
    await page.locator('table').waitFor({ state: 'visible', timeout: 10000 });

    // Click Add Ingredient button to show form
    await page
      .getByRole('button', { name: 'Add Ingredient' })
      .waitFor({ state: 'visible', timeout: 10000 });
    await page.getByRole('button', { name: 'Add Ingredient' }).click();

    // Wait for form to be visible
    await page.waitForSelector('form', { timeout: 10000 });

    // Fill ingredient form
    await page.getByLabel('Name').waitFor({ state: 'visible', timeout: 10000 });
    await page.getByLabel('Name').fill(ingredientName);

    // Select unit - use a simpler approach to find the Select components
    // Find all SelectTrigger elements and click the first one (Unit)
    const selectTriggers = page.locator('[data-slot="select-trigger"]');
    await selectTriggers.first().waitFor({ state: 'visible', timeout: 10000 });
    await selectTriggers.first().click();
    await page
      .getByRole('option', { name: 'grams' })
      .waitFor({ state: 'visible', timeout: 10000 });
    await page.getByRole('option', { name: 'grams' }).click();

    // Select category - click the second SelectTrigger (Category)
    await selectTriggers.nth(1).waitFor({ state: 'visible', timeout: 10000 });
    await selectTriggers.nth(1).click();
    await page
      .getByRole('option', { name: 'baking' })
      .waitFor({ state: 'visible', timeout: 10000 });
    await page.getByRole('option', { name: 'baking' }).click();

    // Submit form
    await page
      .getByRole('button', { name: 'Save' })
      .waitFor({ state: 'visible', timeout: 10000 });
    await page.getByRole('button', { name: 'Save' }).click();

    // Check success message
    await expect(page.getByText('Ingredient created successfully')).toBeVisible(
      { timeout: 10000 }
    );

    // Wait for page to update
    await page.waitForLoadState('networkidle');

    // Navigate to /new-recipe and add a new recipe
    await page.goto('/new-recipe');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Fill recipe name
    await page
      .getByLabel('Recipe Name')
      .waitFor({ state: 'visible', timeout: 10000 });
    await page.getByLabel('Recipe Name').fill(recipeName);

    // Wait for ingredients to load and select the ingredient we just created
    await page.waitForSelector('[data-slot="select-trigger"]', {
      timeout: 10000,
    });

    // Select the ingredient we just created - use the first SelectTrigger
    const ingredientSelect = page
      .locator('[data-slot="select-trigger"]')
      .first();
    await ingredientSelect.waitFor({ state: 'visible', timeout: 10000 });
    await ingredientSelect.click();

    // Wait for the option to be visible and click it
    const ingredientOption = page.getByRole('option', {
      name: new RegExp(ingredientName),
    });
    await ingredientOption.waitFor({ state: 'visible', timeout: 10000 });
    await ingredientOption.click();

    // Fill quantity
    await page
      .getByLabel('Quantity')
      .waitFor({ state: 'visible', timeout: 10000 });
    await page.getByLabel('Quantity').fill('100');

    // Add ingredient
    await page
      .getByRole('button', { name: 'Add Ingredient' })
      .waitFor({ state: 'visible', timeout: 10000 });
    await page.getByRole('button', { name: 'Add Ingredient' }).click();

    // Submit the form
    await page
      .getByRole('button', { name: 'Save Recipe' })
      .waitFor({ state: 'visible', timeout: 10000 });
    await page.getByRole('button', { name: 'Save Recipe' }).click();

    // Check success message
    await expect(page.getByText('Recipe created successfully')).toBeVisible({
      timeout: 10000,
    });

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check if table is visible and contains recipes
    await expect(page.locator('table')).toBeVisible({ timeout: 10000 });

    // Check if the last recipe is the one we just created
    await expect(page.getByText(recipeName)).toBeVisible({ timeout: 10000 });

    // Check if the ingredient is listed in the recipe
    await expect(page.getByText(ingredientName)).toBeVisible({
      timeout: 10000,
    });
  });

  test('delete all recipes and check empty table', async ({ page }) => {
    await page.goto('/recipes');

    await page.waitForLoadState('networkidle');

    // Wait for table to be visible
    await page.locator('table').waitFor({ state: 'visible', timeout: 10000 });

    // Get all delete buttons for recipes
    const deleteButtons = page.getByRole('button', { name: 'Delete' });
    const count = await deleteButtons.count();

    console.log(`Found ${count} recipes to delete`);

    // Delete all recipes
    for (let i = 0; i < count; i++) {
      // Wait for delete button to be visible and clickable
      await page
        .getByRole('button', { name: 'Delete' })
        .first()
        .waitFor({ state: 'visible', timeout: 10000 });
      await page.getByRole('button', { name: 'Delete' }).first().click();

      // Wait for confirmation dialog and confirm deletion
      await page
        .getByRole('button', { name: 'Delete' })
        .last()
        .waitFor({ state: 'visible', timeout: 10000 });
      await page.getByRole('button', { name: 'Delete' }).last().click();

      // Wait for the deletion to complete
      await page.waitForLoadState('networkidle');

      // Wait a bit more to ensure UI updates
      await page.waitForTimeout(1000);
    }

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Wait for table to be visible again
    await page.locator('table').waitFor({ state: 'visible', timeout: 10000 });

    // Check if table is empty - wait for the message to appear
    await expect(page.getByText('No recipes found.')).toBeVisible({
      timeout: 10000,
    });

    // Check if total is 0
    await expect(page.getByText('Total Recipes: 0')).toBeVisible({
      timeout: 10000,
    });
  });

  test('delete all ingredients and check empty table', async ({ page }) => {
    await page.goto('/ingredients');

    await page.waitForLoadState('networkidle');

    // Wait for table to be visible
    await page.locator('table').waitFor({ state: 'visible', timeout: 10000 });

    // Get all delete buttons for ingredients
    const deleteButtons = page.getByRole('button', { name: 'Delete' });
    const count = await deleteButtons.count();

    console.log(`Found ${count} ingredients to delete`);

    // Delete all ingredients
    for (let i = 0; i < count; i++) {
      // Wait for delete button to be visible and clickable
      await page
        .getByRole('button', { name: 'Delete' })
        .first()
        .waitFor({ state: 'visible', timeout: 10000 });
      await page.getByRole('button', { name: 'Delete' }).first().click();

      // Wait for confirmation dialog and confirm deletion
      await page
        .getByRole('button', { name: 'Delete' })
        .last()
        .waitFor({ state: 'visible', timeout: 10000 });
      await page.getByRole('button', { name: 'Delete' }).last().click();

      // Wait for the deletion to complete
      await page.waitForLoadState('networkidle');

      // Wait a bit more to ensure UI updates
      await page.waitForTimeout(1000);
    }

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Wait for table to be visible again
    await page.locator('table').waitFor({ state: 'visible', timeout: 10000 });

    // Check if table is empty - wait for the message to appear
    await expect(page.getByText('No ingredients found.')).toBeVisible({
      timeout: 10000,
    });

    // Check if total is 0
    await expect(page.getByText('Total Ingredients: 0')).toBeVisible({
      timeout: 10000,
    });
  });

  test('recipes table shows empty state correctly', async ({ page }) => {
    await page.goto('/recipes');

    await page.waitForLoadState('networkidle');

    // Check if table structure is present even when empty
    await expect(page.locator('table')).toBeVisible();

    // Check table headers using more specific selectors
    const tableHeaders = page.locator('th');
    await expect(tableHeaders.filter({ hasText: 'Name' })).toBeVisible();
    await expect(tableHeaders.filter({ hasText: 'Ingredients' })).toBeVisible();
    await expect(tableHeaders.filter({ hasText: 'Action' })).toBeVisible();
  });

  test('ingredients table shows empty state correctly', async ({ page }) => {
    await page.goto('/ingredients');

    await page.waitForLoadState('networkidle');

    // Check if table structure is present even when empty
    await expect(page.locator('table')).toBeVisible();

    // Check table headers using more specific selectors
    const tableHeaders = page.locator('th');
    await expect(tableHeaders.filter({ hasText: 'Name' })).toBeVisible();
    await expect(tableHeaders.filter({ hasText: 'Unit' })).toBeVisible();
    await expect(tableHeaders.filter({ hasText: 'Category' })).toBeVisible();
    await expect(tableHeaders.filter({ hasText: 'Actions' })).toBeVisible();
  });

  test.afterAll(async () => {
    const originalData = await fs.readFile(
      'src/lib/data-original.json',
      'utf-8'
    );
    await fs.writeFile('src/lib/data.json', originalData);
    console.log('✅ data.json has been restored from data-original.json');
  });
});
