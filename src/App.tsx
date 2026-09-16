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
import { Web3Tools } from './components/tools/Web3Tools';
import { UuidGenerator } from './components/tools/UuidGenerator';
import { EpochConverter } from './components/tools/EpochConverter';
import { CommandPalette } from './components/ui/CommandPalette';
import { Image, Eraser, FileText, Sun, Camera, Search, PenTool, Shield, Volume2, Key, Network, FileJson, ChevronDown, Filter, Command, Bitcoin, Clock, Hash } from 'lucide-react';
import { useAppConfig } from './utils/useAppConfig';
import { i18n } from './utils/i18n';

type ToolId = 'home' | 'converter' | 'bg-remover' | 'editor' | 'pdf' | 'scanner' | 'magnifier' | 'signature' | 'privacy' | 'reader' | 'crypto' | 'network' | 'json' | 'web3' | 'uuid' | 'epoch';
type FilterCategory = 'Todas' | 'Imagen' | 'PDF' | 'Seguridad' | 'Datos/Texto' | 'Web3' | 'All' | 'Image' | 'Security' | 'Data/Text';

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
    { id: 'uuid', icon: Hash, tags: ['DEV', 'CLIENT-SIDE'], category: 'Datos/Texto' },
    { id: 'epoch', icon: Clock, tags: ['DEV', 'CLIENT-SIDE'], category: 'Datos/Texto' },
    { id: 'web3', icon: Bitcoin, tags: ['WEB3', 'CRYPTO'], category: 'Web3' },
  ] as const;

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const toolDict = dict.tools[tool.id as keyof typeof dict.tools];
      const matchesSearch = toolDict.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            toolDict.desc.toLowerCase().includes(searchQuery.toLowerCase());
      
      const isAll = activeFilter === 'Todas' || activeFilter === 'All';
      // simple hack for bi-lingual categories matching
      const catMatch = isAll || tool.category === activeFilter || (i18n['ES'].categories.indexOf(tool.category) > -1 && dict.categories[i18n['ES'].categories.indexOf(tool.category)] === activeFilter);
      
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
      case 'uuid': return <UuidGenerator onBack={() => setActiveTool('home')} />;
      case 'epoch': return <EpochConverter onBack={() => setActiveTool('home')} />;
      case 'web3': return <Web3Tools onBack={() => setActiveTool('home')} />;
      default: return null;
    }
  };

  return (
    <Layout>
      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} onSelect={(id) => setActiveTool(id as ToolId)} tools={[...tools]} />
      {activeTool === 'home' ? (
        <div className="max-w-6xl mx-auto px-6 pt-10 pb-16">
          {/* Header trujillo-guides mirror */}
          <div className="text-left pt-3 pb-7 bg-transparent border-0">
            <p className="text-xs tracking-[0.12em] uppercase text-slate-500 font-semibold mb-3">{dict.supra}</p>
            <h1 className="text-[2.2rem] leading-[1.1] font-extrabold tracking-[-0.04em] text-slate-900 dark:text-slate-50 mb-4">{dict.title}</h1>
            <p className="text-[1.1rem] leading-relaxed text-slate-600 dark:text-slate-400 max-w-[640px]">{dict.subtitle}</p>
          </div>

          {/* Controls Bar trujillo-guides mirror */}
          <div className="block mb-6">
            <label className="block w-full">
              <input 
                type="search" 
                placeholder={dict.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
                spellCheck="false"
                className="w-full max-w-full bg-white dark:bg-[#11161d] border border-slate-300 dark:border-[#1f2937] text-slate-900 dark:text-[#f8fafc] placeholder:text-slate-400 dark:placeholder:text-slate-500 text-base px-4 py-3 rounded-xl shadow-sm focus:outline-none focus:border-blue-600 transition-colors"
              />
            </label>
          </div>

          {(searchQuery !== '' || (activeFilter !== 'Todas' && activeFilter !== 'All')) ? (
            <>
              <p className="text-xs tracking-wider uppercase text-slate-400 font-bold mb-4 border-b border-slate-200 dark:border-slate-800/60 pb-2">
                {lang === 'ES' ? 'RESULTADOS DE BÚSQUEDA' : 'SEARCH RESULTS'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTools.map((tool) => {
                  const toolDict = dict.tools[tool.id as keyof typeof dict.tools];
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setActiveTool(tool.id as ToolId)}
                      className="group flex items-start text-left bg-white dark:bg-[#11161d] border border-slate-200/80 dark:border-[#1f2937] p-[22px] rounded-[18px] transition-all hover:border-blue-500/50 shadow-sm relative overflow-hidden"
                    >
                      <div className="w-10 h-10 shrink-0 bg-blue-600 rounded-full flex items-center justify-center mr-4 text-white font-bold text-[13px] tracking-wide relative">
                        <Icon size={18} strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[1.05rem] font-bold text-slate-900 dark:text-[#f8fafc] tracking-[-0.02em] mb-1.5 truncate">
                          {toolDict.name}
                        </h3>
                        <p className="text-[0.92rem] text-slate-600 dark:text-[#94a3b8] mb-3 line-clamp-2 leading-relaxed">
                          {toolDict.desc}
                        </p>
                        <div className="flex items-center gap-1.5 mt-auto">
                          {tool.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 rounded-full text-[0.65rem] font-bold tracking-wider bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 uppercase">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </button>
                  );
                })}
                {filteredTools.length === 0 && (
                  <div className="col-span-full text-center py-12 text-slate-500 text-sm">
                    {dict.noResults}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-10">
              {[
                { title: lang === 'ES' ? 'IMAGEN Y MULTIMEDIA' : 'IMAGE AND MULTIMEDIA', tools: ['bg-remover', 'editor', 'converter', 'scanner', 'magnifier'] },
                { title: lang === 'ES' ? 'DOCUMENTOS Y TEXTO' : 'DOCUMENTS AND TEXT', tools: ['pdf', 'signature', 'privacy', 'reader'] },
                { title: lang === 'ES' ? 'INGENIERÍA, REDES Y DEV' : 'ENGINEERING, NETWORKS AND DEV', tools: ['network', 'json', 'uuid', 'epoch'] },
                { title: lang === 'ES' ? 'SEGURIDAD Y WEB3' : 'SECURITY AND WEB3', tools: ['crypto', 'web3'] }
              ].map(section => (
                <div key={section.title}>
                  <p className="text-xs tracking-wider uppercase text-slate-400 font-bold mb-4 border-b border-slate-200 dark:border-slate-800/60 pb-2">
                    {section.title}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {section.tools.map(toolId => {
                      const tool = tools.find(t => t.id === toolId);
                      if (!tool) return null;
                      const toolDict = dict.tools[tool.id as keyof typeof dict.tools];
                      const Icon = tool.icon;
                      return (
                        <button
                          key={tool.id}
                          onClick={() => setActiveTool(tool.id as ToolId)}
                          className="group flex items-start text-left bg-white dark:bg-[#11161d] border border-slate-200/80 dark:border-[#1f2937] p-[22px] rounded-[18px] transition-all hover:border-blue-500/50 shadow-sm relative overflow-hidden"
                        >
                          <div className="w-10 h-10 shrink-0 bg-blue-600 rounded-full flex items-center justify-center mr-4 text-white font-bold text-[13px] tracking-wide relative">
                            <Icon size={18} strokeWidth={2.5} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-[1.05rem] font-bold text-slate-900 dark:text-[#f8fafc] tracking-[-0.02em] mb-1.5 truncate">
                              {toolDict.name}
                            </h3>
                            <p className="text-[0.92rem] text-slate-600 dark:text-[#94a3b8] mb-3 line-clamp-2 leading-relaxed">
                              {toolDict.desc}
                            </p>
                            <div className="flex items-center gap-1.5 mt-auto">
                              {tool.tags.map(tag => (
                                <span key={tag} className="px-2 py-0.5 rounded-full text-[0.65rem] font-bold tracking-wider bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 uppercase">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
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
