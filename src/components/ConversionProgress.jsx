import React, { useEffect } from 'react';
import imageCompression from 'browser-image-compression';

export default function ConversionProgress({
  file,
  inputFormat,
  outputFormat,
  setConvertedUrl,
  setStep,
  quality,
  width,
  height,
}) {
  useEffect(() => {
    if (!file) {
      console.error("ConversionProgress: No file provided");
      setStep('upload');
      return;
    }

    console.log("ConversionProgress: Starting simulation with file:", file);

    const processImage = async () => {
      try {
        const options = {
          maxSizeMB: 1, // Target max size
          maxWidthOrHeight: Math.max(parseInt(width) || 1920, parseInt(height) || 1920), // Use width/height if provided
          useWebWorker: true,
          initialQuality: quality, // Use quality setting
        };

        // Compress and resize the image
        const compressedFile = await imageCompression(file, options);
        console.log("ConversionProgress: Compressed file:", compressedFile);

        // Create a new File object with the correct extension
        const newFileName = `converted-image.${outputFormat.toLowerCase()}`;
        const convertedFile = new File([compressedFile], newFileName, {
          type: `image/${outputFormat.toLowerCase()}`,
        });

        const url = URL.createObjectURL(convertedFile);
        console.log("ConversionProgress: URL created:", url);
        setConvertedUrl(url);
        console.log("ConversionProgress: Set convertedUrl");
        setStep('result');
        console.log("ConversionProgress: Moved to result step");
      } catch (error) {
        console.error("ConversionProgress: Error processing image:", error);
        setStep('upload');
      }
    };

    processImage();

    return () => {
      console.log("ConversionProgress: Cleaning up");
    };
  }, [file, inputFormat, outputFormat, setConvertedUrl, setStep, quality, width, height]);

  const handleCancel = () => {
    setStep('upload');
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-24 h-24 border-8 border-t-teal-500 rounded-full animate-spin" />
      <p className="mt-6 text-lg font-medium text-indigo-800 dark:text-white">
        Converting {inputFormat} to {outputFormat || 'Unknown'}...
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
