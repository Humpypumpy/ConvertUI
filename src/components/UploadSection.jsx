import React from 'react';
import { Upload } from 'lucide-react';

export default function UploadSection({ setStep, setFiles, setInputFormat }) {
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFiles(files); // Pass the FileList to App.jsx
      setStep('select');
    }
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold text-center text-indigo-800 dark:text-white mb-4">
        Upload Your Images
      </h2>
      <p className="text-sm text-indigo-600 dark:text-teal-200 text-center mb-6">
        Select one or more images to convert
      </p>
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-indigo-300 dark:border-teal-500 rounded-lg cursor-pointer hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all duration-300">
        <Upload size={32} className="text-indigo-500 dark:text-teal-400 mb-2" />
        <span className="text-indigo-600 dark:text-teal-200 font-medium">
          Click to upload images
        </span>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
    </div>
  );
}
