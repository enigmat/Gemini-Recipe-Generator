import { AboutUsInfo } from '../types';

const ABOUT_US_KEY = 'recipeextracterAboutUs';

const getInitialData = (): AboutUsInfo => ({
    companyName: 'Recipe Extracter Inc.',
    missionStatement: 'To inspire home cooks everywhere with delicious, easy-to-follow recipes and powerful tools to make cooking a joy.',
    history: 'Founded in 2023, Recipe Extracter started as a small blog and has grown into a vibrant community of food lovers. We believe that everyone can cook, and we\'re here to help!',
    contactEmail: 'contact@recipeextracter.com',
    address: '123 Culinary Lane, Foodie City, 90210',
});

const initializeData = (): void => {
    try {
        const storedData = localStorage.getItem(ABOUT_US_KEY);
        if (!storedData) {
            localStorage.setItem(ABOUT_US_KEY, JSON.stringify(getInitialData()));
        }
    } catch (error) {
        console.error("Error initializing About Us data", error);
    }
};

initializeData();

export const getAboutUsInfo = (): AboutUsInfo => {
    try {
        const dataJson = localStorage.getItem(ABOUT_US_KEY);
        return dataJson ? JSON.parse(dataJson) : getInitialData();
    } catch (error) {
        console.error("Error getting About Us info from localStorage", error);
        return getInitialData();
    }
};

export const saveAboutUsInfo = (info: AboutUsInfo): void => {
    try {
        localStorage.setItem(ABOUT_US_KEY, JSON.stringify(info));
    } catch (error) {
        console.error("Error saving About Us info to localStorage", error);
    }
};