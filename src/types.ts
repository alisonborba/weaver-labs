import { z } from 'zod';

export type Ingredient = {
  id: string;
  name: string;
  unit: string;
  category: string;
};

export type IngredientWithRecipe = {
  quantity: number;
  ingredientId: string;
};

export type Recipe = {
  id: string;
  name: string;
  ingredients: IngredientWithRecipe[];
};

export type AppData = {
  ingredients: Ingredient[];
  recipes: Recipe[];
};

export type ApiResponse<T = unknown> = {
  message?: string;
  error?: string;
  data?: T;
  recipe?: Recipe;
  ingredient?: Ingredient;
  recipes?: Recipe[];
};

export const recipeFormSchema = z.object({
  name: z.string().min(1, 'Recipe name is required'),
  ingredients: z.array(
    z.object({
      ingredientId: z.string().min(1, 'Ingredient is required'),
      quantity: z.number().min(0.1, 'Quantity must be greater than 0'),
    })
  ),
});
export type RecipeFormData = z.infer<typeof recipeFormSchema>;

export const ingredientFormSchema = z.object({
  name: z.string().min(1, 'Ingredient name is required'),
  unit: z
    .string()
    .optional()
    .refine(val => val && val.length > 0, {
      message: 'Please select a unit',
    }),
  category: z
    .string()
    .optional()
    .refine(val => val && val.length > 0, {
      message: 'Please select a category',
    }),
});
export type IngredientFormData = z.infer<typeof ingredientFormSchema>;
