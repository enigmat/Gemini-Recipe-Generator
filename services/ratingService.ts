
const RATINGS_STORAGE_KEY = 'marshmellowRecipesRatings';

interface AllRatings {
    [recipeName: string]: number[];
}

const getAllRatings = (): AllRatings => {
    try {
        const ratingsJson = localStorage.getItem(RATINGS_STORAGE_KEY);
        return ratingsJson ? JSON.parse(ratingsJson) : {};
    } catch (error) {
        console.error("Error parsing ratings from localStorage", error);
        return {};
    }
};

export const getRatingsForRecipe = (recipeName: string): number[] => {
    const allRatings = getAllRatings();
    return allRatings[recipeName] || [];
};

export const saveRatingForRecipe = (recipeName: string, rating: number): void => {
    if (rating < 1 || rating > 5) {
        console.error("Invalid rating value. Must be between 1 and 5.");
        return;
    }
    const allRatings = getAllRatings();
    const recipeRatings = allRatings[recipeName] || [];
    recipeRatings.push(rating);
    allRatings[recipeName] = recipeRatings;

    try {
        localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(allRatings));
    } catch (error) {
        console.error("Error saving ratings to localStorage", error);
    }
};
