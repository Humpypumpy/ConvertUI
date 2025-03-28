import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function ResultDisplay({ convertedUrls, outputFormat, setStep }) {
  const [fileSizes, setFileSizes] = useState([]);

  useEffect(() => {
    const fetchSizes = async () => {
      const sizes = await Promise.all(
        convertedUrls.map(async (item) => {
          if (item.url) {
            const res = await fetch(item.url);
            const blob = await res.blob();
            return (blob.size / 1024 / 1024).toFixed(2); // Size in MB
          }
          return null;
        })
      );
      setFileSizes(sizes);
    };

    fetchSizes();
  }, [convertedUrls]);

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    const folder = zip.folder('converted-images');

    for (let i = 0; i < convertedUrls.length; i++) {
      const item = convertedUrls[i];
      if (item.url) {
        const response = await fetch(item.url);
        const blob = await response.blob();
        const fileName = `${item.originalName.split('.')[0]}.${outputFormat.toLowerCase()}`;
        folder.file(fileName, blob);
      }
    }

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'converted-images.zip');
  };

  const handleConvertAnother = () => {
    setStep('upload');
  };

  return (
    <div className="card w-full">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-4">
        Conversion Complete!
      </h2>
      <div className="space-y-4 mb-6">
        {convertedUrls.map((item, index) => (
          <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              {item.originalName}
            </p>
            {item.url ? (
              <>
                <img
                  src={item.url}
                  alt={`Converted ${item.originalName}`}
                  className="w-full h-48 object-contain rounded-lg border border-gray-200 dark:border-gray-700 mb-2"
                />
                {fileSizes[index] && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    File Size: {fileSizes[index]} MB
                  </p>
                )}
                <a
                  href={item.url}
                  download={`${item.originalName.split('.')[0]}.${outputFormat.toLowerCase()}`}
                  className="inline-flex items-center py-2 px-4 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition-all duration-300"
                >
                  <Download size={20} className="mr-2" /> Download
                </a>
              </>
            ) : (
              <p className="text-red-500">{item.error}</p>
            )}
          </div>
        ))}
      </div>
      {convertedUrls.length > 1 && (
        <button
          className="btn-primary w-full mb-4"
          onClick={handleDownloadAll}
        >
          Download All as ZIP
        </button>
      )}
      <button
        className="btn-secondary w-full"
        onClick={handleConvertAnother}
      >
        Convert Another
      </button>
    </div>
  );
}
