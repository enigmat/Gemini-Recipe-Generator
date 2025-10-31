import { Recipe } from '../types';
import { recipes as initialRecipes } from '../data/recipes';
import { newRecipes as initialNewRecipes } from '../data/newRecipes';
import * as imageStore from './imageStore';

const ALL_RECIPES_KEY = 'recipeAppAllRecipes';
const NEW_RECIPES_KEY = 'recipeAppNewRecipes';
const SCHEDULED_RECIPES_KEY = 'recipeAppScheduledRecipes';

export const getAllRecipes = (): Recipe[] => {
    try {
        const recipesJson = localStorage.getItem(ALL_RECIPES_KEY);
        if (recipesJson) {
            return JSON.parse(recipesJson);
        } else {
            // Key doesn't exist, so this is the first run or data was cleared.
            // Initialize localStorage with default data and return it.
            localStorage.setItem(ALL_RECIPES_KEY, JSON.stringify(initialRecipes));
            return initialRecipes;
        }
    } catch (error) {
        console.error('Could not get all recipes from localStorage', error);
        // On error, return the default set to prevent app crash.
        return initialRecipes;
    }
};

export const saveAllRecipes = (recipes: Recipe[]): void => {
    try {
        localStorage.setItem(ALL_RECIPES_KEY, JSON.stringify(recipes));
    } catch (error) {
        console.error('Could not save all recipes to localStorage', error);
    }
};

export const getNewRecipes = (): Recipe[] => {
    try {
        const recipesJson = localStorage.getItem(NEW_RECIPES_KEY);
        if (recipesJson) {
            return JSON.parse(recipesJson);
        } else {
            localStorage.setItem(NEW_RECIPES_KEY, JSON.stringify(initialNewRecipes));
            return initialNewRecipes;
        }
    } catch (error) {
        console.error('Could not get new recipes from localStorage', error);
        return initialNewRecipes;
    }
};

export const saveNewRecipes = (recipes: Recipe[]): void => {
    try {
        localStorage.setItem(NEW_RECIPES_KEY, JSON.stringify(recipes));
    } catch (error) {
        console.error('Could not save new recipes to localStorage', error);
    }
};

export const getScheduledRecipes = (): Recipe[] => {
    try {
        const recipesJson = localStorage.getItem(SCHEDULED_RECIPES_KEY);
        return recipesJson ? JSON.parse(recipesJson) : [];
    } catch (error) {
        console.error('Could not get scheduled recipes from localStorage', error);
        return [];
    }
};

export const saveScheduledRecipes = (recipes: Recipe[]): void => {
    try {
        localStorage.setItem(SCHEDULED_RECIPES_KEY, JSON.stringify(recipes));
    } catch (error) {
        console.error('Could not save scheduled recipes to localStorage', error);
    }
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
