import { CocktailRecipe, SavedCocktail } from '../types';
import { getSupabaseClient } from './supabaseClient';
import * as imageStore from './imageStore';
import { getUserData } from './userService';

const saveUserCocktails = async (userId: string, cocktails: SavedCocktail[]) => {
    const supabase = getSupabaseClient();
    const currentData = await getUserData(userId);
    currentData.cocktails = cocktails;

    const { error } = await supabase
        .from('user_data')
        .upsert({ user_id: userId, data: currentData }, { onConflict: 'user_id' });
    if (error) throw error;
}

export const getSavedCocktails = async (userId: string): Promise<SavedCocktail[]> => {
    const data = await getUserData(userId);
    return data.cocktails || [];
};

export const saveCocktail = async (recipe: CocktailRecipe, image: string, userId: string): Promise<SavedCocktail | null> => {
    const savedCocktails = await getSavedCocktails(userId);

    if (savedCocktails.some(c => c.title.toLowerCase() === recipe.title.toLowerCase())) {
        return null;
    }

    const newCocktailId = `cocktail-${Date.now()}`;
    await imageStore.setImage(newCocktailId, image);

    const newCocktail: SavedCocktail = {
        ...recipe,
        id: newCocktailId,
        image: `indexeddb:${newCocktailId}`,
    };

    await saveUserCocktails(userId, [newCocktail, ...savedCocktails]);
    return newCocktail;
};

export const deleteCocktail = async (cocktailId: string, userId: string): Promise<void> => {
    const savedCocktails = await getSavedCocktails(userId);
    const cocktailToDelete = savedCocktails.find(c => c.id === cocktailId);
    if (cocktailToDelete && cocktailToDelete.image.startsWith('indexeddb:')) {
        const imageId = cocktailToDelete.image.split(':')[1].split('?')[0];
        imageStore.deleteImage(imageId);
    }

    const updatedCocktails = savedCocktails.filter(c => c.id !== cocktailId);
    await saveUserCocktails(userId, updatedCocktails);
};

export const getStandardCocktails = async (): Promise<SavedCocktail[]> => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from('standard_cocktails').select('*');
    if (error) throw error;
    return data.map(({ image_prompt, ...rest }) => ({ ...rest, imagePrompt: image_prompt }));
};

export const saveStandardCocktails = async (cocktails: SavedCocktail[]): Promise<void> => {
    const supabase = getSupabaseClient();
    const { error: deleteError } = await supabase.from('standard_cocktails').delete().neq('id', -1);
    if (deleteError) throw deleteError;

    if (cocktails.length === 0) return;

    const dbCocktails = cocktails.map(({ imagePrompt, ...rest }) => ({ ...rest, image_prompt: imagePrompt }));
    const { error: insertError } = await supabase.from('standard_cocktails').insert(dbCocktails);
    if (insertError) throw insertError;
};