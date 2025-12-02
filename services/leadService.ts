import { Lead } from '../types';
import { getSupabaseClient } from './supabaseClient';

export const getLeads = async (): Promise<Lead[]> => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from('leads').select('*');
    if (error) throw error;
    return data.map(({ date_collected, ...rest }) => ({...rest, dateCollected: date_collected}));
};

export const addLead = async (email: string): Promise<void> => {
    const supabase = getSupabaseClient();
    const newLead = {
        email,
        date_collected: new Date().toISOString()
    };
    const { error } = await supabase.from('leads').upsert(newLead, { onConflict: 'email' });
    if (error) throw error;
};