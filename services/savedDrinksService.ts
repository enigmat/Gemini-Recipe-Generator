import { DrinkRecipe } from '../types';

const SAVED_DRINKS_STORAGE_KEY = 'marshmellowRecipesSavedDrinks';

export const getSavedDrinks = (): DrinkRecipe[] => {
    try {
        const savedDrinksJson = localStorage.getItem(SAVED_DRINKS_STORAGE_KEY);
        return savedDrinksJson ? JSON.parse(savedDrinksJson) : [];
    } catch (error) {
        console.error("Error parsing saved drinks from localStorage", error);
        return [];
    }
};

const setSavedDrinks = (drinks: DrinkRecipe[]): void => {
    try {
        localStorage.setItem(SAVED_DRINKS_STORAGE_KEY, JSON.stringify(drinks));
    } catch (error) {
        console.error("Error saving drinks to localStorage", error);
    }
};

export const saveDrink = (drinkToSave: DrinkRecipe): void => {
    const currentDrinks = getSavedDrinks();
    if (!currentDrinks.some(drink => drink.name === drinkToSave.name)) {
        const newDrinks = [...currentDrinks, drinkToSave];
        setSavedDrinks(newDrinks);
    }
};

export const unsaveDrink = (drinkNameToUnsave: string): void => {
    const currentDrinks = getSavedDrinks();
    const newDrinks = currentDrinks.filter(drink => drink.name !== drinkNameToUnsave);
    setSavedDrinks(newDrinks);
};
