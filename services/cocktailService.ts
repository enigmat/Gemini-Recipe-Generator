import { CocktailRecipe, SavedCocktail } from '../types';
import { getDatabase, saveDatabase, getUserData } from './cloudService';
import * as imageStore from './imageStore';

export const getSavedCocktails = (userEmail: string | null): SavedCocktail[] => {
  if (!userEmail) return [];
  const userData = getUserData(userEmail);
  return userData.cocktails;
};

export const saveCocktail = async (recipe: CocktailRecipe, image: string, userEmail: string): Promise<SavedCocktail | null> => {
    const db = getDatabase();
    const savedCocktails = getUserData(userEmail).cocktails;

    if (savedCocktails.some(c => c.title.toLowerCase() === recipe.title.toLowerCase())) {
        return null;
    }

    const newCocktailId = `cocktail-${Date.now()}`;
    
    // Save the base64 image data to IndexedDB
    await imageStore.setImage(newCocktailId, image);

    const newCocktail: SavedCocktail = {
        ...recipe,
        id: newCocktailId,
        image: `indexeddb:${newCocktailId}`, // Store the reference
    };

    db.userData[userEmail].cocktails = [newCocktail, ...savedCocktails];
    saveDatabase(db);
    return newCocktail;
};

export const deleteCocktail = (cocktailId: string, userEmail: string): void => {
    const db = getDatabase();
    const savedCocktails = getUserData(userEmail).cocktails;
    
    const cocktailToDelete = savedCocktails.find(c => c.id === cocktailId);
    if (cocktailToDelete && cocktailToDelete.image.startsWith('indexeddb:')) {
        const imageId = cocktailToDelete.image.split(':')[1].split('?')[0];
        imageStore.deleteImage(imageId);
    }

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