import { AboutUsContent } from '../types';
import { getSupabaseClient } from './supabaseClient';

export const getAboutUsContent = async (): Promise<AboutUsContent> => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from('about_us').select('*').single();
    if (error) throw error;
    const { company_name, mission_statement, company_history, contact_email, ...rest } = data;
    return { ...rest, companyName: company_name, missionStatement: mission_statement, companyHistory: company_history, contactEmail: contact_email };
};

export const saveAboutUsContent = async (content: AboutUsContent): Promise<void> => {
    const supabase = getSupabaseClient();
    const { companyName, missionStatement, companyHistory, contactEmail, ...rest } = content;
    const dbContent = { ...rest, id: 1, company_name: companyName, mission_statement: missionStatement, company_history: companyHistory, contact_email: contactEmail };
    
    const { error } = await supabase.from('about_us').upsert(dbContent, { onConflict: 'id' });
    if (error) throw error;
};