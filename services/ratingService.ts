import { Recipe, RatingsStore } from '../types';
import { getDatabase, updateDatabase } from './database';

const getRatings = (): RatingsStore => {
    return getDatabase().ratings;
};

const saveRatings = (ratings: RatingsStore): void => {
    updateDatabase(db => {
        db.ratings = ratings;
    });
};

export const addRating = (recipeId: number, score: number, userEmail: string): void => {
    const ratings = getRatings();
    if (!ratings[recipeId]) {
        ratings[recipeId] = { totalScore: 0, count: 0, userRatings: {} };
    }

    const recipeRating = ratings[recipeId];
    const previousScore = recipeRating.userRatings[userEmail];

    if (previousScore !== undefined) {
        recipeRating.totalScore = recipeRating.totalScore - previousScore + score;
    } else {
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