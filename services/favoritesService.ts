import { getDatabase, saveDatabase, getUserData } from './cloudService';

export const getFavorites = (userEmail: string | null): number[] => {
  if (!userEmail) return [];
  const userData = getUserData(userEmail);
  return userData.favorites;
};

export const addFavorite = (recipeId: number, userEmail: string): void => {
  const db = getDatabase();
  const favorites = getUserData(userEmail).favorites;
  if (!favorites.includes(recipeId)) {
    db.userData[userEmail].favorites = [...favorites, recipeId];
    saveDatabase(db);
  }
};

export const removeFavorite = (recipeId: number, userEmail: string): void => {
  const db = getDatabase();
  const favorites = getUserData(userEmail).favorites;
  db.userData[userEmail].favorites = favorites.filter((id) => id !== recipeId);
  saveDatabase(db);
};

export const isFavorite = (recipeId: number, userEmail: string | null): boolean => {
  if (!userEmail) return false;
  const favorites = getFavorites(userEmail);
  return favorites.includes(recipeId);
};
