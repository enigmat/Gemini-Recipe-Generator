import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AppDatabase } from '../types';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config';

// The client instance will be stored here after the first initialization.
let supabaseInstance: SupabaseClient<AppDatabase> | null = null;

/**
 * Gets a singleton instance of the Supabase client.
 * The client is initialized on the first call to this function.
 * This lazy initialization prevents the app from crashing if credentials
 * are not yet configured in config.ts.
 */
export const getSupabaseClient = (): SupabaseClient<AppDatabase> => {
    if (!supabaseInstance) {
        // This will now only be called when a service function is executed,
        // by which point the App.tsx guard will have ensured the config is valid.
        supabaseInstance = createClient<AppDatabase>(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return supabaseInstance;
};
