import React, { useState, useEffect } from 'react';

export function Footer() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return (
    <footer className="w-full border-t border-slate-800 bg-[#0a0e17] py-8 mt-auto flex flex-col items-center justify-center gap-4 text-sm text-slate-400 text-center">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-slate-500'}`}></div>
        <span className="text-xs uppercase tracking-widest font-mono text-slate-500">
          {isOnline ? '100% Offline Ready / Client-Side' : 'Modo Offline Activo'}
        </span>
      </div>
      <p>© 2026 ATM Software Labs. Todos los derechos reservados.</p>
      <nav className="flex items-center gap-6 font-medium">
        <a href="/" className="text-blue-500 hover:text-blue-400 transition-colors no-underline">
          Índice
        </a>
        <a href="https://ai.trujillomingorance.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 transition-colors no-underline">
          Studio
        </a>
      </nav>
    </footer>
  );
}
