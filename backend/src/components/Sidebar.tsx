import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ conversations, onSelect }: any) => {
  const [search, setSearch] = useState('');

  return (
    <div className="w-full md:w-1/3 h-full bg-gray-50 dark:bg-gray-950 border-r dark:border-gray-800 flex flex-col">
      <div className="p-4 border-b dark:border-gray-800">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">T-Gram</h1>
        <input 
          type="text" 
          placeholder="Search @username..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 bg-gray-200 dark:bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv: any) => (
          <div 
            key={conv.id} 
            onClick={() => onSelect(conv.id)}
            className="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer transition"
          >
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
              {conv.name?.charAt(0) || 'P'}
            </div>
            <div className="flex-1 truncate">
              <h3 className="font-semibold">{conv.name || 'Private Chat'}</h3>
              <p className="text-sm text-gray-500 truncate">{conv.lastMessage || 'No messages yet'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
