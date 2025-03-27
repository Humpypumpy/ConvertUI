import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState("png");
  const [scale, setScale] = useState(100);
  const [quality, setQuality] = useState(90);
  const [convertedUrl, setConvertedUrl] = useState(null);

  const handleConvert = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("format", format);
    formData.append("scale", scale);
    formData.append("quality", quality);

    const res = await fetch("https://convert3.onrender.com", {
      method: "POST",
      body: formData,
    });

    const blob = await res.blob();
    setConvertedUrl(URL.createObjectURL(blob));
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Telegram Image Converter</h1>

      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="mb-4" />

      <label>Format:</label>
      <select value={format} onChange={(e) => setFormat(e.target.value)} className="mb-4 w-full">
        <option value="png">PNG</option>
        <option value="jpeg">JPEG</option>
        <option value="webp">WEBP</option>
        <option value="tiff">TIFF</option>
        <option value="avif">AVIF</option>
        <option value="ico">ICO</option>
      </select>

      <label>Resize (%): {scale}</label>
      <input type="range" min="25" max="100" step="5" value={scale} onChange={(e) => setScale(e.target.value)} className="mb-4 w-full" />

      <label>Quality (%): {quality}</label>
      <input type="range" min="10" max="100" step="10" value={quality} onChange={(e) => setQuality(e.target.value)} className="mb-4 w-full" />

      <button onClick={handleConvert} className="bg-blue-600 text-white px-4 py-2 rounded">Convert Image</button>

      {convertedUrl && (
        <div className="mt-4">
          <h2 className="mb-2">Converted Image:</h2>
          <a href={convertedUrl} download="converted_image" className="text-blue-500 underline">Download</a>
        </div>
      )}
    </div>
  );
}

export default App;
