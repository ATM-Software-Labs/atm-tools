import { removeBackground } from '@imgly/background-removal';

export interface ImageEditOptions {
  brightness?: number; // -100 to 100
  contrast?: number;   // -100 to 100
  saturation?: number; // -100 to 100
  blur?: number;       // 0 to 20
  grayscale?: boolean;
  rotation?: number;   // degrees (0, 90, 180, 270)
  flipH?: boolean;
  flipV?: boolean;
}

export async function processImageRemoval(file: File): Promise<Blob> {
  const blob = await removeBackground(file);
  return blob;
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function convertSvgToImage(
  svgContent: string,
  scale: number,
  format: 'image/png' | 'image/webp' | 'image/jpeg',
  backgroundColor?: string
): Promise<Blob> {
  // Ensure the SVG has width and height attributes or viewBox
  let modifiedSvg = svgContent;
  if (!modifiedSvg.includes('xmlns="http://www.w3.org/2000/svg"')) {
    modifiedSvg = modifiedSvg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
  }

  const blob = new Blob([modifiedSvg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  try {
    const img = await loadImage(url);
    const canvas = document.createElement('canvas');
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    
    if (backgroundColor && format !== 'image/png' && format !== 'image/webp') {
       ctx.fillStyle = backgroundColor;
       ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (backgroundColor) {
       ctx.fillStyle = backgroundColor;
       ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (format === 'image/jpeg') {
       ctx.fillStyle = '#ffffff';
       ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0);
    
    return new Promise((resolve, reject) => {
      canvas.toBlob((b) => {
        if (b) resolve(b);
        else reject(new Error('Failed to create blob'));
      }, format, 1.0);
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function applyImageEdits(
  imageSource: string,
  options: ImageEditOptions,
  format: string = 'image/png',
  quality: number = 1.0
): Promise<Blob> {
  const img = await loadImage(imageSource);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Could not get canvas context');
  
  // Calculate new dimensions after rotation
  const isRotated = options.rotation === 90 || options.rotation === 270;
  canvas.width = isRotated ? img.height : img.width;
  canvas.height = isRotated ? img.width : img.height;
  
  // Apply transformations
  ctx.save();
  
  // Move to center to rotate/flip around the center
  ctx.translate(canvas.width / 2, canvas.height / 2);
  
  if (options.rotation) {
    ctx.rotate((options.rotation * Math.PI) / 180);
  }
  
  ctx.scale(options.flipH ? -1 : 1, options.flipV ? -1 : 1);
  
  // Build CSS filter
  const filters: string[] = [];
  if (options.brightness !== undefined && options.brightness !== 0) filters.push(`brightness(${100 + options.brightness}%)`);
  if (options.contrast !== undefined && options.contrast !== 0) filters.push(`contrast(${100 + options.contrast}%)`);
  if (options.saturation !== undefined && options.saturation !== 0) filters.push(`saturate(${100 + options.saturation}%)`);
  if (options.blur !== undefined && options.blur > 0) filters.push(`blur(${options.blur}px)`);
  if (options.grayscale) filters.push('grayscale(100%)');
  
  if (filters.length > 0) {
    ctx.filter = filters.join(' ');
  }
  
  // Draw image
  ctx.drawImage(img, -img.width / 2, -img.height / 2);
  ctx.restore();
  
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => {
      if (b) resolve(b);
      else reject(new Error('Failed to create blob'));
    }, format, quality);
  });
}

export async function convertImage(
  file: File,
  format: 'image/webp' | 'image/png' | 'image/jpeg' | 'image/avif',
  quality: number
): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    
    if (format === 'image/jpeg') {
       ctx.fillStyle = '#ffffff';
       ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0);
    
    return new Promise((resolve, reject) => {
      canvas.toBlob((b) => {
        if (b) resolve(b);
        else reject(new Error('Failed to convert image'));
      }, format, quality / 100);
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}
