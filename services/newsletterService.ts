import { Newsletter, User } from '../types';
import * as userService from './userService';
import { getDatabase, saveDatabase } from './cloudService';

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
    const db = getDatabase();
    return db.newsletters.sent;
};

export const sendNewsletter = (newsletterData: Omit<Newsletter, 'id' | 'sentDate'>): Newsletter => {
    const newNewsletter: Newsletter = {
        ...newsletterData,
        id: Date.now().toString(),
        sentDate: new Date().toISOString(),
    };
    
    const db = getDatabase();
    db.newsletters.sent = [newNewsletter, ...db.newsletters.sent];
    saveDatabase(db);
    
    return newNewsletter;
};
