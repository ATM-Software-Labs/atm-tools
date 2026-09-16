import React from 'react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#0a0d14] py-8 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm font-mono text-slate-500">
          &copy; 2026 ATM Software Labs
        </p>
        
        <div className="flex items-center gap-2">
          <a href="#" className="px-3 py-1.5 rounded-full bg-[#0f172a] border border-slate-800/80 text-xs text-slate-400 hover:text-sky-400 hover:border-sky-900/50 transition-all">Índice</a>
          <a href="#" className="px-3 py-1.5 rounded-full bg-[#0f172a] border border-slate-800/80 text-xs text-slate-400 hover:text-sky-400 hover:border-sky-900/50 transition-all">Studio</a>
          <a 
            href="https://trujillomingorance.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-full bg-sky-950/30 border border-sky-900/50 text-xs text-sky-400 hover:bg-sky-900/50 hover:text-sky-300 transition-all"
          >
            trujillomingorance.com
          </a>
        </div>
      </div>
    </footer>
  );
}
