import { Recipe } from '../types';
import * as imageStore from './imageStore';
// FIX: saveDatabase is removed, use granular async savers
import { getDatabase, saveAllRecipes as saveAllRecipesToCloud, saveNewRecipes as saveNewRecipesToCloud, saveScheduledRecipes as saveScheduledRecipesToCloud } from './cloudService';

// FIX: make async
export const getAllRecipes = async (): Promise<Recipe[]> => {
    // FIX: await promise
    const db = await getDatabase();
    return db.recipes.all;
};

// FIX: make async
export const saveAllRecipes = async (recipes: Recipe[]): Promise<void> => {
    await saveAllRecipesToCloud(recipes);
};

// FIX: make async
export const getNewRecipes = async (): Promise<Recipe[]> => {
    // FIX: await promise
    const db = await getDatabase();
    return db.recipes.new;
};

// FIX: make async
export const saveNewRecipes = async (recipes: Recipe[]): Promise<void> => {
    await saveNewRecipesToCloud(recipes);
};

// FIX: make async
export const getScheduledRecipes = async (): Promise<Recipe[]> => {
    // FIX: await promise
    const db = await getDatabase();
    return db.recipes.scheduled;
};

// FIX: make async
export const saveScheduledRecipes = async (recipes: Recipe[]): Promise<void> => {
    await saveScheduledRecipesToCloud(recipes);
};

// FIX: make async
export const addRecipeIfUnique = async (recipe: Recipe): Promise<Recipe | null> => {
    // FIX: await promise
    const allRecipes = await getAllRecipes();
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
    // FIX: await promise
    await saveAllRecipes(updatedRecipes);
    
    console.log(`Archived new recipe: "${newRecipe.title}"`);
    return newRecipe;
};