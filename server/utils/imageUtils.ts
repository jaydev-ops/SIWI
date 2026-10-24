import crypto from 'node:crypto';
import path from 'node:path';

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
  detectedMime?: string;
  width?: number;
  height?: number;
}

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
  'image/svg+xml',
]);

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit

/**
 * Validates buffer against file size, magic bytes signature, and extracts dimensions safely.
 */
export function validateAndInspectImage(
  buffer: Buffer,
  clientMime: string,
  originalFilename: string
): ImageValidationResult {
  if (!buffer || buffer.length === 0) {
    return { isValid: false, error: 'Empty file received.' };
  }

  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File size exceeds the 10MB limit (size: ${(buffer.length / (1024 * 1024)).toFixed(2)}MB).`,
    };
  }

  const detectedMime = detectMimeFromBuffer(buffer, originalFilename);
  if (!detectedMime || !ALLOWED_MIME_TYPES.has(detectedMime)) {
    return {
      isValid: false,
      error: `Unsupported or invalid image file format. Allowed formats: JPEG, PNG, WebP, AVIF, GIF, SVG.`,
    };
  }

  const dimensions = parseDimensions(buffer, detectedMime);

  return {
    isValid: true,
    detectedMime,
    width: dimensions?.width,
    height: dimensions?.height,
  };
}

/**
 * Inspect magic bytes header to determine true MIME type
 */
export function detectMimeFromBuffer(buffer: Buffer, originalFilename: string): string | null {
  if (buffer.length < 4) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return 'image/png';
  }

  // GIF: GIF87a or GIF89a
  if (
    buffer.length >= 6 &&
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38 &&
    (buffer[4] === 0x37 || buffer[4] === 0x39) &&
    buffer[5] === 0x61
  ) {
    return 'image/gif';
  }

  // WebP: RIFF .... WEBP
  if (
    buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'image/webp';
  }

  // AVIF: ....ftypavif or ....ftypavis
  if (buffer.length >= 12 && buffer.toString('ascii', 4, 8) === 'ftyp') {
    const brand = buffer.toString('ascii', 8, 12);
    if (brand === 'avif' || brand === 'avis' || brand === 'mif1') {
      return 'image/avif';
    }
  }

  // SVG: textual XML/SVG
  const ext = path.extname(originalFilename).toLowerCase();
  if (ext === '.svg') {
    const sample = buffer.subarray(0, Math.min(buffer.length, 1024)).toString('utf8');
    if (sample.includes('<svg') || sample.includes('<?xml')) {
      return 'image/svg+xml';
    }
  }

  return null;
}

/**
 * Lightweight pure JavaScript dimension parser for images
 */
function parseDimensions(buffer: Buffer, mime: string): { width: number; height: number } | null {
  try {
    if (mime === 'image/png' && buffer.length >= 24) {
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      return { width, height };
    }

    if (mime === 'image/gif' && buffer.length >= 10) {
      const width = buffer.readUInt16LE(6);
      const height = buffer.readUInt16LE(8);
      return { width, height };
    }

    if (mime === 'image/jpeg') {
      let offset = 2;
      while (offset < buffer.length - 8) {
        if (buffer[offset] !== 0xff) {
          offset++;
          continue;
        }
        const marker = buffer[offset + 1];
        // SOF markers (Start Of Frame)
        if (
          (marker >= 0xc0 && marker <= 0xc3) ||
          (marker >= 0xc5 && marker <= 0xc7) ||
          (marker >= 0xc9 && marker <= 0xcb) ||
          (marker >= 0xcd && marker <= 0xcf)
        ) {
          const height = buffer.readUInt16BE(offset + 5);
          const width = buffer.readUInt16BE(offset + 7);
          return { width, height };
        }
        // Move to next marker
        const segmentLength = buffer.readUInt16BE(offset + 2);
        offset += 2 + segmentLength;
      }
    }

    if (mime === 'image/webp') {
      const type = buffer.toString('ascii', 12, 16);
      if (type === 'VP8 ' && buffer.length >= 30) {
        // Lossy
        const width = buffer.readUInt16LE(26) & 0x3fff;
        const height = buffer.readUInt16LE(28) & 0x3fff;
        return { width, height };
      } else if (type === 'VP8L' && buffer.length >= 25) {
        // Lossless
        const b1 = buffer[21];
        const b2 = buffer[22];
        const b3 = buffer[23];
        const b4 = buffer[24];
        const width = 1 + (((b2 & 0x3f) << 8) | b1);
        const height = 1 + ((((b4 & 0xf) << 10) | (b3 << 2) | ((b2 & 0xc0) >> 6)));
        return { width, height };
      } else if (type === 'VP8X' && buffer.length >= 30) {
        // Extended
        const width = 1 + buffer.readUIntLE(24, 3);
        const height = 1 + buffer.readUIntLE(27, 3);
        return { width, height };
      }
    }

    if (mime === 'image/svg+xml') {
      const text = buffer.toString('utf8', 0, Math.min(buffer.length, 2048));
      const viewBoxMatch = text.match(/viewBox\s*=\s*["']([\d.\s,-]+)["']/i);
      if (viewBoxMatch) {
        const parts = viewBoxMatch[1].trim().split(/[\s,]+/);
        if (parts.length === 4) {
          const w = parseFloat(parts[2]);
          const h = parseFloat(parts[3]);
          if (!isNaN(w) && !isNaN(h)) return { width: Math.round(w), height: Math.round(h) };
        }
      }
      const widthMatch = text.match(/width\s*=\s*["'](\d+(?:\.\d+)?)["']/i);
      const heightMatch = text.match(/height\s*=\s*["'](\d+(?:\.\d+)?)["']/i);
      if (widthMatch && heightMatch) {
        return { width: Math.round(parseFloat(widthMatch[1])), height: Math.round(parseFloat(heightMatch[1])) };
      }
    }
  } catch {
    // If parsing fails, proceed without dimension data
  }
  return null;
}

/**
 * Generate cryptographically secure storage key
 */
export function generateStorageKey(originalFilename: string, prefix = 'products'): string {
  const ext = path.extname(originalFilename).toLowerCase() || '.jpg';
  const cleanExt = ext.replace(/[^a-z0-9.]/g, '');
  const timestamp = Date.now();
  const random = crypto.randomBytes(8).toString('hex');
  return `${prefix}/${timestamp}-${random}${cleanExt}`;
}
