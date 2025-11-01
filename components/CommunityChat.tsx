import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, User } from '../types';
import ChatMessageBubble from './ChatMessageBubble';
import PaperAirplaneIcon from './icons/PaperAirplaneIcon';

interface CommunityChatProps {
  messages: ChatMessage[];
  currentUser: User;
  onSendMessage: (text: string) => void;
}

const CommunityChat: React.FC<CommunityChatProps> = ({ messages, currentUser, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-[75vh] max-w-4xl mx-auto bg-white rounded-lg shadow-lg border">
      <header className="p-4 border-b text-center">
        <h2 className="text-xl font-bold text-slate-800">Community Chat</h2>
        <p className="text-sm text-slate-500">Chat with chefs and fellow home cooks!</p>
      </header>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <ChatMessageBubble
            key={msg.id}
            message={msg}
            isCurrentUser={msg.userId === currentUser.email}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-slate-50">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                }
            }}
            placeholder="Type your message..."
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow resize-none"
            rows={1}
            aria-label="Chat message input"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-3 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors flex items-center justify-center disabled:bg-teal-300 aspect-square"
            aria-label="Send message"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommunityChat;
