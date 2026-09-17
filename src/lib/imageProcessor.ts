import sharp from "sharp";

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: "jpeg" | "png" | "webp" | "avif";
}

/**
 * Server-side image optimization pipeline using sharp.
 * Resizes, compresses, and converts uploaded product photos and swatch scans.
 */
export async function optimizeImageBuffer(
  buffer: Buffer,
  options: ImageOptimizationOptions = {}
): Promise<{ data: Buffer; format: string; width?: number; height?: number }> {
  const {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 82,
    format = "webp",
  } = options;

  let pipeline = sharp(buffer)
    .rotate() // auto-orient based on EXIF
    .resize(maxWidth, maxHeight, {
      fit: "inside",
      withoutEnlargement: true,
    });

  if (format === "webp") {
    pipeline = pipeline.webp({ quality });
  } else if (format === "jpeg") {
    pipeline = pipeline.jpeg({ quality, mozjpeg: true });
  } else if (format === "png") {
    pipeline = pipeline.png({ compressionLevel: 8 });
  } else if (format === "avif") {
    pipeline = pipeline.avif({ quality });
  }

  const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });

  return {
    data,
    format: info.format,
    width: info.width,
    height: info.height,
  };
}

/**
 * Optimizes a base64 encoded image string.
 */
export async function optimizeBase64Image(
  base64Data: string,
  options: ImageOptimizationOptions = {}
): Promise<string> {
  const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, "");
  const inputBuffer = Buffer.from(cleanBase64, "base64");
  const optimized = await optimizeImageBuffer(inputBuffer, options);
  return `data:image/${optimized.format};base64,${optimized.data.toString("base64")}`;
}
