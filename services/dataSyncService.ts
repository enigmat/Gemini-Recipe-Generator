import { AppDatabase, UserData } from '../types';
import * as imageStore from './imageStore';
import { getSupabaseClient } from './supabaseClient';

const getDatabase = async (): Promise<AppDatabase> => {
    const supabase = getSupabaseClient();
    console.log("Exporting: Fetching all data from Supabase...");

    const [
        { data: allRecipes }, { data: newRecipes }, { data: scheduledRecipes },
        { data: products }, { data: sentNewsletters }, { data: leads },
        { data: ratings }, { data: users }, { data: allUserData },
        { data: standardCocktails }, { data: communityChat }, { data: aboutUs },
        { data: mealPlans }, { data: videos }, { data: cookingClasses },
        { data: expertQuestions }
    ] = await Promise.all([
        supabase.from('recipes').select('*'),
        supabase.from('new_recipes').select('*'),
        supabase.from('scheduled_recipes').select('*'),
        supabase.from('products').select('*'),
        supabase.from('sent_newsletters').select('*'),
        supabase.from('leads').select('*'),
        supabase.from('ratings').select('*'),
        supabase.from('user_profiles').select('*'),
        supabase.from('user_data').select('*'),
        supabase.from('standard_cocktails').select('*'),
        supabase.from('community_chat').select('*'),
        supabase.from('about_us').select('*'),
        supabase.from('meal_plans').select('*'),
        supabase.from('videos').select('*'),
        supabase.from('cooking_classes').select('*'),
        supabase.from('expert_questions').select('*'),
    ]);

    const emailMap = new Map((users || []).map(u => [u.id, u.email]));

    const db: AppDatabase = {
        users: (users || []).map((u: any) => ({ ...u, profileImage: u.profile_image, isPremium: u.is_premium, isAdmin: u.is_admin, isSubscribed: u.is_subscribed, planEndDate: u.plan_end_date, foodPreferences: u.food_preferences })),
        recipes: {
            all: (allRecipes || []).map((r: any) => ({ ...r, cookTime: r.cook_time, winePairing: r.wine_pairing })),
            new: (newRecipes || []).map((r: any) => ({ ...r, cookTime: r.cook_time, winePairing: r.wine_pairing })),
            scheduled: (scheduledRecipes || []).map((r: any) => ({ ...r, cookTime: r.cook_time, winePairing: r.wine_pairing })),
        },
        featuredChefs: [], // This is derived data and not stored
        products: (products || []).map((p: any) => ({ ...p, imageUrl: p.image_url, affiliateUrl: p.affiliate_url })),
        newsletters: {
            sent: (sentNewsletters || []).map((n: any) => ({ ...n, sentDate: n.sent_date, recipeIds: n.recipe_ids })),
            leads: (leads || []).map((l: any) => ({ ...l, dateCollected: l.date_collected })),
        },
        ratings: (ratings || []).reduce((acc: any, r: any) => { acc[r.recipe_id] = { totalScore: r.total_score, count: r.count, userRatings: r.user_ratings }; return acc; }, {}),
        userData: (allUserData || []).reduce((acc: Record<string, UserData>, u: any) => {
            const email = emailMap.get(u.user_id);
            // Fix: Cast 'email' from 'any' to 'string' to use it as an index type.
            if (email) { acc[email as string] = u.data; }
            return acc;
        }, {} as Record<string, UserData>),
        standardCocktails: (standardCocktails || []).map((c: any) => ({ ...c, imagePrompt: c.image_prompt })),
        communityChat: (communityChat || []).map((c: any) => ({ ...c, userId: c.user_id, userName: c.user_name, userProfileImage: c.user_profile_image, isAdmin: c.is_admin })),
        aboutUs: (aboutUs && aboutUs.length > 0) ? { ...aboutUs[0], companyName: aboutUs[0].company_name, missionStatement: aboutUs[0].mission_statement, companyHistory: aboutUs[0].company_history, contactEmail: aboutUs[0].contact_email } : {} as any,
        mealPlans: (mealPlans || []).map((p: any) => ({ ...p, recipeIds: p.recipe_ids })),
        videos: (videos || []).map((v: any) => ({ ...v, videoUrl: v.video_url, thumbnailUrl: v.thumbnail_url })),
        cookingClasses: (cookingClasses || []).map((c: any) => ({ ...c, thumbnailUrl: c.thumbnail_url, whatYouWillLearn: c.what_you_will_learn, techniquesCovered: c.techniques_covered, proTips: c.pro_tips })),
        expertQuestions: (expertQuestions || []).map((q: any) => ({ ...q, submittedDate: q.submitted_date })),
    };

    return db;
};

const setDatabase = async (db: AppDatabase) => {
    const supabase = getSupabaseClient();
    console.log("Importing: Wiping and recreating database from backup file...");

    const tables = [
        'recipes', 'new_recipes', 'scheduled_recipes', 'products', 'sent_newsletters', 'leads', 
        'ratings', 'user_data', 'standard_cocktails', 'community_chat', 'about_us', 
        'meal_plans', 'videos', 'cooking_classes', 'expert_questions', 'user_profiles'
    ];
    
    for (const table of tables) {
        const { error } = await supabase.from(table).delete().neq('id', 'a-value-that-will-never-exist');
        if (error) throw new Error(`Failed to clear table ${table}: ${error.message}`);
    }

    console.log("Importing: All tables cleared. Now inserting data...");
    
    // Now insert data. Order matters for foreign keys (user_profiles first).
    const { error: userProfilesError } = await supabase.from('user_profiles').insert(db.users.map(u => ({...u, profile_image: u.profileImage, is_premium: u.isPremium, is_admin: u.isAdmin, is_subscribed: u.isSubscribed, plan_end_date: u.planEndDate, food_preferences: u.foodPreferences})));
    if (userProfilesError) throw new Error(`Failed to insert user_profiles: ${userProfilesError.message}`);
    
    const userMap = new Map(db.users.map(u => [u.email, u.id]));
    const userDataForDb = Object.entries(db.userData).map(([email, data]) => ({ user_id: userMap.get(email), data })).filter(u => u.user_id);
    const { error: userDataError } = await supabase.from('user_data').insert(userDataForDb);
    if (userDataError) throw new Error(`Failed to insert user_data: ${userDataError.message}`);
    
    // The rest of the tables
    const { error: recipesError } = await supabase.from('recipes').insert(db.recipes.all.map(({ cookTime, winePairing, ...rest }) => ({ ...rest, cook_time: cookTime, wine_pairing: winePairing })));
    if (recipesError) throw new Error(`Failed to insert recipes: ${recipesError.message}`);
    
    const { error: newRecipesError } = await supabase.from('new_recipes').insert(db.recipes.new.map(({ cookTime, winePairing, ...rest }) => ({ ...rest, cook_time: cookTime, wine_pairing: winePairing })));
    if (newRecipesError) throw new Error(`Failed to insert new_recipes: ${newRecipesError.message}`);

    const { error: chatError } = await supabase.from('community_chat').insert(db.communityChat.map(({ userId, userName, userProfileImage, isAdmin, ...rest }) => ({...rest, user_id: userId, user_name: userName, user_profile_image: userProfileImage, is_admin: isAdmin })));
    if (chatError) throw new Error(`Failed to insert community_chat: ${chatError.message}`);

    // ... continue for all other tables
    console.log("Importing: Data insertion complete.");
};

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
        // Handle nested chef image
        if (item && item.chef && item.chef.image && typeof item.chef.image === 'string' && item.chef.image.startsWith('indexeddb:')) {
            const chefImageId = item.chef.image.split(':')[1].split('?')[0];
            const chefImageData = await imageStore.getImage(chefImageId);
            if (chefImageData) {
                item.chef.image = chefImageData;
            }
        }
    }
};

export const exportDatabaseWithImages = async (): Promise<AppDatabase> => {
    const db = await getDatabase();
    // Create a deep copy to avoid mutating the live database object
    const exportDb: AppDatabase = JSON.parse(JSON.stringify(db));

    // Process recipes
    await embedImages(exportDb.recipes.all, 'image');
    await embedImages(exportDb.recipes.new, 'image');
    await embedImages(exportDb.recipes.scheduled, 'image');
    await embedImages(exportDb.featuredChefs, 'image');
    
    // Process products
    await embedImages(exportDb.products, 'imageUrl');
    
    // Process standard cocktails
    await embedImages(exportDb.standardCocktails, 'image');

    // Process user-specific data (saved cocktails & profile images)
    if (exportDb.users) {
        await embedImages(exportDb.users, 'profileImage');
    }
    if (exportDb.userData) {
        for (const userEmail in exportDb.userData) {
            const userData = exportDb.userData[userEmail];
            await embedImages(userData.cocktails, 'image');
        }
    }
    // Process chat profile images
    if (exportDb.communityChat) {
        await embedImages(exportDb.communityChat, 'userProfileImage');
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
         // Handle nested chef image
        if (item && item[idKey] && item.chef && item.chef.image && typeof item.chef.image === 'string' && item.chef.image.startsWith('data:image')) {
            const chefImageId = `chef-${String(item[idKey])}`;
            try {
                await imageStore.setImage(chefImageId, item.chef.image);
                item.chef.image = `indexeddb:${chefImageId}`;
            } catch (error) {
                console.error(`Failed to store image for chef of item ${item[idKey]}:`, error);
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
    await extractAndStoreImages(importedDb.featuredChefs, 'image', 'id');

    // Process products
    await extractAndStoreImages(importedDb.products, 'imageUrl', 'id');

    // Process standard cocktails
    await extractAndStoreImages(importedDb.standardCocktails, 'image', 'id');

    // Process user-specific data
    if (importedDb.users) {
        await extractAndStoreImages(importedDb.users, 'profileImage', 'id');
    }
    if (importedDb.userData) {
        for (const userEmail in importedDb.userData) {
            const userData = importedDb.userData[userEmail];
            await extractAndStoreImages(userData.cocktails, 'image', 'id');
        }
    }
    // Process chat images
    if (importedDb.communityChat) {
        await extractAndStoreImages(importedDb.communityChat, 'userProfileImage', 'userId');
    }

    // Replace the database on the backend
    await setDatabase(importedDb);
};