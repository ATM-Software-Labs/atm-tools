import React, { useState, useRef, useEffect } from 'react';
import { Moon, Sun, ChevronDown } from 'lucide-react';
import { useAppConfig } from '../../utils/useAppConfig';

export function Navbar() {
  const { theme, setTheme, lang, setLang } = useAppConfig();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full h-16 bg-[#0a0e17]/90 dark:bg-[#0a0e17]/90 bg-white/90 backdrop-blur-md border-b border-slate-800 dark:border-slate-800 border-slate-200 flex items-center px-6">
      <a href="/" className="flex items-center gap-3 no-underline text-white hover:opacity-90 transition-opacity">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600 dark:text-blue-500">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="font-semibold text-sm tracking-wide uppercase text-slate-900 dark:text-slate-100">ATM TOOLS</span>
      </a>
      
      <div className="flex items-center gap-4 ml-auto">
        {/* Language Selector */}
        <div className="relative" ref={langRef}>
          <button 
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors text-sm font-medium"
          >
            <svg width="16" height="12" viewBox="0 0 640 480" className="rounded-sm">
              <rect width="640" height="480" fill={lang === 'ES' ? "#c60b1e" : "#012169"} />
              {lang === 'ES' && <rect width="640" height="240" y="120" fill="#ffc400" />}
              {lang === 'EN' && (
                <>
                  <path d="M0,0 L640,480 M640,0 L0,480" stroke="#fff" strokeWidth="60" />
                  <path d="M0,0 L640,480 M640,0 L0,480" stroke="#C8102E" strokeWidth="40" />
                  <path d="M320,0 L320,480 M0,240 L640,240" stroke="#fff" strokeWidth="120" />
                  <path d="M320,0 L320,480 M0,240 L640,240" stroke="#C8102E" strokeWidth="80" />
                </>
              )}
            </svg>
            {lang}
            <ChevronDown size={14} className="text-slate-500" />
          </button>
          
          {langOpen && (
            <div className="absolute top-full right-0 mt-2 w-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl overflow-hidden py-1">
              <button onClick={() => { setLang('ES'); setLangOpen(false); }} className="w-full text-left px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">ES</button>
              <button onClick={() => { setLang('EN'); setLangOpen(false); }} className="w-full text-left px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">EN</button>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800/60 border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="h-5 w-px bg-slate-300 dark:bg-slate-800 mx-1"></div>

        {/* User Profile */}
        <div className="bg-blue-100 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[9px] font-bold text-white uppercase">
            AT
          </div>
          <span>Alberto</span>
        </div>
      </div>
    </header>
  );
}
