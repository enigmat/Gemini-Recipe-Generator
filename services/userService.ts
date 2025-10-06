const PREMIUM_STATUS_KEY = 'marshmellowRecipesPremiumStatus';
const USER_KEY = 'marshmellowRecipesUser';

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

export const getCurrentUser = (): string | null => {
    try {
        const userJson = localStorage.getItem(USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
        console.error("Error parsing user from localStorage", error);
        return null;
    }
};

export const loginUser = (email: string): void => {
    try {
        localStorage.setItem(USER_KEY, JSON.stringify(email));
    } catch (error) {
        console.error("Error saving user to localStorage", error);
    }
};

export const logoutUser = (): void => {
    try {
        localStorage.removeItem(USER_KEY);
    } catch (error) {
        console.error("Error removing user from localStorage", error);
    }
};
