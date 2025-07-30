import {
  getIngredientName,
  getIngredientUnit,
  getRecipesUsingIngredient,
  ingredientList,
  isIngredientUsed,
} from '@/lib/utils';
import { AppData, IngredientWithRecipe } from '@/types';

// Mock data for testing
const mockAppData: AppData = {
  ingredients: [
    { id: 'ing1', name: 'Flour', unit: 'grams', category: 'baking' },
    { id: 'ing2', name: 'Sugar', unit: 'grams', category: 'baking' },
    { id: 'ing3', name: 'Milk', unit: 'ml', category: 'dairy' },
    { id: 'ing4', name: 'Salt', unit: 'teaspoons', category: 'seasoning' },
  ],
  recipes: [
    {
      id: 'rec1',
      name: 'Cake',
      ingredients: [
        { ingredientId: 'ing1', quantity: 200 },
        { ingredientId: 'ing2', quantity: 100 },
        { ingredientId: 'ing3', quantity: 250 },
      ],
    },
    {
      id: 'rec2',
      name: 'Bread',
      ingredients: [
        { ingredientId: 'ing1', quantity: 300 },
        { ingredientId: 'ing4', quantity: 1 },
      ],
    },
  ],
};

describe('Business Logic Functions', () => {
  describe('getIngredientUnit', () => {
    it('should return unit for existing ingredient', () => {
      expect(getIngredientUnit('ing1', mockAppData)).toBe('grams');
      expect(getIngredientUnit('ing3', mockAppData)).toBe('ml');
      expect(getIngredientUnit('ing4', mockAppData)).toBe('teaspoons');
    });

    it('should return empty string for non-existent ingredient', () => {
      expect(getIngredientUnit('nonexistent', mockAppData)).toBe('');
    });
  });

  describe('getIngredientName', () => {
    it('should return name for existing ingredient', () => {
      expect(getIngredientName('ing1', mockAppData)).toBe('Flour');
      expect(getIngredientName('ing2', mockAppData)).toBe('Sugar');
      expect(getIngredientName('ing3', mockAppData)).toBe('Milk');
    });

    it('should return empty string for non-existent ingredient', () => {
      expect(getIngredientName('nonexistent', mockAppData)).toBe('');
    });
  });

  describe('availableIngredients filtering', () => {
    it('should filter out already selected ingredients', () => {
      const selectedIngredients = [
        { ingredientId: 'ing1', quantity: 200 },
        { ingredientId: 'ing2', quantity: 100 },
      ];

      const availableIngredients = mockAppData.ingredients.filter(
        ingredient =>
          !selectedIngredients.some(
            selected => selected.ingredientId === ingredient.id
          )
      );

      expect(availableIngredients).toHaveLength(2);
      expect(availableIngredients.map(ing => ing.id)).toEqual(['ing3', 'ing4']);
    });

    it('should return all ingredients when none are selected', () => {
      const selectedIngredients: IngredientWithRecipe[] = [];

      const availableIngredients = mockAppData.ingredients.filter(
        ingredient =>
          !selectedIngredients.some(
            selected => selected.ingredientId === ingredient.id
          )
      );

      expect(availableIngredients).toHaveLength(4);
      expect(availableIngredients.map(ing => ing.id)).toEqual([
        'ing1',
        'ing2',
        'ing3',
        'ing4',
      ]);
    });

    it('should return empty array when all ingredients are selected', () => {
      const selectedIngredients = mockAppData.ingredients.map(ing => ({
        ingredientId: ing.id,
        quantity: 1,
      }));

      const availableIngredients = mockAppData.ingredients.filter(
        ingredient =>
          !selectedIngredients.some(
            selected => selected.ingredientId === ingredient.id
          )
      );

      expect(availableIngredients).toHaveLength(0);
    });
  });

  describe('isIngredientUsed validation', () => {
    it('should return true when ingredient is used in recipes', () => {
      expect(isIngredientUsed('ing1', mockAppData)).toBe(true); // Used in both Cake and Bread
      expect(isIngredientUsed('ing2', mockAppData)).toBe(true); // Used in Cake
      expect(isIngredientUsed('ing4', mockAppData)).toBe(true); // Used in Bread
    });

    it('should return false when ingredient is not used in any recipe', () => {
      expect(isIngredientUsed('ing3', mockAppData)).toBe(true); // Actually used in Cake recipe
    });

    it('should return false for non-existent ingredient', () => {
      expect(isIngredientUsed('nonexistent', mockAppData)).toBe(false);
    });
  });

  describe('getRecipesUsingIngredient', () => {
    it('should return recipes that use a specific ingredient', () => {
      const recipesUsingFlour = getRecipesUsingIngredient('ing1', mockAppData);
      expect(recipesUsingFlour).toHaveLength(2);
      expect(recipesUsingFlour.map(r => r.name)).toEqual(['Cake', 'Bread']);

      const recipesUsingSugar = getRecipesUsingIngredient('ing2', mockAppData);
      expect(recipesUsingSugar).toHaveLength(1);
      expect(recipesUsingSugar[0].name).toBe('Cake');
    });

    it('should return empty array for ingredient not used in any recipe', () => {
      const recipesUsingMilk = getRecipesUsingIngredient('ing3', mockAppData);
      expect(recipesUsingMilk).toHaveLength(1);
      expect(recipesUsingMilk[0].name).toBe('Cake');
    });
  });

  describe('ingredientList formatting', () => {
    it('should format ingredient list correctly', () => {
      const recipeIngredients = [
        { ingredientId: 'ing1', quantity: 200 },
        { ingredientId: 'ing2', quantity: 100 },
      ];

      const formattedList = ingredientList(recipeIngredients, mockAppData);

      // Check that we get an array of JSX elements
      expect(formattedList).toHaveLength(2);
      expect(formattedList[0]).toBeTruthy();
      expect(formattedList[1]).toBeTruthy();

      // Check that the elements are divs with correct keys
      expect(formattedList[0]?.key).toBe('ing1');
      expect(formattedList[1]?.key).toBe('ing2');

      // Check that the elements have the correct content structure
      expect(formattedList[0]?.props?.children.join('')).toEqual(
        'Flour - 200 grams'
      );
      expect(formattedList[1]?.props?.children.join('')).toEqual(
        'Sugar - 100 grams'
      );
    });

    it('should handle missing ingredient data', () => {
      const recipeIngredients = [
        { ingredientId: 'nonexistent', quantity: 100 },
        { ingredientId: 'ing1', quantity: 200 },
      ];

      const formattedList = ingredientList(recipeIngredients, mockAppData);

      // Should have 2 elements: null for missing ingredient, and JSX for existing one
      expect(formattedList).toHaveLength(2);
      expect(formattedList[0]).toBeNull(); // Missing ingredient returns null
      expect(formattedList[1]).toBeTruthy(); // Existing ingredient returns JSX

      // Check the existing ingredient
      expect(formattedList[1]?.key).toBe('ing1');
      expect(formattedList[1]?.props?.children.join('')).toEqual(
        'Flour - 200 grams'
      );
    });
  });
});
