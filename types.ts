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
  status: 'active' | 'new_this_month' | 'archived';
  nutrition: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
  videoUrl?: string;
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
  id: string;
  title: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
}

export interface CookingClass {
  id: string;
  title: string;
  description: string;
  chef: string;
  imageUrl: string;
  lessons: Lesson[];
}

export interface SubscriptionHistory {
  date: string;
  action: string;
  description: string;
}

export interface Subscription {
  planType: 'monthly' | 'yearly' | 'free_trial';
  status: 'active' | 'canceled' | 'expired';
  startDate: string;
  endDate: string;
  nextBillingDate?: string;
}


export interface User {
  name: string;
  email: string;
  isAdmin: boolean;
  joinDate: string;
  subscription?: Subscription;
  subscriptionHistory?: SubscriptionHistory[];
}

export interface Lead {
  email: string;
  collectedDate: string;
}

export interface Newsletter {
  id: string;
  subject: string;
  body: string;
  sentDate: string;
  recipientCount: number;
}

export interface AboutUsInfo {
  companyName: string;
  missionStatement: string;
  history: string;
  contactEmail: string;
  address: string;
}


declare global {
  interface Window {
    Stripe: any;
  }
}