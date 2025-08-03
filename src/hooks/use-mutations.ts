import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '@/app/Providers';
import { AppData, Recipe, Ingredient } from '@/lib/types';
import { toast } from 'sonner';

// Get data
export const useGetRecipes = () => {
  return useQuery<AppData>({
    queryKey: ['recipes'],
    queryFn: async () => {
      const res = await fetch('/api/data');
      return res.json();
    },
    staleTime: 1000 * 60, // 1 minute cache
  });
};

export const useCreateRecipe = () => {
  return useMutation({
    mutationFn: async (recipeData: Omit<Recipe, 'id'>) => {
      const recipeId = `rec${Date.now()}`;
      const recipeToSend = {
        id: recipeId,
        ...recipeData,
      };

      const response = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeToSend),
      });

      return response.json();
    },
    onMutate: async newRecipe => {
      await queryClient.cancelQueries({ queryKey: ['recipes'] });
      const previousData = queryClient.getQueryData<AppData>(['recipes']);

      queryClient.setQueryData<AppData>(['recipes'], old => {
        if (!old) return old;
        const recipeId = `rec${Date.now()}`;
        return {
          ...old,
          recipes: [
            ...old.recipes,
            {
              id: recipeId,
              ...newRecipe,
            },
          ],
        };
      });

      return { previousData };
    },
    onError: (_err, _newRecipe, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['recipes'], context.previousData);
      }
      toast.error('ERROR: Recipe has not been created');
    },
    onSuccess: () => toast.success('Recipe created successfully'),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
};

export const useDeleteRecipe = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/data?id=${id}`, {
        method: 'DELETE',
      });
      return response.json();
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['recipes'] });
      const previousData = queryClient.getQueryData<AppData>(['recipes']);

      queryClient.setQueryData<AppData>(['recipes'], old => {
        if (!old) return old;
        return {
          ...old,
          recipes: old.recipes.filter((recipe: Recipe) => recipe.id !== id),
        };
      });

      return { previousData };
    },
    onError: (_err, _id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['recipes'], context.previousData);
      }
      toast.error('ERROR: Recipe has not been deleted');
    },
    onSuccess: () => toast.success('Recipe deleted successfully'),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
};

export const useCreateIngredient = () => {
  return useMutation({
    mutationFn: async (ingredientData: {
      name: string;
      unit: string;
      category: string;
    }) => {
      const ingredientId = `ing${Date.now()}`;
      const ingredientToSend = {
        id: ingredientId,
        ...ingredientData,
      };

      const response = await fetch('/api/ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ingredientToSend),
      });

      return response.json();
    },
    onMutate: async newIngredient => {
      await queryClient.cancelQueries({ queryKey: ['recipes'] });
      const previousData = queryClient.getQueryData<AppData>(['recipes']);

      queryClient.setQueryData<AppData>(['recipes'], old => {
        if (!old) return old;
        const ingredientId = `ing${Date.now()}`;
        return {
          ...old,
          ingredients: [
            ...old.ingredients,
            { id: ingredientId, ...newIngredient },
          ],
        };
      });

      return { previousData };
    },
    onError: (_err, _newIngredient, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['recipes'], context.previousData);
      }
      toast.error('ERROR: Ingredient has not been created');
    },
    onSuccess: () => toast.success('Ingredient created successfully'),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
};

export const useDeleteIngredient = () => {
  return useMutation({
    mutationFn: async (ingredientId: string) => {
      const response = await fetch(`/api/ingredients?id=${ingredientId}`, {
        method: 'DELETE',
      });
      return response.json();
    },
    onMutate: async ingredientId => {
      await queryClient.cancelQueries({ queryKey: ['recipes'] });
      const previousData = queryClient.getQueryData<AppData>(['recipes']);

      queryClient.setQueryData<AppData>(['recipes'], old => {
        if (!old) return old;
        return {
          ...old,
          ingredients: old.ingredients.filter(
            (ing: Ingredient) => ing.id !== ingredientId
          ),
        };
      });

      return { previousData };
    },
    onError: (_err, _ingredientId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['recipes'], context.previousData);
      }
      toast.error('ERROR: Ingredient has not been deleted');
    },
    onSuccess: () => toast.success('Ingredient deleted successfully'),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
};
