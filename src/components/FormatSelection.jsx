import React, { useState, useCallback } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { motion, AnimatePresence } from 'framer-motion';

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
  watermark,
  setWatermark,
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

      const updatedFiles = [...files];
      updatedFiles[currentFileIndex].cropped = croppedImage;
      setFiles(updatedFiles);
      setIsCropping(false);
    } catch (error) {
      console.error('Cropping error:', error);
    }
  };

  const handleConvertClick = () => {
    setStep('convert', {
      watermark: {
        type: watermark.type,
        text: watermark.text,
        image: watermark.image,
        position: watermark.position,
      },
    });
  };

  const availableFormats = formats.filter((format) => format !== inputFormat);

  return (
    <div className="card w-full">
      <h2 className="text-2xl font-semibold text-center text-indigo-800 dark:text-white mb-4">
        Edit Your Images
      </h2>
      {/* File Navigation */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentFileIndex((prev) => Math.max(prev - 1, 0))}
          disabled={currentFileIndex === 0}
          className="p-2 bg-indigo-500 text-white rounded-full disabled:bg-gray-400 hover:bg-indigo-600 transition-all duration-300"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-indigo-600 dark:text-teal-200 font-medium">
          Image {currentFileIndex + 1} of {files.length}
        </span>
        <button
          onClick={() => setCurrentFileIndex((prev) => Math.min(prev + 1, files.length - 1))}
          disabled={currentFileIndex === files.length - 1}
          className="p-2 bg-indigo-500 text-white rounded-full disabled:bg-gray-400 hover:bg-indigo-600 transition-all duration-300"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      {/* Image Preview and Cropping */}
      {files[currentFileIndex] && (
        <div className="mb-6">
          <p className="text-sm font-medium text-indigo-600 dark:text-teal-200 mb-2">
            {files[currentFileIndex].original.name}
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFileIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {isCropping ? (
                <div className="relative w-full">
                  <div className="h-64">
                    <Cropper
                      image={files[currentFileIndex].previewUrl}
                      crop={crop}
                      zoom={zoom}
                      aspect={4 / 3}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                  </div>
                  <div className="mt-4 flex gap-4 z-10 relative">
                    <button
                      className="py-2 px-4 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all duration-300"
                      onClick={handleCrop}
                    >
                      Crop
                    </button>
                    <button
                      className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
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
                    className="w-full h-48 object-contain rounded-lg border border-indigo-200 dark:border-gray-700"
                  />
                  <button
                    className="mt-2 py-2 px-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-300"
                    onClick={() => setIsCropping(true)}
                  >
                    Crop Image
                  </button>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg font-medium text-indigo-600 dark:text-teal-200">
              {inputFormat || 'Unknown'} to
            </span>
            <div className="relative w-full">
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                className="appearance-none bg-indigo-100 dark:bg-gray-700 text-indigo-700 dark:text-teal-300 px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10 transition-all duration-300 w-full"
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
            <label className="text-sm font-medium text-indigo
