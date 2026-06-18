export interface Ingredient {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  min_quantity: number;
  created_at: string;
}

export interface Recipe {
  id: number;
  name: string;
  raw_text: string;
  ingredients_json: string | null;
  servings: number;
  created_at: string;
}

export interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface MealLog {
  id: number;
  recipe_id: number;
  cooked_at: string;
  servings: number;
  nutrition_json: string | null;
}

export interface Notification {
  id: number;
  type: string;
  message: string;
  seen: number;
  created_at: string;
}

export interface NutritionInfo {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  notes: string;
}
