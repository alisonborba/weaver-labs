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
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCreateIngredient,
  useDeleteIngredient,
  useGetRecipes,
} from '@/hooks/use-mutations';
import { useState } from 'react';
import { categories, units } from '@/lib/constants';
import { Header } from '@/components/Header';
import { TableRowSkeleton } from '@/components/TableRowSkeleton';
import {
  Recipe,
  Ingredient,
  IngredientFormData,
  ingredientFormSchema,
} from '@/types';
import { getRecipesUsingIngredient, isIngredientUsed } from '@/lib/utils';
import { useDeleteConfirmation } from '@/hooks/use-delete-confirmation';

export default function NewIngredient() {
  const [showAddForm, setShowAddForm] = useState(false);
  const { confirm, alert, DeleteConfirmationDialog } = useDeleteConfirmation();

  // Fetch data
  const { data, isLoading } = useGetRecipes();

  const form = useForm<IngredientFormData>({
    resolver: zodResolver(ingredientFormSchema),
    defaultValues: {
      name: '',
      unit: undefined,
      category: undefined,
    },
  });

  // Mutation for adding ingredient
  const addMutation = useCreateIngredient();

  // Mutation for deleting ingredient
  const deleteMutation = useDeleteIngredient();

  const onSubmit = (data: IngredientFormData) => {
    // Ensure all required fields are present
    if (data.name && data.unit && data.category) {
      addMutation.mutate(
        {
          name: data.name,
          unit: data.unit,
          category: data.category,
        },
        {
          onSuccess: () => {
            setShowAddForm(false);
            form.reset();
          },
        }
      );
    }
  };

  const handleDelete = async (ingredientId: string) => {
    if (isIngredientUsed(ingredientId, data)) {
      const recipes = getRecipesUsingIngredient(ingredientId, data);
      const recipeNames = recipes.map((r: Recipe) => r.name).join(', ');

      await alert(
        'Cannot Delete Ingredient',
        `Cannot delete this ingredient. It is being used by the following recipes: ${recipeNames}. Please delete those recipes first.`
      );
      return;
    }

    const shouldDelete = await confirm({ confirmText: 'Delete' });

    if (shouldDelete) {
      deleteMutation.mutate(ingredientId);
    }
  };

  return (
    <>
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

        <div className="mx-4 my-5 border rounded">
          {/* Add Ingredient Form */}
          {showAddForm && (
            <div className="m-4 p-2 border rounded">
              <h2 className="text-lg font-semibold mb-4">Add New Ingredient</h2>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1 md:w-1/4 w-full">
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

                  <div className="flex-1 md:w-1/4 w-full">
                    <Label htmlFor="unit">Unit</Label>
                    <Select
                      value={form.watch('unit')}
                      onValueChange={value => {
                        form.setValue('unit', value);
                        form.trigger('unit');
                      }}
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

                  <div className="flex-1 md:w-1/4 w-full">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={form.watch('category')}
                      onValueChange={value => {
                        form.setValue('category', value);
                        form.trigger('category');
                      }}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
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

                  <div className="md:w-1/5 w-full flex justify-end">
                    <Button
                      type="submit"
                      disabled={addMutation.isPending}
                      className="w-full"
                    >
                      {addMutation.isPending ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          )}

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
              {isLoading && <TableRowSkeleton columns={4} />}
              {data?.ingredients.map((ingredient: Ingredient) => (
                <TableRow key={ingredient.id}>
                  <TableCell className="font-medium">
                    {ingredient.name}
                  </TableCell>
                  <TableCell>{ingredient.unit}</TableCell>
                  <TableCell className="capitalize">
                    {ingredient.category}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(ingredient.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {data?.ingredients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No ingredients found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            {data?.ingredients && (
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4}>
                    Total Ingredients: {data.ingredients.length}
                  </TableCell>
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </div>
      </div>
      <DeleteConfirmationDialog />
    </>
  );
}
