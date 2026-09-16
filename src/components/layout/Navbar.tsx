import React, { useState, useRef, useEffect } from 'react';
import { Moon, Sun, ChevronDown } from 'lucide-react';
import { useAppConfig } from '../../utils/useAppConfig';

export function Navbar() {
  const { theme, setTheme, lang, setLang } = useAppConfig();
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [storageSize, setStorageSize] = useState('0');
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // calculate storage size
    let _lsTotal = 0, _xLen, _x;
    for (_x in localStorage) {
      if (!localStorage.hasOwnProperty(_x)) continue;
      _xLen = ((localStorage[_x].length + _x.length) * 2);
      _lsTotal += _xLen;
    }
    setStorageSize((_lsTotal / 1024).toFixed(2));
  }, [profileOpen]);

  const clearStorage = () => {
    const themeSave = localStorage.getItem('atm_theme');
    const langSave = localStorage.getItem('atm_lang');
    localStorage.clear();
    if (themeSave) localStorage.setItem('atm_theme', themeSave);
    if (langSave) localStorage.setItem('atm_lang', langSave);
    setStorageSize('0.00');
  };

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
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
            id="lang-selector"
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
          id="theme-toggle"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800/60 border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="h-5 w-px bg-slate-300 dark:bg-slate-800 mx-1"></div>

        {/* User Profile */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="bg-blue-100 dark:bg-blue-600/20 hover:bg-blue-200 dark:hover:bg-blue-600/30 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[9px] font-bold text-white uppercase">
              AT
            </div>
            <span>Alberto</span>
          </button>
          
          {profileOpen && (
            <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden py-3 z-50">
              <div className="px-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Perfil Activo</p>
                <p className="text-xs text-slate-500 mt-0.5">Ingeniero de Plataforma</p>
              </div>
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Almacenamiento Local</span>
                    <span className="text-xs font-mono text-blue-500">{storageSize} KB</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full" style={{ width: `${Math.min(100, Math.max(1, (parseFloat(storageSize) / 5000) * 100))}%` }}></div>
                  </div>
                </div>
                <button 
                  onClick={clearStorage}
                  className="w-full py-1.5 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-medium rounded-lg transition-colors"
                >
                  Limpiar Datos Locales
                </button>
              </div>
              <div className="px-2 pt-2">
                <a href="https://docs.trujillomingorance.com" target="_blank" rel="noopener noreferrer" className="block w-full text-center py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors font-medium">
                  Abrir ATM DOCS
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
