import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import UploadScreen from './components/UploadScreen';
import SelectFormatScreen from './components/SelectFormatScreen';
import ConvertScreen from './components/ConvertScreen';
import ResultScreen from './components/ResultScreen';

const transitionProps = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
  transition: { duration: 0.4, ease: 'easeInOut' },
};

export default function App() {
  const [step, setStep] = useState('upload');
  const [isDark, setIsDark] = useState(false);
  const [file, setFile] = useState(null);
  const [inputFormat, setInputFormat] = useState('JPG');
  const [outputFormat, setOutputFormat] = useState('PNG');
  const [convertedUrl, setConvertedUrl] = useState(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-black text-gray-900 dark:text-white px-6 py-8 flex flex-col items-center relative overflow-hidden">
      {/* Header + Dark Mode Toggle */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-lg bg-white/90 text-indigo-600 dark:bg-gray-800/90 dark:text-teal-300 shadow-lg hover:scale-110 transition-transform duration-200"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>

      <h1 className="text-4xl font-extrabold text-center tracking-tight leading-tight mt-6 text-indigo-700 dark:text-teal-300">
        Telegram Image Converter
      </h1>
      <p className="text-lg font-medium text-indigo-500 dark:text-teal-200 mt-1">
        Simple. Fast. Modern.
      </p>

      <div className="mt-10 w-full max-w-md flex flex-col items-center">
        <AnimatePresence mode="wait">
          {step === 'upload' && (
            <motion.div key="upload" {...transitionProps} className="w-full">
              <UploadScreen
                setStep={setStep}
                setFile={setFile}
              />
            </motion.div>
          )}

          {step === 'select' && (
            <motion.div key="select" {...transitionProps} className="w-full">
              <SelectFormatScreen
                inputFormat={inputFormat}
                outputFormat={outputFormat}
                setInputFormat={setInputFormat}
                setOutputFormat={setOutputFormat}
                setStep={setStep}
              />
            </motion.div>
          )}

          {step === 'convert' && (
            <motion.div key="convert" {...transitionProps} className="w-full">
              <ConvertScreen
                file={file}
                inputFormat={inputFormat}
                outputFormat={outputFormat}
                setConvertedUrl={setConvertedUrl}
                setStep={setStep}
              />
            </motion.div>
          )}

          {step === 'result' && (
            <motion.div key="result" {...transitionProps} className="w-full">
              <ResultScreen
                convertedUrl={convertedUrl}
                setStep={setStep}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-auto text-sm text-indigo-400 dark:text-teal-300 pt-8 font-medium">
        Built with ❤️ for Telegram Mini Apps
      </p>
    </div>
  );
}
