import JSZip from 'jszip';
import imageCompression from 'browser-image-compression';
import { convertSvgToImage, convertImage } from './image';

export interface FileItem {
  id: string;
  originalFile: File;
  originalSize: number;
  resultBlob: Blob | null;
  resultSize: number | null;
  status: 'pending' | 'processing' | 'done' | 'error';
  progress: number;
  previewUrl: string;
  type: 'svg' | 'image';
}

export async function compressImageSmart(file: File, targetFormat: 'image/webp' | 'image/jpeg' | 'image/png', quality: number = 0.8): Promise<Blob> {
  const options = {
    maxSizeMB: 5,
    maxWidthOrHeight: 4096,
    useWebWorker: true,
    fileType: targetFormat,
    initialQuality: quality,
    alwaysKeepResolution: true
  };
  
  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    // Fallback to canvas
    return convertImage(file, targetFormat as any, quality * 100);
  }
}

export async function createZip(files: { name: string, blob: Blob }[]): Promise<Blob> {
  const zip = new JSZip();
  
  files.forEach(file => {
    zip.file(file.name, file.blob);
  });
  
  return await zip.generateAsync({ type: 'blob' });
}
