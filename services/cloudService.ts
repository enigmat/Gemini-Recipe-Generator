import { getSupabaseClient } from './supabaseClient';
import { AppDatabase, Recipe, UserData, User, Product, Newsletter, Lead, RatingsStore, SavedCocktail, ChatMessage, AboutUsContent } from '../types';

// NOTE: This function fetches the entire database state from Supabase.
// In a production app, this would be heavily optimized to fetch only necessary data.
export const getDatabase = async (): Promise<AppDatabase> => {
    const supabase = getSupabaseClient();
    console.log("Fetching initial database state from Supabase...");
    
    const [
        recipes,
        newRecipes,
        scheduledRecipes,
        products,
        sentNewsletters,
        leads,
        ratings,
        standardCocktails,
        communityChat,
        aboutUs,
        users
    ] = await Promise.all([
        supabase.from('recipes').select('*'),
        supabase.from('new_recipes').select('*'),
        supabase.from('scheduled_recipes').select('*'),
        supabase.from('products').select('*'),
        supabase.from('sent_newsletters').select('*'),
        supabase.from('leads').select('*'),
        supabase.from('ratings').select('*'),
        supabase.from('standard_cocktails').select('*'),
        supabase.from('community_chat').select('*'),
        supabase.from('about_us').select('*').maybeSingle(),
        supabase.from('user_profiles').select('*'), // This is for admin user list, not sensitive auth data
    ]);

    const checkError = (response: any, tableName: string) => {
        if (response.error) throw new Error(`Failed to fetch ${tableName}: ${response.error.message}`);
        return response.data;
    };

    // A simple representation. Does not fetch userData for all users for security/performance.
    const db: AppDatabase = {
        recipes: {
            all: checkError(recipes, 'recipes') || [],
            new: checkError(newRecipes, 'new_recipes') || [],
            scheduled: checkError(scheduledRecipes, 'scheduled_recipes') || [],
        },
        products: checkError(products, 'products') || [],
        newsletters: {
            sent: checkError(sentNewsletters, 'sent_newsletters') || [],
            leads: checkError(leads, 'leads') || [],
        },
        ratings: (checkError(ratings, 'ratings') || []).reduce((acc: RatingsStore, r: any) => {
            acc[r.recipe_id] = { totalScore: r.total_score, count: r.count, userRatings: r.user_ratings };
            return acc;
        }, {}),
        standardCocktails: checkError(standardCocktails, 'standard_cocktails') || [],
        communityChat: checkError(communityChat, 'community_chat') || [],
        aboutUs: checkError(aboutUs, 'about_us') || { companyName: '', missionStatement: '', companyHistory: '', contactEmail: '', address: '' },
        users: checkError(users, 'user_profiles') || [],
        userData: {}, // This will be fetched on a per-user basis after login.
    };
    
    console.log("Initial database state loaded.");
    return db;
};


// The single saveDatabase function is now replaced by granular async functions.

export const saveAllRecipes = async (recipes: Recipe[]) => {
    const supabase = getSupabaseClient();
    const recipesForDb = recipes.map(({ cookTime, winePairing, ...rest }) => ({
        ...rest,
        cook_time: cookTime,
        wine_pairing: winePairing
    }));
    const { error } = await supabase.from('recipes').upsert(recipesForDb);
    if (error) console.error('Error saving all recipes:', error.message);
};

export const saveNewRecipes = async (recipes: Recipe[]) => {
    const supabase = getSupabaseClient();
    const recipesForDb = recipes.map(({ cookTime, winePairing, ...rest }) => ({
        ...rest,
        cook_time: cookTime,
        wine_pairing: winePairing
    }));
    await supabase.from('new_recipes').delete().neq('id', -1); // "delete all" trick
    const { error } = await supabase.from('new_recipes').insert(recipesForDb);
    if (error) console.error('Error saving new recipes:', error.message);
};

export const saveScheduledRecipes = async (recipes: Recipe[]) => {
    const supabase = getSupabaseClient();
    const recipesForDb = recipes.map(({ cookTime, winePairing, ...rest }) => ({
        ...rest,
        cook_time: cookTime,
        wine_pairing: winePairing
    }));
    await supabase.from('scheduled_recipes').delete().neq('id', -1);
    const { error } = await supabase.from('scheduled_recipes').insert(recipesForDb);
    if (error) console.error('Error saving scheduled recipes:', error.message);
};

export const saveProducts = async (products: Product[]) => {
    const supabase = getSupabaseClient();
    const productsForDb = products.map(({ imageUrl, affiliateUrl, ...rest }) => ({
        ...rest,
        image_url: imageUrl,
        affiliate_url: affiliateUrl
    }));
    const { error } = await supabase.from('products').upsert(productsForDb);
    if (error) console.error('Error saving products:', error.message);
};

export const saveRatings = async (ratings: RatingsStore) => {
    const supabase = getSupabaseClient();
    const dataToSave = Object.entries(ratings).map(([recipe_id, value]) => ({
        recipe_id: parseInt(recipe_id),
        total_score: value.totalScore,
        count: value.count,
        user_ratings: value.userRatings
    }));
    const { error } = await supabase.from('ratings').upsert(dataToSave, { onConflict: 'recipe_id' });
    if (error) console.error('Error saving ratings:', error.message);
};

export const saveAboutUsContent = async (content: AboutUsContent) => {
    const supabase = getSupabaseClient();
    const contentForDb = {
        id: 1, // Assuming a single row in 'about_us' with a known ID, e.g., 1
        company_name: content.companyName,
        mission_statement: content.missionStatement,
        company_history: content.companyHistory,
        contact_email: content.contactEmail,
        address: content.address,
    };
    const { error } = await supabase.from('about_us').upsert(contentForDb);
    if (error) console.error('Error saving about us content:', error.message);
}

// --- User-Specific Data ---

// This gets the user-specific data (favorites, lists, etc.)
export const getUserData = async (userId: string): Promise<UserData> => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('user_data')
        .select('data')
        .eq('user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = "Not a single row" (i.e., not found)
        console.error('Error fetching user data:', error.message);
        throw error;
    }

    return data ? data.data : { favorites: [], shoppingLists: [], cocktails: [] };
};

// This saves the user-specific data
export const saveUserData = async (userId: string, userData: UserData) => {
    const supabase = getSupabaseClient();
    const { error } = await supabase
        .from('user_data')
        .upsert({ user_id: userId, data: userData }, { onConflict: 'user_id' });

    if (error) {
        console.error('Error saving user data:', error.message);
        throw error;
    }
};