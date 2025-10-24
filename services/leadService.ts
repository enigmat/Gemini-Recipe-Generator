import { Lead } from '../types';

const LEADS_STORAGE_KEY = 'recipeextractedLeads';

const formatDate = (date: Date): string => date.toISOString().split('T')[0];

export const getAllLeads = (): Lead[] => {
    try {
        const leadsJson = localStorage.getItem(LEADS_STORAGE_KEY);
        return leadsJson ? JSON.parse(leadsJson) : [];
    } catch (error) {
        console.error("Error parsing leads from localStorage", error);
        return [];
    }
};

export const addLead = (email: string): { success: boolean, message: string } => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return { success: false, message: "Please enter a valid email address." };
    }

    const allLeads = getAllLeads();
    const emailExists = allLeads.some(lead => lead.email.toLowerCase() === email.toLowerCase());

    if (emailExists) {
        return { success: false, message: "This email is already subscribed." };
    }

    const newLead: Lead = {
        email: email,
        collectedDate: formatDate(new Date()),
    };

    const updatedLeads = [...allLeads, newLead];

    try {
        localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updatedLeads));
        return { success: true, message: "Successfully subscribed!" };
    } catch (error) {
        console.error("Error saving lead to localStorage", error);
        return { success: false, message: "Could not save subscription due to a storage error." };
    }
};