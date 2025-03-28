import React, { useState, useCallback, useEffect } from 'react';
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
  watermark,
  setWatermark,
}) {
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [fileSize, setFileSize] = useState(null);

  useEffect(() => {
    if (files[currentFileIndex]) {
      const file = files[currentFileIndex].original;
      setFileSize((file.size / 1024 / 1024).toFixed(2)); // Size in MB
    }
  }, [files, currentFileIndex]);

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

  const handleWatermarkImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setWatermark({ ...watermark, image: file });
    }
  };

  const handleConvertClick = () => {
    setStep('convert', { watermark });
  };

  const availableFormats = formats.filter((format) => format !== inputFormat);

  return (
    <div className="w-full max-w-md flex flex-col gap-6">
      {/* File Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentFileIndex((prev) => Math.max(prev - 1, 0))}
          disabled={currentFileIndex === 0}
          className="p-2 bg-[#1A1A1A] text-white rounded-full disabled:bg-gray-600 hover:bg-gray-700 transition-all duration-300"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-secondary font-medium">
          Image {currentFileIndex + 1} of {files.length}
        </span>
        <button
          onClick={() => setCurrentFileIndex((prev) => Math.min(prev + 1, files.length - 1))}
          disabled={currentFileIndex === files.length - 1}
          className="p-2 bg-[#1A1A1A] text-white rounded-full disabled:bg-gray-600 hover:bg-gray-700 transition-all duration-300"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      {/* Image Preview and Cropping */}
      {files[currentFileIndex] && (
        <div className="card">
          <p className="text-lg font-semibold text-primary mb-2">
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
                    className="preview-image"
                  />
                  <p className="preview-label text-center">
                    {inputFormat} • {fileSize} MB
                  </p>
                  <button
                    className="mt-2 py-2 px-4 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all duration-300 w-full"
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
      <div className="card">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-lg font-semibold text-primary">From:</span>
            <div className="relative w-1/2">
              <select
                value={inputFormat}
                disabled
                className="select-field w-full"
              >
                <option value={inputFormat}>{inputFormat}</option>
              </select>
              <ChevronDown
                size={18}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-lg font-semibold text-primary">To:</span>
            <div className="relative w-1/2">
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                className="select-field w-full"
              >
                {availableFormats.map((format) => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={18}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <label className="text-lg font-semibold text-primary mb-2 block">Compression:</label>
        <div className="flex justify-between text-sm text-secondary mb-2">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          value={quality}
          onChange={(e) => setQuality(parseFloat(e.target.value))}
          className="w-full slider-track accent-teal-500"
        />
      </div>
      {/* Watermark Section */}
      <div className="card">
        <label className="text-lg font-semibold text-primary mb-2 block">Watermark:</label>
        <select
          value={watermark.type}
          onChange={(e) => setWatermark({ ...watermark, type: e.target.value })}
          className="select-field w-full mb-4"
        >
          <option value="none">None</option>
          <option value="text">Text Watermark</option>
          <option value="image">Image Watermark</option>
        </select>
        {watermark.type === 'text' && (
          <>
            <input
              type="text"
              value={watermark.text}
              onChange={(e) => setWatermark({ ...watermark, text: e.target.value })}
              placeholder="Enter watermark text"
              className="input-field mt-1 mb-4"
            />
            <select
              value={watermark.position}
              onChange={(e) => setWatermark({ ...watermark, position: e.target.value })}
              className="select-field w-full"
            >
              <option value="top-left">Top Left</option>
              <option value="top-right">Top Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="bottom-right">Bottom Right</option>
            </select>
          </>
        )}
        {watermark.type === 'image' && (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleWatermarkImageChange}
              className="w-full mt-1 text-gray-600 dark:text-gray-300 mb-4"
            />
            {watermark.image && (
              <img
                src={URL.createObjectURL(watermark.image)}
                alt="Watermark Preview"
                className="w-24 h-24 object-contain mt-2 rounded-lg border border-gray-600 mb-4"
              />
            )}
            <select
              value={watermark.position}
              onChange={(e) => setWatermark({ ...watermark, position: e.target.value })}
              className="select-field w-full"
            >
              <option value="top-left">Top Left</option>
              <option value="top-right">Top Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="bottom-right">Bottom Right</option>
            </select>
          </>
        )}
      </div>
      <button
        className="btn-convert w-full"
        onClick={handleConvertClick}
      >
        Convert
      </button>
    </div>
  );
}
