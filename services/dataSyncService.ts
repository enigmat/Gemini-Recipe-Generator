import { AppDatabase } from '../types';
import { getDatabase, setDatabase } from './database';
import * as imageStore from './imageStore';

// Helper to process a list of items with images
const embedImages = async (items: any[] | undefined, imageKey: string) => {
    if (!items) return;
    for (const item of items) {
        if (item && item[imageKey] && typeof item[imageKey] === 'string' && item[imageKey].startsWith('indexeddb:')) {
            const imageId = item[imageKey].split(':')[1].split('?')[0]; // Handle cache-buster
            const imageData = await imageStore.getImage(imageId);
            if (imageData) {
                item[imageKey] = imageData;
            }
        }
    }
};

export const exportDatabaseWithImages = async (): Promise<AppDatabase> => {
    const db = getDatabase();
    // Create a deep copy to avoid mutating the live database object
    const exportDb: AppDatabase = JSON.parse(JSON.stringify(db));

    // Process recipes
    await embedImages(exportDb.recipes.all, 'image');
    await embedImages(exportDb.recipes.new, 'image');
    await embedImages(exportDb.recipes.scheduled, 'image');
    
    // Process products
    await embedImages(exportDb.products, 'imageUrl');
    
    // Process standard cocktails
    await embedImages(exportDb.standardCocktails, 'image');

    // Process user-specific data (saved cocktails)
    if (exportDb.userData) {
        for (const userEmail in exportDb.userData) {
            const userData = exportDb.userData[userEmail];
            await embedImages(userData.cocktails, 'image');
        }
    }

    return exportDb;
};

// Helper to process a list of items and store their images
const extractAndStoreImages = async (items: any[] | undefined, imageKey: string, idKey: string) => {
    if (!items) return;
    for (const item of items) {
        // Ensure item and keys exist before proceeding
        if (item && item[idKey] && item[imageKey] && typeof item[imageKey] === 'string' && item[imageKey].startsWith('data:image')) {
            const imageId = String(item[idKey]);
            try {
                await imageStore.setImage(imageId, item[imageKey]);
                item[imageKey] = `indexeddb:${imageId}`;
            } catch (error) {
                console.error(`Failed to store image for item ${imageId}:`, error);
                // Continue with other images
            }
        }
    }
};

export const importDatabaseWithImages = async (importedDb: AppDatabase): Promise<void> => {
    // Basic validation
    if (!importedDb.recipes || !importedDb.users) {
        throw new Error("Invalid or corrupted backup file. It's missing essential data sections.");
    }
    
    // Process recipes
    await extractAndStoreImages(importedDb.recipes.all, 'image', 'id');
    await extractAndStoreImages(importedDb.recipes.new, 'image', 'id');
    await extractAndStoreImages(importedDb.recipes.scheduled, 'image', 'id');

    // Process products
    await extractAndStoreImages(importedDb.products, 'imageUrl', 'id');

    // Process standard cocktails
    await extractAndStoreImages(importedDb.standardCocktails, 'image', 'id');

    // Process user-specific data
    if (importedDb.userData) {
        for (const userEmail in importedDb.userData) {
            const userData = importedDb.userData[userEmail];
            await extractAndStoreImages(userData.cocktails, 'image', 'id');
        }
    }

    // Replace the in-memory database
    setDatabase(importedDb);
};