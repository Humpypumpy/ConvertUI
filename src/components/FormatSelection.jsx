import React, { useState, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import Cropper from 'react-easy-crop';

export default function FormatSelection({
  files,
  setFiles,
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
  grayscale,
  setGrayscale,
  rotation,
  setRotation,
}) {
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    if (!croppedAreaPixels) return;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const image = new Image();
      image.src = files[currentFileIndex].previewUrl;

      await new Promise((resolve) => {
        image.onload = resolve;
      });

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      const croppedImage = await new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(new File([blob], files[currentFileIndex].original.name, { type: files[currentFileIndex].original.type }));
        }, files[currentFileIndex].original.type);
      });

      // Update the file with the cropped version
      const updatedFiles = [...files];
      updatedFiles[currentFileIndex].cropped = croppedImage;
      setFiles(updatedFiles);
      setIsCropping(false);
    } catch (error) {
      console.error('Cropping error:', error);
    }
  };

  const handleConvertClick = () => {
    setStep('convert');
  };

  const availableFormats = formats.filter((format) => format !== inputFormat);

  return (
    <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold text-center text-indigo-800 dark:text-white mb-4">
        Convert Your Images
      </h2>
      {/* File Navigation */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentFileIndex((prev) => Math.max(prev - 1, 0))}
          disabled={currentFileIndex === 0}
          className="py-2 px-4 bg-indigo-500 text-white rounded-lg disabled:bg-gray-400"
        >
          Previous
        </button>
        <span className="text-indigo-600 dark:text-teal-200">
          Image {currentFileIndex + 1} of {files.length}
        </span>
        <button
          onClick={() => setCurrentFileIndex((prev) => Math.min(prev + 1, files.length - 1))}
          disabled={currentFileIndex === files.length - 1}
          className="py-2 px-4 bg-indigo-500 text-white rounded-lg disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
      {/* Image Preview and Cropping */}
      {files[currentFileIndex] && (
        <div className="mb-6">
          <p className="text-sm font-medium text-indigo-600 dark:text-teal-200 mb-2">
            {files[currentFileIndex].original.name}
          </p>
          {isCropping ? (
            <div className="relative w-full h-64">
              <Cropper
                image={files[currentFileIndex].previewUrl}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
              <div className="mt-4 flex gap-4">
                <button
                  className="py-2 px-4 bg-teal-500 text-white rounded-lg"
                  onClick={handleCrop}
                >
                  Crop
                </button>
                <button
                  className="py-2 px-4 bg-red-500 text-white rounded-lg"
                  onClick={() => setIsCropping(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <img
                src={files[currentFileIndex].cropped ? URL.createObjectURL(files[currentFileIndex].cropped) : files[currentFileIndex].previewUrl}
                alt="Preview"
                className="w-full h-48 object-contain rounded-lg"
              />
              <button
                className="mt-2 py-2 px-4 bg-indigo-500 text-white rounded-lg"
                onClick={() => setIsCropping(true)}
              >
                Crop Image
              </button>
            </>
          )}
        </div>
      )}
      <div className="flex flex-col gap-4 mb-6">
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
