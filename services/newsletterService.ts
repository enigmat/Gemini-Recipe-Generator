import { Newsletter } from '../types';

const NEWSLETTER_DRAFT_KEY = 'recipeextractedNewsletterDraft';
const SENT_NEWSLETTERS_KEY = 'recipeextractedSentNewsletters';

const formatDate = (date: Date): string => date.toISOString();

// --- Draft Management ---

export const saveNewsletterDraft = (subject: string, body: string): void => {
    try {
        const draft = { subject, body };
        localStorage.setItem(NEWSLETTER_DRAFT_KEY, JSON.stringify(draft));
    } catch (error) {
        console.error("Error saving newsletter draft", error);
    }
};

export const getNewsletterDraft = (): { subject: string; body: string } => {
    try {
        const draftJson = localStorage.getItem(NEWSLETTER_DRAFT_KEY);
        return draftJson ? JSON.parse(draftJson) : { subject: '', body: '' };
    } catch (error) {
        console.error("Error retrieving newsletter draft", error);
        return { subject: '', body: '' };
    }
};

export const clearNewsletterDraft = (): void => {
    try {
        localStorage.removeItem(NEWSLETTER_DRAFT_KEY);
    } catch (error) {
        console.error("Error clearing newsletter draft", error);
    }
};

// --- Sent Newsletter Management ---

export const getSentNewsletters = (): Newsletter[] => {
    try {
        const newslettersJson = localStorage.getItem(SENT_NEWSLETTERS_KEY);
        return newslettersJson ? JSON.parse(newslettersJson) : [];
    } catch (error) {
        console.error("Error getting sent newsletters", error);
        return [];
    }
};

const saveSentNewsletters = (newsletters: Newsletter[]): void => {
    try {
        localStorage.setItem(SENT_NEWSLETTERS_KEY, JSON.stringify(newsletters));
    } catch (error) {
        console.error("Error saving sent newsletters", error);
    }
};

export const sendNewsletter = (subject: string, body: string, recipientCount: number): void => {
    const sentNewsletters = getSentNewsletters();
    
    const newNewsletter: Newsletter = {
        id: new Date().getTime().toString(), // Simple unique ID
        subject,
        body,
        sentDate: formatDate(new Date()),
        recipientCount,
    };

    // Add the new newsletter to the top of the list
    const updatedNewsletters = [newNewsletter, ...sentNewsletters];
    saveSentNewsletters(updatedNewsletters);

    // Clear the draft after sending
    clearNewsletterDraft();
};