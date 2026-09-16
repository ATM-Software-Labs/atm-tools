import React, { useState } from 'react';
import { ArrowLeft, Key, Download, Copy, Settings, RefreshCw } from 'lucide-react';

type IdType = 'uuid' | 'nanoid';
type BulkCount = 1 | 5 | 10 | 50;

export function UuidGenerator({ onBack }: { onBack: () => void }) {
  const [idType, setIdType] = useState<IdType>('uuid');
  const [bulkCount, setBulkCount] = useState<BulkCount>(1);
  const [uppercase, setUppercase] = useState(false);
  const [noDashes, setNoDashes] = useState(false);
  const [nanoLength, setNanoLength] = useState(21);
  const [nanoAlphabet, setNanoAlphabet] = useState('useandom-26' + 'T198340PX75px' + 'JACKVERYMINDBUSHWOLF' + '_GQZbfghjklqvwyzrict');
  
  const [generatedIds, setGeneratedIds] = useState<string[]>([]);

  const generateUuidV4 = () => {
    // Cryptographically secure UUIDv4 using crypto.getRandomValues
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    
    // Set version to 4
    array[6] = (array[6] & 0x0f) | 0x40;
    // Set variant to 10
    array[8] = (array[8] & 0x3f) | 0x80;
    
    let uuid = [...array].map(b => b.toString(16).padStart(2, '0')).join('');
    
    if (!noDashes) {
      uuid = `${uuid.slice(0,8)}-${uuid.slice(8,12)}-${uuid.slice(12,16)}-${uuid.slice(16,20)}-${uuid.slice(20)}`;
    }
    
    if (uppercase) uuid = uuid.toUpperCase();
    return uuid;
  };

  const generateNanoid = () => {
    const defaultAlpha = 'useandom-26' + 'T198340PX75px' + 'JACKVERYMINDBUSHWOLF' + '_GQZbfghjklqvwyzrict';
    const alphabet = nanoAlphabet || defaultAlpha;
    let id = '';
    const bytes = new Uint8Array(nanoLength);
    window.crypto.getRandomValues(bytes);
    
    for (let i = 0; i < nanoLength; i++) {
      id += alphabet[bytes[i] % alphabet.length];
    }
    
    if (uppercase) id = id.toUpperCase();
    return id;
  };

  const handleGenerate = () => {
    const results: string[] = [];
    for (let i = 0; i < bulkCount; i++) {
      if (idType === 'uuid') {
        results.push(generateUuidV4());
      } else {
        results.push(generateNanoid());
      }
    }
    setGeneratedIds(results);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadBulk = () => {
    const text = generatedIds.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atm-tools-${idType}-bulk.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Generate 1 by default on mount
  React.useEffect(() => {
    if (generatedIds.length === 0) {
      handleGenerate();
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-8 cursor-pointer"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Volver</span>
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Generador UUID & NanoID</h1>
        <p className="text-slate-600 dark:text-slate-400">Generación de identificadores únicos criptográficamente seguros en cliente.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-[#11161d] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white font-bold">
              <Settings size={18} className="text-blue-500" />
              Configuración
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Tipo de ID</label>
                <div className="flex bg-slate-100 dark:bg-[#0a0e17] rounded-lg p-1">
                  <button 
                    onClick={() => setIdType('uuid')} 
                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${idType === 'uuid' ? 'bg-white dark:bg-[#1f2937] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    UUID v4
                  </button>
                  <button 
                    onClick={() => setIdType('nanoid')} 
                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${idType === 'nanoid' ? 'bg-white dark:bg-[#1f2937] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    NanoID
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Cantidad (Bulk)</label>
                <select 
                  value={bulkCount}
                  onChange={(e) => setBulkCount(Number(e.target.value) as BulkCount)}
                  className="w-full bg-slate-50 dark:bg-[#0a0e17] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value={1}>1</option>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={50}>50</option>
                </select>
              </div>

              {idType === 'uuid' && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} className="rounded border-slate-300 text-blue-600" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Mayúsculas</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={noDashes} onChange={(e) => setNoDashes(e.target.checked)} className="rounded border-slate-300 text-blue-600" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Sin guiones</span>
                  </label>
                </div>
              )}

              {idType === 'nanoid' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Longitud: {nanoLength}</label>
                    <input 
                      type="range" 
                      min="4" max="36" 
                      value={nanoLength} 
                      onChange={(e) => setNanoLength(Number(e.target.value))} 
                      className="w-full cursor-pointer" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Alfabeto</label>
                    <input 
                      type="text" 
                      value={nanoAlphabet} 
                      onChange={(e) => setNanoAlphabet(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#0a0e17] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </>
              )}

              <button 
                onClick={handleGenerate}
                className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw size={18} /> Generar {bulkCount} IDs
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-[#11161d] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                <Key size={18} className="text-emerald-500" />
                Resultados
              </div>
              {generatedIds.length > 1 && (
                <button 
                  onClick={downloadBulk}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download size={14} /> Exportar .txt
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto max-h-[500px] space-y-2 pr-2">
              {generatedIds.map((id, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-50 dark:bg-[#0a0e17] p-3 rounded-xl border border-slate-200 dark:border-slate-800/60 group">
                  <span className="font-mono text-sm text-slate-900 dark:text-white truncate pr-4 select-all">{id}</span>
                  <button 
                    onClick={() => copyToClipboard(id)}
                    className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer shrink-0"
                    title="Copiar al portapapeles"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
