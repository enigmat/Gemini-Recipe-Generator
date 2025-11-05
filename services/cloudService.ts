import { getDatabase as getDb, updateDatabase } from './database';
import { AppDatabase, Recipe, UserData, RatingsStore, AboutUsContent, ExpertQuestion, Product } from '../types';

// This file is now a compatibility layer for the old structure.
// New code should ideally use database.ts directly.

export const getPublicData = (): Partial<AppDatabase> => {
    // FIX: Use aliased import to avoid name conflict.
    const db = getDb();
    return {
        recipes: {
            all: db.recipes.all,
            new: db.recipes.new,
            scheduled: db.recipes.scheduled,
        },
        products: db.products,
        standardCocktails: db.standardCocktails,
        aboutUs: db.aboutUs,
        mealPlans: db.mealPlans,
        videos: db.videos,
        cookingClasses: db.cookingClasses,
        expertQuestions: db.expertQuestions,
    };
};

export const getAuthenticatedData = (): Partial<AppDatabase> => {
    // FIX: Use aliased import to avoid name conflict.
    const db = getDb();
    return {
        ratings: db.ratings,
        communityChat: db.communityChat,
    };
};

export const getAdminData = (): Partial<AppDatabase> => {
    // FIX: Use aliased import to avoid name conflict.
     const db = getDb();
     return {
        users: db.users,
        newsletters: db.newsletters,
    };
};

export const getDistinctRecipeTags = (): string[] => {
    // FIX: Use aliased import to avoid name conflict.
    const db = getDb();
    const allTags = new Set<string>();
    db.recipes.all.forEach(item => {
        if (item.tags && Array.isArray(item.tags)) {
            item.tags.forEach(tag => allTags.add(tag));
        }
    });
    return Array.from(allTags).sort();
};

export const saveRatings = (ratings: RatingsStore): void => {
    updateDatabase(db => {
        db.ratings = ratings;
    });
};

export const saveAboutUsContent = (content: AboutUsContent): void => {
    updateDatabase(db => {
        db.aboutUs = content;
    });
};

export const addExpertQuestion = (questionData: Omit<ExpertQuestion, 'id'>): ExpertQuestion => {
    const newQuestion = { ...questionData, id: `q${Date.now()}`};
    updateDatabase(db => {
        db.expertQuestions.unshift(newQuestion);
    });
    return newQuestion;
};

export const getUserData = (userId: string): UserData => {
    // FIX: Use aliased import to avoid name conflict.
    const db = getDb();
    const user = db.users.find(u => u.id === userId);
    if (user && db.userData[user.email]) {
        return db.userData[user.email];
    }
    return { favorites: [], shoppingLists: [], cocktails: [] };
};

export const saveUserData = (userId: string, userData: UserData) => {
    // FIX: Use aliased import to avoid name conflict.
    const db = getDb();
    const user = db.users.find(u => u.id === userId);
    if (!user) return;
    updateDatabase(draftDb => {
        draftDb.userData[user.email] = userData;
    });
};

export const deleteRecipe = (recipeId: number): void => {
    updateDatabase(db => {
        db.recipes.all = db.recipes.all.filter(r => r.id !== recipeId);
        db.recipes.new = db.recipes.new.filter(r => r.id !== recipeId);
        db.recipes.scheduled = db.recipes.scheduled.filter(r => r.id !== recipeId);
    });
};

export const saveProducts = (products: Product[]): void => {
    updateDatabase(db => {
        db.products = products;
    });
};

export const deleteProduct = (productId: string): void => {
    updateDatabase(db => {
        db.products = db.products.filter(p => p.id !== productId);
    });
};

export const saveAllRecipes = (recipes: Recipe[]): void => {
    updateDatabase(db => {
        db.recipes.all = recipes;
    });
}

export const saveNewRecipes = (recipes: Recipe[]): void => {
     updateDatabase(db => {
        db.recipes.new = recipes;
    });
};

export const saveScheduledRecipes = (recipes: Recipe[]): void => {
     updateDatabase(db => {
        db.recipes.scheduled = recipes;
    });
};

// Deprecated compatibility function
export const getDatabase = (): AppDatabase => {
    // FIX: Call aliased import to avoid infinite recursion and name conflict.
    return getDb();
};