import { Recipe } from '../types';
import * as recipeService from './recipeService';

const getDayOfYear = (): number => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
};

export const getRecipeOfTheDay = async (): Promise<Recipe | null> => {
    try {
        const scheduledRecipes = recipeService.getScheduledRecipes();
        
        if (scheduledRecipes.length === 0) {
            console.warn("Recipe of the Day pool is empty. Admin needs to generate recipes.");
            return null;
        }

        const dayIndex = getDayOfYear() % scheduledRecipes.length;
        const recipe = scheduledRecipes[dayIndex];

        return recipe;

    } catch (error) {
        console.error("Failed to get Recipe of the Day:", error);
        return null;
    }
};
