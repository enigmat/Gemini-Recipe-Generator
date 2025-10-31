import { ShoppingList } from '../types';
import { getDatabase, saveDatabase, getUserData } from './cloudService';

export const getLists = (userEmail: string | null): ShoppingList[] => {
  // Lists are only available for logged-in users
  if (!userEmail) return [];
  const userData = getUserData(userEmail);
  return userData.shoppingLists;
};

export const saveLists = (lists: ShoppingList[], userEmail: string | null): void => {
  if (!userEmail) return;
  const db = getDatabase();
  // Ensure user data object exists
  getUserData(userEmail); 
  db.userData[userEmail].shoppingLists = lists;
  saveDatabase(db);
};
