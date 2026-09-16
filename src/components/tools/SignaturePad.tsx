import React, { useRef, useState, useEffect } from 'react';
import { PenTool, ArrowLeft, Trash2, FileDown } from 'lucide-react';

export function SignaturePad({ onBack }: { onBack: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Ajustar resolución del canvas para pantallas de alta densidad (retina)
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Establecemos un tamaño lógico
        const { width, height } = canvas.getBoundingClientRect();
        canvas.width = width * 2;
        canvas.height = height * 2;
        ctx.scale(2, 2);
        
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#000000'; // Firma en negro
        ctx.lineWidth = 4;
      }
    }
  }, []);

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
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); // Evitar scroll en móviles
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
      setHasDrawn(true);
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      const ctx = canvasRef.current?.getContext('2d');
      ctx?.closePath();
      setIsDrawing(false);
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      // Restablecer el canvas requiere limpiar todo teniendo en cuenta el scale anterior
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasDrawn(false);
    }
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `mi_firma_${new Date().getTime()}.png`;
      a.click();
    }
  };

  return (
    <div className="bg-[#0f172a]/60 border border-slate-800 rounded-3xl p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-serif text-slate-100 mb-2">Crear Firma</h2>
          <p className="text-slate-400 text-lg">Dibuja tu firma con el dedo o el ratón para guardarla.</p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-lg"
        >
          <ArrowLeft size={24} />
          Volver
        </button>
      </div>

      <div className="flex flex-col gap-6 items-center">
        <div className="w-full bg-slate-300 rounded-2xl overflow-hidden border-4 border-slate-400 shadow-inner relative touch-none">
          {/* Instrucción visual que desaparece al empezar a dibujar */}
          {!hasDrawn && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-400/50 text-3xl font-bold font-serif rotate-[-10deg]">
              Firma Aquí
            </div>
          )}
          <canvas
            ref={canvasRef}
            className="w-full h-80 cursor-crosshair block bg-slate-100"
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
            onClick={clearSignature}
            className="flex-1 flex items-center justify-center gap-2 py-5 rounded-2xl bg-rose-900/40 text-rose-300 hover:bg-rose-900/60 text-xl font-bold transition-colors"
          >
            <Trash2 size={28} />
            Borrar
          </button>
          <button 
            onClick={saveSignature}
            disabled={!hasDrawn}
            className="flex-[2] flex items-center justify-center gap-2 py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileDown size={28} />
            Descargar Firma
          </button>
        </div>
      </div>
    </div>
  );
}
