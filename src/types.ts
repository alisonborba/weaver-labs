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
};

export type AppData = {
  ingredients: Ingredient[];
  recipes: Recipe[];
};

export type ApiResponse<T = unknown> = {
  message?: string;
  error?: string;
  data?: T;
  recipe?: Recipe;
  ingredient?: Ingredient;
  recipes?: Recipe[];
};
