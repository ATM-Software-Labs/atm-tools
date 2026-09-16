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
import { Image, Eraser, FileText, Sun, Camera, Search, PenTool, Shield, Volume2, Key, Network, FileJson } from 'lucide-react';

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
    { id: 'magnifier', name: 'Lupa', icon: Search, tags: ['IMAGEN', 'ACCESIBILIDAD'], category: 'Imagen', desc: 'Acerca la letra pequeña de una foto para leerla bien.' },
    { id: 'signature', name: 'Crear Firma', icon: PenTool, tags: ['PDF', 'FIRMA'], category: 'PDF', desc: 'Firma con el dedo y guarda tu firma sin fondo.' },
    { id: 'privacy', name: 'Ocultar Datos', icon: Shield, tags: ['SEGURIDAD', 'CLIENT-SIDE'], category: 'Seguridad', desc: 'Tacha el DNI o caras de una foto antes de enviarla.' },
    { id: 'reader', name: 'Leer Texto', icon: Volume2, tags: ['TEXTO', 'ACCESIBILIDAD'], category: 'Datos/Texto', desc: 'Pega un texto largo y el ordenador te lo leerá en voz alta.' },
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

  const categories: FilterCategory[] = ['Todas', 'Imagen', 'PDF', 'Seguridad', 'Datos/Texto'];

  return (
    <Layout>
      {activeTool === 'home' ? (
        <div className="max-w-7xl mx-auto pt-8">
          <div className="mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-500 mb-4 block">UTILIDADES Y HERRAMIENTAS WEB</span>
            <h1 className="text-4xl font-bold text-white mb-4">Herramientas de ingeniería y privacidad</h1>
            <p className="text-lg text-slate-400">Procesamiento 100% client-side sin persistencia de datos ni telemetría externa.</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-10 items-start md:items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text"
                placeholder="Buscar herramientas..."
                className="w-full bg-[#0b1329] border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
                    activeFilter === cat 
                      ? 'bg-blue-600/10 border-blue-500 text-blue-400' 
                      : 'bg-transparent border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map(tool => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id as ToolId)}
                className="flex flex-col p-6 bg-[#0b1329] hover:bg-[#0f172a] border border-slate-850 hover:border-slate-700 rounded-2xl transition-all text-left group hover:ring-1 hover:ring-blue-500/30"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <tool.icon size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{tool.name}</h2>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tool.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-slate-800/50 text-slate-400 border border-slate-700/50">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{tool.desc}</p>
              </button>
            ))}
            {filteredTools.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-500">
                No se encontraron herramientas con esos criterios.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto">
          {renderTool()}
        </div>
      )}
    </Layout>
  );
}

export default App;
