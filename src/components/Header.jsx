import React from 'react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gradient">ConvertUI</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">Fast. Simple. Modern.</p>
    </header>
  );
}
