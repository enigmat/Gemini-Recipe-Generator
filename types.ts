export interface Recipe {
  title: string;
  description: string;
  imageUrl: string;
  ingredients: string[];
  instructions: string[];
  tags: string[];
}

export interface ShoppingListItem {
  category: string;
  items: string[];
}

export type ShoppingList = ShoppingListItem[];

export interface MealPlanDay {
    day: string;
    recipeTitle: string;
}

export interface MealPlan {
    title: string;
    description: string;
    imageUrl: string;
    plan: MealPlanDay[];
}