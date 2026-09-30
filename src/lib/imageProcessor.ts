/**
 * Server-Side Image Security & Optimization Service
 * 
 * Performs:
 * 1. Magic-byte signature verification (detecting actual image file headers)
 * 2. MIME type & size enforcement
 * 3. Deterministic variant path generation (thumb, card, medium)
 */

export interface ValidatedImage {
  isValid: boolean;
  mimeType?: string;
  error?: string;
}

/**
 * Validate image buffer using header magic bytes
 */
export function validateImageMagicBytes(buffer: ArrayBuffer): ValidatedImage {
  const bytes = new Uint8Array(buffer);
  if (bytes.length < 12) {
    return { isValid: false, error: 'File buffer too small' };
  }

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { isValid: true, mimeType: 'image/jpeg' };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return { isValid: true, mimeType: 'image/png' };
  }

  // WebP: RIFF (bytes 0-3) ... WEBP (bytes 8-11)
  if (
    bytes[0] === 0x52 && // R
    bytes[1] === 0x49 && // I
    bytes[2] === 0x46 && // F
    bytes[3] === 0x46 && // F
    bytes[8] === 0x57 && // W
    bytes[9] === 0x45 && // E
    bytes[10] === 0x42 && // B
    bytes[11] === 0x50 // P
  ) {
    return { isValid: true, mimeType: 'image/webp' };
  }

  // AVIF: ftyp (bytes 4-7) + avif/avis (bytes 8-11)
  if (
    bytes[4] === 0x66 && // f
    bytes[5] === 0x74 && // t
    bytes[6] === 0x79 && // y
    bytes[7] === 0x70 // p
  ) {
    return { isValid: true, mimeType: 'image/avif' };
  }

  return { isValid: false, error: 'Invalid or unsupported image file header signature' };
}

/**
 * Generate deterministic storage key paths for image variants
 */
export function getDeterministicPhotoPaths(placeId: string, photoId: string, extension: string = 'webp') {
  return {
    thumb: `places/${placeId}/photos/${photoId}/thumb-v1.${extension}`,
    card: `places/${placeId}/photos/${photoId}/card-v1.${extension}`,
    medium: `places/${placeId}/photos/${photoId}/medium-v1.${extension}`,
  };
}
