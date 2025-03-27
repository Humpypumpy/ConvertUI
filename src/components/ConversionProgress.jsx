import React from 'react';

export default function ConversionProgress({ inputFormat, outputFormat, onCancel }) {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-24 h-24 border-8 border-t-teal-500 rounded-full animate-spin" />
      <p className="mt-6 text-lg font-medium text-indigo-800 dark:text-white">
        Converting {inputFormat} to {outputFormat}...
      </p>
      <button
        className="mt-4 text-red-500 font-medium hover:underline"
        onClick={onCancel}
      >
        Cancel
      </button>
    </div>
  );
}
