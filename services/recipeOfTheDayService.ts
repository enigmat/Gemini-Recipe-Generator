import { Recipe } from '../types';
import * as recipeService from './recipeService';
import * as globalRecipeService from './globalRecipeService';

const LAST_ARCHIVE_KEY = 'recipeAppLastArchiveDate';

const getDayOfYear = (date: Date): number => {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
};

export const getTodaysRecipe = async (): Promise<Recipe | null> => {
    try {
        // ROTD is global, so it pulls from a global, non-user-specific list.
        const scheduledRecipes = globalRecipeService.getScheduledRecipes();
        
        if (scheduledRecipes.length === 0) {
            console.warn("Global Recipe of the Day pool is empty.");
            return null;
        }

        const dayIndex = getDayOfYear(new Date()) % scheduledRecipes.length;
        const recipe = scheduledRecipes[dayIndex];

        return recipe;

    } catch (error) {
        console.error("Failed to get Recipe of the Day:", error);
        return null;
    }
};

export const archiveYesterdaysRecipe = async (userEmail: string): Promise<Recipe | null> => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const lastArchiveDate = localStorage.getItem(LAST_ARCHIVE_KEY);

    if (lastArchiveDate === today) {
        return null; // Already ran today
    }

    try {
        const scheduledRecipes = globalRecipeService.getScheduledRecipes();
        if (scheduledRecipes.length === 0) {
            localStorage.setItem(LAST_ARCHIVE_KEY, today);
            return null; // No recipes to archive
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        const dayIndex = getDayOfYear(yesterday) % scheduledRecipes.length;
        const yesterdaysRecipe = scheduledRecipes[dayIndex];

        if (yesterdaysRecipe) {
            // Add to the specific user's recipe list
            const newlyAddedRecipe = await recipeService.addRecipeIfUnique(userEmail, yesterdaysRecipe);
            localStorage.setItem(LAST_ARCHIVE_KEY, today);
            return newlyAddedRecipe;
        }
        localStorage.setItem(LAST_ARCHIVE_KEY, today);
        return null;
    } catch (error) {
        console.error("Failed to archive yesterday's recipe:", error);
        localStorage.setItem(LAST_ARCHIVE_KEY, today);
        return null;
    }
};
