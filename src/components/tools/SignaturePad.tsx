import React, { useRef, useState, useEffect } from 'react';
import { useAppConfig } from '../../utils/useAppConfig';
import { i18n } from '../../utils/i18n';
import { PenTool, ArrowLeft, Trash2, FileDown, Save, Upload, CheckCircle2, Settings2, FileText, Stamp, Type, Move } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

// Configurar Worker de PDF.js apuntando a un CDN público para evitar problemas de bundler
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

const SIGNATURE_FONTS = [
  'Dancing Script', 'Pacifico', 'Caveat', 'Satisfy', 'Great Vibes', 
  'Sacramento', 'Alex Brush', 'Parisienne', 'Cookie', 'Yellowtail', 
  'Allura', 'Tangerine', 'Pinyon Script', 'Rochester', 'Grand Hotel', 
  'Qwigley', 'Qwitcher Grypen', 'Meie Script', 'Arizonia', 'Bad Script', 
  'Damion', 'Kaushan Script', 'Marck Script', 'Montez', 'Mr Dafoe', 
  'Norican', 'Oleo Script', 'Rouge Script', 'Whisper', 'Yesteryear', 
  'Zeyada', 'Bilbo', 'Cedarville Cursive', 'Clicker Script', 'Courgette', 
  'Euphoria Script', 'Italianno', 'Kristi', 'League Script', 'Lovers Quarrel',
  'Miss Fajardose', 'Mr Bedfort', 'Mr De Haviland', 'Mrs Saint Delafield',
  'Petit Formal Script', 'Quintessential', 'Romanesco', 'Ruthie', 'Stalemate', 'Vibur'
];

interface SavedSignature {
  id: string;
  name: string;
  dataUrl: string;
}

type SignatureType = 'image' | 'digital-text';
type InputMode = 'draw' | 'type';

export function SignaturePad({ onBack }: { onBack: () => void }) {
  const { lang } = useAppConfig();
  const dict = i18n[lang];

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [savedSignatures, setSavedSignatures] = useState<SavedSignature[]>([]);
  const [selectedSigId, setSelectedSigId] = useState<string | null>(null);
  
  // Typed Signature State
  const [inputMode, setInputMode] = useState<InputMode>('draw');
  const [typedName, setTypedName] = useState('');
  const [selectedFont, setSelectedFont] = useState<string | null>(null);

  // PDF Config State
  const [pendingPdfFile, setPendingPdfFile] = useState<File | null>(null);
  const [isSigningPdf, setIsSigningPdf] = useState(false);
  const [sigType, setSigType] = useState<SignatureType>('image');
  const [digitalSignerName, setDigitalSignerName] = useState('Alberto Trujillo');
  
  // Drag & Drop Preview State
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfPageData, setPdfPageData] = useState<{ width: number, height: number, scale: number } | null>(null);
  const [dragPos, setDragPos] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [sigScale, setSigScale] = useState<number>(1); // Scale multiplicator (0.5 to 2.0)
  
  // Base dimensions of the signature
  const baseSigWidth = sigType === 'image' ? 200 : 250;
  const baseSigHeight = sigType === 'image' ? 100 : 60;

  // Load fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?${SIGNATURE_FONTS.map(f => `family=${f.replace(/ /g, '+')}`).join('&')}&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  // Load signatures from memory
  useEffect(() => {
    const loaded = localStorage.getItem('atm_saved_signatures');
    if (loaded) {
      try {
        const parsed = JSON.parse(loaded);
        setSavedSignatures(parsed);
        if (parsed.length > 0) setSelectedSigId(parsed[0].id);
      } catch (e) {}
    }
  }, []);

  // Setup drawing canvas
  useEffect(() => {
    if (inputMode === 'draw') {
      const canvas = canvasRef.current;
      if (canvas && !pendingPdfFile) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const { width, height } = canvas.getBoundingClientRect();
          canvas.width = width * 2;
          canvas.height = height * 2;
          ctx.scale(2, 2);
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 4;
        }
      }
    }
  }, [pendingPdfFile, inputMode]);

  // Load PDF Preview
  useEffect(() => {
    if (!pendingPdfFile || !pdfCanvasRef.current || !containerRef.current) return;
    
    let isCancelled = false;
    
    const loadPdfPreview = async () => {
      try {
        const arrayBuffer = await pendingPdfFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);
        
        if (isCancelled) return;
        
        // Calcular escala para que quepa en el contenedor (máx 600px de ancho)
        const viewportUnscaled = page.getViewport({ scale: 1.0 });
        const containerWidth = containerRef.current?.clientWidth || 600;
        
        // Dejar un pequeño margen
        const targetWidth = Math.min(containerWidth - 32, 600);
        const scale = targetWidth / viewportUnscaled.width;
        
        const viewport = page.getViewport({ scale });
        
        const canvas = pdfCanvasRef.current;
        if (!canvas) return;
        
        const context = canvas.getContext('2d');
        if (!context) return;
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({ canvasContext: context, viewport } as any).promise;
        
        if (!isCancelled) {
          setPdfPageData({ 
            width: viewportUnscaled.width, 
            height: viewportUnscaled.height, 
            scale: scale 
          });
          
          // Posicionar inicialmente en el centro-abajo
          setDragPos({
            x: (viewport.width / 2) - ((baseSigWidth * sigScale) / 2),
            y: viewport.height - (baseSigHeight * sigScale) - 50
          });
        }
      } catch (err) {
        console.error('Error al generar previsualización del PDF', err);
      }
    };
    
    loadPdfPreview();
    
    return () => { isCancelled = true; };
  }, [pendingPdfFile]);

  // Funciones de dibujo manual
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
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (inputMode !== 'draw') return;
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
    if (inputMode !== 'draw') return;
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
    if (isDrawing && inputMode === 'draw') {
      const ctx = canvasRef.current?.getContext('2d');
      ctx?.closePath();
      setIsDrawing(false);
    }
  };

  const clearSignature = () => {
    if (inputMode === 'draw') {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasDrawn(false);
      }
    } else {
      setTypedName('');
      setSelectedFont(null);
    }
  };

  const generateDataUrlFromFont = (text: string, fontName: string): string => {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 800;
    tempCanvas.height = 300;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return '';
    ctx.clearRect(0, 0, 800, 300);
    ctx.fillStyle = '#000000';
    ctx.font = `120px "${fontName}"`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(text, 400, 150);
    return tempCanvas.toDataURL('image/png');
  };

  const saveToMemory = () => {
    let dataUrl = '';
    
    if (inputMode === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      dataUrl = canvas.toDataURL('image/png');
    } else {
      if (!typedName || !selectedFont) return;
      dataUrl = generateDataUrlFromFont(typedName, selectedFont);
    }

    const name = prompt('¿Nombre para esta firma? (ej. "Mi Firma Principal")') || 'Firma Guardada';
    const newSig = { id: Math.random().toString(36).substring(7), name, dataUrl };
    const updated = [...savedSignatures, newSig];
    setSavedSignatures(updated);
    setSelectedSigId(newSig.id);
    localStorage.setItem('atm_saved_signatures', JSON.stringify(updated));
    clearSignature();
    alert('¡Firma guardada con éxito!');
  };

  const deleteSignature = (id: string) => {
    const updated = savedSignatures.filter(s => s.id !== id);
    setSavedSignatures(updated);
    if (selectedSigId === id) setSelectedSigId(updated.length > 0 ? updated[0].id : null);
    localStorage.setItem('atm_saved_signatures', JSON.stringify(updated));
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPendingPdfFile(file);
    }
    e.target.value = '';
  };

  // Drag and Drop Logic
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    e.preventDefault(); // Prevent text selection/scrolling while dragging
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !pdfCanvasRef.current) return;
    
    const canvas = pdfCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    
    const sigW = baseSigWidth * sigScale;
    const sigH = baseSigHeight * sigScale;
    
    // Centrar el ratón/dedo en la firma
    let newX = clientX - rect.left - (sigW / 2);
    let newY = clientY - rect.top - (sigH / 2);
    
    // Mantener dentro de los límites del canvas
    newX = Math.max(0, Math.min(newX, canvas.width - sigW));
    newY = Math.max(0, Math.min(newY, canvas.height - sigH));
    
    setDragPos({ x: newX, y: newY });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  // Agregar listeners globales de ratón/toque si se está arrastrando
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove as any);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove as any, { passive: false });
      window.addEventListener('touchend', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDragMove as any);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove as any);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, sigScale]);

  const executePdfSigning = async () => {
    if (!pendingPdfFile || !pdfPageData) return;
    
    const activeSig = savedSignatures.find(s => s.id === selectedSigId);
    if (sigType === 'image' && !activeSig) {
      alert("Por favor, selecciona una firma gráfica primero.");
      return;
    }

    setIsSigningPdf(true);
    try {
      const pdfBytes = await pendingPdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      
      let sigImage: any = null;
      let finalSigDims = { width: 0, height: 0 };
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const helveticaRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // Calcular coordenadas y escala reales del PDF
      // dragPos está en pixeles del DOM (canvas renderizado)
      // Necesitamos transformarlo a puntos del PDF
      
      const domScale = pdfPageData.scale; // Cuánto se redujo el PDF para entrar en pantalla
      
      // Tamaño real de la firma en el PDF
      const pdfSigW = (baseSigWidth * sigScale) / domScale;
      const pdfSigH = (baseSigHeight * sigScale) / domScale;
      
      if (sigType === 'image' && activeSig) {
        const sigRes = await fetch(activeSig.dataUrl);
        const sigArray = await sigRes.arrayBuffer();
        sigImage = await pdfDoc.embedPng(sigArray);
        finalSigDims = { width: pdfSigW, height: pdfSigH }; // Forzar escala calculada
      } else if (sigType === 'digital-text') {
        finalSigDims = { width: pdfSigW, height: pdfSigH };
      }

      const pages = pdfDoc.getPages();
      // Firmamos en todas las páginas por ahora, o solo en la primera
      // (Podríamos añadir un selector si quisieran)
      const targetPages = [pages[0]]; // Solo en la primera para simplificar

      for (const page of targetPages) {
        // En pdf-lib, el origen (0,0) está abajo a la izquierda.
        // En DOM, el origen (0,0) está arriba a la izquierda.
        const pdfX = dragPos.x / domScale;
        const domBottomY = dragPos.y + (baseSigHeight * sigScale); // Parte más baja de la firma en el DOM
        const pdfY = pdfPageData.height - (domBottomY / domScale); // Transformar origen Y
        
        if (sigType === 'image' && sigImage) {
          page.drawImage(sigImage, {
            x: pdfX, 
            y: pdfY,
            width: finalSigDims.width,
            height: finalSigDims.height,
          });
        } else if (sigType === 'digital-text') {
          page.drawRectangle({
            x: pdfX, 
            y: pdfY,
            width: finalSigDims.width,
            height: finalSigDims.height,
            borderColor: rgb(0.1, 0.4, 0.8),
            borderWidth: 2,
            color: rgb(0.95, 0.97, 1)
          });
          
          // Ajustar textos según la escala
          const scaleMult = (sigScale / domScale);
          page.drawText('FIRMA DIGITALIZADA', {
            x: pdfX + (10 * scaleMult), 
            y: pdfY + finalSigDims.height - (20 * scaleMult),
            size: 10 * scaleMult, font: helveticaBold, color: rgb(0.1, 0.4, 0.8)
          });
          page.drawText(digitalSignerName || 'Firma Desconocida', {
            x: pdfX + (10 * scaleMult), 
            y: pdfY + finalSigDims.height - (35 * scaleMult),
            size: 14 * scaleMult, font: helveticaBold, color: rgb(0.1, 0.1, 0.1)
          });
          const dateStr = new Date().toLocaleString();
          page.drawText(`Firma electrónica generada el ${dateStr}`, {
            x: pdfX + (10 * scaleMult), 
            y: pdfY + (10 * scaleMult),
            size: 8 * scaleMult, font: helveticaRegular, color: rgb(0.3, 0.3, 0.3)
          });
        }
      }
      
      const pdfSavedBytes = await pdfDoc.save();
      const blob = new Blob([pdfSavedBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Firmado_${pendingPdfFile.name}`;
      a.click();
      URL.revokeObjectURL(url);
      setPendingPdfFile(null); 
    } catch (err) {
      console.error(err);
      alert('Error al firmar el PDF.');
    } finally {
      setIsSigningPdf(false);
    }
  };

  const cancelPdfSigning = () => setPendingPdfFile(null);

  const activeSig = savedSignatures.find(s => s.id === selectedSigId);

  // VISTA DE PREVISUALIZACIÓN DE PDF
  if (pendingPdfFile) {
    return (
      <div className="bg-[#0f172a]/60 border border-slate-800 rounded-3xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-serif text-slate-100 mb-2">{dict.tools['signature'].name}</h2>
            <p className="text-slate-400 text-lg">{dict.tools['signature'].desc}</p>
          </div>
          <button
            onClick={cancelPdfSigning}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-lg whitespace-nowrap"
          >
            <ArrowLeft size={24} />
            Cancelar
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Panel de Controles Izquierdo */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <div className="bg-[#0a0d14] p-5 rounded-2xl border border-slate-800 shadow-xl">
              <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2"><Settings2 size={20}/> Ajustes Visuales</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Tipo de Firma</label>
                  <div className="flex gap-2 p-1 bg-slate-900 rounded-lg">
                    <button onClick={() => setSigType('image')} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${sigType === 'image' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>Tú Firma Guardada</button>
                    <button onClick={() => setSigType('digital-text')} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${sigType === 'digital-text' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>Sello Digital</button>
                  </div>
                </div>

                {sigType === 'digital-text' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Nombre del Firmante</label>
                    <input 
                      type="text" 
                      value={digitalSignerName}
                      onChange={e => setDigitalSignerName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2 flex justify-between">
                    <span>Tamaño de la Firma</span>
                    <span>{Math.round(sigScale * 100)}%</span>
                  </label>
                  <input 
                    type="range" min="0.5" max="3" step="0.1" 
                    value={sigScale} onChange={e => setSigScale(parseFloat(e.target.value))}
                    className="w-full accent-sky-500"
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={executePdfSigning}
              disabled={isSigningPdf}
              className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xl font-bold transition-all disabled:opacity-50 shadow-lg hover:shadow-emerald-900/50"
            >
              <Stamp size={28} />
              {isSigningPdf ? 'Procesando...' : 'Aplicar y Descargar'}
            </button>
          </div>

          {/* Visor de PDF Derecho */}
          <div className="w-full lg:w-2/3 flex flex-col items-center bg-slate-900/50 p-4 rounded-2xl border border-slate-800 overflow-hidden" ref={containerRef}>
            <p className="text-slate-400 text-sm mb-4">Mueve la firma por encima del documento (primera página).</p>
            
            <div className="relative shadow-2xl border border-slate-700 max-w-full overflow-hidden select-none bg-white">
              {/* Canvas del PDF */}
              <canvas ref={pdfCanvasRef} className="block pointer-events-none" />
              
              {/* Elemento Arrastrable de la Firma */}
              {pdfPageData && (
                <div 
                  className="absolute cursor-move border-2 border-dashed border-sky-500 bg-sky-500/10 hover:bg-sky-500/20 transition-colors shadow-sm flex items-center justify-center"
                  style={{
                    left: `${dragPos.x}px`,
                    top: `${dragPos.y}px`,
                    width: `${baseSigWidth * sigScale}px`,
                    height: `${baseSigHeight * sigScale}px`,
                    touchAction: 'none'
                  }}
                  onMouseDown={handleDragStart}
                  onTouchStart={handleDragStart}
                >
                  <div className="absolute -top-3 -right-3 w-6 h-6 bg-sky-500 rounded-full text-white flex items-center justify-center shadow-md">
                    <Move size={14} />
                  </div>
                  
                  {sigType === 'image' && activeSig && (
                    <img src={activeSig.dataUrl} alt="Tu firma" className="w-full h-full object-contain mix-blend-multiply opacity-90 pointer-events-none" />
                  )}
                  {sigType === 'digital-text' && (
                    <div className="w-full h-full border-2 border-blue-600 bg-blue-50/80 flex flex-col justify-center p-2 text-left pointer-events-none">
                      <div className="text-[9px] font-bold text-blue-700 leading-tight">FIRMA DIGITALIZADA</div>
                      <div className="text-[13px] font-bold text-slate-900 leading-tight truncate">{digitalSignerName || 'Nombre'}</div>
                      <div className="text-[7px] text-slate-600 leading-tight mt-1 truncate">Firma electrónica generada hoy</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // VISTA PRINCIPAL (CREAR FIRMA Y SUBIR)
  return (
    <div className="bg-[#0f172a]/60 border border-slate-800 rounded-3xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-serif text-slate-100 mb-2">Crear y Firmar</h2>
          <p className="text-slate-400 text-lg">Guarda tu firma y aplícala a cualquier documento al instante.</p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-lg whitespace-nowrap"
        >
          <ArrowLeft size={24} />{lang === 'ES' ? 'Volver' : lang === 'CA' ? 'Tornar' : 'Back'}</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-6 bg-[#0a0d14] p-6 rounded-2xl border border-slate-800">
          
          <div className="flex gap-2 p-1 bg-slate-900 rounded-lg w-full mb-2">
            <button 
              onClick={() => { setInputMode('draw'); clearSignature(); }} 
              className={`flex-1 py-2 text-sm font-semibold rounded-md flex items-center justify-center gap-2 transition-all ${inputMode === 'draw' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <PenTool size={16}/> Dibujar Manual
            </button>
            <button 
              onClick={() => { setInputMode('type'); clearSignature(); }} 
              className={`flex-1 py-2 text-sm font-semibold rounded-md flex items-center justify-center gap-2 transition-all ${inputMode === 'type' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <Type size={16}/> Estilos de Firma
            </button>
          </div>

          {inputMode === 'draw' ? (
            <div className="w-full bg-slate-300 rounded-2xl overflow-hidden border-4 border-slate-400 shadow-inner relative touch-none">
              {!hasDrawn && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-400/50 text-2xl font-bold font-serif rotate-[-10deg]">
                  Dibuja tu firma aquí
                </div>
              )}
              <canvas
                ref={canvasRef}
                className="w-full h-64 cursor-crosshair block bg-slate-100"
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
          ) : (
            <div className="w-full h-64 flex flex-col gap-4">
              <input 
                type="text" 
                placeholder="Escribe tu nombre y apellidos..." 
                value={typedName}
                onChange={e => setTypedName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-200 focus:border-sky-500 focus:outline-none text-lg"
              />
              <div className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl p-2 overflow-y-auto custom-scrollbar flex flex-col gap-2">
                {!typedName ? (
                  <div className="h-full flex items-center justify-center text-slate-500 italic text-sm">
                    Escribe tu nombre arriba para ver 50+ estilos de firma
                  </div>
                ) : (
                  SIGNATURE_FONTS.map(font => (
                    <button
                      key={font}
                      onClick={() => setSelectedFont(font)}
                      style={{ fontFamily: `"${font}", cursive` }}
                      className={`w-full text-left px-6 py-4 text-3xl text-black rounded-lg transition-colors overflow-hidden ${selectedFont === font ? 'bg-sky-200 border-2 border-sky-500' : 'bg-slate-200 hover:bg-slate-300'}`}
                    >
                      {typedName}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          <div className="flex gap-4 w-full">
            <button 
              onClick={clearSignature}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-rose-900/40 text-rose-300 hover:bg-rose-900/60 text-lg font-bold transition-colors"
            >
              <Trash2 size={24} />
              Borrar
            </button>
            <button 
              onClick={saveToMemory}
              disabled={inputMode === 'draw' ? !hasDrawn : (!typedName || !selectedFont)}
              className="flex-[2] flex items-center justify-center gap-2 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={24} />
              Guardar Firma
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-[#0a0d14] p-6 rounded-2xl border border-slate-800 flex-1">
            <h3 className="text-xl font-medium text-slate-200 mb-4">Tus Firmas Guardadas</h3>
            {savedSignatures.length === 0 ? (
              <div className="text-slate-500 text-center py-8 bg-slate-900/50 rounded-xl border border-dashed border-slate-700">
                Aún no tienes firmas guardadas. Crea una a la izquierda y guárdala.
              </div>
            ) : (
              <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                {savedSignatures.map(sig => (
                  <div 
                    key={sig.id} 
                    onClick={() => setSelectedSigId(sig.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${selectedSigId === sig.id ? 'bg-sky-900/30 border-sky-500' : 'bg-slate-900/50 border-slate-700 hover:border-slate-500'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${selectedSigId === sig.id ? 'bg-sky-500 text-white' : 'bg-slate-700 text-transparent'}`}>
                        <CheckCircle2 size={16} />
                      </div>
                      <div>
                        <p className="text-slate-200 font-medium">{sig.name}</p>
                        <img src={sig.dataUrl} alt={sig.name} className="h-10 mt-1 bg-white rounded object-contain px-2" />
                      </div>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteSignature(sig.id); }}
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative bg-gradient-to-r from-sky-900/40 to-indigo-900/40 p-6 rounded-2xl border border-sky-800/50 overflow-hidden group">
            <div className="relative z-10 flex flex-col items-center justify-center gap-3 text-center">
              <FileText size={36} className="text-sky-400" />
              <div>
                <h4 className="text-lg font-bold text-sky-100">Firmar un PDF</h4>
                <p className="text-sm text-slate-300 mt-1">Sube un documento para estampar tu firma.</p>
              </div>
              <input 
                type="file" 
                accept="application/pdf"
                onChange={handlePdfUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
                title="Haz clic para subir un PDF"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
