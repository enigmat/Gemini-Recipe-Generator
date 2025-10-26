import { MarketplaceSearchQuery } from '../types';

const SEARCH_HISTORY_KEY = 'recipeextracterMarketplaceSearchHistory';

export const getSearchHistory = (): MarketplaceSearchQuery[] => {
    try {
        const historyJson = localStorage.getItem(SEARCH_HISTORY_KEY);
        return historyJson ? JSON.parse(historyJson) : [];
    } catch (error) {
        console.error("Error parsing marketplace search history from localStorage", error);
        return [];
    }
};

export const logSearchQuery = (query: string): void => {
    if (!query.trim()) return;

    const history = getSearchHistory();
    const newEntry: MarketplaceSearchQuery = {
        query,
        timestamp: new Date().toISOString(),
    };

    // Add to the beginning of the array
    const updatedHistory = [newEntry, ...history];

    // Optional: Limit history size to prevent localStorage from getting too large
    if (updatedHistory.length > 500) {
        updatedHistory.pop();
    }

    try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
        console.error("Error saving marketplace search history to localStorage", error);
    }
};

export const clearSearchHistory = (): void => {
    try {
        localStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (error) {
        console.error("Error clearing marketplace search history", error);
    }
};
