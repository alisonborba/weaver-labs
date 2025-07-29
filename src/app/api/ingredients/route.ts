import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/server-utils';
import { Ingredient, Recipe } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, unit, category }: Ingredient = body;

    // Validate required fields
    if (!name || !unit || !category || !id) {
      return NextResponse.json(
        { error: 'Name, unit, category, and id are required' },
        { status: 400 }
      );
    }

    const data = await readData();

    // Create new ingredient
    const newIngredient: Ingredient = {
      id,
      name,
      unit,
      category,
    };

    // Add ingredient to data
    data.ingredients.push(newIngredient);

    // Save to file
    await writeData(data);

    return NextResponse.json(
      { message: 'Ingredient added successfully', ingredient: newIngredient },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: JSON.stringify(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ingredientId = searchParams.get('id');

    if (!ingredientId) {
      return NextResponse.json(
        { error: 'Ingredient ID is required' },
        { status: 400 }
      );
    }

    const data = await readData();

    // Check if ingredient is used in any recipe
    const isUsedInRecipes = data.recipes.some((recipe: Recipe) =>
      recipe.ingredients.some(ing => ing.ingredientId === ingredientId)
    );

    if (isUsedInRecipes) {
      const recipesUsingIngredient = data.recipes.filter((recipe: Recipe) =>
        recipe.ingredients.some(ing => ing.ingredientId === ingredientId)
      );

      return NextResponse.json(
        {
          error: 'Cannot delete ingredient',
          message: `Ingredient is used in ${recipesUsingIngredient.length} recipe(s). Please delete those recipes first.`,
          recipes: recipesUsingIngredient.map((r: Recipe) => ({
            id: r.id,
            name: r.name,
          })),
        },
        { status: 400 }
      );
    }

    // Find ingredient index
    const ingredientIndex = data.ingredients.findIndex(
      (ingredient: Ingredient) => ingredient.id === ingredientId
    );

    if (ingredientIndex === -1) {
      return NextResponse.json(
        { error: 'Ingredient not found' },
        { status: 404 }
      );
    }

    // Remove ingredient
    const deletedIngredient = data.ingredients.splice(ingredientIndex, 1)[0];

    // Save to file
    await writeData(data);

    return NextResponse.json(
      {
        message: 'Ingredient deleted successfully',
        ingredient: deletedIngredient,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: JSON.stringify(error) }, { status: 500 });
  }
}
