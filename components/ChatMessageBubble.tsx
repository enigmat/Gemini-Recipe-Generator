import React from 'react';
import { ChatMessage } from '../types';
import UserIcon from './icons/UserIcon';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  isCurrentUser: boolean;
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message, isCurrentUser }) => {
  const alignment = isCurrentUser ? 'justify-end' : 'justify-start';
  const bubbleColor = isCurrentUser
    ? 'bg-teal-500 text-white'
    : message.isAdmin
    ? 'bg-amber-100 text-amber-900'
    : 'bg-slate-200 text-slate-800';
  
  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex items-end gap-2 ${alignment}`}>
      {!isCurrentUser && (
        <div className="w-8 h-8 rounded-full bg-slate-300 flex-shrink-0 overflow-hidden">
          {message.userProfileImage ? (
            <img src={message.userProfileImage} alt={message.userName} className="w-full h-full object-cover" />
          ) : (
            <UserIcon className="w-full h-full p-1 text-slate-500" />
          )}
        </div>
      )}
      <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${bubbleColor}`}>
        {!isCurrentUser && (
          <div className="font-semibold text-sm mb-1 flex items-center gap-2">
            <span>{message.userName}</span>
            {message.isAdmin && (
              <span className="px-2 py-0.5 text-xs font-bold bg-amber-400 text-amber-900 rounded-full">
                Chef
              </span>
            )}
          </div>
        )}
        <p className="text-sm break-words">{message.text}</p>
        <p className={`text-xs mt-1 ${isCurrentUser ? 'text-teal-200' : 'text-slate-500'} text-right`}>
          {time}
        </p>
      </div>
    </div>
  );
};

export default ChatMessageBubble;