import React, { useState, useRef, useEffect } from 'react';
import { Card, Button } from '../ui';
import { Download, Eraser, Upload, ArrowLeft } from 'lucide-react';
import { processImageRemoval, downloadBlob } from '../../utils/image';

export function BackgroundRemover({ onBack }: { onBack: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
  };

  const handleRemoveBackground = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      const blob = await processImageRemoval(file);
      setResultBlob(blob);
    } catch (error) {
      alert('Hubo un problema al quitar el fondo. Por favor, intenta con otra foto.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob) return;
    downloadBlob(resultBlob, `foto_sin_fondo.png`);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white text-lg">
        <ArrowLeft /> Volver al menú
      </button>

      <div>
        <h2 className="text-4xl font-serif text-slate-100 mb-4 flex items-center gap-3">
          <Eraser className="text-sky-400" size={40} /> Quitar Fondo
        </h2>
        <p className="text-xl text-slate-400">Deja solo a la persona o el objeto principal de tu foto.</p>
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
            <p className="text-slate-500 text-lg mt-6">Haz clic en el botón azul para buscar la foto en tu dispositivo.</p>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            
            <div className="w-full max-w-2xl bg-slate-900/50 rounded-3xl p-4 mb-8">
              {!resultBlob ? (
                <div className="aspect-square flex items-center justify-center">
                  <img src={preview} alt="Tu foto" className="max-w-full max-h-full rounded-2xl object-contain" />
                </div>
              ) : (
                <div 
                  className="aspect-square flex items-center justify-center rounded-2xl"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h10v10H0zm10 10h10v10H10z\' fill=\'%231e293b\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat' }}
                >
                  <img src={URL.createObjectURL(resultBlob)} alt="Resultado" className="max-w-full max-h-full object-contain drop-shadow-2xl" />
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
              <Button 
                variant="outline" 
                onClick={() => setFile(null)}
                className="flex-1 h-16 text-xl rounded-2xl border-slate-700"
              >
                Cambiar Foto
              </Button>
              
              {!resultBlob ? (
                <Button 
                  onClick={handleRemoveBackground} 
                  disabled={isProcessing} 
                  className="flex-1 h-16 text-xl rounded-2xl bg-sky-600 hover:bg-sky-500"
                >
                  {isProcessing ? 'Borrando fondo... espera un poco' : 'Borrar el Fondo Ahora'}
                </Button>
              ) : (
                <Button 
                  onClick={handleDownload} 
                  className="flex-1 h-16 text-xl rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  <Download size={24} className="mr-2" /> Descargar Resultado
                </Button>
              )}
            </div>
            
            {isProcessing && (
              <p className="text-sky-400 text-lg mt-6 text-center animate-pulse">
                Esto puede tardar unos segundos la primera vez. ¡Paciencia!
              </p>
            )}
          </div>
        )}
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      </Card>
    </div>
  );
}
