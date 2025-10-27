import { CocktailRecipe, SavedCocktail } from '../types';

const getCocktailsKey = (userEmail: string) => `recipeAppCocktails_${userEmail}`;

export const getSavedCocktails = (userEmail: string | null): SavedCocktail[] => {
  if (!userEmail) return [];
  try {
    const cocktailsJson = localStorage.getItem(getCocktailsKey(userEmail));
    return cocktailsJson ? JSON.parse(cocktailsJson) : [];
  } catch (error) {
    console.error('Could not get saved cocktails from localStorage', error);
    return [];
  }
};

const saveAllCocktails = (cocktails: SavedCocktail[], userEmail: string): void => {
    try {
        localStorage.setItem(getCocktailsKey(userEmail), JSON.stringify(cocktails));
    } catch (error) {
        console.error('Could not save cocktails to localStorage', error);
    }
};

export const saveCocktail = (recipe: CocktailRecipe, image: string, userEmail: string): SavedCocktail | null => {
    const savedCocktails = getSavedCocktails(userEmail);

    if (savedCocktails.some(c => c.title.toLowerCase() === recipe.title.toLowerCase())) {
        // Already saved
        return null;
    }

    const newCocktail: SavedCocktail = {
        ...recipe,
        id: `cocktail-${Date.now()}`,
        image: image,
    };

    saveAllCocktails([newCocktail, ...savedCocktails], userEmail);
    return newCocktail;
};

export const deleteCocktail = (cocktailId: string, userEmail: string): void => {
    const savedCocktails = getSavedCocktails(userEmail);
    const updatedCocktails = savedCocktails.filter(c => c.id !== cocktailId);
    saveAllCocktails(updatedCocktails, userEmail);
};
