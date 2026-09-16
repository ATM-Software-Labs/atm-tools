import React, { useRef, useState, useCallback } from 'react';
import { Camera, FileDown, ArrowLeft, RefreshCw } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export function Scanner({ onBack }: { onBack: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      alert("No se pudo acceder a la cámara. Por favor, dale permiso.");
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setPhoto(canvas.toDataURL('image/jpeg', 0.9));
        stopCamera();
      }
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const saveAsPdf = async () => {
    if (!photo) return;
    setIsProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();
      const imageBytes = await fetch(photo).then(res => res.arrayBuffer());
      const image = await pdfDoc.embedJpg(imageBytes);
      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `documento_escaneado_${new Date().getTime()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Error al guardar el documento.");
    }
    setIsProcessing(false);
  };

  // Limpiar cámara al salir
  React.useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return (
    <div className="bg-[#0f172a]/60 border border-slate-800 rounded-3xl p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-serif text-slate-100 mb-2">Escanear Documento</h2>
          <p className="text-slate-400 text-lg">Haz una foto a un papel para guardarlo como PDF.</p>
        </div>
        <button
          onClick={() => { stopCamera(); onBack(); }}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-lg"
        >
          <ArrowLeft size={24} />
          Volver
        </button>
      </div>

      <div className="flex flex-col items-center gap-6">
        {!photo && !stream && (
          <button 
            onClick={startCamera}
            className="w-full py-16 flex flex-col items-center justify-center gap-4 bg-sky-600 hover:bg-sky-500 rounded-2xl text-white transition-colors"
          >
            <Camera size={64} />
            <span className="text-3xl font-medium">Encender Cámara</span>
          </button>
        )}

        <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden bg-black flex justify-center">
          {stream && !photo && (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-auto max-h-[60vh] object-contain"
            />
          )}
          {photo && (
            <img src={photo} alt="Documento escaneado" className="w-full h-auto max-h-[60vh] object-contain" />
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {stream && !photo && (
          <button 
            onClick={takePhoto}
            className="px-12 py-6 bg-white text-black rounded-full font-bold text-2xl hover:scale-105 transition-transform"
          >
            Hacer Foto
          </button>
        )}

        {photo && (
          <div className="flex gap-4 w-full max-w-2xl">
            <button 
              onClick={() => { setPhoto(null); startCamera(); }}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-800 text-white text-xl hover:bg-slate-700 transition-colors"
            >
              <RefreshCw size={28} />
              Repetir
            </button>
            <button 
              onClick={saveAsPdf}
              disabled={isProcessing}
              className="flex-[2] flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-600 text-white text-xl font-bold hover:bg-emerald-500 transition-colors disabled:opacity-50"
            >
              <FileDown size={28} />
              {isProcessing ? "Guardando..." : "Guardar como PDF"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
