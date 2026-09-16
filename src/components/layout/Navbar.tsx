import React, { useState, useRef, useEffect } from 'react';
import { Moon, Sun, ChevronDown } from 'lucide-react';
import { useAppConfig } from '../../utils/useAppConfig';

export function Navbar() {
  const { theme, setTheme, lang, setLang } = useAppConfig();
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
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
    <header className="sticky top-0 z-50 w-full h-16 bg-white/80 dark:bg-[#0a0e17]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center px-6">
      <a href="/" className="flex items-center gap-3 no-underline hover:opacity-90 transition-opacity">
        <img src="/avatar.png" alt="" className="w-7 h-7 rounded-full border border-slate-200 dark:border-slate-700" width="28" height="28" />
        <span className="text-[13.5px] font-extrabold tracking-[0.14em] uppercase text-slate-900 dark:text-[#f8fafc]">ATM TOOLS</span>
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
            <div className="absolute top-full right-0 mt-2 w-32 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-lg py-1 shadow-xl z-50">
              <button onClick={() => {
                setLang('ES');
                document.documentElement.lang = 'es';
                localStorage.setItem('atm_lang', 'ES');
                setLangOpen(false);
              }} className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors">
                <span>🇪🇸</span> Español
              </button>
              <button onClick={() => {
                setLang('EN');
                document.documentElement.lang = 'en';
                localStorage.setItem('atm_lang', 'EN');
                setLangOpen(false);
              }} className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors">
                <span>🇬🇧</span> English
              </button>
              <button onClick={() => {
                setLang('CA');
                document.documentElement.lang = 'ca';
                localStorage.setItem('atm_lang', 'CA');
                setLangOpen(false);
              }} className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors">
                <span>🏴</span> Català
              </button>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button 
          id="theme-toggle"
          onClick={() => {
            const html = document.documentElement;
            let newTheme: 'dark' | 'light' = 'dark';
            if (html.classList.contains('dark')) {
              html.classList.remove('dark');
              html.classList.add('light');
              newTheme = 'light';
            } else {
              html.classList.add('dark');
              html.classList.remove('light');
              newTheme = 'dark';
            }
            localStorage.setItem('atm_theme', newTheme);
            setTheme(newTheme);
          }}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-300 dark:border-[#1f2937] text-slate-600 dark:text-[#94a3b8] transition-colors bg-transparent cursor-pointer"
        >
          {theme === 'dark' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        <div className="h-5 w-px bg-slate-300 dark:bg-slate-800 mx-1"></div>

        {/* User Profile */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 bg-white dark:bg-[#11161d] border border-slate-300 dark:border-[#1f2937] rounded-full pl-1 pr-3 py-1 cursor-pointer transition-colors hover:border-blue-500"
          >
            <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[11px] font-bold text-white uppercase">
              {isGuest ? 'G' : 'A'}
            </span>
            <span className="text-[13px] font-medium text-slate-900 dark:text-[#f8fafc]">{isGuest ? 'Invitado' : 'Alberto'}</span>
          </button>
          
          {profileOpen && (
            <div className="absolute top-full right-0 mt-2 w-60 bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-slate-800/80 rounded-xl p-3 shadow-2xl text-xs backdrop-blur-md z-50">
              <div className="flex items-center gap-3">
                <span className="bg-blue-600 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center">
                  {isGuest ? 'GU' : 'AT'}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{isGuest ? 'Usuario Invitado' : 'Alberto Trujillo'}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{isGuest ? 'Sin sesión' : 'Plataforma & Dev'}</p>
                </div>
              </div>
              
              <div className="border-t border-slate-200 dark:border-slate-800/80 my-2.5"></div>
              
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
                  <span className="text-slate-600 dark:text-slate-400">Almacenamiento Local</span>
                </div>
                <span className="font-mono text-blue-600 dark:text-blue-400">{storageSize} KB</span>
              </div>
              
              <button 
                onClick={clearStorage}
                className="text-left w-full text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors py-1 cursor-pointer"
              >
                Limpiar almacenamiento
              </button>

              <div className="border-t border-slate-200 dark:border-slate-800/80 my-2.5"></div>
              
              <div className="flex flex-col">
                <a href="https://guides.trujillomingorance.com" target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-1 flex items-center justify-between">
                  <span>ATM DOCS</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </a>
                <button 
                  onClick={() => {
                    if (!isGuest) {
                      clearStorage();
                      setIsGuest(true);
                    } else {
                      setIsGuest(false);
                    }
                    setProfileOpen(false);
                  }}
                  className="w-full text-left text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-1"
                >
                  {isGuest ? 'Iniciar sesión' : 'Cerrar sesión'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
