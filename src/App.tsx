import React, { useState, useMemo, useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { UniversalConverter } from './components/tools/UniversalConverter';
import { BackgroundRemover } from './components/tools/BackgroundRemover';
import { QuickEditor } from './components/tools/QuickEditor';
import { PdfManager } from './components/tools/PdfManager';
import { Scanner } from './components/tools/Scanner';
import { Magnifier } from './components/tools/Magnifier';
import { SignaturePad } from './components/tools/SignaturePad';
import { PrivacyBlur } from './components/tools/PrivacyBlur';
import { TextReader } from './components/tools/TextReader';
import { DataCrypto } from './components/tools/DataCrypto';
import { NetworkCalc } from './components/tools/NetworkCalc';
import { JsonTools } from './components/tools/JsonTools';
import { CommandPalette } from './components/ui/CommandPalette';
import { Image, Eraser, FileText, Sun, Camera, Search, PenTool, Shield, Volume2, Key, Network, FileJson, ChevronDown, Filter, Command } from 'lucide-react';
import { useAppConfig } from './utils/useAppConfig';
import { i18n } from './utils/i18n';

type ToolId = 'home' | 'converter' | 'bg-remover' | 'editor' | 'pdf' | 'scanner' | 'magnifier' | 'signature' | 'privacy' | 'reader' | 'crypto' | 'network' | 'json';
type FilterCategory = 'Todas' | 'Imagen' | 'PDF' | 'Seguridad' | 'Datos/Texto' | 'All' | 'Image' | 'Security' | 'Data/Text';

function App() {
  const [activeTool, setActiveTool] = useState<ToolId>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('Todas');
  const [cmdOpen, setCmdOpen] = useState(false);
  const { lang } = useAppConfig();
  const dict = i18n[lang];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(o => !o);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const tools = [
    { id: 'bg-remover', icon: Eraser, tags: ['IMAGEN', 'CLIENT-SIDE'], category: 'Imagen' },
    { id: 'editor', icon: Sun, tags: ['IMAGEN', 'CLIENT-SIDE'], category: 'Imagen' },
    { id: 'converter', icon: Image, tags: ['IMAGEN', 'CLIENT-SIDE'], category: 'Imagen' },
    { id: 'pdf', icon: FileText, tags: ['PDF', 'CLIENT-SIDE'], category: 'PDF' },
    { id: 'scanner', icon: Camera, tags: ['PDF', 'IMAGEN'], category: 'PDF' },
    { id: 'magnifier', icon: Search, tags: ['IMAGEN', 'ACCESO'], category: 'Imagen' },
    { id: 'signature', icon: PenTool, tags: ['PDF', 'FIRMA'], category: 'PDF' },
    { id: 'privacy', icon: Shield, tags: ['SEGURIDAD', 'CLIENT-SIDE'], category: 'Seguridad' },
    { id: 'reader', icon: Volume2, tags: ['TEXTO', 'ACCESO'], category: 'Datos/Texto' },
    { id: 'crypto', icon: Key, tags: ['SEGURIDAD', 'CRYPTO'], category: 'Seguridad' },
    { id: 'network', icon: Network, tags: ['SYSADMIN', 'REDES'], category: 'Datos/Texto' },
    { id: 'json', icon: FileJson, tags: ['DEV', 'FORMAT'], category: 'Datos/Texto' },
  ] as const;

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const toolDict = dict.tools[tool.id as keyof typeof dict.tools];
      const matchesSearch = toolDict.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            toolDict.desc.toLowerCase().includes(searchQuery.toLowerCase());
      
      const isAll = activeFilter === 'Todas' || activeFilter === 'All';
      // simple hack for bi-lingual categories matching
      const catMatch = isAll || tool.category === activeFilter || dict.categories[i18n['ES'].categories.indexOf(tool.category)] === activeFilter;
      
      return matchesSearch && catMatch;
    });
  }, [searchQuery, activeFilter, tools, dict]);

  const renderTool = () => {
    switch (activeTool) {
      case 'converter': return <UniversalConverter onBack={() => setActiveTool('home')} />;
      case 'bg-remover': return <BackgroundRemover onBack={() => setActiveTool('home')} />;
      case 'editor': return <QuickEditor onBack={() => setActiveTool('home')} />;
      case 'pdf': return <PdfManager onBack={() => setActiveTool('home')} />;
      case 'scanner': return <Scanner onBack={() => setActiveTool('home')} />;
      case 'magnifier': return <Magnifier onBack={() => setActiveTool('home')} />;
      case 'signature': return <SignaturePad onBack={() => setActiveTool('home')} />;
      case 'privacy': return <PrivacyBlur onBack={() => setActiveTool('home')} />;
      case 'reader': return <TextReader onBack={() => setActiveTool('home')} />;
      case 'crypto': return <DataCrypto onBack={() => setActiveTool('home')} />;
      case 'network': return <NetworkCalc onBack={() => setActiveTool('home')} />;
      case 'json': return <JsonTools onBack={() => setActiveTool('home')} />;
      default: return null;
    }
  };

  return (
    <Layout>
      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} onSelect={(id) => setActiveTool(id as ToolId)} tools={[...tools]} />
      {activeTool === 'home' ? (
        <div className="max-w-6xl mx-auto px-6 pt-10 pb-16">
          <div className="mb-10">
            <span className="text-[11px] font-mono uppercase tracking-widest text-blue-500 mb-3 block">{dict.supra}</span>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-3 tracking-tight">{dict.title}</h1>
            <p className="text-slate-400 text-[15px]">{dict.subtitle}</p>
          </div>
          
          {/* Search and Filters Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 items-center bg-[#0f172a] border border-slate-800/80 p-2 rounded-xl">
            <div className="relative w-full flex-1 flex items-center">
              <Search className="absolute left-3.5 text-slate-500" size={16} />
              <input 
                type="text"
                placeholder={dict.searchPlaceholder}
                className="w-full bg-transparent pl-10 pr-12 py-2 text-sm text-slate-200 focus:outline-none placeholder:text-slate-500"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button 
                className="absolute right-2 flex items-center gap-1 text-[10px] font-mono bg-slate-800 text-slate-400 px-1.5 py-1 rounded hover:bg-slate-700 transition-colors"
                onClick={() => setCmdOpen(true)}
              >
                <Command size={12} /> K
              </button>
            </div>
            
            <div className="w-px h-6 bg-slate-800 hidden md:block"></div>
            
            <div className="flex items-center gap-3 w-full md:w-auto px-2">
              <div className="flex items-center gap-2 text-sm text-slate-400 shrink-0">
                <Filter size={14} />
                <span>{dict.filterBy}</span>
              </div>
              <div className="relative w-full md:w-40">
                <select
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value as FilterCategory)}
                  className="w-full appearance-none bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-sm text-slate-200 py-1.5 pl-3 pr-8 rounded-lg outline-none transition-colors cursor-pointer font-medium"
                >
                  {dict.categories.map((cat, i) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
          
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTools.map(tool => {
              const toolDict = dict.tools[tool.id as keyof typeof dict.tools];
              return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id as ToolId)}
                className="flex flex-col p-5 bg-[#0f172a]/50 hover:bg-slate-900/40 border border-slate-800/80 hover:border-blue-500/50 rounded-xl transition-all duration-200 text-left group"
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-inner">
                    <tool.icon size={20} />
                  </div>
                  <div className="flex flex-col flex-1 mt-0.5">
                    <h2 className="text-[15px] font-semibold text-slate-200 group-hover:text-blue-400 transition-colors leading-tight mb-1.5">{toolDict.name}</h2>
                    <div className="flex flex-wrap gap-1.5">
                      {tool.tags.map(tag => (
                         <span key={tag} className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/50">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mt-3">{toolDict.desc}</p>
              </button>
            )})}
            {filteredTools.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-500 text-sm">
                {dict.noResults}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-6 pt-8 pb-16">
          {renderTool()}
        </div>
      )}
    </Layout>
  );
}

export default App;
