import { ShoppingList } from '../types';
// FIX: saveDatabase removed, use granular async savers
import { getUserData, saveUserData } from './cloudService';

// FIX: make async and use userId
export const getLists = async (userId: string | null): Promise<ShoppingList[]> => {
  // Lists are only available for logged-in users
  if (!userId) return [];
  // FIX: await promise
  const userData = await getUserData(userId);
  return userData.shoppingLists;
};

// FIX: make async and use userId
export const saveLists = async (lists: ShoppingList[], userId: string | null): Promise<void> => {
  if (!userId) return;
  // getUserData will create a default object if one doesn't exist
  const userData = await getUserData(userId);
  userData.shoppingLists = lists;
  await saveUserData(userId, userData);
};