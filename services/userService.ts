import { User } from '../types';

const PREMIUM_STATUS_KEY = 'marshmellowRecipesPremiumStatus';
const USER_KEY = 'marshmellowRecipesUser';
const ALL_USERS_KEY = 'marshmellowRecipesAllUsers';

// --- Mock User Database ---
const getInitialUsers = (): User[] => {
    return [
        { email: 'billhanoman@gmail.com', isAdmin: true },
        { email: 'user1@example.com', isAdmin: false },
        { email: 'user2@example.com', isAdmin: false },
        { email: 'premium_user@example.com', isAdmin: false },
    ];
};

const initializeUsers = (): void => {
    try {
        const storedUsers = localStorage.getItem(ALL_USERS_KEY);
        if (!storedUsers) {
            localStorage.setItem(ALL_USERS_KEY, JSON.stringify(getInitialUsers()));
            // Grant premium to one of the mock users
            grantPremium('premium_user@example.com');
        }
    } catch (error) {
        console.error("Error initializing mock user database", error);
    }
};

// Initialize on load
initializeUsers();


export const getAllUsers = (): User[] => {
    try {
        const usersJson = localStorage.getItem(ALL_USERS_KEY);
        return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
        console.error("Error getting all users from localStorage", error);
        return [];
    }
};

const saveAllUsers = (users: User[]): void => {
    try {
        localStorage.setItem(ALL_USERS_KEY, JSON.stringify(users));
    } catch (error) {
        console.error("Error saving all users to localStorage", error);
    }
};

export const deleteUser = (email: string): void => {
    let users = getAllUsers();
    users = users.filter(user => user.email !== email);
    saveAllUsers(users);
};

export const grantPremium = (email: string): void => {
    const users = getAllUsers();
    const userIndex = users.findIndex(user => user.email === email);
    if (userIndex !== -1) {
        const key = `${PREMIUM_STATUS_KEY}_${email}`;
        try {
            localStorage.setItem(key, JSON.stringify(true));
        } catch (error) {
            console.error("Error granting premium status", error);
        }
    }
};

// --- Single User Session Management ---

export const getPremiumStatus = (): boolean => {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;
    
    // Admins are always premium
    if (currentUser.isAdmin) return true;
    
    try {
        const key = `${PREMIUM_STATUS_KEY}_${currentUser.email}`;
        const statusJson = localStorage.getItem(key);
        return statusJson ? JSON.parse(statusJson) : false;
    } catch (error) {
        console.error("Error parsing premium status from localStorage", error);
        return false;
    }
};

export const setPremiumStatus = (isPremium: boolean): void => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    try {
        const key = `${PREMIUM_STATUS_KEY}_${currentUser.email}`;
        localStorage.setItem(key, JSON.stringify(isPremium));
    } catch (error) {
        console.error("Error saving premium status to localStorage", error);
    }
};

export const getCurrentUser = (): User | null => {
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
        const allUsers = getAllUsers();
        const foundUser = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        const user: User = foundUser || { email, isAdmin: false };
        
        localStorage.setItem(USER_KEY, JSON.stringify(user));
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