import { Recipe } from '../types';
import * as imageStore from './imageStore';
import { getDatabase, saveDatabase } from './cloudService';

export const getAllRecipes = (): Recipe[] => {
    const db = getDatabase();
    return db.recipes.all;
};

export const saveAllRecipes = (recipes: Recipe[]): void => {
    const db = getDatabase();
    db.recipes.all = recipes;
    saveDatabase(db);
};

export const getNewRecipes = (): Recipe[] => {
    const db = getDatabase();
    return db.recipes.new;
};

export const saveNewRecipes = (recipes: Recipe[]): void => {
    const db = getDatabase();
    db.recipes.new = recipes;
    saveDatabase(db);
};

export const getScheduledRecipes = (): Recipe[] => {
    const db = getDatabase();
    return db.recipes.scheduled;
};

export const saveScheduledRecipes = (recipes: Recipe[]): void => {
    const db = getDatabase();
    db.recipes.scheduled = recipes;
    saveDatabase(db);
};

export const addRecipeIfUnique = async (recipe: Recipe): Promise<Recipe | null> => {
    const allRecipes = getAllRecipes();
    const existingRecipe = allRecipes.find(r => r.title.toLowerCase() === recipe.title.toLowerCase());

    if (existingRecipe) {
        console.log(`Recipe "${recipe.title}" already exists. Skipping archival.`);
        return null;
    }

    const newId = Date.now();
    let newImageSrc = recipe.image;

    // Handle image transfer from ROTD pool to permanent storage
    if (recipe.image.startsWith('indexeddb:')) {
        const oldId = recipe.id.toString(); // The recipe ID and image ID from the pool should match
        const imageData = await imageStore.getImage(oldId); // Get the base64 data
        if (imageData) {
            await imageStore.setImage(newId.toString(), imageData); // Save it with the new ID
            newImageSrc = `indexeddb:${newId}`;
        }
    } else if (!recipe.image.startsWith('https://')) { 
        // Fallback for if image is a raw base64 string, or from initial data that wasn't indexeddb
        await imageStore.setImage(newId.toString(), recipe.image);
        newImageSrc = `indexeddb:${newId}`;
    }

    const newRecipe: Recipe = {
        ...recipe,
        id: newId,
        image: newImageSrc,
    };

    const updatedRecipes = [newRecipe, ...allRecipes];
    saveAllRecipes(updatedRecipes);
    
    console.log(`Archived new recipe: "${newRecipe.title}"`);
    return newRecipe;
};
