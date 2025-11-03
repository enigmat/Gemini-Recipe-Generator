import { Newsletter, User } from '../types';
import * as userService from './userService';
// FIX: saveDatabase removed, getDatabase is async
import { getDatabase } from './cloudService';
// FIX: use supabase client for saving since cloudService is missing a saver
import { getSupabaseClient } from './supabaseClient';
import { addLead } from './leadService';


// FIX: This function was heavily flawed. It is now async, uses correct userService functions, and handles user creation safely.
export const subscribeByEmail = async (email: string): Promise<void> => {
    // FIX: Replaced a call to the non-existent `userService.getAllUsers` with a more performant
    // direct Supabase query to fetch a single user by email.
    const supabase = getSupabaseClient();
    const { data: userFromDb, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', email)
        .single();

    // A 'PGRST116' error code from Supabase means no rows were found, which is a valid case here (a non-user is subscribing).
    if (error && error.code !== 'PGRST116') {
        console.error(`Error checking user for subscription: ${error.message}`);
        return;
    }

    if (userFromDb) {
        if (!userFromDb.is_subscribed) {
            // Map from snake_case (DB) to camelCase (app type) before updating.
            const userForApp: User = {
                id: userFromDb.id,
                email: userFromDb.email,
                name: userFromDb.name,
                profileImage: userFromDb.profile_image,
                isPremium: userFromDb.is_premium,
                isAdmin: userFromDb.is_admin,
                isSubscribed: userFromDb.is_subscribed,
                planEndDate: userFromDb.plan_end_date,
                foodPreferences: userFromDb.food_preferences,
            };
            const updatedUser = { ...userForApp, isSubscribed: true };
            await userService.updateUser(updatedUser);
        }
    } else {
        // If the user does not exist in the profiles table, add them as a lead.
        await addLead(email);
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
