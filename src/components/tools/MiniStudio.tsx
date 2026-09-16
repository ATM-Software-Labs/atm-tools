import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Label, Input } from '../ui';
import { Upload, Download, Type, Image as ImageIcon, Layout, SlidersHorizontal, MousePointer2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { downloadBlob } from '../../utils/image';

const PRESETS = [
  { name: 'Custom', width: 800, height: 600 },
  { name: 'Favicon', width: 512, height: 512 },
  { name: 'YouTube Thumbnail', width: 1280, height: 720 },
  { name: 'X/Twitter Header', width: 1500, height: 500 },
  { name: 'Instagram Post', width: 1080, height: 1080 },
];

export function MiniStudio() {
  const [preset, setPreset] = useState(PRESETS[0]);
  const [customW, setCustomW] = useState(800);
  const [customH, setCustomH] = useState(600);
  
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const [imageProps, setImageProps] = useState({ scale: 1, x: 0, y: 0, rotate: 0 });
  
  const [watermark, setWatermark] = useState('ATM Labs');
  const [wmOpacity, setWmOpacity] = useState(0.5);
  const [wmSize, setWmSize] = useState(48);
  
  const [filter, setFilter] = useState({ brightness: 100, contrast: 100, blur: 0, grayscale: 0 });
  const [bgColor, setBgColor] = useState('#0f172a');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = preset.name === 'Custom' ? customW : preset.width;
    const h = preset.name === 'Custom' ? customH : preset.height;
    
    canvas.width = w;
    canvas.height = h;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);

    // Image
    if (imageObj) {
      ctx.save();
      // Apply filters
      ctx.filter = `brightness(${filter.brightness}%) contrast(${filter.contrast}%) blur(${filter.blur}px) grayscale(${filter.grayscale}%)`;
      
      // Transform
      ctx.translate(w / 2 + imageProps.x, h / 2 + imageProps.y);
      ctx.rotate((imageProps.rotate * Math.PI) / 180);
      ctx.scale(imageProps.scale, imageProps.scale);
      
      ctx.drawImage(imageObj, -imageObj.width / 2, -imageObj.height / 2);
      ctx.restore();
    }

    // Watermark
    if (watermark) {
      ctx.save();
      ctx.globalAlpha = wmOpacity;
      ctx.font = `bold ${wmSize}px sans-serif`;
      ctx.fillStyle = 'white';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      // Add subtle drop shadow
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fillText(watermark, w - 20, h - 20);
      ctx.restore();
    }
  };

  useEffect(() => {
    drawCanvas();
  }, [preset, customW, customH, imageObj, imageProps, watermark, wmOpacity, wmSize, filter, bgColor]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImageObj(img);
      // Auto-scale to fit
      const w = preset.name === 'Custom' ? customW : preset.width;
      const h = preset.name === 'Custom' ? customH : preset.height;
      const scaleX = w / img.width;
      const scaleY = h / img.height;
      const scale = Math.min(scaleX, scaleY) * 0.9;
      setImageProps({ scale, x: 0, y: 0, rotate: 0 });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const handleDownload = (format: 'image/png' | 'image/jpeg') => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (blob) downloadBlob(blob, `studio_export_${Date.now()}.${format === 'image/png' ? 'png' : 'jpg'}`);
    }, format, 0.9);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif text-slate-100 mb-2">Mini Studio Editor</h2>
        <p className="text-slate-400 font-mono text-xs">Canvas-based design tool for quick creatives and mockups.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar Controls */}
        <div className="space-y-4">
          <Card className="p-4 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-3 border-b border-slate-800 pb-2"><Layout size={16} className="text-sky-400" /> Format</h3>
            
            <div className="space-y-2">
              <Label className="text-xs">Preset</Label>
              <select 
                className="w-full bg-[#0a0d14] border border-slate-800 rounded-md px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                value={preset.name}
                onChange={(e) => setPreset(PRESETS.find(p => p.name === e.target.value) || PRESETS[0])}
              >
                {PRESETS.map(p => <option key={p.name} value={p.name}>{p.name} ({p.width}x{p.height})</option>)}
              </select>
            </div>

            {preset.name === 'Custom' && (
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label className="text-xs">Width</Label>
                  <Input type="number" value={customW} onChange={e => setCustomW(Number(e.target.value))} className="h-8 text-xs px-2" />
                </div>
                <div className="flex-1">
                  <Label className="text-xs">Height</Label>
                  <Input type="number" value={customH} onChange={e => setCustomH(Number(e.target.value))} className="h-8 text-xs px-2" />
                </div>
              </div>
            )}
            
            <div>
              <Label className="text-xs">Background Color</Label>
              <div className="flex gap-2">
                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="h-8 w-8 rounded cursor-pointer bg-transparent border-0 p-0" />
                <Input value={bgColor} onChange={e => setBgColor(e.target.value)} className="h-8 text-xs px-2 flex-1 font-mono" />
              </div>
            </div>
          </Card>

          <Card className="p-4 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-3 border-b border-slate-800 pb-2"><ImageIcon size={16} className="text-sky-400" /> Image Layer</h3>
            
            <Button size="sm" variant="secondary" className="w-full text-xs" onClick={() => fileInputRef.current?.click()}>
              <Upload size={14} /> {imageObj ? 'Change Image' : 'Upload Image'}
            </Button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

            {imageObj && (
              <div className="space-y-3 pt-2">
                <div>
                  <Label className="text-[10px] flex justify-between">Scale <span>{imageProps.scale.toFixed(2)}x</span></Label>
                  <input type="range" min="0.1" max="3" step="0.1" value={imageProps.scale} onChange={e => setImageProps(p => ({...p, scale: Number(e.target.value)}))} className="w-full accent-sky-500 h-1" />
                </div>
                <div>
                  <Label className="text-[10px] flex justify-between">Rotate <span>{imageProps.rotate}°</span></Label>
                  <input type="range" min="-180" max="180" value={imageProps.rotate} onChange={e => setImageProps(p => ({...p, rotate: Number(e.target.value)}))} className="w-full accent-sky-500 h-1" />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label className="text-[10px]">Pos X</Label>
                    <Input type="number" value={imageProps.x} onChange={e => setImageProps(p => ({...p, x: Number(e.target.value)}))} className="h-7 text-xs px-2" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-[10px]">Pos Y</Label>
                    <Input type="number" value={imageProps.y} onChange={e => setImageProps(p => ({...p, y: Number(e.target.value)}))} className="h-7 text-xs px-2" />
                  </div>
                </div>
              </div>
            )}
          </Card>
          
          <Card className="p-4 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-3 border-b border-slate-800 pb-2"><SlidersHorizontal size={16} className="text-sky-400" /> Filters</h3>
            <div className="space-y-2">
              <Label className="text-[10px] flex justify-between">Brightness <span>{filter.brightness}%</span></Label>
              <input type="range" min="0" max="200" value={filter.brightness} onChange={e => setFilter(f => ({...f, brightness: Number(e.target.value)}))} className="w-full accent-sky-500 h-1" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] flex justify-between">Contrast <span>{filter.contrast}%</span></Label>
              <input type="range" min="0" max="200" value={filter.contrast} onChange={e => setFilter(f => ({...f, contrast: Number(e.target.value)}))} className="w-full accent-sky-500 h-1" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] flex justify-between">Grayscale <span>{filter.grayscale}%</span></Label>
              <input type="range" min="0" max="100" value={filter.grayscale} onChange={e => setFilter(f => ({...f, grayscale: Number(e.target.value)}))} className="w-full accent-sky-500 h-1" />
            </div>
          </Card>
          
          <Card className="p-4 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-3 border-b border-slate-800 pb-2"><Type size={16} className="text-sky-400" /> Watermark</h3>
            <div>
              <Label className="text-xs">Text</Label>
              <Input value={watermark} onChange={e => setWatermark(e.target.value)} className="h-8 text-xs px-2" />
            </div>
            <div className="flex gap-2">
              <div className="flex-1 space-y-1">
                <Label className="text-[10px]">Opacity</Label>
                <input type="range" min="0" max="1" step="0.1" value={wmOpacity} onChange={e => setWmOpacity(Number(e.target.value))} className="w-full accent-sky-500 h-1" />
              </div>
              <div className="flex-1 space-y-1">
                <Label className="text-[10px]">Size</Label>
                <input type="range" min="12" max="120" value={wmSize} onChange={e => setWmSize(Number(e.target.value))} className="w-full accent-sky-500 h-1" />
              </div>
            </div>
          </Card>
        </div>

        {/* Canvas Area */}
        <div className="lg:col-span-3 flex flex-col">
          <Card className="flex-1 flex flex-col p-4 bg-[#0a0d14]/50">
            <div className="flex justify-between items-center mb-4">
              <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                <MousePointer2 size={12} />
                Preview Area
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-xs h-8" onClick={() => handleDownload('image/jpeg')}>Export JPG</Button>
                <Button size="sm" className="text-xs h-8 bg-sky-600 hover:bg-sky-500" onClick={() => handleDownload('image/png')}><Download size={14} /> Export PNG</Button>
              </div>
            </div>
            
            <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center relative p-4"
                 style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h10v10H0zm10 10h10v10H10z\' fill=\'%231e293b\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat' }}
            >
              <canvas 
                ref={canvasRef} 
                className="max-w-full max-h-full object-contain shadow-2xl transition-transform" 
                style={{ aspectRatio: preset.name === 'Custom' ? `${customW}/${customH}` : `${preset.width}/${preset.height}` }}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
