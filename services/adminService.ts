import { getDatabase, saveDatabase } from './cloudService';

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

    targetUserEmails.forEach(targetEmail => {
        // Don't copy to self
        if (targetEmail === sourceUserEmail) return;

        // Ensure target user data object exists
        if (!db.userData[targetEmail]) {
            db.userData[targetEmail] = { favorites: [], shoppingLists: [], cocktails: [] };
        }
        const targetCocktails = db.userData[targetEmail].cocktails;
        const targetCocktailTitles = new Set(targetCocktails.map(c => c.title.toLowerCase()));

        const cocktailsToAdd = sourceCocktails.filter(sourceCocktail =>
            !targetCocktailTitles.has(sourceCocktail.title.toLowerCase())
        );

        if (cocktailsToAdd.length > 0) {
            db.userData[targetEmail].cocktails.push(...cocktailsToAdd);
            newCocktailsCount += cocktailsToAdd.length;
        }
    });

    saveDatabase(db);

    return { successCount: targetUserEmails.filter(e => e !== sourceUserEmail).length, newCocktails: newCocktailsCount };
};
