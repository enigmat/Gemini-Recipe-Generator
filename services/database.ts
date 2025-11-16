import { AppDatabase, User, UserData, Recipe, Product, Newsletter, Lead, RatingsStore, SavedCocktail, ChatMessage, AboutUsContent, MealPlan, Video, CookingClass, ExpertQuestion } from '../types';
import { recipes as initialAllRecipes } from '../data/recipes';
import { newRecipes as initialNewRecipes } from '../data/newRecipes';
import { initialUsers } from '../data/users';
import { affiliateProducts } from '../data/affiliateProducts';
import { aboutUsData } from '../data/aboutUs';
import { standardCocktails } from '../data/cocktails';
import { mealPlans as initialMealPlans } from '../data/mealPlans';
import { videos as initialVideos } from '../data/videos';
import { cookingClasses as initialCookingClasses } from '../data/cookingClasses';
import { initialExpertQuestions } from '../data/expertQuestions';

const DB_LOCAL_STORAGE_KEY = 'recipe-extracter-database-v1';

// A simple listener system to notify App.tsx to re-render
let listener: (() => void) | null = null;

const initialDb: AppDatabase = {
    users: initialUsers,
    recipes: {
        all: initialAllRecipes,
        new: initialNewRecipes,
        scheduled: initialAllRecipes.slice(0, 30), // Use first 30 as a default pool
    },
    featuredChefs: [],
    products: affiliateProducts,
    newsletters: {
        sent: [],
        leads: [],
    },
    ratings: {},
    userData: initialUsers.reduce((acc, user) => {
        acc[user.email] = {
            favorites: [],
            shoppingLists: [],
            cocktails: [],
            calorieEntries: [],
            calorieSettings: { dailyTarget: 2000 },
        };
        return acc;
    }, {} as Record<string, UserData>),
    standardCocktails: standardCocktails,
    communityChat: [],
    aboutUs: aboutUsData,
    mealPlans: initialMealPlans,
    videos: initialVideos,
    cookingClasses: initialCookingClasses,
    expertQuestions: initialExpertQuestions,
};

const loadDatabase = (): AppDatabase => {
    try {
        const storedDb = localStorage.getItem(DB_LOCAL_STORAGE_KEY);
        if (storedDb) {
            // A simple check to ensure it's not malformed
            const parsed = JSON.parse(storedDb);
            if(parsed.recipes && parsed.users) {
                return parsed;
            }
        }
    } catch (e) {
        console.error("Failed to parse database from localStorage, resetting.", e);
    }
    // If nothing in storage or parsing fails, return a deep copy of initial data
    return JSON.parse(JSON.stringify(initialDb));
};

const saveDatabase = () => {
    try {
        localStorage.setItem(DB_LOCAL_STORAGE_KEY, JSON.stringify(db));
    } catch (e) {
        console.error("Failed to save database to localStorage", e);
    }
};

let db: AppDatabase = loadDatabase();

export const getDatabase = (): AppDatabase => db;

export const updateDatabase = (updater: (currentDb: AppDatabase) => void) => {
    const dbCopy = JSON.parse(JSON.stringify(db));
    updater(dbCopy);
    db = dbCopy;
    saveDatabase(); // Save after updating
    if (listener) {
        listener();
    }
};

export const setDatabase = (newDb: AppDatabase) => {
    db = newDb;
    saveDatabase(); // Save after setting
    if (listener) {
        listener();
    }
}

export const subscribe = (newListener: () => void): (() => void) => {
    listener = newListener;
    return () => { listener = null; };
};
