import { getSupabaseClient } from './supabaseClient';
import { getUserData } from './userService';
import { UserData } from '../types';

const saveUserData = async (userId: string, data: UserData) => {
    const supabase = getSupabaseClient();
    const { error } = await supabase
        .from('user_data')
        .upsert({ user_id: userId, data: data }, { onConflict: 'user_id' });
    if (error) throw error;
};


export const distributeCocktails = async (sourceUserEmail: string, targetUserEmails: string[]): Promise<{ successCount: number; newCocktails: number }> => {
    if (!sourceUserEmail || !targetUserEmails || targetUserEmails.length === 0) {
        throw new Error("Source user and at least one target user must be selected.");
    }
    
    const supabase = getSupabaseClient();
    const { data: users, error: usersError } = await supabase.from('user_profiles').select('id, email');
    if (usersError) throw new Error("Could not fetch user list.");

    const userMap = new Map(users.map(u => [u.email, u.id]));

    const sourceUserId = userMap.get(sourceUserEmail);

    if (!sourceUserId) {
        throw new Error(`Source user '${sourceUserEmail}' not found.`);
    }

    // Fix: Cast sourceUserId from 'any' to 'string' to satisfy getUserData's parameter type.
    const sourceUserData = await getUserData(sourceUserId as string);
    
    if (!sourceUserData || !sourceUserData.cocktails || sourceUserData.cocktails.length === 0) {
        throw new Error(`Source user '${sourceUserEmail}' has no saved cocktails in 'My Bar'.`);
    }

    const sourceCocktails = sourceUserData.cocktails;
    let newCocktailsCount = 0;
    let successCount = 0;

    for (const targetEmail of targetUserEmails) {
        if (targetEmail === sourceUserEmail) continue;

        const targetUserId = userMap.get(targetEmail);
        if (!targetUserId) continue; // Skip if user not found

        // Fix: Cast targetUserId from 'any' to 'string' to satisfy getUserData's parameter type.
        const targetUserData = await getUserData(targetUserId as string);
        
        const targetCocktailTitles = new Set((targetUserData.cocktails || []).map(c => c.title.toLowerCase()));

        const cocktailsToAdd = sourceCocktails.filter(sourceCocktail =>
            !targetCocktailTitles.has(sourceCocktail.title.toLowerCase())
        );

        if (cocktailsToAdd.length > 0) {
            if (!targetUserData.cocktails) {
                targetUserData.cocktails = [];
            }
            targetUserData.cocktails.push(...cocktailsToAdd);
            // Fix: Cast targetUserId from 'any' to 'string' to satisfy saveUserData's parameter type.
            await saveUserData(targetUserId as string, targetUserData);
            newCocktailsCount += cocktailsToAdd.length;
        }
        successCount++;
    }

    return { successCount, newCocktails: newCocktailsCount };
};
