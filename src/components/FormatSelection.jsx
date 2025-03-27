import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function FormatSelection({ formats, inputFormat, setInputFormat, outputFormat, setOutputFormat, onConvert }) {
  return (
    <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold text-center text-indigo-800 dark:text-white mb-4">
        Convert Your Image
      </h2>
      <div className="flex items-center justify-center gap-2 mb-6">
        <span className="text-lg font-medium text-indigo-600 dark:text-teal-200">convert</span>
        <div className="relative">
          <select
            value={inputFormat}
            onChange={(e) => setInputFormat(e.target.value)}
            className="appearance-none bg-indigo-100 dark:bg-gray-700 text-indigo-700 dark:text-teal-300 px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
          >
            {formats.map((format) => (
              <option key={format} value={format}>{format}</option>
            ))}
          </select>
          <ChevronDown size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-700 dark:text-teal-300 pointer-events-none" />
        </div>
        <span className="text-lg font-medium text-indigo-600 dark:text-teal-200">to</span>
        <div className="relative">
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            className="appearance-none bg-indigo-100 dark:bg-gray-700 text-indigo-700 dark:text-teal-300 px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
          >
            {formats.map((format) => (
              <option key={format} value={format}>{format}</option>
            ))}
          </select>
          <ChevronDown size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-700 dark:text-teal-300 pointer-events-none" />
        </div>
      </div>
      <button
        className="mt-6 w-full py-3 bg-teal-500 text-white font-semibold rounded-lg shadow-lg hover:bg-teal-600 transition-all duration-300"
        onClick={onConvert}
      >
        Convert Now
      </button>
    </div>
  );
}
