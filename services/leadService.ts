import { Lead } from '../types';
// FIX: saveDatabase is removed. Use supabase client directly for saving.
import { getDatabase } from './cloudService';
import { getSupabaseClient } from './supabaseClient';

// FIX: make async
export const getLeads = async (): Promise<Lead[]> => {
    // FIX: await promise
    const db = await getDatabase();
    return db.newsletters.leads;
};

// FIX: make async and save directly to supabase
export const addLead = async (email: string): Promise<void> => {
    const supabase = getSupabaseClient();
    const { data: existingLeads, error: fetchError } = await supabase.from('leads').select('email').eq('email', email);

    if (fetchError) {
        console.error('Error checking for existing lead:', fetchError.message);
        return;
    }

    if (!existingLeads || existingLeads.length === 0) {
        const newLead = {
            email,
            date_collected: new Date().toISOString(),
        };
        const { error: insertError } = await supabase.from('leads').insert(newLead);
        if (insertError) {
            console.error('Error inserting new lead:', insertError.message);
        }
    }
};