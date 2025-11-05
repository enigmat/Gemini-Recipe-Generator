import { Lead } from '../types';
import { getDatabase, updateDatabase } from './database';

export const getLeads = (): Lead[] => {
    return getDatabase().newsletters.leads;
};

export const addLead = (email: string): void => {
    const db = getDatabase();
    if (!db.newsletters.leads.some(l => l.email === email)) {
        const newLead: Lead = {
            email,
            dateCollected: new Date().toISOString()
        };
        updateDatabase(draftDb => {
            draftDb.newsletters.leads.push(newLead);
        });
    }
};