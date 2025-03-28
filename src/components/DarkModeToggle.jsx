import React from 'react';
import { Moon, Sun } from 'lucide-react';

export default function DarkModeToggle({ isDark, setIsDark }) {
  return (
    <button
      className="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all duration-300"
      onClick={() => setIsDark(!isDark)}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
