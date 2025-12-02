import { Recipe } from '../types';
import { getSupabaseClient } from './supabaseClient';

export const addRating = async (recipeId: number, score: number, userId: string): Promise<void> => {
    const supabase = getSupabaseClient();
    
    // Fetch current rating data
    const { data: currentRating, error: fetchError } = await supabase
        .from('ratings')
        .select('*')
        .eq('recipe_id', recipeId)
        .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // Ignore 'not found' error
        throw fetchError;
    }

    const newTotalScore = (currentRating?.total_score || 0) + score;
    const newCount = (currentRating?.count || 0) + 1;
    const newUserRatings = { ...(currentRating?.user_ratings || {}), [userId]: score };

    const { error: upsertError } = await supabase
        .from('ratings')
        .upsert({
            recipe_id: recipeId,
            total_score: newTotalScore,
            count: newCount,
            user_ratings: newUserRatings
        }, { onConflict: 'recipe_id' });

    if (upsertError) throw upsertError;
};

export const getRating = async (recipeId: number): Promise<Recipe['rating'] | undefined> => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('ratings')
        .select('total_score, count')
        .eq('recipe_id', recipeId)
        .single();

    if (error || !data || data.count === 0) {
        return undefined;
    }
    
    return {
        score: data.total_score / data.count,
        count: data.count,
    };
};