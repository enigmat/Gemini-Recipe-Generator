import { getUserData, saveUserData } from './cloudService';

// FIX: Functions now async and use userId instead of userEmail
export const getFavorites = async (userId: string | null): Promise<number[]> => {
  if (!userId) return [];
  // FIX: await promise
  const userData = await getUserData(userId);
  return userData.favorites;
};

// FIX: Functions now async and use userId instead of userEmail
export const addFavorite = async (recipeId: number, userId: string): Promise<void> => {
  // FIX: await promise
  const userData = await getUserData(userId);
  if (!userData.favorites.includes(recipeId)) {
    const newUserData = { ...userData, favorites: [...userData.favorites, recipeId] };
    await saveUserData(userId, newUserData);
  }
};

// FIX: Functions now async and use userId instead of userEmail
export const removeFavorite = async (recipeId: number, userId: string): Promise<void> => {
  // FIX: await promise
  const userData = await getUserData(userId);
  const newFavorites = userData.favorites.filter((id) => id !== recipeId);
  const newUserData = { ...userData, favorites: newFavorites };
  await saveUserData(userId, newUserData);
};

// FIX: Functions now async and use userId instead of userEmail
export const isFavorite = async (recipeId: number, userId: string | null): Promise<boolean> => {
  if (!userId) return false;
  // FIX: await promise
  const favorites = await getFavorites(userId);
  return favorites.includes(recipeId);
};