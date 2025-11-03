import { AppDatabase } from '../types';
import { getDatabase, saveAllRecipes, saveNewRecipes, saveScheduledRecipes, saveProducts, saveRatings, saveAboutUsContent, saveUserData } from './cloudService';
import * as imageStore from './imageStore';
import { getSupabaseClient } from './supabaseClient';

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
    // FIX: await promise
    const db = await getDatabase();
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

    // User profile images are already base64, so no need to process them.

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
    const supabase = getSupabaseClient();
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
    // The keys for userData in the JSON are emails, but we need to save by user ID.
    // This is a complex mapping problem. For now, we assume user data is not imported or requires manual mapping.
    // The most robust way is to just save the global data.
    console.warn("Importing user-specific data is not supported in this version of sync.");


    // Save the processed database using granular savers and direct supabase calls
    await saveAllRecipes(importedDb.recipes.all || []);
    await saveNewRecipes(importedDb.recipes.new || []);
    await saveScheduledRecipes(importedDb.recipes.scheduled || []);
    await saveProducts(importedDb.products || []);
    await saveRatings(importedDb.ratings || {});
    await saveAboutUsContent(importedDb.aboutUs);

    // Save parts not covered by cloudService directly via supabase
    if (importedDb.standardCocktails) {
        const { error } = await supabase.from('standard_cocktails').upsert(importedDb.standardCocktails);
        if (error) console.error("Import: standard_cocktails", error);
    }
    if (importedDb.newsletters?.sent) {
        const { error } = await supabase.from('sent_newsletters').upsert(importedDb.newsletters.sent);
        if (error) console.error("Import: sent_newsletters", error);
    }
     if (importedDb.newsletters?.leads) {
        const { error } = await supabase.from('leads').upsert(importedDb.newsletters.leads);
        if (error) console.error("Import: leads", error);
    }
    if (importedDb.communityChat) {
        await supabase.from('community_chat').delete().neq('id', 'placeholder-to-delete-all');
        const { error } = await supabase.from('community_chat').insert(importedDb.communityChat);
        if (error) console.error("Import: community_chat", error);
    }
     if (importedDb.users) {
        const { error } = await supabase.from('user_profiles').upsert(importedDb.users);
        if (error) console.error("Import: user_profiles", error);
    }
};
