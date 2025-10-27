import { AboutUsContent } from '../types';
import { aboutUsData as initialData } from '../data/aboutUs';

const ABOUT_US_KEY = 'recipeAppAboutUs';

// Initialize with default data if none exists, this allows admin to change it later
if (!localStorage.getItem(ABOUT_US_KEY)) {
    localStorage.setItem(ABOUT_US_KEY, JSON.stringify(initialData));
}

export const getAboutUsContent = (): AboutUsContent => {
    try {
        const contentJson = localStorage.getItem(ABOUT_US_KEY);
        return contentJson ? JSON.parse(contentJson) : initialData;
    } catch (error) {
        console.error('Could not get About Us content from localStorage', error);
        return initialData;
    }
};

export const saveAboutUsContent = (content: AboutUsContent): void => {
    try {
        localStorage.setItem(ABOUT_US_KEY, JSON.stringify(content));
    } catch (error) {
        console.error('Could not save About Us content to localStorage', error);
    }
};
