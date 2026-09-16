import React from 'react';
import { Moon, Sun, ChevronDown } from 'lucide-react';

export function Navbar() {
  const [theme, setTheme] = React.useState<'dark' | 'light'>('dark');

  return (
    <header className="sticky top-0 z-50 w-full h-16 bg-[#0a0e17]/90 backdrop-blur-md border-b border-slate-800 flex items-center px-6">
      <a href="/" className="flex items-center gap-3 no-underline text-white hover:opacity-90 transition-opacity">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="font-semibold text-sm tracking-wide uppercase text-slate-100">ATM TOOLS</span>
      </a>
      
      <div className="flex items-center gap-4 ml-auto">
        {/* Language Selector */}
        <button className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors text-sm font-medium">
          <svg width="16" height="12" viewBox="0 0 640 480" className="rounded-sm">
            <rect width="640" height="480" fill="#c60b1e" />
            <rect width="640" height="240" y="120" fill="#ffc400" />
          </svg>
          ES
          <ChevronDown size={14} className="text-slate-500" />
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800/60 border border-slate-800 text-slate-400 transition-colors"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="h-5 w-px bg-slate-800 mx-1"></div>

        {/* User Profile */}
        <div className="bg-blue-600/20 border border-blue-500/30 text-blue-400 px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[9px] font-bold text-white uppercase">
            AT
          </div>
          <span>Alberto</span>
        </div>
      </div>
    </header>
  );
}
