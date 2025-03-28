import React, { useEffect } from 'react';

export default function ConversionProgress({ file, inputFormat, outputFormat, setConvertedUrl, setStep }) { // Update props
  useEffect(() => {
    // Simulate conversion (replace with actual logic later)
    const timer = setTimeout(() => {
      const url = URL.createObjectURL(file); // Temporary URL for testing
      setConvertedUrl(url);
      setStep('result');
    }, 2000); // Simulate 2-second conversion

    return () => clearTimeout(timer); // Cleanup
  }, [file, setConvertedUrl, setStep]);

  const handleCancel = () => {
    setStep('upload'); // Go back to upload step
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-24 h-24 border-8 border-t-teal-500 rounded-full animate-spin" />
      <p className="mt-6 text-lg font-medium text-indigo-800 dark:text-white">
        Converting {inputFormat} to {outputFormat}...
      </p>
      <button
        className="mt-4 text-red-500 font-medium hover:underline"
        onClick={handleCancel} // Updated to go back
      >
        Cancel
      </button>
    </div>
  );
}
