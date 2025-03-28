import React, { useEffect } from 'react';

export default function ConversionProgress({ file, inputFormat, outputFormat, setConvertedUrl, setStep }) { // Ensure outputFormat is destructured
  useEffect(() => {
    if (!file) {
      console.error("ConversionProgress: No file provided");
      setStep('upload');
      return;
    }

    console.log("ConversionProgress: Starting simulation with file:", file);
    const timer = setTimeout(() => {
      try {
        const url = URL.createObjectURL(file);
        console.log("ConversionProgress: URL created:", url);
        setConvertedUrl(url);
        console.log("ConversionProgress: Set convertedUrl");
        setStep('result');
        console.log("ConversionProgress: Moved to result step");
      } catch (error) {
        console.error("ConversionProgress: Error creating URL:", error);
        setStep('upload');
      }
    }, 2000);

    return () => {
      console.log("ConversionProgress: Cleaning up timer");
      clearTimeout(timer);
    };
  }, [file, inputFormat, outputFormat, setConvertedUrl, setStep]);

  const handleCancel = () => {
    setStep('upload');
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-24 h-24 border-8 border-t-teal-500 rounded-full animate-spin" />
      <p className="mt-6 text-lg font-medium text-indigo-800 dark:text-white">
        Converting {inputFormat} to {outputFormat || 'Unknown'}... {/* Add fallback */}
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
