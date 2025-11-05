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

// A simple listener system to notify App.tsx to re-render
let listener: (() => void) | null = null;

let db: AppDatabase = {
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

export const getDatabase = (): AppDatabase => db;

export const updateDatabase = (updater: (currentDb: AppDatabase) => void) => {
    // The updater function mutates the draft (a copy)
    const dbCopy = JSON.parse(JSON.stringify(db));
    updater(dbCopy);
    db = dbCopy;
    if (listener) {
        listener();
    }
};

export const setDatabase = (newDb: AppDatabase) => {
    db = newDb;
     if (listener) {
        listener();
    }
}

export const subscribe = (newListener: () => void): (() => void) => {
    listener = newListener;
    // Return an unsubscribe function
    return () => { listener = null; };
};