import { Newsletter, User } from '../types';
import * as userService from './userService';
// FIX: saveDatabase removed, getDatabase is async
import { getDatabase } from './cloudService';
// FIX: use supabase client for saving since cloudService is missing a saver
import { getSupabaseClient } from './supabaseClient';


// FIX: This function was heavily flawed. It is now async, uses correct userService functions, and handles user creation safely.
export const subscribeByEmail = async (email: string): Promise<void> => {
    // FIX: await async call
    const allUsers = await userService.getAllUsers();
    // FIX: .find() on array, not promise
    const existingUser = allUsers.find(u => u.email === email);

    if (existingUser) {
        if (!existingUser.isSubscribed) {
            const updatedUser = { ...existingUser, isSubscribed: true };
            // FIX: 'updateUserInList' does not exist, use 'updateUser'
            await userService.updateUser(updatedUser);
        }
    } else {
        // This function should not create a user. The old logic was flawed as it created a user object without an ID.
        // For non-users, leadService.addLead should be used from the UI.
        console.warn(`Attempted to subscribe a non-existent user via newsletterService: ${email}. This should be handled by leadService.`);
    }
};

// FIX: make async
export const getSentNewsletters = async (): Promise<Newsletter[]> => {
    // FIX: await promise
    const db = await getDatabase();
    return db.newsletters.sent;
};

// FIX: make async and use supabase client to save
export const sendNewsletter = async (newsletterData: Omit<Newsletter, 'id' | 'sentDate'>): Promise<Newsletter> => {
    const supabase = getSupabaseClient();
    const newNewsletterForDb = {
        id: Date.now().toString(),
        subject: newsletterData.subject,
        message: newsletterData.message,
        recipe_ids: newsletterData.recipeIds,
        target: newsletterData.target,
        sent_date: new Date().toISOString(),
    };
    
    const { error } = await supabase.from('sent_newsletters').insert(newNewsletterForDb);

    if (error) {
        console.error('Error saving newsletter:', error.message);
        throw new Error('Failed to save newsletter to database');
    }
    
    const newNewsletter: Newsletter = {
        id: newNewsletterForDb.id,
        subject: newNewsletterForDb.subject,
        message: newNewsletterForDb.message,
        recipeIds: newNewsletterForDb.recipe_ids,
        target: newNewsletterForDb.target,
        sentDate: newNewsletterForDb.sent_date,
    };
    return newNewsletter;
};