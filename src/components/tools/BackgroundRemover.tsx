import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Label } from '../ui';
import { Download, Eraser, Image as ImageIcon, Sparkles, Sliders } from 'lucide-react';
import { processImageRemoval, downloadBlob, loadImage } from '../../utils/image';
import { cn } from '../../utils/cn';

type BgMode = 'transparent' | 'color' | 'blur';

export function BackgroundRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  
  const [resultBlob, setResultBlob] = useState<Blob | null>(null); // Only the subject
  const [finalDataUrl, setFinalDataUrl] = useState<string>('');    // Merged result
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const [mode, setMode] = useState<BgMode>('transparent');
  const [color, setColor] = useState('#0f172a');
  const [blurAmount, setBlurAmount] = useState(10);
  const [trim, setTrim] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    
    setFile(f);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(f));
    setResultBlob(null);
    setFinalDataUrl('');
  };

  const handleRemoveBackground = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(10);
    
    try {
      const interval = setInterval(() => setProgress(p => Math.min(p + 5, 90)), 500);
      const blob = await processImageRemoval(file);
      clearInterval(interval);
      setProgress(100);
      setResultBlob(blob);
    } catch (error) {
      console.error(error);
      alert('Error removing background. Ensure the image is valid.');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  // Re-render canvas when options or result changes
  useEffect(() => {
    if (!resultBlob || !file) return;
    renderFinalImage();
  }, [resultBlob, mode, color, blurAmount, trim]);

  const renderFinalImage = async () => {
    if (!resultBlob || !preview) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const originalImg = await loadImage(preview);
      const subjectUrl = URL.createObjectURL(resultBlob);
      const subjectImg = await loadImage(subjectUrl);

      canvas.width = originalImg.width;
      canvas.height = originalImg.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (mode === 'color') {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (mode === 'blur') {
        ctx.save();
        ctx.filter = `blur(${blurAmount}px) saturate(1.2)`;
        ctx.drawImage(originalImg, 0, 0);
        ctx.restore();
      }

      ctx.drawImage(subjectImg, 0, 0);
      URL.revokeObjectURL(subjectUrl);

      // Trimming logic
      if (trim) {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const { data, width, height } = imgData;
        let minX = width, minY = height, maxX = 0, maxY = 0;
        
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const alpha = data[(y * width + x) * 4 + 3];
            if (alpha > 10) { // not transparent
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }
        
        if (maxX >= minX && maxY >= minY) {
          const trimW = maxX - minX + 1;
          const trimH = maxY - minY + 1;
          const trimmed = ctx.getImageData(minX, minY, trimW, trimH);
          canvas.width = trimW;
          canvas.height = trimH;
          ctx.putImageData(trimmed, 0, 0);
        }
      }

      setFinalDataUrl(canvas.toDataURL('image/png'));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownload = () => {
    if (!finalDataUrl || !file) return;
    // Convert data url to blob
    fetch(finalDataUrl)
      .then(res => res.blob())
      .then(blob => {
        const originalName = file.name.split('.')[0];
        downloadBlob(blob, `${originalName}_atm.png`);
      });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif text-slate-100 mb-2">AI Background Remover</h2>
        <p className="text-slate-400 font-mono text-xs">100% on-device neural network. No data leaves your browser.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 flex flex-col items-center justify-center min-h-[500px]">
          {!file ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-sky-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-sky-400 border border-sky-500/20">
                <Sparkles size={24} />
              </div>
              <p className="text-slate-300 font-medium mb-1">Upload an image to remove background</p>
              <p className="text-slate-500 text-sm mb-6">Works best with clear subjects</p>
              <Button onClick={() => fileInputRef.current?.click()} className="px-8">
                Select Image
              </Button>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center max-w-4xl mx-auto h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-8 h-full">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-mono text-slate-500 text-center uppercase tracking-widest">Original</span>
                  <div className="flex-1 rounded-xl overflow-hidden bg-slate-900/50 border border-slate-800 flex items-center justify-center p-2 min-h-[300px]">
                    <img src={preview} alt="Original" className="max-w-full max-h-full object-contain rounded-lg" />
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-mono text-sky-500 text-center uppercase tracking-widest">Result</span>
                  <div 
                    className="flex-1 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center p-2 relative"
                    style={{ 
                      backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h10v10H0zm10 10h10v10H10z\' fill=\'%231e293b\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
                      backgroundRepeat: 'repeat'
                    }}
                  >
                    {finalDataUrl ? (
                      <img src={finalDataUrl} alt="Result" className="max-w-full max-h-full object-contain relative z-10 drop-shadow-2xl" />
                    ) : (
                      <div className="text-slate-500 flex flex-col items-center">
                        {isProcessing ? (
                          <>
                            <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
                              <div className="h-full bg-sky-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                            </div>
                            <span className="text-sm font-medium text-slate-300">Inference Running...</span>
                            <span className="text-[10px] text-slate-500 font-mono mt-1">Downloading WASM chunks (first run only)</span>
                          </>
                        ) : (
                          <div className="flex flex-col items-center text-slate-600">
                            <ImageIcon size={32} className="mb-2 opacity-50" />
                            <span className="text-sm font-medium">Ready to process</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-auto">
                <Button variant="outline" onClick={() => setFile(null)}>Start Over</Button>
                {!resultBlob ? (
                  <Button onClick={handleRemoveBackground} disabled={isProcessing} className="min-w-[200px]">
                    <Sparkles size={16} /> {isProcessing ? 'Processing AI...' : 'Remove Background'}
                  </Button>
                ) : (
                  <Button onClick={handleDownload} className="bg-emerald-600 hover:bg-emerald-500 text-white border-transparent">
                    <Download size={16} /> Download Result
                  </Button>
                )}
              </div>
            </div>
          )}
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          
          {/* Hidden canvas for composition */}
          <canvas ref={canvasRef} className="hidden" />
        </Card>

        {/* Sidebar Options */}
        <Card className={cn("p-4 space-y-6 transition-opacity", !resultBlob ? "opacity-50 pointer-events-none" : "opacity-100")}>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">
            <Sliders size={16} className="text-sky-400" /> Output Modes
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-xs">Background Mode</Label>
              <div className="grid grid-cols-1 gap-2 mt-2">
                <button 
                  onClick={() => setMode('transparent')}
                  className={cn("text-xs py-2 px-3 rounded-md border text-left transition-colors", mode === 'transparent' ? "bg-sky-900/30 border-sky-500/50 text-sky-400" : "bg-[#0a0d14] border-slate-800 text-slate-400")}
                >
                  Transparent (PNG)
                </button>
                <button 
                  onClick={() => setMode('color')}
                  className={cn("text-xs py-2 px-3 rounded-md border text-left transition-colors", mode === 'color' ? "bg-sky-900/30 border-sky-500/50 text-sky-400" : "bg-[#0a0d14] border-slate-800 text-slate-400")}
                >
                  Solid Color
                </button>
                <button 
                  onClick={() => setMode('blur')}
                  className={cn("text-xs py-2 px-3 rounded-md border text-left transition-colors", mode === 'blur' ? "bg-sky-900/30 border-sky-500/50 text-sky-400" : "bg-[#0a0d14] border-slate-800 text-slate-400")}
                >
                  Blur Original
                </button>
              </div>
            </div>

            {mode === 'color' && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <Label className="text-xs">Select Color</Label>
                <div className="flex gap-2 mt-1">
                  <input type="color" value={color} onChange={e => setColor(e.target.value)} className="h-8 w-8 rounded cursor-pointer bg-transparent border-0 p-0" />
                  <input type="text" value={color} onChange={e => setColor(e.target.value)} className="h-8 text-xs px-2 flex-1 font-mono bg-[#0a0d14] border border-slate-800 rounded-md text-slate-300 focus:outline-none focus:border-sky-500" />
                </div>
              </div>
            )}

            {mode === 'blur' && (
              <div className="animate-in fade-in slide-in-from-top-2 space-y-1">
                <Label className="text-xs flex justify-between">Blur Intensity <span>{blurAmount}px</span></Label>
                <input type="range" min="1" max="50" value={blurAmount} onChange={e => setBlurAmount(Number(e.target.value))} className="w-full accent-sky-500 h-1" />
              </div>
            )}

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <Label className="text-xs mb-0">Trim Transparency</Label>
                <p className="text-[10px] text-slate-500">Auto-crop empty space</p>
              </div>
              <button 
                className={cn("w-10 h-5 rounded-full transition-colors relative", trim ? "bg-sky-500" : "bg-slate-700")}
                onClick={() => setTrim(!trim)}
              >
                <div className={cn("w-3 h-3 rounded-full bg-white absolute top-1 transition-transform", trim ? "translate-x-6" : "translate-x-1")} />
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
