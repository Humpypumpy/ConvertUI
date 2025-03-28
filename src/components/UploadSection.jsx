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
    <div className="w-full max-w-md flex flex-col gap-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-center text-primary mb-4">
          Upload Your Images
        </h2>
        <p className="text-sm text-secondary text-center mb-6">
          Select one or more images to convert
        </p>
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:bg-gray-800 transition-all duration-300"
        >
          <Upload size={48} className="text-gray-400 mb-2" />
          <span className="text-gray-300 font-medium">
            Drag and drop images here or click to select
          </span>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
}
