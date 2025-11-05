import { getDatabase, updateDatabase } from './database';

export const distributeCocktails = (sourceUserEmail: string, targetUserEmails: string[]): { successCount: number; newCocktails: number } => {
    if (!sourceUserEmail || !targetUserEmails || targetUserEmails.length === 0) {
        throw new Error("Source user and at least one target user must be selected.");
    }
    
    const db = getDatabase();
    const sourceUserData = db.userData[sourceUserEmail];
    
    if (!sourceUserData || !sourceUserData.cocktails || sourceUserData.cocktails.length === 0) {
        throw new Error(`Source user '${sourceUserEmail}' has no saved cocktails in 'My Bar'.`);
    }

    const sourceCocktails = sourceUserData.cocktails;
    let newCocktailsCount = 0;
    let successCount = 0;

    updateDatabase(draftDb => {
        for (const targetEmail of targetUserEmails) {
            if (targetEmail === sourceUserEmail) continue;

            const targetUserData = draftDb.userData[targetEmail];
            if (!targetUserData) continue; // Skip if user has no data object

            const targetCocktailTitles = new Set(targetUserData.cocktails.map(c => c.title.toLowerCase()));

            const cocktailsToAdd = sourceCocktails.filter(sourceCocktail =>
                !targetCocktailTitles.has(sourceCocktail.title.toLowerCase())
            );

            if (cocktailsToAdd.length > 0) {
                targetUserData.cocktails.push(...cocktailsToAdd);
                newCocktailsCount += cocktailsToAdd.length;
            }
            successCount++;
        }
    });

    return { successCount, newCocktails: newCocktailsCount };
};