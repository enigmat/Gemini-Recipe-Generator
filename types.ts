
export interface Recipe {
  title: string;
  description: string;
  imageUrl: string;
  ingredients: string[];
  instructions: string[];
  tags: string[];
  servings: string;
  prepTime: string;
  cookTime: string;
  nutrition: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
}

export interface DrinkRecipe {
  name: string;
  description: string;
  imageUrl: string;
  glassware: string;
  ingredients: string[];
  instructions: string[];
  garnish: string;
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

export interface Video {
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
}

export interface VideoCategory {
  title: string;
  videos: Video[];
}

export interface Lesson {
  title: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
}

export interface CookingClass {
  title: string;
  description: string;
  chef: string;
  imageUrl: string;
  lessons: Lesson[];
}

export interface User {
  email: string;
  isAdmin: boolean;
}

declare global {
  interface Window {
    Stripe: any;
  }
}