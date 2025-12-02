
import { UserData } from '../types';
import { getSupabaseClient } from './supabaseClient';
import { getUserData } from './userService';

const saveUserData = async (userId: string, data: UserData) => {
    const supabase = getSupabaseClient();
    const { error } = await supabase
        .from('user_data')
        .upsert({ user_id: userId, data: data }, { onConflict: 'user_id' });
    if (error) throw error;
};

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

export const toggleFavorite = async (userId: string, recipeId: number): Promise<void> => {
    const userData = await getUserData(userId);
    const favIndex = userData.favorites.indexOf(recipeId);
    let newFavorites;
    
    if (favIndex > -1) {
        newFavorites = userData.favorites.filter(id => id !== recipeId);
    } else {
        newFavorites = [...userData.favorites, recipeId];
    }
    
    const newUserData = { ...userData, favorites: newFavorites };
    await saveUserData(userId, newUserData);
};

export const isFavorite = async (recipeId: number, userId: string | null): Promise<boolean> => {
  if (!userId) return false;
  const favorites = await getFavorites(userId);
  return favorites.includes(recipeId);
};
