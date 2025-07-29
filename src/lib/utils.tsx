import { AppData, IngredientWithRecipe, Recipe } from '@/types';
import { Ingredient } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useQueryClient } from '@tanstack/react-query';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Hook para acessar dados do cache
export const useAppData = () => {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<AppData>(['recipes']);
  return data;
};

// Funções que usam o cache internamente
export const getIngredientUnit = (ingredientId: string, data?: AppData) => {
  const ingredient = data?.ingredients.find(ing => ing.id === ingredientId);
  return ingredient?.unit || '';
};

export const getIngredientName = (ingredientId: string, data?: AppData) => {
  const ingredient = data?.ingredients.find(ing => ing.id === ingredientId);
  return ingredient?.name || '';
};

export const ingredientList = (
  ingredients: IngredientWithRecipe[],
  data: AppData
) => {
  return ingredients.map(ingredient => {
    const ingredientData: Ingredient | undefined = data?.ingredients.find(
      (ing: Ingredient) => ing.id === ingredient.ingredientId
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
