import { getDatabase, saveDatabase } from './cloudService';
import { AppDatabase, User, ShoppingList, SavedCocktail, RatingsStore, Recipe, AboutUsContent, Newsletter, Lead } from '../types';

const MIGRATION_FLAG_KEY = 'recipeAppMigrationV1Complete';

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

export const runMigration = (): void => {
    // 1. Check if migration has already been completed
    if (localStorage.getItem(MIGRATION_FLAG_KEY)) {
        return;
    }
    console.log("Running one-time data migration to new cloud format...");

    const db = getDatabase();
    let migrationOccurred = false;

    // --- Helper function to reduce redundancy ---
    const migrateGlobalData = <T>(oldKey: string, dbUpdater: (data: T) => void) => {
        const oldData = getOldData<T>(oldKey);
        if (oldData) {
            dbUpdater(oldData);
            migrationOccurred = true;
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

    // 4. Migrate user list and per-user data
    const oldUsers = getOldData<User[]>(OLD_KEYS.users);
    if (oldUsers) {
        migrationOccurred = true;
        // Merge user lists, giving precedence to existing users in the new DB
        const userMap = new Map(db.users.map(u => [u.email, u]));
        oldUsers.forEach(oldUser => {
            if (!userMap.has(oldUser.email)) {
                db.users.push(oldUser);
            }
        });

        // Now migrate data for each user found in the old list
        oldUsers.forEach(user => {
            const email = user.email;
            
            if (!db.userData[email]) {
                db.userData[email] = { favorites: [], shoppingLists: [], cocktails: [] };
            }

            const oldFavorites = getOldData<number[]>(`${OLD_KEYS.favoritesPrefix}${email}`);
            if (oldFavorites) db.userData[email].favorites = oldFavorites;

            const oldShoppingLists = getOldData<ShoppingList[]>(`${OLD_KEYS.shoppingListsPrefix}${email}`);
            if (oldShoppingLists) db.userData[email].shoppingLists = oldShoppingLists;

            const oldCocktails = getOldData<SavedCocktail[]>(`${OLD_KEYS.cocktailsPrefix}${email}`);
            if (oldCocktails) db.userData[email].cocktails = oldCocktails;
        });
    }

    if (migrationOccurred) {
        // 5. Save the migrated database
        saveDatabase(db);
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