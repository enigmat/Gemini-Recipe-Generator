import { AppDatabase, UserData } from '../types';

// Import initial data
import { recipes as initialRecipes } from '../data/recipes';
import { newRecipes as initialNewRecipes } from '../data/newRecipes';
import { initialUsers } from '../data/users';
import { affiliateProducts as initialProducts } from '../data/affiliateProducts';
import { aboutUsData as initialAboutUsData } from '../data/aboutUs';

const DB_KEY = 'recipeAppCloudDatabase';

let database: AppDatabase | null = null;

function initializeDatabase(): AppDatabase {
    console.log("Initializing cloud database in localStorage for the first time.");
    const newDb: AppDatabase = {
        users: initialUsers,
        products: initialProducts,
        aboutUs: initialAboutUsData,
        newsletters: {
            sent: [],
            leads: [],
        },
        ratings: {},
        userData: {}, // User-specific data, including recipes, is now initialized on-demand
    };
    saveDatabase(newDb);
    return newDb;
}

export const getDatabase = (): AppDatabase => {
    if (database) {
        return database;
    }
    try {
        const dbJson = localStorage.getItem(DB_KEY);
        if (dbJson) {
            database = JSON.parse(dbJson);
            return database!;
        } else {
            database = initializeDatabase();
            return database;
        }
    } catch (error) {
        console.error("Error reading from localStorage, initializing new database.", error);
        database = initializeDatabase();
        return database;
    }
};

export const saveDatabase = (db: AppDatabase): void => {
    try {
        const dbJson = JSON.stringify(db);
        localStorage.setItem(DB_KEY, dbJson);
        database = JSON.parse(dbJson); // Keep in-memory cache up to date by re-parsing
    } catch (error) {
        console.error("Could not save database to localStorage", error);
    }
};

export const getUserData = (userEmail: string): UserData => {
    const db = getDatabase();
    if (!db.userData[userEmail]) {
        // Create a new user data object if it doesn't exist
        db.userData[userEmail] = { 
            favorites: [], 
            shoppingLists: [], 
            cocktails: [],
            recipes: {
                all: initialRecipes, // Seed with initial data
                new: initialNewRecipes,
                scheduled: []
            }
        };
        console.log(`Initialized data store for new user: ${userEmail}`);
    } else if (!db.userData[userEmail].recipes) {
        // If an existing user from a previous version doesn't have recipes, add them.
        db.userData[userEmail].recipes = {
            all: initialRecipes,
            new: initialNewRecipes,
            scheduled: []
        };
        console.log(`Migrated recipes collection for existing user: ${userEmail}`);
    }
    return db.userData[userEmail];
};