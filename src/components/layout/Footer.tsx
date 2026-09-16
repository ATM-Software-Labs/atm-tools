import React from 'react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 bg-[#0b1329] py-8 mt-auto flex flex-col items-center justify-center gap-4 text-sm text-slate-400 text-center">
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
