import { Recipe } from '../types';
import * as imageStore from './imageStore';
import { getDatabase, updateDatabase } from './database';

export const getAllRecipes = (): Recipe[] => {
    return getDatabase().recipes.all;
};

export const getAllRecipeTitles = (): string[] => {
    const db = getDatabase();
    return db.recipes.all.map(r => r.title);
};

export const getDistinctRecipeTags = (): string[] => {
    const db = getDatabase();
    const allTags = new Set<string>();
    db.recipes.all.forEach(item => {
        if (item.tags && Array.isArray(item.tags)) {
            item.tags.forEach(tag => allTags.add(tag));
        }
    });
    return Array.from(allTags).sort();
};

export const getPaginatedFilteredRecipes = (
    page: number,
    pageSize: number,
    search: string,
    tag: string
): { recipes: Recipe[], count: number | null } => {
    const db = getDatabase();
    let all = [...db.recipes.all]; // Make a copy

    if (search) {
        const lowercasedSearch = search.toLowerCase();
        all = all.filter(r => 
            r.title.toLowerCase().includes(lowercasedSearch) || 
            r.description.toLowerCase().includes(lowercasedSearch)
        );
    }
    if (tag && tag !== 'All') {
        all = all.filter(r => r.tags?.includes(tag));
    }

    const count = all.length;
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    const paginated = all.slice(from, to).sort((a,b) => a.title.localeCompare(b.title));

    return { recipes: paginated, count };
};

export const addRecipe = (recipe: Recipe, addToNew?: boolean, addToRotd?: boolean): void => {
     updateDatabase(db => {
        // Ensure ID is unique
        if (db.recipes.all.some(r => r.id === recipe.id)) {
            recipe.id = Date.now();
        }
        db.recipes.all.unshift(recipe);
        if(addToNew) {
            db.recipes.new.unshift(recipe);
        }
        if(addToRotd) {
            db.recipes.scheduled.unshift(recipe);
        }
     });
};

export const deleteRecipe = (recipeId: number) => {
    updateDatabase(db => {
        db.recipes.all = db.recipes.all.filter(r => r.id !== recipeId);
    });
};

export const updateRecipeWithAI = async (recipeId: number, title: string) => {
    // This is a placeholder as it requires Gemini.
    // In a real scenario, you'd fetch, update, and save.
    console.log(`AI update requested for ${recipeId} - ${title}`);
};

export const removeFromNew = (recipeId: number) => {
    updateDatabase(db => {
        db.recipes.new = db.recipes.new.filter(r => r.id !== recipeId);
    });
};

export const addToNew = (recipeId: number) => {
    updateDatabase(db => {
        const recipe = db.recipes.all.find(r => r.id === recipeId);
        if (recipe && !db.recipes.new.some(r => r.id === recipeId)) {
            db.recipes.new.unshift(recipe);
        }
    });
};

export const addToRotd = (recipeId: number) => {
    updateDatabase(db => {
        const recipe = db.recipes.all.find(r => r.id === recipeId);
        if (recipe && !db.recipes.scheduled.some(r => r.id === recipeId)) {
            db.recipes.scheduled.unshift(recipe);
        }
    });
};

export const saveScheduledRecipes = async (recipes: Recipe[]): Promise<void> => {
    updateDatabase(db => {
        db.recipes.scheduled = recipes;
    });
};

export const getRecipesByIds = (ids: (number | string)[]): Recipe[] => {
    if (!ids || ids.length === 0) return [];
    const numericIds = ids.map(id => Number(id));
    const db = getDatabase();
    return db.recipes.all.filter(r => numericIds.includes(r.id));
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
        
        // Boost score for recipes that have a high rating
        if (recipe.rating && recipe.rating.score > 4) {
            score += 0.5;
        }

        return { recipe, score };
    });

    // Filter out recipes with no matching tags and sort by score
    const sorted = scoredRecipes
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score);

    // Get the top recipes
    const topRecipes = sorted.map(item => item.recipe);

    // If not enough recommended recipes, fill with other popular ones
    if (topRecipes.length < count) {
        const otherRecipes = allRecipes
            .filter(r => !topRecipes.some(tr => tr.id === r.id)) // Exclude already selected
            .sort((a, b) => (b.rating?.count || 0) - (a.rating?.count || 0)); // Sort by popularity
        
        const needed = count - topRecipes.length;
        topRecipes.push(...otherRecipes.slice(0, needed));
    }

    return topRecipes.slice(0, count);
};
