import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import UploadSection from './components/UploadSection';
import FormatSelection from './components/FormatSelection';
import ConversionProgress from './components/ConversionProgress';
import ResultDisplay from './components/ResultDisplay';
import DarkModeToggle from './components/DarkModeToggle';
import Header from './components/Header';

const transitionProps = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
  transition: { duration: 0.4, ease: 'easeInOut' },
};

const supportedFormats = ['JPG', 'PNG', 'HEIC', 'WEBP', 'GIF', 'TIFF', 'AVIF'];

export default function App() {
  const [step, setStep] = useState('upload');
  const [isDark, setIsDark] = useState(true); // Force dark mode
  const [files, setFiles] = useState([]); // Array of file objects
  const [inputFormat, setInputFormat] = useState('');
  const [outputFormat, setOutputFormat] = useState('PNG');
  const [convertedUrls, setConvertedUrls] = useState([]); // Array of converted URLs
  const [quality, setQuality] = useState(0.8);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [watermark, setWatermark] = useState({ type: 'none', text: '', image: null, position: 'bottom-right' });

  useEffect(() => {
    document.body.classList.toggle('dark', isDark);
  }, [isDark]);

  const handleSetFiles = (fileList) => {
    const fileArray = Array.from(fileList).map((file) => ({
      original: file,
      cropped: null,
      previewUrl: URL.createObjectURL(file),
    }));
    setFiles(fileArray);
    if (fileArray.length > 0) {
      const inputFormat = fileArray[0].original.name.split('.').pop().toUpperCase();
      setInputFormat(inputFormat);
      setStep('select');
    }
  };

  const handleSetStep = (newStep, additionalData = {}) => {
    if (newStep === 'convert') {
      setWatermark(additionalData.watermark || { type: 'none', text: '', image: null, position: 'bottom-right' });
    }
    setStep(newStep);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white px-4 py-8 flex flex-col items-center relative overflow-hidden">
      <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
      <Header />
      <DarkModeToggle isDark={isDark} setIsDark={setIsDark} />
      <div className="mt-12 w-full max-w-md flex flex-col items-center">
        <AnimatePresence mode="wait">
          {step === 'upload' && (
            <motion.div key="upload" {...transitionProps} className="w-full">
              <UploadSection setStep={setStep} setFiles={handleSetFiles} setInputFormat={setInputFormat} />
            </motion.div>
          )}
          {step === 'select' && (
            <motion.div key="select" {...transitionProps} className="w-full">
              <FormatSelection
                files={files}
                setFiles={setFiles}
                formats={supportedFormats}
                inputFormat={inputFormat}
                outputFormat={outputFormat}
                setOutputFormat={setOutputFormat}
                setStep={handleSetStep}
                quality={quality}
                setQuality={setQuality}
                width={width}
                setWidth={setWidth}
                height={height}
                setHeight={setHeight}
                watermark={watermark}
                setWatermark={setWatermark}
              />
            </motion.div>
          )}
          {step === 'convert' && (
            <motion.div key="convert" {...transitionProps} className="w-full">
              <ConversionProgress
                files={files}
                inputFormat={inputFormat}
                outputFormat={outputFormat}
                setConvertedUrls={setConvertedUrls}
                setStep={setStep}
                quality={quality}
                width={width}
                height={height}
                watermark={watermark}
              />
            </motion.div>
          )}
          {step === 'result' && (
            <motion.div key="result" {...transitionProps} className="w-full">
              <ResultDisplay
                convertedUrls={convertedUrls}
                outputFormat={outputFormat}
                setStep={setStep}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="mt-auto text-sm text-gray-400 pt-8 font-medium">
        Built with ❤️ for Telegram Mini Apps
      </p>
    </div>
  );
}
