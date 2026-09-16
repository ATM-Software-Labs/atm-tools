import React from 'react';
import { Home } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800/50 bg-[#0a0d14]/90 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          {/* Logo Minimalista de Trujillo Mingorance */}
          <img src="/avatar.png" alt="Trujillo Mingorance Logo" className="w-10 h-10 rounded-full border border-slate-700/50" />
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-medium text-slate-100 tracking-wide">Trujillo Mingorance</span>
            <span className="text-sm text-sky-400 font-medium">Herramientas</span>
          </div>
        </a>
        
        <button 
          onClick={() => window.location.reload()} 
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 hover:bg-slate-700 text-slate-200 transition-colors"
        >
          <Home size={20} />
          <span className="text-lg">Inicio</span>
        </button>
      </div>
    </nav>
  );
}
