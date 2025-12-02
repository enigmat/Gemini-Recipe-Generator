
import { User, UserData } from '../types';
import { getSupabaseClient } from './supabaseClient';
import { PostgrestError } from '@supabase/supabase-js';

export const onAuthStateChange = (callback: (user: User | null, userData: UserData | null) => void) => {
    try {
        const supabase = getSupabaseClient();
        const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
            try {
                if (!session?.user) {
                    callback(null, null);
                    return;
                }

                // Use RPC to ensure profile exists, especially on first sign-in
                const { data: profile, error: rpcError } = await supabase.rpc('get_or_create_user_profile', { dummy_param: 'ensure' });

                if (rpcError || !profile) {
                    console.error('Error ensuring user profile exists:', rpcError?.message);
                    callback(null, null);
                    return;
                }

                const { data: userDataRow, error: userDataError } = await supabase
                    .from('user_data')
                    .select('data')
                    .eq('user_id', session.user.id)
                    .single();
                
                if (userDataError && userDataError.code !== 'PGRST116') { // Ignore 'exact one row' error if no data exists yet
                    console.error('Error fetching user data:', userDataError.message);
                }

                const userData = userDataRow?.data as UserData || { favorites: [], shoppingLists: [], cocktails: [] };
                
                callback(profile as User, userData);
            } catch (innerError) {
                console.error("Error in auth state change handler:", innerError);
                callback(null, null);
            }
        });

        // The subscription object returned by Supabase v2 has an `unsubscribe` method directly on it inside `data.subscription`.
        return { authSubscription: data.subscription };
    } catch (error) {
        console.error("Failed to initialize auth listener:", error);
        // Return a dummy subscription to prevent App crash
        return { authSubscription: { unsubscribe: () => {} } as any };
    }
};

export const signup = async (email: string, password?: string): Promise<void> => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
};

export const signIn = async (email: string, password?: string): Promise<void> => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
};

export const signOut = async (): Promise<void> => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

export const getCurrentUser = async (): Promise<{ user: User | null; error: PostgrestError | null }> => {
    const supabase = getSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { user: null, error: null };

    const { data, error } = await supabase.from('user_profiles').select('*').eq('id', session.user.id).single();
    return { user: data, error };
};

export const getAllUsers = async (): Promise<User[]> => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from('user_profiles').select('*');
    if (error) {
        console.error("Error fetching all users:", error);
        return [];
    }
    return data || [];
};

export const updateUser = async (user: User): Promise<User | null> => {
    const supabase = getSupabaseClient();
    const { id, ...updateData } = user;
    const { data, error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
    
    if (error) {
        console.error("Error updating user:", error);
        return null;
    }
    return data;
};

export const deleteUser = async (userId: string): Promise<void> => {
    const supabase = getSupabaseClient();
    // This requires admin privileges configured in Supabase.
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) throw new Error(`Failed to delete user: ${error.message}`);
};

export const getUserData = async (userId: string): Promise<UserData> => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('user_data')
        .select('data')
        .eq('user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    
    return data?.data || { favorites: [], shoppingLists: [], cocktails: [], calorieEntries: [], calorieSettings: { dailyTarget: 2000 } };
};

const saveUserData = async (userId: string, data: UserData) => {
    const supabase = getSupabaseClient();
    const { error } = await supabase
        .from('user_data')
        .upsert({ user_id: userId, data }, { onConflict: 'user_id' });
    if (error) throw error;
};

export const toggleFavorite = async (userId: string, recipeId: number) => {
    const data = await getUserData(userId);
    const favIndex = data.favorites.indexOf(recipeId);
    if (favIndex > -1) {
        data.favorites.splice(favIndex, 1);
    } else {
        data.favorites.push(recipeId);
    }
    await saveUserData(userId, data);
};
