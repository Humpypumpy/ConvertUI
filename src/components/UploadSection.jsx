import React from 'react';
import { Upload } from 'lucide-react';

export default function UploadSection({ setStep, setFiles, setInputFormat }) {
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFiles(files);
      if (files.length > 0) {
        const inputFormat = files[0].name.split('.').pop().toUpperCase();
        setInputFormat(inputFormat);
        setStep('select');
      }
    }
  };

  return (
    <div className="card w-full">
      <h2 className="text-2xl font-semibold text-center text-indigo-800 dark:text-white mb-4">
        Upload Your Images
      </h2>
      <p className="text-sm text-indigo-600 dark:text-teal-200 text-center mb-6">
        Select one or more images to convert
      </p>
      <div className="flex items-center justify-center h-48 border-2 border-dashed border-indigo-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all duration-300">
        <div className="flex flex-col items-center justify-center">
          <Upload size={48} className="text-indigo-500 dark:text-teal-400 mb-2" />
          <p className="text-indigo-600 dark:text-teal-200 font-medium">
            Drag and drop images here or click to select
          </p>
        </div>
      </div>
      <input
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
