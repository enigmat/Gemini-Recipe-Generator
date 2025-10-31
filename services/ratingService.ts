import { Recipe, RatingsStore } from '../types';
import { getDatabase, saveDatabase } from './cloudService';

export const loadRatings = (): void => {
    // This function is now obsolete as getDatabase handles loading.
    // Kept for compatibility in case it's called somewhere, but does nothing.
};

const getRatings = (): RatingsStore => {
    const db = getDatabase();
    return db.ratings;
};

const saveRatings = (ratings: RatingsStore): void => {
    const db = getDatabase();
    db.ratings = ratings;
    saveDatabase(db);
};

export const addRating = (recipeId: number, score: number, userEmail: string): void => {
    const ratings = getRatings();
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
    saveRatings(ratings);
};

export const getRating = (recipeId: number): Recipe['rating'] | undefined => {
    const ratings = getRatings();
    const ratingData = ratings[recipeId];
    if (!ratingData || ratingData.count === 0) {
        return undefined;
    }
    return {
        score: ratingData.totalScore / ratingData.count,
        count: ratingData.count,
    };
};
