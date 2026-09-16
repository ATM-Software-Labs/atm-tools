import React, { useState, useRef } from 'react';
import { Card, Button } from '../ui';
import { FileDown, FilePlus, ArrowLeft, FileText, Trash2 } from 'lucide-react';
import { mergePdfs } from '../../utils/pdf';

export function PdfManager({ onBack }: { onBack: () => void }) {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index));

  const handleProcess = async () => {
    if (files.length < 2) {
      alert("Por favor, añade al menos 2 documentos para juntarlos.");
      return;
    }
    
    setIsProcessing(true);
    try {
      const resultBlob = await mergePdfs(files);
      const a = document.createElement('a');
      a.href = URL.createObjectURL(resultBlob);
      a.download = `documentos_juntos.pdf`;
      a.click();
      
      // Cleanup UI
      setFiles([]);
    } catch (error) {
      alert('Hubo un problema al juntar los documentos.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white text-lg">
        <ArrowLeft /> Volver al menú
      </button>

      <div>
        <h2 className="text-4xl font-serif text-slate-100 mb-4 flex items-center gap-3">
          <FileText className="text-sky-400" size={40} /> Documentos PDF
        </h2>
        <p className="text-xl text-slate-400">Junta varios documentos PDF en uno solo. Ideal para enviar todo junto.</p>
      </div>

      <Card className="flex flex-col min-h-[500px] p-8">
        
        <div className="flex gap-4 mb-8">
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            className="flex-1 h-20 text-2xl rounded-2xl bg-sky-600 hover:bg-sky-500 shadow-xl shadow-sky-900/20"
          >
            <FilePlus size={32} className="mr-3" /> Añadir Documentos
          </Button>
          
          <Button 
            onClick={handleProcess} 
            disabled={isProcessing || files.length < 2}
            className="flex-1 h-20 text-2xl rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 shadow-xl"
          >
            <FileDown size={32} className="mr-3" /> {isProcessing ? 'Juntando...' : 'Juntar y Descargar'}
          </Button>
        </div>

        <input type="file" ref={fileInputRef} className="hidden" accept="application/pdf" multiple onChange={handleFileChange} />

        <div className="bg-slate-900/50 rounded-3xl p-6 flex-1 border border-slate-800">
          <h3 className="text-2xl text-slate-300 mb-4">Documentos añadidos ({files.length}):</h3>
          
          {files.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-slate-500">
              <FileText size={48} className="mb-4 opacity-50" />
              <p className="text-xl">Aún no hay documentos.</p>
              <p className="text-lg">Haz clic en "Añadir Documentos" para empezar.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-[#0a0d14] border border-slate-800 rounded-xl text-lg">
                  <span className="text-slate-200 truncate">{idx + 1}. {file.name}</span>
                  <button onClick={() => removeFile(idx)} className="text-red-400 hover:text-red-300 p-2">
                    <Trash2 size={24} />
                  </button>
                </div>
              ))}
              
              {files.length === 1 && (
                <p className="text-sky-400 text-lg mt-4 text-center">¡Añade al menos un documento más para poder juntarlos!</p>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
