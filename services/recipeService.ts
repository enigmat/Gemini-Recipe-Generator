import { Recipe, MealPlan, Video, CookingClass, ExpertQuestion } from '../types';
import { getSupabaseClient } from './supabaseClient';

const mapRecipeFromDb = (dbRecipe: any): Recipe => {
    if (!dbRecipe) return null as any;
    const { cook_time, wine_pairing, ...rest } = dbRecipe;
    return { ...rest, cookTime: cook_time, winePairing: wine_pairing } as Recipe;
};

export const getPaginatedFilteredRecipes = async (
    page: number,
    pageSize: number,
    search: string,
    tag: string
): Promise<{ recipes: Recipe[], count: number | null }> => {
    const supabase = getSupabaseClient();
    let query = supabase.from('recipes').select('*', { count: 'exact' });

    if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }
    if (tag && tag !== 'All') {
        query = query.contains('tags', [tag]);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to).order('title', { ascending: true });
    
    const { data, error, count } = await query;
    if (error) throw error;

    const recipes = data.map(mapRecipeFromDb);
    return { recipes, count };
};

export const getAllRecipeTitles = async (): Promise<string[]> => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from('recipes').select('title');
    if (error) throw error;
    return data.map(r => r.title);
};

export const getDistinctRecipeTags = async (): Promise<string[]> => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from('recipes').select('tags');
    if (error) throw error;
    const allTags = new Set<string>();
    data.forEach(item => {
        if (item.tags && Array.isArray(item.tags)) {
            item.tags.forEach(tag => allTags.add(tag));
        }
    });
    return Array.from(allTags).sort();
};

export const getNewRecipes = async (): Promise<Recipe[]> => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from('new_recipes').select('*');
    if (error) throw error;
    return data.map(mapRecipeFromDb);
};

export const getRecipesByIds = async (ids: number[]): Promise<Recipe[]> => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from('recipes').select('*').in('id', ids);
    if (error) throw error;
    return data.map(mapRecipeFromDb);
};

export const getMealPlans = async (): Promise<MealPlan[]> => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from('meal_plans').select('*');
    if (error) throw error;
    return data.map(({ recipe_ids, ...rest }) => ({ ...rest, recipeIds: recipe_ids }));
}

export const getVideos = async (): Promise<Video[]> => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from('videos').select('*');
    if (error) throw error;
    return data.map(({ video_url, thumbnail_url, ...rest }) => ({ ...rest, videoUrl: video_url, thumbnailUrl: thumbnail_url }));
}

export const getCookingClasses = async (): Promise<CookingClass[]> => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from('cooking_classes').select('*');
    if (error) throw error;
    return data.map(({ thumbnail_url, what_you_will_learn, techniques_covered, pro_tips, ...rest }) => ({
        ...rest,
        thumbnailUrl: thumbnail_url,
        whatYouWillLearn: what_you_will_learn,
        techniquesCovered: techniques_covered,
        proTips: pro_tips,
    }));
}

export const getExpertQuestions = async (): Promise<ExpertQuestion[]> => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from('expert_questions').select('*').order('submitted_date', { ascending: false });
    if (error) throw error;
    return data.map(({ submitted_date, ...rest }) => ({ ...rest, submittedDate: submitted_date }));
}

export const addExpertQuestion = async (question: string, topic: string) => {
    const supabase = getSupabaseClient();
    const newQuestion = {
        id: `q_${Date.now()}`,
        question,
        topic,
        status: 'Pending',
        submitted_date: new Date().toISOString()
    };
    const { error } = await supabase.from('expert_questions').insert(newQuestion);
    if (error) throw error;
}

export const addRecipe = async (recipe: Recipe, addToNew?: boolean): Promise<void> => {
    const supabase = getSupabaseClient();
    const { cookTime, winePairing, ...rest } = recipe;
    const dbRecipe = { ...rest, cook_time: cookTime, wine_pairing: winePairing };
    
    const { error } = await supabase.from('recipes').upsert(dbRecipe);
    if (error) throw error;

    if(addToNew) {
        const { error: newError } = await supabase.from('new_recipes').upsert(dbRecipe);
        if (newError) console.error("Error adding to new_recipes:", newError);
    }
};

export const deleteRecipe = async (recipeId: number) => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('recipes').delete().eq('id', recipeId);
    if (error) throw error;
};

export const updateRecipeWithAI = async (recipeId: number, title: string) => {
    console.log(`AI update requested for ${recipeId} - ${title}. This is a placeholder.`);
};

export const removeFromNew = async (recipeId: number) => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('new_recipes').delete().eq('id', recipeId);
    if (error) throw error;
};

export const addToNew = async (recipeId: number) => {
    const supabase = getSupabaseClient();
    const { data: recipe, error: fetchError } = await supabase.from('recipes').select('*').eq('id', recipeId).single();
    if (fetchError || !recipe) throw fetchError || new Error("Recipe not found");
    
    const { error: insertError } = await supabase.from('new_recipes').upsert(recipe);
    if (insertError) throw insertError;
};

export const addToRotd = async (recipeId: number) => {
    const supabase = getSupabaseClient();
    const { data: recipe, error: fetchError } = await supabase.from('recipes').select('*').eq('id', recipeId).single();
    if (fetchError || !recipe) throw fetchError || new Error("Recipe not found");
    
    const { error: insertError } = await supabase.from('scheduled_recipes').upsert(recipe);
    if (insertError) throw insertError;
};

export const saveScheduledRecipes = async (recipes: Recipe[]): Promise<void> => {
    const supabase = getSupabaseClient();
    // Clear the table first
    const { error: deleteError } = await supabase.from('scheduled_recipes').delete().neq('id', -1);
    if (deleteError) throw deleteError;

    if (recipes.length === 0) return;

    const dbRecipes = recipes.map(({ cookTime, winePairing, ...rest }) => ({ ...rest, cook_time: cookTime, wine_pairing: winePairing }));
    const { error: insertError } = await supabase.from('scheduled_recipes').insert(dbRecipes);
    if (insertError) throw insertError;
};

export const getRecommendedRecipes = (preferences: string[], allRecipes: Recipe[], count: number = 10): Recipe[] => {
    if (!preferences || preferences.length === 0) {
        return allRecipes.slice(0, count); // Fallback
    }

    const lowercasedPrefs = preferences.map(p => p.toLowerCase());

    const scoredRecipes = allRecipes.map(recipe => {
        let score = 0;
        const recipeTags = (recipe.tags || []).map(t => t.toLowerCase());
        if (recipe.cuisine) {
            recipeTags.push(recipe.cuisine.toLowerCase());
        }

        for (const pref of lowercasedPrefs) {
            if (recipeTags.includes(pref)) {
                score++;
            }
        }
        
        if (recipe.rating && recipe.rating.score > 4) {
            score += 0.5;
        }

        return { recipe, score };
    });

    const sorted = scoredRecipes
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score);

    const topRecipes = sorted.map(item => item.recipe);

    if (topRecipes.length < count) {
        const otherRecipes = allRecipes
            .filter(r => !topRecipes.some(tr => tr.id === r.id))
            .sort((a, b) => (b.rating?.count || 0) - (a.rating?.count || 0));
        
        const needed = count - topRecipes.length;
        topRecipes.push(...otherRecipes.slice(0, needed));
    }

    return topRecipes.slice(0, count);
};