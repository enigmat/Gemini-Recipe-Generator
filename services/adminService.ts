import { getUserData, saveUserData } from './cloudService';

// FIX: make async and use userId instead of email
export const distributeCocktails = async (sourceUserId: string, targetUserIds: string[]): Promise<{ successCount: number; newCocktails: number }> => {
    if (!sourceUserId || !targetUserIds || targetUserIds.length === 0) {
        throw new Error("Source user and at least one target user must be selected.");
    }
    
    // FIX: await promise
    const sourceUserData = await getUserData(sourceUserId);
    if (!sourceUserData || !sourceUserData.cocktails || sourceUserData.cocktails.length === 0) {
        throw new Error(`Source user with ID '${sourceUserId}' has no saved cocktails in 'My Bar'.`);
    }

    const sourceCocktails = sourceUserData.cocktails;
    let newCocktailsCount = 0;
    let successCount = 0;

    for (const targetId of targetUserIds) {
        // Don't copy to self
        if (targetId === sourceUserId) continue;

        // FIX: await promise
        const targetUserData = await getUserData(targetId);
        const targetCocktailTitles = new Set(targetUserData.cocktails.map(c => c.title.toLowerCase()));

        const cocktailsToAdd = sourceCocktails.filter(sourceCocktail =>
            !targetCocktailTitles.has(sourceCocktail.title.toLowerCase())
        );

        if (cocktailsToAdd.length > 0) {
            targetUserData.cocktails.push(...cocktailsToAdd);
            // FIX: await save
            await saveUserData(targetId, targetUserData);
            newCocktailsCount += cocktailsToAdd.length;
        }
        successCount++;
    }

    return { successCount, newCocktails: newCocktailsCount };
};