import { Recipe } from '../types';
import * as recipeService from './recipeService';

const LAST_ARCHIVE_KEY = 'recipeAppLastArchiveDate';

const getDayOfYear = (date: Date): number => {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
};

export const getTodaysRecipe = (scheduledRecipes: Recipe[]): Recipe | null => {
    try {
        if (scheduledRecipes.length === 0) {
            console.warn("Recipe of the Day pool is empty. Admin needs to generate recipes.");
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

// FIX: Accept `allRecipes` as an argument to avoid re-fetching data.
export const archiveYesterdaysRecipe = async (scheduledRecipes: Recipe[], allRecipes: Recipe[]): Promise<Recipe | null> => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const lastArchiveDate = localStorage.getItem(LAST_ARCHIVE_KEY);

    if (lastArchiveDate === today) {
        // Already ran today
        return null;
    }

    try {
        if (scheduledRecipes.length === 0) {
            localStorage.setItem(LAST_ARCHIVE_KEY, today);
            return null; // No recipes to archive
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        const dayIndex = getDayOfYear(yesterday) % scheduledRecipes.length;
        const yesterdaysRecipe = scheduledRecipes[dayIndex];

        if (yesterdaysRecipe) {
            // FIX: Pass the `allRecipes` array down to the next service function.
            const newlyAddedRecipe = await recipeService.addRecipeIfUnique(yesterdaysRecipe, allRecipes);
            localStorage.setItem(LAST_ARCHIVE_KEY, today);
            return newlyAddedRecipe;
        }
        localStorage.setItem(LAST_ARCHIVE_KEY, today);
        return null;
    } catch (error) {
        console.error("Failed to archive yesterday's recipe:", error);
        localStorage.setItem(LAST_ARCHIVE_KEY, today); // Still mark as run to avoid repeated errors
        return null;
    }
};