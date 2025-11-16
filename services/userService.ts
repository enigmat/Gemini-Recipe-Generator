import { User, UserData } from '../types';
import { getDatabase, updateDatabase } from './database';

let currentUser: User | null = null;
const listeners: ((user: User | null) => void)[] = [];

const notifyListeners = () => {
    listeners.forEach(cb => cb(currentUser));
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
    listeners.push(callback);
    // Immediately call with current user state
    callback(currentUser);
    return () => {
        // Unsubscribe
        const index = listeners.indexOf(callback);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    };
};

export const signup = (email: string, password?: string): void => {
    const db = getDatabase();
    if (db.users.find(u => u.email === email)) {
        throw new Error("A user with this email already exists. Please log in.");
    }
    const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name: email.split('@')[0],
        isPremium: false,
        isAdmin: db.users.length === 0, // Make first user an admin
        isSubscribed: false,
    };
    updateDatabase(draftDb => {
        draftDb.users.push(newUser);
        draftDb.userData[email] = { favorites: [], shoppingLists: [], cocktails: [], calorieEntries: [], calorieSettings: { dailyTarget: 2000 } };
    });
    currentUser = newUser;
    notifyListeners();
};

export const signIn = (email: string, password?: string): void => {
    const db = getDatabase();
    const user = db.users.find(u => u.email === email);
    if (user) {
        // For this mock system, we'll accept any password
        currentUser = user;
        notifyListeners();
    } else {
        throw new Error('User not found.');
    }
};

export const signOut = (): void => {
    currentUser = null;
    notifyListeners();
};

export const getCurrentUser = (): User | null => {
    return currentUser;
};

export const updateUser = (user: User): User | null => {
    let updatedUser: User | null = null;
    updateDatabase(draftDb => {
        const userIndex = draftDb.users.findIndex(u => u.id === user.id);
        if (userIndex > -1) {
            draftDb.users[userIndex] = user;
            updatedUser = user;
        }
    });
    return updatedUser;
};

export const deleteUser = (email: string) => {
    updateDatabase(draftDb => {
        draftDb.users = draftDb.users.filter(u => u.email !== email);
        delete draftDb.userData[email];
    });
};

export const getUserData = (email: string): UserData => {
    const db = getDatabase();
    return db.userData[email] || { favorites: [], shoppingLists: [], cocktails: [], calorieEntries: [], calorieSettings: { dailyTarget: 2000 } };
}

export const toggleFavorite = (email: string, recipeId: number) => {
    updateDatabase(draftDb => {
        const userData = draftDb.userData[email];
        if (userData) {
            const favIndex = userData.favorites.indexOf(recipeId);
            if (favIndex > -1) {
                userData.favorites.splice(favIndex, 1);
            } else {
                userData.favorites.push(recipeId);
            }
        }
    });
};