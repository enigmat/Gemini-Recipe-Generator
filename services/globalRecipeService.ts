import { Recipe } from '../types';
import { recipes as initialRecipes } from '../data/recipes';
import { getDatabase, saveDatabase } from './cloudService';

export const getScheduledRecipes = (): Recipe[] => {
    const db = getDatabase();
    if (!db.globalScheduledRecipes) { // for migration from older versions
        db.globalScheduledRecipes = initialRecipes.slice(10, 20);
    }
    return db.globalScheduledRecipes;
};

export const saveScheduledRecipes = (recipes: Recipe[]): void => {
    const db = getDatabase();
    db.globalScheduledRecipes = recipes;
    saveDatabase(db);
};

export const getMasterRecipeList = (): Recipe[] => {
    // Returns the entire master catalog of recipes for admin tools.
    return initialRecipes;
};