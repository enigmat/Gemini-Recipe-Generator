import { Recipe } from '../types';
import * as recipeService from './recipeService';
import { updateDatabase, getDatabase } from './database';

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

export const archiveRecipe = (recipe: Recipe): boolean => {
    let moved = false;
    updateDatabase(draftDb => {
        // Add to main list only if it's not there by ID
        const isAlreadyInMainList = draftDb.recipes.all.some(r => r.id === recipe.id);
        if (!isAlreadyInMainList) {
            draftDb.recipes.all.push(recipe);
            console.log(`Archived "${recipe.title}" to main list.`);
        } else {
            console.log(`Recipe "${recipe.title}" is already in the main list.`);
        }

        // Always remove from the scheduled pool
        const initialScheduledCount = draftDb.recipes.scheduled.length;
        const updatedScheduled = draftDb.recipes.scheduled.filter(r => r.id !== recipe.id);

        if (updatedScheduled.length < initialScheduledCount) {
            draftDb.recipes.scheduled = updatedScheduled;
            console.log(`Removed "${recipe.title}" from scheduled list.`);
            moved = true; // The operation was successful if a recipe was removed
        }
    });
    return moved;
};

export const archiveYesterdaysRecipe = (): Recipe | null => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const lastArchiveDate = localStorage.getItem(LAST_ARCHIVE_KEY);

    if (lastArchiveDate === today) {
        return null; // Already ran today
    }

    try {
        const scheduledRecipes = getDatabase().recipes.scheduled;
        if (scheduledRecipes.length === 0) {
            localStorage.setItem(LAST_ARCHIVE_KEY, today);
            return null; // No recipes to archive
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        const dayIndex = getDayOfYear(yesterday) % scheduledRecipes.length;
        const yesterdaysRecipe = scheduledRecipes[dayIndex];

        if (yesterdaysRecipe) {
            if(archiveRecipe(yesterdaysRecipe)) {
                localStorage.setItem(LAST_ARCHIVE_KEY, today);
                return yesterdaysRecipe;
            }
        }
        localStorage.setItem(LAST_ARCHIVE_KEY, today);
        return null;
    } catch (error) {
        console.error("Failed to archive yesterday's recipe:", error);
        localStorage.setItem(LAST_ARCHIVE_KEY, today); // Still mark as run to avoid repeated errors
        return null;
    }
};