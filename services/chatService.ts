import { ChatMessage } from '../types';
import { getDatabase, updateDatabase } from './database';

export const getChatMessages = (): ChatMessage[] => {
    const db = getDatabase();
    if (!db.communityChat) {
        return [];
    }
    return db.communityChat;
};

export const addChatMessage = (messageData: Omit<ChatMessage, 'id'>): ChatMessage => {
    const newMessage: ChatMessage = {
        ...messageData,
        id: `${Date.now()}-${Math.random()}`,
    };
    updateDatabase(db => {
        db.communityChat.push(newMessage);
    });
    return newMessage;
};