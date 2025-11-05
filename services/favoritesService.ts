import { getUserData, saveUserData } from './cloudService';

export const getFavorites = async (userId: string | null): Promise<number[]> => {
  if (!userId) return [];
  const userData = await getUserData(userId);
  return userData.favorites || [];
};

export const addFavorite = async (recipeId: number, userId: string): Promise<void> => {
  const userData = await getUserData(userId);
  if (!userData.favorites.includes(recipeId)) {
    const newUserData = { ...userData, favorites: [...userData.favorites, recipeId] };
    await saveUserData(userId, newUserData);
  }
};

export const removeFavorite = async (recipeId: number, userId: string): Promise<void> => {
  const userData = await getUserData(userId);
  const newFavorites = userData.favorites.filter((id) => id !== recipeId);
  const newUserData = { ...userData, favorites: newFavorites };
  await saveUserData(userId, newUserData);
};

export const isFavorite = async (recipeId: number, userId: string | null): Promise<boolean> => {
  if (!userId) return false;
  const favorites = await getFavorites(userId);
  return favorites.includes(recipeId);
};
