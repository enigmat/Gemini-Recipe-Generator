
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL as CONFIG_URL, SUPABASE_ANON_KEY as CONFIG_KEY } from '../config';

// The client instance will be stored here after the first initialization.
let supabaseInstance: SupabaseClient | null = null;

const isValidUrl = (urlString: string) => {
    try { 
        return Boolean(new URL(urlString)); 
    }
    catch(e){ 
        return false; 
    }
}

const getStorageItem = (key: string): string | null => {
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            return localStorage.getItem(key);
        }
    } catch (e) {
        console.warn(`localStorage access denied for key ${key}:`, e);
    }
    return null;
}

const removeStorageItem = (key: string) => {
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem(key);
        }
    } catch (e) {
        console.warn(`localStorage access denied for removal of key ${key}:`, e);
    }
}

export const getEffectiveConfig = () => {
    // PRIORITY 1: Config File
    // We use the hardcoded values from config.ts if they are valid.
    const isConfigValid = CONFIG_URL && 
                          !CONFIG_URL.includes('your-project-url') && 
                          isValidUrl(CONFIG_URL);

    if (isConfigValid) {
        // CLEANUP: If config.ts is valid, clear any potentially bad data in localStorage
        // to ensure we don't get stuck in a loop with old settings.
        removeStorageItem('recipe_app_supabase_url');
        removeStorageItem('recipe_app_supabase_key');

        return {
            url: CONFIG_URL,
            key: CONFIG_KEY
        };
    }

    // PRIORITY 2: LocalStorage (Fallback)
    const storedUrl = getStorageItem('recipe_app_supabase_url');
    const storedKey = getStorageItem('recipe_app_supabase_key');
    
    if (storedUrl && storedKey && storedUrl.trim() !== '' && storedKey.trim() !== '') {
        return {
            url: storedUrl.trim(),
            key: storedKey.trim()
        };
    }

    // Fallback
    return {
        url: '',
        key: ''
    };
};

/**
 * Gets a singleton instance of the Supabase client.
 * The client is initialized on the first call to this function.
 */
export const getSupabaseClient = (): SupabaseClient => {
    if (!supabaseInstance) {
        const { url, key } = getEffectiveConfig();
        
        // Strict validation before attempting to create client
        if (!url) {
             throw new Error("Supabase URL is missing. Please configure it in config.ts");
        }

        if (!isValidUrl(url)) {
            throw new Error(`Invalid Supabase URL format: "${url}".`);
        }
        
        if (!key) {
            throw new Error("Missing Supabase Anon Key. Please check config.ts");
        }

        try {
            supabaseInstance = createClient(url, key);
        } catch (e: any) {
            console.error("Failed to initialize Supabase client:", e);
            throw new Error(`Failed to initialize Supabase client: ${e.message}`);
        }
    }
    return supabaseInstance;
};
