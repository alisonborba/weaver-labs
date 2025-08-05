import { recipeFormSchema } from '@/lib/types';

describe('recipeFormSchema', () => {
  describe('valid data', () => {
    it('should validate recipe with single ingredient', () => {
      const validData = {
        name: 'Test Recipe',
        ingredients: [{ ingredientId: 'ing1', quantity: 1.5 }],
      };

      const result = recipeFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate recipe with multiple ingredients', () => {
      const validData = {
        name: 'Complex Recipe',
        ingredients: [
          { ingredientId: 'ing1', quantity: 2.0 },
          { ingredientId: 'ing2', quantity: 0.5 },
          { ingredientId: 'ing3', quantity: 3 },
        ],
      };

      const result = recipeFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate recipe with minimum valid name length', () => {
      const validData = {
        name: 'A',
        ingredients: [{ ingredientId: 'ing1', quantity: 1 }],
      };

      const result = recipeFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate recipe with maximum valid name length', () => {
      const validData = {
        name: 'A'.repeat(25),
        ingredients: [{ ingredientId: 'ing1', quantity: 1 }],
      };

      const result = recipeFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid data', () => {
    it('should reject recipe without name', () => {
      const invalidData = {
        name: '',
        ingredients: [{ ingredientId: 'ing1', quantity: 1 }],
      };

      const result = recipeFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('Recipe name is required');
    });

    it('should reject recipe with name too long', () => {
      const invalidData = {
        name: 'A'.repeat(31),
        ingredients: [{ ingredientId: 'ing1', quantity: 1 }],
      };

      const result = recipeFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('Name is too long');
    });

    it('should reject recipe without ingredients', () => {
      const invalidData = {
        name: 'Test Recipe',
        ingredients: [],
      };

      const result = recipeFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe(
        'At least one ingredient is required'
      );
    });

    it('should reject recipe with invalid ingredient structure', () => {
      const invalidData = {
        name: 'Test Recipe',
        ingredients: [
          { ingredientId: '', quantity: 1 }, // empty ingredientId
        ],
      };

      const result = recipeFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('Ingredient is required');
    });

    it('should reject recipe with invalid quantity', () => {
      const invalidData = {
        name: 'Test Recipe',
        ingredients: [
          { ingredientId: 'ing1', quantity: 0 }, // quantity must be > 0
        ],
      };

      const result = recipeFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe(
        'Quantity must be greater than 0'
      );
    });

    it('should reject recipe with negative quantity', () => {
      const invalidData = {
        name: 'Test Recipe',
        ingredients: [{ ingredientId: 'ing1', quantity: -1 }],
      };

      const result = recipeFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe(
        'Quantity must be greater than 0'
      );
    });

    it('should reject recipe with missing ingredient fields', () => {
      const invalidData = {
        name: 'Test Recipe',
        ingredients: [
          { ingredientId: 'ing1' }, // missing quantity
        ],
      };

      const result = recipeFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle null values', () => {
      const invalidData = {
        name: null,
        ingredients: null,
      };

      const result = recipeFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should handle undefined values', () => {
      const invalidData = {
        name: undefined,
        ingredients: undefined,
      };

      const result = recipeFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should handle wrong data types', () => {
      const invalidData = {
        name: 123,
        ingredients: 'not an array',
      };

      const result = recipeFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
