import React, { useEffect } from 'react';

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

    console.log("ConversionProgress: Starting conversion with file:", file);

    const convertImage = async () => {
      try {
        // Convert file to base64
        const reader = new FileReader();
        const base64Promise = new Promise((resolve) => {
          reader.onload = () => resolve(reader.result.split(',')[1]); // Remove "data:image/..." prefix
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
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Conversion failed');
        }

        // Convert base64 response back to a blob
        const byteCharacters = atob(data.convertedImage);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: `image/${data.format}` });

        // Create URL for the blob
        const url = URL.createObjectURL(blob);
        console.log("ConversionProgress: URL created:", url);
        setConvertedUrl(url);
        console.log("ConversionProgress: Set convertedUrl");
        setStep('result');
        console.log("ConversionProgress: Moved to result step");
      } catch (error) {
        console.error("ConversionProgress: Error converting image:", error);
        setStep('upload');
      }
    };

    convertImage();

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
