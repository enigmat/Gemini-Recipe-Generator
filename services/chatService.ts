import { ChatMessage } from '../types';
// FIX: saveDatabase removed, getDatabase is async
import { getDatabase } from './cloudService';
// FIX: use supabase client for saving since cloudService is missing a saver
import { getSupabaseClient } from './supabaseClient';


// FIX: make async
export const getChatMessages = async (): Promise<ChatMessage[]> => {
    // FIX: await promise
    const db = await getDatabase();
    if (!db.communityChat) {
        // This case should not happen if DB schema is correct, but for safety
        return [];
    }
    return db.communityChat;
};

// FIX: make async and save to supabase
export const addChatMessage = async (messageData: Omit<ChatMessage, 'id'>): Promise<ChatMessage> => {
    const supabase = getSupabaseClient();
    const newMessageForDb = {
        id: `${Date.now()}-${Math.random()}`,
        user_id: messageData.userId,
        user_name: messageData.userName,
        user_profile_image: messageData.userProfileImage,
        is_admin: messageData.isAdmin,
        text: messageData.text,
        timestamp: messageData.timestamp,
    };
    
    const { error } = await supabase.from('community_chat').insert(newMessageForDb);
    if (error) {
        console.error("Error adding chat message:", error.message);
        throw new Error("Failed to send message.");
    }
    
    const newMessage: ChatMessage = {
        id: newMessageForDb.id,
        userId: newMessageForDb.user_id,
        userName: newMessageForDb.user_name,
        userProfileImage: newMessageForDb.user_profile_image,
        isAdmin: newMessageForDb.is_admin,
        text: newMessageForDb.text,
        timestamp: newMessageForDb.timestamp,
    };
    return newMessage;
};