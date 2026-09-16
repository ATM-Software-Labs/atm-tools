import React from 'react';
import { Home, Moon, Sun, Globe } from 'lucide-react';

export function Navbar() {
  const [theme, setTheme] = React.useState<'dark' | 'light'>('dark');
  const [lang, setLang] = React.useState<'ES' | 'EN'>('ES');

  return (
    <header className="sticky top-0 z-50 w-full h-16 bg-[#0b1329]/90 backdrop-blur-md border-b border-slate-800 flex items-center px-6">
      <a href="/" className="flex items-center gap-3 no-underline text-white hover:opacity-90 transition-opacity">
        <div className="w-8 h-8 rounded bg-white flex items-center justify-center">
          <span className="text-[#0b1329] font-bold text-sm tracking-tighter">ATM</span>
        </div>
        <span className="font-bold text-sm tracking-[0.08em] uppercase">ATM Tools</span>
      </a>
      
      <div className="flex items-center gap-4 ml-auto">
        <button 
          onClick={() => setLang(lang === 'ES' ? 'EN' : 'ES')}
          className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-xs font-semibold"
        >
          <Globe size={16} />
          {lang}
        </button>
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-slate-300 hover:text-white transition-colors p-1"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="h-6 w-px bg-slate-800 mx-1"></div>
        <div className="flex items-center gap-2 bg-slate-800/50 py-1.5 px-3 rounded-full border border-slate-700/50">
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
            AT
          </div>
          <span className="text-sm font-medium text-slate-200">Alberto</span>
        </div>
      </div>
    </header>
  );
}
