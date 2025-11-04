import { Recipe } from '../types';
import * as imageStore from './imageStore';
// FIX: saveDatabase is removed, use granular async savers
import { getDatabase, saveAllRecipes as saveAllRecipesToCloud, saveNewRecipes as saveNewRecipesToCloud, saveScheduledRecipes as saveScheduledRecipesToCloud } from './cloudService';
import { getSupabaseClient } from './supabaseClient';

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

// FIX: Accept `allRecipes` as an argument instead of fetching it inside the function.
// FIX: Refactor to only insert the new recipe instead of upserting the entire list, which causes hangs.
// FIX: Add handling for chef image transfer during archival.
export const addRecipeIfUnique = async (recipe: Recipe, allRecipes: Recipe[]): Promise<Recipe | null> => {
    const existingRecipe = allRecipes.find(r => r.title.toLowerCase() === recipe.title.toLowerCase());

    if (existingRecipe) {
        console.log(`Recipe "${recipe.title}" already exists. Skipping archival.`);
        return null;
    }

    const newId = Date.now();
    let newImageSrc = recipe.image;
    let newChefImageSrc = recipe.chef?.image;

    const imagePromises: Promise<void>[] = [];

    // Handle recipe image transfer from ROTD pool to permanent storage
    if (recipe.image.startsWith('indexeddb:')) {
        const oldId = recipe.id.toString();
        imagePromises.push(
            (async () => {
                const imageData = await imageStore.getImage(oldId);
                if (imageData) {
                    await imageStore.setImage(String(newId), imageData);
                    newImageSrc = `indexeddb:${newId}`;
                }
            })()
        );
    } else if (!recipe.image.startsWith('https://')) { 
        imagePromises.push(
             (async () => {
                await imageStore.setImage(String(newId), recipe.image);
                newImageSrc = `indexeddb:${newId}`;
            })()
        );
    }

    // Handle chef image transfer
    if (recipe.chef && recipe.chef.image && recipe.chef.image.startsWith('indexeddb:')) {
        const oldChefImageId = `chef-${recipe.id}`;
        const newChefImageId = `chef-${newId}`;
        imagePromises.push(
            (async () => {
                const chefImageData = await imageStore.getImage(oldChefImageId);
                if (chefImageData) {
                    await imageStore.setImage(newChefImageId, chefImageData);
                    newChefImageSrc = `indexeddb:${newChefImageId}`;
                }
            })()
        );
    }
    
    await Promise.all(imagePromises);

    const newRecipe: Recipe = {
        ...recipe,
        id: newId,
        image: newImageSrc,
        chef: recipe.chef ? {
            ...recipe.chef,
            image: newChefImageSrc || recipe.chef.image,
        } : undefined,
    };
    
    // Instead of re-saving the entire list, just insert the new recipe.
    const supabase = getSupabaseClient();
    const { cookTime, winePairing, ...rest } = newRecipe;
    const recipeForDb = { ...rest, cook_time: cookTime, wine_pairing: winePairing };
    
    const { error } = await supabase.from('recipes').insert(recipeForDb as any);

    if (error) {
        console.error("Failed to archive recipe in database:", error.message);
        throw new Error(`Failed to archive recipe: ${error.message}`);
    }
    
    console.log(`Archived new recipe: "${newRecipe.title}"`);
    return newRecipe;
};