import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Importing all 6 components
import UploadSection from './components/UploadSection';
import FormatSelection from './components/FormatSelection';
import ConversionProgress from './components/ConversionProgress';
import ResultDisplay from './components/ResultDisplay';
import DarkModeToggle from './components/DarkModeToggle';
import Header from './components/Header';

// Animation transition properties
const transitionProps = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
  transition: { duration: 0.4, ease: 'easeInOut' },
};

// Supported image formats
const supportedFormats = ['JPG', 'PNG', 'HEIC', 'WEBP', 'GIF'];

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
      
      {/* Dark Mode Button */}
      <DarkModeToggle isDark={isDark} setIsDark={setIsDark} />

      {/* App Title/Header */}
      <Header />

      <div className="mt-10 w-full max-w-md flex flex-col items-center">
        <AnimatePresence mode="wait">
          {step === 'upload' && (
            <motion.div key="upload" {...transitionProps} className="w-full">
              <UploadSection setStep={setStep} setFile={setFile} />
            </motion.div>
          )}

          {step === 'select' && (
            <motion.div key="select" {...transitionProps} className="w-full">
              <FormatSelection
                formats={supportedFormats}
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
              <ConversionProgress
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
              <ResultDisplay convertedUrl={convertedUrl} setStep={setStep} />
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
