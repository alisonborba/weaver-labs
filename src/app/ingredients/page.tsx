'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/app/Providers';
import { useState } from 'react';
import { categories, units } from '@/lib/constants';
import { Header } from '@/components/Header';
import { PlusIcon } from 'lucide-react';

const ingredientFormSchema = z.object({
  name: z.string().min(1, 'Ingredient name is required'),
  unit: z.enum(units.map(unit => unit.value)).refine(val => val !== undefined, {
    message: 'Please select a unit',
  }),
  category: z
    .enum(categories.map(category => category.value))
    .refine(val => val !== undefined, {
      message: 'Please select a category',
    }),
});

type IngredientFormData = z.infer<typeof ingredientFormSchema>;

export default function NewIngredient() {
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch data
  const { data } = useQuery({
    queryKey: ['recipes'],
    queryFn: () => fetch('/api/data').then(res => res.json()),
  });

  const form = useForm<IngredientFormData>({
    resolver: zodResolver(ingredientFormSchema),
    defaultValues: {
      name: '',
      unit: undefined,
      category: undefined,
    },
  });

  // Mutation for adding ingredient
  const addMutation = useMutation({
    mutationFn: async (ingredientData: IngredientFormData) => {
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
      const previousData = queryClient.getQueryData(['recipes']);

      queryClient.setQueryData(['recipes'], (old: any) => {
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
    onError: (err, newIngredient, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['recipes'], context.previousData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      setShowAddForm(false);
      form.reset();
    },
  });

  // Mutation for deleting ingredient
  const deleteMutation = useMutation({
    mutationFn: async (ingredientId: string) => {
      const response = await fetch(`/api/ingredients?id=${ingredientId}`, {
        method: 'DELETE',
      });
      return response.json();
    },
    onMutate: async ingredientId => {
      await queryClient.cancelQueries({ queryKey: ['recipes'] });
      const previousData = queryClient.getQueryData(['recipes']);

      queryClient.setQueryData(['recipes'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          ingredients: old.ingredients.filter(
            (ing: any) => ing.id !== ingredientId
          ),
        };
      });

      return { previousData };
    },
    onError: (err, ingredientId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['recipes'], context.previousData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });

  const onSubmit = (data: IngredientFormData) => {
    addMutation.mutate(data);
  };

  // Check if ingredient is used in any recipe
  const isIngredientUsed = (ingredientId: string) => {
    return data?.recipes.some((recipe: any) =>
      recipe.ingredients.some((ing: any) => ing.ingredientId === ingredientId)
    );
  };

  // Get recipes that use this ingredient
  const getRecipesUsingIngredient = (ingredientId: string) => {
    return (
      data?.recipes.filter((recipe: any) =>
        recipe.ingredients.some((ing: any) => ing.ingredientId === ingredientId)
      ) || []
    );
  };

  const handleDelete = (ingredientId: string) => {
    if (isIngredientUsed(ingredientId)) {
      const recipes = getRecipesUsingIngredient(ingredientId);
      const recipeNames = recipes.map((r: any) => r.name).join(', ');
      alert(
        `Cannot delete this ingredient. It is being used by the following recipes: ${recipeNames}. Please delete those recipes first.`
      );
      return;
    }

    if (confirm('Are you sure you want to delete this ingredient?')) {
      deleteMutation.mutate(ingredientId);
    }
  };

  return (
    <div className="container mx-auto">
      <Header
        title="Ingredients List"
        rightContent={
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            variant={showAddForm ? 'outline' : 'default'}
            className="cursor-pointer"
          >
            {showAddForm ? 'Cancel' : 'Add Ingredient'}
          </Button>
        }
      />

      <div className="m-4 px-2 border rounded bg-gray-50">
        {/* Add Ingredient Form */}
        {showAddForm && (
          <div className="my-4 p-2 border rounded-lg bg-white">
            <h2 className="text-lg font-semibold mb-4">Add New Ingredient</h2>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    {...form.register('name')}
                    placeholder="Enter ingredient name"
                    className="mt-1"
                  />
                  {form.formState.errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="flex-1">
                  <Label htmlFor="unit">Unit</Label>
                  <Select
                    value={form.watch('unit')}
                    onValueChange={value => form.setValue('unit', value as any)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map(unit => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.unit && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.unit.message}
                    </p>
                  )}
                </div>

                <div className="flex-1">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={form.watch('category')}
                    onValueChange={value =>
                      form.setValue('category', value as any)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.category && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.category.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={addMutation.isPending}
                  className="md:w-auto"
                >
                  {addMutation.isPending ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Ingredients Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.ingredients.map((ingredient: any) => (
              <TableRow key={ingredient.id}>
                <TableCell className="font-medium">{ingredient.name}</TableCell>
                <TableCell>{ingredient.unit}</TableCell>
                <TableCell className="capitalize">
                  {ingredient.category}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(ingredient.id)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>
                Total Ingredients: {data?.ingredients.length}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        {data?.ingredients.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No ingredients found. Add your first ingredient above.
          </div>
        )}
      </div>
    </div>
  );
}
