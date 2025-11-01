import { CocktailRecipe, SavedCocktail } from '../types';
import { getDatabase, saveDatabase, getUserData } from './cloudService';

export const getSavedCocktails = (userEmail: string | null): SavedCocktail[] => {
  if (!userEmail) return [];
  const userData = getUserData(userEmail);
  return userData.cocktails;
};

export const saveCocktail = (recipe: CocktailRecipe, image: string, userEmail: string): SavedCocktail | null => {
    const db = getDatabase();
    const savedCocktails = getUserData(userEmail).cocktails;

    if (savedCocktails.some(c => c.title.toLowerCase() === recipe.title.toLowerCase())) {
        return null;
    }

    const newCocktail: SavedCocktail = {
        ...recipe,
        id: `cocktail-${Date.now()}`,
        image: image,
    };

    db.userData[userEmail].cocktails = [newCocktail, ...savedCocktails];
    saveDatabase(db);
    return newCocktail;
};

export const deleteCocktail = (cocktailId: string, userEmail: string): void => {
    const db = getDatabase();
    const savedCocktails = getUserData(userEmail).cocktails;
    db.userData[userEmail].cocktails = savedCocktails.filter(c => c.id !== cocktailId);
    saveDatabase(db);
};

export const getStandardCocktails = (): SavedCocktail[] => {
    const db = getDatabase();
    return db.standardCocktails || [];
};

export const saveStandardCocktails = (cocktails: SavedCocktail[]): void => {
    const db = getDatabase();
    db.standardCocktails = cocktails;
    saveDatabase(db);
};
