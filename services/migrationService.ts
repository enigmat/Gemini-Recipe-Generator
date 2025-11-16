import { getSupabaseClient } from './supabaseClient';
import { AppDatabase, User, ShoppingList, SavedCocktail, RatingsStore, Recipe, AboutUsContent, Newsletter, Lead } from '../types';

const MIGRATION_FLAG_KEY = 'recipeAppMigrationV2Complete'; // Renamed to ensure it runs again after this fix
const DB_LOCAL_STORAGE_KEY = 'recipe-extracter-database-v1';

const getOldData = <T extends AppDatabase>(): T | null => {
    try {
        const data = localStorage.getItem(DB_LOCAL_STORAGE_KEY);
        if (data && data !== 'undefined' && data !== 'null') {
            return JSON.parse(data) as T;
        }
        return null;
    } catch (e) {
        console.error(`Error parsing old database from localStorage:`, e);
        return null;
    }
};

const saveDatabase = async (db: AppDatabase): Promise<void> => {
    const supabase = getSupabaseClient();
    console.log("Saving full migrated database to Supabase...");

    const { error: recipesError } = await supabase.from('recipes').upsert(db.recipes.all);
    if(recipesError) console.error("Migration: recipes", recipesError);
    
    // For collections that should be replaced, not merged
    await supabase.from('new_recipes').delete().neq('id', -1);
    const { error: newRecipesError } = await supabase.from('new_recipes').insert(db.recipes.new);
    if(newRecipesError) console.error("Migration: new_recipes", newRecipesError);

    await supabase.from('scheduled_recipes').delete().neq('id', -1);
    const { error: scheduledRecipesError } = await supabase.from('scheduled_recipes').insert(db.recipes.scheduled);
    if(scheduledRecipesError) console.error("Migration: scheduled_recipes", scheduledRecipesError);
    
    const { error: productsError } = await supabase.from('products').upsert(db.products);
    if(productsError) console.error("Migration: products", productsError);
    
    const { error: newslettersError } = await supabase.from('sent_newsletters').upsert(db.newsletters.sent);
    if(newslettersError) console.error("Migration: sent_newsletters", newslettersError);

    const { error: leadsError } = await supabase.from('leads').upsert(db.newsletters.leads);
    if(leadsError) console.error("Migration: leads", leadsError);
    
    const ratingsData = Object.entries(db.ratings).map(([recipe_id, value]) => ({ recipe_id: parseInt(recipe_id), ...value }));
    const { error: ratingsError } = await supabase.from('ratings').upsert(ratingsData, { onConflict: 'recipe_id' });
    if(ratingsError) console.error("Migration: ratings", ratingsError);

    console.warn("User-specific data (favorites, shopping lists, cocktails) cannot be reliably migrated from localStorage due to the switch from email keys to user IDs. This data will be skipped.");
};


export const runMigration = async (): Promise<void> => {
    // 1. Check if migration has already been completed
    if (localStorage.getItem(MIGRATION_FLAG_KEY)) {
        return;
    }
    console.log("Checking for local data to migrate...");

    const localDb = getOldData<AppDatabase>();

    if (!localDb) {
        console.log("No local database found to migrate.");
        localStorage.setItem(MIGRATION_FLAG_KEY, 'true');
        return;
    }
    
    console.log("Running one-time data migration from localStorage to Supabase format...");

    // Remove user-specific data that cannot be migrated
    localDb.users = [];
    localDb.userData = {};
    
    await saveDatabase(localDb);
    console.log("Data migration complete. New database saved.");

    // Clean up old key
    localStorage.removeItem(DB_LOCAL_STORAGE_KEY);
    console.log("Cleaned up old localStorage database.");
    
    // Set the flag to prevent running again
    localStorage.setItem(MIGRATION_FLAG_KEY, 'true');
};
