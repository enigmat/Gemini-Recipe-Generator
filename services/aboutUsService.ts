import { AboutUsContent } from '../types';
// FIX: saveDatabase removed, use granular async savers.
import { getDatabase, saveAboutUsContent as saveAboutUsContentToCloud } from './cloudService';

// FIX: make async
export const getAboutUsContent = async (): Promise<AboutUsContent> => {
    // FIX: await promise
    const db = await getDatabase();
    return db.aboutUs;
};

// FIX: make async and use specific saver from cloudService
export const saveAboutUsContent = async (content: AboutUsContent): Promise<void> => {
    await saveAboutUsContentToCloud(content);
};