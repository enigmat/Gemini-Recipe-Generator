import { Lead } from '../types';

const LEADS_KEY = 'recipeAppLeads';

export const getLeads = (): Lead[] => {
    try {
        const leadsJson = localStorage.getItem(LEADS_KEY);
        return leadsJson ? JSON.parse(leadsJson) : [];
    } catch (error) {
        console.error('Could not get leads from localStorage', error);
        return [];
    }
};

export const addLead = (email: string): void => {
    const leads = getLeads();
    if (!leads.some(lead => lead.email === email)) {
        const newLead: Lead = {
            email,
            dateCollected: new Date().toISOString(),
        };
        const newLeads = [newLead, ...leads];
        try {
            localStorage.setItem(LEADS_KEY, JSON.stringify(newLeads));
        } catch (error) {
            console.error('Could not save lead to localStorage', error);
        }
    }
};
