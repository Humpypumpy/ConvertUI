import React, { useEffect, useState } from 'react';
import imageCompression from 'browser-image-compression';

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
  watermark,
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
        let file = files[i].cropped || files[i].original;

        try {
          // Pre-compress the image on the client side
          const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          };
          file = await imageCompression(file, options);
          console.log(`Compressed file ${file.name} to ${(file.size / 1024 / 1024).toFixed(2)} MB`);

          // Check file size after compression (limit to 5MB for Vercel serverless functions)
          const maxSizeMB = 5;
          if (file.size / 1024 / 1024 > maxSizeMB) {
            throw new Error(`File ${file.name} is too large (${(file.size / 1024 / 1024).toFixed(2)} MB). Maximum allowed size is ${maxSizeMB} MB.`);
          }

          // Convert file to base64
          const reader = new FileReader();
          const base64Promise = new Promise((resolve) => {
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(file);
          });
          const base64File = await base64Promise;

          // Convert watermark image to base64 if present
          let watermarkImageBase64 = null;
          if (watermark.type === 'image' && watermark.image) {
            const watermarkReader = new FileReader();
            const watermarkPromise = new Promise((resolve) => {
              watermarkReader.onload = () => resolve(watermarkReader.result.split(',')[1]);
              watermarkReader.readAsDataURL(watermark.image);
            });
            watermarkImageBase64 = await watermarkPromise;
          }

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
              watermark: {
                type: watermark.type,
                text: watermark.text,
                image: watermarkImageBase64,
                position: watermark.position,
              },
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
          let errorMessage = 'Failed to convert the image. Please try again later.';
          if (error.message.includes('Unexpected token')) {
            errorMessage = 'Server error: Unable to process the image. Please check your connection and try again.';
          } else if (error.message.includes('Conversion failed')) {
            errorMessage = 'Conversion failed. The image might be corrupted or unsupported.';
          } else if (error.message.includes('too large')) {
            errorMessage = error.message;
          }
          convertedUrlsArray.push({ url: null, originalName: file.name, error: errorMessage });
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
  }, [files, inputFormat, outputFormat, setConvertedUrls, setStep, quality, width, height, grayscale, rotation, watermark]);

  const handleCancel = () => {
    setStep('upload');
  };

  return (
    <div className="card w-full flex flex-col items-center">
      <h2 className="text-2xl font-semibold text-center text-indigo-800 dark:text-white mb-4">
        Converting...
      </h2>
      <div className="w-24 h-24 border-8 border-t-teal-500 rounded-full animate-spin" />
      <p className="mt-6 text-lg font-medium text-indigo-800 dark:text-white">
        Converting {files.length} image(s) from {inputFormat} to {outputFormat || 'Unknown'}...
      </p>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
        <div
          className="bg-teal-500 h-2.5 rounded-full transition-all duration-300"
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
