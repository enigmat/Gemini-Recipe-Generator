import { Recipe, RatingsStore } from '../types';
// FIX: saveDatabase is removed, use granular async savers.
import { getDatabase, saveRatings as saveRatingsToCloud } from './cloudService';

export const loadRatings = (): void => {
    // This function is now obsolete as getDatabase handles loading.
    // Kept for compatibility in case it's called somewhere, but does nothing.
};

// FIX: make async to await getDatabase()
const getRatings = async (): Promise<RatingsStore> => {
    // FIX: await promise
    const db = await getDatabase();
    return db.ratings;
};

// FIX: make async and use specific saver from cloudService
const saveRatings = async (ratings: RatingsStore): Promise<void> => {
    await saveRatingsToCloud(ratings);
};

// FIX: make async
export const addRating = async (recipeId: number, score: number, userEmail: string): Promise<void> => {
    // FIX: await promise
    const ratings = await getRatings();
    if (!ratings[recipeId]) {
        ratings[recipeId] = { totalScore: 0, count: 0, userRatings: {} };
    }

    const recipeRating = ratings[recipeId];
    const previousScore = recipeRating.userRatings[userEmail];

    if (previousScore !== undefined) {
        // User is changing their rating
        recipeRating.totalScore = recipeRating.totalScore - previousScore + score;
    } else {
        // New rating from this user
        recipeRating.totalScore += score;
        recipeRating.count += 1;
    }
    
    recipeRating.userRatings[userEmail] = score;
    // FIX: await promise
    await saveRatings(ratings);
};

// FIX: make async
export const getRating = async (recipeId: number): Promise<Recipe['rating'] | undefined> => {
    // FIX: await promise
    const ratings = await getRatings();
    const ratingData = ratings[recipeId];
    if (!ratingData || ratingData.count === 0) {
        return undefined;
    }
    return {
        score: ratingData.totalScore / ratingData.count,
        count: ratingData.count,
    };
};