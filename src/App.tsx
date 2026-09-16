import React, { useState, useMemo } from 'react';
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
import { Image, Eraser, FileText, Sun, Camera, Search, PenTool, Shield, Volume2, Key, Network, FileJson, ChevronDown, Filter } from 'lucide-react';

type ToolId = 'home' | 'converter' | 'bg-remover' | 'editor' | 'pdf' | 'scanner' | 'magnifier' | 'signature' | 'privacy' | 'reader' | 'crypto' | 'network' | 'json';
type FilterCategory = 'Todas' | 'Imagen' | 'PDF' | 'Seguridad' | 'Datos/Texto';

function App() {
  const [activeTool, setActiveTool] = useState<ToolId>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('Todas');

  const tools = [
    { id: 'bg-remover', name: 'Quitar Fondo', icon: Eraser, tags: ['IMAGEN', 'CLIENT-SIDE'], category: 'Imagen', desc: 'Borra el fondo de cualquier foto para dejar solo a la persona u objeto.' },
    { id: 'editor', name: 'Mejorar Foto', icon: Sun, tags: ['IMAGEN', 'CLIENT-SIDE'], category: 'Imagen', desc: 'Dale más luz, más color o pon tu foto en blanco y negro fácilmente.' },
    { id: 'converter', name: 'Cambiar Formato', icon: Image, tags: ['IMAGEN', 'CLIENT-SIDE'], category: 'Imagen', desc: 'Prepara tu foto para enviarla reduciendo su peso.' },
    { id: 'pdf', name: 'Documentos PDF', icon: FileText, tags: ['PDF', 'CLIENT-SIDE'], category: 'PDF', desc: 'Junta varios documentos en uno solo de forma sencilla.' },
    { id: 'scanner', name: 'Escanear', icon: Camera, tags: ['PDF', 'IMAGEN'], category: 'PDF', desc: 'Haz una foto a un documento y guárdalo como PDF.' },
    { id: 'magnifier', name: 'Lupa', icon: Search, tags: ['IMAGEN', 'ACCESO'], category: 'Imagen', desc: 'Acerca la letra pequeña de una foto para leerla bien.' },
    { id: 'signature', name: 'Crear Firma', icon: PenTool, tags: ['PDF', 'FIRMA'], category: 'PDF', desc: 'Firma con el dedo y guarda tu firma sin fondo.' },
    { id: 'privacy', name: 'Ocultar Datos', icon: Shield, tags: ['SEGURIDAD', 'CLIENT-SIDE'], category: 'Seguridad', desc: 'Tacha el DNI o caras de una foto antes de enviarla.' },
    { id: 'reader', name: 'Leer Texto', icon: Volume2, tags: ['TEXTO', 'ACCESO'], category: 'Datos/Texto', desc: 'Pega un texto largo y el ordenador te lo leerá en voz alta.' },
    { id: 'crypto', name: 'Cifrar Datos', icon: Key, tags: ['SEGURIDAD', 'CRYPTO'], category: 'Seguridad', desc: 'Hashes, JWT, Passphrases y Base64.' },
    { id: 'network', name: 'Redes / CIDR', icon: Network, tags: ['SYSADMIN', 'REDES'], category: 'Datos/Texto', desc: 'Calculadora de subredes IPv4 y CIDR.' },
    { id: 'json', name: 'Formato JSON', icon: FileJson, tags: ['DEV', 'FORMAT'], category: 'Datos/Texto', desc: 'Formateador y minificador JSON rápido.' },
  ] as const;

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            tool.desc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'Todas' || tool.category === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter, tools]);

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
      {activeTool === 'home' ? (
        <div className="max-w-6xl mx-auto px-6 pt-10 pb-16">
          <div className="mb-10">
            <span className="text-[11px] font-mono uppercase tracking-widest text-blue-500 mb-3 block">UTILIDADES Y HERRAMIENTAS WEB</span>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-3 tracking-tight">Herramientas de ingeniería y privacidad</h1>
            <p className="text-slate-400 text-[15px]">Procesamiento 100% client-side sin persistencia de datos ni telemetría externa.</p>
          </div>
          
          {/* Search and Filters Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 items-center bg-[#0f172a] border border-slate-800/80 p-2 rounded-xl">
            <div className="relative w-full flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text"
                placeholder="Buscar herramientas..."
                className="w-full bg-transparent pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none placeholder:text-slate-500"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="w-px h-6 bg-slate-800 hidden md:block"></div>
            
            <div className="flex items-center gap-3 w-full md:w-auto px-2">
              <div className="flex items-center gap-2 text-sm text-slate-400 shrink-0">
                <Filter size={14} />
                <span>Filtrar por:</span>
              </div>
              <div className="relative w-full md:w-40">
                <select
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value as FilterCategory)}
                  className="w-full appearance-none bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-sm text-slate-200 py-1.5 pl-3 pr-8 rounded-lg outline-none transition-colors cursor-pointer font-medium"
                >
                  <option value="Todas">Todas</option>
                  <option value="Imagen">Imagen</option>
                  <option value="PDF">PDF</option>
                  <option value="Seguridad">Seguridad</option>
                  <option value="Datos/Texto">Datos/Texto</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
          
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTools.map(tool => (
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
                    <h2 className="text-[15px] font-semibold text-slate-200 group-hover:text-blue-400 transition-colors leading-tight mb-1.5">{tool.name}</h2>
                    <div className="flex flex-wrap gap-1.5">
                      {tool.tags.map(tag => (
                         <span key={tag} className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/50">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mt-3">{tool.desc}</p>
              </button>
            ))}
            {filteredTools.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-500 text-sm">
                No se encontraron herramientas con esos criterios.
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
