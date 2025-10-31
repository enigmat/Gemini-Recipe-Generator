import { AboutUsContent } from '../types';
import { getDatabase, saveDatabase } from './cloudService';

export const getAboutUsContent = (): AboutUsContent => {
    const db = getDatabase();
    return db.aboutUs;
};

export const saveAboutUsContent = (content: AboutUsContent): void => {
    const db = getDatabase();
    db.aboutUs = content;
    saveDatabase(db);
};
