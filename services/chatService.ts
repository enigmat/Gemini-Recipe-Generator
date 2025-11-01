import { ChatMessage } from '../types';
import { getDatabase, saveDatabase } from './cloudService';

export const getChatMessages = (): ChatMessage[] => {
    const db = getDatabase();
    if (!db.communityChat) {
        db.communityChat = [];
    }
    return db.communityChat;
};

export const addChatMessage = (messageData: Omit<ChatMessage, 'id'>): ChatMessage => {
    const db = getDatabase();
    const newMessage: ChatMessage = {
        ...messageData,
        id: `${Date.now()}-${Math.random()}`,
    };
    
    if (!db.communityChat) {
        db.communityChat = [];
    }
    
    db.communityChat.push(newMessage);
    saveDatabase(db);
    
    return newMessage;
};
