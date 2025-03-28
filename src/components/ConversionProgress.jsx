import React, { useEffect, useState } from 'react';

export default function ConversionProgress({
  files,
  inputFormat,
  outputFormat,
  setConvertedUrls,
  setStep,
  quality,
  width,
  height,
  grayscale,
  rotation,
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!files || files.length === 0) {
      console.error("ConversionProgress: No files provided");
      setStep('upload');
      return;
    }

    console.log("ConversionProgress: Starting conversion with files:", files);

    const convertImages = async () => {
      const convertedUrlsArray = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i].cropped || files[i].original;

        try {
          // Convert file to base64
          const reader = new FileReader();
          const base64Promise = new Promise((resolve) => {
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(file);
          });
          const base64File = await base64Promise;

          // Send to API
          const response = await fetch('/api/convert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              file: base64File,
              outputFormat,
              quality,
              width,
              height,
              grayscale,
              rotation,
            }),
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || 'Conversion failed');
          }

          const byteCharacters = atob(data.convertedImage);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: `image/${data.format}` });

          const url = URL.createObjectURL(blob);
          convertedUrlsArray.push({ url, originalName: file.name });
        } catch (error) {
          console.error(`ConversionProgress: Error converting file ${file.name}:`, error);
          convertedUrlsArray.push({ url: null, originalName: file.name, error: error.message });
        }

        // Update progress
        setProgress(((i + 1) / files.length) * 100);
      }

      setConvertedUrls(convertedUrlsArray);
      setStep('result');
    };

    convertImages();

    return () => {
      console.log("ConversionProgress: Cleaning up");
    };
  }, [files, inputFormat, outputFormat, setConvertedUrls, setStep, quality, width, height, grayscale, rotation]);

  const handleCancel = () => {
    setStep('upload');
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-24 h-24 border-8 border-t-teal-500 rounded-full animate-spin" />
      <p className="mt-6 text-lg font-medium text-indigo-800 dark:text-white">
        Converting {files.length} image(s) from {inputFormat} to {outputFormat || 'Unknown'}...
      </p>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
        <div
          className="bg-teal-500 h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="mt-2 text-sm text-indigo-600 dark:text-teal-200">
        {Math.round(progress)}% Complete
      </p>
      <button
        className="mt-4 text-red-500 font-medium hover:underline"
        onClick={handleCancel}
      >
        Cancel
      </button>
    </div>
  );
}
