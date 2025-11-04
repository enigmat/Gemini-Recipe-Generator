import { getSupabaseClient } from './supabaseClient';
import { AppDatabase, Recipe, UserData, User, Product, Newsletter, Lead, RatingsStore, SavedCocktail, ChatMessage, AboutUsContent, ExpertQuestion } from '../types';

const checkError = (response: any, tableName: string) => {
    if (response.error) throw new Error(`Failed to fetch ${tableName}: ${response.error.message}`);
    return response.data;
};

// This function gets public data on app startup.
export const getPublicData = async (): Promise<Partial<AppDatabase>> => {
    const supabase = getSupabaseClient();
    console.log("Fetching initial public database state...");
    
    const [
        recipes,
        newRecipes,
        scheduledRecipes,
        products,
        standardCocktails,
        aboutUs,
        mealPlans,
        videos,
        cookingClasses,
        expertQuestions
    ] = await Promise.all([
        supabase.from('recipes').select('*'),
        supabase.from('new_recipes').select('*'),
        supabase.from('scheduled_recipes').select('*'),
        supabase.from('products').select('*'),
        supabase.from('standard_cocktails').select('*'),
        supabase.from('about_us').select('*').maybeSingle(),
        supabase.from('meal_plans').select('*'),
        supabase.from('videos').select('*'),
        supabase.from('cooking_classes').select('*'),
        supabase.from('expert_questions').select('*'),
    ]);

    const publicDb: Partial<AppDatabase> = {
        recipes: {
            all: checkError(recipes, 'recipes') || [],
            new: checkError(newRecipes, 'new_recipes') || [],
            scheduled: checkError(scheduledRecipes, 'scheduled_recipes') || [],
        },
        products: checkError(products, 'products') || [],
        standardCocktails: checkError(standardCocktails, 'standard_cocktails') || [],
        aboutUs: checkError(aboutUs, 'about_us') || { companyName: '', missionStatement: '', companyHistory: '', contactEmail: '', address: '' },
        mealPlans: checkError(mealPlans, 'meal_plans') || [],
        videos: checkError(videos, 'videos') || [],
        cookingClasses: checkError(cookingClasses, 'cooking_classes') || [],
        expertQuestions: checkError(expertQuestions, 'expert_questions') || [],
        // These are not public, will be fetched later
        users: [],
        newsletters: { sent: [], leads: [] },
        ratings: {},
        communityChat: [],
        userData: {}
    };
    
    console.log("Public data loaded.");
    return publicDb;
};

// This function gets data available to any logged-in user.
export const getAuthenticatedData = async (): Promise<Partial<AppDatabase>> => {
    const supabase = getSupabaseClient();
    console.log("Fetching data for authenticated user...");

    const [ratings, communityChat] = await Promise.all([
        supabase.from('ratings').select('*'),
        supabase.from('community_chat').select('*').order('timestamp', { ascending: true }),
    ]);

    return {
        ratings: (checkError(ratings, 'ratings') || []).reduce((acc: RatingsStore, r: any) => {
            acc[r.recipe_id] = { totalScore: r.total_score, count: r.count, userRatings: r.user_ratings };
            return acc;
        }, {}),
        communityChat: checkError(communityChat, 'community_chat') || [],
    };
};

export const getAdminData = async (): Promise<Partial<AppDatabase>> => {
    const supabase = getSupabaseClient();
    console.log("Fetching admin-only data...");

    const [users, sentNewsletters, leads] = await Promise.all([
        supabase.from('user_profiles').select('*'),
        supabase.from('sent_newsletters').select('*'),
        supabase.from('leads').select('*'),
    ]);

    return {
        users: checkError(users, 'user_profiles') || [],
        newsletters: {
            sent: checkError(sentNewsletters, 'sent_newsletters') || [],
            leads: checkError(leads, 'leads') || [],
        },
    };
};


// FIX: Add the missing getDatabase function that several services depend on.
// A cached instance of the database to avoid multiple fetches per page load.
let dbInstance: AppDatabase | null = null;
let dbPromise: Promise<AppDatabase> | null = null;

/**
 * This function fetches the entire application state. It's intended for services
 * from the older architecture that expect a full DB object. It's less efficient
 * than granular fetches but necessary for compatibility during migration.
 * It uses a simple cache to avoid re-fetching on subsequent calls within the same app lifecycle.
 */
export const getDatabase = async (): Promise<AppDatabase> => {
    if (dbInstance) {
        return dbInstance;
    }
    if (dbPromise) {
        return dbPromise;
    }

    dbPromise = (async () => {
        const supabase = getSupabaseClient();
        console.log("Fetching entire database state for service compatibility...");

        // Fetch all data in parallel. RLS policies will ensure users only get what they're allowed to see.
        const [
            publicData,
            authenticatedData,
        ] = await Promise.all([
            getPublicData(),
            getAuthenticatedData(),
        ]);

        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        let currentUserData: UserData = { favorites: [], shoppingLists: [], cocktails: [] };
        if (userId) {
            currentUserData = await getUserData(userId);
        }

        const fullDb: AppDatabase = {
            recipes: publicData.recipes || { all: [], new: [], scheduled: [] },
            products: publicData.products || [],
            standardCocktails: publicData.standardCocktails || [],
            aboutUs: publicData.aboutUs || { companyName: '', missionStatement: '', companyHistory: '', contactEmail: '', address: '' },
            ratings: authenticatedData.ratings || {},
            communityChat: authenticatedData.communityChat || [],
            users: [], // Admin data removed
            newsletters: { sent: [], leads: [] }, // Admin data removed
            mealPlans: publicData.mealPlans || [],
            videos: publicData.videos || [],
            cookingClasses: publicData.cookingClasses || [],
            expertQuestions: publicData.expertQuestions || [],
            // The userData object in AppDatabase holds data for multiple users, but for client-side
            // services, we only need and can only fetch the current user's data.
            userData: userId ? { [userId]: currentUserData } : {},
        };

        dbInstance = fullDb;
        dbPromise = null; // Clear promise once resolved
        console.log("Full database state loaded for services.");
        return dbInstance;
    })();

    return dbPromise;
};

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

export const addExpertQuestion = async (questionData: Omit<ExpertQuestion, 'id'>): Promise<ExpertQuestion | null> => {
    const supabase = getSupabaseClient();
    const newQuestionForDb = {
        id: `q${Date.now()}`,
        question: questionData.question,
        topic: questionData.topic,
        status: questionData.status,
        submitted_date: questionData.submittedDate,
        answer: questionData.answer,
    };
    
    const { data, error } = await supabase
        .from('expert_questions')
        .insert(newQuestionForDb)
        .select()
        .single();
    
    if (error) {
        console.error("Error adding expert question:", error.message);
        return null;
    }

    return data as ExpertQuestion;
};

export const deleteRecipe = async (recipeId: number) => {
    const supabase = getSupabaseClient();
    // Use Promise.all to run in parallel
    const results = await Promise.all([
        supabase.from('recipes').delete().eq('id', recipeId),
        supabase.from('new_recipes').delete().eq('id', recipeId),
        supabase.from('scheduled_recipes').delete().eq('id', recipeId)
    ]);
    results.forEach(res => {
        if (res.error) console.error('Error during multi-table recipe delete:', res.error.message);
    });
};

export const deleteProduct = async (productId: string) => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) {
        console.error(`Error deleting product ${productId}:`, error.message);
        throw error;
    }
};

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