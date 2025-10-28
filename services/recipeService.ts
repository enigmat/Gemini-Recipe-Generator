import { Recipe } from '../types';
import { recipes as initialRecipes } from '../data/recipes';
import { newRecipes as initialNewRecipes } from '../data/newRecipes';

const ALL_RECIPES_KEY = 'recipeAppAllRecipes';
const NEW_RECIPES_KEY = 'recipeAppNewRecipes';

// Initialize with default recipes if none exist
if (!localStorage.getItem(ALL_RECIPES_KEY)) {
    localStorage.setItem(ALL_RECIPES_KEY, JSON.stringify(initialRecipes));
}
if (!localStorage.getItem(NEW_RECIPES_KEY)) {
    localStorage.setItem(NEW_RECIPES_KEY, JSON.stringify(initialNewRecipes));
}

export const getAllRecipes = (): Recipe[] => {
    try {
        const recipesJson = localStorage.getItem(ALL_RECIPES_KEY);
        return recipesJson ? JSON.parse(recipesJson) : initialRecipes;
    } catch (error) {
        console.error('Could not get all recipes from localStorage', error);
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
        return recipesJson ? JSON.parse(recipesJson) : initialNewRecipes;
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
