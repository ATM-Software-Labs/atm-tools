import React, { useState, useRef, useEffect } from 'react';
import { Shield, ArrowLeft, Upload, FileDown, RotateCcw } from 'lucide-react';

export function PrivacyBlur({ onBack }: { onBack: () => void }) {
  const [image, setImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasEdits, setHasEdits] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
    }
  };

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          // Adjust canvas size to fit screen while maintaining aspect ratio
          const maxWidth = window.innerWidth - 64; // accounting for padding
          const maxHeight = window.innerHeight * 0.5;
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          }

          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = '#000000'; // Black out
            ctx.lineWidth = 20; // Thick line for blurring/censoring
          }
          imageRef.current = img;
          setHasEdits(false);
        }
      };
      img.src = image;
    }
  }, [image]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    
    // Calculate actual position taking CSS scaling into account
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
      setHasEdits(true);
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      const ctx = canvasRef.current?.getContext('2d');
      ctx?.closePath();
      setIsDrawing(false);
    }
  };

  const resetImage = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && img && ctx) {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setHasEdits(false);
    }
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `censurado_${new Date().getTime()}.jpg`;
      a.click();
    }
  };

  return (
    <div className="bg-[#0f172a]/60 border border-slate-800 rounded-3xl p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-serif text-slate-100 mb-2">Ocultar Datos</h2>
          <p className="text-slate-400 text-lg">Tacha datos privados (DNI, tarjetas, caras) antes de enviar la foto.</p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-lg"
        >
          <ArrowLeft size={24} />
          Volver
        </button>
      </div>

      {!image ? (
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-700 rounded-2xl bg-slate-800/20">
          <Shield size={64} className="text-emerald-500 mb-6" />
          <p className="text-2xl text-slate-300 font-medium mb-6 text-center">
            Sube la foto que quieres censurar
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            ref={fileInputRef}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-2xl font-bold transition-colors"
          >
            Buscar Foto
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6 items-center">
          <p className="text-xl text-sky-400 text-center font-medium bg-sky-900/30 py-3 px-6 rounded-full">
            👆 Pasa el dedo o ratón por encima de lo que quieras tachar
          </p>
          
          <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-700 bg-black flex justify-center touch-none">
            <canvas
              ref={canvasRef}
              className="cursor-crosshair max-w-full h-auto"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              onTouchCancel={stopDrawing}
            />
          </div>

          <div className="flex gap-4 w-full max-w-2xl mt-4">
            <button 
              onClick={resetImage}
              className="flex-1 flex items-center justify-center gap-2 py-5 rounded-2xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xl font-bold transition-colors"
            >
              <RotateCcw size={28} />
              Deshacer Todo
            </button>
            <button 
              onClick={saveImage}
              disabled={!hasEdits}
              className="flex-[2] flex items-center justify-center gap-2 py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileDown size={28} />
              Guardar Foto
            </button>
          </div>
          
          <button
            onClick={() => {
              URL.revokeObjectURL(image);
              setImage(null);
            }}
            className="text-slate-400 hover:text-white underline mt-2"
          >
            Usar otra foto
          </button>
        </div>
      )}
    </div>
  );
}
