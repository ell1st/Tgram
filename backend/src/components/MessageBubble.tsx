import React from 'react';

const MessageBubble = ({ message, isOwn }: any) => {
  const isSystem = message.type === 'SYSTEM';
  
  if (isSystem) return <div className="text-center text-xs text-gray-500 my-2 italic">{message.content}</div>;

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`max-w-[70%] p-3 rounded-xl shadow-sm ${isOwn ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-800 rounded-bl-none'}`}>
        {message.type === 'IMAGE' && (
          <img src={message.mediaUrl} alt="Sent" className="rounded-lg mb-2 max-h-60 object-cover" />
        )}
        <p className="text-sm break-words">{message.content}</p>
        <span className={`text-[10px] mt-1 block text-right ${isOwn ? 'text-blue-200' : 'text-gray-500'}`}>
          {new Date(message.createdAt).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
