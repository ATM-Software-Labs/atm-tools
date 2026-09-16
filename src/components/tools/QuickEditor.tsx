import React, { useState, useRef, useEffect } from 'react';
import { useAppConfig } from '../../utils/useAppConfig';
import { i18n } from '../../utils/i18n';
import { Card, Button } from '../ui';
import { Upload, Download, ArrowLeft, Sun, Palette, FlipHorizontal, Contrast } from 'lucide-react';
import { applyImageEdits, downloadBlob } from '../../utils/image';

export function QuickEditor({ onBack }: { onBack: () => void }) {
  const { lang } = useAppConfig();
  const dict = i18n[lang];

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  const [brightness, setBrightness] = useState(0);
  const [color, setColor] = useState(0);
  const [bw, setBw] = useState(false);
  
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (file && previewUrl) {
      const timer = setTimeout(() => {
        applyImageEdits(previewUrl, {
          brightness: brightness,
          saturation: color,
          grayscale: bw,
          contrast: brightness > 0 ? brightness / 2 : 0 // auto contrast with brightness
        }, 'image/jpeg', 0.9)
          .then(blob => setResultBlob(blob))
          .catch(() => {});
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [brightness, color, bw, file, previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    
    setFile(f);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(f));
    setBrightness(0);
    setColor(0);
    setBw(false);
  };

  const handleDownload = () => {
    if (!resultBlob) return;
    downloadBlob(resultBlob, `foto_mejorada.jpg`);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white text-lg">
        <ArrowLeft /> Volver al menú
      </button>

      <div>
        <h2 className="text-4xl font-serif text-slate-100 mb-4 flex items-center gap-3">
          <Sun className="text-sky-400" size={40} /> Mejorar Foto
        </h2>
        <p className="text-xl text-slate-400">Corrige colores y luz de forma automática y sencilla.</p>
      </div>

      <Card className="flex flex-col items-center justify-center min-h-[500px] p-8">
        {!file ? (
          <div className="text-center w-full max-w-md">
            <Button 
              onClick={() => fileInputRef.current?.click()} 
              className="w-full h-24 text-2xl rounded-2xl bg-sky-600 hover:bg-sky-500 shadow-xl shadow-sky-900/20"
            >
              <Upload size={32} className="mr-3" /> Elegir una Foto
            </Button>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-full bg-slate-900/50 rounded-3xl p-4 mb-6">
                <div className="aspect-square flex items-center justify-center">
                  <img 
                    src={resultBlob ? URL.createObjectURL(resultBlob) : previewUrl} 
                    alt="Tu foto" 
                    className="max-w-full max-h-full rounded-2xl object-contain shadow-2xl" 
                  />
                </div>
              </div>
              <Button 
                onClick={handleDownload} 
                className="w-full h-16 text-xl rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                <Download size={24} className="mr-2" /> Descargar Foto Lista
              </Button>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-2xl text-slate-200 mb-2">Ajustes Rápidos</h3>
              
              {/* Luz */}
              <div className="bg-[#0a0d14]/50 p-6 rounded-3xl border border-slate-800">
                <div className="flex items-center gap-3 mb-4 text-xl text-slate-300">
                  <Sun size={28} /> Nivel de Luz
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1 h-16 text-lg" onClick={() => setBrightness(b => Math.max(-50, b - 15))}>Menos Luz</Button>
                  <Button variant="secondary" className="flex-1 h-16 text-lg bg-sky-900/30 text-sky-400" onClick={() => setBrightness(b => Math.min(50, b + 15))}>Más Luz</Button>
                </div>
              </div>

              {/* Color */}
              <div className="bg-[#0a0d14]/50 p-6 rounded-3xl border border-slate-800">
                <div className="flex items-center gap-3 mb-4 text-xl text-slate-300">
                  <Palette size={28} /> Colores
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1 h-16 text-lg" onClick={() => setColor(c => Math.max(-100, c - 25))}>Más Apagado</Button>
                  <Button variant="secondary" className="flex-1 h-16 text-lg bg-sky-900/30 text-sky-400" onClick={() => setColor(c => Math.min(100, c + 25))}>Más Vivo</Button>
                </div>
              </div>

              {/* B&W */}
              <Button 
                variant={bw ? "primary" : "outline"}
                className={`w-full h-16 text-xl rounded-3xl ${bw ? 'bg-slate-700 hover:bg-slate-600 text-white' : ''}`}
                onClick={() => setBw(!bw)}
              >
                <Contrast size={24} className="mr-3" /> 
                {bw ? 'Quitar Blanco y Negro' : 'Poner en Blanco y Negro'}
              </Button>

              <Button variant="outline" className="w-full h-12 text-lg mt-4 border-slate-700 text-slate-400" onClick={() => setFile(null)}>
                Usar otra foto
              </Button>
            </div>
          </div>
        )}
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      </Card>
    </div>
  );
}
