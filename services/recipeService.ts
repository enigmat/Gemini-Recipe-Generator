import { Recipe } from '../types';
import * as imageStore from './imageStore';
import { getDatabase, saveDatabase, getUserData } from './cloudService';

export const getAllRecipes = (userEmail: string): Recipe[] => {
    const userData = getUserData(userEmail);
    return userData.recipes.all;
};

export const saveAllRecipes = (userEmail: string, recipes: Recipe[]): void => {
    const db = getDatabase();
    const userData = getUserData(userEmail); // ensures user data object exists
    db.userData[userEmail].recipes.all = recipes;
    saveDatabase(db);
};

export const getNewRecipes = (userEmail: string): Recipe[] => {
    const userData = getUserData(userEmail);
    return userData.recipes.new;
};

export const saveNewRecipes = (userEmail: string, recipes: Recipe[]): void => {
    const db = getDatabase();
    const userData = getUserData(userEmail);
    db.userData[userEmail].recipes.new = recipes;
    saveDatabase(db);
};

export const getScheduledRecipes = (userEmail: string): Recipe[] => {
    const userData = getUserData(userEmail);
    return userData.recipes.scheduled;
};

export const saveScheduledRecipes = (userEmail: string, recipes: Recipe[]): void => {
    const db = getDatabase();
    const userData = getUserData(userEmail);
    db.userData[userEmail].recipes.scheduled = recipes;
    saveDatabase(db);
};

export const addRecipeIfUnique = async (userEmail: string, recipe: Recipe): Promise<Recipe | null> => {
    const allRecipes = getAllRecipes(userEmail);
    const existingRecipe = allRecipes.find(r => r.title.toLowerCase() === recipe.title.toLowerCase());

    if (existingRecipe) {
        console.log(`Recipe "${recipe.title}" already exists for user. Skipping.`);
        return null;
    }

    const newId = Date.now();
    let newImageSrc = recipe.image;

    // Handle image transfer from a temporary recipe (like ROTD) to permanent user storage
    if (recipe.image.startsWith('indexeddb:')) {
        const oldId = recipe.id.toString();
        const imageData = await imageStore.getImage(oldId);
        if (imageData) {
            await imageStore.setImage(newId.toString(), imageData);
            newImageSrc = `indexeddb:${newId}`;
        }
    } else if (!recipe.image.startsWith('https://')) { 
        await imageStore.setImage(newId.toString(), recipe.image);
        newImageSrc = `indexeddb:${newId}`;
    }

    const newRecipe: Recipe = {
        ...recipe,
        id: newId,
        image: newImageSrc,
    };

    const updatedRecipes = [newRecipe, ...allRecipes];
    saveAllRecipes(userEmail, updatedRecipes);
    
    console.log(`Added new recipe for user: "${newRecipe.title}"`);
    return newRecipe;
};