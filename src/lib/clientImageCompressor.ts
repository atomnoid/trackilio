/**
 * Client-Side Image Compressor & Responsive Variant Generator
 * 
 * Resizes and compresses user-selected images in the browser using Canvas
 * before uploading to Supabase, saving mobile bandwidth & storage costs.
 */

export interface CompressedVariants {
  thumbBlob: Blob;
  cardBlob: Blob;
  mediumBlob: Blob;
  width: number;
  height: number;
  aspectRatio: number;
}

/**
 * Resize HTML Image to canvas and export compressed WebP Blob
 */
function resizeToBlob(
  img: HTMLImageElement,
  maxDimension: number,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    let { width, height } = img;

    if (width > maxDimension || height > maxDimension) {
      if (width > height) {
        height = Math.round((height * maxDimension) / width);
        width = maxDimension;
      } else {
        width = Math.round((width * maxDimension) / height);
        height = maxDimension;
      }
    }

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return reject(new Error('Failed to create canvas 2d context'));
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas WebP encoding failed'));
        }
      },
      'image/webp',
      quality
    );
  });
}

/**
 * Process raw File into 3 WebP variants: Thumbnail, Card, and Medium
 */
export async function compressImageVariants(file: File): Promise<CompressedVariants> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = async () => {
        try {
          const width = img.naturalWidth || img.width;
          const height = img.naturalHeight || img.height;
          const aspectRatio = parseFloat((width / (height || 1)).toFixed(2));

          // Generate 3 variants:
          // Thumbnail: ~240px, quality 0.75 (~30-60KB)
          // Card: ~640px, quality 0.80 (~80-150KB)
          // Medium: ~1100px, quality 0.85 (~150-350KB)
          const [thumbBlob, cardBlob, mediumBlob] = await Promise.all([
            resizeToBlob(img, 240, 0.75),
            resizeToBlob(img, 640, 0.80),
            resizeToBlob(img, 1100, 0.85),
          ]);

          resolve({
            thumbBlob,
            cardBlob,
            mediumBlob,
            width,
            height,
            aspectRatio,
          });
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => reject(new Error('Invalid image file'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}
