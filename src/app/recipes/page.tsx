'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Ingredient, IngredientWithRecipe, AppData, Recipe } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '@/app/Providers';
import { Header } from '@/components/Header';
import Link from 'next/link';

export default function RecipeTable() {
  const { data } = useQuery<AppData>({
    queryKey: ['recipes'],
    queryFn: () => fetch('/api/data').then(res => res.json()),
  });

  const ingredientList = (ingredients: IngredientWithRecipe[]) => {
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

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/data?id=${id}`, {
        method: 'DELETE',
      });
      return response.json();
    },
    onMutate: async (id: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['recipes'] });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<AppData>(['recipes']);

      // Optimistically update to the new value
      queryClient.setQueryData<AppData>(['recipes'], old => {
        if (!old) return old;
        return {
          ...old,
          recipes: old.recipes.filter((recipe: Recipe) => recipe.id !== id),
        };
      });

      // Return a context object with the snapshotted value
      return { previousData };
    },
    onError: (_err, _id, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousData) {
        queryClient.setQueryData(['recipes'], context.previousData);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });

  return (
    <div className="container mx-auto">
      <Header
        title="Recipes List"
        rightContent={
          <Button asChild>
            <Link href="/new-recipe">Add Recipe</Link>
          </Button>
        }
      />
      <div className="m-4 px-2 border rounded bg-gray-50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recipe Name</TableHead>
              <TableHead>Ingredients</TableHead>
              <TableHead className="text-right pr-4">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.recipes.map((recipe: Recipe) => (
              <TableRow key={recipe.id}>
                <TableCell>{recipe.name}</TableCell>
                <TableCell>{ingredientList(recipe.ingredients)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => mutation.mutate(recipe.id)}
                    disabled={mutation.isPending}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
