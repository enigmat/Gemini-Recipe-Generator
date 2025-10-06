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