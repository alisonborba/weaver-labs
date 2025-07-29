import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/server-utils';

export async function GET() {
  try {
    const data = await readData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, ingredients } = body;

    // Validate required fields
    if (!name || !ingredients || !Array.isArray(ingredients) || !id) {
      return NextResponse.json(
        { error: 'Name, ingredients array, and id are required' },
        { status: 400 }
      );
    }

    // Validate ingredients structure
    for (const ingredient of ingredients) {
      if (!ingredient.ingredientId || typeof ingredient.quantity !== 'number') {
        return NextResponse.json(
          { error: 'Each ingredient must have ingredientId and quantity' },
          { status: 400 }
        );
      }
    }

    const data = await readData();

    // Create new recipe
    const newRecipe = {
      id,
      name,
      ingredients,
    };

    // Add recipe to data
    data.recipes.push(newRecipe);

    // Save to file
    await writeData(data);

    return NextResponse.json(
      { message: 'Recipe added successfully', recipe: newRecipe },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add recipe' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const recipeId = searchParams.get('id');

    if (!recipeId) {
      return NextResponse.json(
        { error: 'Recipe ID is required' },
        { status: 400 }
      );
    }

    const data = await readData();

    // Find recipe index
    const recipeIndex = data.recipes.findIndex(
      (recipe: any) => recipe.id === recipeId
    );

    if (recipeIndex === -1) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    // Remove recipe
    const deletedRecipe = data.recipes.splice(recipeIndex, 1)[0];

    // Save to file
    await writeData(data);

    return NextResponse.json(
      { message: 'Recipe deleted successfully', recipe: deletedRecipe },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete recipe' },
      { status: 500 }
    );
  }
}
