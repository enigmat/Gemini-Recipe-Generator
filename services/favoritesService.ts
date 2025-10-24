const FAVORITES_STORAGE_KEY = 'recipeextractedFavorites';

export const getSavedRecipeTitles = (): string[] => {
    try {
        const savedTitlesJson = localStorage.getItem(FAVORITES_STORAGE_KEY);
        return savedTitlesJson ? JSON.parse(savedTitlesJson) : [];
    } catch (error) {
        console.error("Error parsing saved recipes from localStorage", error);
        return [];
    }
};

const setSavedRecipeTitles = (titles: string[]): void => {
    try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(titles));
    } catch (error) {
        console.error("Error saving recipes to localStorage", error);
    }
};

export const saveRecipe = (recipeTitle: string): void => {
    const currentTitles = getSavedRecipeTitles();
    if (!currentTitles.includes(recipeTitle)) {
        const newTitles = [...currentTitles, recipeTitle];
        setSavedRecipeTitles(newTitles);
    }
};

export const unsaveRecipe = (recipeTitle: string): void => {
    const currentTitles = getSavedRecipeTitles();
    const newTitles = currentTitles.filter(title => title !== recipeTitle);
    setSavedRecipeTitles(newTitles);
};