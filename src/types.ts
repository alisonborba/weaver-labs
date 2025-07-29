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
  steps: string[];
};
