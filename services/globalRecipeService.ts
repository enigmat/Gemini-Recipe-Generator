import { Recipe } from '../types';
import { recipes as initialRecipes } from '../data/recipes';

// This is a simplified, read-only service to provide global recipe pools separate from user data.

// A smaller, curated list for the global Recipe of the Day feature.
const globalScheduledRecipes: Recipe[] = initialRecipes.slice(10, 20);

export const getScheduledRecipes = (): Recipe[] => {
    // In a real application, this could be fetched from a remote source.
    return globalScheduledRecipes;
};

export const getMasterRecipeList = (): Recipe[] => {
    // Returns the entire master catalog of recipes for admin tools.
    return initialRecipes;
};
