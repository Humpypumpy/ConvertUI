import React from 'react';
import { Upload, Camera, Clock } from 'lucide-react';

export default function UploadSection({ setStep }) {
  return (
    <>
      <button
        className="w-full py-5 px-8 bg-white dark:bg-gray-800 text-indigo-700 dark:text-teal-300 text-xl font-semibold rounded-xl shadow-xl flex items-center justify-center gap-3 hover:bg-indigo-100 dark:hover:bg-gray-700 hover:shadow-2xl transition-all duration-300 group"
        onClick={() => setStep('select')}
      >
        <Upload size={24} className="group-hover:-translate-y-1 transition-transform" />
        Upload Image
      </button>
      <div className="mt-6 flex gap-4">
        <button className="flex items-center gap-2 bg-white dark:bg-gray-800 text-indigo-700 dark:text-teal-300 px-4 py-2 rounded-lg shadow-md hover:scale-105 transition-all duration-200">
          <Camera size={18} /> Camera
        </button>
        <button className="flex items-center gap-2 bg-white dark:bg-gray-800 text-indigo-700 dark:text-teal-300 px-4 py-2 rounded-lg shadow-md hover:scale-105 transition-all duration-200">
          <Clock size={18} /> Recent
        </button>
      </div>
    </>
  );
}
