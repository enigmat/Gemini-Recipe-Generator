import { Recipe } from '../types';
import { getSupabaseClient } from './supabaseClient';

const mapRecipeFromDb = (dbRecipe: any): Recipe => {
    if (!dbRecipe) return null as any;
    const { cook_time, wine_pairing, ...rest } = dbRecipe;
    return { ...rest, cookTime: cook_time, winePairing: wine_pairing } as Recipe;
};

const getDayOfYear = (date: Date): number => {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
};

export const getTodaysRecipe = async (): Promise<Recipe | null> => {
    const supabase = getSupabaseClient();
    try {
        const { data: scheduledRecipes, error } = await supabase.from('scheduled_recipes').select('*');
        if (error || scheduledRecipes.length === 0) {
            console.warn("Recipe of the Day pool is empty or failed to load.", error?.message);
            return null;
        }

        const dayIndex = getDayOfYear(new Date()) % scheduledRecipes.length;
        const recipe = scheduledRecipes[dayIndex];

        return mapRecipeFromDb(recipe);

    } catch (error) {
        console.error("Failed to get Recipe of the Day:", error);
        return null;
    }
};

export const archiveRecipe = async (recipe: Recipe): Promise<boolean> => {
    const supabase = getSupabaseClient();
    
    const { cookTime, winePairing, ...rest } = recipe;
    const dbRecipe = { ...rest, cook_time: cookTime, wine_pairing: winePairing };

    // Upsert into main list to be safe
    const { error: upsertError } = await supabase.from('recipes').upsert(dbRecipe, { onConflict: 'id' });
    if (upsertError) {
        console.error(`Failed to archive recipe ${recipe.id} to main list`, upsertError);
        return false;
    }
    
    // Remove from scheduled list
    const { error: deleteError } = await supabase.from('scheduled_recipes').delete().eq('id', recipe.id);
    if (deleteError) {
        console.error(`Failed to remove recipe ${recipe.id} from scheduled list`, deleteError);
        // Don't return false, as the main goal was to get it into the main list
    }
    
    return true;
};

export const getFeaturedChefs = async (): Promise<Recipe[]> => {
    // In a real application, this would be a separate 'featured_chefs' table.
    // For now, we'll just pull a few from the main recipe list.
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from('recipes').select('*').limit(3).order('id', {ascending: false});
    if (error) {
        console.error("Error fetching featured chefs:", error);
        return [];
    }
    return data.map(mapRecipeFromDb);
}

export const featureChef = async (recipe: Recipe): Promise<void> => {
    // This is a placeholder as there's no dedicated 'featured_chefs' table to write to.
    console.log(`Placeholder: Chef ${recipe.chef?.name} would be featured.`);
}