import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { TikTokIcon } from '../components/icons/TikTok'; // Assuming you have an SVG component

const Settings = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 text-black dark:text-white p-6 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      {/* Appearance */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-600 dark:text-gray-300">Appearance</h2>
        <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <span>Theme</span>
          <select 
            value={theme} 
            onChange={(e) => setTheme(e.target.value)}
            className="bg-gray-200 dark:bg-gray-700 p-2 rounded"
          >
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
          </select>
        </div>
      </div>

      {/* Privacy */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-600 dark:text-gray-300">Privacy</h2>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm">
          <p className="font-medium mb-2">Private Chat Security</p>
          <p className="text-gray-500 dark:text-gray-400">
            Private chat. Messages are protected in transit and stored securely. (End-to-end encryption is not currently implemented).
          </p>
        </div>
      </div>

      {/* About */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-600 dark:text-gray-300">About</h2>
        <p className="text-gray-500 dark:text-gray-400">T-Gram - Modern secure messaging platform.</p>
      </div>

      {/* Social Button */}
      <div className="mt-auto pt-6 border-t dark:border-gray-700 flex justify-center">
        <a 
          href="https://tiktok.com/@ieuakunkadua" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-black dark:bg-white text-white dark:text-black p-3 rounded-full inline-flex items-center justify-center hover:scale-110 transition-transform"
          aria-label="TikTok"
        >
          <TikTokIcon className="w-6 h-6" />
        </a>
      </div>
    </div>
  );
};

export default Settings;
