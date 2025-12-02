import { Newsletter, User, Lead } from '../types';
import * as userService from './userService';
import { addLead } from './leadService';
import { getSupabaseClient } from './supabaseClient';

export const subscribeByEmail = async (email: string): Promise<void> => {
    const supabase = getSupabaseClient();
    const { data: user, error } = await supabase.from('user_profiles').select('*').eq('email', email).single();

    if (user && !user.is_subscribed) {
        await supabase.from('user_profiles').update({ is_subscribed: true }).eq('id', user.id);
    } else if (!user) {
        await addLead(email);
    }
};

export const getNewslettersAndLeads = async (): Promise<{ sent: Newsletter[], leads: Lead[] }> => {
    const supabase = getSupabaseClient();
    const { data: sent, error: sentError } = await supabase.from('sent_newsletters').select('*');
    if (sentError) throw sentError;

    const { data: leads, error: leadsError } = await supabase.from('leads').select('*');
    if (leadsError) throw leadsError;

    return {
        sent: sent.map(({ sent_date, recipe_ids, ...rest }) => ({ ...rest, sentDate: sent_date, recipeIds: recipe_ids })),
        leads: leads.map(({ date_collected, ...rest }) => ({ ...rest, dateCollected: date_collected }))
    };
};

export const sendNewsletter = async (newsletterData: Omit<Newsletter, 'id' | 'sentDate'>): Promise<Newsletter> => {
    const supabase = getSupabaseClient();
    const newNewsletter = {
        id: `nl-${Date.now()}`,
        subject: newsletterData.subject,
        message: newsletterData.message,
        recipe_ids: newsletterData.recipeIds,
        target: newsletterData.target,
        sent_date: new Date().toISOString(),
    };
    const { error } = await supabase.from('sent_newsletters').insert(newNewsletter);
    if (error) throw error;
    
    const { sent_date, recipe_ids, ...rest } = newNewsletter;
    return { ...rest, sentDate: sent_date, recipeIds: recipe_ids };
};