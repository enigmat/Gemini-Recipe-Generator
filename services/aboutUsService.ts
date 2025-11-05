import { AboutUsContent } from '../types';
import { getDatabase, updateDatabase } from './database';

export const getAboutUsContent = (): AboutUsContent => {
    return getDatabase().aboutUs;
};

export const saveAboutUsContent = (content: AboutUsContent): void => {
    updateDatabase(db => {
        db.aboutUs = content;
    });
};