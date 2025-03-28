import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function FormatSelection({
  formats,
  inputFormat,
  outputFormat,
  setOutputFormat,
  setStep,
  quality,
  setQuality,
  width,
  setWidth,
  height,
  setHeight,
}) {
  const handleConvertClick = () => {
    setStep('convert');
  };

  // Filter out the inputFormat from the output options
  const availableFormats = formats.filter((format) => format !== inputFormat);

  return (
    <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold text-center text-indigo-800 dark:text-white mb-4">
        Convert Your Image
      </h2>
      <div className="flex flex-col gap-4 mb-6">
        {/* Show detected input format */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-lg font-medium text-indigo-600 dark:text-teal-200">
            {inputFormat || 'Unknown'} to
          </span>
          <div className="relative">
            <select
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
              className="appearance-none bg-indigo-100 dark:bg-gray-700 text-indigo-700 dark:text-teal-300 px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
            >
              {availableFormats.map((format) => (
                <option key={format} value={format}>
                  {format}
                </option>
              ))}
            </select>
            <ChevronDown
              size={18}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-700 dark:text-teal-300 pointer-events-none"
            />
          </div>
        </div>

        {/* Quality Slider */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-indigo-600 dark:text-teal-200">
            Quality: {Math.round(quality * 100)}%
          </label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={quality}
            onChange={(e) => setQuality(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Resize Inputs */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-indigo-600 dark:text-teal-200">
              Width (px):
            </label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              placeholder="Optional"
              className="w-full mt-1 bg-indigo-100 dark:bg-gray-700 text-indigo-700 dark:text-teal-300 px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex flex-col gap-2">
  <label className="text-sm font-medium text-indigo-600 dark:text-teal-200">
    Grayscale:
  </label>
  <input
    type="checkbox"
    checked={grayscale}
    onChange={(e) => setGrayscale(e.target.checked)}
    className="mt-1"
  />
</div>
<div className="flex flex-col gap-2">
  <label className="text-sm font-medium text-indigo-600 dark:text-teal-200">
    Rotation:
  </label>
  <select
    value={rotation}
    onChange={(e) => setRotation(parseInt(e.target.value))}
    className="bg-indigo-100 dark:bg-gray-700 text-indigo-700 dark:text-teal-300 px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500"
  >
    <option value={0}>0°</option>
    <option value={90}>90°</option>
    <option value={180}>180°</option>
    <option value={270}>270°</option>
  </select>
</div>
          
          <div className="flex-1">
            <label className="text-sm font-medium text-indigo-600 dark:text-teal-200">
              Height (px):
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Optional"
              className="w-full mt-1 bg-indigo-100 dark:bg-gray-700 text-indigo-700 dark:text-teal-300 px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>
      <button
        className="mt-6 w-full py-3 bg-teal-500 text-white font-semibold rounded-lg shadow-lg hover:bg-teal-600 transition-all duration-300"
        onClick={handleConvertClick}
      >
        Convert Now
      </button>
    </div>
  );
}
