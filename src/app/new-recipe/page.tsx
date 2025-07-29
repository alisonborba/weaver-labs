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
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateRecipe, useGetRecipes } from '@/hooks/use-mutations';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Skeleton } from '@/components/ui/skeleton';
import { RecipeFormData, recipeFormSchema } from '@/types';

export default function NewRecipe() {
  const router = useRouter();
  const [selectedIngredientId, setSelectedIngredientId] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState('');

  const { data } = useGetRecipes();

  const form = useForm<RecipeFormData>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      name: '',
      ingredients: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'ingredients',
  });

  const createRecipeMutation = useCreateRecipe();

  const onSubmit = (data: RecipeFormData) => {
    createRecipeMutation.mutate(data, {
      onSuccess: () => {
        router.push('/recipes');
      },
    });
  };

  const addIngredient = () => {
    if (selectedIngredientId && selectedQuantity) {
      const quantity = parseFloat(selectedQuantity);
      if (!isNaN(quantity) && quantity > 0) {
        append({
          ingredientId: selectedIngredientId,
          quantity: quantity,
        });
        setSelectedIngredientId('');
        setSelectedQuantity('');
      }
    }
  };

  // Get available ingredients (not already selected)
  const availableIngredients =
    data?.ingredients.filter(
      ingredient =>
        !form
          .watch('ingredients')
          .some(field => field.ingredientId === ingredient.id)
    ) || [];

  const getIngredientUnit = (ingredientId: string) => {
    const ingredient = data?.ingredients.find(ing => ing.id === ingredientId);
    return ingredient?.unit || '';
  };

  const getIngredientName = (ingredientId: string) => {
    const ingredient = data?.ingredients.find(ing => ing.id === ingredientId);
    return ingredient?.name || '';
  };

  return (
    <div className="container mx-auto">
      <Header
        title="New Recipe"
        rightContent={
          <Button
            type="submit"
            disabled={createRecipeMutation.isPending}
            form="recipe-form"
          >
            {createRecipeMutation.isPending ? 'Saving...' : 'Save Recipe'}
          </Button>
        }
      />
      <div className="m-4 px-4 pt-4 border rounded">
        <form id="recipe-form" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Recipe Name - Full width on mobile, side by side on desktop */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <Label htmlFor="name" className="ml-1">
                Recipe Name
              </Label>
              <Input
                id="name"
                {...form.register('name')}
                placeholder="Enter recipe name"
                className="mt-1 w-full"
              />
              {form.formState.errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            {/* Ingredients Section - Full width on mobile, side by side on desktop */}
            <div className="w-full md:w-1/2">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="w-full">
                  <Label htmlFor="ingredient-select" className="ml-1">
                    Select Ingredient
                  </Label>
                  {data ? (
                    <Select
                      value={selectedIngredientId}
                      onValueChange={setSelectedIngredientId}
                      disabled={availableIngredients.length === 0}
                    >
                      <SelectTrigger className="mt-1 w-full">
                        <SelectValue
                          placeholder={
                            availableIngredients.length === 0
                              ? 'No more ingredients available'
                              : 'Choose an ingredient'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {availableIngredients.map(ingredient => (
                          <SelectItem key={ingredient.id} value={ingredient.id}>
                            {ingredient.name} ({ingredient.unit})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Skeleton className="h-10 w-full mt-1" />
                  )}
                </div>

                <div className="w-full">
                  <Label htmlFor="quantity" className="ml-1">
                    Quantity
                    {selectedIngredientId && (
                      <span className="text-gray-500">
                        ({getIngredientUnit(selectedIngredientId)})
                      </span>
                    )}
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={selectedQuantity}
                    onChange={e => setSelectedQuantity(e.target.value)}
                    placeholder="0"
                    className="mt-1"
                  />
                </div>
              </div>
              <Button
                type="button"
                onClick={addIngredient}
                disabled={
                  !selectedIngredientId ||
                  !selectedQuantity ||
                  availableIngredients.length === 0
                }
                className="w-full my-2"
              >
                Add Ingredient
              </Button>

              {/* Selected Ingredients List */}
              <div className="space-y-2 mb-6">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <span className="font-medium">
                        {getIngredientName(field.ingredientId)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">
                        {form.watch(`ingredients.${index}.quantity`)}{' '}
                        {getIngredientUnit(field.ingredientId)}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {form.formState.errors.ingredients && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.ingredients.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
