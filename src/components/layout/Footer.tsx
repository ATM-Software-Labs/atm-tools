import React from 'react';

export function Footer() {
  return (
    <footer className="w-full border-t border-[#1f2937] bg-[#030712] py-8 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 max-w-[1200px]">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <span>&copy; {new Date().getFullYear()} Alberto Trujillo Mingorance</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://trujillomingorance.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
            ATM Labs
          </a>
          <span>&middot;</span>
          <a href="https://guides.trujillomingorance.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
            ATM Docs
          </a>
        </div>
      </div>
    </footer>
  );
}
