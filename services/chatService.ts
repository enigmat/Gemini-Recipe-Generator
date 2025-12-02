import { ChatMessage } from '../types';
import { getSupabaseClient } from './supabaseClient';

const mapMessageFromDb = (dbMsg: any): ChatMessage => {
    const { user_id, user_name, user_profile_image, is_admin, ...rest } = dbMsg;
    return { ...rest, userId: user_id, userName: user_name, userProfileImage: user_profile_image, isAdmin: is_admin };
}

const mapMessageToDb = (msg: Omit<ChatMessage, 'id'>) => {
    const { userId, userName, userProfileImage, isAdmin, ...rest } = msg;
    return { ...rest, user_id: userId, user_name: userName, user_profile_image: userProfileImage, is_admin: isAdmin };
}

export const getChatMessages = async (): Promise<ChatMessage[]> => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('community_chat')
        .select('*')
        .order('timestamp', { ascending: true });
        
    if (error) throw error;
    return data.map(mapMessageFromDb);
};

export const addChatMessage = async (messageData: Omit<ChatMessage, 'id'>): Promise<ChatMessage> => {
    const supabase = getSupabaseClient();
    const newMessage = {
        id: `${Date.now()}-${Math.random()}`,
        ...mapMessageToDb(messageData)
    };
    const { error } = await supabase.from('community_chat').insert(newMessage);
    if (error) throw error;

    const { user_id, user_name, user_profile_image, is_admin, ...rest } = newMessage;
    return { ...rest, userId: user_id, userName: user_name, userProfileImage: user_profile_image, isAdmin: is_admin };
};

export const onNewMessage = (callback: (newMessage: ChatMessage) => void) => {
    const supabase = getSupabaseClient();
    const subscription = supabase.channel('public:community_chat')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_chat' }, (payload) => {
            callback(mapMessageFromDb(payload.new));
        })
        .subscribe();

    return subscription;
};