import React, { useState, useEffect } from 'react';
import { useAppConfig } from '../../utils/useAppConfig';
import { i18n } from '../../utils/i18n';
import { ArrowLeft, Clock, Copy, ArrowRight, Calendar } from 'lucide-react';

export function EpochConverter({ onBack }: { onBack: () => void }) {
  const { lang } = useAppConfig();
  const dict = i18n[lang];

  const [currentEpoch, setCurrentEpoch] = useState(Math.floor(Date.now() / 1000));
  const [tsInput, setTsInput] = useState('');
  const [tsResult, setTsResult] = useState<Date | null>(null);
  
  const [dateInput, setDateInput] = useState('');
  const [dateResult, setDateResult] = useState<{ sec: number, ms: number } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTsConvert = (val: string) => {
    setTsInput(val);
    if (!val) {
      setTsResult(null);
      return;
    }
    const num = parseInt(val, 10);
    if (isNaN(num)) return;
    
    // Auto-detect seconds vs ms (if length > 11, likely ms)
    const isMs = val.length > 11;
    const date = new Date(isMs ? num : num * 1000);
    setTsResult(date);
  };

  const handleDateConvert = (val: string) => {
    setDateInput(val);
    if (!val) {
      setDateResult(null);
      return;
    }
    const date = new Date(val);
    if (isNaN(date.getTime())) {
      setDateResult(null);
      return;
    }
    setDateResult({
      sec: Math.floor(date.getTime() / 1000),
      ms: date.getTime()
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-8 cursor-pointer"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">{lang === 'ES' ? 'Volver' : lang === 'CA' ? 'Tornar' : 'Back'}</span>
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{dict.tools['epoch'].name}</h1>
        <p className="text-slate-600 dark:text-slate-400">{dict.tools['epoch'].desc}</p>
      </div>

      <div className="bg-white dark:bg-[#11161d] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Epoch actual (Segundos)</p>
            <p className="text-2xl font-mono font-bold text-slate-900 dark:text-white">{currentEpoch}</p>
          </div>
        </div>
        <button 
          onClick={() => copyToClipboard(currentEpoch.toString())}
          className="px-4 py-2 cursor-pointer bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors font-medium flex items-center gap-2"
        >
          <Copy size={16} /> Copiar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Timestamp to Date */}
        <div className="bg-white dark:bg-[#11161d] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <ArrowRight size={20} className="text-blue-500" />
            Timestamp a Fecha
          </h2>
          <input 
            type="number"
            value={tsInput}
            onChange={(e) => handleTsConvert(e.target.value)}
            placeholder="Ej: 1672531199"
            className="w-full bg-slate-50 dark:bg-[#0a0e17] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-500 mb-4"
          />
          {tsResult && (
            <div className="space-y-3 bg-slate-50 dark:bg-[#0a0e17] p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Local (Tu zona)</p>
                <p className="text-sm font-mono text-slate-900 dark:text-white">{tsResult.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">UTC / GMT</p>
                <p className="text-sm font-mono text-slate-900 dark:text-white">{tsResult.toUTCString()}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">ISO 8601</p>
                <p className="text-sm font-mono text-slate-900 dark:text-white">{tsResult.toISOString()}</p>
              </div>
            </div>
          )}
        </div>

        {/* Date to Timestamp */}
        <div className="bg-white dark:bg-[#11161d] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-emerald-500" />
            Fecha a Timestamp
          </h2>
          <input 
            type="datetime-local"
            value={dateInput}
            onChange={(e) => handleDateConvert(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0a0e17] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 mb-4"
          />
          {dateResult && (
            <div className="space-y-3 bg-slate-50 dark:bg-[#0a0e17] p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">Segundos</p>
                  <p className="text-sm font-mono text-slate-900 dark:text-white">{dateResult.sec}</p>
                </div>
                <button onClick={() => copyToClipboard(dateResult.sec.toString())} className="text-slate-400 hover:text-emerald-500 cursor-pointer">
                  <Copy size={16} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">Milisegundos</p>
                  <p className="text-sm font-mono text-slate-900 dark:text-white">{dateResult.ms}</p>
                </div>
                <button onClick={() => copyToClipboard(dateResult.ms.toString())} className="text-slate-400 hover:text-emerald-500 cursor-pointer">
                  <Copy size={16} />
                </button>
              </div>
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-500 mb-2">Offsets rápidos (desde ahora):</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => copyToClipboard((currentEpoch + 3600).toString())} className="px-3 py-1.5 cursor-pointer bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">+1 Hora</button>
              <button onClick={() => copyToClipboard((currentEpoch + 86400).toString())} className="px-3 py-1.5 cursor-pointer bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">+1 Día</button>
              <button onClick={() => copyToClipboard((currentEpoch + 604800).toString())} className="px-3 py-1.5 cursor-pointer bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">+7 Días</button>
              <button onClick={() => copyToClipboard((currentEpoch + 2592000).toString())} className="px-3 py-1.5 cursor-pointer bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">+30 Días</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
