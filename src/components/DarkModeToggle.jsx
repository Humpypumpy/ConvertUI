import React from 'react';
import { Moon, Sun } from 'lucide-react';

export default function DarkModeToggle({ isDark, setIsDark }) {
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="absolute top-4 right-4 p-2 rounded-lg bg-white/90 text-indigo-600 dark:bg-gray-800/90 dark:text-teal-300 shadow-lg hover:scale-110 transition-transform duration-200 z-10"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
