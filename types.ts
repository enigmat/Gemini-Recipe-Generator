export interface IngredientUnit {
  quantity: number | string;
  unit: string;
}

export interface Ingredient {
  name: string;
  metric: IngredientUnit;
  us: IngredientUnit;
}

export interface WinePairing {
  suggestion: string;
  description: string;
}

export interface Recipe {
  id: number;
  title: string;
  image: string;
  description: string;
  cookTime: string;
  servings: string;
  ingredients: Ingredient[];
  instructions: string[];
  calories?: string;
  tags?: string[];
  cuisine: string;
  winePairing?: WinePairing;
  rating?: {
    score: number;
    count: number;
  };
}

export interface RecipeVariation {
  title: string;
  description: string;
}

export interface User {
  email: string;
  name: string;
  profileImage?: string; // base64 encoded image string
  isPremium?: boolean;
  isAdmin?: boolean;
  isSubscribed?: boolean;
  planEndDate?: string;
  foodPreferences?: string[];
}

export interface AggregatedIngredient {
  name: string;
  quantity: number | string;
  unit: string;
}

export interface ShoppingList {
  id: string;
  name:string;
  recipeIds: number[];
}

export interface MealPlan {
  id: string;
  title: string;
  description: string;
  recipeIds: number[];
}

export interface Video {
  id: string;
  category: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
}

export interface ClassStep {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
}

export interface CookingClass {
  id: string;
  title: string;
  description: string;
  chef: string;
  thumbnailUrl: string;
  steps: ClassStep[];
  whatYouWillLearn: string[];
  techniquesCovered: string[];
  proTips: string[];
}

export interface Newsletter {
    id: string;
    subject: string;
    message: string;
    recipeIds: number[];
    target: 'all' | 'premium';
    sentDate: string;
}

export interface CocktailRecipe {
  title: string;
  description: string;
  imagePrompt: string;
  glassware: string;
  garnish: string;
  ingredients: string[];
  instructions: string[];
}

export interface SavedCocktail extends CocktailRecipe {
  id: string;
  image: string;
}

export interface Lead {
  email: string;
  dateCollected: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  imageUrl: string;
  affiliateUrl: string;
  category: string;
}

export interface ProductAnalysis {
  score: number;
  summary: string;
  pros: string[];
  cons: string[];
  additives: string[];
}

export interface ExpertQuestion {
  id: string;
  question: string;
  topic: string;
  status: 'Pending' | 'Answered';
  submittedDate: string;
  answer?: {
    chefName: string;
    answeredDate: string;
    text: string;
  };
}

// FIX: Added missing AboutUsContent interface
export interface AboutUsContent {
  companyName: string;
  missionStatement: string;
  companyHistory: string;
  contactEmail: string;
  address: string;
}

export interface GeneratedMeal {
  mealType: string;
  recipeTitle: string;
}

export interface GeneratedMealPlan {
  days: {
    day: string;
    meals: GeneratedMeal[];
  }[];
  notes?: string;
}

export interface ChatMessage {
  id: string;
  userId: string; // user email
  userName: string;
  userProfileImage?: string;
  isAdmin: boolean;
  text: string;
  timestamp: string; // ISO 8601
}

// Centralized DB types
export type RatingsStore = Record<number, { totalScore: number; count: number; userRatings: Record<string, number> }>;

export interface UserData {
    favorites: number[];
    shoppingLists: ShoppingList[];
    cocktails: SavedCocktail[];
}

export interface AppDatabase {
    users: User[];
    recipes: {
        all: Recipe[];
        new: Recipe[];
        scheduled: Recipe[];
    };
    products: Product[];
    aboutUs: AboutUsContent;
    newsletters: {
        sent: Newsletter[];
        leads: Lead[];
    };
    ratings: RatingsStore;
    userData: Record<string, UserData>; // Keyed by user email
    standardCocktails: SavedCocktail[];
    communityChat: ChatMessage[];
}