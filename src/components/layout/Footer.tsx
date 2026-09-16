import React from 'react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/50 bg-[#0a0d14] py-12 mt-auto">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-6">
        <a 
          href="https://trujillomingorance.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-2xl font-serif text-slate-300 hover:text-sky-400 transition-colors"
        >
          trujillomingorance.com
        </a>
        <p className="text-lg text-slate-500">
          Herramientas gratuitas y fáciles de usar.
        </p>
      </div>
    </footer>
  );
}
