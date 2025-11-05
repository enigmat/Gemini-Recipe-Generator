import { ShoppingList } from '../types';
import { getDatabase, updateDatabase } from './database';

export const getLists = (userEmail: string | null): ShoppingList[] => {
    if (!userEmail) return [];
    const db = getDatabase();
    return db.userData[userEmail]?.shoppingLists || [];
};

const saveLists = (lists: ShoppingList[], userEmail: string): void => {
  if (!userEmail) return;
  updateDatabase(db => {
      if (db.userData[userEmail]) {
        db.userData[userEmail].shoppingLists = lists;
      }
  });
};

export const saveList = (userEmail: string, name: string, recipeIds: number[]) => {
    const lists = getLists(userEmail);
    const existingList = lists.find(list => list.name.toLowerCase() === name.toLowerCase());
    if (existingList) {
        existingList.recipeIds = Array.from(new Set([...existingList.recipeIds, ...recipeIds]));
    } else {
        lists.push({ id: Date.now().toString(), name: name, recipeIds: recipeIds });
    }
    saveLists(lists, userEmail);
};

export const deleteList = (userEmail: string, listId: string) => {
    let lists = getLists(userEmail);
    lists = lists.filter(list => list.id !== listId);
    saveLists(lists, userEmail);
};

export const renameList = (userEmail: string, listId: string, newName: string) => {
    const lists = getLists(userEmail);
    const list = lists.find(l => l.id === listId);
    if (list) {
        list.name = newName;
    }
    saveLists(lists, userEmail);
};