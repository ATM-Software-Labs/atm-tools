import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, Button, Label } from '../ui';
import { Upload, Download, Settings, Trash2, Archive, FileArchive, Zap } from 'lucide-react';
import { convertSvgToImage, downloadBlob } from '../../utils/image';
import { compressImageSmart, createZip, type FileItem } from '../../utils/compress';
import { cn } from '../../utils/cn';

export function UniversalConverter() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [format, setFormat] = useState<'image/png' | 'image/webp' | 'image/jpeg' | 'image/avif'>('image/webp');
  const [quality, setQuality] = useState<number>(80);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup object URLs on unmount or file removal
  useEffect(() => {
    return () => {
      files.forEach(f => {
        if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
      });
    };
  }, []);

  const handleFilesAdded = (newFiles: FileList | File[]) => {
    const newItems: FileItem[] = Array.from(newFiles).map(file => ({
      id: Math.random().toString(36).substring(7),
      originalFile: file,
      originalSize: file.size,
      resultBlob: null,
      resultSize: null,
      status: 'pending',
      progress: 0,
      previewUrl: URL.createObjectURL(file),
      type: file.type === 'image/svg+xml' || file.name.endsWith('.svg') ? 'svg' : 'image'
    }));

    setFiles(prev => [...prev, ...newItems]);
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
    }
  }, []);

  const removeFile = (id: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file?.previewUrl) URL.revokeObjectURL(file.previewUrl);
      return prev.filter(f => f.id !== id);
    });
  };

  const clearAll = () => {
    files.forEach(f => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    });
    setFiles([]);
  };

  const processAll = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    
    const updatedFiles = [...files];
    
    for (let i = 0; i < updatedFiles.length; i++) {
      const item = updatedFiles[i];
      if (item.status === 'done') continue;
      
      // Update status to processing
      setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'processing', progress: 20 } : f));
      
      try {
        let result: Blob;
        if (item.type === 'svg') {
          const text = await item.originalFile.text();
          result = await convertSvgToImage(text, 2, format as any);
        } else {
          // Use smart compression
          // Since browser-image-compression doesn't support avif natively easily, fallback logic is there
          result = await compressImageSmart(item.originalFile, format as any, quality / 100);
        }
        
        setFiles(prev => prev.map(f => f.id === item.id ? { 
          ...f, 
          status: 'done', 
          resultBlob: result,
          resultSize: result.size,
          progress: 100
        } : f));
      } catch (error) {
        console.error(error);
        setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'error' } : f));
      }
    }
    
    setIsProcessing(false);
  };

  const downloadFile = (item: FileItem) => {
    if (!item.resultBlob) return;
    const ext = format.split('/')[1];
    const originalName = item.originalFile.name.split('.')[0];
    downloadBlob(item.resultBlob, `${originalName}_optimized.${ext}`);
  };

  const downloadZip = async () => {
    const doneFiles = files.filter(f => f.status === 'done' && f.resultBlob);
    if (doneFiles.length === 0) return;
    
    setIsProcessing(true);
    try {
      const ext = format.split('/')[1];
      const zipFiles = doneFiles.map(f => ({
        name: `${f.originalFile.name.split('.')[0]}_opt.${ext}`,
        blob: f.resultBlob!
      }));
      
      const zipBlob = await createZip(zipFiles);
      downloadBlob(zipBlob, `atm_tools_optimized_${Date.now()}.zip`);
    } catch (error) {
      console.error(error);
      alert('Error creating ZIP');
    } finally {
      setIsProcessing(false);
    }
  };

  const getSavingsPercentage = (original: number, result: number) => {
    if (!result || original <= 0) return 0;
    return Math.round(((original - result) / original) * 100);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif text-slate-100 mb-2">Smart Compress & Convert</h2>
        <p className="text-slate-400 font-mono text-xs">Massive local optimization engine. Zero server uploads.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 flex flex-col min-h-[500px]">
          
          <div 
            className="w-full border-2 border-dashed border-slate-700/50 hover:border-sky-500/50 transition-colors rounded-xl p-8 flex flex-col items-center justify-center bg-[#0a0d14]/30 mb-6 cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 bg-sky-900/20 rounded-full flex items-center justify-center mb-4 text-sky-400">
              <Upload size={24} />
            </div>
            <p className="text-slate-200 font-medium mb-1">Click or drag & drop files here</p>
            <p className="text-slate-500 text-xs font-mono mb-4">SVG, PNG, JPG, WEBP • Max 100MB total</p>
            <Button size="sm" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
              Browse Files
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
            {files.map(file => (
              <div key={file.id} className="flex items-center gap-4 p-3 bg-slate-900/50 border border-slate-800/80 rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                  <img src={file.previewUrl} alt="preview" className="max-w-full max-h-full object-cover" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{file.originalFile.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono text-slate-500">{(file.originalSize / 1024).toFixed(1)} KB</span>
                    
                    {file.status === 'processing' && (
                      <span className="text-xs text-sky-400 flex items-center gap-1"><Zap size={10} /> Processing...</span>
                    )}
                    
                    {file.status === 'done' && file.resultSize && (
                      <>
                        <span className="text-slate-600">→</span>
                        <span className="text-xs font-mono text-emerald-400">{(file.resultSize / 1024).toFixed(1)} KB</span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">
                          -{getSavingsPercentage(file.originalSize, file.resultSize)}%
                        </span>
                      </>
                    )}
                    
                    {file.status === 'error' && (
                      <span className="text-xs text-red-400">Failed</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {file.status === 'done' ? (
                    <button 
                      onClick={() => downloadFile(file)}
                      className="p-2 text-sky-400 hover:bg-sky-400/10 rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download size={18} />
                    </button>
                  ) : (
                    <button 
                      onClick={() => removeFile(file.id)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {files.length === 0 && (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-slate-500">No files selected</p>
              </div>
            )}
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*,.svg" 
            multiple
            onChange={(e) => {
              if (e.target.files) handleFilesAdded(e.target.files);
              e.target.value = ''; // reset
            }} 
          />
        </Card>

        <Card className="flex flex-col gap-6">
          <div className="flex items-center gap-2 text-slate-200 font-medium border-b border-slate-800/80 pb-3">
            <Settings size={18} className="text-sky-400" />
            <h3>Optimization Settings</h3>
          </div>

          <div className="space-y-5">
            <div>
              <Label>Output Format</Label>
              <select 
                className="w-full bg-[#0a0d14] border border-slate-800 rounded-lg px-3 py-2 text-sm font-medium text-slate-200 focus:outline-none focus:border-sky-500 transition-colors mt-1"
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                disabled={isProcessing}
              >
                <option value="image/webp">WebP (Recommended)</option>
                <option value="image/jpeg">JPEG</option>
                <option value="image/png">PNG</option>
              </select>
              <p className="text-[10px] text-slate-500 mt-1 font-mono">WebP offers best compression ratio</p>
            </div>

            <div>
              <Label className="flex justify-between">
                <span>Quality / Compression</span>
                <span className="text-sky-400 font-mono text-xs">{quality}%</span>
              </Label>
              <input 
                type="range" 
                min="1" 
                max="100" 
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
                className="w-full accent-sky-500 mt-2"
                disabled={isProcessing}
              />
            </div>

            <div className="pt-4 border-t border-slate-800/80 space-y-3">
              <Button 
                className="w-full" 
                onClick={processAll} 
                disabled={files.length === 0 || isProcessing || files.every(f => f.status === 'done')}
              >
                <Zap size={16} />
                {isProcessing ? 'Optimizing...' : 'Smart Compress All'}
              </Button>
              
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  className="flex-1" 
                  onClick={downloadZip}
                  disabled={!files.some(f => f.status === 'done') || isProcessing}
                >
                  <FileArchive size={16} /> Zip All
                </Button>
                <Button 
                  variant="outline"
                  onClick={clearAll}
                  disabled={files.length === 0 || isProcessing}
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
