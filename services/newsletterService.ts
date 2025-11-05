import { Newsletter, User } from '../types';
import * as userService from './userService';
import { getDatabase, updateDatabase } from './database';
import { addLead } from './leadService';

export const subscribeByEmail = (email: string): void => {
    const db = getDatabase();
    const user = db.users.find(u => u.email === email);

    if (user) {
        if (!user.isSubscribed) {
            userService.updateUser({ ...user, isSubscribed: true });
        }
    } else {
        addLead(email);
    }
};

export const getSentNewsletters = (): Newsletter[] => {
    return getDatabase().newsletters.sent;
};

export const sendNewsletter = (newsletterData: Omit<Newsletter, 'id' | 'sentDate'>): Newsletter => {
    const newNewsletter: Newsletter = {
        ...newsletterData,
        id: `nl-${Date.now()}`,
        sentDate: new Date().toISOString(),
    };
    updateDatabase(db => {
        db.newsletters.sent.unshift(newNewsletter);
    });
    return newNewsletter;
};