import { User } from '../types';
import { getSupabaseClient } from './supabaseClient';

const ADMIN_EMAIL = 'billhanoman@gmail.com';

// Helper function to get a user profile, and enforce admin roles.
// It relies on the database trigger to create the profile on signup,
// but now includes a robust server-side RPC fallback to prevent race conditions.
const _getUserProfile = async (authUser: { id: string, email?: string }): Promise<User | null> => {
    if (!authUser.email) return null;
    const supabase = getSupabaseClient();

    let userProfile: User | null = null;
    let attempts = 0;
    const maxAttempts = 3; // Retry 3 times
    const delay = 250; // ms

    // Retry fetching the profile to account for minor replication delay after the trigger fires.
    while (attempts < maxAttempts) {
        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
            throw new Error(`Failed to fetch profile: ${error.message}`);
        }
        
        if (data) {
            userProfile = data as User;
            break; // Profile found, exit loop.
        }

        attempts++;
        if (attempts < maxAttempts) {
            console.warn(`Profile for user ${authUser.id} not found on attempt ${attempts}. Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    // If profile is still not found, call the server-side function as a robust fallback.
    if (!userProfile) {
        console.warn(`User profile not found after client-side retries. Calling RPC fallback to ensure profile exists.`);
        
        // Pass a dummy parameter to match the new function signature. This helps bust the Supabase cache.
        const { data: rpcProfile, error: rpcError } = await supabase
            .rpc('get_or_create_user_profile', { dummy_param: 'force_refresh' });

        if (rpcError) {
            console.error('Failed to create or retrieve user profile via RPC fallback:', rpcError.message);
            // Updated error message to reflect the new function name.
            throw new Error("Could not retrieve or create user profile via RPC. Please check the `get_or_create_user_profile` database function and its permissions.");
        }
        
        if (!rpcProfile) {
             // This is a critical failure, as the function should always return a profile if the user is authenticated.
             throw new Error("RPC fallback executed but returned no profile. This indicates a severe issue with the database function or user authentication state.");
        }

        console.log("Successfully retrieved user profile via RPC fallback.");
        userProfile = rpcProfile as User;
    }
    
    // Admin role enforcement: Ensure admin user always has admin/premium rights
    if (authUser.email.toLowerCase() === ADMIN_EMAIL && (!userProfile.isAdmin || !userProfile.isPremium)) {
        console.log("Admin user detected. Ensuring admin and premium roles are set.");
        const { data: updatedProfile, error: updateError } = await supabase
            .from('user_profiles')
            .update({ is_admin: true, is_premium: true })
            .eq('id', authUser.id)
            .select()
            .single();

        if (updateError) {
            console.error("Failed to update admin roles on sign-in:", updateError.message);
        } else {
            userProfile = updatedProfile as User; // Use the updated profile
        }
    }
    
    return userProfile;
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
    const supabase = getSupabaseClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
            try {
                const user = await _getUserProfile(session.user);
                callback(user);
            } catch (error) {
                console.error("onAuthStateChange error:", error);
                callback(null);
            }
        } else if (event === 'SIGNED_OUT') {
            callback(null);
        }
    });

    return () => {
        subscription.unsubscribe();
    };
};

export const signup = async (email: string, password?: string): Promise<void> => {
    const supabase = getSupabaseClient();
    if (!password) throw new Error("Password is required for sign up.");

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
        if (error.message.includes('User already registered')) {
            throw new Error("A user with this email already exists. Please log in.");
        }
        throw new Error(`Sign up failed: ${error.message}`);
    }
    // Success. The onAuthStateChange listener will handle the rest.
};

export const signIn = async (email: string, password?: string): Promise<void> => {
    const supabase = getSupabaseClient();
    if (!password) throw new Error("Password is required to sign in.");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        throw new Error(`Sign in failed: ${error.message}`);
    }
    // Success. The onAuthStateChange listener will handle the rest.
};

export const signOut = async (): Promise<void> => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Error signing out:", error.message);
    }
};

export const getCurrentUser = async (): Promise<User | null> => {
    const supabase = getSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
        return await _getUserProfile(session.user);
    }
    return null;
};

export const updateUser = async (user: User): Promise<User | null> => {
    const supabase = getSupabaseClient();
    // Convert camelCase from JS User object to snake_case for DB
    const profileData = {
        name: user.name,
        profile_image: user.profileImage,
        is_premium: user.isPremium,
        is_admin: user.isAdmin,
        is_subscribed: user.isSubscribed,
        plan_end_date: user.planEndDate,
        food_preferences: user.foodPreferences
    };
    
    const { data, error } = await supabase
        .from('user_profiles')
        .update(profileData)
        .eq('id', user.id)
        .select()
        .single();
    
    if (error) {
        console.error("Error updating user profile:", error.message);
        return null;
    }
    return data as User;
};

// Admin functions - Note: these require RLS policies on the Supabase side to work correctly.
export const getAllUsers = async (): Promise<User[]> => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from('user_profiles').select('*');
    if (error) {
        console.error("Error getting all users:", error.message);
        return [];
    }
    return data as User[];
};

export const deleteUser = async (userId: string): Promise<void> => {
    const supabase = getSupabaseClient();
    // This would require a server-side function in Supabase to delete an auth user.
    // For now, we'll just delete their profile.
    console.warn("Deleting user from `user_profiles` table, but not from `auth.users`. This requires a Supabase Edge Function for security.");
    const { error } = await supabase.from('user_profiles').delete().eq('id', userId);
    if (error) console.error("Error deleting user profile:", error.message);
};