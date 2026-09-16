import React from 'react';
import { Layers, Globe, Sparkles } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#0a0d14]/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold text-slate-100 leading-none">ATM Tools</span>
              <span className="bg-sky-500/20 text-sky-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-sky-500/30">PROD</span>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">v2.0</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5">ECOSYSTEM / TRUJILLOMINGORANCE.COM</span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-1 bg-[#0f172a]/70 p-1 rounded-lg border border-slate-800/80">
          <button className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-all">ATM Labs</button>
          <button className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-all">Studio</button>
          <button className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-all">Índice</button>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 text-xs font-medium text-sky-400 bg-sky-950/40 hover:bg-sky-900/40 px-3 py-1.5 rounded-full border border-sky-900/50 transition-all">
            <Sparkles size={14} />
            <span>Local AI</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
