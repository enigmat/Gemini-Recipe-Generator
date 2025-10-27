import { Recipe } from '../types';

const RATINGS_KEY = 'recipeAppRatings';

// Structure for storing ratings: { [recipeId: number]: { totalScore: number; count: number; userRatings: { [userEmail: string]: number } } }
type RatingsStore = Record<number, { totalScore: number; count: number; userRatings: Record<string, number> }>;

let ratings: RatingsStore = {};

export const loadRatings = (): void => {
    try {
        const storedRatings = localStorage.getItem(RATINGS_KEY);
        if (storedRatings) {
            ratings = JSON.parse(storedRatings);
        } else {
            ratings = {};
        }
    } catch (error) {
        console.error("Could not load ratings from localStorage", error);
        ratings = {};
    }
};

const saveRatings = (): void => {
    try {
        localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
    } catch (error) {
        console.error("Could not save ratings to localStorage", error);
    }
};

export const addRating = (recipeId: number, score: number, userEmail: string): void => {
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
    saveRatings();
};

export const getRating = (recipeId: number): Recipe['rating'] | undefined => {
    const ratingData = ratings[recipeId];
    if (!ratingData || ratingData.count === 0) {
        return undefined;
    }
    return {
        score: ratingData.totalScore / ratingData.count,
        count: ratingData.count,
    };
};
