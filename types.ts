
export interface NutritionInfo {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

export interface Recipe {
  recipeName: string;
  description: string;
  ingredients: {
    name: string;
    quantity: string;
    isAvailable: boolean;
  }[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  servings: string;
  imagePrompt: string;
  nutrition: NutritionInfo;
  imageUrl?: string;
}
