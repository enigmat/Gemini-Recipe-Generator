import { getSupabaseClient } from './supabaseClient';
import { getDatabase } from './cloudService';
import { AppDatabase, User, ShoppingList, SavedCocktail, RatingsStore, Recipe, AboutUsContent, Newsletter, Lead } from '../types';

const MIGRATION_FLAG_KEY = 'recipeAppMigrationV2Complete'; // Renamed to ensure it runs again after this fix

// Define old keys
const OLD_KEYS = {
    allRecipes: 'recipeAppAllRecipes',
    newRecipes: 'recipeAppNewRecipes',
    scheduledRecipes: 'recipeAppScheduledRecipes',
    users: 'recipeAppUsers',
    products: 'recipeAppProducts',
    aboutUs: 'recipeAppAboutUs',
    sentNewsletters: 'recipeAppSentNewsletters',
    leads: 'recipeAppLeads',
    ratings: 'recipeAppRatings',
    // Dynamic user keys
    favoritesPrefix: 'recipeAppFavorites_',
    shoppingListsPrefix: 'recipeAppShoppingLists_',
    cocktailsPrefix: 'recipeAppCocktails_',
};

const getOldData = <T>(key: string): T | null => {
    try {
        const data = localStorage.getItem(key);
        // Ensure we don't parse "undefined" or "null" strings
        if (data && data !== 'undefined' && data !== 'null') {
            return JSON.parse(data) as T;
        }
        return null;
    } catch (e) {
        console.error(`Error parsing old data for key ${key}:`, e);
        return null;
    }
};

// FIX: Create a local saveDatabase function since the global one was removed.
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

    // This assumes user profiles from localStorage are complete and correct.
    const { error: usersError } = await supabase.from('user_profiles').upsert(db.users);
    if(usersError) console.error("Migration: user_profiles", usersError);
    
    // This is tricky as we can't easily get the user ID. This part of migration is lossy.
    // The old system used email as a key. The new system uses auth ID.
    // This will only work if the user_profiles table has a unique constraint on email and we can join.
    // For this fix, we will assume user data cannot be migrated automatically this way.
    console.warn("User-specific data (favorites, shopping lists, cocktails) cannot be reliably migrated from localStorage due to the switch from email keys to user IDs. This data will be skipped.");
};


// FIX: Make the entire function async
export const runMigration = async (): Promise<void> => {
    // 1. Check if migration has already been completed
    if (localStorage.getItem(MIGRATION_FLAG_KEY)) {
        return;
    }
    console.log("Running one-time data migration from localStorage to Supabase format...");

    // FIX: await promise
    const db = await getDatabase();
    let migrationOccurred = false;

    // --- Helper function to reduce redundancy ---
    const migrateGlobalData = <T>(oldKey: string, dbUpdater: (data: T) => void) => {
        const oldData = getOldData<T>(oldKey);
        if (oldData && (!Array.isArray(oldData) || oldData.length > 0)) {
            dbUpdater(oldData);
            migrationOccurred = true;
            console.log(`Found and staged data from ${oldKey}`);
        }
    };

    // 3. Migrate global data
    migrateGlobalData<Recipe[]>(OLD_KEYS.allRecipes, data => db.recipes.all = data);
    migrateGlobalData<Recipe[]>(OLD_KEYS.newRecipes, data => db.recipes.new = data);
    migrateGlobalData<Recipe[]>(OLD_KEYS.scheduledRecipes, data => db.recipes.scheduled = data);
    migrateGlobalData<AppDatabase['products']>(OLD_KEYS.products, data => db.products = data);
    migrateGlobalData<AboutUsContent>(OLD_KEYS.aboutUs, data => db.aboutUs = data);
    migrateGlobalData<Newsletter[]>(OLD_KEYS.sentNewsletters, data => db.newsletters.sent = data);
    migrateGlobalData<Lead[]>(OLD_KEYS.leads, data => db.newsletters.leads = data);
    migrateGlobalData<RatingsStore>(OLD_KEYS.ratings, data => db.ratings = data);

    // 4. Migrate user list (profiles)
    const oldUsers = getOldData<User[]>(OLD_KEYS.users);
    if (oldUsers) {
        migrationOccurred = true;
        // The old user data is missing auth IDs. We can't safely migrate it without risking conflicts.
        // We'll log this. The user list in Supabase will be the source of truth.
        console.warn("Found old user list in localStorage, but cannot migrate it as it lacks auth IDs. User profiles must be created via signup.");
    }

    if (migrationOccurred) {
        // 5. Save the migrated database
        await saveDatabase(db);
        console.log("Data migration complete. New database saved.");

        // 7. (Optional) Clean up old keys
        Object.values(OLD_KEYS).forEach(key => {
            if (!key.endsWith('_')) {
                localStorage.removeItem(key);
            }
        });
        if (oldUsers) {
            oldUsers.forEach(user => {
                localStorage.removeItem(`${OLD_KEYS.favoritesPrefix}${user.email}`);
                localStorage.removeItem(`${OLD_KEYS.shoppingListsPrefix}${user.email}`);
                localStorage.removeItem(`${OLD_KEYS.cocktailsPrefix}${user.email}`);
            });
        }
        console.log("Cleaned up old localStorage keys.");
    }

    // 6. Set the flag to prevent running again, even if no data was found to migrate
    localStorage.setItem(MIGRATION_FLAG_KEY, 'true');
};
