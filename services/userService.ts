import { User } from '../types';
import { getDatabase, saveDatabase } from './cloudService';

const USER_KEY = 'recipeAppCurrentUser';
const ADMIN_EMAIL = 'billhanoman@gmail.com';

const createDefaultUser = (email: string): User => {
    const name = email.split('@')[0];
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    const isAdmin = email.toLowerCase() === ADMIN_EMAIL;
    return {
        email,
        name: capitalizedName,
        profileImage: undefined,
        isPremium: isAdmin, // Admins get premium access
        isAdmin: isAdmin,
        isSubscribed: true, // Subscribe new users by default
    };
};

// --- All Users Management (for Admin) ---

export const getAllUsers = (): User[] => {
    const db = getDatabase();
    return db.users;
};

export const saveAllUsers = (users: User[]): void => {
    const db = getDatabase();
    db.users = users;
    saveDatabase(db);
};

export const addUserToList = (newUser: User): void => {
    const users = getAllUsers();
    if (!users.find(u => u.email === newUser.email)) {
        saveAllUsers([...users, newUser]);
    }
};

export const updateUserInList = (userToUpdate: User): void => {
    const users = getAllUsers();
    const updatedUsers = users.map(u => u.email === userToUpdate.email ? userToUpdate : u);
    saveAllUsers(updatedUsers);
};

export const deleteUser = (userEmail: string): void => {
    const users = getAllUsers();
    const updatedUsers = users.filter(u => u.email !== userEmail);
    saveAllUsers(updatedUsers);
}

// --- Current User Session Management ---

export const signup = (email: string, password?: string): User | null => {
    let users = getAllUsers();
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        // In a real app, you might show an error. Here we'll just log them in.
        return login(email, password);
    }

    const newUser = createDefaultUser(email);
    addUserToList(newUser);
    return login(email, password);
};

export const login = (email: string, password?: string): User | null => {
    let user = getAllUsers().find(u => u.email === email);
    if (!user) {
      // If user logs in but isn't in the list (e.g., first time), create them.
      user = createDefaultUser(email);
      addUserToList(user);
    }
    
    try {
        sessionStorage.setItem(USER_KEY, JSON.stringify(user));
        return user;
    } catch (error) {
        console.error('Could not save user to sessionStorage', error);
        return null;
    }
};

export const logout = (): void => {
    try {
        sessionStorage.removeItem(USER_KEY);
    } catch (error) {
        console.error('Could not remove user from sessionStorage', error);
    }
};

export const getCurrentUser = (): User | null => {
    try {
        const userJson = sessionStorage.getItem(USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
        console.error('Could not get user from sessionStorage', error);
        return null;
    }
};

export const updateUser = (user: User): User | null => {
    try {
        sessionStorage.setItem(USER_KEY, JSON.stringify(user));
        updateUserInList(user); // Ensure master list is also updated
        return user;
    } catch (error) {
        console.error('Could not update user in sessionStorage', error);
        return null;
    }
}
