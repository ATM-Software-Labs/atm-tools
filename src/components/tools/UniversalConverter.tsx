import React, { useState, useRef, useEffect } from 'react';
import { useAppConfig } from '../../utils/useAppConfig';
import { i18n } from '../../utils/i18n';
import { Card, Button } from '../ui';
import { Upload, Download, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { compressImageSmart } from '../../utils/compress';

export function UniversalConverter({ onBack }: { onBack: () => void }) {
  const { lang } = useAppConfig();
  const dict = i18n[lang];

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [format, setFormat] = useState<'image/jpeg' | 'image/png'>('image/jpeg');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    
    setFile(f);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(f));
    setResultBlob(null);
  };

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      const result = await compressImageSmart(file, format, 0.8);
      setResultBlob(result);
    } catch (error) {
      alert('Hubo un problema al preparar la foto.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob) return;
    const ext = format === 'image/jpeg' ? 'jpg' : 'png';
    const a = document.createElement('a');
    a.href = URL.createObjectURL(resultBlob);
    a.download = `foto_lista.${ext}`;
    a.click();
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white text-lg">
        <ArrowLeft /> Volver al menú
      </button>

      <div>
        <h2 className="text-4xl font-serif text-slate-100 mb-4 flex items-center gap-3">
          <ImageIcon className="text-sky-400" size={40} /> Cambiar Formato
        </h2>
        <p className="text-xl text-slate-400">Prepara tu foto para que ocupe menos espacio al enviarla.</p>
      </div>

      <Card className="flex flex-col items-center justify-center min-h-[500px] p-8">
        {!file ? (
          <div className="text-center w-full max-w-md">
            <Button 
              onClick={() => fileInputRef.current?.click()} 
              className="w-full h-24 text-2xl rounded-2xl bg-sky-600 hover:bg-sky-500 shadow-xl shadow-sky-900/20"
            >
              <Upload size={32} className="mr-3" /> Elegir Foto a Convertir
            </Button>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-lg bg-slate-900/50 rounded-3xl p-4 mb-8 text-center">
              <p className="text-xl text-slate-300 mb-4">Has elegido: <b>{file.name}</b></p>
              
              {!resultBlob ? (
                <div className="space-y-4">
                  <p className="text-lg text-slate-400">Elige el formato de salida:</p>
                  <div className="flex gap-4 justify-center mb-6">
                    <Button 
                      variant={format === 'image/jpeg' ? 'primary' : 'outline'} 
                      onClick={() => setFormat('image/jpeg')}
                      className="h-16 text-xl px-8 rounded-2xl"
                    >
                      JPG (Ocupa menos)
                    </Button>
                    <Button 
                      variant={format === 'image/png' ? 'primary' : 'outline'} 
                      onClick={() => setFormat('image/png')}
                      className="h-16 text-xl px-8 rounded-2xl"
                    >
                      PNG (Alta calidad)
                    </Button>
                  </div>

                  <Button 
                    onClick={handleProcess} 
                    disabled={isProcessing} 
                    className="w-full h-16 text-xl rounded-2xl bg-sky-600 hover:bg-sky-500"
                  >
                    {isProcessing ? 'Preparando...' : 'Convertir Foto'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-emerald-900/20 p-6 rounded-2xl border border-emerald-500/30">
                    <p className="text-2xl text-emerald-400 mb-2">¡Foto Lista!</p>
                    <p className="text-lg text-slate-300">
                      Ha pasado de {(file.size / 1024 / 1024).toFixed(2)} MB a <b>{(resultBlob.size / 1024 / 1024).toFixed(2)} MB</b>.
                    </p>
                  </div>
                  <Button 
                    onClick={handleDownload} 
                    className="w-full h-16 text-xl rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white"
                  >
                    <Download size={24} className="mr-2" /> Descargar Ahora
                  </Button>
                </div>
              )}
              
              <Button variant="outline" className="w-full h-12 text-lg mt-8 border-slate-700 text-slate-400" onClick={() => setFile(null)}>
                Elegir otra foto
              </Button>
            </div>
          </div>
        )}
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      </Card>
    </div>
  );
}
