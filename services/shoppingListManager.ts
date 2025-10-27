import { ShoppingList } from '../types';

const getListsKey = (userEmail: string) => `recipeAppShoppingLists_${userEmail}`;

export const getLists = (userEmail: string | null): ShoppingList[] => {
  // Lists are only available for logged-in users
  if (!userEmail) return [];
  try {
    const listsKey = getListsKey(userEmail);
    const listsJson = localStorage.getItem(listsKey);
    return listsJson ? JSON.parse(listsJson) : [];
  } catch (error) {
    console.error('Could not get shopping lists from localStorage', error);
    return [];
  }
};

export const saveLists = (lists: ShoppingList[], userEmail: string | null): void => {
  if (!userEmail) return;
  try {
    localStorage.setItem(getListsKey(userEmail), JSON.stringify(lists));
  } catch (error) {
    console.error('Could not save shopping lists to localStorage', error);
  }
};
