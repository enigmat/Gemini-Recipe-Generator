const PREMIUM_STATUS_KEY = 'simpleRecipesPremiumStatus';

export const getPremiumStatus = (): boolean => {
    try {
        const statusJson = localStorage.getItem(PREMIUM_STATUS_KEY);
        return statusJson ? JSON.parse(statusJson) : false;
    } catch (error) {
        console.error("Error parsing premium status from localStorage", error);
        return false;
    }
};

export const setPremiumStatus = (isPremium: boolean): void => {
    try {
        localStorage.setItem(PREMIUM_STATUS_KEY, JSON.stringify(isPremium));
    } catch (error) {
        console.error("Error saving premium status to localStorage", error);
    }
};
