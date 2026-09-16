import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Label } from '../ui';
import { Upload, Download, RotateCw, FlipHorizontal, FlipVertical } from 'lucide-react';
import { applyImageEdits, downloadBlob } from '../../utils/image';
import type { ImageEditOptions } from '../../utils/image';
import { cn } from '../../utils/cn';

export function QuickEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  
  const [options, setOptions] = useState<ImageEditOptions>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    blur: 0,
    grayscale: false,
    rotation: 0,
    flipH: false,
    flipV: false
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (file && previewUrl) {
      // Debounce the processing slightly
      const timer = setTimeout(() => {
        applyImageEdits(previewUrl, options, 'image/png', 1.0)
          .then(blob => setResultBlob(blob))
          .catch(err => console.error(err));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [options, file, previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    
    setFile(f);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(f));
    
    // Reset options
    setOptions({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      blur: 0,
      grayscale: false,
      rotation: 0,
      flipH: false,
      flipV: false
    });
  };

  const updateOption = (key: keyof ImageEditOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleRotate = () => {
    setOptions(prev => ({ ...prev, rotation: ((prev.rotation || 0) + 90) % 360 }));
  };

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    const originalName = file.name.split('.')[0];
    downloadBlob(resultBlob, `${originalName}_edited.png`);
  };

  // Build the filter CSS for preview
  const getFilterStyle = () => {
    const filters: string[] = [];
    if (options.brightness !== 0) filters.push(`brightness(${100 + (options.brightness || 0)}%)`);
    if (options.contrast !== 0) filters.push(`contrast(${100 + (options.contrast || 0)}%)`);
    if (options.saturation !== 0) filters.push(`saturate(${100 + (options.saturation || 0)}%)`);
    if (options.blur !== 0) filters.push(`blur(${options.blur}px)`);
    if (options.grayscale) filters.push('grayscale(100%)');
    return filters.join(' ');
  };

  const getTransformStyle = () => {
    let transform = '';
    if (options.rotation) transform += `rotate(${options.rotation}deg) `;
    if (options.flipH) transform += `scaleX(-1) `;
    if (options.flipV) transform += `scaleY(-1) `;
    return transform;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif text-slate-100 mb-2">Quick Image Editor</h2>
        <p className="text-slate-400">Fast adjustments, rotation, and filters directly in your browser.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 flex flex-col items-center justify-center min-h-[500px]">
          {!file ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Upload size={24} />
              </div>
              <p className="text-slate-300 font-medium mb-1">Upload image to edit</p>
              <Button onClick={() => fileInputRef.current?.click()} className="mt-4">
                Select Image
              </Button>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col relative overflow-hidden">
              <div className="flex-1 flex items-center justify-center bg-slate-900/30 rounded-xl border border-slate-800 p-4 mb-4 relative overflow-hidden" style={{ minHeight: '400px' }}>
                {/* CSS preview for instant feedback before canvas rendering completes */}
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-w-full max-h-full object-contain transition-transform duration-200"
                  style={{
                    filter: getFilterStyle(),
                    transform: getTransformStyle()
                  }}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <Button variant="outline" size="sm" onClick={() => setFile(null)}>Close</Button>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={handleRotate} title="Rotate 90°">
                    <RotateCw size={16} />
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => updateOption('flipH', !options.flipH)} title="Flip Horizontal">
                    <FlipHorizontal size={16} />
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => updateOption('flipV', !options.flipV)} title="Flip Vertical">
                    <FlipVertical size={16} />
                  </Button>
                </div>
                <Button size="sm" onClick={handleDownload} className="bg-emerald-600 hover:bg-emerald-500">
                  <Download size={16} /> Download
                </Button>
              </div>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
        </Card>

        <Card className="flex flex-col gap-6">
          <h3 className="text-lg font-medium text-slate-200 border-b border-slate-800 pb-3">Adjustments</h3>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="flex justify-between">
                <span>Brightness</span>
                <span className="text-sky-400">{options.brightness}</span>
              </Label>
              <input 
                type="range" min="-100" max="100" 
                value={options.brightness}
                onChange={(e) => updateOption('brightness', parseInt(e.target.value))}
                className="w-full accent-sky-500" disabled={!file}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="flex justify-between">
                <span>Contrast</span>
                <span className="text-sky-400">{options.contrast}</span>
              </Label>
              <input 
                type="range" min="-100" max="100" 
                value={options.contrast}
                onChange={(e) => updateOption('contrast', parseInt(e.target.value))}
                className="w-full accent-sky-500" disabled={!file}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="flex justify-between">
                <span>Saturation</span>
                <span className="text-sky-400">{options.saturation}</span>
              </Label>
              <input 
                type="range" min="-100" max="100" 
                value={options.saturation}
                onChange={(e) => updateOption('saturation', parseInt(e.target.value))}
                className="w-full accent-sky-500" disabled={!file}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex justify-between">
                <span>Blur</span>
                <span className="text-sky-400">{options.blur}px</span>
              </Label>
              <input 
                type="range" min="0" max="20" 
                value={options.blur}
                onChange={(e) => updateOption('blur', parseInt(e.target.value))}
                className="w-full accent-sky-500" disabled={!file}
              />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <Label className="mb-0">Grayscale</Label>
              <button 
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  options.grayscale ? "bg-sky-500" : "bg-slate-700"
                )}
                onClick={() => updateOption('grayscale', !options.grayscale)}
                disabled={!file}
              >
                <div className={cn(
                  "w-4 h-4 rounded-full bg-white absolute top-1 transition-transform",
                  options.grayscale ? "translate-x-7" : "translate-x-1"
                )} />
              </button>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => setOptions({
                brightness: 0, contrast: 0, saturation: 0, blur: 0,
                grayscale: false, rotation: 0, flipH: false, flipV: false
              })}
              disabled={!file}
            >
              Reset All
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
