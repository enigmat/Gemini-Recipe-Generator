import { CocktailRecipe, SavedCocktail } from '../types';
// FIX: saveDatabase is removed. Use granular savers and supabase client.
import { getDatabase, getUserData, saveUserData } from './cloudService';
import * as imageStore from './imageStore';
import { getSupabaseClient } from './supabaseClient';

// FIX: make async and use userId
export const getSavedCocktails = async (userId: string | null): Promise<SavedCocktail[]> => {
  if (!userId) return [];
  // FIX: await promise
  const userData = await getUserData(userId);
  return userData.cocktails;
};

// FIX: make async and use userId
export const saveCocktail = async (recipe: CocktailRecipe, image: string, userId: string): Promise<SavedCocktail | null> => {
    // FIX: await promise
    const { cocktails: savedCocktails } = await getUserData(userId);

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

    const userData = await getUserData(userId);
    userData.cocktails = [newCocktail, ...savedCocktails];
    // FIX: use saveUserData
    await saveUserData(userId, userData);
    return newCocktail;
};

// FIX: make async and use userId
export const deleteCocktail = async (cocktailId: string, userId: string): Promise<void> => {
    // FIX: await promise
    const userData = await getUserData(userId);
    const savedCocktails = userData.cocktails;
    
    const cocktailToDelete = savedCocktails.find(c => c.id === cocktailId);
    if (cocktailToDelete && cocktailToDelete.image.startsWith('indexeddb:')) {
        const imageId = cocktailToDelete.image.split(':')[1].split('?')[0];
        imageStore.deleteImage(imageId);
    }

    userData.cocktails = savedCocktails.filter(c => c.id !== cocktailId);
    // FIX: use saveUserData
    await saveUserData(userId, userData);
};

// FIX: make async
export const getStandardCocktails = async (): Promise<SavedCocktail[]> => {
    // FIX: await promise
    const db = await getDatabase();
    return db.standardCocktails || [];
};

// FIX: make async and use supabase client
export const saveStandardCocktails = async (cocktails: SavedCocktail[]): Promise<void> => {
    const supabase = getSupabaseClient();
    const cocktailsForDb = cocktails.map(({ imagePrompt, ...rest }) => ({
        ...rest,
        image_prompt: imagePrompt
    }));
    const { error } = await supabase.from('standard_cocktails').upsert(cocktailsForDb);
    if (error) {
      console.error('Error saving standard cocktails:', error.message);
    }
};