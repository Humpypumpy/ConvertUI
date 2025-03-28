import sharp from 'sharp';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { file, outputFormat, quality, width, height, grayscale, rotation, watermark } = req.body;

    if (!file || !outputFormat) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Convert base64 file to buffer
    const imageBuffer = Buffer.from(file, 'base64');

    // Start processing with sharp
    let image = sharp(imageBuffer);

    // Apply rotation
    if (rotation) {
      image = image.rotate(rotation);
    }

    // Apply resizing
    if (width || height) {
      image = image.resize({
        width: width ? parseInt(width) : null,
        height: height ? parseInt(height) : null,
        fit: 'contain',
      });
    }

    // Apply grayscale
    if (grayscale) {
      image = image.grayscale();
    }

    // Apply watermark
    if (watermark && watermark.type !== 'none') {
      const metadata = await image.metadata();
      const imageWidth = metadata.width;
      const imageHeight = metadata.height;

      let watermarkBuffer;
      if (watermark.type === 'text') {
        // Create an SVG for the text watermark
        const textSvg = `
          <svg width="${imageWidth}" height="${imageHeight}">
            <text x="0" y="0" font-family="Arial" font-size="40" fill="rgba(255,255,255,0.5)">
              ${watermark.text}
            </text>
          </svg>
        `;
        watermarkBuffer = Buffer.from(textSvg);
      } else if (watermark.type === 'image' && watermark.image) {
        // Use the uploaded watermark image
        watermarkBuffer = Buffer.from(watermark.image, 'base64');
        // Resize the watermark to 20% of the image width
        const watermarkImage = sharp(watermarkBuffer);
        const watermarkMetadata = await watermarkImage.metadata();
        const watermarkWidth = Math.round(imageWidth * 0.2);
        const watermarkHeight = Math.round((watermarkWidth / watermarkMetadata.width) * watermarkMetadata.height);
        watermarkBuffer = await watermarkImage
          .resize(watermarkWidth, watermarkHeight)
          .toBuffer();
      }

      // Determine watermark position
      let top, left;
      const margin = 20; // Margin from the edges
      const watermarkMetadata = await sharp(watermarkBuffer).metadata();
      const watermarkWidth = watermarkMetadata.width;
      const watermarkHeight = watermarkMetadata.height;

      switch (watermark.position) {
        case 'top-left':
          top = margin;
          left = margin;
          break;
        case 'top-right':
          top = margin;
          left = imageWidth - watermarkWidth - margin;
          break;
        case 'bottom-left':
          top = imageHeight - watermarkHeight - margin;
          left = margin;
          break;
        case 'bottom-right':
        default:
          top = imageHeight - watermarkHeight - margin;
          left = imageWidth - watermarkWidth - margin;
          break;
      }

      // Composite the watermark onto the image
      image = image.composite([
        {
          input: watermarkBuffer,
          top,
          left,
          blend: 'over',
        },
      ]);
    }

    // Convert to the desired format and apply quality
    const outputFormatLower = outputFormat.toLowerCase();
    const convertedImage = await image
      .toFormat(outputFormatLower, { quality: Math.round(quality * 100) })
      .toBuffer();

    // Convert the result to base64
    const convertedImageBase64 = convertedImage.toString('base64');

    res.status(200).json({
      convertedImage: convertedImageBase64,
      format: outputFormatLower,
    });
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
