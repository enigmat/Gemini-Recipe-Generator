import { CocktailRecipe, SavedCocktail } from '../types';
import { getDatabase, updateDatabase } from './database';
import * as imageStore from './imageStore';

export const getSavedCocktails = (userEmail: string | null): SavedCocktail[] => {
  if (!userEmail) return [];
  const db = getDatabase();
  return db.userData[userEmail]?.cocktails || [];
};

export const saveCocktail = (recipe: CocktailRecipe, image: string, userEmail: string): SavedCocktail | null => {
    const savedCocktails = getSavedCocktails(userEmail);

    if (savedCocktails.some(c => c.title.toLowerCase() === recipe.title.toLowerCase())) {
        return null;
    }

    const newCocktailId = `cocktail-${Date.now()}`;
    
    // Save the base64 image data to IndexedDB
    imageStore.setImage(newCocktailId, image);

    const newCocktail: SavedCocktail = {
        ...recipe,
        id: newCocktailId,
        image: `indexeddb:${newCocktailId}`, // Store the reference
    };

    updateDatabase(db => {
        if(db.userData[userEmail]) {
            db.userData[userEmail].cocktails.unshift(newCocktail);
        }
    });
    return newCocktail;
};

export const deleteCocktail = (cocktailId: string, userEmail: string): void => {
    const savedCocktails = getSavedCocktails(userEmail);
    const cocktailToDelete = savedCocktails.find(c => c.id === cocktailId);
    if (cocktailToDelete && cocktailToDelete.image.startsWith('indexeddb:')) {
        const imageId = cocktailToDelete.image.split(':')[1].split('?')[0];
        imageStore.deleteImage(imageId);
    }

    updateDatabase(db => {
        if (db.userData[userEmail]) {
            db.userData[userEmail].cocktails = db.userData[userEmail].cocktails.filter(c => c.id !== cocktailId);
        }
    });
};

export const getStandardCocktails = (): SavedCocktail[] => {
    return getDatabase().standardCocktails || [];
};

export const saveStandardCocktails = (cocktails: SavedCocktail[]): void => {
    updateDatabase(db => {
        db.standardCocktails = cocktails;
    });
};