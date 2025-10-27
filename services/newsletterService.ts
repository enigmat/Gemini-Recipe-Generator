import { Newsletter, User } from '../types';
import * as userService from './userService';

const NEWSLETTERS_KEY = 'recipeAppNewsletters';

export const subscribeByEmail = (email: string): void => {
    const allUsers = userService.getAllUsers();
    const existingUser = allUsers.find(u => u.email === email);

    if (existingUser) {
        if (!existingUser.isSubscribed) {
            const updatedUser = { ...existingUser, isSubscribed: true };
            userService.updateUserInList(updatedUser);
        }
    } else {
        const name = email.split('@')[0];
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
        const newUser: User = {
            email,
            name: capitalizedName,
            isSubscribed: true,
            isAdmin: false,
            isPremium: false,
        };
        userService.addUserToList(newUser);
    }
};

export const getSentNewsletters = (): Newsletter[] => {
    try {
        const newslettersJson = localStorage.getItem(NEWSLETTERS_KEY);
        return newslettersJson ? JSON.parse(newslettersJson) : [];
    } catch (error) {
        console.error('Could not get newsletters from localStorage', error);
        return [];
    }
};

export const sendNewsletter = (newsletterData: Omit<Newsletter, 'id' | 'sentDate'>): Newsletter => {
    const newNewsletter: Newsletter = {
        ...newsletterData,
        id: Date.now().toString(),
        sentDate: new Date().toISOString(),
    };
    
    const allNewsletters = getSentNewsletters();
    const updatedNewsletters = [newNewsletter, ...allNewsletters];
    
    try {
        localStorage.setItem(NEWSLETTERS_KEY, JSON.stringify(updatedNewsletters));
    } catch (error) {
        console.error('Could not save newsletter to localStorage', error);
    }
    
    return newNewsletter;
};