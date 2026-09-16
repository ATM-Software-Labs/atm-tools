import React from 'react';
import { Home } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1f2937] bg-[#030712] h-14 flex items-center px-4 md:px-6">
      <div className="flex items-center justify-between w-full max-w-[1200px] mx-auto">
        <a href="/" className="flex items-center gap-3 no-underline text-white hover:opacity-80 transition-opacity">
          <img src="/avatar.png" alt="" className="w-7 h-7 rounded-full" />
          <span className="font-semibold text-[15px] tracking-tight">ATM Tools</span>
        </a>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.location.reload()} 
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#1f2937]/50 hover:bg-[#1f2937] text-gray-300 transition-colors text-sm font-medium"
          >
            <Home size={16} />
            <span>Inicio</span>
          </button>
        </div>
      </div>
    </header>
  );
}
