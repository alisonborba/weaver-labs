import { AppData, IngredientWithRecipe, Recipe } from '@/lib/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Get ingredient unit
export const getIngredientUnit = (ingredientId: string, data?: AppData) => {
  const ingredient = data?.ingredients.find(ing => ing.id === ingredientId);
  return ingredient?.unit || '';
};

// Get ingredient name
export const getIngredientName = (ingredientId: string, data?: AppData) => {
  const ingredient = data?.ingredients.find(ing => ing.id === ingredientId);
  return ingredient?.name || '';
};

// Get ingredient list
export const ingredientList = (
  ingredients: IngredientWithRecipe[],
  data: AppData
) => {
  return ingredients.map(ingredient => {
    const ingredientData = data?.ingredients.find(
      ing => ing.id === ingredient.ingredientId
    );
    if (!ingredientData) return null;
    return (
      <div key={ingredient.ingredientId}>
        {ingredientData.name} - {ingredient.quantity} {ingredientData.unit}
      </div>
    );
  });
};

// Check if ingredient is used in any recipe
export const isIngredientUsed = (ingredientId: string, data?: AppData) => {
  return data?.recipes.some((recipe: Recipe) =>
    recipe.ingredients.some(ing => ing.ingredientId === ingredientId)
  );
};

// Get recipes that use this ingredient
export const getRecipesUsingIngredient = (
  ingredientId: string,
  data?: AppData
) => {
  return (
    data?.recipes.filter((recipe: Recipe) =>
      recipe.ingredients.some(ing => ing.ingredientId === ingredientId)
    ) || []
  );
};
