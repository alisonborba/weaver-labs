import { ingredientFormSchema } from '@/types';

describe('ingredientFormSchema', () => {
  describe('valid data', () => {
    it('should validate ingredient with all fields', () => {
      const validData = {
        name: 'Test Ingredient',
        unit: 'grams',
        category: 'baking',
      };

      const result = ingredientFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate ingredient with minimum valid name length', () => {
      const validData = {
        name: 'A',
        unit: 'ml',
        category: 'dairy',
      };

      const result = ingredientFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate ingredient with maximum valid name length', () => {
      const validData = {
        name: 'A'.repeat(25),
        unit: 'pieces',
        category: 'seasoning',
      };

      const result = ingredientFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid data', () => {
    it('should reject ingredient without name', () => {
      const invalidData = {
        name: '',
        unit: 'grams',
        category: 'baking',
      };

      const result = ingredientFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe(
        'Ingredient name is required'
      );
    });

    it('should reject ingredient with name too long', () => {
      const invalidData = {
        name: 'A'.repeat(26),
        unit: 'grams',
        category: 'baking',
      };

      const result = ingredientFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('Name is too long');
    });

    it('should reject ingredient without unit', () => {
      const invalidData = {
        name: 'Test Ingredient',
        unit: '',
        category: 'baking',
      };

      const result = ingredientFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('Please select a unit');
    });

    it('should reject ingredient without category', () => {
      const invalidData = {
        name: 'Test Ingredient',
        unit: 'grams',
        category: '',
      };

      const result = ingredientFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('Please select a category');
    });

    it('should reject ingredient with undefined unit', () => {
      const invalidData = {
        name: 'Test Ingredient',
        unit: undefined,
        category: 'baking',
      };

      const result = ingredientFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('Please select a unit');
    });

    it('should reject ingredient with undefined category', () => {
      const invalidData = {
        name: 'Test Ingredient',
        unit: 'grams',
        category: undefined,
      };

      const result = ingredientFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('Please select a category');
    });
  });

  describe('edge cases', () => {
    it('should handle null values', () => {
      const invalidData = {
        name: null,
        unit: null,
        category: null,
      };

      const result = ingredientFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should handle wrong data types', () => {
      const invalidData = {
        name: 123,
        unit: 456,
        category: 789,
      };

      const result = ingredientFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should handle missing fields', () => {
      const invalidData = {
        name: 'Test Ingredient',
        // missing unit and category
      };

      const result = ingredientFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
