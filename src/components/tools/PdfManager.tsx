import React, { useState, useRef } from 'react';
import { Card, Button, Input, Label } from '../ui';
import { FileDown, FilePlus, Copy, GripVertical, Settings, FileText } from 'lucide-react';
import { mergePdfs, splitPdf, rotatePdf } from '../../utils/pdf';
import { downloadBlob } from '../../utils/image';
import { cn } from '../../utils/cn';

type PdfMode = 'merge' | 'split' | 'rotate';

export function PdfManager() {
  const [mode, setMode] = useState<PdfMode>('merge');
  const [files, setFiles] = useState<File[]>([]);
  const [pageRanges, setPageRanges] = useState('');
  const [rotation, setRotation] = useState(90);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (mode === 'merge') {
        setFiles(prev => [...prev, ...newFiles]);
      } else {
        setFiles([newFiles[0]]);
      }
    }
  };

  const removeFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index));
  const moveFile = (index: number, direction: -1 | 1) => {
    if (index + direction < 0 || index + direction >= files.length) return;
    const newFiles = [...files];
    const temp = newFiles[index];
    newFiles[index] = newFiles[index + direction];
    newFiles[index + direction] = temp;
    setFiles(newFiles);
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    
    try {
      let resultBlob: Blob;
      let filename = 'result.pdf';
      
      if (mode === 'merge') {
        resultBlob = await mergePdfs(files);
        filename = 'merged.pdf';
      } else if (mode === 'split') {
        resultBlob = await splitPdf(files[0], pageRanges);
        filename = `${files[0].name.replace('.pdf', '')}_split.pdf`;
      } else {
        resultBlob = await rotatePdf(files[0], rotation);
        filename = `${files[0].name.replace('.pdf', '')}_rotated.pdf`;
      }
      
      downloadBlob(resultBlob, filename);
    } catch (error: any) {
      console.error(error);
      alert(`Error processing PDF: ${error.message || 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif text-slate-100 mb-2">PDF Studio</h2>
        <p className="text-slate-400 font-mono text-xs">Merge, split, and rotate PDFs securely in your browser.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 min-h-[400px] flex flex-col">
          <div className="flex justify-between items-end mb-6 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-medium text-slate-200">
                {mode === 'merge' ? 'Merge Documents' : mode === 'split' ? 'Extract Pages' : 'Rotate Document'}
              </h3>
              <p className="text-slate-500 text-xs mt-1">
                {mode === 'merge' && 'Add multiple PDFs and arrange their order.'}
                {mode === 'split' && 'Extract specific pages or ranges.'}
                {mode === 'rotate' && 'Rotate all pages in the PDF file.'}
              </p>
            </div>
            <Button size="sm" onClick={() => fileInputRef.current?.click()} className="h-9">
              <FilePlus size={16} /> {mode === 'merge' ? 'Add Files' : 'Select File'}
            </Button>
          </div>

          <input type="file" ref={fileInputRef} className="hidden" accept="application/pdf" multiple={mode === 'merge'} onChange={handleFileChange} />

          {files.length > 0 ? (
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
              {files.map((file, idx) => (
                <div key={`${file.name}-${idx}`} className="flex items-center justify-between p-3 bg-[#0a0d14]/50 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-3 overflow-hidden">
                    {mode === 'merge' && (
                      <div className="flex flex-col gap-1 text-slate-600">
                        <button className="hover:text-white disabled:opacity-30 p-0 h-4 leading-none" disabled={idx === 0} onClick={() => moveFile(idx, -1)}>▲</button>
                        <button className="hover:text-white disabled:opacity-30 p-0 h-4 leading-none" disabled={idx === files.length - 1} onClick={() => moveFile(idx, 1)}>▼</button>
                      </div>
                    )}
                    <FileText className="text-sky-500 shrink-0" size={20} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-200 truncate">{file.name}</p>
                      <p className="text-xs text-slate-500 font-mono">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  
                  <button className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors ml-2" onClick={() => removeFile(idx)}>✕</button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-800/80 rounded-xl bg-[#0a0d14]/30 cursor-pointer hover:border-sky-500/50 transition-colors" onClick={() => fileInputRef.current?.click()}>
              <FileText size={32} className="text-slate-700 mb-3" />
              <p className="text-slate-400 font-medium text-sm">No documents selected</p>
              <p className="text-slate-500 text-xs font-mono mt-1">Click to browse</p>
            </div>
          )}
        </Card>

        <Card className="flex flex-col gap-6">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">
            <Settings size={16} className="text-sky-400" /> Mode & Options
          </div>
          
          <div className="flex flex-col gap-2">
            <button className={cn("text-xs py-2 px-3 rounded-md border text-left transition-colors", mode === 'merge' ? "bg-sky-900/30 border-sky-500/50 text-sky-400" : "bg-[#0a0d14] border-slate-800 text-slate-400")} onClick={() => { setMode('merge'); setFiles([]); }}>
              Merge PDFs
            </button>
            <button className={cn("text-xs py-2 px-3 rounded-md border text-left transition-colors", mode === 'split' ? "bg-sky-900/30 border-sky-500/50 text-sky-400" : "bg-[#0a0d14] border-slate-800 text-slate-400")} onClick={() => { setMode('split'); setFiles([]); }}>
              Split / Extract
            </button>
            <button className={cn("text-xs py-2 px-3 rounded-md border text-left transition-colors", mode === 'rotate' ? "bg-sky-900/30 border-sky-500/50 text-sky-400" : "bg-[#0a0d14] border-slate-800 text-slate-400")} onClick={() => { setMode('rotate'); setFiles([]); }}>
              Rotate Pages
            </button>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800">
            {mode === 'split' && (
              <div>
                <Label className="text-xs">Pages to Extract</Label>
                <Input placeholder="e.g. 1-5, 8, 11-13" value={pageRanges} onChange={(e) => setPageRanges(e.target.value)} className="w-full mt-1 text-xs h-9 font-mono" />
              </div>
            )}
            
            {mode === 'rotate' && (
              <div>
                <Label className="text-xs">Rotation Angle</Label>
                <select className="w-full mt-1 bg-[#0a0d14] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500" value={rotation} onChange={(e) => setRotation(parseInt(e.target.value))}>
                  <option value={90}>90° Clockwise</option>
                  <option value={180}>180°</option>
                  <option value={270}>90° Counter-Clockwise</option>
                </select>
              </div>
            )}

            <Button onClick={handleProcess} disabled={isProcessing || files.length === 0 || (mode === 'split' && !pageRanges.trim())} className="w-full h-10 bg-emerald-600 hover:bg-emerald-500 text-white border-transparent">
              <FileDown size={16} /> {isProcessing ? 'Processing...' : 'Export PDF'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
