import { ShoppingList } from '../types';
import { getSupabaseClient } from './supabaseClient';
import { getUserData } from './userService';

const saveUserShoppingLists = async (userId: string, lists: ShoppingList[]) => {
    const supabase = getSupabaseClient();
    const currentData = await getUserData(userId);
    currentData.shoppingLists = lists;

    const { error } = await supabase
        .from('user_data')
        .upsert({ user_id: userId, data: currentData }, { onConflict: 'user_id' });
    if (error) throw error;
}

export const getLists = async (userId: string): Promise<ShoppingList[]> => {
    const data = await getUserData(userId);
    return data.shoppingLists || [];
};

export const saveList = async (userId: string, name: string, recipeIds: number[]) => {
    const lists = await getLists(userId);
    const existingList = lists.find(list => list.name.toLowerCase() === name.toLowerCase());
    if (existingList) {
        existingList.recipeIds = Array.from(new Set([...existingList.recipeIds, ...recipeIds]));
    } else {
        lists.push({ id: Date.now().toString(), name: name, recipeIds: recipeIds });
    }
    await saveUserShoppingLists(userId, lists);
};

export const deleteList = async (userId: string, listId: string) => {
    let lists = await getLists(userId);
    lists = lists.filter(list => list.id !== listId);
    await saveUserShoppingLists(userId, lists);
};

export const renameList = async (userId: string, listId: string, newName: string) => {
    const lists = await getLists(userId);
    const list = lists.find(l => l.id === listId);
    if (list) {
        list.name = newName;
    }
    await saveUserShoppingLists(userId, lists);
};