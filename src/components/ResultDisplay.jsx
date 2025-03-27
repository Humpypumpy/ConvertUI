import React from 'react';
import { Download } from 'lucide-react';

export default function ResultDisplay({ onConvertAnother }) {
  return (
    <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold text-center text-indigo-800 dark:text-white mb-4">
        Conversion Complete!
      </h2>
      <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
      <div className="flex gap-4">
        <button className="flex-1 py-3 bg-teal-500 text-white font-semibold rounded-lg shadow-lg hover:bg-teal-600 transition-all duration-300 flex items-center justify-center gap-2">
          <Download size={20} /> Download
        </button>
        <button
          className="flex-1 py-3 bg-indigo-100 dark:bg-gray-700 text-indigo-700 dark:text-teal-300 rounded-lg shadow-md hover:bg-indigo-200 dark:hover:bg-gray-600 transition-all duration-300"
          onClick={onConvertAnother}
        >
          Convert Another
        </button>
      </div>
    </div>
  );
}
