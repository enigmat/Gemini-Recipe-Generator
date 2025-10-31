import { Lead } from '../types';
import { getDatabase, saveDatabase } from './cloudService';

export const getLeads = (): Lead[] => {
    const db = getDatabase();
    return db.newsletters.leads;
};

export const addLead = (email: string): void => {
    const db = getDatabase();
    const leads = db.newsletters.leads;
    if (!leads.some(lead => lead.email === email)) {
        const newLead: Lead = {
            email,
            dateCollected: new Date().toISOString(),
        };
        db.newsletters.leads = [newLead, ...leads];
        saveDatabase(db);
    }
};
