import { MealPlan } from '../types';

export const mealPlans: MealPlan[] = [
  {
    id: 'beginner',
    title: "Beginner's Week",
    description: 'Easy and delicious recipes perfect for those new to cooking. This plan will guide you through simple yet satisfying meals.',
    recipeIds: [1, 3, 4, 10, 26, 38, 27],
  },
  {
    id: 'vegetarian',
    title: 'Vegetarian Voyage',
    description: 'A week of flavorful and satisfying meat-free meals that explore a variety of tastes and textures.',
    recipeIds: [4, 5, 6, 11, 12, 20, 45],
  },
  {
    id: 'family',
    title: 'Family Favorites',
    description: 'Crowd-pleasing dishes that the whole family will love, designed for easy preparation and happy faces at the dinner table.',
    recipeIds: [2, 3, 9, 21, 24, 42, 48],
  },
  {
    id: 'quick',
    title: '30-Minute Meals',
    description: 'For busy weeks, this plan features delicious recipes that can all be made in 30 minutes or less.',
    recipeIds: [1, 3, 4, 5, 28, 48, 60],
  },
  {
    id: 'healthy',
    title: 'Healthy & Hearty',
    description: 'A selection of nutritious and delicious meals that are both satisfying and good for you.',
    recipeIds: [4, 38, 51, 53, 54, 64, 69],
  },
  {
    id: 'around-the-world',
    title: 'Around the World',
    description: 'Take a culinary trip with this plan, featuring popular dishes from Italy, Mexico, India, and beyond.',
    recipeIds: [2, 6, 14, 48, 52, 59, 70],
  },
];
